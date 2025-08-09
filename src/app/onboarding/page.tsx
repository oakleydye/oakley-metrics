'use client'

import { withAuth, useAuth } from '@/components/auth/auth-provider'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'

function OnboardingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Client Onboarding Portal
            </h1>
            <p className="text-muted-foreground">
              Set up new clients, organizations, and websites for analytics tracking
            </p>
          </div>
          
          <OnboardingFlow />
        </div>
      </div>
    </div>
  )
}

// Only allow ADMIN users to access the onboarding page
export default withAuth(OnboardingPage, 'ADMIN')
