import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { RecruitmentStatus } from "@prisma/client";
import { CandidateRepository } from "./candidate.repository";
import { CandidateService } from "./candidate.service";
import { CandidateResponseDto, CreateCandidateDto, UpdateCandidateDto } from "./dtos";
import { LegacyApiClient } from "./legacy-api.client";

describe("CandidateService", () => {
  let service: CandidateService;
  let mockCandidateRepository: jest.Mocked<CandidateRepository>;
  let mockLegacyApiClient: jest.Mocked<LegacyApiClient>;
  let mockLoggerLog: jest.SpyInstance;
  let mockLoggerError: jest.SpyInstance;
  let mockLoggerWarn: jest.SpyInstance;

  const mockDate = new Date("2024-01-15T10:00:00.000Z");

  const mockCandidate = {
    id: 1,
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.pl",
    phone: "+48 123 456 789",
    yearsOfExperience: 5,
    recruiterNotes: "Świetny kandydat",
    status: RecruitmentStatus.NEW,
    consentDate: mockDate,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockCandidates = [
    mockCandidate,
    {
      id: 2,
      firstName: "Anna",
      lastName: "Nowak",
      email: "anna.nowak@example.pl",
      phone: "+48 987 654 321",
      yearsOfExperience: 3,
      recruiterNotes: null,
      status: RecruitmentStatus.IN_PROGRESS,
      consentDate: mockDate,
      createdAt: mockDate,
      updatedAt: mockDate,
    },
  ];

  const mockCreateCandidateDto: CreateCandidateDto = {
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.pl",
    phone: "+48 123 456 789",
    yearsOfExperience: 5,
    recruiterNotes: "Świetny kandydat",
    status: RecruitmentStatus.NEW,
    consentDate: "2024-01-15T10:00:00Z",
    jobOfferId: 1,
  };

  const mockUpdateCandidateDto: UpdateCandidateDto = {
    firstName: "Jan Updated",
    status: RecruitmentStatus.IN_PROGRESS,
  };

  beforeEach(async () => {
    mockCandidateRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByStatus: jest.fn(),
      findAllPaginated: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<CandidateRepository>;

    mockLegacyApiClient = {
      sendCandidate: jest.fn(),
      healthCheck: jest.fn(),
    } as unknown as jest.Mocked<LegacyApiClient>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidateService,
        {
          provide: CandidateRepository,
          useValue: mockCandidateRepository,
        },
        {
          provide: LegacyApiClient,
          useValue: mockLegacyApiClient,
        },
      ],
    }).compile();

    service = module.get<CandidateService>(CandidateService);
    mockLoggerLog = jest.spyOn(service["logger"], "log").mockImplementation(jest.fn());
    mockLoggerError = jest.spyOn(service["logger"], "error").mockImplementation(jest.fn());
    mockLoggerWarn = jest.spyOn(service["logger"], "warn").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a candidate successfully and sync to Legacy API", async () => {
      mockCandidateRepository.findByEmail.mockResolvedValue(null);
      mockCandidateRepository.create.mockResolvedValue(mockCandidate);
      mockLegacyApiClient.sendCandidate.mockResolvedValue({ success: true });

      const result = await service.create(mockCreateCandidateDto);

      expect(result).toEqual(CandidateResponseDto.fromEntity(mockCandidate));
      expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(
        mockCreateCandidateDto.email
      );
      expect(mockCandidateRepository.create).toHaveBeenCalledWith(mockCreateCandidateDto);
      expect(mockLoggerLog).toHaveBeenCalledWith(
        `Candidate created successfully with ID ${mockCandidate.id}`
      );
    });

    it("should throw ConflictException if email already exists", async () => {
      mockCandidateRepository.findByEmail.mockResolvedValue(mockCandidate);

      await expect(service.create(mockCreateCandidateDto)).rejects.toThrow(
        new ConflictException(`Candidate with email ${mockCreateCandidateDto.email} already exists`)
      );
      expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(
        mockCreateCandidateDto.email
      );
      expect(mockCandidateRepository.create).not.toHaveBeenCalled();
    });

    it("should create candidate even if Legacy API sync fails", async () => {
      mockCandidateRepository.findByEmail.mockResolvedValue(null);
      mockCandidateRepository.create.mockResolvedValue(mockCandidate);
      mockLegacyApiClient.sendCandidate.mockResolvedValue({ success: false, error: "API down" });

      const result = await service.create(mockCreateCandidateDto);

      expect(result).toEqual(CandidateResponseDto.fromEntity(mockCandidate));
      expect(mockCandidateRepository.create).toHaveBeenCalled();
      expect(mockLoggerWarn).toHaveBeenCalled();
    });

    it("should throw InternalServerErrorException on repository error", async () => {
      mockCandidateRepository.findByEmail.mockResolvedValue(null);
      mockCandidateRepository.create.mockRejectedValue(new Error("Database error"));

      await expect(service.create(mockCreateCandidateDto)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(mockLoggerError).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return all candidates", async () => {
      mockCandidateRepository.findAll.mockResolvedValue(mockCandidates);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(CandidateResponseDto.fromEntity(mockCandidates[0]));
      expect(mockCandidateRepository.findAll).toHaveBeenCalled();
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockCandidateRepository.findAll.mockRejectedValue(new Error("Database error"));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
      expect(mockLoggerError).toHaveBeenCalled();
    });
  });

  describe("findAllPaginated", () => {
    it("should return paginated candidates", async () => {
      mockCandidateRepository.findAllPaginated.mockResolvedValue({
        data: mockCandidates,
        total: 2,
      });

      const result = await service.findAllPaginated(1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.total).toBe(2);
      expect(mockCandidateRepository.findAllPaginated).toHaveBeenCalledWith(0, 10, undefined);
    });

    it("should return paginated candidates with status filter", async () => {
      mockCandidateRepository.findAllPaginated.mockResolvedValue({
        data: [mockCandidate],
        total: 1,
      });

      const result = await service.findAllPaginated(1, 10, RecruitmentStatus.NEW);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(mockCandidateRepository.findAllPaginated).toHaveBeenCalledWith(
        0,
        10,
        RecruitmentStatus.NEW
      );
    });

    it("should throw BadRequestException if page < 1", async () => {
      await expect(service.findAllPaginated(0, 10)).rejects.toThrow(
        new BadRequestException("Page must be greater than 0")
      );
    });

    it("should throw BadRequestException if limit < 1", async () => {
      await expect(service.findAllPaginated(1, 0)).rejects.toThrow(
        new BadRequestException("Limit must be between 1 and 100")
      );
    });

    it("should throw BadRequestException if limit > 100", async () => {
      await expect(service.findAllPaginated(1, 200)).rejects.toThrow(
        new BadRequestException("Limit must be between 1 and 100")
      );
    });

    it("should throw InternalServerErrorException on repository error", async () => {
      mockCandidateRepository.findAllPaginated.mockRejectedValue(new Error("Database error"));

      await expect(service.findAllPaginated(1, 10)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("findOne", () => {
    it("should return a candidate by id", async () => {
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);

      const result = await service.findOne(1);

      expect(result).toEqual(CandidateResponseDto.fromEntity(mockCandidate));
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException if candidate not found", async () => {
      mockCandidateRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException("Candidate with ID 999 not found")
      );
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockCandidateRepository.findById.mockRejectedValue(new Error("Database error"));

      await expect(service.findOne(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("findByStatus", () => {
    it("should return candidates by status", async () => {
      mockCandidateRepository.findByStatus.mockResolvedValue([mockCandidate]);

      const result = await service.findByStatus(RecruitmentStatus.NEW);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(CandidateResponseDto.fromEntity(mockCandidate));
      expect(mockCandidateRepository.findByStatus).toHaveBeenCalledWith(RecruitmentStatus.NEW);
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockCandidateRepository.findByStatus.mockRejectedValue(new Error("Database error"));

      await expect(service.findByStatus(RecruitmentStatus.NEW)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe("update", () => {
    it("should update a candidate successfully", async () => {
      const updatedCandidate = { ...mockCandidate, firstName: "Jan Updated" };
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);
      mockCandidateRepository.update.mockResolvedValue(updatedCandidate);

      const result = await service.update(1, mockUpdateCandidateDto);

      expect(result).toEqual(CandidateResponseDto.fromEntity(updatedCandidate));
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCandidateRepository.update).toHaveBeenCalledWith(1, mockUpdateCandidateDto);
      expect(mockLoggerLog).toHaveBeenCalledWith("Candidate with ID 1 updated successfully");
    });

    it("should throw BadRequestException if no fields provided", async () => {
      await expect(service.update(1, {})).rejects.toThrow(
        new BadRequestException("At least one field must be provided for update")
      );
    });

    it("should throw NotFoundException if candidate not found", async () => {
      mockCandidateRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, mockUpdateCandidateDto)).rejects.toThrow(
        new NotFoundException("Candidate with ID 999 not found")
      );
    });

    it("should throw ConflictException if new email already exists", async () => {
      const updateWithEmail = { email: "existing@example.pl" };
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);
      mockCandidateRepository.findByEmail.mockResolvedValue({ ...mockCandidate, id: 2 });

      await expect(service.update(1, updateWithEmail)).rejects.toThrow(
        new ConflictException("Email existing@example.pl is already in use")
      );
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);
      mockCandidateRepository.update.mockRejectedValue(new Error("Database error"));

      await expect(service.update(1, mockUpdateCandidateDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe("remove", () => {
    it("should delete a candidate successfully", async () => {
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);
      mockCandidateRepository.delete.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCandidateRepository.delete).toHaveBeenCalledWith(1);
      expect(mockLoggerLog).toHaveBeenCalledWith("Candidate with ID 1 deleted successfully");
    });

    it("should throw NotFoundException if candidate not found", async () => {
      mockCandidateRepository.findById.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException("Candidate with ID 999 not found")
      );
      expect(mockCandidateRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);
      mockCandidateRepository.delete.mockRejectedValue(new Error("Database error"));

      await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("findByEmail", () => {
    it("should return candidate by email", async () => {
      mockCandidateRepository.findByEmail.mockResolvedValue(mockCandidate);

      const result = await service.findByEmail("jan.kowalski@example.pl");

      expect(result).toEqual(CandidateResponseDto.fromEntity(mockCandidate));
      expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith("jan.kowalski@example.pl");
    });

    it("should return null if candidate not found", async () => {
      mockCandidateRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail("nonexistent@example.pl");

      expect(result).toBeNull();
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockCandidateRepository.findByEmail.mockRejectedValue(new Error("Database error"));

      await expect(service.findByEmail("jan.kowalski@example.pl")).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
