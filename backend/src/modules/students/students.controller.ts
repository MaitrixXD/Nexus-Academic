import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Students')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current student profile' })
  getProfile(@CurrentUser() user: any) {
    return this.studentsService.getProfile(user.sub);
  }

  @Get(':id/full-profile')
  @ApiOperation({ summary: 'Get full student profile by ID (for industry view)' })
  getFullProfile(@Param('id') id: string) {
    return this.studentsService.getFullProfile(id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update student profile' })
  updateProfile(@CurrentUser() user: any, @Body() dto: any) {
    return this.studentsService.updateProfile(user.sub, dto);
  }
}
