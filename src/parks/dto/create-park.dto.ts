import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { Point } from 'geojson';

export class CreateParkDto {
  @ApiProperty({ description: 'Full name of the national park', example: 'Yosemite National Park' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'National Park Service code', example: 'YOSE' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Geographic coordinates of the park center',
    example: { type: 'Point', coordinates: [-119.5383, 37.8651] },
    required: false
  })
  @IsObject()
  @IsOptional()
  location?: Point;

  @ApiProperty({ 
    description: 'Brief description of the park', 
    example: "Yosemite National Park is in California's Sierra Nevada mountains", 
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'State where the park is located', example: 'California', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'Geographic region of the park', example: 'Pacific West', required: false })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ 
    description: 'URL to the park\'s primary image', 
    example: 'https://www.nps.gov/common/uploads/structured_data/yosemite_image.jpg', 
    required: false 
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ 
    description: 'Official park website URL', 
    example: 'https://www.nps.gov/yose/', 
    required: false 
  })
  @IsString()
  @IsOptional()
  websiteUrl?: string;
} 