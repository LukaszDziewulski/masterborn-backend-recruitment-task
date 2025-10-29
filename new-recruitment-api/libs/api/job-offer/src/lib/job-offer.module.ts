import { Module } from "@nestjs/common";
import { PrismaModule } from "@recruitment-api/db";
import { JobOfferController } from "./job-offer.controller";
import { JobOfferRepository } from "./job-offer.repository";
import { JobOfferService } from "./job-offer.service";

@Module({
  imports: [PrismaModule],
  controllers: [JobOfferController],
  providers: [JobOfferService, JobOfferRepository],
  exports: [JobOfferService],
})
export class JobOfferModule {}
