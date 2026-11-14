import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LearningService } from './learning.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Learning Programs')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('learning-programs')
export class LearningController {
  constructor(private learningService: LearningService) {}

  @Get()
  @ApiOperation({ summary: 'Browse all learning programs' })
  findAll(@Query() query: any) { return this.learningService.findAll(query); }

  @Post()
  @ApiOperation({ summary: 'Publish a new learning program (Industry)' })
  create(@CurrentUser() user: any, @Body() dto: any) { return this.learningService.create(user.sub, dto); }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll in a program (Student)' })
  enroll(@CurrentUser() user: any, @Param('id') id: string) { return this.learningService.enroll(user.sub, id); }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a program as complete (Student)' })
  complete(@CurrentUser() user: any, @Param('id') id: string) { return this.learningService.complete(user.sub, id); }

  @Get('my-enrollments')
  @ApiOperation({ summary: 'Get current student\'s enrollments' })
  getMyEnrollments(@CurrentUser() user: any) { return this.learningService.getMyEnrollments(user.sub); }
}
