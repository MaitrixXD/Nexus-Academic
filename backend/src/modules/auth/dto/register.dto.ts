import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  STUDENT = 'STUDENT',
  INDUSTRY = 'INDUSTRY',
  ACADEMICIAN = 'ACADEMICIAN',
  INSTITUTION_ADMIN = 'INSTITUTION_ADMIN',
}

export class RegisterDto {
  @ApiProperty({ example: 'student@iit.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: UserRole, example: 'STUDENT' })
  @IsEnum(UserRole)
  role: UserRole;
}
