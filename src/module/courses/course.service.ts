import { GetTaskFilterDto } from './dto/get-search-filter';
import { CoursesEntity } from './../../entities/courses.entity';
import {
  Injectable,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CategoryEntity } from 'src/entities/category.entity';

@Injectable()
export class CourseService {
  async byCategory(cat_id: any) {
    const corse = await CategoryEntity.find({
      relations: {
        course: true
      }
    });
    return corse;
  }

  async searchTitle(name: string) {
    const title = name.toLowerCase();
    let tasks: any = this.findAll();

    if (title) {
      tasks = (await tasks).filter((task: any) => task.title.includes(title));
    }
    return tasks;
  }

  async findAll() {
    return await CoursesEntity.find().catch(() => {
      throw new HttpException('BAD GATEWAY', HttpStatus.BAD_GATEWAY);
    });
  }

  async create(createCourseDto: CreateCourseDto, imgLink: any) {
    await CoursesEntity.createQueryBuilder()
      .insert()
      .into(CoursesEntity)
      .values({
        title: createCourseDto.title,
        image: imgLink,
        lang: createCourseDto.lang,
        description: createCourseDto.description,
        course_cat: createCourseDto.category as any,
      })
      .execute()
      .catch(() => {
        throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
      });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, imgLink: any) {
    const course = await CoursesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
    if (!course) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    await CoursesEntity.createQueryBuilder()
      .update()
      .set({
        title: updateCourseDto.title || course.title,
        image: imgLink,
        lang: updateCourseDto.lang || course.lang,
        description: updateCourseDto.description || course.description,
        course_cat: updateCourseDto.categories_id || course.course_cat as any,
      })
      .where({
        id: id,
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async remove(id: string) {
    const course = await CoursesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
    if (!course) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    await CoursesEntity.createQueryBuilder()
      .delete()
      .from(CoursesEntity)
      .where({
        id: id,
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }
}
