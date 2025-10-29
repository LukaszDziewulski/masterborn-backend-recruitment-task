import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { JobOffer } from "@prisma/client";

export class JobOfferResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiPropertyOptional()
  salaryRange?: string | null;

  @ApiPropertyOptional()
  location?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromEntity(jobOffer: JobOffer): JobOfferResponseDto {
    const dto = new JobOfferResponseDto();
    dto.id = jobOffer.id;
    dto.title = jobOffer.title;
    dto.description = jobOffer.description;
    dto.salaryRange = jobOffer.salaryRange;
    dto.location = jobOffer.location;
    dto.createdAt = jobOffer.createdAt;
    dto.updatedAt = jobOffer.updatedAt;
    return dto;
  }
}
