import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Seed Job Offers
  console.log("Seeding job offers...");
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

  await prisma.jobOffer.createMany({
    data: jobOffers,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${jobOffers.length} job offers`);

  // Seed Recruiters
  console.log("Seeding recruiters...");
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

  await prisma.recruiter.createMany({
    data: recruiters,
    skipDuplicates: true,
  });

  console.log(`Created ${recruiters.length} recruiters`);

  console.log("Database seed completed!");
}

main()
  .catch(e => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
