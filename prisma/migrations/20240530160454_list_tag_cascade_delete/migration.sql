-- DropForeignKey
ALTER TABLE "list_tags" DROP CONSTRAINT "list_tags_list_id_fkey";

-- AddForeignKey
ALTER TABLE "list_tags" ADD CONSTRAINT "list_tags_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
