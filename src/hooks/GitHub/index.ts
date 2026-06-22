import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchRepos, fetchCommits } from "@/utils/github";
import type { GitHubCommit } from "@/utils/github";
import { projects } from "@/data/config";

export type RepoCommits = {
  repo: string;
  commits: GitHubCommit[];
};

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

export function useAllRepoCommits(perPage = 10) {
  const repos = projects.map((p) => p.repo);

  const queries = useQueries({
    queries: repos.map((repo) => ({
      queryKey: ["github", "commits", repo],
      queryFn: () => fetchCommits(repo, perPage),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const data: RepoCommits[] = repos
    .map((repo, i) => ({
      repo,
      commits: queries[i].data ?? [],
    }))
    .filter((r) => r.commits.length > 0);

  return { data, isLoading, isError, queries };
}
