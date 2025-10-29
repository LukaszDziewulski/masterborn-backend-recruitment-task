import { ApiProperty } from "@nestjs/swagger";
import { Candidate, RecruitmentStatus } from "@prisma/client";

export class CandidateResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  yearsOfExperience!: number;

  @ApiProperty({ required: false })
  recruiterNotes?: string | null;

  @ApiProperty({ enum: RecruitmentStatus })
  status!: RecruitmentStatus;

  @ApiProperty()
  consentDate!: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromEntity(candidate: Candidate): CandidateResponseDto {
    const dto = new CandidateResponseDto();
    dto.id = candidate.id;
    dto.firstName = candidate.firstName;
    dto.lastName = candidate.lastName;
    dto.email = candidate.email;
    dto.phone = candidate.phone;
    dto.yearsOfExperience = candidate.yearsOfExperience;
    dto.recruiterNotes = candidate.recruiterNotes;
    dto.status = candidate.status;
    dto.consentDate = candidate.consentDate;
    dto.createdAt = candidate.createdAt;
    dto.updatedAt = candidate.updatedAt;
    return dto;
  }
}
