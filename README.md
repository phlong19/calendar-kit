# calendar-kit

`calendar-kit` is an open-source React calendar component kit with inline calendars and input-triggered pickers.

## Workspace

- `packages/core`: internal date/range/navigation engine
- `packages/registry`: installable component source surface (primary v1 product path)
- `packages/tooling`: registry/scripts validation tooling (scaffolded)
- `packages/config`: shared config package (scaffolded)
- `packages/test-utils`: shared testing helpers (scaffolded)
- `packages/calendar-kit`: legacy package kept for compatibility during migration
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

## Distribution direction

This repo is registry-first/open-code for Next.js + shadcn users.

1. Primary: install source components (editable after install)
2. Secondary: workspace/package usage for local development and testing

The goal is source ownership and customization, not a black-box styled widget.
