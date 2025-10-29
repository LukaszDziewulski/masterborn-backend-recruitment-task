import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { RecruitmentStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CandidateRepository } from "./candidate.repository";
import { CandidateResponseDto, CreateCandidateDto, UpdateCandidateDto } from "./dtos";

@Injectable()
export class CandidateService {
  private readonly logger = new Logger(CandidateService.name);

  constructor(private readonly candidateRepository: CandidateRepository) {}

  async create(createDto: CreateCandidateDto): Promise<CandidateResponseDto> {
    try {
      const existingCandidate = await this.candidateRepository.findByEmail(createDto.email);
      if (existingCandidate) {
        throw new ConflictException(`Candidate with email ${createDto.email} already exists`);
      }

      const candidate = await this.candidateRepository.create(createDto);
      this.logger.log(`Candidate created successfully with ID ${candidate.id}`);
      return CandidateResponseDto.fromEntity(candidate);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new BadRequestException("Invalid jobOfferId or recruiterId");
        }
      }
      this.logger.error(`Error creating candidate: ${error}`);
      throw new InternalServerErrorException("Failed to create candidate");
    }
  }

  async findAll(): Promise<CandidateResponseDto[]> {
    try {
      const candidates = await this.candidateRepository.findAll();
      return candidates.map(candidate => CandidateResponseDto.fromEntity(candidate));
    } catch (error) {
      this.logger.error(`Error fetching candidates: ${error}`);
      throw new InternalServerErrorException("Failed to fetch candidates");
    }
  }

  async findOne(id: number): Promise<CandidateResponseDto> {
    try {
      const candidate = await this.candidateRepository.findById(id);
      if (!candidate) {
        throw new NotFoundException(`Candidate with ID ${id} not found`);
      }
      return CandidateResponseDto.fromEntity(candidate);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching candidate with ID ${id}: ${error}`);
      throw new InternalServerErrorException("Failed to fetch candidate");
    }
  }

  async findByStatus(status: RecruitmentStatus): Promise<CandidateResponseDto[]> {
    try {
      const candidates = await this.candidateRepository.findByStatus(status);
      return candidates.map(candidate => CandidateResponseDto.fromEntity(candidate));
    } catch (error) {
      this.logger.error(`Error fetching candidates by status ${status}: ${error}`);
      throw new InternalServerErrorException("Failed to fetch candidates by status");
    }
  }

  async update(id: number, updateDto: UpdateCandidateDto): Promise<CandidateResponseDto> {
    if (Object.keys(updateDto).length === 0) {
      throw new BadRequestException("At least one field must be provided for update");
    }

    try {
      const existingCandidate = await this.candidateRepository.findById(id);
      if (!existingCandidate) {
        throw new NotFoundException(`Candidate with ID ${id} not found`);
      }

      if (updateDto.email && updateDto.email !== existingCandidate.email) {
        const emailExists = await this.candidateRepository.findByEmail(updateDto.email);
        if (emailExists) {
          throw new ConflictException(`Email ${updateDto.email} is already in use`);
        }
      }

      const candidate = await this.candidateRepository.update(id, updateDto);
      this.logger.log(`Candidate with ID ${id} updated successfully`);
      return CandidateResponseDto.fromEntity(candidate);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new BadRequestException("Invalid jobOfferId or recruiterId");
        }
      }
      this.logger.error(`Error updating candidate with ID ${id}: ${error}`);
      throw new InternalServerErrorException("Failed to update candidate");
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const candidate = await this.candidateRepository.findById(id);
      if (!candidate) {
        throw new NotFoundException(`Candidate with ID ${id} not found`);
      }

      await this.candidateRepository.delete(id);
      this.logger.log(`Candidate with ID ${id} deleted successfully`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting candidate with ID ${id}: ${error}`);
      throw new InternalServerErrorException("Failed to delete candidate");
    }
  }
}
