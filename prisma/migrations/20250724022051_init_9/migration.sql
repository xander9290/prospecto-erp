/*
  Warnings:

  - You are about to drop the column `image_url` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image_url";
