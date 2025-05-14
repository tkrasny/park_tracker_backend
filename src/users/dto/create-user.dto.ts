import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Username for identification',
    example: 'hikerlover42',
    minLength: 3,
    maxLength: 30
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ 
    description: 'User\'s display name',
    example: 'Mountain Explorer',
    required: false,
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @IsOptional()
  displayName?: string;
} 