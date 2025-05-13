import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PostgresBaseModel } from '../postgresBase.model';
import { UserModel } from '../user/user.model';
import { SchedulerModel } from '../scheduler/scheduler.model';
import { SlotsModel } from '../scheduler/slots.model';

@Entity('booking_slots')
export class BookingSlotsModel extends PostgresBaseModel {
  @Column({
    name: 'user_id',
    type: 'bigint',
    nullable: false,
  })
  user_id: number;

  @Column({
    name: 'schedule_id',
    type: 'bigint',
    nullable: false,
  })
  schedule_id: number;

  @Column({
    name: 'slot_id',
    type: 'bigint',
    nullable: false,
  })
  slot_id: number;

  @Column({
    name: 'patient_id',
    type: 'bigint',
    nullable: true,
  })
  patient_id: number;

  @Column({
    name: 'time',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  time: string;

  @Column({
    name: 'is_booked',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  is_booked: boolean;

  @Column({
    name: 'booking_reason',
    type: 'text',
    nullable: true,
  })
  booking_reason: string;

  @ManyToOne(() => UserModel, (userModel) => userModel.doctorSchedule)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserModel;

  @ManyToOne(() => SchedulerModel, (schedulerModel) => schedulerModel.slots)
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'id' })
  schedule: SchedulerModel;

  @ManyToOne(() => SlotsModel, (slotsModel) => slotsModel.bookingSlots)
  @JoinColumn({ name: 'slot_id', referencedColumnName: 'id' })
  slot: SlotsModel;

  @ManyToOne(() => UserModel, (userModel) => userModel.doctorSchedule)
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'id' })
  patient: UserModel;
}
