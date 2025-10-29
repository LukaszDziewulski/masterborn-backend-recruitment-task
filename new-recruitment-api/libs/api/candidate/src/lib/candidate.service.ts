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
import {
  CandidateResponseDto,
  CreateCandidateDto,
  PaginatedResponseDto,
  UpdateCandidateDto,
} from "./dtos";
import { LegacyApiClient } from "./legacy-api.client";

@Injectable()
export class CandidateService {
  private readonly logger = new Logger(CandidateService.name);

  constructor(
    private readonly candidateRepository: CandidateRepository,
    private readonly legacyApiClient: LegacyApiClient
  ) {}

  async create(createDto: CreateCandidateDto): Promise<CandidateResponseDto> {
    try {
      const existingCandidate = await this.candidateRepository.findByEmail(createDto.email);
      if (existingCandidate) {
        throw new ConflictException(`Candidate with email ${createDto.email} already exists`);
      }

      // Create candidate in new system
      const candidate = await this.candidateRepository.create(createDto);
      this.logger.log(`Candidate created successfully with ID ${candidate.id}`);

      this.syncToLegacyApi(createDto.firstName, createDto.lastName, createDto.email);

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

  private async syncToLegacyApi(firstName: string, lastName: string, email: string): Promise<void> {
    try {
      const result = await this.legacyApiClient.sendCandidate({
        firstName,
        lastName,
        email,
      });

      if (result.success) {
        this.logger.log(`✅ Candidate synced to Legacy API: ${email}`);
      } else {
        this.logger.warn(`⚠️ Legacy API sync failed for ${email}: ${result.error}`);
      }
    } catch (error: any) {
      this.logger.error(`❌ Failed to sync candidate ${email} to Legacy API: ${error.message}`);
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

  async findAllPaginated(
    page: number,
    limit: number,
    status?: RecruitmentStatus
  ): Promise<PaginatedResponseDto<CandidateResponseDto>> {
    try {
      if (page < 1) {
        throw new BadRequestException("Page must be greater than 0");
      }
      if (limit < 1 || limit > 100) {
        throw new BadRequestException("Limit must be between 1 and 100");
      }

      const skip = (page - 1) * limit;
      const { data, total } = await this.candidateRepository.findAllPaginated(skip, limit, status);

      const candidateDtos = data.map(candidate => CandidateResponseDto.fromEntity(candidate));

      return PaginatedResponseDto.create(candidateDtos, page, limit, total);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error fetching paginated candidates: ${error}`);
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

  /**
   * Find candidate by email (used by migration service)
   */
  async findByEmail(email: string): Promise<CandidateResponseDto | null> {
    try {
      const candidate = await this.candidateRepository.findByEmail(email);
      if (!candidate) {
        return null;
      }
      return CandidateResponseDto.fromEntity(candidate);
    } catch (error) {
      this.logger.error(`Error fetching candidate by email ${email}: ${error}`);
      throw new InternalServerErrorException("Failed to fetch candidate by email");
    }
  }
}
