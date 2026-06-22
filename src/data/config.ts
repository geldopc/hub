export type ProjectConfig = {
  repo: string;
  name: string;
  description: string;
  stack: string;
  demoUrl?: string;
};

export const projects: ProjectConfig[] = [
  {
    repo: "hub",
    name: "hub",
    description:
      "Portfolio dashboard — status, progresso e commits de todos os projetos.",
    stack: "Vite + React + TS + Tailwind v4 + shadcn/ui",
    demoUrl: "https://geldopc.github.io/hub",
  },
  {
    repo: "me",
    name: "me",
    description: "Site pessoal / portfólio.",
    stack: "TypeScript",
  },
  {
    repo: "myJsonFormatter",
    name: "myJsonFormatter",
    description: "Formatador e validador de JSON.",
    stack: "TypeScript",
  },
  {
    repo: "myXmlFormatter",
    name: "myXmlFormatter",
    description: "Formatador e validador de XML.",
    stack: "TypeScript",
  },
];

export function getProjectByRepo(repo: string): ProjectConfig | undefined {
  return projects.find((p) => p.repo === repo);
}
