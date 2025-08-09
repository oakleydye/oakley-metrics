'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface WebsiteSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  userRole: 'ADMIN' | 'CLIENT';
}

export function WebsiteSelector({ value, onValueChange, userRole }: WebsiteSelectorProps) {
  // Mock data - in real app, this would come from API based on user permissions
  const websites = [
    { id: 'all', name: 'All Websites', domain: 'all' },
    { id: '1', name: 'Acme Corp Main Site', domain: 'acmecorp.com' },
    { id: '2', name: 'Acme Corp Shop', domain: 'shop.acmecorp.com' },
    { id: '3', name: 'Tech Solutions', domain: 'techsolutions.com' },
    { id: '4', name: 'Green Energy Solutions', domain: 'greenenergy.com' },
  ];

  // Filter websites based on user role
  const availableWebsites = userRole === 'ADMIN' ? websites : websites.slice(0, 3);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[250px]">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue placeholder="Select website" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {availableWebsites.map((website) => (
          <SelectItem key={website.id} value={website.id}>
            <div className="flex flex-col">
              <span className="font-medium">{website.name}</span>
              {website.domain !== 'all' && (
                <span className="text-xs text-muted-foreground">{website.domain}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
