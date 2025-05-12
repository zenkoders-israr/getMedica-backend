import { Injectable } from '@nestjs/common';
import { UserModel } from '../../models/user/user.model';
import { PostgresRepository } from '../postgresBase.repository';
import { DataSource } from 'typeorm';
import { UserType } from '@/app/contracts/enums/usertype.enum';
import { IPaginationDBParams } from '@/app/contracts/interfaces/paginationDBParams.interface';
import { IPaginatedModelResponse } from '@/app/contracts/interfaces/paginatedModelResponse.interface';
import { DoctorSearchDto } from '@/user/user.dto';

@Injectable()
export class UserRepository extends PostgresRepository<UserModel> {
  constructor(dataSource: DataSource) {
    super(UserModel, dataSource);
  }

  async getDoctors(
    params: IPaginationDBParams,
    queryParams: DoctorSearchDto,
  ): Promise<IPaginatedModelResponse<UserModel>> {
    const queryBuilder = this.repository
      .createQueryBuilder('doctor')
      .where('doctor.user_type = :userType', { userType: UserType.DOCTOR });

    if (queryParams.name) {
      queryBuilder.andWhere('doctor.first_name ILIKE :name', {
        name: `%${queryParams.name}%`,
      });
    }

    if (queryParams.specialty) {
      queryBuilder.andWhere('doctor.specialty = :specialty', {
        specialty: queryParams.specialty,
      });
    }

    queryBuilder
      .skip(params.offset)
      .take(params.limit)
      .orderBy('doctor.id', 'DESC');
    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
  }
}
