"use client";

import { addMonths, format } from "date-fns";
import { useMemo } from "react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";

interface MonthYearControlsProps {
  month: Date;
  fromYear: number;
  toYear: number;
  calendarLabel: string;
  onMonthChange: (nextMonth: Date) => void;
  className?: string;
}

export function MonthYearControls({
  month,
  fromYear,
  toYear,
  calendarLabel,
  onMonthChange,
  className
}: MonthYearControlsProps) {
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        value: index,
        label: format(new Date(2024, index, 1), "MMMM")
      })),
    []
  );

  const startYear = Math.min(fromYear, toYear);
  const endYear = Math.max(fromYear, toYear);

  const years = useMemo(
    () => Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index),
    [endYear, startYear]
  );

  const monthIndex = month.getMonth();
  const year = month.getFullYear();

  return (
    <div className={cn("mb-2 flex items-center justify-between gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Previous month ${calendarLabel}`}
        onClick={() => onMonthChange(addMonths(month, -1))}
      >
        &lt;
      </Button>

      <div className="flex items-center gap-2">
        <Select
          value={String(monthIndex)}
          onValueChange={(nextMonth) => onMonthChange(new Date(year, Number(nextMonth), 1))}
        >
          <SelectTrigger aria-label={`Month ${calendarLabel}`} size="sm" className="h-8 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((monthOption) => (
              <SelectItem key={monthOption.value} value={String(monthOption.value)}>
                {monthOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(year)}
          onValueChange={(nextYear) => onMonthChange(new Date(Number(nextYear), monthIndex, 1))}
        >
          <SelectTrigger aria-label={`Year ${calendarLabel}`} size="sm" className="h-8 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((yearOption) => (
              <SelectItem key={yearOption} value={String(yearOption)}>
                {yearOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Next month ${calendarLabel}`}
        onClick={() => onMonthChange(addMonths(month, 1))}
      >
        &gt;
      </Button>
    </div>
  );
}
