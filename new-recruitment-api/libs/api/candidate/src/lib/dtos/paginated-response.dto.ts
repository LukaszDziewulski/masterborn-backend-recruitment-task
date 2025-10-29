import { ApiProperty } from "@nestjs/swagger";

export class PaginationMetaDto {
  @ApiProperty({ example: 1, description: "Current page number" })
  page!: number;

  @ApiProperty({ example: 10, description: "Items per page" })
  limit!: number;

  @ApiProperty({ example: 100, description: "Total number of items" })
  total!: number;

  @ApiProperty({ example: 10, description: "Total number of pages" })
  totalPages!: number;

  @ApiProperty({ example: true, description: "Whether there is a next page" })
  hasNextPage!: boolean;

  @ApiProperty({ example: false, description: "Whether there is a previous page" })
  hasPreviousPage!: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true, description: "Array of items" })
  data!: T[];

  @ApiProperty({ type: PaginationMetaDto, description: "Pagination metadata" })
  meta!: PaginationMetaDto;

  static create<T>(data: T[], page: number, limit: number, total: number): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
