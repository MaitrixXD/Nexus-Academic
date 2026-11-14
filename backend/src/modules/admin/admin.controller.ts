import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('INSTITUTION_ADMIN' as any)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List all users (Admin only)' })
  getUsers(@Query() query: any) { return this.adminService.getUsers(query); }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Activate or suspend a user account' })
  updateStatus(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.adminService.updateUserStatus(id, body.isActive);
  }

  @Get('verifications')
  @ApiOperation({ summary: 'Get pending verifications (industry + certificates)' })
  getPending() { return this.adminService.getPendingVerifications(); }

  @Patch('verifications/industry/:id')
  @ApiOperation({ summary: 'Approve or reject an industry partner' })
  verifyIndustry(@Param('id') id: string, @Body() body: { approved: boolean }) {
    return this.adminService.verifyIndustry(id, body.approved);
  }

  @Patch('verifications/certificate/:id')
  @ApiOperation({ summary: 'Approve or reject a certificate' })
  verifyCertificate(@Param('id') id: string, @Body() body: { status: 'APPROVED' | 'REJECTED' }) {
    return this.adminService.verifyCertificate(id, body.status);
  }
}
