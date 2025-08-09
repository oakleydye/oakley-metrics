'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  
  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <Card className="w-[500px]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">SEO & PPC Analytics Portal</CardTitle>
          <CardDescription className="text-lg">
            Comprehensive analytics dashboard for tracking your website performance, 
            SEO metrics, and PPC campaign results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>• Real-time SEO performance tracking</p>
            <p>• PPC campaign analytics</p>
            <p>• Competitor analysis</p>
            <p>• Custom reports and insights</p>
          </div>
          <Button onClick={login} className="w-full" size="lg">
            Sign In to Access Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
