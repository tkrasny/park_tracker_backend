import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Auth0Guard } from '../common/auth/auth0.guard';
import { CurrentUser, RequestUser } from '../common/auth/user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(Auth0Guard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Retrieves the profile of the currently authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the current user profile.',
    type: UserDto 
  })
  getProfile(@CurrentUser() user: RequestUser) {
    return user.dbUser;
  }

  @Post()
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Creates a new user with the provided username and optional display name'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The user has been successfully created.',
    type: UserDto 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Username already exists.' 
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieves a list of all users in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all users.',
    type: [UserDto] 
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a user by id',
    description: 'Retrieves a specific user by their unique identifier'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the user.',
    type: UserDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a user',
    description: 'Updates an existing user\'s information'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully updated.',
    type: UserDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Username already exists.' 
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a user',
    description: 'Removes a user from the system'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The user has been successfully deleted.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
} 