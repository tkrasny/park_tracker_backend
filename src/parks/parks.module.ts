import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParksService } from './parks.service';
import { ParksController } from './parks.controller';
import { Park } from '../entities/park.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Park])],
  controllers: [ParksController],
  providers: [ParksService],
  exports: [ParksService],
})
export class ParksModule {} 