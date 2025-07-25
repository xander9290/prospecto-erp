-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
