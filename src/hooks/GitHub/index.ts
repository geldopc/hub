import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchRepos, fetchCommits } from "@/utils/github";
import type { GitHubCommit } from "@/utils/github";
import { groupCommitsIntoStories } from "@/utils/commitGrouper";
import type { DerivedStory } from "@/utils/commitGrouper";

export type RepoCommits = {
  repo: string;
  commits: GitHubCommit[];
};

export type { DerivedStory };

export function useGitHubRepos() {
  return useQuery({
    queryKey: ["github", "repos"],
    queryFn: fetchRepos,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGitHubCommits(repo: string) {
  return useQuery({
    queryKey: ["github", "commits", repo],
    queryFn: () => fetchCommits(repo),
    enabled: !!repo,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllProjectStories(repos: string[]) {
  const queries = useQueries({
    queries: repos.map((repo) => ({
      queryKey: ["github", "commits", repo],
      queryFn: () => fetchCommits(repo),
      staleTime: 1000 * 60 * 5,
      enabled: repos.length > 0,
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

export function useProjectStories(repo: string) {
  const query = useGitHubCommits(repo);

  const data = query.data ? groupCommitsIntoStories(query.data) : undefined;

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
