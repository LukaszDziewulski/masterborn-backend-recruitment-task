import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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

export class CreateCandidateDto {
  @IsString()
  @Length(2, 100)
  @ApiProperty({ example: "Jan" })
  firstName!: string;

  @IsString()
  @Length(2, 100)
  @ApiProperty({ example: "Kowalski" })
  lastName!: string;

  @IsEmail()
  @ApiProperty({ example: "jan.kowalski@example.pl" })
  email!: string;

  @IsPhoneNumber("PL")
  @ApiProperty({ example: "+48 123 456 789" })
  phone!: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 5 })
  yearsOfExperience!: number;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  @ApiPropertyOptional({ example: "Świetny kandydat z doświadczeniem w React" })
  recruiterNotes?: string;

  @IsEnum(RecruitmentStatus)
  @IsOptional()
  @ApiPropertyOptional({
    example: RecruitmentStatus.NEW,
    enum: RecruitmentStatus,
    default: RecruitmentStatus.NEW,
  })
  status?: RecruitmentStatus;

  @IsDateString()
  @ApiProperty({ example: "2024-01-15T10:00:00Z" })
  consentDate!: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: "ID oferty pracy" })
  jobOfferId!: number;
}
