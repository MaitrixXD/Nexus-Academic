import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, role: true, isVerified: true, isActive: true, createdAt: true,
        studentProfile: true,
        industryProfile: true,
        academicianProfile: true,
        institutionProfile: true,
      }
    });
    return user;
  }

  async updateMe(userId: string, dto: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.role === 'STUDENT') {
      return this.prisma.studentProfile.update({ where: { userId }, data: dto });
    }
    if (user.role === 'INDUSTRY') {
      return this.prisma.industryProfile.update({ where: { userId }, data: dto });
    }
    if (user.role === 'ACADEMICIAN') {
      return this.prisma.academicianProfile.update({ where: { userId }, data: dto });
    }
    return user;
  }
}
