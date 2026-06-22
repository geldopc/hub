# hub — Project Context

## What this is
Portfolio dashboard showing status, progress, and GitHub commit data for all of Geldo's projects.
Live at: https://geldopc.github.io/hub
Audience: Brazilian and international recruiters evaluating development process and consistency.

## Stack
- Vite 6 + React 19 + TypeScript + Tailwind v4 + shadcn/ui (zinc, dark default)
- TanStack Query v5 — all async data fetching
- Notion API — source of truth for project status and progress
- GitHub REST API — commit data per repo
- Playwright — E2E testing
- GitHub Pages — deploy via `/hub/` base path

## Architecture Decisions
1. **Notion as data layer**: Query `geldopc Projects` database for project list, status, progress
2. **GitHub API**: Direct client fetch — token in `VITE_GITHUB_TOKEN` env var
3. **Notion token**: Must be server-side — use Vercel Edge Function for prod; `NOTION_TOKEN` env var for scripts
4. **Project config**: `src/data/config.ts` maps GitHub repo names → display metadata (demo URL, stack)
5. **Routing**: `basename: "/hub"` for GitHub Pages compatibility
6. **Atomic design**: elements → widgets → modules → templates → pages

## Important IDs (Notion)
- `geldopc Projects` database: `f9b46a82-4664-469f-a451-dfdeec884584`
- `hub Backlog` database: `bbc22d27-c822-41d3-8a7c-8d8b9d4c2476`

## Coding Conventions
Follow all rules from the parent `/CLAUDE.md` (project root), plus:
- Imports: always `@/` aliases — never relative paths
- Components: `export function`, never `export default`, always `id` attribute
- Icons: `@phosphor-icons/react` with `Icon` suffix (e.g. `ArrowRightIcon`)
- No arbitrary Tailwind values (no `w-[123px]`)
- Colors: zinc palette only — DO NOT add new colors
- No comments unless extreme complexity

---

## Dev Loop — ALWAYS follow this after implementing any story

After finishing implementation of a story, run this sequence without waiting for the user to ask:

### Step 1 — Start dev server (if not running)
```bash
npm run dev &
sleep 3
```

### Step 2 — Run Playwright tests
```bash
npx playwright test
```

If tests fail: fix the issues and re-run. Do NOT proceed to Step 3 until tests pass.

### Step 3 — Mark story as Done in Notion
```bash
node scripts/notion.js done "[exact story title]"
```

### Step 4 — Get next story
```bash
node scripts/notion.js next
```

### Step 5 — Ask the user
Show:
```
✅ Story done: [title]
📋 Next story: [next story title] ([size] — [priority])
   Epic: [epic name]

Start next story? (yes / skip)
```

Wait for the user's answer before proceeding.

---

## Environment Variables
Required in `.env.local`:
```
VITE_GITHUB_TOKEN=ghp_...
NOTION_TOKEN=secret_...
VITE_NOTION_DB_ID=f9b46a82-4664-469f-a451-dfdeec884584
```

## Running Tests
```bash
npx playwright test          # all tests
npx playwright test --ui     # interactive mode
npx playwright show-report   # last report
```
