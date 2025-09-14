import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from '../entities/visit.entity';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { User } from '../entities/user.entity';
import { Park } from '../entities/park.entity';

@Injectable()
export class VisitsService {
  private readonly logger = new Logger(VisitsService.name);

  constructor(
    @InjectRepository(Visit)
    private visitsRepository: Repository<Visit>,
    @InjectRepository(Park)
    private parkRepository: Repository<Park>,
  ) {}

  async create(createVisitDto: CreateVisitDto, user: User): Promise<Visit> {
    const park = await this.parkRepository.findOne({
      where: { id: createVisitDto.parkId },
    });

    if (!park) {
      throw new NotFoundException(
        `Park with ID ${createVisitDto.parkId} not found`,
      );
    }

    const visit = this.visitsRepository.create({
      ...createVisitDto,
      visitDate: new Date(createVisitDto.visitDate),
      user,
      park,
    });

    return await this.visitsRepository.save(visit);
  }

  async findAll(user: User): Promise<Visit[]> {
    try {
      return await this.visitsRepository.find({
        where: { user: { id: user.id } },
        relations: ['user', 'park', 'hikeRecords', 'photos'],
      });
    } catch (error) {
      this.logger.error(
        `Error finding visits for user ${user.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string, user: User): Promise<Visit> {
    const visit = await this.visitsRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['user', 'park', 'hikeRecords', 'photos'],
    });

    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    return visit;
  }

  async update(
    id: string,
    updateVisitDto: UpdateVisitDto,
    user: User,
  ): Promise<Visit> {
    const visit = await this.findOne(id, user);
    Object.assign(visit, updateVisitDto);
    return await this.visitsRepository.save(visit);
  }

  async remove(id: string, user: User): Promise<void> {
    const visit = await this.findOne(id, user);
    await this.visitsRepository.remove(visit);
  }

  async findByPark(parkId: string, userId: string): Promise<Visit[]> {
    return await this.visitsRepository.find({
      where: { park: { id: parkId }, user: { id: userId } },
      relations: ['user', 'park', 'hikeRecords', 'photos'],
    });
  }
}
