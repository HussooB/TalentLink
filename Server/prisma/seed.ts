import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 🔹 UserTypes
  const userTypes = ["JOB_SEEKER", "EMPLOYER", "ADMIN", "SUPER_ADMIN"];
  for (const typeName of userTypes) {
    await prisma.userType.upsert({
      where: { name: typeName },
      update: {},
      create: { name: typeName },
    });
  }
  console.log("✅ UserTypes seeded!");

  // 🔹 ApplicationStatus
  const appStatuses = ["PENDING", "INTERVIEW", "REJECTED", "HIRED"];
  for (const name of appStatuses) {
    await prisma.applicationStatus.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ ApplicationStatus seeded!");

  // 🔹 EmploymentType
  const employmentTypes = ["Full-Time", "Part-Time", "Remote", "Internship"];
  for (const name of employmentTypes) {
    await prisma.employmentType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ EmploymentType seeded!");

  // 🔹 JobPostStatus
  const jobStatuses = ["OPEN", "CLOSED", "DRAFT"];
  for (const name of jobStatuses) {
    await prisma.jobPostStatus.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ JobPostStatus seeded!");

  // 🔹 JobIndustry
  const industries = ["Tech", "Healthcare", "Education", "Finance"];
  for (const name of industries) {
    await prisma.jobIndustry.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ JobIndustry seeded!");

  console.log("🌱 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
