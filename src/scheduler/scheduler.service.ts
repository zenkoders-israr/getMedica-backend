import { BunyanLogger } from './../app/commons/logger.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SchedulerRepository } from '@/app/repositories/scheduler/scheduler.repository';
import { CreateSchedulerDto, SlotDto } from './scheduler.dto';
import { JwtPayload } from '@/app/contracts/types/jwtPayload.type';
import { ScheduleDay } from '@/app/contracts/enums/scheduleDay.enum';
import * as moment from 'moment';
import { SlotsModel } from '@/app/models/scheduler/slots.model';
import { DataSource, EntityManager, In, QueryRunner } from 'typeorm';
import { SchedulerMessages } from './scheduler.message';
import { SchedulerModel } from '@/app/models/scheduler/scheduler.model';
import { UserRepository } from '@/app/repositories/user/user.repository';
import { UserType } from '@/app/contracts/enums/usertype.enum';
import { UserModel } from '@/app/models/user/user.model';
import { BookingSlotRepository } from '@/app/repositories/bookingSlot/bookingSlot.repository';
import { BookingSlotsModel } from '@/app/models/booking/bookingSlots.model';
@Injectable()
export class SchedulerService {
  constructor(
    private readonly schedulerRepository: SchedulerRepository,
    private readonly bookingSlotRepository: BookingSlotRepository,
    private readonly userRepository: UserRepository,
    private readonly logger: BunyanLogger,
    private readonly dataSource: DataSource,
  ) {}

  async upsertScheduler(
    payload: CreateSchedulerDto[],
    user: JwtPayload,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userId = Number(user.id);

    try {
      await this.handleExistingSchedulers(userId, queryRunner);

      for (const { scheduleDay, slots } of payload) {
        const schedulerCreated = await this.createSchedulerWithSlots(
          userId,
          scheduleDay,
          slots,
          queryRunner,
        );

        if (!schedulerCreated) {
          throw new Error(
            `Failed to create scheduler and slots for day: ${scheduleDay}`,
          );
        }
      }

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Upsert failed for user ID ${userId}: ${error}`);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  private async handleExistingSchedulers(
    userId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const existingSchedulers = await this.schedulerRepository.find({
      user_id: userId,
    });

    if (!existingSchedulers.length) return;

    const schedulerIds = existingSchedulers.map((s) => s.id);

    const bookedSlots = await this.bookingSlotRepository.find({
      schedule_id: In(schedulerIds),
      user_id: userId,
      is_booked: true,
    });

    if (bookedSlots.length > 0) {
      this.logger.warn(
        `Cannot update schedule. ${bookedSlots.length} slots are already booked for user ID ${userId}.`,
      );
      throw new BadRequestException(SchedulerMessages.SLOTS_ALREADY_BOOKED);
    }

    for (const scheduler of existingSchedulers) {
      await Promise.allSettled([
        this.deleteBookingSlots(userId, scheduler.id, queryRunner.manager),
        this.deleteSlots(userId, scheduler.id, queryRunner.manager),
      ]);
    }

    await this.deleteScheduler(userId, queryRunner.manager);

    this.logger.log(
      `Deleted ${existingSchedulers.length} existing schedules and their slots for user ID ${userId}.`,
    );
  }

  private async createSchedulerWithSlots(
    userId: number,
    scheduleDay: ScheduleDay,
    slots: SlotDto[],
    queryRunner: QueryRunner,
  ): Promise<boolean> {
    try {
      const scheduler = queryRunner.manager.create(SchedulerModel, {
        user_id: userId,
        schedule_day: scheduleDay,
        date: this.getNextScheduleDate(scheduleDay),
      });

      const savedScheduler = await queryRunner.manager.save(scheduler);

      for (const slot of slots) {
        const savedSlot = await queryRunner.manager.save(
          queryRunner.manager.create(SlotsModel, {
            user_id: userId,
            schedule_id: savedScheduler.id,
            start_time: slot.from,
            end_time: slot.to,
          }),
        );

        const bookingSlotEntities = this.splitIntoBookingSlots(
          slot.from,
          slot.to,
        ).map((time) =>
          queryRunner.manager.create(BookingSlotsModel, {
            user_id: userId,
            schedule_id: savedScheduler.id,
            slot_id: savedSlot.id,
            time,
          }),
        );

        await queryRunner.manager.save(BookingSlotsModel, bookingSlotEntities);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to create scheduler for day "${scheduleDay}" for user ID ${userId}. Error: ${error}`,
      );
      return false;
    }
  }

  async getScheduler(
    user: JwtPayload,
    doctor_id?: number,
  ): Promise<{ doctor: UserModel; scheduler: SchedulerModel[] }> {
    if (user.user_type == UserType.PATIENT && !doctor_id) {
      throw new BadRequestException(SchedulerMessages.DOCTOR_ID_REQUIRED);
    }

    const userId =
      user.user_type == UserType.DOCTOR ? Number(user.id) : Number(doctor_id);

    const doctor = await this.userRepository.findOne({
      where: {
        id: userId,
        user_type: UserType.DOCTOR,
        is_deleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        specialty: true,
      },
    });

    if (!doctor) {
      throw new BadRequestException(SchedulerMessages.DOCTOR_NOT_FOUND);
    }

    const scheduler = await this.schedulerRepository.getScheduler(
      userId,
      user.user_type,
    );

    return {
      doctor,
      scheduler,
    };
  }

  async deleteSlots(
    userId: number,
    schedulerId: number,
    manager: EntityManager,
  ) {
    return manager.delete(SlotsModel, {
      user_id: userId,
      schedule_id: schedulerId,
    });
  }

  async deleteScheduler(userId: number, manager: EntityManager) {
    return manager.delete(SchedulerModel, { user_id: userId });
  }

  async deleteBookingSlots(
    userId: number,
    schedulerId: number,
    manager: EntityManager,
  ) {
    return manager.delete(BookingSlotsModel, {
      user_id: userId,
      schedule_id: schedulerId,
    });
  }

  private splitIntoBookingSlots(from: string, to: string): string[] {
    const slots: string[] = [];

    const start = moment(from, 'HH:mm');
    const end = moment(to, 'HH:mm');

    if (!start.isValid() || !end.isValid() || !start.isBefore(end)) {
      return slots;
    }

    const current = start.clone();

    while (current.isBefore(end)) {
      slots.push(current.format('HH:mm'));
      current.add(30, 'minutes');
    }

    return slots;
  }

  getNextScheduleDate(day: ScheduleDay): string {
    const today = moment().startOf('day');
    const todayDay = today.isoWeekday();

    const daysToAdd = (day + 7 - todayDay) % 7 || 7;

    return moment().startOf('day').add(daysToAdd, 'days').format('YYYY-MM-DD');
  }
}
