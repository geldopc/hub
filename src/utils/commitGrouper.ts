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
