import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PostgresBaseModel } from '../postgresBase.model';
import { UserModel } from '../user/user.model';
import { SchedulerModel } from './scheduler.model';
import { BookingSlotsModel } from '../booking/bookingSlots.model';

@Entity('slots')
export class SlotsModel extends PostgresBaseModel {
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
    name: 'start_time',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  start_time: string;

  @Column({
    name: 'end_time',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  end_time: string;

  @ManyToOne(() => UserModel, (userModel) => userModel.doctorSchedule)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserModel;


  @ManyToOne(() => SchedulerModel, (schedulerModel) => schedulerModel.slots)
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'id' })
  schedule: SchedulerModel;


  @OneToMany(() => BookingSlotsModel, (bookingSlotsModel) => bookingSlotsModel.slot)
  bookingSlots: BookingSlotsModel[];
}
