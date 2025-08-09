# Client Onboarding System

## Overview
The Client Onboarding System is a comprehensive admin-only interface for setting up new clients, organizations, and websites in your SEO & PPC analytics platform.

## Features

### 🔐 Admin-Only Access
- Protected by role-based authentication
- Only users with `ADMIN` role can access `/onboarding`
- Automatic redirect for non-admin users

### 📊 Dashboard Overview
- Real-time statistics for clients, organizations, and websites
- Recent client list with management actions
- Quick access to all onboarding functions

### 👥 Client Management
**Create New Clients:**
- Full name and email address
- Role assignment (CLIENT or VIEWER)
- Organization assignment
- Automatic Auth0 integration preparation

**Client Roles:**
- **CLIENT**: Full access to assigned websites and data
- **VIEWER**: Read-only access to assigned websites
- **ADMIN**: Complete system access (created separately)

### 🏢 Organization Management
**Create Organizations:**
- Company name and description
- Primary domain
- Contact information (email and phone)
- Automatic slug generation for URLs

### 🌐 Website Management
**Add New Websites:**
- Website name and URL
- Industry classification
- Country/region settings
- Organization assignment
- Automatic domain extraction and validation

## User Flow

### 1. Admin Access
```
Dashboard → "Client Onboarding" button → Onboarding Portal
```

### 2. Setup Process
1. **Create Organization** (if new company)
   - Add company details
   - Set contact information

2. **Add Website(s)**
   - Register domains for tracking
   - Configure industry and location
   - Assign to organization

3. **Create Client Users**
   - Add client contact details
   - Assign appropriate role
   - Link to organization

### 3. Client Access
- Clients receive login credentials
- Access dashboard with role-appropriate permissions
- View only assigned websites and data

## Technical Implementation

### Authentication & Authorization
```typescript
// Route protection
export default withAuth(OnboardingPage, 'ADMIN')

// API endpoint protection
async function verifyAdminAccess() {
  const userInfo = JSON.parse(userInfoCookie.value);
  if (userInfo.role !== 'ADMIN') {
    return { error: 'Admin access required', status: 403 };
  }
  return { success: true };
}
```

### Database Schema
- **Users**: Auth0 integration with role-based access
- **Organizations**: Multi-tenant structure for client separation
- **Websites**: Domain tracking with granular permissions
- **WebsiteAccess**: Granular user-to-website permissions

### API Endpoints
- `POST /api/clients` - Create new client users
- `POST /api/organizations` - Create new organizations
- `POST /api/websites` - Register new websites
- `GET /api/*` - List existing records (admin only)

## Security Features

### 🛡️ Role-Based Access Control
- Three-tier role system (ADMIN > CLIENT > VIEWER)
- Route-level protection with `withAuth` HOC
- API-level authentication verification

### 🔒 Data Isolation
- Multi-tenant architecture via organizations
- Users only see assigned websites
- Granular permission system for website access

### ✅ Validation & Verification
- Email uniqueness enforcement
- Domain validation for websites
- Organization existence verification
- Comprehensive error handling

## Usage Examples

### Creating a New Client Setup
1. **Organization**: "Acme Corporation"
   - Domain: acme.com
   - Contact: contact@acme.com

2. **Website**: "Acme Main Site"
   - URL: https://www.acme.com
   - Industry: Technology
   - Country: United States

3. **Client**: "John Doe"
   - Email: john@acme.com
   - Role: CLIENT
   - Organization: Acme Corporation

### Result
- John can log in and access Acme's website analytics
- Data is isolated from other organizations
- Admin maintains full oversight and control

## Current Status
✅ **Implemented:**
- Complete onboarding UI with tabbed interface
- Form validation and error handling
- Admin authentication and authorization
- Database integration with Prisma
- Role-based access control
- Multi-tenant architecture

🔄 **Future Enhancements:**
- Email invitation system integration
- Bulk client import functionality
- Client edit/delete operations
- Website access permission management
- Audit logging for admin actions

## Access URL
`http://localhost:3001/onboarding` (Admin only)

The onboarding system provides a professional, secure, and comprehensive solution for managing client relationships and website tracking in your analytics platform.
