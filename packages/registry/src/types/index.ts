import type { Locale } from "date-fns";
import type {
  BuiltInPresetLabels,
  DateRange,
  RangePreset,
} from "@calendar-kit/core";

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

export interface RangeCalendarProps extends CalendarBaseProps {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange | null) => void;
}

export interface PickerBaseProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoApply?: boolean;
  fromYear?: number;
  toYear?: number;
  displayFormat?: string;
}

export interface DatePickerProps extends PickerBaseProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
}

export interface DateRangePickerProps extends PickerBaseProps {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange | null) => void;
  numberOfMonths?: number;
  presets?: RangePreset[];
  presetLabels?: BuiltInPresetLabels;
  enableCustomPresets?: boolean;
  customPresetStorageKey?: string;
}

export {
  type RangePreset,
  type BuiltInPresetLabels,
  type DateRange,
  type BuiltInPresetId,
} from "@calendar-kit/core";
