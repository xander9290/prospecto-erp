-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "created_by" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_by" TEXT DEFAULT '';
