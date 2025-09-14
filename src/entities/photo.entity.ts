import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'geojson';
import { Visit } from './visit.entity';
import { HikeRecord } from './hike-record.entity';
import { User } from './user.entity';

@Entity()
export class Photo {
  @ApiProperty({
    description: 'Unique identifier for the photo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'URL to the stored photo',
    example: 'https://your-s3-bucket.amazonaws.com/photos/half-dome-summit.jpg',
  })
  @Column()
  url: string;

  @ApiProperty({
    description: 'Caption for the photo',
    example: 'Summit view from Half Dome',
    required: false,
  })
  @Column({ nullable: true })
  caption: string;

  @ApiProperty({
    description: 'Date the photo was taken',
    example: '2023-07-16',
    required: false,
  })
  @Column('date', { nullable: true })
  dateTaken: Date;

  @ApiProperty({
    description: 'Geographic coordinates where the photo was taken',
    example: { type: 'Point', coordinates: [-119.5324, 37.7459] },
    required: false,
  })
  @Column('point', { nullable: true })
  location: Point;

  @ApiProperty({
    description: 'The user who owns this photo',
    type: () => User,
  })
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({
    description: 'The park visit this photo is associated with',
    type: () => Visit,
    required: false,
  })
  @ManyToOne(() => Visit, { nullable: true })
  visit: Visit;

  @ApiProperty({
    description: 'The specific hike this photo is associated with',
    type: () => HikeRecord,
    required: false,
  })
  @ManyToOne(() => HikeRecord, { nullable: true })
  hikeRecord: HikeRecord;
}
