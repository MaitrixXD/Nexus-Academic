import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers(query: any) {
    const where: any = {};
    if (query.role) where.role = query.role;
    if (query.search) where.email = { contains: query.search, mode: 'insensitive' };
    return this.prisma.user.findMany({
      where,
      select: { id: true, email: true, role: true, isActive: true, isVerified: true, createdAt: true,
        studentProfile: { select: { firstName: true, lastName: true, institution: true } },
        industryProfile: { select: { companyName: true, isVerified: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit ? Number(query.limit) : 50,
    });
  }

  async updateUserStatus(id: string, isActive: boolean) {
    return this.prisma.user.update({ where: { id }, data: { isActive } });
  }

  async getPendingVerifications() {
    const [pendingIndustries, pendingCertificates] = await Promise.all([
      this.prisma.industryProfile.findMany({ where: { isVerified: false }, include: { user: { select: { email: true, createdAt: true } } } }),
      this.prisma.certificate.findMany({ where: { verificationStatus: 'PENDING' }, include: { student: { select: { firstName: true, lastName: true } } } })
    ]);
    return { pendingIndustries, pendingCertificates };
  }

  async verifyIndustry(industryId: string, approved: boolean) {
    return this.prisma.industryProfile.update({
      where: { id: industryId },
      data: { isVerified: approved }
    });
  }

  async verifyCertificate(certId: string, status: 'APPROVED' | 'REJECTED') {
    return this.prisma.certificate.update({
      where: { id: certId },
      data: { verificationStatus: status }
    });
  }
}
