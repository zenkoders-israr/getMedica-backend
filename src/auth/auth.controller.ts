import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDto, RegisterUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { BaseController } from '../app/commons/base.controller';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardFactory } from '@/app/guards/auth.guard';
import { UserType } from '@/app/contracts/enums/usertype.enum';
import { JwtPayload } from '@/app/contracts/types/jwtPayload.type';
import { User } from '@/app/decorators/user.decorator';

@ApiTags('Auth')
@ApiBearerAuth('JWT')
@Controller()
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('auth/register-doctor')
  async registerDoctor(@Body() payload: RegisterUserDto, @Res() res: Response) {
    const user = await this.authService.register(payload, UserType.DOCTOR);
    return this.OKResponse(res, user);
  }


  @Post('auth/register-patient')
  async registerPatient(@Body() payload: RegisterUserDto, @Res() res: Response) {
    const user = await this.authService.register(payload, UserType.PATIENT);
    return this.OKResponse(res, user);
  }

  @Post('auth/login')
  async login(@Body() credentials: LoginUserDto, @Res() res: Response) {
    const user = await this.authService.login(credentials);
    return this.OKResponse(res, user);
  }

  @UseGuards(AuthGuardFactory([UserType.DOCTOR, UserType.PATIENT]))
  @Get('auth/me')
  async getAuthUser(@Res() res: Response, @User() user: JwtPayload) {
    const authUser = await this.authService.getAuthUser(user);
    return this.OKResponse(res, authUser);
  }
}
