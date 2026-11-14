import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { PrismaService } from './prisma.service';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { IndustryModule } from './modules/industry/industry.module';
import { AcademiciansModule } from './modules/academicians/academicians.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { InternshipsModule } from './modules/internships/internships.module';
import { LearningModule } from './modules/learning/learning.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Serve static frontend files
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'stitch_academia_industry_collaboration_hub'),
      serveRoot: '/frontend',
      serveStaticOptions: { index: false },
    }),
    // Core modules
    AuthModule,
    UsersModule,
    StudentsModule,
    IndustryModule,
    AcademiciansModule,
    AssessmentsModule,
    InternshipsModule,
    LearningModule,
    PortfolioModule,
    NotificationsModule,
    MessagesModule,
    AnalyticsModule,
    AdminModule,
    UploadsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
