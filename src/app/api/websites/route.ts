import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Verify admin access
async function verifyAdminAccess() {
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get('user_info');
  
  if (!userInfoCookie) {
    return { error: 'Not authenticated', status: 401 };
  }
  
  const userInfo = JSON.parse(userInfoCookie.value);
  if (userInfo.role !== 'ADMIN') {
    return { error: 'Admin access required', status: 403 };
  }
  
  return { success: true };
}

export async function GET() {
  try {
    const authCheck = await verifyAdminAccess();
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const websites = await prisma.website.findMany({
      include: {
        organization: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            userAccess: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ websites });
  } catch (error) {
    console.error('Error fetching websites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch websites' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = await verifyAdminAccess();
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const { name, url, description, organizationId, industry, country } = await request.json();

    // Validate required fields
    if (!name || !url || !organizationId) {
      return NextResponse.json(
        { error: 'Name, URL, and organization are required' },
        { status: 400 }
      );
    }

    // Validate organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 400 });
    }

    // Extract domain from URL
    let domain;
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname;
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Check if website with this domain already exists
    const existingWebsite = await prisma.website.findFirst({
      where: { domain }
    });

    if (existingWebsite) {
      return NextResponse.json({ error: 'Website with this domain already exists' }, { status: 400 });
    }

    // Create the website
    const newWebsite = await prisma.website.create({
      data: {
        name,
        domain,
        url,
        description: description || null,
        organizationId,
        industry: industry || null,
        country: country || 'US',
        isActive: true
      },
      include: {
        organization: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({ 
      website: newWebsite,
      message: 'Website created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating website:', error);
    return NextResponse.json(
      { error: 'Failed to create website' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
