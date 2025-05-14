import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const photo = this.photosRepository.create(createPhotoDto);
    return await this.photosRepository.save(photo);
  }

  async findAll(): Promise<Photo[]> {
    return await this.photosRepository.find({
      relations: ['visit', 'hikeRecord'],
    });
  }

  async findOne(id: string): Promise<Photo> {
    const photo = await this.photosRepository.findOne({
      where: { id },
      relations: ['visit', 'hikeRecord'],
    });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    return photo;
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
    const photo = await this.findOne(id);
    Object.assign(photo, updatePhotoDto);
    return await this.photosRepository.save(photo);
  }

  async remove(id: string): Promise<void> {
    const photo = await this.findOne(id);
    await this.photosRepository.remove(photo);
  }

  async findByVisit(visitId: string): Promise<Photo[]> {
    return await this.photosRepository.find({
      where: { visit: { id: visitId } },
      relations: ['visit', 'hikeRecord'],
    });
  }

  async findByHikeRecord(hikeRecordId: string): Promise<Photo[]> {
    return await this.photosRepository.find({
      where: { hikeRecord: { id: hikeRecordId } },
      relations: ['visit', 'hikeRecord'],
    });
  }
} 