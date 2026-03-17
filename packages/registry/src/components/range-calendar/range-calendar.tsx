"use client";

import { isAfter, isBefore, isSameDay, startOfMonth } from "date-fns";
import { useCallback } from "react";
import {
  hasDisabledDateBetween,
  isDateDisabled,
  isInRange,
  isRangeEnd,
  isRangeStart,
  normalizeDate
} from "@calendar-kit/core";

import type { DateRange, RangeCalendarProps } from "../../types";
import { useControllableState } from "../../lib/use-controllable-state";
import { CalendarGrid } from "../calendar/calendar-grid";

function normalizeRange(range: DateRange | null | undefined): DateRange | null {
  if (!range) {
    return null;
  }

  return {
    from: range.from ? normalizeDate(range.from) : null,
    to: range.to ? normalizeDate(range.to) : null
  };
}

function toNullableRange(range: DateRange): DateRange | null {
  return range.from || range.to ? range : null;
}

export function RangeCalendar({
  value,
  defaultValue = null,
  onValueChange,
  month,
  onMonthChange,
  locale,
  disabled,
  minDate,
  maxDate,
  className,
  classNames,
  variant
}: RangeCalendarProps) {
  const [selectedRange, setSelectedRange] = useControllableState<DateRange | null>({
    value: value === undefined ? undefined : normalizeRange(value),
    defaultValue: normalizeRange(defaultValue),
    onChange: onValueChange
  });

  const [currentMonth, setCurrentMonth] = useControllableState<Date>({
    value: month ? startOfMonth(month) : undefined,
    defaultValue: startOfMonth(value?.from ?? defaultValue?.from ?? new Date()),
    onChange: (nextMonth) => onMonthChange?.(startOfMonth(nextMonth))
  });

  const isDisabledDate = useCallback(
    (date: Date) => isDateDisabled(date, { disabled, minDate, maxDate }),
    [disabled, maxDate, minDate]
  );

  const getSelectionState = useCallback(
    (date: Date) => {
      const range = selectedRange;

      return {
        selected: Boolean(
          (range?.from && isSameDay(normalizeDate(date), normalizeDate(range.from))) ||
            (range?.to && isSameDay(normalizeDate(date), normalizeDate(range.to)))
        ),
        inRange: isInRange(normalizeDate(date), range),
        rangeStart: isRangeStart(normalizeDate(date), range),
        rangeEnd: isRangeEnd(normalizeDate(date), range)
      };
    },
    [selectedRange]
  );

  const handleSelectDate = useCallback(
    (date: Date) => {
      const normalizedDate = normalizeDate(date);
      const current = selectedRange;

      if (!current?.from || (current.from && current.to)) {
        setSelectedRange({ from: normalizedDate, to: null });
        return;
      }

      if (!current.to) {
        if (isSameDay(current.from, normalizedDate)) {
          setSelectedRange({ from: normalizedDate, to: normalizedDate });
          return;
        }

        const orderedRange = isBefore(normalizedDate, current.from)
          ? { from: normalizedDate, to: current.from }
          : { from: current.from, to: normalizedDate };

        if (hasDisabledDateBetween(orderedRange.from, orderedRange.to, isDisabledDate)) {
          setSelectedRange({ from: normalizedDate, to: null });
          return;
        }

        if (isAfter(orderedRange.from, orderedRange.to)) {
          setSelectedRange({ from: orderedRange.to, to: orderedRange.from });
          return;
        }

        setSelectedRange(toNullableRange(orderedRange));
      }
    },
    [isDisabledDate, selectedRange, setSelectedRange]
  );

  return (
    <CalendarGrid
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      locale={locale}
      isDisabled={isDisabledDate}
      getSelectionState={getSelectionState}
      onSelectDate={handleSelectDate}
      className={className}
      classNames={classNames}
      variant={variant}
    />
  );
}
