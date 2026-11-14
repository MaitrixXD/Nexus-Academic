import { Module } from '@nestjs/common';
import { InternshipsController } from './internships.controller';
import { InternshipsService } from './internships.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [InternshipsController],
  providers: [InternshipsService, PrismaService],
  exports: [InternshipsService],
})
export class InternshipsModule {}
