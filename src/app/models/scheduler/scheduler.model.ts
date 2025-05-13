import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PostgresBaseModel } from '../postgresBase.model';
import { ScheduleDay } from '@/app/contracts/enums/scheduleDay.enum';
import { UserModel } from '../user/user.model';
import { SlotsModel } from './slots.model';
import { BookingSlotsModel } from '../booking/bookingSlots.model';
@Entity('scheduler')
export class SchedulerModel extends PostgresBaseModel {
  @Column({
    name: 'user_id',
    type: 'bigint',
    nullable: false,
  })
  user_id: number;

  @Column({
    name: 'schedule_day',
    type: 'enum',
    enum: ScheduleDay,
    nullable: false,
  })
  schedule_day: ScheduleDay;

  @Column({
    name: 'date',
    type: 'varchar',
    nullable: false,
  })
  date: string;

  @ManyToOne(() => UserModel, (userModel) => userModel.doctorSchedule)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserModel;

  @OneToMany(() => SlotsModel, (slotsModel) => slotsModel.schedule)
  slots: SlotsModel[];

  @OneToMany(
    () => BookingSlotsModel,
    (bookingSlotsModel) => bookingSlotsModel.schedule,
  )
  bookingSlots: BookingSlotsModel[];
}
