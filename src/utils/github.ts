const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
const BASE_URL = "https://api.github.com";
const USERNAME = "geldopc";

export type GitHubRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  pushedAt: string;
};

export type GitHubCommit = {
  sha: string;
  message: string;
  date: string;
  author: string;
  htmlUrl: string;
};

async function githubFetch<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

type RawRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

type RawCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
};

export async function fetchRepos(): Promise<GitHubRepo[]> {
  const raw = await githubFetch<RawRepo[]>(
    `/users/${USERNAME}/repos?sort=pushed&per_page=100`
  );

  return raw
    .filter((r) => !r.fork && !r.archived)
    .map((r) => ({
      name: r.name,
      description: r.description,
      htmlUrl: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at,
      pushedAt: r.pushed_at,
    }));
}

export async function fetchCommits(
  repo: string,
  perPage = 10
): Promise<GitHubCommit[]> {
  const raw = await githubFetch<RawCommit[]>(
    `/repos/${USERNAME}/${repo}/commits?per_page=${perPage}`
  );

  return raw.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    date: c.commit.author.date,
    author: c.commit.author.name,
    htmlUrl: c.html_url,
  }));
}
