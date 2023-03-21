import { GoogleRegisterStrategy } from './strategy/google_register.strategy';
import { AuthGoogleController } from './auth_google.controller';
import {JwtModule, JwtService} from '@nestjs/jwt'
import { GoogleLoginStrategy } from './strategy/google_login.strategy';
import { AuthGoogleService } from './auth_google.service';
import { Module } from '@nestjs/common';
import { TokenMiddleware } from 'src/middleWare/token.middleware';

@Module({
  imports: [
    JwtModule.register({secret: process.env.SECRET_KEY}),
  ],
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService, GoogleRegisterStrategy, GoogleLoginStrategy, JwtService, TokenMiddleware]
})
export class AuthGoogleModule {}
