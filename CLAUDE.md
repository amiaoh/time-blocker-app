# Time Blocker App — Dev Rules

## Stack
React 19, TypeScript strict, Chakra UI v3, Supabase, TanStack Query v5, dnd-kit

## Component Design
- **No absolute positioning** — use layout primitives (grid columns, spacers, empty elements) instead
- **Max ~80 lines per component file** — split if larger
- **One responsibility per file** — no local helper components that render JSX; extract them
- Shared primitives → `src/components/shared/` (e.g. `ActionBtn`, `TextBtn`)
- Feature sub-components → alongside the parent (e.g. `TaskCardActions`, `ClockMarks`)
- Pure logic/constants → separate `.ts` file (e.g. `timerGeometry.ts`)
- See `src/components/timer/` and `src/components/tasks/` for examples of this pattern

## Folder Structure
- `src/components/<feature>/` — feature components + sub-components
- `src/components/shared/` — reusable primitives used across features
- `src/components/layout/` — layout-level components (e.g. `AppHeader`)
- `src/screens/` — screen-level composition + `useXxxScreen` logic hooks
- `src/hooks/` — shared hooks (e.g. `useSettings`, `useSessionId`)
- `src/utils/` — pure utility functions

## DB / Supabase
- Migrations must be run manually in Supabase SQL editor after schema changes
- Always store seconds (not minutes) for time precision — `spent_seconds INTEGER`
