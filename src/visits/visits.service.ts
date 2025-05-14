import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from '../entities/visit.entity';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitsRepository: Repository<Visit>,
  ) {}

  async create(createVisitDto: CreateVisitDto, userId: string): Promise<Visit> {
    const visit = this.visitsRepository.create({
      ...createVisitDto,
      user: { id: userId },
      park: { id: createVisitDto.parkId },
    });
    return await this.visitsRepository.save(visit);
  }

  async findAll(userId: string): Promise<Visit[]> {
    return await this.visitsRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'park', 'hikeRecords', 'photos'],
    });
  }

  async findOne(id: string, userId: string): Promise<Visit> {
    const visit = await this.visitsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'park', 'hikeRecords', 'photos'],
    });
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return visit;
  }

  async update(id: string, updateVisitDto: UpdateVisitDto, userId: string): Promise<Visit> {
    const visit = await this.findOne(id, userId);
    Object.assign(visit, updateVisitDto);
    if (updateVisitDto.parkId) {
      await this.visitsRepository
        .createQueryBuilder()
        .relation(Visit, 'park')
        .of(visit)
        .set({ id: updateVisitDto.parkId });
    }
    return await this.visitsRepository.save(visit);
  }

  async remove(id: string, userId: string): Promise<void> {
    const visit = await this.findOne(id, userId);
    await this.visitsRepository.remove(visit);
  }

  async findByPark(parkId: string, userId: string): Promise<Visit[]> {
    return await this.visitsRepository.find({
      where: { park: { id: parkId }, user: { id: userId } },
      relations: ['user', 'park', 'hikeRecords', 'photos'],
    });
  }
} 