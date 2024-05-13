/*
  Warnings:

  - You are about to drop the `RefreshSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RefreshSession" DROP CONSTRAINT "RefreshSession_user_id_fkey";

-- DropTable
DROP TABLE "RefreshSession";

-- CreateTable
CREATE TABLE "refresh_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refresh_token" VARCHAR(512) NOT NULL,
    "fingerprint" VARCHAR(32) NOT NULL,

    CONSTRAINT "refresh_sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
