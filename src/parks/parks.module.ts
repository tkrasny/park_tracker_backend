import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParksService } from './parks.service';
import { ParksController } from './parks.controller';
import { Park } from '../entities/park.entity';
import { Visit } from '../entities/visit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Park, Visit])],
  controllers: [ParksController],
  providers: [ParksService],
  exports: [ParksService],
})
export class ParksModule {}
