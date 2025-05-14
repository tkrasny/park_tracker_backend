import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto/base.dto';

export class ParkDto extends BaseDto {
  @ApiProperty({ description: 'Name of the national park' })
  name: string;

  @ApiProperty({ description: 'State where the park is located' })
  state: string;

  @ApiProperty({ description: 'Year the park was established', required: false })
  establishedYear?: number;

  @ApiProperty({ description: 'Area of the park in square miles', required: false })
  area?: number;

  @ApiProperty({ description: 'Annual visitor count', required: false })
  annualVisitors?: number;

  @ApiProperty({ description: 'Description of the park', required: false })
  description?: string;
} 