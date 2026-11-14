import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('student/dashboard')
  @ApiOperation({ summary: 'Student dashboard aggregated data' })
  studentDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getStudentDashboard(user.sub);
  }

  @Get('industry/dashboard')
  @ApiOperation({ summary: 'Industry dashboard aggregated data' })
  industryDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getIndustryDashboard(user.sub);
  }

  @Get('academician/dashboard')
  @ApiOperation({ summary: 'Academician dashboard aggregated data' })
  academicianDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getAcademicianDashboard(user.sub);
  }

  @Get('institution/dashboard')
  @ApiOperation({ summary: 'Institution admin dashboard aggregated data' })
  institutionDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getInstitutionDashboard(user.sub);
  }
}
