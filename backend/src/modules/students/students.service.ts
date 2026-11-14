import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.studentProfile.findUnique({
      where: { userId },
      include: { skillProfile: { include: { skillScores: { include: { category: true } } } } }
    });
  }

  async getFullProfile(studentId: string) {
    return this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        skillProfile: { include: { skillScores: { include: { category: true } } } },
        certificates: true,
        applications: { include: { posting: { include: { industry: { select: { companyName: true } } } } } }
      }
    });
  }

  async updateProfile(userId: string, dto: any) {
    return this.prisma.studentProfile.update({ where: { userId }, data: dto });
  }
}
