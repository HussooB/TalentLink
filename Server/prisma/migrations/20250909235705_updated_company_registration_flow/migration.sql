/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."JobPost" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "public"."Company"("name");
