import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Mock SEO metrics data
    const mockMetrics = [
      {
        id: '1',
        websiteId: websiteId || '1',
        date: new Date('2024-01-01'),
        organicSessions: 12500,
        organicUsers: 8900,
        organicPageviews: 28400,
        avgSessionDuration: 185.5,
        bounceRate: 42.3,
        avgPosition: 12.8,
        totalClicks: 15600,
        totalImpressions: 234500,
        ctr: 6.65,
        goalCompletions: 89,
        goalConversionRate: 3.2,
        topPages: [
          { page: '/services', sessions: 2800, users: 2100 },
          { page: '/about', sessions: 1900, users: 1500 },
          { page: '/contact', sessions: 1200, users: 980 },
        ],
        topKeywords: [
          { keyword: 'seo services', position: 5, clicks: 890, impressions: 12400 },
          { keyword: 'digital marketing', position: 8, clicks: 650, impressions: 9800 },
          { keyword: 'web development', position: 12, clicks: 420, impressions: 6700 },
        ],
      },
      {
        id: '2',
        websiteId: websiteId || '1',
        date: new Date('2024-01-02'),
        organicSessions: 13200,
        organicUsers: 9400,
        organicPageviews: 29800,
        avgSessionDuration: 192.3,
        bounceRate: 41.1,
        avgPosition: 12.3,
        totalClicks: 16200,
        totalImpressions: 245000,
        ctr: 6.61,
        goalCompletions: 95,
        goalConversionRate: 3.4,
        topPages: [
          { page: '/services', sessions: 3100, users: 2300 },
          { page: '/about', sessions: 2000, users: 1600 },
          { page: '/contact', sessions: 1300, users: 1050 },
        ],
        topKeywords: [
          { keyword: 'seo services', position: 4, clicks: 950, impressions: 13200 },
          { keyword: 'digital marketing', position: 7, clicks: 720, impressions: 10500 },
          { keyword: 'web development', position: 11, clicks: 480, impressions: 7200 },
        ],
      },
    ];

    return NextResponse.json({ metrics: mockMetrics });
  } catch (error) {
    console.error('Error fetching SEO metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO metrics' },
      { status: 500 }
    );
  }
}
