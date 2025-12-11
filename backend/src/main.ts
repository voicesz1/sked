import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Middlewares
  app.use(helmet());

  // CORS Configuration
  const corsList = (process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'])
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (corsList.includes(origin)) return callback(null, true);
      if (/^https:\/\/[\w.-]+\.ngrok\.io$/.test(origin)) return callback(null, true);
      if (/^https:\/\/[\w.-]+\.ngrok-free\.dev$/.test(origin)) return callback(null, true);
      if (/^https:\/\/[\w.-]+\.vercel\.app$/.test(origin)) return callback(null, true);
      if (/^https:\/\/[\w.-]+\.loca\.lt$/.test(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  });

  // Rate Limiting
  app.use(
    rateLimit({
      windowMs: (parseInt(process.env.RATE_LIMIT_TTL) || 60) * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
      message: 'Muitas requisições deste IP, tente novamente mais tarde.',
    }),
  );

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('API de Agendamento - Barbearias e Salões')
    .setDescription('API REST completa para sistema de agendamento')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Digite o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;

  // Static uploads serving
  const uploadDir = join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadDir));

  await app.listen(port);
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
