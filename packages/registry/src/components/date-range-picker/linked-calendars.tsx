"use client";

import { getLinkedBaseMonth, getLinkedMonth } from "@calendar-kit/core";

import type { DateRange } from "../../types";
import { MonthYearControls } from "../shared/month-year-controls";
import { Card } from "../ui/card";
import { RangeCalendar } from "../range-calendar/range-calendar";

interface LinkedCalendarsProps {
  baseMonth: Date;
  count: number;
  draftRange: DateRange | null;
  fromYear: number;
  toYear: number;
  onBaseMonthChange: (nextMonth: Date) => void;
  onDraftRangeChange: (nextRange: DateRange | null) => void;
}

export function LinkedCalendars({
  baseMonth,
  count,
  draftRange,
  fromYear,
  toYear,
  onBaseMonthChange,
  onDraftRangeChange
}: Readonly<LinkedCalendarsProps>) {
  return (
    <div className="flex flex-row">
      {Array.from({ length: count }, (_, index) => {
        const calendarMonth = getLinkedMonth(baseMonth, index);

        return (
          <div key={index} className="not-last:border-r not-last:border-border">
          <Card  className="ring-0 bg-muted/30 p-3">
            <MonthYearControls
              month={calendarMonth}
              fromYear={fromYear}
              toYear={toYear}
              calendarLabel={`Calendar ${index + 1}`}
              onMonthChange={(nextMonth) => onBaseMonthChange(getLinkedBaseMonth(nextMonth, index))}
            />

            <RangeCalendar
              value={draftRange}
              onValueChange={onDraftRangeChange}
              month={calendarMonth}
              onMonthChange={(nextMonth) => onBaseMonthChange(getLinkedBaseMonth(nextMonth, index))}
              classNames={{
                container: "border-0 bg-transparent p-0 shadow-none text-foreground",
                header: "hidden"
              }}
            />
          </Card></div>
        );
      })}
    </div>
  );
}
