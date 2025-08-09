'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Eye, Search, TrendingUp } from 'lucide-react';

interface DateRange {
  from: Date;
  to: Date;
}

interface CompetitorAnalysisProps {
  website: string;
  dateRange: DateRange;
}

export function CompetitorAnalysis({ website, dateRange }: CompetitorAnalysisProps) {
  const competitorData = [
    {
      domain: 'competitor1.com',
      name: 'Competitor One',
      organicKeywords: 2456,
      organicTraffic: 125000,
      adKeywords: 342,
      adSpend: 45000,
      topKeywords: ['digital marketing', 'SEO services', 'PPC management'],
      marketShare: 25.4
    },
    {
      domain: 'competitor2.com',
      name: 'Competitor Two',
      organicKeywords: 1892,
      organicTraffic: 98000,
      adKeywords: 278,
      adSpend: 32000,
      topKeywords: ['web design', 'content marketing', 'social media'],
      marketShare: 18.7
    },
    {
      domain: 'yourdomain.com',
      name: 'Your Website',
      organicKeywords: 1654,
      organicTraffic: 78000,
      adKeywords: 156,
      adSpend: 28000,
      topKeywords: ['business solutions', 'consulting', 'analytics'],
      marketShare: 15.2
    },
  ];

  const keywordGapData = [
    { keyword: 'digital transformation', your_position: null, competitor1: 3, competitor2: 7, volume: 8900 },
    { keyword: 'business automation', your_position: 15, competitor1: 2, competitor2: 5, volume: 5600 },
    { keyword: 'data analytics', your_position: 8, competitor1: 4, competitor2: 12, volume: 7200 },
    { keyword: 'cloud solutions', your_position: null, competitor1: 1, competitor2: 3, volume: 12000 },
  ];

  const trafficComparisonData = [
    { month: 'Jan', yourSite: 78000, competitor1: 125000, competitor2: 98000 },
    { month: 'Feb', yourSite: 82000, competitor1: 128000, competitor2: 95000 },
    { month: 'Mar', yourSite: 85000, competitor1: 132000, competitor2: 102000 },
    { month: 'Apr', yourSite: 88000, competitor1: 135000, competitor2: 105000 },
    { month: 'May', yourSite: 91000, competitor1: 138000, competitor2: 108000 },
    { month: 'Jun', yourSite: 94000, competitor1: 142000, competitor2: 112000 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Competitor Overview
          </CardTitle>
          <CardDescription>
            Compare your performance against key competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {competitorData.map((competitor, index) => (
              <div 
                key={competitor.domain} 
                className={`p-4 border rounded-lg ${
                  competitor.domain === 'yourdomain.com' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{competitor.name}</h4>
                    {competitor.domain === 'yourdomain.com' && (
                      <Badge variant="outline" className="text-primary border-primary">
                        You
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organic Keywords:</span>
                      <span className="font-medium">{competitor.organicKeywords.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organic Traffic:</span>
                      <span className="font-medium">{competitor.organicTraffic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ad Keywords:</span>
                      <span className="font-medium">{competitor.adKeywords.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Share:</span>
                      <span className="font-medium">{competitor.marketShare}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Traffic Comparison</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Gap</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Trends</CardTitle>
              <CardDescription>
                Monthly organic traffic comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={trafficComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="yourSite" fill="hsl(var(--primary))" name="Your Site" />
                  <Bar dataKey="competitor1" fill="hsl(var(--chart-2))" name="Competitor 1" />
                  <Bar dataKey="competitor2" fill="hsl(var(--chart-3))" name="Competitor 2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Gap Analysis</CardTitle>
              <CardDescription>
                Keywords where competitors rank but you don&apos;t
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-center">Your Position</TableHead>
                    <TableHead className="text-center">Competitor 1</TableHead>
                    <TableHead className="text-center">Competitor 2</TableHead>
                    <TableHead className="text-center">Search Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywordGapData.map((keyword, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell className="text-center">
                        {keyword.your_position ? (
                          <Badge variant="outline">#{keyword.your_position}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                            Not ranked
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">#{keyword.competitor1}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">#{keyword.competitor2}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {keyword.volume.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
