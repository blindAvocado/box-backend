-- CreateTable
CREATE TABLE "RefreshSession" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refresh_token" VARCHAR(512) NOT NULL,
    "fingerprint" VARCHAR(32) NOT NULL,

    CONSTRAINT "RefreshSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshSession_refresh_token_key" ON "RefreshSession"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshSession_fingerprint_key" ON "RefreshSession"("fingerprint");

-- AddForeignKey
ALTER TABLE "RefreshSession" ADD CONSTRAINT "RefreshSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
