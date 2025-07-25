/*
  Warnings:

  - You are about to drop the column `entityId` on the `images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[image_id]` on the table `partners` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "entityId";

-- CreateIndex
CREATE UNIQUE INDEX "partners_image_id_key" ON "partners"("image_id");
