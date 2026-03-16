import type { Locale } from "date-fns";

export type CalendarVariant = "default" | "outline" | "ghost";

export type CalendarSlot =
  | "container"
  | "header"
  | "monthLabel"
  | "navButton"
  | "weekRow"
  | "weekDay"
  | "dayButton"
  | "dayOutside"
  | "dayDisabled"
  | "daySelected"
  | "dayInRange"
  | "dayRangeStart"
  | "dayRangeEnd";

export type CalendarClassNames = Partial<Record<CalendarSlot, string>>;

export interface CalendarBaseProps {
  month?: Date;
  onMonthChange?: (month: Date) => void;
  locale?: Locale;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  classNames?: CalendarClassNames;
  variant?: CalendarVariant;
}

export interface CalendarProps extends CalendarBaseProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface RangeCalendarProps extends CalendarBaseProps {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange | null) => void;
}
