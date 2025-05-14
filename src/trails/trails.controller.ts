import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TrailsService } from './trails.service';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';
import { Trail } from '../entities/trail.entity';

@ApiTags('trails')
@Controller('trails')
export class TrailsController {
  constructor(private readonly trailsService: TrailsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new trail',
    description: 'Creates a new trail with the provided information'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The trail has been successfully created.',
    type: Trail 
  })
  create(@Body() createTrailDto: CreateTrailDto) {
    return this.trailsService.create(createTrailDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all trails',
    description: 'Retrieves a list of all trails in the system'
  })
  @ApiQuery({
    name: 'parkId',
    required: false,
    description: 'Filter trails by park ID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all trails.',
    type: [Trail] 
  })
  findAll(@Query('parkId') parkId?: string) {
    if (parkId) {
      return this.trailsService.findByPark(parkId);
    }
    return this.trailsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a trail by id',
    description: 'Retrieves a specific trail by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the trail',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the trail.',
    type: Trail 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Trail not found.' 
  })
  findOne(@Param('id') id: string) {
    return this.trailsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a trail',
    description: 'Updates an existing trail\'s information'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the trail to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The trail has been successfully updated.',
    type: Trail 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Trail not found.' 
  })
  update(
    @Param('id') id: string,
    @Body() updateTrailDto: UpdateTrailDto,
  ) {
    return this.trailsService.update(id, updateTrailDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a trail',
    description: 'Removes a trail from the system'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the trail to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The trail has been successfully deleted.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Trail not found.' 
  })
  remove(@Param('id') id: string) {
    return this.trailsService.remove(id);
  }
} 