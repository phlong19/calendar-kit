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
- `pnpm release:check`: run publish guard checks (`lint`, `typecheck`, `test`, `build`)
- `pnpm release:pack`: create and validate `core` + `registry` tarballs
- `pnpm release:publish:next`: publish prerelease in order (`core`, then `registry`)

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

## Install modes

### npm package mode (fast path)

```bash
pnpm add @calendar-kit/registry
```

Use this when you want quick installation with package-managed dependencies.
`date-fns`, Radix, and related runtime dependencies are pulled via `@calendar-kit/registry`.

### Registry/open-code mode (source ownership path)

Use the registry manifests in `packages/registry/src/manifests` to install source files into your app.
This mode is for teams that want direct ownership/editing of component source after install.

In both modes, localization is the same:

- `locale` controls date-fns behavior and localized date text
- `labels` controls UI copy with English fallback (`labels?.key ?? defaultEnglish`)

## Distribution direction

This repo ships in hybrid mode:

1. npm package install for fast adoption
2. registry/open-code install for shadcn-style source ownership
