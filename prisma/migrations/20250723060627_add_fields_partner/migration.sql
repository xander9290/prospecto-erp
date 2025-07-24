-- DropIndex
DROP INDEX "users_partner_id_idx";

-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "colony" TEXT,
ADD COLUMN     "complete_address" TEXT,
ADD COLUMN     "crosse_streets" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "created_by" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "partners_name_display_name_phone_idx" ON "partners"("name", "display_name", "phone");

-- CreateIndex
CREATE INDEX "users_display_name_email_user_name_idx" ON "users"("display_name", "email", "user_name");

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
