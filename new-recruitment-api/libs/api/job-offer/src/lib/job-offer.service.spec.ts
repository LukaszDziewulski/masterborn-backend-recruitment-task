import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateJobOfferDto, JobOfferResponseDto, UpdateJobOfferDto } from "./dtos";
import { JobOfferRepository } from "./job-offer.repository";
import { JobOfferService } from "./job-offer.service";

describe("JobOfferService", () => {
  let service: JobOfferService;
  let mockJobOfferRepository: jest.Mocked<JobOfferRepository>;
  let mockLoggerLog: jest.SpyInstance;
  let mockLoggerError: jest.SpyInstance;

  const mockDate = new Date("2024-01-15T10:00:00.000Z");

  const mockJobOffer = {
    id: 1,
    title: "Senior TypeScript Developer",
    description: "Looking for experienced TypeScript developer",
    salaryRange: "15000-20000 PLN",
    location: "Warszawa",
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockJobOffers = [
    mockJobOffer,
    {
      id: 2,
      title: "Junior Frontend Developer",
      description: "Great opportunity for junior developers",
      salaryRange: "8000-12000 PLN",
      location: "Kraków",
      createdAt: mockDate,
      updatedAt: mockDate,
    },
  ];

  const mockCreateJobOfferDto: CreateJobOfferDto = {
    title: "Senior TypeScript Developer",
    description: "Looking for experienced TypeScript developer",
    salaryRange: "15000-20000 PLN",
    location: "Warszawa",
  };

  const mockUpdateJobOfferDto: UpdateJobOfferDto = {
    title: "Senior TypeScript Developer (Updated)",
    salaryRange: "18000-25000 PLN",
  };

  beforeEach(async () => {
    mockJobOfferRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<JobOfferRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOfferService,
        {
          provide: JobOfferRepository,
          useValue: mockJobOfferRepository,
        },
      ],
    }).compile();

    service = module.get<JobOfferService>(JobOfferService);
    mockLoggerLog = jest.spyOn(service["logger"], "log").mockImplementation(jest.fn());
    mockLoggerError = jest.spyOn(service["logger"], "error").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a job offer successfully", async () => {
      mockJobOfferRepository.create.mockResolvedValue(mockJobOffer);

      const result = await service.create(mockCreateJobOfferDto);

      expect(result).toEqual(JobOfferResponseDto.fromEntity(mockJobOffer));
      expect(mockJobOfferRepository.create).toHaveBeenCalledWith(mockCreateJobOfferDto);
      expect(mockLoggerLog).toHaveBeenCalledWith(
        `Job offer created successfully with ID ${mockJobOffer.id}`
      );
    });

    it("should throw InternalServerErrorException on repository error", async () => {
      mockJobOfferRepository.create.mockRejectedValue(new Error("Database error"));

      await expect(service.create(mockCreateJobOfferDto)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(mockLoggerError).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return all job offers", async () => {
      mockJobOfferRepository.findAll.mockResolvedValue(mockJobOffers);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(JobOfferResponseDto.fromEntity(mockJobOffers[0]));
      expect(mockJobOfferRepository.findAll).toHaveBeenCalled();
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockJobOfferRepository.findAll.mockRejectedValue(new Error("Database error"));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
      expect(mockLoggerError).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a job offer by id", async () => {
      mockJobOfferRepository.findById.mockResolvedValue(mockJobOffer);

      const result = await service.findOne(1);

      expect(result).toEqual(JobOfferResponseDto.fromEntity(mockJobOffer));
      expect(mockJobOfferRepository.findById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException if job offer not found", async () => {
      mockJobOfferRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException("Job offer with ID 999 not found")
      );
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockJobOfferRepository.findById.mockRejectedValue(new Error("Database error"));

      await expect(service.findOne(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("update", () => {
    it("should update a job offer successfully", async () => {
      const updatedJobOffer = { ...mockJobOffer, title: "Senior TypeScript Developer (Updated)" };
      mockJobOfferRepository.findById.mockResolvedValue(mockJobOffer);
      mockJobOfferRepository.update.mockResolvedValue(updatedJobOffer);

      const result = await service.update(1, mockUpdateJobOfferDto);

      expect(result).toEqual(JobOfferResponseDto.fromEntity(updatedJobOffer));
      expect(mockJobOfferRepository.findById).toHaveBeenCalledWith(1);
      expect(mockJobOfferRepository.update).toHaveBeenCalledWith(1, mockUpdateJobOfferDto);
      expect(mockLoggerLog).toHaveBeenCalledWith("Job offer with ID 1 updated successfully");
    });

    it("should throw BadRequestException if no fields provided", async () => {
      await expect(service.update(1, {})).rejects.toThrow(
        new BadRequestException("At least one field must be provided for update")
      );
    });

    it("should throw NotFoundException if job offer not found", async () => {
      mockJobOfferRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, mockUpdateJobOfferDto)).rejects.toThrow(
        new NotFoundException("Job offer with ID 999 not found")
      );
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockJobOfferRepository.findById.mockResolvedValue(mockJobOffer);
      mockJobOfferRepository.update.mockRejectedValue(new Error("Database error"));

      await expect(service.update(1, mockUpdateJobOfferDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe("remove", () => {
    it("should delete a job offer successfully", async () => {
      mockJobOfferRepository.findById.mockResolvedValue(mockJobOffer);
      mockJobOfferRepository.delete.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockJobOfferRepository.findById).toHaveBeenCalledWith(1);
      expect(mockJobOfferRepository.delete).toHaveBeenCalledWith(1);
      expect(mockLoggerLog).toHaveBeenCalledWith("Job offer with ID 1 deleted successfully");
    });

    it("should throw NotFoundException if job offer not found", async () => {
      mockJobOfferRepository.findById.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException("Job offer with ID 999 not found")
      );
      expect(mockJobOfferRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw InternalServerErrorException on error", async () => {
      mockJobOfferRepository.findById.mockResolvedValue(mockJobOffer);
      mockJobOfferRepository.delete.mockRejectedValue(new Error("Database error"));

      await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
