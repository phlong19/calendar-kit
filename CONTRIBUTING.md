# Contributing

## Development

```bash
pnpm install
pnpm dev
```

## Required checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Pull request expectations

- Keep API changes documented in `README.md` and `packages/registry/README.md` when relevant
- Add or update tests for behavior changes
- Keep components accessible (keyboard + screen reader support)

## Release notes

Add a short summary of user-facing changes in your pull request description.

## Manual prerelease flow (`next`)

1. Bump versions for `@calendar-kit/core` and `@calendar-kit/registry` to the same prerelease (for example `0.1.1-next.0`).
2. Set `@calendar-kit/registry` dependency to the same `@calendar-kit/core` version (not `workspace:*`).
3. Run:

```bash
pnpm release:check
pnpm release:pack
```

4. Publish in order:

```bash
pnpm --filter @calendar-kit/core publish --tag next --access public
pnpm --filter @calendar-kit/registry publish --tag next --access public
```

5. Smoke test in a clean Next.js app:
   - `pnpm add @calendar-kit/registry@next`
   - render `DatePicker`/`DateRangePicker`
   - import `@calendar-kit/registry/styles.css`
