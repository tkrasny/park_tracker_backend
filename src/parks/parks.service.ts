import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Park } from '../entities/park.entity';
import { CreateParkDto } from './dto/create-park.dto';
import { UpdateParkDto } from './dto/update-park.dto';

@Injectable()
export class ParksService {
  private readonly logger = new Logger(ParksService.name);

  constructor(
    @InjectRepository(Park)
    private parksRepository: Repository<Park>,
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
      this.logger.error(`Error finding all parks: ${error.message}`, error.stack);
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
      this.logger.error(`Error finding park ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateParkDto: UpdateParkDto): Promise<Park> {
    try {
      const park = await this.findOne(id);
      Object.assign(park, updateParkDto);
      return await this.parksRepository.save(park);
    } catch (error) {
      this.logger.error(`Error updating park ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const park = await this.findOne(id);
      await this.parksRepository.remove(park);
    } catch (error) {
      this.logger.error(`Error removing park ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 