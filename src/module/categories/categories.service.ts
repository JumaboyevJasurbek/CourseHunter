import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEntity } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  async foundCategory(categoryId:string): Promise<CategoryEntity> {
     const category = await CategoryEntity.findOne({
      where: {
        id: categoryId
      }
     })
     if (!category) {
        throw new NotFoundException()
     }
     return category
  }

  async create(payload: CreateCategoryDto, cat_link: string): Promise<void> {
    await CategoryEntity.createQueryBuilder()
    .insert()
    .into(CategoryEntity)
    .values({
      title: payload.cat_title,
      description: payload.cat_description,
      image: cat_link
    })
    .execute()
    .catch(() => {
      throw new HttpException('Bad Request in catch', HttpStatus.NOT_FOUND);
    });
  }

  async findAll() {
    return await CategoryEntity.find().catch(() => {
      throw new HttpException('Categories Not Found', HttpStatus.NOT_FOUND);
    });
  }

  async update(id: string , payload: UpdateCategoryDto, cat_link): Promise<void> {
    const category = await this.foundCategory(id)
    await CategoryEntity.createQueryBuilder()
    .update()
    .set({
      description: payload.cat_description  || category.description,
      title: payload.cat_title || category.title,
      image: cat_link || category.image
    })
    .where({
      id: id
    })
    .execute()
    .catch(() => {
      throw new HttpException('Bad Request in catch', HttpStatus.NOT_FOUND);
    });
  }

  async remove(id: string): Promise<void> {
    const category = await this.foundCategory(id)
    
    if (category) {
      await CategoryEntity.delete(id)
    }
  }
}