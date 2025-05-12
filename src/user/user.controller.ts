import { Controller, Get, Res, UseGuards, Query } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { BaseController } from '../app/commons/base.controller';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardFactory } from '@/app/guards/auth.guard';
import { UserType } from '@/app/contracts/enums/usertype.enum';
import { DoctorSearchDto } from './user.dto';
@ApiTags('User')
@ApiBearerAuth('JWT')
@Controller()
export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  @UseGuards(AuthGuardFactory([UserType.PATIENT]))
  @Get('get-doctors')
  async getDoctors(@Query() query: DoctorSearchDto, @Res() res: Response) {
    const doctors = await this.userService.getDoctors(query);
    return this.OKResponse(res, doctors);
  }
}
