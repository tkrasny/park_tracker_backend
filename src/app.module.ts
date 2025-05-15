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
        
        return {
          type: 'postgres',
          host: isProduction 
            ? configService.get('RDS_HOSTNAME')
            : configService.get('DB_HOST', 'localhost'),
          port: isProduction
            ? configService.get('RDS_PORT', 5432)
            : configService.get('DB_PORT', 5434),
          username: isProduction
            ? configService.get('RDS_USERNAME')
            : configService.get('DB_USERNAME', 'postgres'),
          password: isProduction
            ? configService.get('RDS_PASSWORD')
            : configService.get('DB_PASSWORD', 'postgres'),
          database: isProduction
            ? configService.get('RDS_DB_NAME')
            : configService.get('DB_DATABASE', 'park_tracker'),
          entities: Object.values(entities),
          synchronize: !isProduction, // Only enable in development
          ssl: isProduction ? { rejectUnauthorized: false } : false,
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
