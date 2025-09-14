import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name);

  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto, userId: string): Promise<Photo> {
    try {
      const photo = this.photosRepository.create({
        ...createPhotoDto,
        user: { id: userId },
      });
      return await this.photosRepository.save(photo);
    } catch (error) {
      this.logger.error(`Error creating photo: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(userId: string): Promise<Photo[]> {
    try {
      return await this.photosRepository.find({
        where: { user: { id: userId } },
        relations: ['visit', 'hikeRecord', 'user'],
      });
    } catch (error) {
      this.logger.error(
        `Error finding photos for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string, userId: string): Promise<Photo> {
    try {
      const photo = await this.photosRepository.findOne({
        where: { id, user: { id: userId } },
        relations: ['visit', 'hikeRecord', 'user'],
      });
      if (!photo) {
        throw new NotFoundException(`Photo with ID ${id} not found`);
      }
      return photo;
    } catch (error) {
      this.logger.error(
        `Error finding photo ${id} for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updatePhotoDto: UpdatePhotoDto,
    userId: string,
  ): Promise<Photo> {
    try {
      const photo = await this.findOne(id, userId);
      Object.assign(photo, updatePhotoDto);
      return await this.photosRepository.save(photo);
    } catch (error) {
      this.logger.error(
        `Error updating photo ${id} for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const photo = await this.findOne(id, userId);
      await this.photosRepository.remove(photo);
    } catch (error) {
      this.logger.error(
        `Error removing photo ${id} for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByVisit(visitId: string, userId: string): Promise<Photo[]> {
    try {
      return await this.photosRepository.find({
        where: { visit: { id: visitId }, user: { id: userId } },
        relations: ['visit', 'hikeRecord', 'user'],
      });
    } catch (error) {
      this.logger.error(
        `Error finding photos for visit ${visitId} and user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByHikeRecord(
    hikeRecordId: string,
    userId: string,
  ): Promise<Photo[]> {
    try {
      return await this.photosRepository.find({
        where: { hikeRecord: { id: hikeRecordId }, user: { id: userId } },
        relations: ['visit', 'hikeRecord', 'user'],
      });
    } catch (error) {
      this.logger.error(
        `Error finding photos for hike record ${hikeRecordId} and user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
