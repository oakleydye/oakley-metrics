'use client';

import { useAuth, withAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

function DashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Analytics Portal</h1>
            <p className="text-sm text-muted-foreground">
              Advanced metrics and insights dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === 'ADMIN' && (
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/onboarding'}
              >
                Client Onboarding
              </Button>
            )}
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
              {user?.role}
            </span>
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <DashboardContent user={user} />
      </main>
    </div>
  );
}

// Protect the dashboard with authentication and require at least VIEWER role
export default withAuth(DashboardPage, 'VIEWER');
