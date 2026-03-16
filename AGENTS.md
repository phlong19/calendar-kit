# agent.md

## Goal
Build input-triggered date picker wrappers on top of existing inline calendar primitives.

Keep:
- `Calendar` as low-level single-date inline primitive
- `RangeCalendar` as low-level range inline primitive

Add:
- `DatePicker`
- `DateRangePicker`

## Core product direction
This component should expose a **simple committed-value API**.

Public props state only matters for the **final committed value**.  
All in-progress interactions should be handled by **internal component state**.

## Public API rules
Expose only:
- `value`
- `defaultValue`
- `onValueChange`
- `open`
- `defaultOpen`
- `onOpenChange`
- config props like `autoApply`, `fromYear`, `toYear`, `displayFormat`, `numberOfMonths`, `presets`, `enableCustomPresets`, `customPresetStorageKey`

Do **not** expose:
- `onApply`
- `onDraftChange`
- callback meta like `source`, `phase`, `autoApplied`

`onValueChange` must fire **only when a new value is committed**.

## State model
Internal state handles:
- draft selection
- popup session state
- apply flow
- preset interactions
- linked month navigation
- temporary hover/partial range behavior

External `value` represents only the **committed value**.

Behavior:
- `autoApply=false`: user edits internal draft, commit only on Apply
- `autoApply=true`: commit immediately when selection is complete/valid

## UX requirements
### DatePicker
- read-only input trigger
- opens popover on click/focus
- formatted display value
- month/year dropdown navigation
- default year window: current year ±10

### DateRangePicker
- read-only input trigger
- popover with:
  - presets column
  - two linked calendars by default
  - footer with Apply/Clear when `autoApply=false`
- default `numberOfMonths = 2`
- linked calendars must always remain consecutive

## Presets
Built-ins:
- Today
- Yesterday
- This week
- Last week
- This month
- Last month
- Last 3 months
- Last 6 months

Custom presets:
- add-only in v1
- persist in `localStorage`
- hydrate on mount
- no rename/delete UI in v1

Default storage key:
- `calendar-kit:custom-range-presets:v1`

## Navigation rules
For linked dual-month range picker:
- left calendar defines base month
- right calendar is always base month + 1
- changing left month/year updates base month directly
- changing right month/year recalculates base month as right month - 1
- never allow overlap or non-consecutive month layout

## Constraints
- input typing/parsing is out of scope for v1
- reference design is inspiration, not pixel-perfect target
- value type remains `Date`
- no timezone abstraction in this iteration

## Implementation order
1. Build `DateRangePicker` wrapper first
2. Add internal draft/commit model
3. Add linked month/year dropdown navigation
4. Add presets + custom preset persistence
5. Build `DatePicker`
6. Update docs/demo
7. Add tests
8. Verify existing `Calendar` and `RangeCalendar` remain unchanged

## Testing focus
Cover:
- commit-only `onValueChange`
- `autoApply=false` vs `autoApply=true`
- linked month behavior
- preset commit behavior
- custom preset persistence/hydration
- popover open/close behavior
- regression safety for existing inline primitives

## Important principle
Keep the public API minimal and hard to misuse.

This is a **committed value component**, not a public interaction state machine.