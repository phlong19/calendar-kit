"use client";

import { isSameDay, startOfMonth } from "date-fns";
import { useCallback } from "react";

import type { CalendarProps } from "../types";
import { isDateDisabled, normalizeDate } from "../utils/date";
import { useControllableState } from "../utils/use-controllable-state";
import { CalendarGrid } from "./calendar-grid";

export function Calendar({
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
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useControllableState<Date | null>({
    value,
    defaultValue,
    onChange: onValueChange
  });

  const [currentMonth, setCurrentMonth] = useControllableState<Date>({
    value: month ? startOfMonth(month) : undefined,
    defaultValue: startOfMonth(value ?? defaultValue ?? new Date()),
    onChange: (nextMonth) => onMonthChange?.(startOfMonth(nextMonth))
  });

  const isDisabledDate = useCallback(
    (date: Date) => isDateDisabled(date, { disabled, minDate, maxDate }),
    [disabled, maxDate, minDate]
  );

  const getSelectionState = useCallback(
    (date: Date) => {
      const isSelected = Boolean(selectedDate && isSameDay(normalizeDate(date), normalizeDate(selectedDate)));

      return {
        selected: isSelected,
        inRange: false,
        rangeStart: false,
        rangeEnd: false
      };
    },
    [selectedDate]
  );

  const handleSelectDate = useCallback(
    (date: Date) => {
      const normalizedDate = normalizeDate(date);

      if (selectedDate && isSameDay(normalizedDate, normalizeDate(selectedDate))) {
        setSelectedDate(null);
        return;
      }

      setSelectedDate(normalizedDate);
    },
    [selectedDate, setSelectedDate]
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
