import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info');
    const accessTokenCookie = cookieStore.get('access_token');
    
    if (!userInfoCookie || !accessTokenCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const auth0UserInfo = JSON.parse(userInfoCookie.value);
    
    // Get complete user data from database
    // First try by Auth0 ID, then by email (for onboarding users)
    let dbUser = await prisma.user.findUnique({
      where: { auth0Id: auth0UserInfo.sub },
      include: {
        organization: true,
        websiteAccess: {
          include: {
            website: true
          }
        }
      }
    });

    // If not found by Auth0 ID, try by email
    if (!dbUser && auth0UserInfo.email) {
      dbUser = await prisma.user.findUnique({
        where: { email: auth0UserInfo.email },
        include: {
          organization: true,
          websiteAccess: {
            include: {
              website: true
            }
          }
        }
      });

      // If found by email, update the Auth0 ID
      if (dbUser) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: { auth0Id: auth0UserInfo.sub },
          include: {
            organization: true,
            websiteAccess: {
              include: {
                website: true
              }
            }
          }
        });
        console.log(`Updated user ${dbUser.email} with Auth0 ID: ${auth0UserInfo.sub}`);
      }
    }
    
    if (!dbUser) {
      // User not found in database, create them
      try {
        const newUser = await prisma.user.create({
          data: {
            auth0Id: auth0UserInfo.sub,
            email: auth0UserInfo.email,
            name: auth0UserInfo.name || auth0UserInfo.nickname,
            role: auth0UserInfo.role || 'CLIENT',
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
        
        const user = {
          id: newUser.id,
          auth0Id: newUser.auth0Id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          organizationId: newUser.organizationId,
          organization: newUser.organization,
          websites: newUser.websiteAccess.map((access: any) => access.website),
        };
        
        return NextResponse.json({ user });
      } catch (createError) {
        console.error('Failed to create user:', createError);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
    }
    
    // Transform database user data to our User interface
    const user = {
      id: dbUser.id,
      auth0Id: dbUser.auth0Id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      organizationId: dbUser.organizationId,
      organization: dbUser.organization,
      websites: dbUser.websiteAccess.map((access: any) => access.website),
    };
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Session check failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
