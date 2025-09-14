import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto/base.dto';

export class VisitDto extends BaseDto {
  @ApiProperty({ description: 'Date of the park visit' })
  visitDate: Date;

  @ApiProperty({
    description: 'Personal notes about the visit',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Weather data during the visit',
    required: false,
  })
  weatherData?: any;

  @ApiProperty({ description: 'ID of the park visited' })
  parkId: string;

  @ApiProperty({ description: 'ID of the user who made the visit' })
  userId: string;
}