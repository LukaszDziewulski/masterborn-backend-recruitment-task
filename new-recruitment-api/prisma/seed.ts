import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Seed Job Offers
  console.log("Seeding job offers...");
  const jobOffers = [
    {
      title: "Senior Fullstack Developer",
      description: "Poszukujemy doświadczonego programisty do pracy nad aplikacjami webowymi.",
      salaryRange: "15 000 - 22 000 PLN",
      location: "Warszawa",
    },
    {
      title: "Data Scientist",
      description: "Analiza dużych zbiorów danych i tworzenie modeli predykcyjnych.",
      salaryRange: "18 000 - 25 000 PLN",
      location: "Kraków",
    },
    {
      title: "Product Manager",
      description: "Zarządzanie rozwojem produktu od koncepcji do wdrożenia.",
      salaryRange: "20 000 - 28 000 PLN",
      location: "Warszawa",
    },
    {
      title: "UX/UI Designer",
      description: "Projektowanie interfejsów użytkownika dla aplikacji webowych i mobilnych.",
      salaryRange: "12 000 - 18 000 PLN",
      location: "Wrocław",
    },
    {
      title: "DevOps Engineer",
      description: "Automatyzacja procesów CI/CD i zarządzanie infrastrukturą chmurową.",
      salaryRange: "16 000 - 24 000 PLN",
      location: "Gdańsk",
    },
    {
      title: "Backend Developer Node.js",
      description: "Rozwój aplikacji backendowych w technologii Node.js i NestJS.",
      salaryRange: "14 000 - 20 000 PLN",
      location: "Poznań",
    },
    {
      title: "Frontend Developer React",
      description: "Tworzenie nowoczesnych interfejsów użytkownika w React i TypeScript.",
      salaryRange: "13 000 - 19 000 PLN",
      location: "Warszawa",
    },
    {
      title: "QA Automation Engineer",
      description: "Automatyzacja testów i zapewnianie jakości oprogramowania.",
      salaryRange: "11 000 - 16 000 PLN",
      location: "Kraków",
    },
    {
      title: "Mobile Developer Flutter",
      description: "Tworzenie aplikacji mobilnych w technologii Flutter.",
      salaryRange: "14 000 - 21 000 PLN",
      location: "Wrocław",
    },
    {
      title: "Cloud Architect",
      description: "Projektowanie i wdrażanie rozwiązań chmurowych (AWS/Azure/GCP).",
      salaryRange: "22 000 - 30 000 PLN",
      location: "Warszawa",
    },
    {
      title: "Business Analyst",
      description: "Analiza procesów biznesowych i wsparcie w transformacji cyfrowej.",
      salaryRange: "13 000 - 18 000 PLN",
      location: "Gdańsk",
    },
    {
      title: "Scrum Master",
      description: "Facylitacja pracy zespołów Scrumowych i wspieranie Agile.",
      salaryRange: "15 000 - 22 000 PLN",
      location: "Poznań",
    },
    {
      title: "Security Engineer",
      description: "Zapewnianie bezpieczeństwa systemów informatycznych.",
      salaryRange: "17 000 - 25 000 PLN",
      location: "Warszawa",
    },
    {
      title: "AI/ML Engineer",
      description: "Rozwijanie algorytmów sztucznej inteligencji i uczenia maszynowego.",
      salaryRange: "20 000 - 28 000 PLN",
      location: "Kraków",
    },
    {
      title: "Tech Lead",
      description: "Kierowanie zespołem programistów i nadzór nad architekturą systemu.",
      salaryRange: "24 000 - 32 000 PLN",
      location: "Warszawa",
    },
  ];

  await prisma.jobOffer.createMany({
    data: jobOffers,
    skipDuplicates: true,
  });

  console.log(`Created ${jobOffers.length} job offers`);

  // Seed Recruiters
  console.log("Seeding recruiters...");
  const recruiters = [
    {
      name: "Anna Kowalska",
      email: "anna.kowalska@techpolska.pl",
      phone: "+48 123 456 789",
      company: "TechPolska",
    },
    {
      name: "Piotr Nowak",
      email: "piotr.nowak@itrecruitment.pl",
      phone: "+48 234 567 890",
      company: "IT Recruitment",
    },
    {
      name: "Katarzyna Wiśniewska",
      email: "katarzyna.wisniewska@devhub.pl",
      phone: "+48 345 678 901",
      company: "DevHub Polska",
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
