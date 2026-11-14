/**
 * main.ts — Nexus Academic Backend Entry Point
 * Starts embedded PostgreSQL, then the NestJS application.
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // ── Start embedded PostgreSQL if configured ──
  const pgDataDir = process.env.EMBEDDED_PG_DATA_DIR;
  if (pgDataDir && fs.existsSync(pgDataDir)) {
    try {
      const EmbeddedPostgres = require('embedded-postgres');
      const pg = new EmbeddedPostgres.default({
        databaseDir: pgDataDir,
        user: process.env.EMBEDDED_PG_USER || 'nexus_user',
        password: process.env.EMBEDDED_PG_PASS || 'nexus_pass123',
        port: parseInt(process.env.EMBEDDED_PG_PORT || '5433'),
        persistent: true,
      });
      await pg.start();
      console.log(`🐘 PostgreSQL started (port ${process.env.EMBEDDED_PG_PORT || 5433})`);
    } catch (e: any) {
      console.warn('⚠️  Could not start embedded PostgreSQL (might already be running):', e?.message || String(e));
    }
  }

  const app = await NestFactory.create(AppModule);

  // ── CORS ──
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  });

  // ── Global Prefix ──
  app.setGlobalPrefix('api/v1');

  // ── Validation ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger ──
  const config = new DocumentBuilder()
    .setTitle('Nexus Academic API')
    .setDescription('Academia–Industry Collaboration Portal API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ── Uploads directory ──
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const port = parseInt(process.env.PORT || '3001');
  await app.listen(port);

  console.log(`\n🚀 Nexus Academic API running on http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api\n`);
}

bootstrap();
