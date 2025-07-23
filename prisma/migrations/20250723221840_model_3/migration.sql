/*
  Warnings:

  - You are about to drop the column `partner_id` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `partners` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_partner_id_fkey";

-- DropIndex
DROP INDEX "images_partner_id_key";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "partner_id",
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT;

-- AlterTable
ALTER TABLE "partners" DROP COLUMN "imageId";
