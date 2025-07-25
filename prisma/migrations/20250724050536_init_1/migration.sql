/*
  Warnings:

  - You are about to drop the column `image_url` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "agent_id" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "colony" TEXT,
ADD COLUMN     "cross_street" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ALTER COLUMN "created_by" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image_url",
ALTER COLUMN "created_by" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "partners_name_display_name_idx" ON "partners"("name", "display_name");

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
