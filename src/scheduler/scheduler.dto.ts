import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Length, IsEmail, IsString, IsEnum } from 'class-validator';
import { Specialty } from '@/app/contracts/enums/specialty.enum';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class RegisterUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Length(8, 128)
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(Specialty)
  specialty: Specialty;
}
