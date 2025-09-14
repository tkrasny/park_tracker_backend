import { ApiProperty } from '@nestjs/swagger';
import { ParkDto } from './park.dto';
import { VisitDto } from '../../visits/dto/visit.dto';

export class ParkWithVisitDto extends ParkDto {
  @ApiProperty({
    description: 'Visit data for this park by the current user',
    type: VisitDto,
    required: false,
  })
  visit?: VisitDto;

  @ApiProperty({
    description: 'Whether the current user has visited this park',
    example: true,
  })
  hasVisited: boolean;
}