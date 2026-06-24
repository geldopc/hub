import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowSquareOutIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Button } from "@/components/elements/Button";
import { StatusBadge } from "@/components/widgets/ProjectCard/StatusBadge";
import { ProgressBar } from "@/components/widgets/ProjectCard/ProgressBar";
import { StackChip } from "@/components/widgets/ProjectCard/StackChip";
import { StoriesTimeline } from "@/components/modules/StoriesTimeline";
import { getProjectByRepo } from "@/data/config";
import { useProjectStories } from "@/hooks/GitHub";

export function ProjectDetail() {
  const { repo } = useParams<{ repo: string }>();
  const config = repo ? getProjectByRepo(repo) : undefined;
  const { data: stories, isLoading, isError } = useProjectStories(repo ?? "");

  if (!config) {
    return (
      <div id="project-detail-not-found" className="flex flex-col items-center gap-4 py-24 text-muted-foreground">
        <p className="text-sm">Projeto não encontrado.</p>
        <Button id="not-found-back" variant="ghost" size="sm" asChild>
          <Link to="/">← Voltar</Link>
        </Button>
      </div>
    );
  }

  const chips = config.stack.split(" + ");
  const githubUrl = `https://github.com/geldopc/${config.repo}`;

  return (
    <div id="project-detail" className="flex flex-col gap-8 py-6">
      <Button
        id="detail-back"
        variant="ghost"
        size="sm"
        asChild
        className="self-start -ml-2 text-muted-foreground hover:text-foreground"
      >
        <Link to="/">
          <ArrowLeftIcon weight="bold" className="size-3.5 mr-1.5" />
          hub
        </Link>
      </Button>

      <div className="flex flex-col gap-3">
        <StatusBadge id="detail-status" status={config.status} />

        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="font-heading text-2xl font-bold">{config.name}</h1>
            <span className="text-sm text-muted-foreground">{config.type}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{config.description}</p>
        </div>

        <ProgressBar id="detail-progress" value={config.progress} />

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <StackChip key={chip} id={`detail-chip-${chip}`} label={chip} />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {config.demoUrl && (
              <Button
                id="detail-demo"
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
              id="detail-github"
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

      <div className="border-t border-border" />

      <StoriesTimeline
        id="stories-timeline"
        stories={stories}
        isLoading={isLoading}
        isError={isError}
        repo={repo ?? ""}
      />
    </div>
  );
}
