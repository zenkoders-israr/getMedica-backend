import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BunyanLogger } from '@/app/commons/logger.service';
import { BookingService } from './booking.service';
import { BookingSlotsModel } from '@/app/models/booking/bookingSlots.model';
import { BookingSlotRepository } from '@/app/repositories/bookingSlot/bookingSlot.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingSlotsModel]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRY') },
      }),
    }),
  ],

  controllers: [BookingController],
  providers: [BunyanLogger, BookingService, BookingSlotRepository],
  exports: [BookingService],
})
export class BookingModule {}
