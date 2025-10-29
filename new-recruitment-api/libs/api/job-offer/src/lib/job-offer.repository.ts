import { Injectable } from "@nestjs/common";
import { JobOffer } from "@prisma/client";
import { PrismaService } from "@recruitment-api/db";
import { CreateJobOfferDto, UpdateJobOfferDto } from "./dtos";

@Injectable()
export class JobOfferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateJobOfferDto): Promise<JobOffer> {
    return await this.prisma.jobOffer.create({
      data: {
        title: data.title,
        description: data.description,
        salaryRange: data.salaryRange,
        location: data.location,
      },
    });
  }

  async findAll(): Promise<JobOffer[]> {
    return await this.prisma.jobOffer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: number): Promise<JobOffer | null> {
    return await this.prisma.jobOffer.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateJobOfferDto): Promise<JobOffer> {
    return await this.prisma.jobOffer.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.salaryRange && { salaryRange: data.salaryRange }),
        ...(data.location && { location: data.location }),
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.jobOffer.delete({
      where: { id },
    });
  }
}
