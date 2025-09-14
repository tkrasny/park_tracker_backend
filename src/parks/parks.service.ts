import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Park } from '../entities/park.entity';
import { Visit } from '../entities/visit.entity';
import { User } from '../entities/user.entity';
import { CreateParkDto } from './dto/create-park.dto';
import { UpdateParkDto } from './dto/update-park.dto';
import { ParkWithVisitDto } from './dto/park-with-visit.dto';

@Injectable()
export class ParksService {
  private readonly logger = new Logger(ParksService.name);

  constructor(
    @InjectRepository(Park)
    private parksRepository: Repository<Park>,
    @InjectRepository(Visit)
    private visitsRepository: Repository<Visit>,
  ) {}

  async create(createParkDto: CreateParkDto): Promise<Park> {
    try {
      const park = this.parksRepository.create(createParkDto);
      return await this.parksRepository.save(park);
    } catch (error) {
      this.logger.error(`Error creating park: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Park[]> {
    try {
      return await this.parksRepository.find();
    } catch (error) {
      this.logger.error(
        `Error finding all parks: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Park> {
    try {
      const park = await this.parksRepository.findOne({ where: { id } });
      if (!park) {
        throw new NotFoundException(`Park with ID ${id} not found`);
      }
      return park;
    } catch (error) {
      this.logger.error(
        `Error finding park ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: string, updateParkDto: UpdateParkDto): Promise<Park> {
    try {
      const park = await this.findOne(id);
      Object.assign(park, updateParkDto);
      return await this.parksRepository.save(park);
    } catch (error) {
      this.logger.error(
        `Error updating park ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const park = await this.findOne(id);
      await this.parksRepository.remove(park);
    } catch (error) {
      this.logger.error(
        `Error removing park ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAllWithVisits(user: User): Promise<ParkWithVisitDto[]> {
    try {
      const parks = await this.parksRepository.find();
      const visits = await this.visitsRepository.find({
        where: { user: { id: user.id } },
        relations: ['park'],
      });

      const visitsByParkId = new Map(
        visits.map((visit) => [visit.park.id, visit]),
      );

      return parks.map((park) => {
        const visit = visitsByParkId.get(park.id);
        return {
          ...park,
          hasVisited: !!visit,
          visit: visit
            ? {
                id: visit.id,
                visitDate: visit.visitDate,
                notes: visit.notes,
                weatherData: visit.weatherData,
                parkId: visit.park.id,
                userId: user.id,
                createdAt: visit.createdAt,
                updatedAt: visit.updatedAt,
              }
            : undefined,
          createdAt: park.createdAt,
          updatedAt: park.updatedAt,
        };
      });
    } catch (error) {
      this.logger.error(
        `Error finding parks with visits for user ${user.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
