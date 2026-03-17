````md
# agents.md

## Product Direction

This project should **not** be finalized as a traditional styled npm UI library.

Even if the repo is internally organized as packages and built with tools like `tsup`, the **public product direction** should be:

- a **registry-first open-code component system**
- targeting **Next.js / React / shadcn users**
- focused on **calendar and date picker UX**
- designed for **easy source ownership and customization after install**

In short:

**internal architecture can be package-based, but public distribution should be open-code / registry-based.**

---

## Why not a traditional styled npm lib

A normal styled npm package is not the best fit for this audience.

### Problems:
- shadcn users generally want to **own the component code**
- they often expect to **edit UI directly**
- shipping a fixed visual system reduces flexibility
- using our own design language makes the picker feel less native inside their app
- styling and composition can clash with project-specific Tailwind tokens and local patterns

This project should not try to become “another black-box React date picker package”.

---

## Why not raw copy-paste only

Pure copy-paste/open-source snippets are also not enough.

### Problems:
- users may already have heavily customized local shadcn primitives
- their `Button`, `Popover`, `Input`, spacing, variants, and tokens may differ
- blindly depending on their local component implementations can cause visual mismatch or breakage
- support becomes harder if the picker assumes too much about the host app

So the product should not rely on “paste this and hope your local setup matches”.

---

## Final distribution model

Ship this as a **registry-based open-code component product**.

### Public distribution:
- remote registry
- installable components
- source files added into the user’s app
- editable after install
- shadcn-style usage model

### Internal repo structure:
- package-based architecture is still encouraged
- shared logic can live in internal packages
- registry output can be generated from internal packages

This gives:
- maintainable internal architecture
- customizable public consumption model

---

## Architecture principle

Use this split:

### Internal
- packages for logic, shared utilities, state, formatting, and installable source generation

### External
- users consume installable source code, not a locked styled widget package

The repo may contain packages such as:
- `packages/core`
- `packages/registry`
- optional `packages/cli`
- `apps/docs`

But users should primarily consume the project through the registry/open-code flow.

---

## Styling strategy

The styling direction should be:

**theme-adaptive, shadcn-compatible, mostly self-contained UI**

Not:
- a hardcoded custom design system
- a strict dependency on the user’s edited local shadcn primitives

### Important rule
Do **not** couple the picker too tightly to the host app’s exact local implementations of:
- `Button`
- `Popover`
- `Input`
- custom variant names
- private wrapper components

Because many shadcn users already modified those files, and relying on them too heavily increases mismatch risk.

---

## Recommended UI packaging strategy

Use a **hybrid self-contained approach**.

### Ship self-contained picker-specific source for:
- date picker shell
- range picker shell
- calendar header
- presets panel
- footer/apply controls
- picker-specific helpers

### Reuse common conventions where reasonable:
- Tailwind utility classes
- `cn` helper if appropriate
- CSS variable tokens when possible
- common React/Next/shadcn-friendly patterns

### Avoid:
- depending on user-specific button/popover variant contracts
- requiring exact local primitive implementations
- shipping a fully isolated proprietary design language

The installed components should work predictably, while still being easy for users to edit.

---

## UX/Product Positioning

Position the project as:

**A production-grade calendar registry for shadcn apps — open code, easy to theme, stable UX.**

Do not position it as:
- a generic styled npm date picker library
- a random copy-paste snippet collection
- a full design system

The main value is:
- better UX
- better date/range behavior
- cleaner API
- installable open source ownership
- compatibility with shadcn-oriented workflows

---

## API Philosophy

The public API should stay minimal and safe.

### Key rule
Public `value` represents only the **committed value**.

### Public event
Expose:
- `onValueChange`

Only when a new value is actually committed.

### Internal-only behavior
Keep these as internal implementation details:
- draft selection state
- apply flow
- commit source
- interaction metadata
- transient popup session logic

This component should behave as a **committed value control**, not as a public interaction state machine.

---

## Date Picker Plan Alignment

This project direction applies directly to:
- `DatePicker`
- `DateRangePicker`

while preserving:
- `Calendar`
- `RangeCalendar`

as low-level inline primitives.

The wrappers should:
- use internal draft state
- expose only committed value updates
- remain visually editable after registry install
- avoid hard dependence on the host app’s customized shadcn primitives

---

## Project Structure

Use a monorepo, but clearly separate **internal architecture** from **public distribution**.

### Recommended structure

```txt
calendar-kit/
├─ apps/
│  └─ docs/                     # Next.js docs, demos, showcase, install guide
│
├─ packages/
│  ├─ core/                     # internal logic only
│  │  ├─ src/
│  │  │  ├─ date/               # date math, range helpers, formatting helpers
│  │  │  ├─ selection/          # selection logic / commit helpers
│  │  │  ├─ presets/            # built-in preset generation
│  │  │  ├─ navigation/         # linked month navigation logic
│  │  │  ├─ types/              # internal shared types
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  │
│  ├─ registry/                 # source files that users actually install
│  │  ├─ src/
│  │  │  ├─ components/
│  │  │  │  ├─ date-picker/
│  │  │  │  │  ├─ date-picker.tsx
│  │  │  │  │  ├─ date-picker-input.tsx
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ date-range-picker/
│  │  │  │  │  ├─ date-range-picker.tsx
│  │  │  │  │  ├─ presets-panel.tsx
│  │  │  │  │  ├─ picker-footer.tsx
│  │  │  │  │  ├─ linked-calendars.tsx
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ calendar/
│  │  │  │  │  ├─ calendar.tsx
│  │  │  │  │  ├─ calendar-header.tsx
│  │  │  │  │  └─ index.ts
│  │  │  │  └─ range-calendar/
│  │  │  │     ├─ range-calendar.tsx
│  │  │  │     └─ index.ts
│  │  │  ├─ hooks/              # installable hooks if needed
│  │  │  ├─ lib/                # installable helpers used by registry components
│  │  │  ├─ styles/             # optional shared class maps/tokens
│  │  │  ├─ manifests/          # registry JSON definitions
│  │  │  └─ index.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  │
│  ├─ tooling/                  # internal scripts/generators/validation
│  │  ├─ src/
│  │  │  ├─ build-registry.ts
│  │  │  ├─ validate-manifests.ts
│  │  │  └─ sync-doc-examples.ts
│  │  └─ package.json
│  │
│  ├─ config/                   # shared tsconfig/eslint/tailwind presets
│  │  ├─ tsconfig.base.json
│  │  ├─ eslint/
│  │  └─ package.json
│  │
│  └─ test-utils/               # shared test helpers/mocks/render wrappers
│     ├─ src/
│     └─ package.json
│
├─ turbo.json
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md
````

---

## Project Structure Principles

### `apps/docs`

This is the main product surface early on.

Use it for:

* demos
* install docs
* API docs
* playground examples
* behavior showcase
* controlled/uncontrolled examples
* presets and autoApply docs

This app is also the dogfooding environment.

### `packages/core`

This is internal logic only.

It should contain:

* date math
* range normalization
* linked month calculations
* preset generators
* formatting helpers
* internal selection/session logic

Important:
do **not** make this the main public product in v1.

Think of it as the engine under the hood.

### `packages/registry`

This is the most important package for public distribution.

It contains the source files users install into their own app.

This package should hold:

* `DatePicker`
* `DateRangePicker`
* `Calendar`
* `RangeCalendar`
* subcomponents like header, presets panel, footer
* registry manifest definitions

This is the package that should feel most shadcn-native.

---

## Why `core` and `registry` should be separate

They solve different problems.

### `core`

* maintainability
* testability
* reusable logic
* less duplicated behavior

### `registry`

* user-facing installable code
* editable source
* shadcn-compatible distribution
* visual and integration boundary

Rule:

```txt
core = engine
registry = installable UI source
```

---

## Registry Component Organization

Group by install target, not by tiny technical pieces.

Example:

```txt
registry/src/components/
├─ calendar/
├─ range-calendar/
├─ date-picker/
└─ date-range-picker/
```

This makes it easier to:

* generate manifests
* install components
* document each unit
* keep related files together

### Suggested split for `date-range-picker`

```txt
date-range-picker/
├─ date-range-picker.tsx
├─ linked-calendars.tsx
├─ presets-panel.tsx
├─ picker-footer.tsx
├─ range-input-display.tsx
└─ index.ts
```

This is better than one very large file.

---

## Low-level vs Wrapper-level Responsibilities

### Low-level primitives

Keep these simple and reusable:

* `Calendar`
* `RangeCalendar`
* `CalendarHeader`

They should support:

* date grid behavior
* keyboard navigation
* month/year dropdown header
* inline rendering

They should **not** know too much about:

* popover state
* Apply button
* presets persistence
* committed vs draft app logic

### Wrapper-level

Put these in:

* `DatePicker`
* `DateRangePicker`

They own:

* input trigger
* popover
* internal draft session
* apply flow
* presets UI
* open/close behavior

---

## Registry Manifests

Inside `packages/registry`, keep manifest definitions separate.

Example:

```txt
packages/registry/src/manifests/
├─ calendar.json
├─ range-calendar.json
├─ date-picker.json
└─ date-range-picker.json
```

These define:

* files to install
* dependencies
* optional registry metadata
* related hooks/helpers

This makes automation and validation easier.

---

## Testing Structure

Add tests close to behavior-heavy code.

Example:

```txt
packages/core/src/navigation/__tests__/
packages/core/src/presets/__tests__/
packages/registry/src/components/date-range-picker/__tests__/
packages/registry/src/components/calendar/__tests__/
```

Focus tests on:

* linked month behavior
* commit-only value changes
* autoApply vs non-autoApply
* preset persistence
* open/close flow

---

## Docs Structure Suggestion

Inside `apps/docs`, prefer something like:

```txt
apps/docs/src/
├─ app/
│  ├─ docs/
│  │  ├─ installation/
│  │  ├─ components/
│  │  │  ├─ calendar/
│  │  │  ├─ range-calendar/
│  │  │  ├─ date-picker/
│  │  │  └─ date-range-picker/
│  │  └─ page.tsx
│  ├─ examples/
│  └─ page.tsx
├─ components/
│  ├─ demo-frame.tsx
│  ├─ prop-table.tsx
│  └─ event-log.tsx
└─ lib/
```

Docs should show:

* basic install
* controlled/uncontrolled usage
* presets
* autoApply
* customization points

---

## What not to add too early

Avoid creating too many packages too soon, such as:

* `ui`
* `icons`
* `themes`
* `adapters`
* `react`
* `next`
* `headless`

For v1, these are enough:

* `core`
* `registry`
* `tooling`
* `config`
* `docs`

---

## v1 Delivery Direction

### Build and ship:

* docs/demo app
* registry-based install flow
* `DatePicker`
* `DateRangePicker`
* self-contained but editable source files
* shadcn-compatible styling
* minimal public API

### Do not prioritize as primary product:

* direct styled npm package imports as the main consumption model

### May be added later:

* headless/core npm package
* advanced CLI helpers
* extra adapters/utilities
* premium/private registry offerings

---

## Decision Summary

### Final call

This project should be built as:

**open-code on the outside, package architecture on the inside**

and distributed as:

**a registry-first shadcn-compatible calendar component system**

not as:

**a traditional styled React date picker library**

---

## Guiding Principle

When there is a tradeoff between:

* internal engineering convenience
* and external source ownership/customizability

prefer the direction that better serves:

* shadcn users
* Next.js/React developers
* editable installed source
* low-friction theming/customization

This should feel like a **high-quality shadcn ecosystem product**, not a closed UI package.

```
```
