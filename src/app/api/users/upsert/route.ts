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

    // Check if user exists by Auth0 ID first
    let existingUser = await prisma.user.findUnique({
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

    // If not found by Auth0 ID, check by email (for onboarding users with temp Auth0 IDs)
    if (!existingUser) {
      existingUser = await prisma.user.findUnique({
        where: { email },
        include: {
          organization: true,
          websiteAccess: {
            include: {
              website: true
            }
          }
        }
      });
    }

    let user;

    if (existingUser) {
      // Update existing user - make sure to update Auth0 ID if it was a temp one
      user = await prisma.user.update({
        where: { id: existingUser.id }, // Use ID instead of auth0Id in case we found by email
        data: {
          auth0Id, // Update to real Auth0 ID
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
      
      console.log(`Updated existing user: ${existingUser.email} with Auth0 ID: ${auth0Id}`);
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

      console.log(`Created new user: ${email} with Auth0 ID: ${auth0Id}`);
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
