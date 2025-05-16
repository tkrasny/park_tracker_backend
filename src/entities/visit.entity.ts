import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Park } from './park.entity';
import { HikeRecord } from './hike-record.entity';
import { Photo } from './photo.entity';

@Entity()
export class Visit {
  @ApiProperty({ description: 'Unique identifier for the visit', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Date of the park visit', example: '2023-07-15' })
  @Column('date')
  visitDate: Date;

  @ApiProperty({ 
    description: 'Personal notes about the visit', 
    example: 'Beautiful weather, saw three bears!', 
    required: false 
  })
  @Column({ nullable: true })
  notes: string;

  @ApiProperty({ 
    description: 'Weather data during the visit', 
    example: { temperature: 75, conditions: 'Sunny' },
    required: false 
  })
  @Column('jsonb', { nullable: true })
  weatherData: any;

  @ApiProperty({ description: 'The user who made this visit', type: () => User })
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({ description: 'The park that was visited', type: () => Park })
  @ManyToOne(() => Park)
  park: Park;

  @ApiHideProperty()
  @OneToMany(() => HikeRecord, hikeRecord => hikeRecord.visit)
  hikeRecords: HikeRecord[];

  @ApiHideProperty()
  @OneToMany(() => Photo, photo => photo.visit)
  photos: Photo[];
} 