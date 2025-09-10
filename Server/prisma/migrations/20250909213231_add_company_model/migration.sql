/*
  Warnings:

  - You are about to drop the column `companyName` on the `EmployerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `EmployerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `EmployerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `EmployerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `employerId` on the `JobPost` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `EmployerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."JobPost" DROP CONSTRAINT "JobPost_employerId_fkey";

-- AlterTable
ALTER TABLE "public"."EmployerProfile" DROP COLUMN "companyName",
DROP COLUMN "location",
DROP COLUMN "logoUrl",
DROP COLUMN "website",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "role" TEXT;

-- AlterTable
ALTER TABLE "public"."JobPost" DROP COLUMN "employerId",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,
    "location" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EmployerProfile" ADD CONSTRAINT "EmployerProfile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobPost" ADD CONSTRAINT "JobPost_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
