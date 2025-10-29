import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateJobOfferDto {
  @IsString()
  @Length(2, 200)
  @IsOptional()
  @ApiPropertyOptional({ example: "Senior Fullstack Developer" })
  title?: string;

  @IsString()
  @Length(10, 2000)
  @IsOptional()
  @ApiPropertyOptional({ example: "Poszukujemy doświadczonego programisty..." })
  description?: string;

  @IsString()
  @Length(5, 100)
  @IsOptional()
  @ApiPropertyOptional({ example: "15 000 - 22 000 PLN" })
  salaryRange?: string;

  @IsString()
  @Length(2, 100)
  @IsOptional()
  @ApiPropertyOptional({ example: "Warszawa" })
  location?: string;
}
