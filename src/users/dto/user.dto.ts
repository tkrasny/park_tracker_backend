import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto/base.dto';

export class UserDto extends BaseDto {
  @ApiProperty({ description: 'Username for identification', example: 'hikerlover42' })
  username: string;

  @ApiProperty({ description: 'User\'s display name', example: 'Mountain Explorer', required: false })
  displayName?: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'URL to user profile picture', required: false })
  profilePictureUrl?: string;

  @ApiProperty({ description: 'Whether the user is an admin' })
  isAdmin: boolean;
} 