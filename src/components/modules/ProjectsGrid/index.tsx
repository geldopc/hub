import * as React from "react";
import { WarningIcon } from "@phosphor-icons/react";
import { ProjectCard } from "@/components/widgets/ProjectCard";
import { projects } from "@/data/config";
import type { DerivedStory } from "@/hooks/GitHub";

interface ProjectsGridProps {
  id: string;
  isLoading: boolean;
  isError: boolean;
  storiesMap: Map<string, DerivedStory[]>;
}

export function ProjectsGrid({ id, isLoading, isError, storiesMap }: ProjectsGridProps) {
  if (isError) {
    return (
      <div id={id} className="w-full flex flex-col items-center gap-2 py-12 text-muted-foreground">
        <WarningIcon weight="thin" size={32} className="opacity-40" />
        <p className="text-sm">Não foi possível carregar os projetos.</p>
      </div>
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
        : projects.map((config, i) => (
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
