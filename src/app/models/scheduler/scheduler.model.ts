import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PostgresBaseModel } from '../postgresBase.model';
import { ScheduleDay } from '@/app/contracts/enums/scheduleDay.enum';
import { UserModel } from '../user/user.model';

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

  @ManyToOne(() => UserModel, (userModel) => userModel.doctorSchedule)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserModel;
}
