import { Body, Controller, Patch, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SchedulerService } from './scheduler.service';
import { BaseController } from '../app/commons/base.controller';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
 @Patch('scheduler/create')
  async createScheduler(@Body() payload: CreateSchedulerDto[], @User() user: JwtPayload, @Res() res: Response) {
    const scheduler = await this.schedulerService.upsertScheduler(payload, user);
    return this.OKResponse(res, scheduler);
  }
}
