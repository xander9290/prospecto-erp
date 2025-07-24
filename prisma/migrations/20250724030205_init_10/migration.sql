-- AlterTable
ALTER TABLE "partners" ALTER COLUMN "created_by" DROP DEFAULT,
ALTER COLUMN "user_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_by" DROP DEFAULT;
