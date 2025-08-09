import { PrismaClient } from '@prisma/client';
import { subDays, subMonths } from 'date-fns';

// Import enums from generated types
const UserRole = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT'
} as const;

const PpcPlatform = {
  GOOGLE_ADS: 'GOOGLE_ADS',
  FACEBOOK_ADS: 'FACEBOOK_ADS',
  MICROSOFT_ADS: 'MICROSOFT_ADS',
  LINKEDIN_ADS: 'LINKEDIN_ADS',
  TWITTER_ADS: 'TWITTER_ADS',
  OTHER: 'OTHER'
} as const;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Organizations (Clients)
  const organizations = await Promise.all([
    prisma.organization.upsert({
      where: { slug: 'acme-corp' },
      update: {},
      create: {
        name: 'Acme Corporation',
        slug: 'acme-corp',
        contactEmail: 'contact@acmecorp.com',
        contactPhone: '+1 (555) 123-4567',
      },
    }),
    prisma.organization.upsert({
      where: { slug: 'tech-solutions' },
      update: {},
      create: {
        name: 'Tech Solutions Inc',
        slug: 'tech-solutions',
        contactEmail: 'hello@techsolutions.com',
        contactPhone: '+1 (555) 987-6543',
      },
    }),
    prisma.organization.upsert({
      where: { slug: 'green-energy' },
      update: {},
      create: {
        name: 'Green Energy Co',
        slug: 'green-energy',
        contactEmail: 'info@greenenergy.com',
        contactPhone: '+1 (555) 456-7890',
      },
    }),
  ]);

  console.log('✅ Created organizations');

  // Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { auth0Id: 'auth0|admin123' },
    update: {},
    create: {
      auth0Id: 'auth0|admin123',
      email: 'admin@oakleymetrics.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  // Create Client Users
  const clientUsers = await Promise.all([
    prisma.user.upsert({
      where: { auth0Id: 'auth0|client1' },
      update: {},
      create: {
        auth0Id: 'auth0|client1',
        email: 'john@acmecorp.com',
        name: 'John Smith',
        role: UserRole.CLIENT,
        organizationId: organizations[0].id,
      },
    }),
    prisma.user.upsert({
      where: { auth0Id: 'auth0|client2' },
      update: {},
      create: {
        auth0Id: 'auth0|client2',
        email: 'sarah@techsolutions.com',
        name: 'Sarah Johnson',
        role: UserRole.CLIENT,
        organizationId: organizations[1].id,
      },
    }),
    prisma.user.upsert({
      where: { auth0Id: 'auth0|client3' },
      update: {},
      create: {
        auth0Id: 'auth0|client3',
        email: 'mike@greenenergy.com',
        name: 'Mike Davis',
        role: UserRole.CLIENT,
        organizationId: organizations[2].id,
      },
    }),
  ]);

  console.log('✅ Created users');

  // Create Websites
  const websites = await Promise.all([
    // Acme Corp websites
    prisma.website.upsert({
      where: { domain: 'acmecorp.com' },
      update: {},
      create: {
        name: 'Acme Corp Main Site',
        domain: 'acmecorp.com',
        organizationId: organizations[0].id,
        googleAnalyticsId: 'GA-12345678',
        googleAdsId: 'AW-987654321',
        isActive: true,
      },
    }),
    prisma.website.upsert({
      where: { domain: 'shop.acmecorp.com' },
      update: {},
      create: {
        name: 'Acme Corp Shop',
        domain: 'shop.acmecorp.com',
        organizationId: organizations[0].id,
        googleAnalyticsId: 'GA-12345679',
        googleAdsId: 'AW-987654322',
        isActive: true,
      },
    }),
    // Tech Solutions websites
    prisma.website.upsert({
      where: { domain: 'techsolutions.com' },
      update: {},
      create: {
        name: 'Tech Solutions',
        domain: 'techsolutions.com',
        organizationId: organizations[1].id,
        googleAnalyticsId: 'GA-23456789',
        googleAdsId: 'AW-876543210',
        facebookPixelId: 'FB-123456789',
        isActive: true,
      },
    }),
    // Green Energy websites
    prisma.website.upsert({
      where: { domain: 'greenenergy.com' },
      update: {},
      create: {
        name: 'Green Energy Solutions',
        domain: 'greenenergy.com',
        organizationId: organizations[2].id,
        googleAnalyticsId: 'GA-34567890',
        googleAdsId: 'AW-765432109',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created websites');

  // Create Website Access for users
  const websiteAccess = [];
  
  // Admin has access to all websites
  for (const website of websites) {
    websiteAccess.push(
      prisma.websiteAccess.upsert({
        where: { 
          userId_websiteId: { 
            userId: adminUser.id, 
            websiteId: website.id 
          } 
        },
        update: {},
        create: {
          userId: adminUser.id,
          websiteId: website.id,
          canView: true,
          canEdit: true,
        },
      })
    );
  }

  // Client users have access to their organization's websites
  websiteAccess.push(
    // John Smith (Acme Corp) - access to both Acme websites
    prisma.websiteAccess.upsert({
      where: { 
        userId_websiteId: { 
          userId: clientUsers[0].id, 
          websiteId: websites[0].id 
        } 
      },
      update: {},
      create: {
        userId: clientUsers[0].id,
        websiteId: websites[0].id,
        canView: true,
        canEdit: false,
      },
    }),
    prisma.websiteAccess.upsert({
      where: { 
        userId_websiteId: { 
          userId: clientUsers[0].id, 
          websiteId: websites[1].id 
        } 
      },
      update: {},
      create: {
        userId: clientUsers[0].id,
        websiteId: websites[1].id,
        canView: true,
        canEdit: false,
      },
    }),
    // Sarah Johnson (Tech Solutions)
    prisma.websiteAccess.upsert({
      where: { 
        userId_websiteId: { 
          userId: clientUsers[1].id, 
          websiteId: websites[2].id 
        } 
      },
      update: {},
      create: {
        userId: clientUsers[1].id,
        websiteId: websites[2].id,
        canView: true,
        canEdit: false,
      },
    }),
    // Mike Davis (Green Energy)
    prisma.websiteAccess.upsert({
      where: { 
        userId_websiteId: { 
          userId: clientUsers[2].id, 
          websiteId: websites[3].id 
        } 
      },
      update: {},
      create: {
        userId: clientUsers[2].id,
        websiteId: websites[3].id,
        canView: true,
        canEdit: false,
      },
    })
  );

  await Promise.all(websiteAccess);
  console.log('✅ Created website access permissions');

  // Create PPC Campaigns
  const campaigns = await Promise.all([
    // Acme Corp campaigns
    prisma.ppcCampaign.upsert({
      where: { 
        websiteId_platformCampaignId_platform: {
          websiteId: websites[0].id,
          platformCampaignId: 'gads_acme_brand',
          platform: PpcPlatform.GOOGLE_ADS
        }
      },
      update: {},
      create: {
        websiteId: websites[0].id,
        platformCampaignId: 'gads_acme_brand',
        platform: PpcPlatform.GOOGLE_ADS,
        name: 'Acme Brand Campaign',
        type: 'Search',
        budget: 5000,
        bidStrategy: 'Target CPA',
        status: 'Active',
      },
    }),
    prisma.ppcCampaign.upsert({
      where: { 
        websiteId_platformCampaignId_platform: {
          websiteId: websites[1].id,
          platformCampaignId: 'gads_acme_shopping',
          platform: PpcPlatform.GOOGLE_ADS
        }
      },
      update: {},
      create: {
        websiteId: websites[1].id,
        platformCampaignId: 'gads_acme_shopping',
        platform: PpcPlatform.GOOGLE_ADS,
        name: 'Acme Shopping Campaign',
        type: 'Shopping',
        budget: 3000,
        bidStrategy: 'Maximize Clicks',
        status: 'Active',
      },
    }),
    // Tech Solutions campaigns
    prisma.ppcCampaign.upsert({
      where: { 
        websiteId_platformCampaignId_platform: {
          websiteId: websites[2].id,
          platformCampaignId: 'fb_tech_lead_gen',
          platform: PpcPlatform.FACEBOOK_ADS
        }
      },
      update: {},
      create: {
        websiteId: websites[2].id,
        platformCampaignId: 'fb_tech_lead_gen',
        platform: PpcPlatform.FACEBOOK_ADS,
        name: 'Tech Solutions Lead Generation',
        type: 'Lead Generation',
        budget: 2000,
        bidStrategy: 'Lowest Cost',
        status: 'Active',
      },
    }),
  ]);

  console.log('✅ Created PPC campaigns');

  // Generate SEO metrics for the last 30 days
  console.log('🔄 Generating SEO metrics...');
  
  for (const website of websites) {
    const seoMetrics = [];
    
    for (let i = 0; i < 30; i++) {
      const date = subDays(new Date(), i);
      const baseSessionValue = website.domain.includes('acme') ? 1500 : 
                              website.domain.includes('tech') ? 800 : 600;
      
      // Add some randomness to make data more realistic
      const variance = Math.random() * 0.4 + 0.8; // 0.8 to 1.2 multiplier
      
      seoMetrics.push({
        websiteId: website.id,
        date: date,
        organicSessions: Math.floor(baseSessionValue * variance),
        organicUsers: Math.floor(baseSessionValue * 0.7 * variance),
        organicPageviews: Math.floor(baseSessionValue * 2.1 * variance),
        avgSessionDuration: 180 + Math.random() * 120,
        bounceRate: 0.45 + Math.random() * 0.3,
        avgPosition: 15 + Math.random() * 20,
        totalClicks: Math.floor(baseSessionValue * 0.8 * variance),
        totalImpressions: Math.floor(baseSessionValue * 12 * variance),
        ctr: 0.03 + Math.random() * 0.07,
        goalCompletions: Math.floor(baseSessionValue * 0.05 * variance),
        goalConversionRate: 0.02 + Math.random() * 0.06,
        topPages: [
          { page: '/', sessions: Math.floor(baseSessionValue * 0.3 * variance), users: Math.floor(baseSessionValue * 0.2 * variance) },
          { page: '/services', sessions: Math.floor(baseSessionValue * 0.2 * variance), users: Math.floor(baseSessionValue * 0.15 * variance) },
          { page: '/about', sessions: Math.floor(baseSessionValue * 0.1 * variance), users: Math.floor(baseSessionValue * 0.08 * variance) }
        ],
        topKeywords: [
          { keyword: 'business solutions', position: 8 + Math.random() * 10, clicks: Math.floor(50 * variance), impressions: Math.floor(800 * variance) },
          { keyword: 'professional services', position: 12 + Math.random() * 15, clicks: Math.floor(30 * variance), impressions: Math.floor(600 * variance) }
        ]
      });
    }

    await prisma.seoMetric.createMany({
      data: seoMetrics,
      skipDuplicates: true,
    });
  }

  // Generate PPC metrics for the last 30 days
  console.log('🔄 Generating PPC metrics...');
  
  for (const campaign of campaigns) {
    const ppcMetrics = [];
    
    for (let i = 0; i < 30; i++) {
      const date = subDays(new Date(), i);
      const baseCost = campaign.budget ? campaign.budget / 30 : 100;
      const variance = Math.random() * 0.6 + 0.7; // 0.7 to 1.3 multiplier
      
      const cost = baseCost * variance;
      const clicks = Math.floor(cost / (2 + Math.random() * 3)); // CPC between $2-5
      const impressions = Math.floor(clicks / (0.02 + Math.random() * 0.08)); // CTR between 2-10%
      const conversions = Math.floor(clicks * (0.02 + Math.random() * 0.08)); // Conversion rate 2-10%
      const revenue = conversions * (60 + Math.random() * 240); // $60-300 revenue per conversion
      
      ppcMetrics.push({
        websiteId: campaign.websiteId,
        campaignId: campaign.id,
        date: date,
        platform: campaign.platform,
        impressions: impressions,
        clicks: clicks,
        ctr: clicks / impressions,
        cost: cost,
        cpc: cost / clicks,
        cpm: (cost / impressions) * 1000,
        conversions: conversions,
        conversionRate: conversions / clicks,
        conversionValue: conversions * (50 + Math.random() * 200), // $50-250 per conversion
        costPerConversion: conversions > 0 ? cost / conversions : 0,
        qualityScore: 6 + Math.random() * 4, // 6-10 quality score
        revenue: revenue,
        roas: cost > 0 ? revenue / cost : 0,
        profit: revenue - cost,
      });
    }

    await prisma.ppcMetric.createMany({
      data: ppcMetrics,
      skipDuplicates: true,
    });
  }

  console.log('✅ Generated historical metrics data');
  console.log('🎉 Database seeding completed successfully!');
  
  // Print summary
  console.log('\n📊 Seeding Summary:');
  console.log(`- ${organizations.length} organizations created`);
  console.log(`- ${clientUsers.length + 1} users created (including admin)`);
  console.log(`- ${websites.length} websites created`);
  console.log(`- ${campaigns.length} PPC campaigns created`);
  console.log('- 30 days of SEO metrics for each website');
  console.log('- 30 days of PPC metrics for each campaign');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
