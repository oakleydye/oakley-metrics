import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auth0Id, email, name, role } = body;

    if (!auth0Id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: auth0Id, email' },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !['ADMIN', 'CLIENT'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN or CLIENT' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { auth0Id },
      include: {
        organization: true,
        websiteAccess: {
          include: {
            website: true
          }
        }
      }
    });

    let user;

    if (existingUser) {
      // Update existing user
      user = await prisma.user.update({
        where: { auth0Id },
        data: {
          email,
          name,
          ...(role && { role }),
        },
        include: {
          organization: true,
          websiteAccess: {
            include: {
              website: true
            }
          }
        }
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          auth0Id,
          email,
          name,
          role: role || 'CLIENT',
        },
        include: {
          organization: true,
          websiteAccess: {
            include: {
              website: true
            }
          }
        }
      });

      // If it's a new client user, you might want to assign them to a default organization
      // or create organization-specific logic here
    }

    // Return user data (excluding sensitive information)
    const userData = {
      id: user.id,
      auth0Id: user.auth0Id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      organization: user.organization,
      websiteAccess: user.websiteAccess,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('User upsert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
