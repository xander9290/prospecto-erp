/*
  Warnings:

  - The `state` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "state",
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'no_active';

-- DropEnum
DROP TYPE "UserState";
