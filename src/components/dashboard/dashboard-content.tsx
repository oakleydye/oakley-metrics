'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { DatePickerWithRange } from '@/components/dashboard/date-range-picker';
import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { EnhancedCharts } from '@/components/dashboard/enhanced-charts';
import { KeywordRankings } from '@/components/dashboard/keyword-rankings';
import { CampaignPerformance } from '@/components/dashboard/campaign-performance';
import { WebsiteSelector } from '@/components/dashboard/website-selector';
import { RealtimeAlerts } from '@/components/dashboard/realtime-alerts';
import { GoalTracking } from '@/components/dashboard/goal-tracking';
import { CompetitorAnalysis } from '@/components/dashboard/competitor-analysis';
import { CustomReports } from '@/components/dashboard/custom-reports';

interface DashboardContentProps {
  user: any;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [selectedWebsite, setSelectedWebsite] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name || user.email}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <WebsiteSelector 
            value={selectedWebsite} 
            onValueChange={setSelectedWebsite}
            userRole={user.role}
          />
          <DatePickerWithRange 
            value={dateRange}
            onChange={setDateRange}
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Real-time Alerts */}
      <RealtimeAlerts />

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="ppc">PPC</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="competitor">Competitor</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MetricsOverview 
            website={selectedWebsite} 
            dateRange={dateRange} 
          />
          <EnhancedCharts 
            website={selectedWebsite} 
            dateRange={dateRange} 
            type="overview"
          />
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <MetricsOverview 
            website={selectedWebsite} 
            dateRange={dateRange} 
            type="seo"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedCharts 
              website={selectedWebsite} 
              dateRange={dateRange} 
              type="seo"
            />
            <KeywordRankings 
              website={selectedWebsite} 
              dateRange={dateRange} 
            />
          </div>
        </TabsContent>

        <TabsContent value="ppc" className="space-y-6">
          <MetricsOverview 
            website={selectedWebsite} 
            dateRange={dateRange} 
            type="ppc"
          />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <EnhancedCharts 
                website={selectedWebsite} 
                dateRange={dateRange} 
                type="ppc"
              />
            </div>
            <CampaignPerformance 
              website={selectedWebsite} 
              dateRange={dateRange} 
            />
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <GoalTracking 
            website={selectedWebsite} 
            dateRange={dateRange} 
          />
        </TabsContent>

        <TabsContent value="competitor" className="space-y-6">
          <CompetitorAnalysis 
            website={selectedWebsite} 
            dateRange={dateRange} 
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <CustomReports 
            website={selectedWebsite} 
            dateRange={dateRange} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
