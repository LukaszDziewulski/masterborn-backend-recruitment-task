import { Injectable } from "@nestjs/common";
import { Candidate, RecruitmentStatus } from "@prisma/client";
import { PrismaService } from "@recruitment-api/db";
import { CreateCandidateDto, UpdateCandidateDto } from "./dtos";

@Injectable()
export class CandidateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCandidateDto): Promise<Candidate> {
    const candidate = await this.prisma.candidate.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        yearsOfExperience: data.yearsOfExperience,
        recruiterNotes: data.recruiterNotes,
        status: data.status || RecruitmentStatus.NEW,
        consentDate: new Date(data.consentDate),
      },
    });

    await this.prisma.candidateJobOffer.create({
      data: {
        candidateId: candidate.id,
        jobOfferId: data.jobOfferId,
      },
    });

    return candidate;
  }

  async findAll(): Promise<Candidate[]> {
    return await this.prisma.candidate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: number): Promise<Candidate | null> {
    return await this.prisma.candidate.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    return await this.prisma.candidate.findUnique({
      where: { email },
    });
  }

  async findByStatus(status: RecruitmentStatus): Promise<Candidate[]> {
    return await this.prisma.candidate.findMany({
      where: { status },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAllPaginated(
    skip: number,
    take: number,
    status?: RecruitmentStatus
  ): Promise<{ data: Candidate[]; total: number }> {
    const where = status ? { status } : {};

    const [data, total] = await Promise.all([
      this.prisma.candidate.findMany({
        skip,
        take,
        where,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.candidate.count({ where }),
    ]);

    return { data, total };
  }

  async update(id: number, data: UpdateCandidateDto): Promise<Candidate> {
    return await this.prisma.candidate.update({
      where: { id },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.yearsOfExperience && { yearsOfExperience: data.yearsOfExperience }),
        ...(data.recruiterNotes !== undefined && { recruiterNotes: data.recruiterNotes }),
        ...(data.status && { status: data.status }),
        ...(data.consentDate && { consentDate: new Date(data.consentDate) }),
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.candidate.delete({
      where: { id },
    });
  }
}
