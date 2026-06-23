import * as React from "react";
import { CirclesThreeIcon } from "@phosphor-icons/react";
import { TaskPlanner } from "@/components/modules/TaskPlanner";
import { ProjectsGrid } from "@/components/modules/ProjectsGrid";
import { useAllProjectStories } from "@/hooks/GitHub";

export function Home() {
  const { data: storiesMap, isLoading, isError } = useAllProjectStories();

  return (
    <div id="home" className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none fixed top-1/3 left-1/2 w-96 h-96 rounded-full bg-foreground opacity-5 blur-3xl -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">
        <div
          className="text-center"
          style={{ animation: "slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <CirclesThreeIcon weight="thin" className="mx-auto mb-4 opacity-40" size={40} />
          <h1 className="font-heading text-3xl font-bold mb-2">hub</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Portfolio dashboard — status, progresso e commits de todos os projetos.
          </p>
        </div>

        <ProjectsGrid
          id="projects-grid"
          isLoading={isLoading}
          isError={isError}
          storiesMap={storiesMap}
        />

        <TaskPlanner id="task-planner" />
      </div>
    </div>
  );
}
