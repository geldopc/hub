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
