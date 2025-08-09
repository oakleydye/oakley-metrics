-- AlterEnum
ALTER TYPE "app"."UserRole" ADD VALUE 'VIEWER';

-- AlterTable
ALTER TABLE "app"."organizations" ADD COLUMN     "description" TEXT,
ADD COLUMN     "domain" TEXT;

-- AlterTable
ALTER TABLE "app"."websites" ADD COLUMN     "country" TEXT DEFAULT 'US',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "url" TEXT;
