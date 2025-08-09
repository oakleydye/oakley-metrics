import { NextRequest, NextResponse } from 'next/server';

// Simple auth route handler - we'll implement Auth0 login/callback later
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth0: string }> }
) {
  const { auth0 } = await params;
  
  switch (auth0) {
    case 'login':
      // Redirect to Auth0 login
      return NextResponse.redirect(`${process.env.AUTH0_ISSUER_BASE_URL}/authorize?` + 
        new URLSearchParams({
          response_type: 'code',
          client_id: process.env.AUTH0_CLIENT_ID || '',
          redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
          scope: 'openid profile email',
        })
      );
      
    case 'callback':
      // Handle Auth0 callback - exchange code for tokens
      const url = new URL(request.url);
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');
      
      if (error) {
        console.error('Auth0 error:', error);
        return NextResponse.redirect(`/?error=${error}`);
      }
      
      if (!code) {
        console.error('No authorization code received');
        return NextResponse.redirect('/?error=no_code');
      }
      
      try {
        // Exchange authorization code for tokens
        const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code: code,
            redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
          }),
        });
        
        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('Token exchange failed:', errorText);
          return NextResponse.redirect('/?error=token_exchange_failed');
        }
        
        const tokens = await tokenResponse.json();
        
        // Get user info with roles
        const userResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
          },
        });
        
        if (!userResponse.ok) {
          console.error('Failed to get user info');
          return NextResponse.redirect('/?error=user_info_failed');
        }
        
        const auth0User = await userResponse.json();
        console.log('Auth0 user info:', auth0User);

        // Extract roles from Auth0 user metadata or custom claims
        // Auth0 typically stores roles in app_metadata or custom claims
        const roles = auth0User['https://auth.oakleydye.com/roles'] || 
                     auth0User.app_metadata?.roles || 
                     auth0User['auth.oakleydye.com/roles'] || 
                     ['CLIENT']; // Default role
        
        const userRole = roles.includes('ADMIN') ? 'ADMIN' : 'CLIENT';
        
        // Create or update user in database
        try {
          const userUpsertResponse = await fetch(`${process.env.AUTH0_BASE_URL}/api/users/upsert`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              auth0Id: auth0User.sub,
              email: auth0User.email,
              name: auth0User.name || auth0User.nickname,
              role: userRole,
            }),
          });
          
          if (!userUpsertResponse.ok) {
            console.warn('Failed to upsert user in database');
          }
        } catch (dbError) {
          console.warn('Database upsert failed:', dbError);
          // Continue with auth flow even if DB fails
        }
        
        // Create response and set secure cookies
        const response = NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/dashboard`);
        
        console.log('Setting auth cookies and redirecting to dashboard');
        
        // Set HTTP-only cookies for security
        response.cookies.set('access_token', tokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: tokens.expires_in || 3600,
        });
        
        if (tokens.refresh_token) {
          response.cookies.set('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
          });
        }
        
        // Store user info in a cookie (or save to database)
        response.cookies.set('user_info', JSON.stringify({
          ...auth0User,
          role: userRole
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: tokens.expires_in || 3600,
        });
        
        return response;
        
      } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.redirect('/?error=callback_failed');
      }
      
    case 'logout':
      // Handle logout - clear cookies and redirect to Auth0 logout
      const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?` +
        new URLSearchParams({
          client_id: process.env.AUTH0_CLIENT_ID || '',
          returnTo: process.env.AUTH0_BASE_URL || '',
        });
      
      const response = NextResponse.redirect(logoutUrl);
      
      // Clear all auth cookies
      response.cookies.set('access_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      
      response.cookies.set('refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      
      response.cookies.set('user_info', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      
      return response;
      
    default:
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
