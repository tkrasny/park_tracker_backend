import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from '../entities/photo.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, RequestUser } from '../common/auth/user.decorator';

@ApiTags('photos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new photo',
    description: 'Creates a new photo with the provided information',
  })
  @ApiResponse({
    status: 201,
    description: 'The photo has been successfully created.',
    type: Photo,
  })
  create(
    @Body() createPhotoDto: CreatePhotoDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.photosService.create(createPhotoDto, user.dbUser.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all photos',
    description: 'Retrieves a list of all photos in the system',
  })
  @ApiQuery({
    name: 'visitId',
    required: false,
    description: 'Filter photos by visit ID',
  })
  @ApiQuery({
    name: 'hikeRecordId',
    required: false,
    description: 'Filter photos by hike record ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all photos.',
    type: [Photo],
  })
  findAll(
    @CurrentUser() user: RequestUser,
    @Query('visitId') visitId?: string,
    @Query('hikeRecordId') hikeRecordId?: string,
  ) {
    if (visitId) {
      return this.photosService.findByVisit(visitId, user.dbUser.id);
    }
    if (hikeRecordId) {
      return this.photosService.findByHikeRecord(hikeRecordId, user.dbUser.id);
    }
    return this.photosService.findAll(user.dbUser.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a photo by id',
    description: 'Retrieves a specific photo by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the photo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the photo.',
    type: Photo,
  })
  @ApiResponse({
    status: 404,
    description: 'Photo not found.',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.photosService.findOne(id, user.dbUser.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a photo',
    description: "Updates an existing photo's information",
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the photo to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The photo has been successfully updated.',
    type: Photo,
  })
  @ApiResponse({
    status: 404,
    description: 'Photo not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.photosService.update(id, updatePhotoDto, user.dbUser.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a photo',
    description: 'Removes a photo from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the photo to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The photo has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Photo not found.',
  })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.photosService.remove(id, user.dbUser.id);
  }
}
