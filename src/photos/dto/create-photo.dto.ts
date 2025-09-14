import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDate,
  IsUUID,
  IsObject,
} from 'class-validator';
import { Point } from 'geojson';

export class CreatePhotoDto {
  @ApiProperty({
    description: 'URL to the stored photo',
    example: 'https://your-s3-bucket.amazonaws.com/photos/half-dome-summit.jpg',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Caption for the photo',
    example: 'Summit view from Half Dome',
    required: false,
  })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty({
    description: 'Date the photo was taken',
    example: '2023-07-16',
    required: false,
  })
  @IsDate()
  @IsOptional()
  dateTaken?: Date;

  @ApiProperty({
    description: 'Geographic coordinates where the photo was taken',
    example: { type: 'Point', coordinates: [-119.5324, 37.7459] },
    required: false,
  })
  @IsObject()
  @IsOptional()
  location?: Point;

  @ApiProperty({
    description: 'ID of the park visit this photo is associated with',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  visitId?: string;

  @ApiProperty({
    description: 'ID of the hike record this photo is associated with',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  hikeRecordId?: string;
}
