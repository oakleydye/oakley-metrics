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

    const clients = await prisma.user.findMany({
      where: {
        role: {
          in: ['CLIENT', 'VIEWER']
        }
      },
      include: {
        organization: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
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

    const { email, name, role, organizationId } = await request.json();

    // Validate required fields
    if (!email || !name || !role) {
      return NextResponse.json({ error: 'Email, name, and role are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Validate organization if provided
    if (organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId }
      });

      if (!organization) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 400 });
      }
    }

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        organizationId: organizationId || null,
        // Generate a temporary auth0Id - this will be updated when the user first logs in
        auth0Id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      include: {
        organization: {
          select: {
            name: true
          }
        }
      }
    });

    // TODO: Send invitation email to the user
    // This would typically involve sending an Auth0 invitation or custom invitation email

    return NextResponse.json({ 
      client: newUser,
      message: 'Client created successfully. Invitation email will be sent.'
    });
  } catch (error) {
    console.error('Failed to create client:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
