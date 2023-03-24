import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsEnum } from 'class-validator/types/decorator/decorators';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @IsString()
    @IsOptional()
    title: string;
  
    @IsString()
    @IsOptional()
    lang: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    categories_id: string;
}
