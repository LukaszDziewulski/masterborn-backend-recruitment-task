import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateJobOfferDto, JobOfferResponseDto, UpdateJobOfferDto } from "./dtos";
import { JobOfferRepository } from "./job-offer.repository";

@Injectable()
export class JobOfferService {
  private readonly logger = new Logger(JobOfferService.name);

  constructor(private readonly jobOfferRepository: JobOfferRepository) {}

  async create(createDto: CreateJobOfferDto): Promise<JobOfferResponseDto> {
    try {
      const jobOffer = await this.jobOfferRepository.create(createDto);
      this.logger.log(`Job offer created successfully with ID ${jobOffer.id}`);
      return JobOfferResponseDto.fromEntity(jobOffer);
    } catch (error) {
      this.logger.error(`Error creating job offer: ${error}`);
      throw new InternalServerErrorException("Failed to create job offer");
    }
  }

  async findAll(): Promise<JobOfferResponseDto[]> {
    try {
      const jobOffers = await this.jobOfferRepository.findAll();
      return jobOffers.map(jobOffer => JobOfferResponseDto.fromEntity(jobOffer));
    } catch (error) {
      this.logger.error(`Error fetching job offers: ${error}`);
      throw new InternalServerErrorException("Failed to fetch job offers");
    }
  }

  async findOne(id: number): Promise<JobOfferResponseDto> {
    try {
      const jobOffer = await this.jobOfferRepository.findById(id);
      if (!jobOffer) {
        throw new NotFoundException(`Job offer with ID ${id} not found`);
      }
      return JobOfferResponseDto.fromEntity(jobOffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching job offer with ID ${id}: ${error}`);
      throw new InternalServerErrorException("Failed to fetch job offer");
    }
  }

  async update(id: number, updateDto: UpdateJobOfferDto): Promise<JobOfferResponseDto> {
    if (Object.keys(updateDto).length === 0) {
      throw new BadRequestException("At least one field must be provided for update");
    }

    try {
      const existingJobOffer = await this.jobOfferRepository.findById(id);
      if (!existingJobOffer) {
        throw new NotFoundException(`Job offer with ID ${id} not found`);
      }

      const jobOffer = await this.jobOfferRepository.update(id, updateDto);
      this.logger.log(`Job offer with ID ${id} updated successfully`);
      return JobOfferResponseDto.fromEntity(jobOffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating job offer with ID ${id}: ${error}`);
      throw new InternalServerErrorException("Failed to update job offer");
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const jobOffer = await this.jobOfferRepository.findById(id);
      if (!jobOffer) {
        throw new NotFoundException(`Job offer with ID ${id} not found`);
      }

      await this.jobOfferRepository.delete(id);
      this.logger.log(`Job offer with ID ${id} deleted successfully`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting job offer with ID ${id}: ${error}`);
      throw new InternalServerErrorException("Failed to delete job offer");
    }
  }
}
