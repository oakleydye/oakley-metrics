'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingUp, DollarSign } from 'lucide-react';

interface DateRange {
  from: Date;
  to: Date;
}

interface CampaignPerformanceProps {
  website: string;
  dateRange: DateRange;
}

export function CampaignPerformance({ website, dateRange }: CampaignPerformanceProps) {
  // Mock data - in real app, this would be fetched based on website and dateRange
  const campaigns = [
    {
      id: 1,
      name: 'Brand Campaign',
      platform: 'Google Ads',
      status: 'Active',
      budget: 5000,
      spent: 4200,
      clicks: 2840,
      impressions: 45600,
      conversions: 68,
      ctr: 6.2,
      cpc: 1.48,
      roas: 4.2,
      conversionRate: 2.4
    },
    {
      id: 2,
      name: 'Shopping Campaign',
      platform: 'Google Ads',
      status: 'Active',
      budget: 3000,
      spent: 2850,
      clicks: 1920,
      impressions: 38400,
      conversions: 45,
      ctr: 5.0,
      cpc: 1.48,
      roas: 3.8,
      conversionRate: 2.3
    },
    {
      id: 3,
      name: 'Lead Generation',
      platform: 'Facebook Ads',
      status: 'Active',
      budget: 2000,
      spent: 1680,
      clicks: 1120,
      impressions: 22400,
      conversions: 28,
      ctr: 5.0,
      cpc: 1.50,
      roas: 3.5,
      conversionRate: 2.5
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Ended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Google Ads':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Facebook Ads':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LinkedIn Ads':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Campaign Performance
        </CardTitle>
        <CardDescription>
          Monitor your advertising campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{campaign.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getPlatformColor(campaign.platform)}
                    >
                      {campaign.platform}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(campaign.status)}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-lg font-bold">
                    ${campaign.spent.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of ${campaign.budget.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Usage</span>
                  <span>{((campaign.spent / campaign.budget) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(campaign.spent / campaign.budget) * 100} 
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clicks:</span>
                    <span className="font-medium">{campaign.clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CTR:</span>
                    <span className="font-medium">{campaign.ctr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPC:</span>
                    <span className="font-medium">${campaign.cpc}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conversions:</span>
                    <span className="font-medium">{campaign.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conv. Rate:</span>
                    <span className="font-medium">{campaign.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROAS:</span>
                    <span className="font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      {campaign.roas}x
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
