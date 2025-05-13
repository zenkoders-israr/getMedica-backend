import { BadRequestException, Injectable } from '@nestjs/common';
import { BookSlotDto } from './booking.dto';

import { BookingSlotRepository } from '@/app/repositories/bookingSlot/bookingSlot.repository';
import { BookingMessages } from './booking.message';

@Injectable()
export class BookingService {
  constructor(private readonly bookingSlotRepository: BookingSlotRepository) {}

  async bookSlot(payload: BookSlotDto) {
    const bookingSlot = await this.bookingSlotRepository.findOne({
      where: {
        id: Number(payload.booking_slot_id),
      },
    });

    if (!bookingSlot) {
      throw new BadRequestException(BookingMessages.BOOKING_SLOT_NOT_FOUND);
    }

    if (bookingSlot.is_booked) {
      throw new BadRequestException(
        BookingMessages.BOOKING_SLOT_ALREADY_BOOKED,
      );
    }

    bookingSlot.is_booked = true;
    bookingSlot.patient_id = Number(payload.patient_id);
    bookingSlot.booking_reason = payload.booking_reason;

    await this.bookingSlotRepository.save(bookingSlot);

    return true;
  }
}
