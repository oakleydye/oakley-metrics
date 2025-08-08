import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // For now, return mock data since we don't have a database set up yet
    const mockWebsites = [
      {
        id: '1',
        name: 'Main Website',
        domain: 'example.com',
        organizationId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return NextResponse.json({ websites: mockWebsites });
  } catch (error) {
    console.error('Error fetching websites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, domain, organizationId } = body;

    // Validate required fields
    if (!name || !domain || !organizationId) {
      return NextResponse.json(
        { error: 'Name, domain, and organizationId are required' },
        { status: 400 }
      );
    }

    // For now, return mock data
    const mockWebsite = {
      id: Date.now().toString(),
      name,
      domain,
      organizationId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(mockWebsite, { status: 201 });
  } catch (error) {
    console.error('Error creating website:', error);
    return NextResponse.json(
      { error: 'Failed to create website' },
      { status: 500 }
    );
  }
}
