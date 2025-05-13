import { Injectable } from '@nestjs/common';
import { SchedulerModel } from '../../models/scheduler/scheduler.model';
import { PostgresRepository } from '../postgresBase.repository';
import { DataSource } from 'typeorm';
import { UserType } from '@/app/contracts/enums/usertype.enum';
@Injectable()
export class SchedulerRepository extends PostgresRepository<SchedulerModel> {
  constructor(dataSource: DataSource) {
    super(SchedulerModel, dataSource);
  }

  async getScheduler(user_id: number, user_type: UserType) {
    const select = [
      'schedulers.id',
      'schedulers.schedule_day',
      'schedulers.date',
      'slots.id',
      'slots.start_time',
      'slots.end_time',
      'slots.schedule_id',
    ];

    if (user_type == UserType.PATIENT) {
      select.push('bookingSlots.id', 'bookingSlots.time', 'bookingSlots.is_booked');
    }

    const query = this.repository
      .createQueryBuilder('schedulers')
      .select(select)
      .leftJoin('schedulers.slots', 'slots')
      .where('schedulers.user_id = :user_id', { user_id });

    if (user_type == UserType.PATIENT) {
      query.leftJoin('slots.bookingSlots', 'bookingSlots');
    }

    return query.getMany();
  }
}
