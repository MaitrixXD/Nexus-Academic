import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AcademiciansService } from './academicians.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Academicians & Collaboration')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('academicians')
export class AcademiciansController {
  constructor(private academiciansService: AcademiciansService) {}

  @Get('fdps')
  @ApiOperation({ summary: 'List all FDP opportunities' })
  getFdps(@Query() query: any) { return this.academiciansService.getFdps(query); }

  @Get('research-collaborations')
  @ApiOperation({ summary: 'List open research/consultancy collaborations' })
  getResearch() { return this.academiciansService.getResearchCollaborations(); }

  @Post('research-collaborations')
  @ApiOperation({ summary: 'Post a new research collaboration (Industry)' })
  createResearch(@CurrentUser() user: any, @Body() dto: any) {
    return this.academiciansService.createResearchCollaboration(user.sub, dto);
  }

  @Get('workshops')
  @ApiOperation({ summary: 'List upcoming workshops and guest lectures' })
  getWorkshops() { return this.academiciansService.getWorkshops(); }

  @Post('workshops')
  @ApiOperation({ summary: 'Schedule a new workshop' })
  createWorkshop(@Body() dto: any) { return this.academiciansService.createWorkshop(dto); }

  @Get('student-progress')
  @ApiOperation({ summary: 'Monitor student skill and placement progress' })
  getStudentProgress(@Query() query: any) { return this.academiciansService.getStudentProgress(query); }
}
