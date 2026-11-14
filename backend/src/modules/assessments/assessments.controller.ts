import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Assessments')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('assessments')
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Get active assessment questionnaire' })
  getTemplate() {
    return this.assessmentsService.getTemplate();
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit assessment answers and compute skill profile' })
  submit(@CurrentUser() user: any, @Body() body: { templateId: string; answers: Record<string, string> }) {
    return this.assessmentsService.submitAssessment(user.sub, body.templateId, body.answers);
  }

  @Get('skill-profile/:studentId')
  @ApiOperation({ summary: 'Get student skill profile and gap report' })
  getSkillProfile(@Param('studentId') studentId: string) {
    return this.assessmentsService.getSkillProfile(studentId);
  }

  @Get('recommendations/:studentId')
  @ApiOperation({ summary: 'Get job role and course recommendations based on skill profile' })
  getRecommendations(@Param('studentId') studentId: string) {
    return this.assessmentsService.getRecommendations(studentId);
  }
}
