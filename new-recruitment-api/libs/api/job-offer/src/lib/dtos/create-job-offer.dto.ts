import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateJobOfferDto {
  @IsString()
  @Length(2, 200)
  @ApiProperty({ example: "Senior Fullstack Developer" })
  title!: string;

  @IsString()
  @Length(10, 2000)
  @ApiProperty({ example: "Poszukujemy doświadczonego programisty..." })
  description!: string;

  @IsString()
  @Length(5, 100)
  @ApiPropertyOptional({ example: "15 000 - 22 000 PLN" })
  salaryRange?: string;

  @IsString()
  @Length(2, 100)
  @ApiPropertyOptional({ example: "Warszawa" })
  location?: string;
}
