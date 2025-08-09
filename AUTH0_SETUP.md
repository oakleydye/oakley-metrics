# Auth0 Setup Guide for Role-Based Authentication

## Overview
This guide explains how to configure Auth0 to work with our enhanced role-based authentication system.

## Auth0 Configuration Steps

### 1. Auth0 Application Settings
Make sure your Auth0 application has these settings:

**Application URIs:**
- Allowed Callback URLs: `http://localhost:3001/api/auth/auth0/callback,http://localhost:3002/api/auth/auth0/callback,https://yourdomain.com/api/auth/auth0/callback`
- Allowed Logout URLs: `http://localhost:3001,http://localhost:3002,https://yourdomain.com`
- Allowed Web Origins: `http://localhost:3001,http://localhost:3002,https://yourdomain.com`

### 2. Environment Variables
Ensure your `.env.local` file contains:

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_BASE_URL=http://localhost:3001

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/oakley_metrics?schema=public"
```

### 3. Auth0 Rules/Actions for Role Management

You need to create an Auth0 Action (or Rule) to add custom role claims to the JWT token.

#### Option A: Using Auth0 Actions (Recommended)

1. Go to Auth0 Dashboard > Actions > Flows
2. Select "Login"
3. Create a new Action with this code:

```javascript
/**
* Handler that will be called during the execution of a PostLogin flow.
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://yourdomain.com/';
  
  // Get user roles from app_metadata or user_metadata
  const userRoles = event.user.app_metadata?.roles || event.user.user_metadata?.roles || ['CLIENT'];
  
  // Default to CLIENT role if no roles are set
  const role = Array.isArray(userRoles) ? userRoles[0] : userRoles || 'CLIENT';
  
  // Add custom claims to the token
  api.idToken.setCustomClaim(`${namespace}role`, role);
  api.accessToken.setCustomClaim(`${namespace}role`, role);
};
```

4. Add this Action to your Login flow

#### Option B: Using Auth0 Rules (Legacy)

If you prefer using Rules, create a rule with this code:

```javascript
function addRolesToToken(user, context, callback) {
  const namespace = 'https://yourdomain.com/';
  
  // Get user roles from app_metadata or user_metadata
  const userRoles = user.app_metadata?.roles || user.user_metadata?.roles || ['CLIENT'];
  
  // Default to CLIENT role if no roles are set
  const role = Array.isArray(userRoles) ? userRoles[0] : userRoles || 'CLIENT';
  
  // Add custom claims to the token
  context.idToken[namespace + 'role'] = role;
  context.accessToken[namespace + 'role'] = role;
  
  callback(null, user, context);
}
```

### 4. Setting User Roles

You can set user roles in several ways:

#### Method 1: Auth0 Dashboard
1. Go to User Management > Users
2. Select a user
3. Go to the "App Metadata" section
4. Add this JSON:
```json
{
  "roles": ["ADMIN"]
}
```

#### Method 2: Auth0 Management API
```javascript
// Example API call to set user roles
const options = {
  method: 'PATCH',
  url: `https://your-tenant.auth0.com/api/v2/users/${userId}`,
  headers: {
    'Authorization': 'Bearer YOUR_MANAGEMENT_API_TOKEN',
    'Content-Type': 'application/json'
  },
  data: {
    app_metadata: {
      roles: ['ADMIN']
    }
  }
};
```

### 5. Available Roles

Our system supports three roles with hierarchy:

- **ADMIN**: Full access to all features, can manage all websites and users
- **CLIENT**: Access to assigned websites, can view and manage their own data
- **VIEWER**: Read-only access to assigned websites

### 6. Testing the Setup

1. Start your application: `npm run dev`
2. Visit `http://localhost:3002`
3. Click "Sign In to Access Dashboard"
4. Log in with your Auth0 account
5. Check that your role appears in the dashboard header
6. Verify that role-based access control works

### 7. Database Schema

The system will automatically create users in your PostgreSQL database when they first log in. Make sure your database is running and the `DATABASE_URL` is correctly set.

### 8. Troubleshooting

**Issue: Role not appearing**
- Check that your Auth0 Action/Rule is enabled and in the Login flow
- Verify the namespace in your Action/Rule matches what our code expects
- Check browser dev tools > Network tab to see if role is in the JWT token

**Issue: Database connection errors**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env.local`
- Run `npx prisma migrate dev` to ensure database schema is up to date

**Issue: Infinite redirect loops**
- Check Auth0 callback URLs are correctly configured
- Verify `AUTH0_BASE_URL` matches your actual URL

## Production Deployment

For production, update:
1. Auth0 callback URLs to your production domain
2. `AUTH0_BASE_URL` to your production URL
3. Database connection to production PostgreSQL
4. Set `NODE_ENV=production`

This setup provides a secure, scalable authentication system with proper role-based access control.
