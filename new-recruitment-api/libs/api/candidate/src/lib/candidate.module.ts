import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "@recruitment-api/db";
import { CandidateController } from "./candidate.controller";
import { CandidateRepository } from "./candidate.repository";
import { CandidateService } from "./candidate.service";
import { LegacyApiClient } from "./legacy-api.client";

@Module({
  imports: [
    PrismaModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [CandidateController],
  providers: [CandidateService, CandidateRepository, LegacyApiClient],
  exports: [CandidateService],
})
export class CandidateModule {}
