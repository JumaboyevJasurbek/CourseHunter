import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lang: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    categories_id: string;
}
