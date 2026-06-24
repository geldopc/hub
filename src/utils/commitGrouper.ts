import type { GitHubCommit } from "@/utils/github";

export type StoryType = "feature" | "fix" | "chore" | "docs";

export type DerivedStory = {
  title: string;
  type: StoryType;
  scope?: string;
  commits: GitHubCommit[];
  startDate: string;
  endDate: string;
};

type ParsedCommit = {
  type: StoryType;
  scope: string | null;
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
  const match = commit.message.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)/);

  if (!match) {
    return {
      type: "chore",
      scope: null,
      description: commit.message.trim(),
      original: commit,
      isRelease: false,
    };
  }

  const [, prefix, scope, description] = match;
  const type = TYPE_MAP[prefix.toLowerCase()] ?? "chore";

  return {
    type,
    scope: scope?.trim() ?? null,
    description: description.trim(),
    original: commit,
    isRelease,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function canGroup(type: StoryType): boolean {
  return type === "feature" || type === "docs";
}

function primaryType(commits: ParsedCommit[]): StoryType {
  const order: StoryType[] = ["feature", "fix", "docs", "chore"];
  for (const t of order) {
    if (commits.some((c) => c.type === t)) return t;
  }
  return "chore";
}

export function groupCommitsIntoStories(
  commits: GitHubCommit[]
): DerivedStory[] {
  if (commits.length === 0) return [];

  const sorted = [...commits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const parsed = sorted.map(parseCommitMessage).filter((p) => !p.isRelease);

  // Phase 1: pull out all scoped commits and group by scope
  const scopeMap = new Map<string, ParsedCommit[]>();
  const unscoped: ParsedCommit[] = [];

  for (const p of parsed) {
    if (p.scope) {
      const group = scopeMap.get(p.scope) ?? [];
      group.push(p);
      scopeMap.set(p.scope, group);
    } else {
      unscoped.push(p);
    }
  }

  const scopedStories: DerivedStory[] = [];
  for (const [scope, group] of scopeMap) {
    const chronological = [...group].sort(
      (a, b) => new Date(a.original.date).getTime() - new Date(b.original.date).getTime()
    );
    const featCommit = chronological.find((c) => c.type === "feature");
    const title = featCommit
      ? capitalize(featCommit.description)
      : capitalize(scope);

    scopedStories.push({
      title,
      type: primaryType(chronological),
      scope,
      commits: chronological.map((c) => c.original),
      startDate: chronological[0].original.date,
      endDate: chronological[chronological.length - 1].original.date,
    });
  }

  // Phase 2: group unscoped commits by consecutive type (existing algorithm)
  const unscopedStories: DerivedStory[] = [];
  let current: DerivedStory | null = null;

  for (const p of unscoped) {
    if (current && canGroup(p.type) && current.type === p.type) {
      current.commits.push(p.original);
      current.endDate = p.original.date;
      continue;
    }
    if (current) unscopedStories.push(current);
    current = {
      title: capitalize(p.description),
      type: p.type,
      commits: [p.original],
      startDate: p.original.date,
      endDate: p.original.date,
    };
  }
  if (current) unscopedStories.push(current);

  // Merge and sort by startDate
  return [...scopedStories, ...unscopedStories].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}
