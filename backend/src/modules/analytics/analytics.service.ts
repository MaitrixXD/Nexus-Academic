import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStudentDashboard(userId: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId }, include: { skillProfile: true } });
    if (!student) return null;

    const [activeApps, upcomingDeadlines, recommendedCount, recentNotifications] = await Promise.all([
      this.prisma.application.count({ where: { studentId: student.id, status: { notIn: ['SELECTED', 'REJECTED'] } } }),
      this.prisma.jobPosting.count({ where: { status: 'ACTIVE', deadline: { gte: new Date(), lte: new Date(Date.now() + 7 * 86400000) } } }),
      this.prisma.jobPosting.count({ where: { status: 'ACTIVE' } }),
      this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    const recommendations = await this.prisma.jobPosting.findMany({
      where: { status: 'ACTIVE' },
      include: { industry: { select: { companyName: true, logoUrl: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      studentName: `${student.firstName} ${student.lastName}`,
      skillScore: student.skillProfile?.overallScore || 0,
      activeApplications: activeApps,
      recommendedInternships: recommendedCount,
      upcomingDeadlines,
      recentNotifications,
      recommendations,
    };
  }

  async getIndustryDashboard(userId: string) {
    const industry = await this.prisma.industryProfile.findUnique({ where: { userId } });
    if (!industry) return null;

    const postingIds = (await this.prisma.jobPosting.findMany({ where: { industryId: industry.id }, select: { id: true } })).map(p => p.id);

    const [activePostings, totalApplicants, shortlisted, selected, appOverTime] = await Promise.all([
      this.prisma.jobPosting.count({ where: { industryId: industry.id, status: 'ACTIVE' } }),
      this.prisma.application.count({ where: { postingId: { in: postingIds } } }),
      this.prisma.application.count({ where: { postingId: { in: postingIds }, status: 'SHORTLISTED' } }),
      this.prisma.application.count({ where: { postingId: { in: postingIds }, status: 'SELECTED' } }),
      this.prisma.$queryRaw`
        SELECT DATE_TRUNC('week', "appliedAt") as week, COUNT(*) as count
        FROM applications WHERE "postingId" = ANY(${postingIds}::uuid[])
        GROUP BY week ORDER BY week DESC LIMIT 8
      `.catch(() => []),
    ]);

    const recentApplications = await this.prisma.application.findMany({
      where: { postingId: { in: postingIds } },
      include: {
        student: { select: { firstName: true, lastName: true, institution: true } },
        posting: { select: { title: true } }
      },
      orderBy: { appliedAt: 'desc' },
      take: 5,
    });

    return {
      companyName: industry.companyName,
      activePostings,
      totalApplicants,
      shortlisted,
      positionsFilled: selected,
      applicationsOverTime: appOverTime,
      recentApplications,
    };
  }

  async getAcademicianDashboard(userId: string) {
    const [totalStudents, ongoingFdps, openResearch, upcomingWorkshops] = await Promise.all([
      this.prisma.studentProfile.count(),
      this.prisma.fDP.count({ where: { isActive: true } }),
      this.prisma.researchCollaboration.count({ where: { isOpen: true } }),
      this.prisma.workshop.count({ where: { date: { gte: new Date() } } }),
    ]);

    const students = await this.prisma.studentProfile.findMany({
      include: { skillProfile: true, applications: { select: { status: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      assignedStudents: totalStudents,
      ongoingFdps,
      researchCollaborations: openResearch,
      upcomingWorkshops,
      studentProgress: students.map(s => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        department: s.department,
        skillScore: s.skillProfile?.overallScore || 0,
        internshipStatus: s.applications[0]?.status || 'Not Applied',
        placementStatus: s.applications.some(a => a.status === 'SELECTED') ? 'Placed' : 'Unplaced',
      }))
    };
  }

  async getInstitutionDashboard(userId: string) {
    const [totalStudents, placed, activeIndustries, avgSkillScore] = await Promise.all([
      this.prisma.studentProfile.count(),
      this.prisma.application.count({ where: { status: 'SELECTED' } }),
      this.prisma.industryProfile.count({ where: { isVerified: true } }),
      this.prisma.skillProfile.aggregate({ _avg: { overallScore: true } }),
    ]);

    const placementPct = totalStudents > 0 ? Math.round((placed / totalStudents) * 100) : 0;

    const departmentStats = await this.prisma.$queryRaw`
      SELECT sp.department, COUNT(sp.id) as students,
             COALESCE(AVG(skp."overallScore"), 0) as "avgSkillScore"
      FROM student_profiles sp
      LEFT JOIN skill_profiles skp ON skp."studentId" = sp.id
      GROUP BY sp.department
    `.catch(() => []);

    const recentUsers = await this.prisma.user.findMany({
      where: { role: { in: ['STUDENT', 'INDUSTRY'] } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, email: true, role: true, createdAt: true, isActive: true }
    });

    return {
      placementPercentage: placementPct,
      activeStudents: totalStudents,
      partnerIndustries: activeIndustries,
      skillGapIndex: Math.round(100 - (avgSkillScore._avg.overallScore || 0)),
      averageSkillScore: Math.round(avgSkillScore._avg.overallScore || 0),
      departmentStats,
      recentUsers,
    };
  }
}
