import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParksService } from './parks.service';
import { CreateParkDto } from './dto/create-park.dto';
import { UpdateParkDto } from './dto/update-park.dto';
import { ParkDto } from './dto/park.dto';

@ApiTags('parks')
@Controller('parks')
export class ParksController {
  constructor(private readonly parksService: ParksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new park' })
  @ApiResponse({ status: 201, description: 'The park has been successfully created.', type: ParkDto })
  create(@Body() createParkDto: CreateParkDto) {
    return this.parksService.create(createParkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all parks' })
  @ApiResponse({ status: 200, description: 'Return all parks.', type: [ParkDto] })
  findAll() {
    return this.parksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a park by id' })
  @ApiResponse({ status: 200, description: 'Return the park.', type: ParkDto })
  @ApiResponse({ status: 404, description: 'Park not found.' })
  findOne(@Param('id') id: string) {
    return this.parksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a park' })
  @ApiResponse({ status: 200, description: 'The park has been successfully updated.', type: ParkDto })
  @ApiResponse({ status: 404, description: 'Park not found.' })
  update(
    @Param('id') id: string,
    @Body() updateParkDto: UpdateParkDto,
  ) {
    return this.parksService.update(id, updateParkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a park' })
  @ApiResponse({ status: 200, description: 'The park has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Park not found.' })
  remove(@Param('id') id: string) {
    return this.parksService.remove(id);
  }
} 