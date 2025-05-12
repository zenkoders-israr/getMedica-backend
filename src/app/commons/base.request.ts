import { IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationParam {
  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;

  @IsOptional()
  return_till_current_page?: boolean;
}

export class PaginationParamForBody {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;
}
