import { Injectable } from '@nestjs/common';
import { SchedulerModel } from '../../models/scheduler/scheduler.model';
import { PostgresRepository } from '../postgresBase.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class SchedulerRepository extends PostgresRepository<SchedulerModel> {
  constructor(dataSource: DataSource) {
    super(SchedulerModel, dataSource);
  }
}
