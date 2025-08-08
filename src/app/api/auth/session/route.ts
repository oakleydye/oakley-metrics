import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info');
    const accessTokenCookie = cookieStore.get('access_token');
    
    if (!userInfoCookie || !accessTokenCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const userInfo = JSON.parse(userInfoCookie.value);
    
    // Transform Auth0 user data to our User interface
    const user = {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name || userInfo.nickname,
      role: 'CLIENT' as const, // Default role, you can enhance this later
      organizationId: undefined, // You can map this from user metadata later
    };
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Session check failed' }, { status: 500 });
  }
}
