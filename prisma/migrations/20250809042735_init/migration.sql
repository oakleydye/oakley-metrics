-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateEnum
CREATE TYPE "app"."UserRole" AS ENUM ('ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "app"."PpcPlatform" AS ENUM ('GOOGLE_ADS', 'FACEBOOK_ADS', 'MICROSOFT_ADS', 'LINKEDIN_ADS', 'TWITTER_ADS', 'OTHER');

-- CreateTable
CREATE TABLE "app"."users" (
    "id" TEXT NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "app"."UserRole" NOT NULL DEFAULT 'CLIENT',
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."websites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "googleAnalyticsId" TEXT,
    "googleAdsId" TEXT,
    "facebookPixelId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."website_access" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT true,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."seo_metrics" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "organicSessions" INTEGER,
    "organicUsers" INTEGER,
    "organicPageviews" INTEGER,
    "avgSessionDuration" DOUBLE PRECISION,
    "bounceRate" DOUBLE PRECISION,
    "avgPosition" DOUBLE PRECISION,
    "totalClicks" INTEGER,
    "totalImpressions" INTEGER,
    "ctr" DOUBLE PRECISION,
    "topPages" JSONB,
    "topKeywords" JSONB,
    "goalCompletions" INTEGER,
    "goalConversionRate" DOUBLE PRECISION,
    "ecommerceRevenue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."ppc_campaigns" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "platformCampaignId" TEXT NOT NULL,
    "platform" "app"."PpcPlatform" NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "budget" DOUBLE PRECISION,
    "bidStrategy" TEXT,
    "status" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ppc_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."ppc_metrics" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "campaignId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "platform" "app"."PpcPlatform" NOT NULL,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cost" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "conversions" INTEGER,
    "conversionRate" DOUBLE PRECISION,
    "conversionValue" DOUBLE PRECISION,
    "costPerConversion" DOUBLE PRECISION,
    "qualityScore" DOUBLE PRECISION,
    "adRank" DOUBLE PRECISION,
    "searchImpressionShare" DOUBLE PRECISION,
    "revenue" DOUBLE PRECISION,
    "roas" DOUBLE PRECISION,
    "profit" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ppc_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0Id_key" ON "app"."users"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "app"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "app"."organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "websites_domain_key" ON "app"."websites"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "website_access_userId_websiteId_key" ON "app"."website_access"("userId", "websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metrics_websiteId_date_key" ON "app"."seo_metrics"("websiteId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ppc_campaigns_websiteId_platformCampaignId_platform_key" ON "app"."ppc_campaigns"("websiteId", "platformCampaignId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "ppc_metrics_websiteId_date_platform_campaignId_key" ON "app"."ppc_metrics"("websiteId", "date", "platform", "campaignId");

-- AddForeignKey
ALTER TABLE "app"."users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "app"."organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."websites" ADD CONSTRAINT "websites_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "app"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."website_access" ADD CONSTRAINT "website_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."website_access" ADD CONSTRAINT "website_access_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "app"."websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."seo_metrics" ADD CONSTRAINT "seo_metrics_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "app"."websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."ppc_campaigns" ADD CONSTRAINT "ppc_campaigns_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "app"."websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."ppc_metrics" ADD CONSTRAINT "ppc_metrics_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "app"."websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."ppc_metrics" ADD CONSTRAINT "ppc_metrics_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "app"."ppc_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
