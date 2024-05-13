/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token]` on the table `refresh_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "refresh_sessions_refresh_token_key" ON "refresh_sessions"("refresh_token");
