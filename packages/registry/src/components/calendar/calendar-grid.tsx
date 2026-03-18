"use client";

import { cva } from "class-variance-authority";
import {
  addDays,
  addMonths,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Locale } from "date-fns";
import {
  getCalendarWeeks,
  getWeekdayLabels,
  toDateKey,
} from "@calendar-kit/core";

import type {
  CalendarClassNames,
  CalendarSlot,
  CalendarVariant,
} from "../../types";
import { cn } from "../../lib/utils";

type SelectionState = {
  selected: boolean;
  inRange: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
};

interface CalendarGridProps {
  month: Date;
  onMonthChange: (nextMonth: Date) => void;
  locale?: Locale;
  calendarAriaLabel?: string;
  isDisabled: (date: Date) => boolean;
  getSelectionState: (date: Date) => SelectionState;
  onSelectDate: (date: Date) => void;
  className?: string;
  classNames?: CalendarClassNames;
  variant?: CalendarVariant;
}

const shellStyles = cva(
  "calendar-kit-theme w-fit rounded-xl ring-0 bg-card p-4 text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        outline: "border-border/80",
        ghost: "border-transparent bg-transparent shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const dayButtonStyles = cva(
  "inline-flex size-10 items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        outline:
          "border border-border hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      outside: {
        true: "text-muted-foreground",
        false: "",
      },
      disabled: {
        true: "pointer-events-none opacity-40",
        false: "",
      },
      selected: {
        true: "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
        false: "",
      },
      inRange: {
        true: "bg-accent text-accent-foreground rounded-none",
        false: "",
      },
      rangeEdge: {
        true: "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
        false: "",
      },
    },
    compoundVariants: [
      {
        selected: true,
        inRange: true,
        class: "bg-primary text-primary-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
    },
  },
);

function getSlotClass(
  slot: CalendarSlot,
  base: string,
  classNames?: CalendarClassNames,
) {
  return cn(base, classNames?.[slot]);
}

function resolveNextDate(currentDate: Date, key: string, locale?: Locale) {
  const weekStartsOn = locale?.options?.weekStartsOn;

  if (key === "ArrowLeft") {
    return addDays(currentDate, -1);
  }

  if (key === "ArrowRight") {
    return addDays(currentDate, 1);
  }

  if (key === "ArrowUp") {
    return addDays(currentDate, -7);
  }

  if (key === "ArrowDown") {
    return addDays(currentDate, 7);
  }

  if (key === "Home") {
    return startOfWeek(currentDate, { locale, weekStartsOn });
  }

  if (key === "End") {
    return endOfWeek(currentDate, { locale, weekStartsOn });
  }

  if (key === "PageUp") {
    return addMonths(currentDate, -1);
  }

  if (key === "PageDown") {
    return addMonths(currentDate, 1);
  }

  return null;
}

export function CalendarGrid({
  month,
  onMonthChange,
  locale,
  calendarAriaLabel = "Calendar",
  isDisabled,
  getSelectionState,
  onSelectDate,
  className,
  classNames,
  variant = "default",
}: Readonly<CalendarGridProps>) {
  const weeks = useMemo(() => getCalendarWeeks(month, locale), [month, locale]);
  const weekdayLabels = useMemo(() => getWeekdayLabels(locale), [locale]);
  const [focusDate, setFocusDate] = useState<Date | null>(null);
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (!focusDate) {
      return;
    }

    const nextFocus = dayRefs.current.get(toDateKey(focusDate));
    nextFocus?.focus();
  }, [focusDate, month]);

  const handleDayKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
      const nextDate = resolveNextDate(date, event.key, locale);

      if (!nextDate) {
        return;
      }

      event.preventDefault();
      setFocusDate(nextDate);

      if (!isSameMonth(nextDate, month)) {
        onMonthChange(startOfMonth(nextDate));
      }
    },
    [locale, month, onMonthChange],
  );

  const handleSelectDate = useCallback(
    (date: Date) => {
      if (isDisabled(date)) {
        return;
      }

      onSelectDate(date);

      if (!isSameMonth(date, month)) {
        onMonthChange(startOfMonth(date));
      }
    },
    [isDisabled, month, onMonthChange, onSelectDate],
  );

  return (
    <div
      className={cn(
        shellStyles({ variant }),
        getSlotClass("container", "", classNames),
        className,
      )}
    >
      <table className="border-collapse" role="grid" aria-label={calendarAriaLabel}>
        <thead>
          <tr className={getSlotClass("weekRow", "", classNames)}>
            {weekdayLabels.map((label, index) => (
              <th
                key={`${label}-${index}`}
                className={getSlotClass(
                  "weekDay",
                  "size-10 text-center text-sm font-medium text-muted-foreground border-b-2 border-transparent",
                  classNames,
                )}
                scope="col"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr
              key={week[0]?.toISOString()}
              className={getSlotClass("weekRow", "", classNames)}
            >
              {week.map((date) => {
                const outside = !isSameMonth(date, month);
                const disabled = isDisabled(date);
                const selection = getSelectionState(date);

                return (
                  <td
                    key={date.toISOString()}
                    role="gridcell"
                    aria-selected={selection.selected}
                  >
                    <button
                      type="button"
                      ref={(node) => {
                        const key = toDateKey(date);

                        if (node) {
                          dayRefs.current.set(key, node);
                        } else {
                          dayRefs.current.delete(key);
                        }
                      }}
                      className={cn(
                        dayButtonStyles({
                          variant,
                          outside,
                          disabled,
                          selected: selection.selected,
                          inRange: selection.inRange,
                          rangeEdge: selection.rangeStart || selection.rangeEnd,
                        }),
                        outside && getSlotClass("dayOutside", "", classNames),
                        disabled && getSlotClass("dayDisabled", "", classNames),
                        selection.selected &&
                          getSlotClass("daySelected", "", classNames),
                        selection.inRange &&
                          getSlotClass("dayInRange", "", classNames),
                        selection.rangeStart &&
                          getSlotClass(
                            "dayRangeStart",
                            "rounded-l-sm",
                            classNames,
                          ),
                        selection.rangeEnd &&
                          getSlotClass(
                            "dayRangeEnd",
                            "rounded-r-sm",
                            classNames,
                          ),
                        getSlotClass("dayButton", "cursor-pointer", classNames),
                      )}
                      disabled={disabled}
                      aria-label={format(date, "PPPP", { locale })}
                      aria-pressed={selection.selected}
                      onClick={() => handleSelectDate(date)}
                      onKeyDown={(event) => handleDayKeyDown(event, date)}
                    >
                      {format(date, "d", { locale })}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
