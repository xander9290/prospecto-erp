-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('no_active', 'active');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "state" "UserState" NOT NULL DEFAULT 'no_active';
