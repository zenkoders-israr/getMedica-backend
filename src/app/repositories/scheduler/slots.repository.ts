import { Injectable } from '@nestjs/common';
import { PostgresRepository } from '../postgresBase.repository';
import { DataSource } from 'typeorm';
import { SlotsModel } from '@/app/models/scheduler/slots.model';

@Injectable()
export class SlotsRepository extends PostgresRepository<SlotsModel> {
  constructor(dataSource: DataSource) {
    super(SlotsModel, dataSource);
  }
}
