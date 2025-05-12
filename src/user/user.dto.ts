import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationParam } from '@/app/commons/base.request';
import { IsOptional } from 'class-validator';
import { Specialty } from '@/app/contracts/enums/specialty.enum';

export class DoctorSearchDto extends PaginationParam {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false, enum: Specialty })
  @IsOptional()
  @IsEnum(Specialty)
  @Transform(({ value }) => Number(value))
  specialty: Specialty;
}
