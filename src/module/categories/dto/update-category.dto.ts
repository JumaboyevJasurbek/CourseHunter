import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string;
}
