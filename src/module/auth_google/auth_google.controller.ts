import { 
  Controller, 
  UseGuards, 
  Get, 
  Req
} from '@nestjs/common';
import { AuthGoogleService } from './auth_google.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth Google')
@Controller('auth-google')
export class AuthGoogleController {
  constructor(
    private readonly authGoogleService: AuthGoogleService
  ) {}


  @Get('/register')
  @UseGuards(AuthGuard('google_register'))
  googleRegisterRedirect(@Req() req: any) {
    return this.authGoogleService.googleRegister(req)
    // registration from google account
  }

  @Get('/login')
  @UseGuards(AuthGuard('google_login'))
  googleLoginRedirect(@Req() req: any){
    return this.authGoogleService.googleLogin(req)
    // login from google account
  }
}
