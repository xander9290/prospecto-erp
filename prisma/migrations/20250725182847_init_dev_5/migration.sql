/*
  Warnings:

  - The values [EMPLOYEE] on the enum `PartnerType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PartnerType_new" AS ENUM ('CUSTOMER', 'SUPPLIER', 'INTERNAL');
ALTER TABLE "partners" ALTER COLUMN "displayType" DROP DEFAULT;
ALTER TABLE "partners" ALTER COLUMN "displayType" TYPE "PartnerType_new" USING ("displayType"::text::"PartnerType_new");
ALTER TYPE "PartnerType" RENAME TO "PartnerType_old";
ALTER TYPE "PartnerType_new" RENAME TO "PartnerType";
DROP TYPE "PartnerType_old";
ALTER TABLE "partners" ALTER COLUMN "displayType" SET DEFAULT 'INTERNAL';
COMMIT;
