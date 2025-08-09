'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';

interface DateRange {
  from: Date;
  to: Date;
}

interface GoalTrackingProps {
  website: string;
  dateRange: DateRange;
}

export function GoalTracking({ website, dateRange }: GoalTrackingProps) {
  const goals = [
    {
      id: 1,
      name: 'Monthly Lead Generation',
      description: 'Generate 100 qualified leads per month',
      target: 100,
      current: 78,
      unit: 'leads',
      timeframe: 'Monthly',
      trend: 12.5,
      status: 'on-track'
    },
    {
      id: 2,
      name: 'Organic Traffic Growth',
      description: 'Increase organic sessions by 20%',
      target: 50000,
      current: 45200,
      unit: 'sessions',
      timeframe: 'Quarterly',
      trend: -2.3,
      status: 'behind'
    },
    {
      id: 3,
      name: 'Conversion Rate Optimization',
      description: 'Achieve 4% conversion rate',
      target: 4.0,
      current: 3.8,
      unit: '%',
      timeframe: 'Monthly',
      trend: 8.7,
      status: 'on-track'
    },
    {
      id: 4,
      name: 'PPC ROAS Target',
      description: 'Maintain 5x return on ad spend',
      target: 5.0,
      current: 5.2,
      unit: 'x',
      timeframe: 'Monthly',
      trend: 4.2,
      status: 'achieved'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on-track':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'behind':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          const isAchieved = percentage >= 100;
          
          return (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {goal.name}
                    </CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(goal.status)}
                  >
                    {goal.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={percentage} className="h-3" />
                    <div
                      className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Current</div>
                    <div className="text-2xl font-bold">
                      {goal.current.toLocaleString()}{goal.unit}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Target</div>
                    <div className="text-2xl font-bold text-muted-foreground">
                      {goal.target.toLocaleString()}{goal.unit}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    {goal.timeframe}
                  </span>
                  <div className="flex items-center gap-1">
                    {goal.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      goal.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {goal.trend > 0 ? '+' : ''}{goal.trend}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
