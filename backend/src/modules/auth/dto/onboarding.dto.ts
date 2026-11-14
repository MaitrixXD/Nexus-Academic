import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OnboardingDto {
  @ApiPropertyOptional() @IsString() @IsOptional() firstName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() lastName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() institution?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() department?: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() year?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() bio?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() companyName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() industry?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() location?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() designation?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() interests?: string;
}
