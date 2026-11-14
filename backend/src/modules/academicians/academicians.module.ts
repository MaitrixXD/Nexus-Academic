import { Module } from '@nestjs/common';
import { AcademiciansController } from './academicians.controller';
import { AcademiciansService } from './academicians.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [AcademiciansController],
  providers: [AcademiciansService, PrismaService],
  exports: [AcademiciansService],
})
export class AcademiciansModule {}
