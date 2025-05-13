import { Controller, Res, UseGuards, Put, Body } from '@nestjs/common';
import { Response } from 'express';
import { BaseController } from '../app/commons/base.controller';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardFactory } from '@/app/guards/auth.guard';
import { UserType } from '@/app/contracts/enums/usertype.enum';
import { BookSlotDto } from './booking.dto';
import { BookingService } from './booking.service';

@ApiTags('Booking')
@ApiBearerAuth('JWT')
@Controller()
export class BookingController extends BaseController {
  constructor(private bookingService: BookingService) {
    super();
  }

  @UseGuards(AuthGuardFactory([UserType.PATIENT]))
  @Put('booking/book-slot')
  async bookSlot(@Body() payload: BookSlotDto, @Res() res: Response) {
    const bookingSlot = await this.bookingService.bookSlot(payload);
    return this.OKResponse(res, bookingSlot);
  }
}
