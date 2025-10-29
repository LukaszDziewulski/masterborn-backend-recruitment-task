import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("✅ Successfully connected to database");
    } catch (error) {
      this.logger.error("❌ Failed to connect to database", error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("🔌 Disconnected from database");
  }

  /**
   * Clean database - useful for testing
   * Deletes all data from all tables in correct order
   */
  async cleanDb() {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Cannot clean database in production!");
    }

    return this.$transaction([
      this.candidateJobOffer.deleteMany(),
      this.candidate.deleteMany(),
      this.jobOffer.deleteMany(),
      this.recruiter.deleteMany(),
    ]);
  }

  /**
   * Seed job offers - useful for development
   */
  async seedJobOffers() {
    const jobOffers = [
      {
        title: "Software Engineer",
        description: "Responsible for developing software applications.",
        salaryRange: "$50,000 - $70,000",
        location: "New York",
      },
      {
        title: "Data Scientist",
        description: "Analyze large datasets to uncover insights and improve decision making.",
        salaryRange: "$70,000 - $90,000",
        location: "San Francisco",
      },
      {
        title: "Product Manager",
        description: "Manage product development from inception to launch.",
        salaryRange: "$90,000 - $120,000",
        location: "Chicago",
      },
      {
        title: "UX Designer",
        description: "Design user-friendly interfaces for web and mobile applications.",
        salaryRange: "$60,000 - $80,000",
        location: "Los Angeles",
      },
      {
        title: "DevOps Engineer",
        description: "Automate and monitor operational processes within the IT infrastructure.",
        salaryRange: "$80,000 - $100,000",
        location: "Austin",
      },
      {
        title: "Full Stack Developer",
        description: "Work on both front-end and back-end development of applications.",
        salaryRange: "$70,000 - $95,000",
        location: "Seattle",
      },
      {
        title: "Data Analyst",
        description: "Transform data into actionable insights for decision makers.",
        salaryRange: "$50,000 - $70,000",
        location: "Boston",
      },
      {
        title: "Product Designer",
        description: "Create product concepts and designs with a user-centric approach.",
        salaryRange: "$60,000 - $85,000",
        location: "San Francisco",
      },
      {
        title: "Web Developer",
        description: "Develop and maintain websites using HTML, CSS, and JavaScript.",
        salaryRange: "$55,000 - $75,000",
        location: "New York",
      },
      {
        title: "Mobile App Developer",
        description: "Design and develop mobile applications for iOS and Android.",
        salaryRange: "$70,000 - $90,000",
        location: "San Diego",
      },
      {
        title: "Business Analyst",
        description: "Analyze business processes and provide recommendations for improvements.",
        salaryRange: "$65,000 - $85,000",
        location: "Chicago",
      },
      {
        title: "QA Engineer",
        description: "Ensure the quality of software by conducting tests and reporting issues.",
        salaryRange: "$60,000 - $80,000",
        location: "Austin",
      },
      {
        title: "Network Administrator",
        description: "Manage and monitor company network infrastructure.",
        salaryRange: "$75,000 - $95,000",
        location: "Dallas",
      },
      {
        title: "Cloud Engineer",
        description: "Design, build, and maintain cloud-based systems and solutions.",
        salaryRange: "$85,000 - $105,000",
        location: "Los Angeles",
      },
      {
        title: "Systems Architect",
        description: "Design and implement IT systems for enterprise environments.",
        salaryRange: "$100,000 - $120,000",
        location: "Seattle",
      },
    ];

    const existingCount = await this.jobOffer.count();
    if (existingCount > 0) {
      this.logger.log(`Job offers already seeded (${existingCount} records)`);
      return;
    }

    await this.jobOffer.createMany({
      data: jobOffers,
    });

    this.logger.log(`✅ Seeded ${jobOffers.length} job offers`);
  }

  /**
   * Seed recruiters - useful for development
   */
  async seedRecruiters() {
    const recruiters = [
      {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1234567890",
        company: "TechCorp",
      },
      {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+1234567891",
        company: "InnovateTech",
      },
      {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "+1234567892",
        company: "DevHub",
      },
    ];

    const existingCount = await this.recruiter.count();
    if (existingCount > 0) {
      this.logger.log(`Recruiters already seeded (${existingCount} records)`);
      return;
    }

    await this.recruiter.createMany({
      data: recruiters,
    });

    this.logger.log(`✅ Seeded ${recruiters.length} recruiters`);
  }
}
