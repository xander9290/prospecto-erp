/*
  Warnings:

  - A unique constraint covering the columns `[request_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_request_id_key" ON "users"("request_id");
