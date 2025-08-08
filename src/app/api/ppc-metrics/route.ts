import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');
    const platform = searchParams.get('platform');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Mock PPC metrics data
    const mockMetrics = [
      {
        id: '1',
        websiteId: websiteId || '1',
        campaignId: 'camp-1',
        date: new Date('2024-01-01'),
        platform: platform || 'GOOGLE_ADS',
        impressions: 45600,
        clicks: 1890,
        ctr: 4.14,
        cost: 850.25,
        cpc: 0.45,
        cpm: 18.65,
        conversions: 42,
        conversionRate: 2.22,
        conversionValue: 3200.00,
        costPerConversion: 20.24,
        qualityScore: 7.2,
        revenue: 4100.00,
        roas: 4.82,
        profit: 3249.75,
      },
      {
        id: '2',
        websiteId: websiteId || '1',
        campaignId: 'camp-1',
        date: new Date('2024-01-02'),
        platform: platform || 'GOOGLE_ADS',
        impressions: 47200,
        clicks: 2010,
        ctr: 4.26,
        cost: 920.50,
        cpc: 0.46,
        cpm: 19.50,
        conversions: 48,
        conversionRate: 2.39,
        conversionValue: 3680.00,
        costPerConversion: 19.18,
        qualityScore: 7.4,
        revenue: 4580.00,
        roas: 4.97,
        profit: 3659.50,
      },
      {
        id: '3',
        websiteId: websiteId || '1',
        campaignId: 'camp-2',
        date: new Date('2024-01-01'),
        platform: 'FACEBOOK_ADS',
        impressions: 28900,
        clicks: 850,
        ctr: 2.94,
        cost: 420.80,
        cpc: 0.49,
        cpm: 14.56,
        conversions: 18,
        conversionRate: 2.12,
        conversionValue: 1440.00,
        costPerConversion: 23.38,
        revenue: 1680.00,
        roas: 3.99,
        profit: 1259.20,
      },
    ];

    // Filter by platform if specified
    const filteredMetrics = platform 
      ? mockMetrics.filter(metric => metric.platform === platform)
      : mockMetrics;

    return NextResponse.json({ metrics: filteredMetrics });
  } catch (error) {
    console.error('Error fetching PPC metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PPC metrics' },
      { status: 500 }
    );
  }
}
