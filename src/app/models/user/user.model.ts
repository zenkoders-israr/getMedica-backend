import { Column, Entity, Index, OneToMany } from 'typeorm';
import { PostgresBaseModel } from '../postgresBase.model';
import { Exclude } from 'class-transformer';
import { UserType } from '../../contracts/enums/usertype.enum';
import { UserTokenModel } from './userToken.model';
import { Specialty } from '../../contracts/enums/specialty.enum';
import { SchedulerModel } from '../scheduler/scheduler.model';

@Entity('users')
export class UserModel extends PostgresBaseModel {
  @Column({
    name: 'user_type',
    type: 'enum',
    enum: UserType,
    nullable: false,
  })
  user_type: UserType;

  @Column({
    name: 'specialty',
    type: 'enum',
    enum: Specialty,
    nullable: true,
  })
  specialty: Specialty;

  @Index({ unique: true })
  @Column({
    name: 'email',
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 128,
    nullable: false,
    select: false,
  })
  @Exclude()
  password: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @OneToMany(
    () => UserTokenModel,
    (userTokenModel) => userTokenModel.userTokens,
  )
  token: UserTokenModel[];

  @OneToMany(() => SchedulerModel, (schedulerModel) => schedulerModel.user)
  doctorSchedule: SchedulerModel[];
}
