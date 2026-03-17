"use client";

import { format, isSameDay, isSameMonth, startOfMonth } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { DatePickerProps } from "../types";
import { useControllableState } from "../lib/use-controllable-state";
import { MonthYearControls } from "./month-year-controls";
import { PickerPopover } from "./picker-popover";
import { Calendar } from "./calendar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function DatePicker({
  value,
  defaultValue = null,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  autoApply = false,
  fromYear,
  toYear,
  displayFormat = "MMM d, yyyy"
}: DatePickerProps) {
  const [committedDate, setCommittedDate] = useControllableState<Date | null>({
    value,
    defaultValue,
    onChange: onValueChange
  });

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange
  });

  const [draftDate, setDraftDate] = useState<Date | null>(committedDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(committedDate ?? new Date()));

  const currentYear = new Date().getFullYear();
  const startYear = fromYear ?? currentYear - 10;
  const endYear = toYear ?? currentYear + 10;

  useEffect(() => {
    if (isOpen) {
      return;
    }

    const nextMonth = startOfMonth(committedDate ?? new Date());
    setDraftDate((prevDate) => {
      if (!prevDate && !committedDate) {
        return prevDate;
      }

      if (prevDate && committedDate && isSameDay(prevDate, committedDate)) {
        return prevDate;
      }

      return committedDate;
    });
    setCurrentMonth((prevMonth) => (isSameMonth(prevMonth, nextMonth) ? prevMonth : nextMonth));
  }, [committedDate, isOpen]);

  const commitDate = useCallback(
    (nextDate: Date | null) => {
      setCommittedDate(nextDate);
      setDraftDate(nextDate);
      setIsOpen(false);
    },
    [setCommittedDate, setIsOpen]
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setDraftDate(committedDate);
        setCurrentMonth(startOfMonth(committedDate ?? new Date()));
      } else {
        setDraftDate(committedDate);
      }

      setIsOpen(nextOpen);
    },
    [committedDate, setIsOpen]
  );

  const handleDraftDateChange = useCallback(
    (nextDate: Date | null) => {
      setDraftDate(nextDate);

      if (autoApply) {
        commitDate(nextDate);
      }
    },
    [autoApply, commitDate]
  );

  const displayValue = useMemo(
    () => (committedDate ? format(committedDate, displayFormat) : ""),
    [committedDate, displayFormat]
  );

  return (
    <PickerPopover
      open={isOpen}
      onOpenChange={handleOpenChange}
      displayValue={displayValue}
      placeholder="Select date"
    >
      <Card className="border border-border bg-muted/30 p-3">
        <MonthYearControls
          month={currentMonth}
          fromYear={startYear}
          toYear={endYear}
          calendarLabel="Calendar"
          onMonthChange={(nextMonth) => setCurrentMonth(startOfMonth(nextMonth))}
        />

        <Calendar
          value={draftDate}
          onValueChange={handleDraftDateChange}
          month={currentMonth}
          onMonthChange={(nextMonth) => setCurrentMonth(startOfMonth(nextMonth))}
          classNames={{
            container: "border-0 bg-transparent p-0 shadow-none text-foreground",
            header: "hidden"
          }}
        />

        {!autoApply ? (
          <div className="mt-3 flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button
              type="button"
              variant="ghost"
              className="h-9"
              onClick={() => commitDate(null)}
            >
              Clear
            </Button>

            <Button
              type="button"
              className="h-9"
              onClick={() => commitDate(draftDate)}
            >
              Apply
            </Button>
          </div>
        ) : null}
      </Card>
    </PickerPopover>
  );
}
