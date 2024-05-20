-- DropForeignKey
ALTER TABLE "list_items" DROP CONSTRAINT "list_items_item_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "list_items" DROP CONSTRAINT "list_items_item_season_id_fkey";

-- DropForeignKey
ALTER TABLE "list_items" DROP CONSTRAINT "list_items_item_show_id_fkey";

-- AlterTable
ALTER TABLE "list_items" ALTER COLUMN "item_show_id" DROP NOT NULL,
ALTER COLUMN "item_episode_id" DROP NOT NULL,
ALTER COLUMN "item_season_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_item_show_id_fkey" FOREIGN KEY ("item_show_id") REFERENCES "shows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_item_episode_id_fkey" FOREIGN KEY ("item_episode_id") REFERENCES "episodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_item_season_id_fkey" FOREIGN KEY ("item_season_id") REFERENCES "seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
