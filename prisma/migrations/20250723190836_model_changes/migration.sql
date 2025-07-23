/*
  Warnings:

  - You are about to drop the column `entityId` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_partner_id_idx";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "entityId",
DROP COLUMN "entityType";

-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "city" TEXT,
ADD COLUMN     "colony" TEXT,
ADD COLUMN     "cross_streets" TEXT,
ADD COLUMN     "imageId" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image_url";

-- CreateIndex
CREATE INDEX "partners_name_display_name_phone_idx" ON "partners"("name", "display_name", "phone");

-- CreateIndex
CREATE INDEX "users_display_name_user_name_email_idx" ON "users"("display_name", "user_name", "email");

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
