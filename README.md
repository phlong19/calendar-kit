# calendar-kit

`calendar-kit` is an open-source React calendar component kit with inline calendars and input-triggered pickers.

## Workspace

- `packages/core`: internal date/range/navigation engine
- `packages/registry`: installable component source surface (primary v1 product path)
- `packages/tooling`: registry/scripts validation tooling (scaffolded)
- `packages/config`: shared config package (scaffolded)
- `packages/test-utils`: shared testing helpers (scaffolded)
- `apps/docs`: Next.js docs and interactive demos

## Quick start

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev`: run docs app
- `pnpm build`: build all packages
- `pnpm test`: run tests
- `pnpm lint`: run lint checks
- `pnpm typecheck`: run TypeScript checks

## Current scope

- `Calendar` and `RangeCalendar` inline primitives
- `DatePicker` and `DateRangePicker` wrappers with committed-value APIs
- Keyboard navigation
- Presets + add-only custom preset persistence for range picker
- Tailwind + CVA style model

## Usage guide

`DatePicker` and `DateRangePicker` expose committed-value APIs.

- `value` is the committed value
- `onValueChange` fires only when commit happens
- `autoApply={false}` keeps draft changes internal until `Apply`
- `autoApply={true}` commits immediately for single date, and for range only after both `from` and `to` are selected

```tsx
import { useState } from "react";
import { enGB } from "date-fns/locale";
import { DatePicker, DateRangePicker, type DateRange } from "@calendar-kit/registry";

function Example() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [range, setRange] = useState<DateRange | null>(null);

  return (
    <>
      <DatePicker
        value={date}
        onValueChange={setDate}
        locale={enGB}
        labels={{
          datePlaceholder: "Select a date",
          clear: "Clear",
          apply: "Apply"
        }}
      />

      <DateRangePicker
        value={range}
        onValueChange={setRange}
        autoApply={false}
        locale={enGB}
        labels={{
          rangePlaceholder: "Select date range",
          customPresetPlaceholder: "Custom range",
          apply: "Apply",
          clear: "Clear",
          save: "Save",
          presets: {
            today: "Today",
            yesterday: "Yesterday"
          }
        }}
      />
    </>
  );
}
```

Localization notes:

- Use `locale` to localize month/day names and week boundaries.
- Use `labels` for UI copy fallback (`labels?.key ?? defaultEnglish`).
- `presetLabels` has been replaced by `labels.presets`.

## Distribution direction

This repo is registry-first/open-code for Next.js + shadcn users.

1. Primary: install source components (editable after install)
2. Secondary: workspace/package usage for local development and testing

The goal is source ownership and customization, not a black-box styled widget.
