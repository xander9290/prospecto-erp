/*
  Warnings:

  - You are about to drop the column `request_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partner_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resquest_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_partner_id_request_id_idx";

-- DropIndex
DROP INDEX "users_request_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "request_id",
ADD COLUMN     "resquest_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_partner_id_key" ON "users"("partner_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_resquest_id_key" ON "users"("resquest_id");

-- CreateIndex
CREATE INDEX "users_partner_id_resquest_id_idx" ON "users"("partner_id", "resquest_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_resquest_id_fkey" FOREIGN KEY ("resquest_id") REFERENCES "requests"("email") ON DELETE SET NULL ON UPDATE CASCADE;
