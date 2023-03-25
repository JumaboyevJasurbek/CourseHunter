import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenMiddleware } from 'src/middleWare/token.middleware';



@Injectable()
export class UsersService {
  constructor(
    private readonly tokenmiddleware: TokenMiddleware
  ){}

  async verifyUser(headers: any){
    const getUserId = await this.tokenmiddleware.verifyUser(headers)
    .catch((): any => {
      throw new HttpException('bad request in token', HttpStatus.BAD_REQUEST)
    })

    return getUserId
  }

  async getAdmin(headers: any): Promise<UsersEntity[] | any[]>{
    const verifyAdmin = await this.tokenmiddleware.verifyAdmin(headers)
    .catch((): any => {
      throw new HttpException('bad request in Admin token', HttpStatus.BAD_REQUEST)
    })

    if(verifyAdmin){
      const getAllUsers: UsersEntity[] | any[] = (await UsersEntity.find()).filter(e => delete e.password)
      // deleting users passwords

      return getAllUsers
    }
  }

  async update(headers: any, payload: UpdateUserDto): Promise<void> {
      const getUserId = await this.verifyUser(headers)
      if(getUserId){
        await UsersEntity.createQueryBuilder()
        .update({name: payload.user_name})
        .where({
          id: getUserId
        })
        .execute()
        .catch((): any => {
          throw new HttpException('bad request', HttpStatus.BAD_REQUEST)
        })
      }
  }

  async deleteUser(headers: any): Promise<void> {
    const getUserId = await this.tokenmiddleware.verifyUser(headers)
    .catch((): any => {
      throw new HttpException('bad request in token', HttpStatus.BAD_REQUEST)
    })
    
    await UsersEntity.createQueryBuilder()
    .delete()
    .where({id: getUserId})
    .execute()
    .catch((): any => {
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST)
    })
  }
}
