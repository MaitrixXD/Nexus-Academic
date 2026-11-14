import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async getTemplate() {
    return this.prisma.assessmentTemplate.findFirst({
      where: { isActive: true },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { category: { select: { id: true, name: true, type: true } } }
        }
      }
    });
  }

  async submitAssessment(studentId: string, templateId: string, answers: Record<string, string>) {
    const questions = await this.prisma.assessmentQuestion.findMany({
      where: { templateId },
      include: { category: true }
    });

    // Compute score per category
    const categoryScores: Record<string, { total: number; earned: number; count: number }> = {};
    for (const q of questions) {
      const catId = q.categoryId;
      if (!categoryScores[catId]) categoryScores[catId] = { total: 0, earned: 0, count: 0 };
      categoryScores[catId].total += q.weight;
      categoryScores[catId].count += 1;
      if (answers[q.id] === q.correctAnswer) {
        categoryScores[catId].earned += q.weight;
      }
    }

    // Convert to 0-100 scores
    const scoreMap: Record<string, number> = {};
    for (const [catId, data] of Object.entries(categoryScores)) {
      scoreMap[catId] = Math.round((data.earned / data.total) * 100);
    }

    const overallScore = Math.round(
      Object.values(scoreMap).reduce((a, b) => a + b, 0) / Object.keys(scoreMap).length
    );

    // Upsert skill profile
    const existingProfile = await this.prisma.skillProfile.findUnique({ where: { studentId } });

    if (existingProfile) {
      for (const [catId, score] of Object.entries(scoreMap)) {
        await this.prisma.skillScore.upsert({
          where: { skillProfileId_categoryId: { skillProfileId: existingProfile.id, categoryId: catId } },
          create: { skillProfileId: existingProfile.id, categoryId: catId, score },
          update: { score },
        });
      }
      await this.prisma.skillProfile.update({
        where: { id: existingProfile.id },
        data: { overallScore, lastUpdated: new Date() }
      });
    } else {
      await this.prisma.skillProfile.create({
        data: {
          studentId,
          overallScore,
          skillScores: {
            create: Object.entries(scoreMap).map(([categoryId, score]) => ({ categoryId, score }))
          }
        }
      });
    }

    // Save response record
    await this.prisma.assessmentResponse.create({
      data: { studentId, templateId, answers }
    });

    return {
      message: 'Assessment submitted successfully',
      overallScore,
      categoryScores: Object.entries(scoreMap).map(([catId, score]) => {
        const q = questions.find(q => q.categoryId === catId);
        return { categoryId: catId, categoryName: q?.category?.name, score };
      })
    };
  }

  async getSkillProfile(studentId: string) {
    const profile = await this.prisma.skillProfile.findUnique({
      where: { studentId },
      include: {
        skillScores: {
          include: { category: true },
          orderBy: { score: 'desc' }
        }
      }
    });

    if (!profile) {
      return { message: 'No assessment taken yet', hasProfile: false };
    }

    // Get benchmarks for gap analysis
    const benchmarks = await this.prisma.industryBenchmark.findMany({
      include: { category: true }
    });

    // Group benchmarks by jobRole
    const benchmarkByRole: Record<string, Record<string, number>> = {};
    for (const b of benchmarks) {
      if (!benchmarkByRole[b.jobRole]) benchmarkByRole[b.jobRole] = {};
      benchmarkByRole[b.jobRole][b.category.name] = b.minScore;
    }

    // Compute gaps
    const skillMap: Record<string, number> = {};
    for (const ss of profile.skillScores) {
      skillMap[ss.category.name] = ss.score;
    }

    const gaps = profile.skillScores
      .filter(ss => {
        const maxRequired = Math.max(
          ...benchmarks
            .filter(b => b.categoryId === ss.categoryId)
            .map(b => b.minScore)
        );
        return maxRequired > 0 && ss.score < maxRequired;
      })
      .map(ss => ({
        categoryName: ss.category.name,
        currentScore: ss.score,
        requiredScore: Math.max(
          ...benchmarks
            .filter(b => b.categoryId === ss.categoryId)
            .map(b => b.minScore)
        ),
        gap: Math.max(
          ...benchmarks
            .filter(b => b.categoryId === ss.categoryId)
            .map(b => b.minScore)
        ) - ss.score
      }))
      .sort((a, b) => b.gap - a.gap);

    return {
      hasProfile: true,
      overallScore: profile.overallScore,
      lastUpdated: profile.lastUpdated,
      skillScores: profile.skillScores.map(ss => ({
        categoryId: ss.categoryId,
        categoryName: ss.category.name,
        categoryType: ss.category.type,
        score: ss.score
      })),
      gaps,
      strengths: profile.skillScores.filter(ss => ss.score >= 75).map(ss => ss.category.name),
    };
  }

  async getRecommendations(studentId: string) {
    const profile = await this.prisma.skillProfile.findUnique({
      where: { studentId },
      include: { skillScores: { include: { category: true } } }
    });

    if (!profile) return { message: 'Complete an assessment first', jobRoles: [], courses: [] };

    const skillMap: Record<string, number> = {};
    for (const ss of profile.skillScores) {
      skillMap[ss.category.name] = ss.score;
    }

    const benchmarks = await this.prisma.industryBenchmark.findMany({
      include: { category: true }
    });

    // Cosine-similarity style job role matching
    const roleScores: Record<string, { score: number; matchPct: number }> = {};
    for (const b of benchmarks) {
      if (!roleScores[b.jobRole]) roleScores[b.jobRole] = { score: 0, matchPct: 0 };
      const studentScore = skillMap[b.category.name] || 0;
      const fit = Math.min(studentScore / b.minScore, 1.0); // cap at 100%
      roleScores[b.jobRole].score += fit;
    }

    const roleCounts: Record<string, number> = {};
    for (const b of benchmarks) {
      roleCounts[b.jobRole] = (roleCounts[b.jobRole] || 0) + 1;
    }

    const rankedRoles = Object.entries(roleScores)
      .map(([role, data]) => ({
        role,
        matchPercentage: Math.round((data.score / roleCounts[role]) * 100)
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Recommend courses to fill gaps
    const gapCategories = profile.skillScores
      .filter(ss => ss.score < 70)
      .map(ss => ss.category.name);

    const courses = await this.prisma.learningProgram.findMany({
      where: { isActive: true },
      include: { industry: { select: { companyName: true } } },
      take: 6
    });

    const rankedCourses = courses
      .map(c => ({
        ...c,
        relevance: c.skillsCovered.filter(s => gapCategories.includes(s)).length
      }))
      .sort((a, b) => b.relevance - a.relevance);

    return {
      jobRoles: rankedRoles,
      courses: rankedCourses.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        skillsCovered: c.skillsCovered,
        duration: c.duration,
        hasCertificate: c.hasCertificate,
        provider: c.industry.companyName,
        relevanceScore: c.relevance
      }))
    };
  }
}
