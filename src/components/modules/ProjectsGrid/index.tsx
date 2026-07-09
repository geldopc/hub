import { WarningIcon, FolderSimpleIcon } from "@phosphor-icons/react";
import { ProjectCard } from "@/components/widgets/ProjectCard";
import { EmptyState } from "@/components/elements/EmptyState";
import { useNotionProjects } from "@/hooks/Notion";
import type { DerivedStory } from "@/hooks/GitHub";

interface ProjectsGridProps {
  id: string;
  isLoading: boolean;
  isError: boolean;
  storiesMap: Map<string, DerivedStory[]>;
}

export function ProjectsGrid({ id, isLoading, isError, storiesMap }: ProjectsGridProps) {
  const { data: notionProjects, isLoading: notionLoading } = useNotionProjects();

  const loading = isLoading || notionLoading;

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

  if (!loading && (!notionProjects || notionProjects.length === 0)) {
    return (
      <EmptyState
        id={`${id}-empty`}
        icon={<FolderSimpleIcon weight="thin" size={40} />}
        title="Nenhum projeto encontrado"
        description="Adicione projetos ao banco myHub no Notion."
      />
    );
  }

  const placeholderCount = notionProjects?.length ?? 3;

  return (
    <div id={id} className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading
        ? Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={i}
              id={`project-card-placeholder-${i}`}
              className="rounded-xl border border-border bg-card px-5 py-4 h-36 animate-pulse"
            />
          ))
        : (notionProjects ?? []).map((project, i) => (
            <div
              key={project.repo}
              style={{ animation: `slide-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s both` }}
            >
              <ProjectCard
                id={`project-card-${project.repo}`}
                project={project}
                stories={storiesMap.get(project.repo)}
              />
            </div>
          ))}
    </div>
  );
}
