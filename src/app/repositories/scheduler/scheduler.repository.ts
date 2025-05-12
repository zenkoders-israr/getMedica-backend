import { Injectable } from '@nestjs/common';
import { SchedulerModel } from '../../models/scheduler/scheduler.model';
import { PostgresRepository } from '../postgresBase.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class SchedulerRepository extends PostgresRepository<SchedulerModel> {
  constructor(dataSource: DataSource) {
    super(SchedulerModel, dataSource);
  }

  async getScheduler(user_id: number) {
    const query = this.repository
      .createQueryBuilder('schedulers')
      .select([
        'schedulers.id',
        'schedulers.schedule_day',
        'schedulers.date',
        'slots.id',
        'slots.start_time',
        'slots.end_time',
        'slots.schedule_id',
        'slots.booked',
        'slots.patient_id',
      ])
      .leftJoin('schedulers.slots', 'slots')
      .where('schedulers.user_id = :user_id', { user_id });
    return query.getMany();
  }
}
