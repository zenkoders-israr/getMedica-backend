import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/app/repositories/user/user.repository';
import { DoctorSearchDto } from './user.dto';
import { UserModel } from '@/app/models/user/user.model';
import { IPaginatedModelResponse } from '@/app/contracts/interfaces/paginatedModelResponse.interface';
import { IPaginationDBParams } from '@/app/contracts/interfaces/paginationDBParams.interface';
import { GeneralHelper } from '@/app/utils/general.helper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly generalHelper: GeneralHelper,
  ) {}

  async getDoctors(
    query: DoctorSearchDto,
  ): Promise<IPaginatedModelResponse<UserModel>> {
    const paginationParams: IPaginationDBParams =
      this.generalHelper.getPaginationOptionsV2(query);

    const doctors = await this.userRepository.getDoctors(
      paginationParams,
      query,
    );

    return doctors;
  }
}
