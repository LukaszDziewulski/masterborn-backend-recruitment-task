import { Test, TestingModule } from "@nestjs/testing";
import { RecruitmentStatus } from "@prisma/client";
import { CandidateController } from "./candidate.controller";
import { CandidateService } from "./candidate.service";
import {
  CandidateResponseDto,
  CreateCandidateDto,
  PaginatedResponseDto,
  UpdateCandidateDto,
} from "./dtos";

describe("CandidateController", () => {
  let controller: CandidateController;
  let mockCandidateService: jest.Mocked<CandidateService>;

  const mockDate = new Date("2024-01-15T10:00:00.000Z");

  const mockCandidateResponseDto: CandidateResponseDto = {
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

  const mockCandidatesResponseDto: CandidateResponseDto[] = [
    mockCandidateResponseDto,
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

  const mockPaginatedResponse: PaginatedResponseDto<CandidateResponseDto> = {
    data: mockCandidatesResponseDto,
    meta: {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  beforeEach(async () => {
    mockCandidateService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      findOne: jest.fn(),
      findByStatus: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<CandidateService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateController],
      providers: [
        {
          provide: CandidateService,
          useValue: mockCandidateService,
        },
      ],
    }).compile();

    controller = module.get<CandidateController>(CandidateController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a candidate and return the created entity", async () => {
      mockCandidateService.create.mockResolvedValue(mockCandidateResponseDto);

      const result = await controller.create(mockCreateCandidateDto);

      expect(result).toEqual(mockCandidateResponseDto);
      expect(mockCandidateService.create).toHaveBeenCalledWith(mockCreateCandidateDto);
      expect(mockCandidateService.create).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when creating candidate fails", async () => {
      const error = new Error("Database connection error");
      mockCandidateService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateCandidateDto)).rejects.toThrow(
        "Database connection error"
      );
      expect(mockCandidateService.create).toHaveBeenCalledWith(mockCreateCandidateDto);
    });
  });

  describe("findAll", () => {
    it("should return paginated candidates without status filter", async () => {
      mockCandidateService.findAllPaginated.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(1, 10);

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockCandidateService.findAllPaginated).toHaveBeenCalledWith(1, 10, undefined);
      expect(mockCandidateService.findAllPaginated).toHaveBeenCalledTimes(1);
    });

    it("should return paginated candidates with status filter", async () => {
      const filteredResponse = {
        ...mockPaginatedResponse,
        data: [mockCandidateResponseDto],
        meta: { ...mockPaginatedResponse.meta, total: 1 },
      };
      mockCandidateService.findAllPaginated.mockResolvedValue(filteredResponse);

      const result = await controller.findAll(1, 10, RecruitmentStatus.NEW);

      expect(result).toEqual(filteredResponse);
      expect(mockCandidateService.findAllPaginated).toHaveBeenCalledWith(
        1,
        10,
        RecruitmentStatus.NEW
      );
    });

    it("should use default page and limit values", async () => {
      mockCandidateService.findAllPaginated.mockResolvedValue(mockPaginatedResponse);

      await controller.findAll(1, 10);

      expect(mockCandidateService.findAllPaginated).toHaveBeenCalledWith(1, 10, undefined);
    });

    it("should handle errors when fetching candidates", async () => {
      const error = new Error("Network error");
      mockCandidateService.findAllPaginated.mockRejectedValue(error);

      await expect(controller.findAll(1, 10)).rejects.toThrow("Network error");
    });
  });

  describe("findOne", () => {
    it("should return candidate by id", async () => {
      mockCandidateService.findOne.mockResolvedValue(mockCandidateResponseDto);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockCandidateResponseDto);
      expect(mockCandidateService.findOne).toHaveBeenCalledWith(1);
      expect(mockCandidateService.findOne).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when candidate not found", async () => {
      const error = new Error("Candidate not found");
      mockCandidateService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(999)).rejects.toThrow("Candidate not found");
      expect(mockCandidateService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe("update", () => {
    it("should update candidate and return updated entity", async () => {
      const updatedCandidate = { ...mockCandidateResponseDto, firstName: "Jan Updated" };
      mockCandidateService.update.mockResolvedValue(updatedCandidate);

      const result = await controller.update(1, mockUpdateCandidateDto);

      expect(result).toEqual(updatedCandidate);
      expect(mockCandidateService.update).toHaveBeenCalledWith(1, mockUpdateCandidateDto);
      expect(mockCandidateService.update).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when updating candidate fails", async () => {
      const error = new Error("Update failed");
      mockCandidateService.update.mockRejectedValue(error);

      await expect(controller.update(1, mockUpdateCandidateDto)).rejects.toThrow("Update failed");
      expect(mockCandidateService.update).toHaveBeenCalledWith(1, mockUpdateCandidateDto);
    });

    it("should handle errors when candidate not found", async () => {
      const error = new Error("Candidate with ID 999 not found");
      mockCandidateService.update.mockRejectedValue(error);

      await expect(controller.update(999, mockUpdateCandidateDto)).rejects.toThrow(
        "Candidate with ID 999 not found"
      );
    });
  });

  describe("remove", () => {
    it("should delete candidate by id", async () => {
      mockCandidateService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockCandidateService.remove).toHaveBeenCalledWith(1);
      expect(mockCandidateService.remove).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when deleting candidate fails", async () => {
      const error = new Error("Deletion failed");
      mockCandidateService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow("Deletion failed");
      expect(mockCandidateService.remove).toHaveBeenCalledWith(1);
    });

    it("should handle errors when candidate not found", async () => {
      const error = new Error("Candidate with ID 999 not found");
      mockCandidateService.remove.mockRejectedValue(error);

      await expect(controller.remove(999)).rejects.toThrow("Candidate with ID 999 not found");
      expect(mockCandidateService.remove).toHaveBeenCalledWith(999);
    });
  });
});
