-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'EMPLOYEE', 'INTERNAL');

-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "displayType" "PartnerType" NOT NULL DEFAULT 'INTERNAL';
