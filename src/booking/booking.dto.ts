import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BookSlotDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  booking_slot_id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  booking_reason: string;
}
