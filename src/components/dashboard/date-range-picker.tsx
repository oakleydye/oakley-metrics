'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date;
  to: Date;
}

interface DatePickerWithRangeProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DatePickerWithRange({ value, onChange, className }: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} -{' '}
                  {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <Calendar
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={(range: any) => {
                if (range?.from && range?.to) {
                  onChange({ from: range.from, to: range.to });
                  setIsOpen(false);
                }
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
