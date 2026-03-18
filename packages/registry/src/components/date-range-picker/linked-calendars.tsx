"use client";

import { getLinkedBaseMonth, getLinkedMonth } from "@calendar-kit/core";
import type { Locale } from "date-fns";

import type { DateRange } from "../../types";
import type { ResolvedPickerLabels } from "../../lib/picker-labels";
import { MonthYearControls } from "../shared/month-year-controls";
import { Card } from "../ui/card";
import { RangeCalendar } from "../range-calendar/range-calendar";

interface LinkedCalendarsProps {
  baseMonth: Date;
  count: number;
  draftRange: DateRange | null;
  fromYear: number;
  toYear: number;
  locale?: Locale;
  labels: ResolvedPickerLabels;
  onBaseMonthChange: (nextMonth: Date) => void;
  onDraftRangeChange: (nextRange: DateRange | null) => void;
}

export function LinkedCalendars({
  baseMonth,
  count,
  draftRange,
  fromYear,
  toYear,
  locale,
  labels,
  onBaseMonthChange,
  onDraftRangeChange,
}: Readonly<LinkedCalendarsProps>) {
  return (
    <div className="flex flex-col md:flex-row">
      {Array.from({ length: count }, (_, index) => {
        const calendarMonth = getLinkedMonth(baseMonth, index);

        return (
          <div key={index} className="md:not-last:border-r md:not-last:border-border">
            <Card
              id={"calendar-grid-container-" + index}
              className="ring-0 bg-muted/30 p-3 items-center gap-0"
            >
              <MonthYearControls
                month={calendarMonth}
                fromYear={fromYear}
                toYear={toYear}
                locale={locale}
                calendarLabel={`${labels.calendarAriaLabel} ${index + 1}`}
                monthSelectAriaLabel={labels.monthSelectAria}
                yearSelectAriaLabel={labels.yearSelectAria}
                prevMonthAriaLabel={labels.prevMonthAria}
                nextMonthAriaLabel={labels.nextMonthAria}
                onMonthChange={(nextMonth) =>
                  onBaseMonthChange(getLinkedBaseMonth(nextMonth, index))
                }
              />

              <RangeCalendar
                value={draftRange}
                onValueChange={onDraftRangeChange}
                month={calendarMonth}
                locale={locale}
                calendarAriaLabel={`${labels.calendarAriaLabel} ${index + 1}`}
                onMonthChange={(nextMonth) =>
                  onBaseMonthChange(getLinkedBaseMonth(nextMonth, index))
                }
                classNames={{
                  container:
                    "border-0 bg-transparent p-0 shadow-none text-foreground",
                  header: "hidden",
                }}
              />
            </Card>
          </div>
        );
      })}
    </div>
  );
}
