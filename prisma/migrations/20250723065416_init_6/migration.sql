-- AlterTable
ALTER TABLE "partners" ALTER COLUMN "created_by" SET DEFAULT '',
ALTER COLUMN "user_id" SET DEFAULT '';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_by" SET DEFAULT '';
