/*
  Warnings:

  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Actor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Episode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EpisodeRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EpisodeTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteSeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteShow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `List` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Network` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Season` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Show` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WatchedEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WatchedShow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_season_id_fkey";

-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_show_id_fkey";

-- DropForeignKey
ALTER TABLE "EpisodeRating" DROP CONSTRAINT "EpisodeRating_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "EpisodeRating" DROP CONSTRAINT "EpisodeRating_user_id_fkey";

-- DropForeignKey
ALTER TABLE "EpisodeTranslation" DROP CONSTRAINT "EpisodeTranslation_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "EpisodeTranslation" DROP CONSTRAINT "EpisodeTranslation_language_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteEpisode" DROP CONSTRAINT "FavoriteEpisode_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteEpisode" DROP CONSTRAINT "FavoriteEpisode_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteSeason" DROP CONSTRAINT "FavoriteSeason_season_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteSeason" DROP CONSTRAINT "FavoriteSeason_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteShow" DROP CONSTRAINT "FavoriteShow_show_id_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteShow" DROP CONSTRAINT "FavoriteShow_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_item_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_item_season_id_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_item_show_id_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_list_id_fkey";

-- DropForeignKey
ALTER TABLE "ListTag" DROP CONSTRAINT "ListTag_list_id_fkey";

-- DropForeignKey
ALTER TABLE "ListTag" DROP CONSTRAINT "ListTag_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "Network" DROP CONSTRAINT "Network_country_id_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_moderator_id_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_show_id_fkey";

-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_show_id_fkey";

-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_country_id_fkey";

-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_language_id_fkey";

-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_network_id_fkey";

-- DropForeignKey
ALTER TABLE "ShowRating" DROP CONSTRAINT "ShowRating_show_id_fkey";

-- DropForeignKey
ALTER TABLE "ShowRating" DROP CONSTRAINT "ShowRating_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ShowTranslation" DROP CONSTRAINT "ShowTranslation_language_id_fkey";

-- DropForeignKey
ALTER TABLE "ShowTranslation" DROP CONSTRAINT "ShowTranslation_show_id_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_user_id_fkey";

-- DropForeignKey
ALTER TABLE "WatchedEpisode" DROP CONSTRAINT "WatchedEpisode_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "WatchedEpisode" DROP CONSTRAINT "WatchedEpisode_user_id_fkey";

-- DropForeignKey
ALTER TABLE "WatchedShow" DROP CONSTRAINT "WatchedShow_show_id_fkey";

-- DropForeignKey
ALTER TABLE "WatchedShow" DROP CONSTRAINT "WatchedShow_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_ActorToShow" DROP CONSTRAINT "_ActorToShow_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActorToShow" DROP CONSTRAINT "_ActorToShow_B_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToShow" DROP CONSTRAINT "_GenreToShow_A_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToShow" DROP CONSTRAINT "_GenreToShow_B_fkey";

-- DropTable
DROP TABLE "Action";

-- DropTable
DROP TABLE "Actor";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Country";

-- DropTable
DROP TABLE "Episode";

-- DropTable
DROP TABLE "EpisodeRating";

-- DropTable
DROP TABLE "EpisodeTranslation";

-- DropTable
DROP TABLE "FavoriteEpisode";

-- DropTable
DROP TABLE "FavoriteSeason";

-- DropTable
DROP TABLE "FavoriteShow";

-- DropTable
DROP TABLE "Follows";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "List";

-- DropTable
DROP TABLE "ListItem";

-- DropTable
DROP TABLE "ListTag";

-- DropTable
DROP TABLE "Network";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Season";

-- DropTable
DROP TABLE "Show";

-- DropTable
DROP TABLE "ShowRating";

-- DropTable
DROP TABLE "ShowTranslation";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "WatchedEpisode";

-- DropTable
DROP TABLE "WatchedShow";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "refresh_hash" TEXT,
    "avatar_url" VARCHAR(64) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'OTHER',
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "shows" (
    "id" INTEGER NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "date_started" TIMESTAMP(3),
    "date_ended" TIMESTAMP(3),
    "season_count" INTEGER NOT NULL DEFAULT 0,
    "episode_count" INTEGER NOT NULL DEFAULT 0,
    "poster_url" VARCHAR(64) NOT NULL,
    "thumb_url" VARCHAR(64),
    "imdb" VARCHAR(10),
    "tvdb" VARCHAR(10),
    "tmdb" VARCHAR(10),
    "trailer_url" VARCHAR(128),
    "network_id" INTEGER NOT NULL,
    "air_status" "AirStatus" NOT NULL DEFAULT 'ENDED',
    "summary" VARCHAR(1024),
    "tagline" VARCHAR(128),
    "country_id" INTEGER NOT NULL,
    "users_watched" INTEGER NOT NULL DEFAULT 0,
    "average_runtime" INTEGER,
    "average_rating" DECIMAL(1,1) DEFAULT 0,
    "votes_count" INTEGER NOT NULL DEFAULT 0,
    "language_id" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" INTEGER NOT NULL,
    "show_id" INTEGER NOT NULL,
    "poster_url" VARCHAR(64) NOT NULL,
    "thumb_url" VARCHAR(64),
    "date_started" TIMESTAMP(3),
    "tmdb" VARCHAR(10),
    "number" INTEGER NOT NULL,
    "episode_count" INTEGER NOT NULL DEFAULT 0,
    "votes_count" INTEGER NOT NULL DEFAULT 0,
    "average_rating" DECIMAL(1,1) NOT NULL DEFAULT 0,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episodes" (
    "id" INTEGER NOT NULL,
    "show_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "date_aired" TIMESTAMP(3) NOT NULL,
    "thumb_url" TEXT,
    "summary" VARCHAR(512),
    "special" BOOLEAN NOT NULL DEFAULT false,
    "season_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "average_rating" DECIMAL(1,1) NOT NULL DEFAULT 0,
    "votes_count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "body" VARCHAR(2048) NOT NULL,
    "attached_image_url" VARCHAR(128) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "summary" VARCHAR(2048) NOT NULL,
    "type" "ListType" NOT NULL DEFAULT 'SHOW',
    "is_ranked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_items" (
    "id" SERIAL NOT NULL,
    "list_id" INTEGER NOT NULL,
    "item_show_id" INTEGER NOT NULL,
    "item_episode_id" INTEGER NOT NULL,
    "item_season_id" INTEGER NOT NULL,

    CONSTRAINT "list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_ratings" (
    "user_id" INTEGER NOT NULL,
    "show_id" INTEGER NOT NULL,
    "rating" DECIMAL(1,1) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "show_ratings_pkey" PRIMARY KEY ("user_id","show_id")
);

-- CreateTable
CREATE TABLE "episode_ratings" (
    "user_id" INTEGER NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "rating" DECIMAL(1,1) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "episode_ratings_pkey" PRIMARY KEY ("user_id","episode_id")
);

-- CreateTable
CREATE TABLE "watched_shows" (
    "user_id" INTEGER NOT NULL,
    "show_id" INTEGER NOT NULL,
    "status" "WatchStatus" NOT NULL DEFAULT 'WATCHING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watched_shows_pkey" PRIMARY KEY ("user_id","show_id")
);

-- CreateTable
CREATE TABLE "watched_episodes" (
    "user_id" INTEGER NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watched_episodes_pkey" PRIMARY KEY ("user_id","episode_id")
);

-- CreateTable
CREATE TABLE "favorite_shows" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "show_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_seasons" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_episodes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_translations" (
    "id" SERIAL NOT NULL,
    "show_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "summary" VARCHAR(512),

    CONSTRAINT "show_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episode_translations" (
    "id" SERIAL NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "summary" VARCHAR(512),

    CONSTRAINT "episode_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_tags" (
    "list_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "list_tags_pkey" PRIMARY KEY ("list_id","tag_id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "networks" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "full_name" VARCHAR(64) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actors" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "profile_url" VARCHAR(64),
    "imdb" VARCHAR(10),
    "tmdb" VARCHAR(10),
    "birthdate" TIMESTAMP(3),
    "deathdate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "full_name" VARCHAR(64) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "moderator_id" INTEGER NOT NULL,
    "show_id" INTEGER NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("moderator_id","show_id")
);

-- CreateTable
CREATE TABLE "actions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action_type" "ActionType" NOT NULL,
    "action_data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_password_hash_key" ON "users"("password_hash");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_item_show_id_fkey" FOREIGN KEY ("item_show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_item_episode_id_fkey" FOREIGN KEY ("item_episode_id") REFERENCES "episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_item_season_id_fkey" FOREIGN KEY ("item_season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_ratings" ADD CONSTRAINT "show_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_ratings" ADD CONSTRAINT "show_ratings_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_ratings" ADD CONSTRAINT "episode_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_ratings" ADD CONSTRAINT "episode_ratings_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watched_shows" ADD CONSTRAINT "watched_shows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watched_shows" ADD CONSTRAINT "watched_shows_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watched_episodes" ADD CONSTRAINT "watched_episodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watched_episodes" ADD CONSTRAINT "watched_episodes_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_shows" ADD CONSTRAINT "favorite_shows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_shows" ADD CONSTRAINT "favorite_shows_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_seasons" ADD CONSTRAINT "favorite_seasons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_seasons" ADD CONSTRAINT "favorite_seasons_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_episodes" ADD CONSTRAINT "favorite_episodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_episodes" ADD CONSTRAINT "favorite_episodes_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_translations" ADD CONSTRAINT "show_translations_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_translations" ADD CONSTRAINT "show_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_translations" ADD CONSTRAINT "episode_translations_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_translations" ADD CONSTRAINT "episode_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_tags" ADD CONSTRAINT "list_tags_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_tags" ADD CONSTRAINT "list_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "networks" ADD CONSTRAINT "networks_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToShow" ADD CONSTRAINT "_GenreToShow_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToShow" ADD CONSTRAINT "_GenreToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActorToShow" ADD CONSTRAINT "_ActorToShow_A_fkey" FOREIGN KEY ("A") REFERENCES "actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActorToShow" ADD CONSTRAINT "_ActorToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
