'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateClientForm } from './create-client-form'
import { CreateOrganizationForm } from './create-organization-form'
import { CreateWebsiteForm } from './create-website-form'
import { ClientsList } from './clients-list'
import { OnboardingStepper } from './onboarding-stepper'
import { Users, Building2, Globe, UserPlus, Workflow, Layout } from 'lucide-react'

export function OnboardingFlow() {
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)
  const [viewMode, setViewMode] = useState<'stepper' | 'tabs'>('stepper')

  const refreshData = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Onboarding Mode</CardTitle>
              <CardDescription>
                Choose between guided stepper or flexible tabs
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'stepper' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('stepper')}
              >
                <Workflow className="w-4 h-4 mr-2" />
                Guided Flow
              </Button>
              <Button
                variant={viewMode === 'tabs' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tabs')}
              >
                <Layout className="w-4 h-4 mr-2" />
                Flexible Tabs
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stepper Mode */}
      {viewMode === 'stepper' && (
        <OnboardingStepper />
      )}

      {/* Tabs Mode */}
      {viewMode === 'tabs' && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              New Client
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    +1 from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Websites</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +5 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Clients</CardTitle>
                <CardDescription>
                  Manage and view all clients in your system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientsList key={refreshKey} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Client</CardTitle>
                <CardDescription>
                  Add a new client user to the system. They will receive login credentials and be assigned to an organization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateClientForm onSuccess={(data: any) => {
                  refreshData()
                  setActiveTab('overview')
                }} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Organization</CardTitle>
                <CardDescription>
                  Organizations group related websites and users together for easier management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateOrganizationForm onSuccess={(data: any) => {
                  refreshData()
                  setActiveTab('overview')
                }} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="website" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Website</CardTitle>
                <CardDescription>
                  Register a new website for SEO and PPC tracking. Assign it to an organization and specify which users can access it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateWebsiteForm onSuccess={(data: any) => {
                  refreshData()
                  setActiveTab('overview')
                }} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
