import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RecruitmentStatus } from "@prisma/client";
import { CandidateService } from "./candidate.service";
import { CandidateResponseDto, CreateCandidateDto, UpdateCandidateDto } from "./dtos";

@Controller("candidates")
@ApiTags("Candidates")
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post()
  @ApiOperation({
    summary: "Create a new candidate",
    description: "Creates a new candidate with the provided information",
  })
  @ApiResponse({
    status: 201,
    description: "Candidate created successfully",
    type: CandidateResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - invalid data" })
  @ApiResponse({ status: 409, description: "Conflict - email already exists" })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateCandidateDto): Promise<CandidateResponseDto> {
    return await this.candidateService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: "Get all candidates",
    description: "Retrieves all candidates or filters by status",
  })
  @ApiQuery({ name: "status", required: false, enum: RecruitmentStatus })
  @ApiResponse({
    status: 200,
    description: "Candidates retrieved successfully",
    type: [CandidateResponseDto],
  })
  async findAll(@Query("status") status?: RecruitmentStatus): Promise<CandidateResponseDto[]> {
    if (status) {
      return await this.candidateService.findByStatus(status);
    }
    return await this.candidateService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get candidate by ID",
    description: "Retrieves a specific candidate by their ID",
  })
  @ApiResponse({ status: 200, description: "Candidate found", type: CandidateResponseDto })
  @ApiResponse({ status: 404, description: "Candidate not found" })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<CandidateResponseDto> {
    return await this.candidateService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update candidate",
    description: "Updates candidate information",
  })
  @ApiResponse({
    status: 200,
    description: "Candidate updated successfully",
    type: CandidateResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - invalid data" })
  @ApiResponse({ status: 404, description: "Candidate not found" })
  @ApiResponse({ status: 409, description: "Conflict - email already exists" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateCandidateDto
  ): Promise<CandidateResponseDto> {
    return await this.candidateService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete candidate",
    description: "Deletes a candidate by their ID",
  })
  @ApiResponse({ status: 204, description: "Candidate deleted successfully" })
  @ApiResponse({ status: 404, description: "Candidate not found" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.candidateService.remove(id);
  }
}
