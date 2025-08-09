'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Minus, Search } from 'lucide-react';

interface DateRange {
  from: Date;
  to: Date;
}

interface KeywordRankingsProps {
  website: string;
  dateRange: DateRange;
}

export function KeywordRankings({ website, dateRange }: KeywordRankingsProps) {
  // Mock data - in real app, this would be fetched based on website and dateRange
  const keywords = [
    {
      keyword: 'digital marketing services',
      currentPosition: 3,
      previousPosition: 5,
      change: 2,
      searchVolume: 12000,
      difficulty: 'High',
      clicks: 450,
      impressions: 8900,
      ctr: 5.1,
      url: '/services/digital-marketing'
    },
    {
      keyword: 'SEO optimization',
      currentPosition: 7,
      previousPosition: 12,
      change: 5,
      searchVolume: 8500,
      difficulty: 'Medium',
      clicks: 280,
      impressions: 5600,
      ctr: 5.0,
      url: '/services/seo'
    },
    {
      keyword: 'PPC management',
      currentPosition: 12,
      previousPosition: 8,
      change: -4,
      searchVolume: 6200,
      difficulty: 'Low',
      clicks: 150,
      impressions: 3100,
      ctr: 4.8,
      url: '/services/ppc'
    },
    {
      keyword: 'content marketing strategy',
      currentPosition: 5,
      previousPosition: 5,
      change: 0,
      searchVolume: 4300,
      difficulty: 'Medium',
      clicks: 320,
      impressions: 6400,
      ctr: 5.0,
      url: '/services/content-marketing'
    },
    {
      keyword: 'social media marketing',
      currentPosition: 15,
      previousPosition: 18,
      change: 3,
      searchVolume: 15000,
      difficulty: 'High',
      clicks: 120,
      impressions: 2400,
      ctr: 5.0,
      url: '/services/social-media'
    },
  ];

  const getPositionChange = (change: number) => {
    if (change > 0) {
      return (
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          <ArrowUp className="h-3 w-3 mr-1" />
          +{change}
        </Badge>
      );
    } else if (change < 0) {
      return (
        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
          <ArrowDown className="h-3 w-3 mr-1" />
          {change}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
          <Minus className="h-3 w-3 mr-1" />
          0
        </Badge>
      );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Keyword Rankings
        </CardTitle>
        <CardDescription>
          Track your keyword positions and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-center">Position</TableHead>
                <TableHead className="text-center">Change</TableHead>
                <TableHead className="text-center">Volume</TableHead>
                <TableHead className="text-center">Difficulty</TableHead>
                <TableHead className="text-center">CTR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((keyword, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{keyword.keyword}</div>
                      <div className="text-xs text-muted-foreground">{keyword.url}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      #{keyword.currentPosition}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getPositionChange(keyword.change)}
                  </TableCell>
                  <TableCell className="text-center">
                    {keyword.searchVolume.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(keyword.difficulty)}
                    >
                      {keyword.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {keyword.ctr}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
