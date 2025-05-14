import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsOptional, IsUUID, IsObject } from 'class-validator';

export class CreateVisitDto {
  @ApiProperty({ description: 'Date of the park visit', example: '2023-07-15' })
  @IsDate()
  visitDate: Date;

  @ApiProperty({ 
    description: 'Personal notes about the visit', 
    example: 'Beautiful weather, saw three bears!', 
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ 
    description: 'Weather data during the visit', 
    example: { temperature: 75, conditions: 'Sunny' },
    required: false 
  })
  @IsObject()
  @IsOptional()
  weatherData?: any;

  @ApiProperty({ description: 'ID of the park that was visited' })
  @IsUUID()
  parkId: string;
} 