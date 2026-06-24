import { useQuery } from "@tanstack/react-query";
import type { ProjectStatus, ProjectType } from "@/data/config";

export type NotionProjectData = {
  repo: string;
  pageId: string;
  status: ProjectStatus;
  progress: number;
  type: ProjectType;
  startDate: string | null;
  endDate: string | null;
};

async function fetchNotionProjects(): Promise<NotionProjectData[]> {
  const base = import.meta.env.VITE_API_URL;
  if (!base) return [];

  const res = await fetch(`${base}/api/projects`);
  if (!res.ok) throw new Error("Failed to fetch Notion projects");
  return res.json();
}

export function useNotionProjects() {
  return useQuery({
    queryKey: ["notion", "projects"],
    queryFn: fetchNotionProjects,
    staleTime: 1000 * 60 * 5,
    enabled: !!import.meta.env.VITE_API_URL,
  });
}

export type NotionTask = {
  id: string;
  title: string | null;
  createdDate: string | null;
  status: string | null;
  epic: string | null;
};

async function fetchNotionTasks(repo: string): Promise<NotionTask[]> {
  const base = import.meta.env.VITE_API_URL;
  if (!base) return [];

  const res = await fetch(`${base}/api/tasks?repo=${encodeURIComponent(repo)}`);
  if (!res.ok) throw new Error("Failed to fetch Notion tasks");
  return res.json();
}

export function useNotionTasks(repo: string) {
  return useQuery({
    queryKey: ["notion", "tasks", repo],
    queryFn: () => fetchNotionTasks(repo),
    staleTime: 1000 * 60 * 5,
    enabled: !!import.meta.env.VITE_API_URL && !!repo,
  });
}
