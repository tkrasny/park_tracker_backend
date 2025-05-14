import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Park } from '../entities/park.entity';
import { CreateParkDto } from './dto/create-park.dto';
import { UpdateParkDto } from './dto/update-park.dto';

@Injectable()
export class ParksService {
  constructor(
    @InjectRepository(Park)
    private parksRepository: Repository<Park>,
  ) {}

  async create(createParkDto: CreateParkDto): Promise<Park> {
    const park = this.parksRepository.create(createParkDto);
    return await this.parksRepository.save(park);
  }

  async findAll(): Promise<Park[]> {
    return await this.parksRepository.find();
  }

  async findOne(id: string): Promise<Park> {
    const park = await this.parksRepository.findOne({ where: { id } });
    if (!park) {
      throw new NotFoundException(`Park with ID ${id} not found`);
    }
    return park;
  }

  async update(id: string, updateParkDto: UpdateParkDto): Promise<Park> {
    const park = await this.findOne(id);
    Object.assign(park, updateParkDto);
    return await this.parksRepository.save(park);
  }

  async remove(id: string): Promise<void> {
    const park = await this.findOne(id);
    await this.parksRepository.remove(park);
  }
} 