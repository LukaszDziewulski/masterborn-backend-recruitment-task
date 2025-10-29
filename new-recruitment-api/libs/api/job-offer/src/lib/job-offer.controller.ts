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
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateJobOfferDto, JobOfferResponseDto, UpdateJobOfferDto } from "./dtos";
import { JobOfferService } from "./job-offer.service";

@Controller("job-offers")
@ApiTags("Job Offers")
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Post()
  @ApiOperation({
    summary: "Create a new job offer",
    description: "Creates a new job offer with the provided information",
  })
  @ApiResponse({
    status: 201,
    description: "Job offer created successfully",
    type: JobOfferResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - invalid data" })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateJobOfferDto): Promise<JobOfferResponseDto> {
    return await this.jobOfferService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: "Get all job offers",
    description: "Retrieves all available job offers",
  })
  @ApiResponse({
    status: 200,
    description: "Job offers retrieved successfully",
    type: [JobOfferResponseDto],
  })
  async findAll(): Promise<JobOfferResponseDto[]> {
    return await this.jobOfferService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get job offer by ID",
    description: "Retrieves a specific job offer by its ID",
  })
  @ApiResponse({ status: 200, description: "Job offer found", type: JobOfferResponseDto })
  @ApiResponse({ status: 404, description: "Job offer not found" })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<JobOfferResponseDto> {
    return await this.jobOfferService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update job offer",
    description: "Updates job offer information",
  })
  @ApiResponse({
    status: 200,
    description: "Job offer updated successfully",
    type: JobOfferResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - invalid data" })
  @ApiResponse({ status: 404, description: "Job offer not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateJobOfferDto
  ): Promise<JobOfferResponseDto> {
    return await this.jobOfferService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete job offer",
    description: "Deletes a job offer by its ID",
  })
  @ApiResponse({ status: 204, description: "Job offer deleted successfully" })
  @ApiResponse({ status: 404, description: "Job offer not found" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.jobOfferService.remove(id);
  }
}
