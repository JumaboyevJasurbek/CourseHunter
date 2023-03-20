import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAuthGoogleDto } from './dto/update-auth_google.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenMiddleware } from 'src/middleWare/token.middleware';

@Injectable()
export class AuthGoogleService {
  constructor(
    private readonly jwtservice: JwtService, //jwt service
    private readonly tokenmiddleware: TokenMiddleware // token middleware for checking user & admin
  ){}


  async googleRegister(req:any): Promise<string| any> {
    const user = req.user
    //req.user data

    if(!user) {
      return 'No user from google'
    }

    const findUser = await UsersEntity.findOneBy({password: user.password, email: req.email})
    //checking user existance
    if(findUser){
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST)
    }

    const {raw: [raw]} = await UsersEntity.createQueryBuilder()
    .insert()
    .into(UsersEntity)
    .values({name: user.firstName, password: user.password, email: user.email})
    .returning(['user_email', 'user_password', 'user_name'])
    .execute()
    // query

    console.log(raw);
    return this.jwtservice.sign({
        id: raw.id, 
        email: raw.email
      }, {
      secret: process.env.SECRET_KEY
    })
    //sign data
  }

  async googleLogin(req: any): Promise<string | any>{
    const user = req.user
    if(!user){
      return 'no user from google'
    }
    
    const findUser = await UsersEntity.findOneBy({password: user.password, email: req.email})
    if(!findUser){
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST)
    }

    return this.jwtservice.sign({
        id: findUser.id, 
        email: findUser.email
      }, {
        secret: process.env.SECRET_KEY
    })
    //sign data
  }

  async getAdmin(headers: any): Promise<UsersEntity[]>{
    this.tokenmiddleware.verifyAdmin(headers)
    //checking admin token
    
    const findAllUser: any[] = (await UsersEntity.find()).filter(e => delete e.password)
    // deleting users passwords

    return findAllUser
  }
}
