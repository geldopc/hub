export type ProjectStatus = "Live" | "In Progress" | "Planning" | "Paused";
export type ProjectType = "web app" | "api" | "saas" | "library" | "cli" | "game" | "mobile app" | "other";

export type ProjectConfig = {
  repo: string;
  name: string;
  description: string;
  stack: string;
  status: ProjectStatus;
  type: ProjectType;
  progress: number;
  icon: string;
  demoUrl?: string;
  startDate?: string | null;
  endDate?: string | null;
};

export const projects: ProjectConfig[] = [
  {
    repo: "hub",
    name: "hub",
    description:
      "Portfolio dashboard — status, progresso e commits de todos os projetos.",
    stack: "Vite + React + TS + Tailwind v4 + shadcn/ui",
    status: "In Progress",
    type: "web app",
    progress: 0,
    icon: "🔵",
    demoUrl: "https://geldopc.github.io/hub",
    startDate: "2026-06-10",
  },
  {
    repo: "myJsonFormatter",
    name: "myJsonFormatter",
    description: "JSON formatter and minifier.",
    stack: "Vite + React + TS + CodeMirror + Tailwind",
    status: "Live",
    type: "web app",
    progress: 100,
    icon: "🟢",
    demoUrl: "https://geldopc.github.io/myJsonFormatter",
    startDate: "2026-05-20",
    endDate: "2026-06-01",
  },
  {
    repo: "myXmlFormatter",
    name: "myXmlFormatter",
    description:
      "XML formatter with syntax highlighting and shareable URLs.",
    stack: "Vite + React + TS + CodeMirror + Tailwind",
    status: "Live",
    type: "web app",
    progress: 100,
    icon: "🟢",
    demoUrl: "https://geldopc.github.io/myXmlFormatter",
    startDate: "2026-06-01",
    endDate: "2026-06-18",
  },
];

export function getProjectByRepo(repo: string): ProjectConfig | undefined {
  return projects.find((p) => p.repo === repo);
}
