# calendar-kit package

`calendar-kit` provides two components:

- `Calendar` for single-date selection
- `RangeCalendar` for date-range selection

## Install

```bash
pnpm add calendar-kit date-fns class-variance-authority clsx tailwind-merge
```

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

## Behavior

- Controlled and uncontrolled modes are both supported
- Keyboard navigation: arrows, Home/End, PageUp/PageDown
- Disabled dates are blocked
- Range selection restarts if a disabled date exists between start and end
