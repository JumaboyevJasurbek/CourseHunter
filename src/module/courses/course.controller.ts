import { CreateCourseDto } from './dto/create-course.dto';
import { GetTaskFilterDto } from './dto/get-search-filter';
import { CoursesEntity } from './../../entities/courses.entity';
import { googleCloud } from './../../utils/google-cloud';
import { TokenMiddleware } from 'src/middleWare/token.middleware';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Headers, UploadedFile } from '@nestjs/common/decorators';

@Controller('courses')
@ApiTags('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly verifyToken: TokenMiddleware,
  ) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiCreatedResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers: any,
  ) {
    if (await this.verifyToken.verifyAdmin(headers)) {
      const imgLink = await googleCloud(file);
      return this.courseService.create(createCourseDto, imgLink);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('/bycategory/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  findOne(@Param('id') cat_id: string) {
    return this.courseService.byCategory(cat_id);
  }

  @Get('/search')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  findByTitle(@Query() filter: GetTaskFilterDto) {
    if (Object.keys(filter).length) {
      return this.courseService.searchTitle(filter);
    } else {
      return this.courseService.findAll();
    }
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers: any,
  ) {
    const imgLink: any = googleCloud(file);
    if (await this.verifyToken.verifyAdmin(headers)) {
      return this.courseService.update(id, updateCourseDto, imgLink);
    }
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  async remove(@Param('id') id: string, @Headers() headers: any) {
    if (await this.verifyToken.verifyAdmin(headers)) {
      await this.courseService.remove(id);
    }
  }
}
