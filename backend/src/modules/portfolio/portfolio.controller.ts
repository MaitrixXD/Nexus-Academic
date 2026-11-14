import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma.service';

@ApiTags('Portfolio')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService, private prisma: PrismaService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current student portfolio' })
  async getMyPortfolio(@CurrentUser() user: any) {
    const student = await this.prisma.studentProfile.findUnique({ where: { userId: user.sub } });
    return this.portfolioService.getPortfolio(student?.id);
  }

  @Get(':studentId')
  @ApiOperation({ summary: 'Get portfolio by student profile ID' })
  getPortfolio(@Param('studentId') studentId: string) {
    return this.portfolioService.getPortfolio(studentId);
  }
}
