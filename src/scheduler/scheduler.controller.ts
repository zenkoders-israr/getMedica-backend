import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SchedulerService } from './scheduler.service';
import { BaseController } from '../app/commons/base.controller';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuardFactory } from '@/app/guards/auth.guard';
import { UserType } from '@/app/contracts/enums/usertype.enum';
import { CreateSchedulerDto } from './scheduler.dto';
import { JwtPayload } from '@/app/contracts/types/jwtPayload.type';
import { User } from '@/app/decorators/user.decorator';
@ApiTags('Scheduler')
@ApiBearerAuth('JWT')
@Controller()
export class SchedulerController extends BaseController {
  constructor(private schedulerService: SchedulerService) {
    super();
  }

  @UseGuards(AuthGuardFactory([UserType.DOCTOR]))
  @Put('scheduler/create')
  async createScheduler(
    @Body() payload: CreateSchedulerDto[],
    @User() user: JwtPayload,
    @Res() res: Response,
  ) {
    const scheduler = await this.schedulerService.upsertScheduler(
      payload,
      user,
    );
    return this.OKResponse(res, scheduler);
  }

  @UseGuards(AuthGuardFactory([UserType.DOCTOR, UserType.PATIENT]))
  @Get('scheduler/:doctor_id?')
  @ApiParam({
    name: 'doctor_id',
    required: false,
    description: "The doctor's ID (optional)",
    type: Number,
  })
  async getScheduler(
    @Param('doctor_id') doctor_id: string | undefined,
    @User() user: JwtPayload,
    @Res() res: Response,
  ) {
    const scheduler = await this.schedulerService.getScheduler(
      user,
      Number(doctor_id),
    );
    return this.OKResponse(res, scheduler);
  }
}
