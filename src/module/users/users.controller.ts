import {
  Get,
  Body,
  Patch,
  Post,
  Delete,
  Headers,
  Controller,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegistrUserDto } from './dto/registr';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  @Post('/registr')
  regustr(@Body() body: RegistrUserDto) {
    return this.usersService.registr(body);
  }

  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() body: RegistrUserDto) {
    return this.usersService.login(body);
  }

  @Get('/admin/getall')
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  getAdmin(@Headers() headers: any) {
    return this.usersService.getAdmin(headers);
  }

  @Get('/one')
  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: true,
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  getOne(@Headers() headers: any) {
    return this.usersService.getOne(headers);
  }

  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: true,
  })
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  @Patch('/update')
  update(@Headers() headers: any, @Body() body: UpdateUserDto) {
    return this.usersService.update(headers, body);
  }

  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: true,
  })
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/delete')
  deleteUser(@Headers() headers: any) {
    return this.usersService.deleteUser(headers);
  }
}
