import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'geojson';
import { Visit } from './visit.entity';
import { HikeRecord } from './hike-record.entity';

@Entity()
export class Photo {
  @ApiProperty({ description: 'Unique identifier for the photo', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    description: 'URL to the stored photo', 
    example: 'https://your-s3-bucket.amazonaws.com/photos/half-dome-summit.jpg' 
  })
  @Column()
  url: string;

  @ApiProperty({ description: 'Caption for the photo', example: 'Summit view from Half Dome', required: false })
  @Column({ nullable: true })
  caption: string;

  @ApiProperty({ description: 'Date the photo was taken', example: '2023-07-16', required: false })
  @Column('date', { nullable: true })
  dateTaken: Date;

  @ApiProperty({
    description: 'Geographic coordinates where the photo was taken',
    example: { type: 'Point', coordinates: [-119.5324, 37.7459] },
    required: false
  })
  @Column('point', { nullable: true })
  location: Point;

  @ApiProperty({ description: 'The park visit this photo is associated with', required: false })
  @ManyToOne(() => Visit, visit => visit.photos, { nullable: true })
  visit: Visit;

  @ApiProperty({ description: 'The specific hike this photo is associated with', required: false })
  @ManyToOne(() => HikeRecord, hikeRecord => hikeRecord.photos, { nullable: true })
  hikeRecord: HikeRecord;
} 