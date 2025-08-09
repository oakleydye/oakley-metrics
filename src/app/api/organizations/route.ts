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

    const organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            websites: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
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

    const { name, description, domain, contactEmail, contactPhone } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    // Check if organization with this name already exists
    const existingOrg = await prisma.organization.findFirst({
      where: { name }
    });

    if (existingOrg) {
      return NextResponse.json({ error: 'Organization with this name already exists' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create the organization
    const newOrganization = await prisma.organization.create({
      data: {
        name,
        slug,
        description: description || null,
        domain: domain || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null
      }
    });

    return NextResponse.json({ 
      organization: newOrganization,
      message: 'Organization created successfully'
    });
  } catch (error) {
    console.error('Failed to create organization:', error);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
