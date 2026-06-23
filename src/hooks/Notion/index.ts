import { useQuery } from "@tanstack/react-query";
import type { ProjectStatus, ProjectType } from "@/data/config";

export type NotionProjectData = {
  repo: string;
  status: ProjectStatus;
  progress: number;
  type: ProjectType;
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
