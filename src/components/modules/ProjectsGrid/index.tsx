import { WarningIcon, FolderSimpleIcon } from "@phosphor-icons/react";
import { ProjectCard } from "@/components/widgets/ProjectCard";
import { EmptyState } from "@/components/elements/EmptyState";
import { projects } from "@/data/config";
import { useNotionProjects } from "@/hooks/Notion";
import type { DerivedStory } from "@/hooks/GitHub";

interface ProjectsGridProps {
  id: string;
  isLoading: boolean;
  isError: boolean;
  storiesMap: Map<string, DerivedStory[]>;
}

export function ProjectsGrid({ id, isLoading, isError, storiesMap }: ProjectsGridProps) {
  const { data: notionData } = useNotionProjects();

  const enrichedProjects = projects.map((config) => {
    const live = notionData?.find((n) => n.repo === config.repo);
    return live ? { ...config, ...live } : config;
  });

  if (isError) {
    return (
      <EmptyState
        id={`${id}-error`}
        icon={<WarningIcon weight="thin" size={40} />}
        title="Não foi possível carregar os projetos"
        description="Verifique a conexão com o GitHub."
      />
    );
  }

  if (!isLoading && enrichedProjects.length === 0) {
    return (
      <EmptyState
        id={`${id}-empty`}
        icon={<FolderSimpleIcon weight="thin" size={40} />}
        title="Nenhum projeto encontrado"
        description="Adicione projetos ao config para visualizá-los aqui."
      />
    );
  }

  return (
    <div id={id} className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading
        ? Array.from({ length: projects.length }).map((_, i) => (
            <div
              key={i}
              id={`project-card-placeholder-${i}`}
              className="rounded-xl border border-border bg-card px-5 py-4 h-36 animate-pulse"
            />
          ))
        : enrichedProjects.map((config, i) => (
            <div
              key={config.repo}
              style={{
                animation: `slide-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s both`,
              }}
            >
              <ProjectCard
                id={`project-card-${config.repo}`}
                config={config}
                stories={storiesMap.get(config.repo)}
              />
            </div>
          ))}
    </div>
  );
}
