import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class LearningService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const where: any = { isActive: true };
    if (query.skill) where.skillsCovered = { hasSome: [query.skill] };
    return this.prisma.learningProgram.findMany({
      where,
      include: { industry: { select: { companyName: true, logoUrl: true } }, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(userId: string, dto: any) {
    const industry = await this.prisma.industryProfile.findUnique({ where: { userId } });
    return this.prisma.learningProgram.create({ data: { ...dto, industryId: industry.id, skillsCovered: dto.skillsCovered || [] } });
  }

  async enroll(userId: string, programId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
    const enrollment = await this.prisma.enrollment.upsert({
      where: { studentId_programId: { studentId: student.id, programId } },
      create: { studentId: student.id, programId, status: 'ENROLLED' },
      update: {},
    });
    return { message: 'Enrolled successfully', enrollmentId: enrollment.id };
  }

  async complete(userId: string, programId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
    const enrollment = await this.prisma.enrollment.update({
      where: { studentId_programId: { studentId: student.id, programId } },
      data: { status: 'COMPLETED', completedAt: new Date() },
      include: { program: true }
    });

    if (enrollment.program.hasCertificate) {
      await this.prisma.certificate.upsert({
        where: { enrollmentId: enrollment.id },
        create: {
          studentId: student.id,
          enrollmentId: enrollment.id,
          title: `Certificate of Completion — ${enrollment.program.title}`,
          issuer: 'Nexus Academic',
          verificationStatus: 'APPROVED',
        },
        update: {},
      });
    }

    return { message: 'Course marked as complete', hasCertificate: enrollment.program.hasCertificate };
  }

  async getMyEnrollments(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) return [];
    return this.prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: { program: { include: { industry: { select: { companyName: true } } } }, certificate: true }
    });
  }
}
