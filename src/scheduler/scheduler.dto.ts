import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ScheduleDay } from '@/app/contracts/enums/scheduleDay.enum';
import { isValidTime } from '@/app/decorators/time.decorator';

export class BookSlotDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  slot_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  patient_id: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  booking_reason: string;
}

export class SlotDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @isValidTime({
    message: 'Start time must be in HH:mm format (e.g., 19:10, 01:10).',
  })
  from: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @isValidTime({
    message: 'End time must be in HH:mm format (e.g., 19:10, 01:10).',
  })
  to: string;
}

export class CreateSchedulerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(ScheduleDay)
  scheduleDay: ScheduleDay;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotDto)
  slots: SlotDto[];
}
