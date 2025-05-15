import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { Visit } from '../entities/visit.entity';
import { CombinedAuthGuard } from '../common/auth/auth.guard';
import { CurrentUser } from '../common/auth/user.decorator';

@ApiTags('visits')
@ApiBearerAuth()
@UseGuards(CombinedAuthGuard)
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new visit',
    description: 'Creates a new park visit record'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The visit has been successfully created.',
    type: Visit 
  })
  create(@Body() createVisitDto: CreateVisitDto, @CurrentUser() user: any) {
    return this.visitsService.create(createVisitDto, user.dbUser);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all visits',
    description: 'Retrieves a list of all visits for the current user'
  })
  @ApiQuery({
    name: 'parkId',
    required: false,
    description: 'Filter visits by park ID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all visits.',
    type: [Visit] 
  })
  findAll(@CurrentUser() user: any) {
    return this.visitsService.findAll(user.dbUser);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a visit by id',
    description: 'Retrieves a specific visit by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the visit',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the visit.',
    type: Visit 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Visit not found.' 
  })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.visitsService.findOne(id, user.dbUser);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a visit',
    description: 'Updates an existing visit\'s information'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the visit to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The visit has been successfully updated.',
    type: Visit 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Visit not found.' 
  })
  update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto, @CurrentUser() user: any) {
    return this.visitsService.update(id, updateVisitDto, user.dbUser);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a visit',
    description: 'Removes a visit from the system'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the visit to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The visit has been successfully deleted.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Visit not found.' 
  })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.visitsService.remove(id, user.dbUser);
  }
} 