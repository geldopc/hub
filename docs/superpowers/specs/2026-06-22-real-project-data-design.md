# Real Project Data — Design Spec

## Context

The hub dashboard needs real project data to demonstrate its value to recruiters. Three projects have concrete GitHub commit history:

- **myJsonFormatter** — completed, ~30 commits, v0.5.0
- **myXmlFormatter** — completed, ~30 commits, CodeMirror-based
- **hub** — in development, this project

## Decisions

1. **Notion as catalog, not backlog** — projects are entries in "geldopc Projects" DB for visibility. No per-project backlog DBs are created for completed projects.
2. **Client-side story derivation** — commits are fetched via GitHub API and grouped into stories at runtime using conventional commit parsing.
3. **Grouping by commit scope** — `feat:` commits are grouped by theme into stories. `fix:`/`chore:` break groups or attach to related stories. Release commits (`chore: release vX.Y.Z`) become milestones.

## Architecture

### Data flow

```
GitHub API → fetchCommits(repo, 100) → groupCommitsIntoStories() → DerivedStory[]
                                              ↑
                                        pure util, no side effects
```

### New file: `src/utils/commitGrouper.ts`

Pure utility that receives `GitHubCommit[]` and returns `DerivedStory[]`.

**Algorithm:**
1. Parse each commit message: extract `type` (feat/fix/chore/docs/ci/refactor) and `description`
2. Walk commits in chronological order (oldest first)
3. Consecutive `feat:` commits with similar keywords group into the same story
4. A `fix:` or `chore:` breaks the group — attaches to previous story if related, otherwise starts a new one
5. `chore: release vX.Y.Z` commits become milestone markers, not stories
6. `docs:` and `ci:` commits group separately as support stories

**Types:**

```ts
type StoryType = "feature" | "fix" | "chore" | "docs";

type DerivedStory = {
  title: string;
  type: StoryType;
  commits: GitHubCommit[];
  startDate: string;
  endDate: string;
};
```

**Title heuristic:** uses the first `feat:` message of the group, stripped of prefix. Example: `feat: enable JSON folding with Phosphor caret markers` becomes `"Enable JSON folding with Phosphor caret markers"`.

### Modified file: `src/data/config.ts`

- Remove `me` and `claude-skills` (not portfolio projects)
- Add `status` field to `ProjectConfig` type: `"Live" | "In Progress" | "Planning"`
- Add `icon` field (emoji string)
- Update metadata with real descriptions, stacks, demo URLs

### Modified file: `src/hooks/GitHub/index.ts`

**New hook `useProjectStories(repo)`:**
1. Calls `useGitHubCommits(repo)` (existing)
2. Pipes data through `groupCommitsIntoStories()`
3. Returns `DerivedStory[]`

**New hook `useAllProjectStories()`:**
- Iterates over `projects` from config
- Returns `Map<string, DerivedStory[]>` (repo to stories)
- Uses `useQueries` for parallel fetching (same pattern as existing `useAllRepoCommits()`)

### Modified file: `src/utils/github.ts`

- Change `fetchCommits()` default `perPage` from 10 to 100 for full history

### Notion actions

Create 2 entries in "geldopc Projects" DB:

| Field | myJsonFormatter | myXmlFormatter |
|-------|----------------|----------------|
| Name | myJsonFormatter | myXmlFormatter |
| Status | Live | Live |
| Progress | 100 | 100 |
| Type | web app | web app |
| Description | JSON formatter and minifier | XML formatter with syntax highlighting and shareable URLs |
| GitHub URL | github.com/geldopc/myJsonFormatter | github.com/geldopc/myXmlFormatter |
| Stack | Vite + React + TS + CodeMirror + Tailwind | Vite + React + TS + CodeMirror + Tailwind |

Update hub entry: Status "Planning" to "In Progress".

## Out of scope

- ProjectCard UI showing stories/commits
- ProjectDetail view
- Notion client-side integration
- Empty states
- fanflix (no GitHub repo yet)
