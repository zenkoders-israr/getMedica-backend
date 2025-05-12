import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SchedulerService } from './scheduler.service';
import { BaseController } from '../app/commons/base.controller';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardFactory } from '@/app/guards/auth.guard';
import { UserType } from '@/app/contracts/enums/usertype.enum';
import { SchedulerModel } from '@/app/models/scheduler/scheduler.model';

@ApiTags('Scheduler')
@ApiBearerAuth('JWT')
@Controller()
export class SchedulerController extends BaseController {
  constructor(private schedulerService: SchedulerService) {
    super();
  }

 @UseGuards(AuthGuardFactory([UserType.DOCTOR]))
 @Post('scheduler/create')
  async createScheduler(@Body() payload: SchedulerModel, @Res() res: Response) {
    const user = await this.schedulerService.createScheduler(payload);
    return this.OKResponse(res, user);
  }
}
