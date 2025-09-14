import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';

export class CreateTrailDto {
  @ApiProperty({ description: 'Name of the trail', example: 'Half Dome Trail' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Length of the trail in miles',
    example: 14.2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  length?: number;

  @ApiProperty({
    description: 'Difficulty level of the trail',
    example: 'Difficult',
    enum: ['Easy', 'Moderate', 'Difficult', 'Strenuous'],
    required: false,
  })
  @IsEnum(['Easy', 'Moderate', 'Difficult', 'Strenuous'])
  @IsOptional()
  difficulty?: string;

  @ApiProperty({
    description: 'Elevation gain in feet',
    example: 4800,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  elevationGain?: number;

  @ApiProperty({
    description: 'GeoJSON representing the trail path',
    example: {
      type: 'LineString',
      coordinates: [
        [-119.5383, 37.8651],
        [-119.5324, 37.7459],
      ],
    },
    required: false,
  })
  @IsOptional()
  trailPath?: any;

  @ApiProperty({ description: 'ID of the park this trail belongs to' })
  @IsUUID()
  parkId: string;
}
