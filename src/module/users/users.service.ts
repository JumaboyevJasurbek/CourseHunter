import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenMiddleware } from 'src/middleWare/token.middleware';
import { RegistrUserDto } from './dto/registr';
import jwt from 'src/utils/jwt';

@Injectable()
export class UsersService {
  constructor(private readonly tokenmiddleware: TokenMiddleware) { }

  async verifyUser(headers: any) {
    const getUserId = await this.tokenmiddleware
      .verifyUser(headers)
      .catch((): any => {
        throw new HttpException('bad request in token', HttpStatus.BAD_REQUEST);
      });

    return getUserId;
  }

  async registr(body: RegistrUserDto) {
    const allReady = await UsersEntity.findOne({
      where: {
        email: body.email,
        password: body.password
      }
    })
    .catch(() => {})

    if (allReady) {
      throw new HttpException('User Already exists', HttpStatus.BAD_REQUEST);
    }

    const { raw: [raw] } = await UsersEntity.createQueryBuilder()
      .insert()
      .into(UsersEntity).values({
        email: body.email,
        password: body.password
      })
      .returning('*')
      .execute()

    const token = jwt.sign({ id: raw.id, email: raw.email })

    return {
      token,
      status: 201
    }
  }

  async login(body: RegistrUserDto) {
    const allReady = await UsersEntity.findOne({
      where: {
        email: body.email,
        password: body.password
      }
    })
    .catch(() => {})

    if (!allReady) {
      throw new HttpException('User Not Fount', HttpStatus.NOT_FOUND);
    }

    const token = jwt.sign({ id: allReady.id, email: allReady.email })

    return {
      token,
      status: 201
    }
  }

  async getAdmin(headers: any): Promise<UsersEntity[] | any[]> {
    const verifyAdmin = await this.tokenmiddleware
      .verifyAdmin(headers)
      .catch((): any => {
        throw new HttpException(
          'bad request in Admin token',
          HttpStatus.BAD_REQUEST,
        );
      });

    if (verifyAdmin) {
      const getAllUsers: UsersEntity[] | any[] = (
        await UsersEntity.find()
      ).filter((e) => delete e.password);

      return getAllUsers;
    }
  }

  async update(headers: any, payload: UpdateUserDto): Promise<void> {
    const getUserId = await this.verifyUser(headers);
    if (getUserId) {
      await UsersEntity.createQueryBuilder()
        .update({ password: payload.password })
        .where({
          id: getUserId,
        })
        .execute()
        .catch((): any => {
          throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
        });
    }
  }

  async deleteUser(headers: any): Promise<void> {
    const getUserId = await this.tokenmiddleware
      .verifyUser(headers)
      .catch((): any => {
        throw new HttpException('bad request in token', HttpStatus.BAD_REQUEST);
      });

    await UsersEntity.createQueryBuilder()
      .delete()
      .where({ id: getUserId })
      .execute()
      .catch((): any => {
        throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
      });
  }
}
