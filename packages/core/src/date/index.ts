import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek
} from "date-fns";
import type { Locale } from "date-fns";

import type { DateRange } from "../types";

export function normalizeDate(date: Date) {
  return startOfDay(date);
}

export function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function getCalendarWeeks(month: Date, locale?: Locale) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const weekStartsOn = locale?.options?.weekStartsOn;
  const firstGridDay = startOfWeek(monthStart, { locale, weekStartsOn });
  const lastGridDay = endOfWeek(monthEnd, { locale, weekStartsOn });

  const days = eachDayOfInterval({ start: firstGridDay, end: lastGridDay });
  const weeks: Date[][] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  return weeks;
}

export function getWeekdayLabels(locale?: Locale) {
  const weekStartsOn = locale?.options?.weekStartsOn;
  const sampleWeekStart = startOfWeek(new Date(2024, 0, 7), {
    locale,
    weekStartsOn
  });

  return Array.from({ length: 7 }, (_, index) =>
    format(addDays(sampleWeekStart, index), "EEEEE", { locale })
  );
}

export function isDateDisabled(
  date: Date,
  {
    disabled,
    minDate,
    maxDate
  }: {
    disabled?: (date: Date) => boolean;
    minDate?: Date;
    maxDate?: Date;
  }
) {
  const normalizedDate = normalizeDate(date);

  if (minDate && isBefore(normalizedDate, normalizeDate(minDate))) {
    return true;
  }

  if (maxDate && isAfter(normalizedDate, normalizeDate(maxDate))) {
    return true;
  }

  return disabled ? disabled(normalizedDate) : false;
}

export function isInRange(date: Date, range: DateRange | null) {
  if (!range?.from || !range.to) {
    return false;
  }

  const start = isBefore(range.from, range.to) ? range.from : range.to;
  const end = isAfter(range.from, range.to) ? range.from : range.to;

  return isWithinInterval(date, {
    start: normalizeDate(start),
    end: normalizeDate(end)
  });
}

export function isRangeStart(date: Date, range: DateRange | null) {
  return Boolean(range?.from && isSameDay(normalizeDate(date), normalizeDate(range.from)));
}

export function isRangeEnd(date: Date, range: DateRange | null) {
  return Boolean(range?.to && isSameDay(normalizeDate(date), normalizeDate(range.to)));
}

export function hasDisabledDateBetween(
  from: Date,
  to: Date,
  isDisabled: (date: Date) => boolean
) {
  const start = isBefore(from, to) ? from : to;
  const end = isAfter(from, to) ? from : to;

  return eachDayOfInterval({ start: normalizeDate(start), end: normalizeDate(end) }).some(
    (day) => !isSameDay(day, from) && !isSameDay(day, to) && isDisabled(day)
  );
}
