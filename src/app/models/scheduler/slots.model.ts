import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PostgresBaseModel } from '../postgresBase.model';
import { UserModel } from '../user/user.model';
import { SchedulerModel } from './scheduler.model';

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

  @Column({
    name: 'booked',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  booked: boolean;

  @Column({
    name: 'patient_id',
    type: 'bigint',
    nullable: true,
  })
  patient_id: number;

  @ManyToOne(() => UserModel, (userModel) => userModel.doctorSchedule)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserModel;

  @ManyToOne(() => UserModel, (userModel) => userModel.doctorSchedule)
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'id' })
  patient: UserModel;

  @ManyToOne(() => SchedulerModel, (schedulerModel) => schedulerModel.slots)
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'id' })
  schedule: SchedulerModel;
}
