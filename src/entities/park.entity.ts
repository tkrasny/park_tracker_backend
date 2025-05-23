import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Trail } from './trail.entity';

@Entity()
export class Park {
  @ApiProperty({ description: 'Unique identifier for the park', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Full name of the national park', example: 'Yosemite National Park' })
  @Column()
  name: string;

  @ApiProperty({ description: 'National Park Service code', example: 'YOSE' })
  @Column()
  code: string;

  @ApiProperty({
    description: 'Latitude coordinate of the park center',
    example: 37.8651,
    required: false
  })
  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate of the park center',
    example: -119.5383,
    required: false
  })
  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  longitude: number;

  @ApiProperty({ 
    description: 'Brief description of the park', 
    example: "Yosemite National Park is in California's Sierra Nevada mountains", 
    required: false 
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({ description: 'State where the park is located', example: 'California', required: false })
  @Column({ nullable: true })
  state: string;

  @ApiProperty({ description: 'Geographic region of the park', example: 'Pacific West', required: false })
  @Column({ nullable: true })
  region: string;

  @ApiProperty({ 
    description: 'URL to the park\'s primary image', 
    example: 'https://www.nps.gov/common/uploads/structured_data/yosemite_image.jpg', 
    required: false 
  })
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({ 
    description: 'Official park website URL', 
    example: 'https://www.nps.gov/yose/', 
    required: false 
  })
  @Column({ nullable: true })
  websiteUrl: string;
} 