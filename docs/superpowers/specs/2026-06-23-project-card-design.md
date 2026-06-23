# ProjectCard Widget — Design Spec

**Date:** 2026-06-23
**Story:** Build ProjectCard (status badge, progress bar, stack chips)
**Epic:** UI — Dashboard

---

## Goal

Replace the 3 animate-pulse placeholder divs in `Home` with real `ProjectCard` widgets that display each project's status, description, stack, story count, and links.

---

## Architecture

```
src/components/widgets/ProjectCard/
  index.tsx          ← presentational card component
  StatusBadge/
    index.tsx        ← status variant badge
  StackChip/
    index.tsx        ← individual tech chip

src/pages/Home/index.tsx  ← data owner; calls useAllProjectStories(), maps projects → ProjectCard
```

### Props

```ts
interface ProjectCardProps {
  id: string
  config: ProjectConfig   // from src/data/config.ts
  stories?: DerivedStory[] // from useAllProjectStories()
}
```

`ProjectCard` is purely presentational. `Home` owns all data fetching.

---

## Visual Structure

```
┌─────────────────────────────────────────┐
│ [🟢 Live]                               │  StatusBadge
│                                         │
│ myJsonFormatter                         │  font-heading, text-base font-bold
│ JSON formatter and minifier.            │  text-sm text-muted-foreground
│                                         │
│ [Vite] [React] [TS] [CodeMirror]        │  StackChip[] — split by " + "
│                                         │
│ 12 stories          [↗ Demo] [⌥ GitHub] │  story count + icon buttons
└─────────────────────────────────────────┘
```

---

## Sub-components

### StatusBadge

Variants via `cva`:

| Status       | Style                                        |
|--------------|----------------------------------------------|
| Live         | `bg-muted text-foreground`                   |
| In Progress  | `border border-border bg-transparent text-foreground` |
| Planning     | `bg-muted text-muted-foreground`             |

### StackChip

- Renders a single tech string (e.g. `"Vite"`)
- `text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5`

---

## Data Flow

```tsx
// Home.tsx
const { data: storiesMap, isLoading, isError } = useAllProjectStories()

// loading → keep animate-pulse placeholders
// loaded → map projects array to ProjectCard
projects.map((config) => (
  <ProjectCard
    id={`project-card-${config.repo}`}
    key={config.repo}
    config={config}
    stories={storiesMap.get(config.repo)}
  />
))
```

- **Story count**: `stories?.length ?? 0` — shows `—` while undefined
- **GitHub link**: always `https://github.com/geldopc/${config.repo}`
- **Demo link**: only rendered when `config.demoUrl` exists
- **Error state**: cards render with `stories={undefined}` — graceful degradation
- **Progress bar**: omitted — no `%` field in `config.ts` yet (separate story for Notion mapping)

---

## Decisions

- **Approach A (Home owns data)**: `useAllProjectStories` fires one parallel batch of queries; each `ProjectCard` is purely presentational. Avoids N separate fetches from inside cards.
- **Stack split**: `config.stack.split(" + ")` — each token becomes a `StackChip`.
- **Progress bar deferred**: requires Notion progress % field; not yet available in config.

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/widgets/ProjectCard/index.tsx` | New |
| `src/components/widgets/ProjectCard/StatusBadge/index.tsx` | New |
| `src/components/widgets/ProjectCard/StackChip/index.tsx` | New |
| `src/pages/Home/index.tsx` | Replace pulse placeholders with real ProjectCard grid |
