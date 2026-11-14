import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AcademiciansService {
  constructor(private prisma: PrismaService) {}

  // FDPs
  async getFdps(query: any) {
    return this.prisma.fDP.findMany({
      where: { isActive: true },
      include: { industry: { select: { companyName: true, logoUrl: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Research Collaborations
  async getResearchCollaborations() {
    return this.prisma.researchCollaboration.findMany({
      where: { isOpen: true },
      include: { industry: { select: { companyName: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createResearchCollaboration(userId: string, dto: any) {
    const industry = await this.prisma.industryProfile.findUnique({ where: { userId } });
    return this.prisma.researchCollaboration.create({
      data: { ...dto, industryId: industry.id, requiredExpertise: dto.requiredExpertise || [] }
    });
  }

  // Workshops
  async getWorkshops() {
    return this.prisma.workshop.findMany({
      where: { date: { gte: new Date() } },
      include: { industry: { select: { companyName: true } } },
      orderBy: { date: 'asc' }
    });
  }

  async createWorkshop(dto: any) {
    return this.prisma.workshop.create({ data: dto });
  }

  // Student Progress
  async getStudentProgress(query: any) {
    const students = await this.prisma.studentProfile.findMany({
      include: {
        skillProfile: true,
        applications: { select: { status: true }, orderBy: { appliedAt: 'desc' }, take: 1 }
      },
      take: query.limit ? Number(query.limit) : 20,
    });

    return students.map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      department: s.department,
      year: s.year,
      skillScore: s.skillProfile?.overallScore || 0,
      internshipStatus: s.applications[0]?.status || 'Not Applied',
      placementStatus: s.applications.some(a => a.status === 'SELECTED') ? 'Placed' : 'In Progress',
    }));
  }
}
