import { Module } from "@nestjs/common";
import { PrismaModule } from "@recruitment-api/db";
import { CandidateController } from "./candidate.controller";
import { CandidateRepository } from "./candidate.repository";
import { CandidateService } from "./candidate.service";

@Module({
  imports: [PrismaModule],
  controllers: [CandidateController],
  providers: [CandidateService, CandidateRepository],
  exports: [CandidateService],
})
export class CandidateModule {}
