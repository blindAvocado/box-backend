-- DropIndex
DROP INDEX "RefreshSession_fingerprint_key";

-- DropIndex
DROP INDEX "RefreshSession_refresh_token_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
