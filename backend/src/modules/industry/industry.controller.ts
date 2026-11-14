import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IndustryService } from './industry.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Industry')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('industry')
export class IndustryController {
  constructor(private industryService: IndustryService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current industry profile' })
  getProfile(@CurrentUser() user: any) {
    return this.industryService.getProfile(user.sub);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get public company profile by ID' })
  getPublicProfile(@Param('id') id: string) {
    return this.industryService.getPublicProfile(id);
  }

  @Get('my-postings')
  @ApiOperation({ summary: 'Get all postings by current industry user' })
  getMyPostings(@CurrentUser() user: any) {
    return this.industryService.getMyPostings(user.sub);
  }

  @Get('my-programs')
  @ApiOperation({ summary: 'Get learning programs published by current industry user' })
  getMyPrograms(@CurrentUser() user: any) {
    return this.industryService.getMyPrograms(user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update industry profile' })
  updateProfile(@CurrentUser() user: any, @Body() dto: any) {
    return this.industryService.updateProfile(user.sub, dto);
  }
}
