import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Seed UserTypes
  const userTypes = ["JOB_SEEKER", "EMPLOYER", "ADMIN", "SUPER_ADMIN"];

  for (const typeName of userTypes) {
    await prisma.userType.upsert({
      where: { name: typeName },
      update: {},
      create: { name: typeName },
    });
  }

  console.log("✅ UserTypes seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
