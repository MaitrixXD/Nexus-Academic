import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class IndustryService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.industryProfile.findUnique({
      where: { userId },
      include: { jobPostings: { where: { status: 'ACTIVE' }, take: 5 } }
    });
  }

  async getPublicProfile(industryId: string) {
    return this.prisma.industryProfile.findUnique({
      where: { id: industryId },
      include: { jobPostings: { where: { status: 'ACTIVE' } } }
    });
  }

  async getMyPostings(userId: string) {
    const industry = await this.prisma.industryProfile.findUnique({ where: { userId } });
    if (!industry) return [];
    return this.prisma.jobPosting.findMany({
      where: { industryId: industry.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getMyPrograms(userId: string) {
    const industry = await this.prisma.industryProfile.findUnique({ where: { userId } });
    if (!industry) return [];
    return this.prisma.learningProgram.findMany({
      where: { industryId: industry.id },
      include: { _count: { select: { enrollments: true } } }
    });
  }

  async updateProfile(userId: string, dto: any) {
    return this.prisma.industryProfile.update({ where: { userId }, data: dto });
  }
}
