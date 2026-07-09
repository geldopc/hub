import { Link } from "react-router-dom";
import { ArrowSquareOutIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Button } from "@/components/elements/Button";
import { TasksRing } from "@/components/elements/TasksRing";
import { StatusBadge } from "@/components/widgets/ProjectCard/StatusBadge";
import { StackChip } from "@/components/widgets/ProjectCard/StackChip";
import { ProgressBar } from "@/components/widgets/ProjectCard/ProgressBar";
import { DurationBadge } from "@/components/widgets/ProjectCard/DurationBadge";
import type { NotionProjectData } from "@/hooks/Notion";
import type { DerivedStory } from "@/hooks/GitHub";

interface ProjectCardProps {
  id: string;
  project: NotionProjectData;
  stories?: DerivedStory[];
}

export function ProjectCard({ id, project, stories }: ProjectCardProps) {
  const chips = project.stack ? project.stack.split(" + ") : [];
  const storyCount = stories?.length;
  const githubUrl = `https://github.com/geldopc/${project.repo}`;

  return (
    <div
      id={id}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-accent/40"
    >
      <div className="flex items-center justify-between gap-2">
        <StatusBadge id={`${id}-status`} status={project.status} />
        <DurationBadge
          id={`${id}-duration`}
          startDate={project.startDate}
          endDate={project.endDate}
          status={project.status}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Link
          to={`/project/${project.repo}`}
          className="font-heading text-base font-bold leading-tight hover:underline underline-offset-2"
        >
          {project.name}
        </Link>
        <p className="text-sm text-muted-foreground leading-snug">
          {project.description}
        </p>
      </div>

      <ProgressBar id={`${id}-progress`} value={project.progress} />

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <StackChip key={chip} id={`${id}-chip-${chip}`} label={chip} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        {project.tasksTotal > 0 ? (
          <TasksRing id={`${id}-tasks`} total={project.tasksTotal} done={project.tasksDone} />
        ) : (
          <span className="text-xs text-muted-foreground tabular-nums">
            {storyCount !== undefined ? `${storyCount} stories` : "—"}
          </span>
        )}
        <div className="flex items-center gap-1">
          {project.demoUrl && (
            <Button id={`${id}-demo`} size="icon-sm" variant="ghost" asChild aria-label="Open demo" className="rounded-full text-muted-foreground hover:text-foreground">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ArrowSquareOutIcon weight="bold" className="size-3.5" />
              </a>
            </Button>
          )}
          <Button id={`${id}-github`} size="icon-sm" variant="ghost" asChild aria-label="Open GitHub repo" className="rounded-full text-muted-foreground hover:text-foreground">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <GithubLogoIcon weight="bold" className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
