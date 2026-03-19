# @shadcn-calendar/registry

Registry-first installable source surface for shadcn-calendar.

Exports:

- Calendar
- RangeCalendar
- DatePicker
- DateRangePicker

Styles:

```css
@import "@shadcn-calendar/registry/styles.css";
```

Primary product direction is open-code/registry consumption for Next.js + shadcn users.

## Install

```bash
pnpm add @shadcn-calendar/registry
```

`react` and `react-dom` are peer dependencies and should already exist in your app.

## Install (open-code mode)

Use manifest-driven source install from `src/manifests/*` if you want full code ownership in your app.
In this mode, install dependencies listed by each manifest entry (for example `date-fns`, Radix packages, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`).

## Quick usage

```tsx
import { useState } from "react";
import { enGB } from "date-fns/locale";
import { DatePicker, DateRangePicker, type DateRange } from "@shadcn-calendar/registry";

export function Example() {
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRange | null>(null);

  return (
    <>
      <DatePicker value={date} onValueChange={setDate} />

      <DateRangePicker
        value={range}
        onValueChange={setRange}
        autoApply={false}
        numberOfMonths={2}
        locale={enGB}
        labels={{
          rangePlaceholder: "Select date range",
          apply: "Apply",
          clear: "Clear",
          save: "Save",
          customPresetPlaceholder: "Custom range",
          presets: {
            today: "Today",
            "this-week": "This week"
          }
        }}
      />
    </>
  );
}
```

## API notes

- `onValueChange` is commit-only (no draft callbacks are exposed).
- `locale` controls date-fns behavior and localized month/weekday rendering.
- `labels` controls UI strings with default English fallback.
- Use `labels.presets` for built-in preset translations (`presetLabels` is removed).

## Prerelease install

```bash
pnpm add @shadcn-calendar/registry@next
```
