import { Link } from "react-router-dom";
import { ArrowSquareOutIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Button } from "@/components/elements/Button";
import { StatusBadge } from "@/components/widgets/ProjectCard/StatusBadge";
import { StackChip } from "@/components/widgets/ProjectCard/StackChip";
import { ProgressBar } from "@/components/widgets/ProjectCard/ProgressBar";
import type { ProjectConfig } from "@/data/config";
import type { DerivedStory } from "@/hooks/GitHub";

interface ProjectCardProps {
  id: string;
  config: ProjectConfig;
  stories?: DerivedStory[];
}

export function ProjectCard({ id, config, stories }: ProjectCardProps) {
  const chips = config.stack.split(" + ");
  const storyCount = stories?.length;
  const githubUrl = `https://github.com/geldopc/${config.repo}`;

  return (
    <div
      id={id}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-accent/40"
    >
      <StatusBadge id={`${id}-status`} status={config.status} />

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <Link
            to={`/project/${config.repo}`}
            className="font-heading text-base font-bold leading-tight hover:underline underline-offset-2"
          >
            {config.name}
          </Link>
          <span className="text-xs text-muted-foreground">{config.type}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-snug">
          {config.description}
        </p>
      </div>

      <ProgressBar id={`${id}-progress`} value={config.progress} />

      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <StackChip key={chip} id={`${id}-chip-${chip}`} label={chip} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-xs text-muted-foreground tabular-nums">
          {storyCount !== undefined ? `${storyCount} stories` : "—"}
        </span>

        <div className="flex items-center gap-1">
          {config.demoUrl && (
            <Button
              id={`${id}-demo`}
              size="icon-sm"
              variant="ghost"
              asChild
              aria-label="Open demo"
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <a href={config.demoUrl} target="_blank" rel="noopener noreferrer">
                <ArrowSquareOutIcon weight="bold" className="size-3.5" />
              </a>
            </Button>
          )}
          <Button
            id={`${id}-github`}
            size="icon-sm"
            variant="ghost"
            asChild
            aria-label="Open GitHub repo"
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <GithubLogoIcon weight="bold" className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
