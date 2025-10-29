import { ApiPropertyOptional } from "@nestjs/swagger";
import { RecruitmentStatus } from "@prisma/client";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Length,
} from "class-validator";

export class UpdateCandidateDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  @ApiPropertyOptional({ example: "Jan" })
  firstName?: string;

  @IsString()
  @Length(2, 100)
  @IsOptional()
  @ApiPropertyOptional({ example: "Kowalski" })
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({ example: "jan.kowalski@example.pl" })
  email?: string;

  @IsPhoneNumber("PL")
  @IsOptional()
  @ApiPropertyOptional({ example: "+48 123 456 789" })
  phone?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ example: 5 })
  yearsOfExperience?: number;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  @ApiPropertyOptional({ example: "Zaktualizowane notatki" })
  recruiterNotes?: string;

  @IsEnum(RecruitmentStatus)
  @IsOptional()
  @ApiPropertyOptional({
    example: RecruitmentStatus.IN_PROGRESS,
    enum: RecruitmentStatus,
  })
  status?: RecruitmentStatus;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: "2024-01-15T10:00:00Z" })
  consentDate?: string;
}
