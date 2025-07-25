/*
  Warnings:

  - A unique constraint covering the columns `[partner_id]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "partners" DROP CONSTRAINT "partners_imageId_fkey";

-- DropForeignKey
ALTER TABLE "partners" DROP CONSTRAINT "partners_user_id_fkey";

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "partner_id" TEXT;

-- AlterTable
ALTER TABLE "partners" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "images_partner_id_key" ON "images"("partner_id");

-- CreateIndex
CREATE INDEX "requests_name_email_idx" ON "requests"("name", "email");

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
