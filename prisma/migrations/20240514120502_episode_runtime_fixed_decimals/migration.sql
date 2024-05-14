-- AlterTable
ALTER TABLE "episode_ratings" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(2,1);

-- AlterTable
ALTER TABLE "episodes" ADD COLUMN     "runtime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "season_number" INTEGER DEFAULT 0,
ALTER COLUMN "average_rating" SET DATA TYPE DECIMAL(2,1);

-- AlterTable
ALTER TABLE "seasons" ALTER COLUMN "average_rating" SET DATA TYPE DECIMAL(2,1);

-- AlterTable
ALTER TABLE "show_ratings" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(2,1);

-- AlterTable
ALTER TABLE "shows" ALTER COLUMN "average_rating" SET DATA TYPE DECIMAL(2,1);
