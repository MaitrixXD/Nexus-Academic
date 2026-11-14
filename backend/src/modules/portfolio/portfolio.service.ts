import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getPortfolio(studentId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        skillProfile: { include: { skillScores: { include: { category: true } } } },
        certificates: true,
        enrollments: {
          where: { status: 'COMPLETED' },
          include: { program: { include: { industry: { select: { companyName: true } } } } }
        },
        applications: {
          where: { status: { in: ['SELECTED', 'SHORTLISTED', 'INTERVIEW'] } },
          include: { posting: { include: { industry: { select: { companyName: true } } } } }
        }
      }
    });

    if (!student) return null;

    return {
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        institution: student.institution,
        department: student.department,
        year: student.year,
        cgpa: student.cgpa,
        bio: student.bio,
        linkedinUrl: student.linkedinUrl,
        githubUrl: student.githubUrl,
        resumeUrl: student.resumeUrl,
      },
      overallScore: student.skillProfile?.overallScore || 0,
      skillScores: student.skillProfile?.skillScores.map(ss => ({
        name: ss.category.name,
        score: ss.score,
        type: ss.category.type
      })) || [],
      certificates: student.certificates,
      completedCourses: student.enrollments.map(e => ({
        title: e.program.title,
        provider: e.program.industry.companyName,
        completedAt: e.completedAt,
        hasCertificate: e.program.hasCertificate
      })),
      internships: student.applications.map(a => ({
        title: a.posting.title,
        company: a.posting.industry.companyName,
        status: a.status,
        appliedAt: a.appliedAt
      }))
    };
  }
}
