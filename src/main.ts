import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './app/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { BunyanLogger } from './app/commons/logger.service';
import { logRequestsMiddleware } from './app/middleware/requestLogger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appUrl = configService.get('APP_URL');
  const appEnv = configService.get('NODE_ENV');
  const appPort = configService.get('PORT');

  const corsOptions = {
    origin: [
      'http://localhost:5173', // Todo: Replace with frontend url
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.useLogger(new BunyanLogger());

  const logger = app.get(BunyanLogger);

  app.use(logRequestsMiddleware(logger));

  if (appUrl && appEnv) {
    const options = new DocumentBuilder()
      .setTitle('Sample API')
      .setVersion('1.0')
      .addServer(appUrl, appEnv)
      .addTag('Sample API')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  }
  await app.listen(appPort);
}

bootstrap();
