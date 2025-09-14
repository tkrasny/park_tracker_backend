import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Trail } from './trail.entity';
import { Visit } from './visit.entity';
import { Photo } from './photo.entity';

@Entity()
export class HikeRecord {
  @ApiProperty({
    description: 'Unique identifier for the hike record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Date of the hike', example: '2023-07-16' })
  @Column('date')
  hikeDate: Date;

  @ApiProperty({
    description: 'Duration of the hike in hours',
    example: 5.5,
    required: false,
  })
  @Column('float', { nullable: true })
  duration: number;

  @ApiProperty({
    description: 'Distance hiked in miles',
    example: 8.2,
    required: false,
  })
  @Column('float', { nullable: true })
  distance: number;

  @ApiProperty({
    description: 'Personal notes about the hike',
    example: 'Trail was muddy near the waterfall',
    required: false,
  })
  @Column({ nullable: true })
  notes: string;

  @ApiProperty({
    description: 'The trail that was hiked',
    type: () => Trail,
    required: false,
  })
  @ManyToOne(() => Trail, { nullable: true })
  trail: Trail;

  @ApiProperty({
    description: 'The park visit this hike was part of',
    type: () => Visit,
  })
  @ManyToOne(() => Visit)
  visit: Visit;

  @ApiHideProperty()
  @OneToMany(() => Photo, () => {})
  photos: Photo[];
}
