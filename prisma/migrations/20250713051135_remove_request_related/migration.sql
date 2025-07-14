/*
  Warnings:

  - You are about to drop the column `resquest_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_resquest_id_fkey";

-- DropIndex
DROP INDEX "users_partner_id_resquest_id_idx";

-- DropIndex
DROP INDEX "users_resquest_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "resquest_id";

-- CreateIndex
CREATE INDEX "users_partner_id_idx" ON "users"("partner_id");
