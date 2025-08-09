'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface DateRange {
  from: Date;
  to: Date;
}

interface EnhancedChartsProps {
  website: string;
  dateRange: DateRange;
  type: 'overview' | 'seo' | 'ppc';
}

export function EnhancedCharts({ website, dateRange, type }: EnhancedChartsProps) {
  const [chartType, setChartType] = useState('line');
  const [activeTab, setActiveTab] = useState('traffic');

  // Mock data - in real app, this would be fetched based on website and dateRange
  const trafficData = [
    { date: 'Jan 1', organic: 12500, paid: 3200, direct: 2800, social: 1500, referral: 900 },
    { date: 'Jan 2', organic: 13200, paid: 3400, direct: 2900, social: 1600, referral: 950 },
    { date: 'Jan 3', organic: 11800, paid: 3100, direct: 2700, social: 1400, referral: 880 },
    { date: 'Jan 4', organic: 14100, paid: 3600, direct: 3100, social: 1700, referral: 1020 },
    { date: 'Jan 5', organic: 13600, paid: 3500, direct: 3000, social: 1650, referral: 990 },
    { date: 'Jan 6', organic: 15200, paid: 3800, direct: 3300, social: 1800, referral: 1100 },
    { date: 'Jan 7', organic: 14800, paid: 3700, direct: 3200, social: 1750, referral: 1080 },
  ];

  const conversionData = [
    { date: 'Jan 1', conversions: 45, revenue: 2250, sessions: 12500 },
    { date: 'Jan 2', conversions: 52, revenue: 2600, sessions: 13200 },
    { date: 'Jan 3', conversions: 38, revenue: 1900, sessions: 11800 },
    { date: 'Jan 4', conversions: 61, revenue: 3050, sessions: 14100 },
    { date: 'Jan 5', conversions: 55, revenue: 2750, sessions: 13600 },
    { date: 'Jan 6', conversions: 68, revenue: 3400, sessions: 15200 },
    { date: 'Jan 7', conversions: 62, revenue: 3100, sessions: 14800 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#0088FE' },
    { name: 'Mobile', value: 35, color: '#00C49F' },
    { name: 'Tablet', value: 20, color: '#FFBB28' },
  ];

  const channelData = [
    { name: 'Organic Search', value: 40, color: '#0088FE' },
    { name: 'Paid Search', value: 25, color: '#00C49F' },
    { name: 'Direct', value: 20, color: '#FFBB28' },
    { name: 'Social', value: 10, color: '#FF8042' },
    { name: 'Referral', value: 5, color: '#8884D8' },
  ];

  const renderChart = (data: any[], dataKeys: string[]) => {
    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`hsl(var(--chart-${index + 1}))`}
                fill={`hsl(var(--chart-${index + 1}))`}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`hsl(var(--chart-${index + 1}))`}
              />
            ))}
          </BarChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`hsl(var(--chart-${index + 1}))`}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>
                Detailed metrics and trends over time
              </CardDescription>
            </div>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
              <TabsTrigger value="conversions">Conversions</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="traffic" className="space-y-4">
              <ResponsiveContainer width="100%" height={350}>
                {renderChart(trafficData, ['organic', 'paid', 'direct', 'social'])}
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="conversions" className="space-y-4">
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis yAxisId="left" className="text-xs fill-muted-foreground" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar yAxisId="left" dataKey="conversions" fill="hsl(var(--chart-1))" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Device Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Traffic Channels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={channelData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {channelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
