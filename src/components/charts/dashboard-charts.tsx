'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SeoChartData {
  date: string;
  sessions: number;
  users: number;
  pageviews: number;
}

interface PpcChartData {
  date: string;
  spend: number;
  clicks: number;
  conversions: number;
}

export function SeoChart() {
  const [data, setData] = useState<SeoChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    const mockData: SeoChartData[] = [
      { date: 'Jan 1', sessions: 12500, users: 8900, pageviews: 28400 },
      { date: 'Jan 2', sessions: 13200, users: 9400, pageviews: 29800 },
      { date: 'Jan 3', sessions: 11800, users: 8600, pageviews: 26900 },
      { date: 'Jan 4', sessions: 14100, users: 10200, pageviews: 31200 },
      { date: 'Jan 5', sessions: 13600, users: 9800, pageviews: 30400 },
      { date: 'Jan 6', sessions: 15200, users: 11100, pageviews: 33800 },
      { date: 'Jan 7', sessions: 14800, users: 10700, pageviews: 32600 },
    ];
    
    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          className="text-xs fill-muted-foreground"
        />
        <YAxis className="text-xs fill-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Line 
          type="monotone" 
          dataKey="sessions" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          name="Sessions"
        />
        <Line 
          type="monotone" 
          dataKey="users" 
          stroke="hsl(var(--chart-2))" 
          strokeWidth={2}
          name="Users"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PpcChart() {
  const [data, setData] = useState<PpcChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    const mockData: PpcChartData[] = [
      { date: 'Jan 1', spend: 850, clicks: 1890, conversions: 42 },
      { date: 'Jan 2', spend: 920, clicks: 2010, conversions: 48 },
      { date: 'Jan 3', spend: 780, clicks: 1720, conversions: 38 },
      { date: 'Jan 4', spend: 1050, clicks: 2280, conversions: 56 },
      { date: 'Jan 5', spend: 980, clicks: 2150, conversions: 51 },
      { date: 'Jan 6', spend: 1180, clicks: 2520, conversions: 62 },
      { date: 'Jan 7', spend: 1100, clicks: 2380, conversions: 58 },
    ];
    
    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          className="text-xs fill-muted-foreground"
        />
        <YAxis className="text-xs fill-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Bar 
          dataKey="spend" 
          fill="hsl(var(--chart-1))" 
          name="Spend ($)"
        />
        <Bar 
          dataKey="conversions" 
          fill="hsl(var(--chart-3))" 
          name="Conversions"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
