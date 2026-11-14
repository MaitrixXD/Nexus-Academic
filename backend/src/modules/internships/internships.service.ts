import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PostingStatus } from '@prisma/client';

@Injectable()
export class InternshipsService {
  constructor(private prisma: PrismaService) {}

  // ── List with search/filter/pagination ──
  async findAll(query: {
    skills?: string; location?: string; stipendMin?: number; stipendMax?: number;
    duration?: string; jobType?: string; page?: number; limit?: number; search?: string;
  }) {
    const { skills, location, stipendMin, stipendMax, duration, jobType, search } = query;
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = { status: PostingStatus.ACTIVE };
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (jobType) where.jobType = jobType;
    if (stipendMin) where.stipend = { gte: Number(stipendMin) };
    if (stipendMax) where.stipend = { ...where.stipend, lte: Number(stipendMax) };
    if (skills) {
      const skillArr = skills.split(',').map(s => s.trim());
      where.requiredSkills = { hasSome: skillArr };
    }
    if (duration) where.duration = { contains: duration, mode: 'insensitive' };

    const [postings, total] = await Promise.all([
      this.prisma.jobPosting.findMany({
        where,
        include: { industry: { select: { companyName: true, logoUrl: true, location: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.jobPosting.count({ where }),
    ]);

    return {
      data: postings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async findOne(id: string) {
    const posting = await this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        industry: {
          select: { id: true, companyName: true, logoUrl: true, bannerUrl: true, description: true, location: true, website: true }
        },
        _count: { select: { applications: true } }
      }
    });
    if (!posting) throw new NotFoundException('Posting not found');
    return posting;
  }

  async create(industryUserId: string, dto: any) {
    const industry = await this.prisma.industryProfile.findUnique({ where: { userId: industryUserId } });
    if (!industry) throw new NotFoundException('Industry profile not found');
    return this.prisma.jobPosting.create({
      data: { ...dto, industryId: industry.id, requiredSkills: dto.requiredSkills || [] }
    });
  }

  async update(id: string, dto: any) {
    return this.prisma.jobPosting.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.jobPosting.update({ where: { id }, data: { status: PostingStatus.CLOSED } });
    return { message: 'Posting closed' };
  }

  // ── Apply ──
  async apply(studentUserId: string, postingId: string, dto: { coverLetter?: string }) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
    if (!student) throw new NotFoundException('Student profile not found');

    const posting = await this.prisma.jobPosting.findUnique({
      where: { id: postingId },
      include: { industry: true }
    });
    if (!posting) throw new NotFoundException('Posting not found');

    // Compute match score using skill overlap
    const skillProfile = await this.prisma.skillProfile.findUnique({
      where: { studentId: student.id },
      include: { skillScores: { include: { category: true } } }
    });

    let matchScore = 50; // default if no profile
    if (skillProfile && posting.requiredSkills.length > 0) {
      const studentSkillNames = skillProfile.skillScores.map(ss => ss.category.name.toLowerCase());
      const requiredSkillNames = posting.requiredSkills.map(s => s.toLowerCase());
      const matches = requiredSkillNames.filter(s => studentSkillNames.includes(s)).length;
      matchScore = Math.round((matches / requiredSkillNames.length) * 100);
    }

    const application = await this.prisma.application.upsert({
      where: { studentId_postingId: { studentId: student.id, postingId } },
      create: { studentId: student.id, postingId, coverLetter: dto.coverLetter, matchScore },
      update: { coverLetter: dto.coverLetter },
    });

    // Trigger notification
    await this.prisma.notification.create({
      data: {
        userId: studentUserId,
        type: 'APPLICATION_STATUS',
        title: `Applied to ${posting.title}`,
        body: `Your application to ${posting.industry.companyName} for ${posting.title} has been submitted.`,
        metadata: { applicationId: application.id, postingId }
      }
    });

    return { message: 'Application submitted', matchScore, applicationId: application.id };
  }

  // ── Candidate matching for industry ──
  async getCandidates(postingId: string) {
    const posting = await this.prisma.jobPosting.findUnique({ where: { id: postingId } });
    if (!posting) throw new NotFoundException('Posting not found');

    const applications = await this.prisma.application.findMany({
      where: { postingId },
      include: {
        student: {
          include: {
            skillProfile: { include: { skillScores: { include: { category: true } } } }
          }
        }
      },
      orderBy: { matchScore: 'desc' }
    });

    return applications.map(app => ({
      applicationId: app.id,
      status: app.status,
      matchScore: app.matchScore,
      appliedAt: app.appliedAt,
      student: {
        id: app.student.id,
        name: `${app.student.firstName} ${app.student.lastName}`,
        institution: app.student.institution,
        department: app.student.department,
        cgpa: app.student.cgpa,
        overallSkillScore: app.student.skillProfile?.overallScore || 0,
        topSkills: app.student.skillProfile?.skillScores
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(ss => ({ name: ss.category.name, score: ss.score })) || []
      }
    }));
  }

  // ── Update application status ──
  async updateStatus(applicationId: string, status: string) {
    const app = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: status as any },
      include: { student: { include: { user: { select: { id: true } } } }, posting: { include: { industry: true } } }
    });

    const statusMessages = {
      SHORTLISTED: `Congratulations! You've been shortlisted for ${app.posting.title} at ${app.posting.industry.companyName}.`,
      INTERVIEW: `Interview scheduled for ${app.posting.title} at ${app.posting.industry.companyName}. Check your email.`,
      SELECTED: `🎉 You've been selected for ${app.posting.title} at ${app.posting.industry.companyName}!`,
      REJECTED: `Your application for ${app.posting.title} was not shortlisted this time. Keep trying!`,
    };

    if (statusMessages[status]) {
      await this.prisma.notification.create({
        data: {
          userId: app.student.user.id,
          type: 'APPLICATION_STATUS',
          title: `Application Update: ${status}`,
          body: statusMessages[status],
          metadata: { applicationId, postingId: app.postingId }
        }
      });
    }

    return { message: 'Status updated', status };
  }

  // ── Student application tracker ──
  async getStudentApplications(studentUserId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
    if (!student) return [];

    return this.prisma.application.findMany({
      where: { studentId: student.id },
      include: {
        posting: {
          include: { industry: { select: { companyName: true, logoUrl: true } } }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });
  }
}
