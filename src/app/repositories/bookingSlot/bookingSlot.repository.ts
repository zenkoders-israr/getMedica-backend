import { Injectable } from '@nestjs/common';
import { PostgresRepository } from '../postgresBase.repository';
import { DataSource } from 'typeorm';
import { BookingSlotsModel } from '@/app/models/booking/bookingSlots.model';

@Injectable()
export class BookingSlotRepository extends PostgresRepository<BookingSlotsModel> {
  constructor(dataSource: DataSource) {
    super(BookingSlotsModel, dataSource);
  }
}
