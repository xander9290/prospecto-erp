/*
  Warnings:

  - A unique constraint covering the columns `[display_name]` on the table `partners` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[display_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_name` to the `partners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "display_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "display_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "partners_display_name_key" ON "partners"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_display_name_key" ON "users"("display_name");
