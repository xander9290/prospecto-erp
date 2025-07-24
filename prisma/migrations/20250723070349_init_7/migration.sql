-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_partner_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "partner_id" DROP NOT NULL,
ALTER COLUMN "partner_id" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
