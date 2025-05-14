import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Park } from './park.entity';
import { HikeRecord } from './hike-record.entity';

@Entity()
export class Trail {
  @ApiProperty({ description: 'Unique identifier for the trail', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the trail', example: 'Half Dome Trail' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Length of the trail in miles', example: 14.2, required: false })
  @Column('float', { nullable: true })
  length: number;

  @ApiProperty({ 
    description: 'Difficulty level of the trail', 
    example: 'Difficult', 
    enum: ['Easy', 'Moderate', 'Difficult', 'Strenuous'],
    required: false 
  })
  @Column({ nullable: true })
  difficulty: string;

  @ApiProperty({ description: 'Elevation gain in feet', example: 4800, required: false })
  @Column('float', { nullable: true })
  elevationGain: number;

  @ApiProperty({ 
    description: 'GeoJSON representing the trail path', 
    example: { type: 'LineString', coordinates: [[-119.5383, 37.8651], [-119.5324, 37.7459]] },
    required: false 
  })
  @Column('jsonb', { nullable: true })
  trailPath: any;

  @ApiProperty({ description: 'The park this trail belongs to' })
  @ManyToOne(() => Park, park => park.trails)
  park: Park;

  @ApiHideProperty()
  @OneToMany(() => HikeRecord, hikeRecord => hikeRecord.trail)
  hikeRecords: HikeRecord[];
} 