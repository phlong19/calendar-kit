# calendar-kit package

`calendar-kit` provides four components:

- `Calendar` for single-date selection
- `RangeCalendar` for date-range selection
- `DatePicker` for input-triggered single-date selection
- `DateRangePicker` for input-triggered date-range selection

## Install model

Primary direction is registry/open-code install so teams can edit source after install.

This package is kept for workspace development/testing and internal distribution.

## Styles

Import fallback tokens once in your app entry/global stylesheet if your app does not already define shadcn tokens:

```css
@import "calendar-kit/styles.css";
```

The fallback styles are scoped to `.calendar-kit-theme` surfaces and do not globally reset your app.

## API

### `Calendar`

- `value?: Date | null`
- `defaultValue?: Date | null`
- `onValueChange?: (value: Date | null) => void`
- `month?: Date`
- `onMonthChange?: (month: Date) => void`
- `disabled?: (date: Date) => boolean`
- `minDate?: Date`
- `maxDate?: Date`
- `locale?: Locale`
- `variant?: "default" | "outline" | "ghost"`
- `className?: string`
- `classNames?: Partial<Record<CalendarSlot, string>>`

### `RangeCalendar`

- `value?: { from: Date | null; to: Date | null } | null`
- `defaultValue?: { from: Date | null; to: Date | null } | null`
- `onValueChange?: (value: { from: Date | null; to: Date | null } | null) => void`
- Supports the same month, disabled, locale, and style props as `Calendar`

### `DateRangePicker`

- `value?: DateRange | null`
- `defaultValue?: DateRange | null`
- `onValueChange?: (value: DateRange | null) => void`
- `open?: boolean`
- `defaultOpen?: boolean`
- `onOpenChange?: (open: boolean) => void`
- `autoApply?: boolean`
- `numberOfMonths?: number`
- `presets?: RangePreset[]`
- `presetLabels?: Partial<Record<"today" | "yesterday" | "this-week" | "last-week" | "this-month" | "last-month" | "last-3-months" | "last-6-months", string>>`
- `enableCustomPresets?: boolean`
- `customPresetStorageKey?: string`

## Behavior

- Controlled and uncontrolled modes are both supported
- Keyboard navigation: arrows, Home/End, PageUp/PageDown
- Disabled dates are blocked
- Range selection restarts if a disabled date exists between start and end
- `DatePicker` and `DateRangePicker` are committed-value wrappers:
  - `onValueChange` fires only when value is committed
  - `autoApply=false` keeps draft internally until Apply
  - `DateRangePicker` with `autoApply=true` commits only after both `from` and `to` are selected
