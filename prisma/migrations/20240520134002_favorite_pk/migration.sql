/*
  Warnings:

  - The primary key for the `favorite_episodes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `favorite_episodes` table. All the data in the column will be lost.
  - The primary key for the `favorite_seasons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `favorite_seasons` table. All the data in the column will be lost.
  - The primary key for the `favorite_shows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `favorite_shows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "favorite_episodes" DROP CONSTRAINT "favorite_episodes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "favorite_episodes_pkey" PRIMARY KEY ("user_id", "episode_id");

-- AlterTable
ALTER TABLE "favorite_seasons" DROP CONSTRAINT "favorite_seasons_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "favorite_seasons_pkey" PRIMARY KEY ("user_id", "season_id");

-- AlterTable
ALTER TABLE "favorite_shows" DROP CONSTRAINT "favorite_shows_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "favorite_shows_pkey" PRIMARY KEY ("user_id", "show_id");
