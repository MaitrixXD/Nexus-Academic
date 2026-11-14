import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InternshipsService } from './internships.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Internships & Jobs')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('internships')
export class InternshipsController {
  constructor(private internshipsService: InternshipsService) {}

  @Get()
  @ApiOperation({ summary: 'Search/filter/paginate internship & job listings' })
  @ApiQuery({ name: 'skills', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'jobType', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: any) {
    return this.internshipsService.findAll(query);
  }

  @Get('my-applications')
  @ApiOperation({ summary: 'Get logged-in student\'s applications (tracker)' })
  getMyApplications(@CurrentUser() user: any) {
    return this.internshipsService.getStudentApplications(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single internship/job posting detail' })
  findOne(@Param('id') id: string) {
    return this.internshipsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new internship/job posting (Industry role)' })
  create(@CurrentUser() user: any, @Body() dto: any) {
    return this.internshipsService.create(user.sub, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a posting (Industry role)' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.internshipsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Close a posting (Industry role)' })
  remove(@Param('id') id: string) {
    return this.internshipsService.remove(id);
  }

  @Post(':id/apply')
  @ApiOperation({ summary: 'Apply to a posting (Student role)' })
  apply(@CurrentUser() user: any, @Param('id') postingId: string, @Body() dto: any) {
    return this.internshipsService.apply(user.sub, postingId, dto);
  }

  @Get(':id/candidates')
  @ApiOperation({ summary: 'Get ranked candidates for a posting (Industry role)' })
  getCandidates(@Param('id') postingId: string) {
    return this.internshipsService.getCandidates(postingId);
  }

  @Patch('applications/:applicationId/status')
  @ApiOperation({ summary: 'Update application status (Industry role)' })
  updateStatus(@Param('applicationId') applicationId: string, @Body() body: { status: string }) {
    return this.internshipsService.updateStatus(applicationId, body.status);
  }
}
