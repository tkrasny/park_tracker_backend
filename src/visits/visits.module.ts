import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';
import { Visit } from '../entities/visit.entity';
import { Park } from '../entities/park.entity';
import { UsersModule } from '../users/users.module';
import { ParksModule } from 'src/parks/parks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Visit, Park]), UsersModule, ParksModule],
  controllers: [VisitsController],
  providers: [VisitsService],
  exports: [VisitsService],
})
export class VisitsModule {}
