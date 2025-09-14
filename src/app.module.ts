import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as entities from './entities';
import { ParksModule } from './parks/parks.module';
import { UsersModule } from './users/users.module';
import { TrailsModule } from './trails/trails.module';
import { PhotosModule } from './photos/photos.module';
import { VisitsModule } from './visits/visits.module';
import { AuthModule } from './auth/auth.module';
import auth0Config from './common/auth/auth0.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auth0Config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        if (isProduction) {
          const databaseUrl = configService.get('DATABASE_URL');
          if (!databaseUrl) {
            throw new Error('DATABASE_URL is required in production');
          }
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: Object.values(entities),
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          };
        }

        // Development configuration
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5434),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'park_tracker'),
          entities: Object.values(entities),
          synchronize: true,
          ssl: false,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ParksModule,
    UsersModule,
    TrailsModule,
    PhotosModule,
    VisitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
