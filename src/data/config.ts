export type ProjectStatus = "Live" | "In Progress" | "Planning";

export type ProjectConfig = {
  repo: string;
  name: string;
  description: string;
  stack: string;
  status: ProjectStatus;
  icon: string;
  demoUrl?: string;
};

export const projects: ProjectConfig[] = [
  {
    repo: "hub",
    name: "hub",
    description:
      "Portfolio dashboard — status, progresso e commits de todos os projetos.",
    stack: "Vite + React + TS + Tailwind v4 + shadcn/ui",
    status: "In Progress",
    icon: "🔵",
    demoUrl: "https://geldopc.github.io/hub",
  },
  {
    repo: "myJsonFormatter",
    name: "myJsonFormatter",
    description: "JSON formatter and minifier.",
    stack: "Vite + React + TS + CodeMirror + Tailwind",
    status: "Live",
    icon: "🟢",
    demoUrl: "https://geldopc.github.io/myJsonFormatter",
  },
  {
    repo: "myXmlFormatter",
    name: "myXmlFormatter",
    description:
      "XML formatter with syntax highlighting and shareable URLs.",
    stack: "Vite + React + TS + CodeMirror + Tailwind",
    status: "Live",
    icon: "🟢",
    demoUrl: "https://geldopc.github.io/myXmlFormatter",
  },
];

export function getProjectByRepo(repo: string): ProjectConfig | undefined {
  return projects.find((p) => p.repo === repo);
}
