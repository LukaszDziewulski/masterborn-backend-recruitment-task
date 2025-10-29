import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CandidateModule } from "@recruitment-api/candidate";
import { PrismaModule } from "@recruitment-api/db";
import { JobOfferModule } from "@recruitment-api/job-offer";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    PrismaModule,
    CandidateModule,
    JobOfferModule,
  ],
})
export class AppModule {}
