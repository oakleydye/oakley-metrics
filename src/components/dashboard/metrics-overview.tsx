'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  TrendingDown,
  Target,
  Search,
  BarChart3,
  Zap
} from 'lucide-react';

interface DateRange {
  from: Date;
  to: Date;
}

interface MetricsOverviewProps {
  website: string;
  dateRange: DateRange;
  type?: 'overview' | 'seo' | 'ppc';
}

export function MetricsOverview({ website, dateRange, type = 'overview' }: MetricsOverviewProps) {
  // Mock data - in real app, this would be fetched based on website and dateRange
  const getMetrics = () => {
    switch (type) {
      case 'seo':
        return [
          {
            title: 'Organic Sessions',
            value: '45,231',
            change: '+12.5%',
            trend: 'up',
            icon: Users,
            description: 'vs previous period'
          },
          {
            title: 'Organic Users',
            value: '32,450',
            change: '+8.3%',
            trend: 'up',
            icon: Eye,
            description: 'unique visitors'
          },
          {
            title: 'Average Position',
            value: '12.3',
            change: '-2.1',
            trend: 'up',
            icon: Search,
            description: 'avg ranking position'
          },
          {
            title: 'Click-Through Rate',
            value: '4.2%',
            change: '+0.3%',
            trend: 'up',
            icon: MousePointer,
            description: 'from search results'
          },
        ];
      case 'ppc':
        return [
          {
            title: 'Ad Spend',
            value: '$12,430',
            change: '+15.2%',
            trend: 'up',
            icon: DollarSign,
            description: 'total campaign spend'
          },
          {
            title: 'Clicks',
            value: '8,924',
            change: '+22.1%',
            trend: 'up',
            icon: MousePointer,
            description: 'total ad clicks'
          },
          {
            title: 'Conversions',
            value: '187',
            change: '+18.5%',
            trend: 'up',
            icon: Target,
            description: 'completed actions'
          },
          {
            title: 'ROAS',
            value: '4.2x',
            change: '+0.8x',
            trend: 'up',
            icon: TrendingUp,
            description: 'return on ad spend'
          },
        ];
      default:
        return [
          {
            title: 'Total Sessions',
            value: '67,845',
            change: '+14.2%',
            trend: 'up',
            icon: Users,
            description: 'all traffic sources'
          },
          {
            title: 'Revenue',
            value: '$52,890',
            change: '+23.1%',
            trend: 'up',
            icon: DollarSign,
            description: 'total revenue generated'
          },
          {
            title: 'Conversion Rate',
            value: '3.8%',
            change: '+0.5%',
            trend: 'up',
            icon: Target,
            description: 'visitors to customers'
          },
          {
            title: 'Page Speed',
            value: '2.1s',
            change: '-0.3s',
            trend: 'up',
            icon: Zap,
            description: 'avg page load time'
          },
        ];
    }
  };

  const metrics = getMetrics();

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = getTrendIcon(metric.trend);
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
