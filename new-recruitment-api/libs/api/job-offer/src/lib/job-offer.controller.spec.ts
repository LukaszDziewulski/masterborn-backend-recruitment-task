import { Test, TestingModule } from "@nestjs/testing";
import { CreateJobOfferDto, JobOfferResponseDto, UpdateJobOfferDto } from "./dtos";
import { JobOfferController } from "./job-offer.controller";
import { JobOfferService } from "./job-offer.service";

describe("JobOfferController", () => {
  let controller: JobOfferController;
  let mockJobOfferService: jest.Mocked<JobOfferService>;

  const mockDate = new Date("2024-01-15T10:00:00.000Z");

  const mockJobOfferResponseDto: JobOfferResponseDto = {
    id: 1,
    title: "Senior TypeScript Developer",
    description: "Looking for experienced TypeScript developer",
    salaryRange: "15000-20000 PLN",
    location: "Warszawa",
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockJobOffersResponseDto: JobOfferResponseDto[] = [
    mockJobOfferResponseDto,
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
    mockJobOfferService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<JobOfferService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOfferController],
      providers: [
        {
          provide: JobOfferService,
          useValue: mockJobOfferService,
        },
      ],
    }).compile();

    controller = module.get<JobOfferController>(JobOfferController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a job offer and return the created entity", async () => {
      mockJobOfferService.create.mockResolvedValue(mockJobOfferResponseDto);

      const result = await controller.create(mockCreateJobOfferDto);

      expect(result).toEqual(mockJobOfferResponseDto);
      expect(mockJobOfferService.create).toHaveBeenCalledWith(mockCreateJobOfferDto);
      expect(mockJobOfferService.create).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when creating job offer fails", async () => {
      const error = new Error("Database connection error");
      mockJobOfferService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateJobOfferDto)).rejects.toThrow(
        "Database connection error"
      );
      expect(mockJobOfferService.create).toHaveBeenCalledWith(mockCreateJobOfferDto);
    });
  });

  describe("findAll", () => {
    it("should return all job offers", async () => {
      mockJobOfferService.findAll.mockResolvedValue(mockJobOffersResponseDto);

      const result = await controller.findAll();

      expect(result).toEqual(mockJobOffersResponseDto);
      expect(result).toHaveLength(2);
      expect(mockJobOfferService.findAll).toHaveBeenCalled();
      expect(mockJobOfferService.findAll).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when fetching job offers", async () => {
      const error = new Error("Network error");
      mockJobOfferService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow("Network error");
    });
  });

  describe("findOne", () => {
    it("should return job offer by id", async () => {
      mockJobOfferService.findOne.mockResolvedValue(mockJobOfferResponseDto);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockJobOfferResponseDto);
      expect(mockJobOfferService.findOne).toHaveBeenCalledWith(1);
      expect(mockJobOfferService.findOne).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when job offer not found", async () => {
      const error = new Error("Job offer not found");
      mockJobOfferService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(999)).rejects.toThrow("Job offer not found");
      expect(mockJobOfferService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe("update", () => {
    it("should update job offer and return updated entity", async () => {
      const updatedJobOffer = {
        ...mockJobOfferResponseDto,
        title: "Senior TypeScript Developer (Updated)",
      };
      mockJobOfferService.update.mockResolvedValue(updatedJobOffer);

      const result = await controller.update(1, mockUpdateJobOfferDto);

      expect(result).toEqual(updatedJobOffer);
      expect(mockJobOfferService.update).toHaveBeenCalledWith(1, mockUpdateJobOfferDto);
      expect(mockJobOfferService.update).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when updating job offer fails", async () => {
      const error = new Error("Update failed");
      mockJobOfferService.update.mockRejectedValue(error);

      await expect(controller.update(1, mockUpdateJobOfferDto)).rejects.toThrow("Update failed");
      expect(mockJobOfferService.update).toHaveBeenCalledWith(1, mockUpdateJobOfferDto);
    });

    it("should handle errors when job offer not found", async () => {
      const error = new Error("Job offer with ID 999 not found");
      mockJobOfferService.update.mockRejectedValue(error);

      await expect(controller.update(999, mockUpdateJobOfferDto)).rejects.toThrow(
        "Job offer with ID 999 not found"
      );
    });
  });

  describe("remove", () => {
    it("should delete job offer by id", async () => {
      mockJobOfferService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockJobOfferService.remove).toHaveBeenCalledWith(1);
      expect(mockJobOfferService.remove).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when deleting job offer fails", async () => {
      const error = new Error("Deletion failed");
      mockJobOfferService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow("Deletion failed");
      expect(mockJobOfferService.remove).toHaveBeenCalledWith(1);
    });

    it("should handle errors when job offer not found", async () => {
      const error = new Error("Job offer with ID 999 not found");
      mockJobOfferService.remove.mockRejectedValue(error);

      await expect(controller.remove(999)).rejects.toThrow("Job offer with ID 999 not found");
      expect(mockJobOfferService.remove).toHaveBeenCalledWith(999);
    });
  });
});
