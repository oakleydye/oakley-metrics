'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

interface DateRange {
  from: Date;
  to: Date;
}

interface CustomReportsProps {
  website: string;
  dateRange: DateRange;
}

export function CustomReports({ website, dateRange }: CustomReportsProps) {
  const [selectedReport, setSelectedReport] = useState('monthly-summary');

  const reportTemplates = [
    {
      id: 'monthly-summary',
      name: 'Monthly Summary',
      description: 'Comprehensive monthly performance report',
      frequency: 'Monthly',
      metrics: ['Traffic', 'Conversions', 'Revenue', 'Rankings']
    },
    {
      id: 'seo-performance',
      name: 'SEO Performance',
      description: 'Detailed organic search performance',
      frequency: 'Weekly',
      metrics: ['Organic Traffic', 'Keywords', 'Rankings', 'Backlinks']
    },
    {
      id: 'ppc-analysis',
      name: 'PPC Analysis',
      description: 'Paid advertising campaign analysis',
      frequency: 'Weekly',
      metrics: ['Ad Spend', 'Clicks', 'Conversions', 'ROAS']
    },
    {
      id: 'competitor-report',
      name: 'Competitor Report',
      description: 'Market position and competitor analysis',
      frequency: 'Monthly',
      metrics: ['Market Share', 'Keyword Gap', 'Traffic Compare']
    },
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Monthly Summary - December 2024',
      template: 'Monthly Summary',
      status: 'Ready',
      generatedAt: '2024-12-01T10:00:00Z',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'SEO Performance - Week 48',
      template: 'SEO Performance',
      status: 'Generating',
      generatedAt: null,
      size: null
    },
    {
      id: 3,
      name: 'PPC Analysis - November 2024',
      template: 'PPC Analysis',
      status: 'Ready',
      generatedAt: '2024-11-30T15:30:00Z',
      size: '1.8 MB'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Generating':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Templates
          </CardTitle>
          <CardDescription>
            Choose from pre-built report templates or create custom reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => (
              <div 
                key={template.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedReport === template.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
                onClick={() => setSelectedReport(template.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <Badge variant="outline">{template.frequency}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t">
            <Select defaultValue="pdf">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled & Generated Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>
            Download or view your previously generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Template</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Generated</TableHead>
                <TableHead className="text-center">Size</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.template}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(report.status)}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(report.generatedAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    {report.size || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {report.status === 'Ready' ? (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        {report.status}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
          <CardDescription>
            Key metrics and insights for your reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Top Performing Page</div>
              <div className="font-medium">/services/digital-marketing</div>
              <div className="text-xs text-green-600">+25% sessions this month</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Best Converting Keyword</div>
              <div className="font-medium">&quot;business consulting&quot;</div>
              <div className="text-xs text-green-600">4.2% conversion rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Highest ROAS Campaign</div>
              <div className="font-medium">Brand Campaign</div>
              <div className="text-xs text-green-600">5.2x return on ad spend</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
