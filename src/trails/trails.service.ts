import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trail } from '../entities/trail.entity';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';

@Injectable()
export class TrailsService {
  constructor(
    @InjectRepository(Trail)
    private trailsRepository: Repository<Trail>,
  ) {}

  async create(createTrailDto: CreateTrailDto): Promise<Trail> {
    const trail = this.trailsRepository.create(createTrailDto);
    return await this.trailsRepository.save(trail);
  }

  async findAll(): Promise<Trail[]> {
    return await this.trailsRepository.find({
      relations: ['park'],
    });
  }

  async findOne(id: string): Promise<Trail> {
    const trail = await this.trailsRepository.findOne({
      where: { id },
      relations: ['park'],
    });
    if (!trail) {
      throw new NotFoundException(`Trail with ID ${id} not found`);
    }
    return trail;
  }

  async update(id: string, updateTrailDto: UpdateTrailDto): Promise<Trail> {
    const trail = await this.findOne(id);
    Object.assign(trail, updateTrailDto);
    return await this.trailsRepository.save(trail);
  }

  async remove(id: string): Promise<void> {
    const trail = await this.findOne(id);
    await this.trailsRepository.remove(trail);
  }

  async findByPark(parkId: string): Promise<Trail[]> {
    return await this.trailsRepository.find({
      where: { park: { id: parkId } },
      relations: ['park'],
    });
  }
} 