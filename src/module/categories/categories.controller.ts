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
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { TokenMiddleware } from 'src/middleWare/token.middleware';
import { googleCloud } from 'src/utils/google-cloud';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly verifyToken: TokenMiddleware,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'title', 'description', 'image'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBadRequestResponse()
  @UseInterceptors(FileInterceptor('categories'))
  @ApiHeader({
    name: 'authorization',
    description: 'Authorization',
    required: true,
  })
  async uploadfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
    @Headers() headers: any,
  ) {
    const admin = await this.verifyToken.verifyAdmin(headers);
    if (admin) {
      const cat_link: any = googleCloud(file);
      return await this.categoriesService.create(createCategoryDto, cat_link);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @Get('list')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Patch('update/:id')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'cat_title', 'cat_description', 'cat_image'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          default: 'dsfsgf'
        },
        title: {
          type: 'string',
          default: 'Node.js'
        },
        description: {
          type: 'string',
          default: 'Zo`r dasturlash tili'
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBadRequestResponse()
  @UseInterceptors(FileInterceptor('categories'))
  @ApiHeader({
    name: 'authorization',
    description: 'Authorization',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  async uploadUpdateFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateCategoryDto,
    @Headers() headers: any,
  ) {
    const admin = await this.verifyToken.verifyAdmin(headers);
    const cat_link: any = googleCloud(file);
    if (admin) {
      return await this.categoriesService.update(id, body, cat_link);
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiUnprocessableEntityResponse()
  @ApiForbiddenResponse()
  @Delete('/delete/:id')
  @ApiHeader({
    name: 'authorization',
    description: 'Authorization',
    required: true,
  })
  async remove(@Param('id') id: string, @Headers() headers: any) {
    const admin = await this.verifyToken.verifyAdmin(headers);
    if (admin) {
      return await this.categoriesService.remove(id);
    }
  }
}
