// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { CustomLogger } from './common/logger/logger.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new CustomLogger(),
  });
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL', 'http://localhost:5173'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Serve static files for Swagger OAuth2
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Use global exception filter
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  const auth0Domain = configService.get('AUTH0_DOMAIN');
  const auth0Audience = configService.get('AUTH0_AUDIENCE');

  if (!auth0Domain || !auth0Audience) {
    throw new Error('Missing required Auth0 configuration');
  }

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('National Parks Tracker API')
    .setDescription('API for tracking national park visits and hikes')
    .setVersion('1.0')
    .addTag('parks')
    .addTag('trails')
    .addTag('visits')
    .addTag('hikes')
    .addTag('photos')
    .addTag('users')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT Input',
      description: 'Enter your JWT token from Auth0'
    })
    .addSecurityRequirements('bearer')
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: `https://${auth0Domain}/authorize?prompt=login&audience=${auth0Audience}`,
            tokenUrl: `https://${auth0Domain}/oauth/token`,
            scopes: {
              openid: 'Open Id',
              profile: 'Profile',
              email: 'E-mail',
            },
          },
        },
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Login with Auth0',
        in: 'header',
      },
      'Auth0',
    )
    .addSecurityRequirements('Auth0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();