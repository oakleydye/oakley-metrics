'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react';

export function RealtimeAlerts() {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Google Ads Budget Alert',
      message: 'Daily budget 80% consumed for "Brand Campaign"',
      time: '5 min ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'success',
      title: 'Keyword Ranking Improved',
      message: '"SEO services" moved from position 8 to position 3',
      time: '1 hour ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'info',
      title: 'Organic Traffic Spike',
      message: '25% increase in organic sessions compared to yesterday',
      time: '2 hours ago',
      severity: 'low'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'error':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Real-time Alerts
        </CardTitle>
        <CardDescription>
          Latest notifications and important updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
              {getIcon(alert.type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getSeverityColor(alert.severity)}
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
