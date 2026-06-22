# Real Project Data — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Populate the hub dashboard with real GitHub commit data from myJsonFormatter, myXmlFormatter, and hub — grouping commits into derived stories client-side.

**Architecture:** GitHub API fetches full commit history per repo. A pure utility (`commitGrouper.ts`) parses conventional commit messages and groups them into `DerivedStory[]`. Hooks expose this to components. Notion "geldopc Projects" DB gets catalog entries for visibility.

**Tech Stack:** TypeScript, TanStack Query v5, GitHub REST API, Vitest (new — unit tests for pure utils), Notion MCP

## Global Constraints

- Imports: always `@/` aliases — never relative paths
- Components: `export function`, never `export default`, always `id` attribute
- Icons: `@phosphor-icons/react` with `Icon` suffix
- No arbitrary Tailwind values
- Colors: zinc palette only
- No comments unless extreme complexity
- Playwright tests must stay green throughout

---

### Task 1: Add Vitest and create `commitGrouper.ts` with TDD

This task installs vitest, writes tests for the commit grouping algorithm, then implements the utility to pass them.

**Files:**
- Create: `src/utils/commitGrouper.ts`
- Create: `src/utils/commitGrouper.test.ts`
- Modify: `package.json` (add vitest dep + script)

**Interfaces:**
- Consumes: `GitHubCommit` type from `@/utils/github`
- Produces: `DerivedStory` type, `StoryType` type, `groupCommitsIntoStories(commits: GitHubCommit[]): DerivedStory[]`

- [ ] **Step 1: Install vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Add test script to package.json**

Add to `"scripts"` in `package.json`:

```json
"test:unit": "vitest run",
"test:unit:watch": "vitest"
```

- [ ] **Step 3: Write the failing tests**

Create `src/utils/commitGrouper.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { groupCommitsIntoStories } from "@/utils/commitGrouper";
import type { GitHubCommit } from "@/utils/github";

function commit(message: string, date: string): GitHubCommit {
  return {
    sha: Math.random().toString(36).slice(2, 10),
    message,
    date,
    author: "geldopc",
    htmlUrl: "https://github.com/geldopc/test/commit/abc",
  };
}

describe("groupCommitsIntoStories", () => {
  it("groups consecutive feat commits into one story", () => {
    const commits = [
      commit("feat: add fold gutter and placeholder styles to editor theme", "2026-06-19T10:00:00Z"),
      commit("feat: enable JSON folding with Phosphor caret markers", "2026-06-19T11:00:00Z"),
      commit("feat: add Fold All / Unfold All buttons to toolbar", "2026-06-19T12:00:00Z"),
    ];

    const stories = groupCommitsIntoStories(commits);

    expect(stories).toHaveLength(1);
    expect(stories[0].type).toBe("feature");
    expect(stories[0].commits).toHaveLength(3);
    expect(stories[0].title).toBe("Add fold gutter and placeholder styles to editor theme");
    expect(stories[0].startDate).toBe("2026-06-19T10:00:00Z");
    expect(stories[0].endDate).toBe("2026-06-19T12:00:00Z");
  });

  it("creates separate stories when a fix breaks a feat group", () => {
    const commits = [
      commit("feat: add BorderGlow widget", "2026-06-19T10:00:00Z"),
      commit("fix: correct macOS fold shortcut", "2026-06-19T11:00:00Z"),
      commit("feat: add Fold All buttons to toolbar", "2026-06-19T12:00:00Z"),
    ];

    const stories = groupCommitsIntoStories(commits);

    expect(stories).toHaveLength(3);
    expect(stories[0].type).toBe("feature");
    expect(stories[0].commits).toHaveLength(1);
    expect(stories[1].type).toBe("fix");
    expect(stories[1].commits).toHaveLength(1);
    expect(stories[2].type).toBe("feature");
    expect(stories[2].commits).toHaveLength(1);
  });

  it("skips release commits", () => {
    const commits = [
      commit("feat: add JSON folding", "2026-06-19T10:00:00Z"),
      commit("chore: release v0.1.0", "2026-06-19T11:00:00Z"),
      commit("feat: add analytics", "2026-06-19T12:00:00Z"),
    ];

    const stories = groupCommitsIntoStories(commits);

    const allCommitMessages = stories.flatMap((s) => s.commits.map((c) => c.message));
    expect(allCommitMessages).not.toContain("chore: release v0.1.0");
  });

  it("groups docs commits into docs stories", () => {
    const commits = [
      commit("docs: add README", "2026-06-18T10:00:00Z"),
      commit("docs: add bilingual README with badges", "2026-06-18T11:00:00Z"),
    ];

    const stories = groupCommitsIntoStories(commits);

    expect(stories).toHaveLength(1);
    expect(stories[0].type).toBe("docs");
    expect(stories[0].commits).toHaveLength(2);
  });

  it("groups ci commits as chore stories", () => {
    const commits = [
      commit("ci: add GitHub Actions deploy", "2026-06-15T10:00:00Z"),
      commit("ci: auto-release before deploy", "2026-06-19T11:00:00Z"),
    ];

    const stories = groupCommitsIntoStories(commits);

    expect(stories).toHaveLength(2);
    expect(stories[0].type).toBe("chore");
    expect(stories[1].type).toBe("chore");
  });

  it("handles commits without conventional prefix", () => {
    const commits = [
      commit("initial commit", "2026-06-15T10:00:00Z"),
      commit("feat: add editor", "2026-06-15T11:00:00Z"),
    ];

    const stories = groupCommitsIntoStories(commits);

    expect(stories).toHaveLength(2);
    expect(stories[0].type).toBe("chore");
    expect(stories[0].title).toBe("Initial commit");
    expect(stories[1].type).toBe("feature");
  });

  it("returns empty array for empty input", () => {
    expect(groupCommitsIntoStories([])).toEqual([]);
  });

  it("sorts commits chronologically before grouping", () => {
    const commits = [
      commit("feat: second feature", "2026-06-19T12:00:00Z"),
      commit("feat: first feature", "2026-06-19T10:00:00Z"),
    ];

    const stories = groupCommitsIntoStories(commits);

    expect(stories[0].commits[0].message).toBe("feat: first feature");
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

```bash
npx vitest run src/utils/commitGrouper.test.ts
```

Expected: FAIL — `commitGrouper` module does not exist yet.

- [ ] **Step 5: Implement `commitGrouper.ts`**

Create `src/utils/commitGrouper.ts`:

```ts
import type { GitHubCommit } from "@/utils/github";

export type StoryType = "feature" | "fix" | "chore" | "docs";

export type DerivedStory = {
  title: string;
  type: StoryType;
  commits: GitHubCommit[];
  startDate: string;
  endDate: string;
};

type ParsedCommit = {
  type: StoryType;
  description: string;
  original: GitHubCommit;
  isRelease: boolean;
};

const RELEASE_PATTERN = /^chore:\s*release\s+v/i;

const TYPE_MAP: Record<string, StoryType> = {
  feat: "feature",
  fix: "fix",
  chore: "chore",
  docs: "docs",
  ci: "chore",
  refactor: "chore",
  style: "chore",
  perf: "feature",
  test: "chore",
  build: "chore",
};

function parseCommitMessage(commit: GitHubCommit): ParsedCommit {
  const isRelease = RELEASE_PATTERN.test(commit.message);
  const match = commit.message.match(/^(\w+)(?:\(.+?\))?:\s*(.+)/);

  if (!match) {
    return {
      type: "chore",
      description: commit.message.trim(),
      original: commit,
      isRelease: false,
    };
  }

  const [, prefix, description] = match;
  const type = TYPE_MAP[prefix.toLowerCase()] ?? "chore";

  return { type, description: description.trim(), original: commit, isRelease };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function canGroup(type: StoryType): boolean {
  return type === "feature" || type === "docs";
}

export function groupCommitsIntoStories(
  commits: GitHubCommit[]
): DerivedStory[] {
  if (commits.length === 0) return [];

  const sorted = [...commits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const parsed = sorted.map(parseCommitMessage);
  const stories: DerivedStory[] = [];
  let current: DerivedStory | null = null;

  for (const p of parsed) {
    if (p.isRelease) continue;

    if (current && canGroup(p.type) && current.type === p.type) {
      current.commits.push(p.original);
      current.endDate = p.original.date;
      continue;
    }

    if (current) {
      stories.push(current);
    }

    current = {
      title: capitalize(p.description),
      type: p.type,
      commits: [p.original],
      startDate: p.original.date,
      endDate: p.original.date,
    };
  }

  if (current) {
    stories.push(current);
  }

  return stories;
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npx vitest run src/utils/commitGrouper.test.ts
```

Expected: all 8 tests PASS.

- [ ] **Step 7: Run Playwright to ensure no regressions**

```bash
npx playwright test
```

Expected: all 5 existing tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/utils/commitGrouper.ts src/utils/commitGrouper.test.ts package.json package-lock.json
git commit -m "feat: add commitGrouper utility with TDD — groups conventional commits into derived stories"
```

---

### Task 2: Update `config.ts` and `github.ts` with real project data

**Files:**
- Modify: `src/data/config.ts`
- Modify: `src/utils/github.ts:83-86` (change perPage default)

**Interfaces:**
- Consumes: nothing new
- Produces: updated `ProjectConfig` type with `status` and `icon` fields, updated `projects` array with 3 entries (hub, myJsonFormatter, myXmlFormatter)

- [ ] **Step 1: Update `ProjectConfig` type and `projects` array in `config.ts`**

Replace the full content of `src/data/config.ts`:

```ts
export type ProjectStatus = "Live" | "In Progress" | "Planning";

export type ProjectConfig = {
  repo: string;
  name: string;
  description: string;
  stack: string;
  status: ProjectStatus;
  icon: string;
  demoUrl?: string;
};

export const projects: ProjectConfig[] = [
  {
    repo: "hub",
    name: "hub",
    description:
      "Portfolio dashboard — status, progresso e commits de todos os projetos.",
    stack: "Vite + React + TS + Tailwind v4 + shadcn/ui",
    status: "In Progress",
    icon: "🔵",
    demoUrl: "https://geldopc.github.io/hub",
  },
  {
    repo: "myJsonFormatter",
    name: "myJsonFormatter",
    description: "JSON formatter and minifier.",
    stack: "Vite + React + TS + CodeMirror + Tailwind",
    status: "Live",
    icon: "🟢",
    demoUrl: "https://geldopc.github.io/myJsonFormatter",
  },
  {
    repo: "myXmlFormatter",
    name: "myXmlFormatter",
    description:
      "XML formatter with syntax highlighting and shareable URLs.",
    stack: "Vite + React + TS + CodeMirror + Tailwind",
    status: "Live",
    icon: "🟢",
    demoUrl: "https://geldopc.github.io/myXmlFormatter",
  },
];

export function getProjectByRepo(repo: string): ProjectConfig | undefined {
  return projects.find((p) => p.repo === repo);
}
```

- [ ] **Step 2: Change `fetchCommits` default perPage from 10 to 100**

In `src/utils/github.ts`, change line 85:

```ts
// Before:
export async function fetchCommits(
  repo: string,
  perPage = 10
): Promise<GitHubCommit[]> {

// After:
export async function fetchCommits(
  repo: string,
  perPage = 100
): Promise<GitHubCommit[]> {
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run all tests**

```bash
npx vitest run && npx playwright test
```

Expected: all unit + E2E tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/config.ts src/utils/github.ts
git commit -m "feat: update project config with real metadata and increase commit fetch to 100"
```

---

### Task 3: Add `useProjectStories` and `useAllProjectStories` hooks

**Files:**
- Modify: `src/hooks/GitHub/index.ts`

**Interfaces:**
- Consumes: `groupCommitsIntoStories` from `@/utils/commitGrouper`, `DerivedStory` type, `fetchCommits` from `@/utils/github`, `projects` from `@/data/config`
- Produces: `useProjectStories(repo: string)` hook returning `{ data: DerivedStory[] | undefined, isLoading, isError }`, `useAllProjectStories()` hook returning `{ data: Map<string, DerivedStory[]>, isLoading, isError }`

- [ ] **Step 1: Add hooks to `src/hooks/GitHub/index.ts`**

Add to the end of the existing file:

```ts
import { groupCommitsIntoStories } from "@/utils/commitGrouper";
import type { DerivedStory } from "@/utils/commitGrouper";

export type { DerivedStory };

export function useProjectStories(repo: string) {
  const query = useGitHubCommits(repo);

  const data = query.data ? groupCommitsIntoStories(query.data) : undefined;

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useAllProjectStories() {
  const repos = projects.map((p) => p.repo);

  const queries = useQueries({
    queries: repos.map((repo) => ({
      queryKey: ["github", "commits", repo],
      queryFn: () => fetchCommits(repo),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const data = new Map<string, DerivedStory[]>();
  repos.forEach((repo, i) => {
    const commits = queries[i].data;
    if (commits) {
      data.set(repo, groupCommitsIntoStories(commits));
    }
  });

  return { data, isLoading, isError };
}
```

Note: move the new imports to the top of the file alongside existing imports.

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run all tests**

```bash
npx vitest run && npx playwright test
```

Expected: all tests pass (hooks are not yet consumed by UI, so no visible changes).

- [ ] **Step 4: Commit**

```bash
git add src/hooks/GitHub/index.ts
git commit -m "feat: add useProjectStories and useAllProjectStories hooks"
```

---

### Task 4: Create Notion catalog entries

This task uses the Notion MCP tools to create project entries and update hub status. No code changes.

**Files:** none (Notion DB changes only)

**Interfaces:**
- Consumes: Notion MCP tools (`notion-create-pages`, `notion-update-page`)
- Produces: 2 new entries in "geldopc Projects" DB (id: `f9b46a82-4664-469f-a451-dfdeec884584`), hub entry updated

- [ ] **Step 1: Create myJsonFormatter entry in Notion**

Use `notion-create-pages` on database `f9b46a82-4664-469f-a451-dfdeec884584`:
- Name: `myJsonFormatter`
- Status: `Live`
- Progress: `100`
- Type: `web app`
- Description: `JSON formatter and minifier`
- GitHub URL: `https://github.com/geldopc/myJsonFormatter`
- Demo URL: `https://geldopc.github.io/myJsonFormatter`
- Stack: `Vite + React + TS + CodeMirror + Tailwind`
- Icon concept: `JSON curly braces icon, monochrome`

- [ ] **Step 2: Create myXmlFormatter entry in Notion**

Use `notion-create-pages` on database `f9b46a82-4664-469f-a451-dfdeec884584`:
- Name: `myXmlFormatter`
- Status: `Live`
- Progress: `100`
- Type: `web app`
- Description: `XML formatter with syntax highlighting and shareable URLs`
- GitHub URL: `https://github.com/geldopc/myXmlFormatter`
- Demo URL: `https://geldopc.github.io/myXmlFormatter`
- Stack: `Vite + React + TS + CodeMirror + Tailwind`
- Icon concept: `XML angle brackets icon, monochrome`

- [ ] **Step 3: Update hub entry status**

Use `notion-update-page` on page `3861d92d-dfd0-815d-8579-db5b7bea2ce8`:
- Status: `In Progress`

- [ ] **Step 4: Verify entries in Notion**

Open the "geldopc Projects" database in browser and confirm:
- myJsonFormatter: Status "Live", Progress 100
- myXmlFormatter: Status "Live", Progress 100
- hub: Status "In Progress"
