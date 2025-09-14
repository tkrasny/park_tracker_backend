import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trail } from '../entities/trail.entity';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';

@Injectable()
export class TrailsService {
  private readonly logger = new Logger(TrailsService.name);

  constructor(
    @InjectRepository(Trail)
    private trailsRepository: Repository<Trail>,
  ) {}

  async create(createTrailDto: CreateTrailDto): Promise<Trail> {
    try {
      const trail = this.trailsRepository.create(createTrailDto);
      return await this.trailsRepository.save(trail);
    } catch (error) {
      this.logger.error(`Error creating trail: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Trail[]> {
    try {
      return await this.trailsRepository.find({
        relations: ['park'],
      });
    } catch (error) {
      this.logger.error(
        `Error finding all trails: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Trail> {
    try {
      const trail = await this.trailsRepository.findOne({
        where: { id },
        relations: ['park'],
      });
      if (!trail) {
        throw new NotFoundException(`Trail with ID ${id} not found`);
      }
      return trail;
    } catch (error) {
      this.logger.error(
        `Error finding trail ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: string, updateTrailDto: UpdateTrailDto): Promise<Trail> {
    try {
      const trail = await this.findOne(id);
      Object.assign(trail, updateTrailDto);
      return await this.trailsRepository.save(trail);
    } catch (error) {
      this.logger.error(
        `Error updating trail ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const trail = await this.findOne(id);
      await this.trailsRepository.remove(trail);
    } catch (error) {
      this.logger.error(
        `Error removing trail ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByPark(parkId: string): Promise<Trail[]> {
    try {
      return await this.trailsRepository.find({
        where: { park: { id: parkId } },
        relations: ['park'],
      });
    } catch (error) {
      this.logger.error(
        `Error finding trails for park ${parkId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
