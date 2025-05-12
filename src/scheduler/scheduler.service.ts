import { Injectable } from '@nestjs/common';
import { SchedulerRepository } from '@/app/repositories/scheduler/scheduler.repository';
import { SchedulerModel } from '@/app/models/scheduler/scheduler.model';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly schedulerRepository: SchedulerRepository,
  ) {}


  async createScheduler(payload: SchedulerModel): Promise<SchedulerModel> {
    return this.schedulerRepository.create(payload);
  }
}
