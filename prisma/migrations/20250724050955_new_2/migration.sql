-- DropIndex
DROP INDEX "users_partner_id_idx";

-- CreateIndex
CREATE INDEX "users_user_name_display_name_email_idx" ON "users"("user_name", "display_name", "email");
