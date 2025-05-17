import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVisitDto {
  @ApiProperty({ 
    description: 'Date of the park visit in ISO format', 
    example: '2023-07-15T00:00:00.000Z' 
  })
  @IsString()
  @Type(() => String)
  visitDate: string;

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