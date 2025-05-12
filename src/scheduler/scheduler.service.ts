import { BunyanLogger } from './../app/commons/logger.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SchedulerRepository } from '@/app/repositories/scheduler/scheduler.repository';
import { CreateSchedulerDto, BookSlotDto } from './scheduler.dto';
import { JwtPayload } from '@/app/contracts/types/jwtPayload.type';
import { ScheduleDay } from '@/app/contracts/enums/scheduleDay.enum';
import * as moment from 'moment';
import { SlotsModel } from '@/app/models/scheduler/slots.model';
import { SlotsRepository } from '@/app/repositories/scheduler/slots.repository';
import { DataSource, EntityManager, In } from 'typeorm';
import { SchedulerMessages } from './scheduler.message';
import { SchedulerModel } from '@/app/models/scheduler/scheduler.model';
import { UserRepository } from '@/app/repositories/user/user.repository';
import { UserType } from '@/app/contracts/enums/usertype.enum';
@Injectable()
export class SchedulerService {
  constructor(
    private readonly schedulerRepository: SchedulerRepository,
    private readonly slotsRepository: SlotsRepository,
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

    try {
      const userId = Number(user.id);

      const existingSchedulers = await this.schedulerRepository.find({
        user_id: userId,
      });

      if (existingSchedulers.length > 0) {
        const schedulerIds = existingSchedulers.map((s) => s.id);

        const bookedSlots = await this.slotsRepository.find({
          schedule_id: In(schedulerIds),
          booked: true,
        });

        if (bookedSlots.length > 0) {
          this.logger.warn(
            `Cannot update schedule. ${bookedSlots.length} slots are already booked for user ID ${userId}.`,
          );
          throw new BadRequestException(SchedulerMessages.SLOTS_ALREADY_BOOKED);
        }
        await Promise.allSettled(
          existingSchedulers.map((scheduler) =>
            this.deleteSlots(userId, scheduler.id, queryRunner.manager),
          ),
        );

        await this.deleteScheduler(userId, queryRunner.manager);

        this.logger.log(
          `Deleted ${existingSchedulers.length} existing schedules and their slots for user ID ${userId}.`,
        );
      }

      const schedulerPromises = payload.map(async ({ scheduleDay, slots }) => {
        try {
          const scheduler = queryRunner.manager.create(SchedulerModel, {
            user_id: userId,
            schedule_day: scheduleDay,
            date: this.getNextScheduleDate(scheduleDay),
          });

          const savedScheduler = await queryRunner.manager.save(scheduler);

          const slotEntities = slots.map((slot) =>
            queryRunner.manager.create(SlotsModel, {
              user_id: userId,
              schedule_id: savedScheduler.id,
              start_time: slot.from,
              end_time: slot.to,
            }),
          );

          await queryRunner.manager.save(SlotsModel, slotEntities);

          return true;
        } catch (error) {
          this.logger.error(
            `Failed to create scheduler for day "${scheduleDay}" for user ID ${userId}. Error: ${error}`,
          );
          return false;
        }
      });

      const results = await Promise.allSettled(schedulerPromises);

      await queryRunner.commitTransaction();

      return results.every(
        (result) => result.status === 'fulfilled' && result.value === true,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getScheduler(user: JwtPayload, doctor_id?: number) {
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
    });

    if (!doctor) {
      throw new BadRequestException(SchedulerMessages.DOCTOR_NOT_FOUND);
    }

    const scheduler = await this.schedulerRepository.getScheduler(userId);

    return scheduler;
  }

  async bookSlot(payload: BookSlotDto) {
    const { slot_id, patient_id, booking_reason } = payload;

    const slot = await this.slotsRepository.findOne({
      where: { id: Number(slot_id) },
    });

    if (!slot) {
      throw new BadRequestException(SchedulerMessages.SLOT_NOT_FOUND);
    }

    if (slot.booked) {
      throw new BadRequestException(SchedulerMessages.SLOT_ALREADY_BOOKED);
    }

    slot.booked = true;
    slot.patient_id = Number(patient_id);
    slot.booking_reason = booking_reason;

    await this.slotsRepository.save(slot);

    return slot;
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

  getNextScheduleDate(day: ScheduleDay): string {
    const today = moment().startOf('day');
    const todayDay = today.isoWeekday();

    const daysToAdd = (day + 7 - todayDay) % 7 || 7;

    return moment().startOf('day').add(daysToAdd, 'days').format('YYYY-MM-DD');
  }
}
