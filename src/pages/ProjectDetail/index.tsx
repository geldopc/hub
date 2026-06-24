import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowSquareOutIcon, CalendarBlankIcon, GithubLogoIcon, TimerIcon } from "@phosphor-icons/react";
import { Button } from "@/components/elements/Button";
import { StatusBadge } from "@/components/widgets/ProjectCard/StatusBadge";
import { ProgressBar } from "@/components/widgets/ProjectCard/ProgressBar";
import { StackChip } from "@/components/widgets/ProjectCard/StackChip";
import { StoriesTimeline } from "@/components/modules/StoriesTimeline";
import { TypeBreakdown } from "@/components/widgets/TypeBreakdown";
import { ExecutionChart } from "@/components/widgets/ExecutionChart";
import { getProjectByRepo } from "@/data/config";
import { useProjectStories } from "@/hooks/GitHub";
import { useNotionProjects, useNotionTasks } from "@/hooks/Notion";
import { formatDuration, formatLocalDate } from "@/utils/formatDuration";
import { buildExecutionChart } from "@/utils/chartData";

export function ProjectDetail() {
  const { repo } = useParams<{ repo: string }>();
  const config = repo ? getProjectByRepo(repo) : undefined;
  const { data: stories, isLoading, isError } = useProjectStories(repo ?? "");
  const { data: notionData } = useNotionProjects();
  const { data: notionTasks } = useNotionTasks(repo ?? "");
  const notionProject = notionData?.find((n) => n.repo === repo);

  const startDate = notionProject?.startDate ?? config?.startDate;
  const endDate = notionProject?.endDate ?? config?.endDate;
  const duration = config ? formatDuration(startDate, endDate, config.status) : null;
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  const taskDates = (notionTasks ?? [])
    .filter((t) => t.createdDate)
    .map((t) => t.createdDate as string);

  const chartData = stories
    ? buildExecutionChart(stories, taskDates, startDate, endDate)
    : [];

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
  const storyCount = stories?.length ?? 0;

  return (
    <div id="project-detail" className="flex flex-col gap-8 py-8 px-4 md:px-8 max-w-4xl mx-auto">
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
        <div className="flex items-start justify-between gap-4">
          <StatusBadge id="detail-status" status={config.status} />
          {storyCount > 0 && (
            <span id="detail-story-count" className="text-xs text-muted-foreground tabular-nums">
              {storyCount} stories
            </span>
          )}
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="font-heading text-2xl font-bold">{config.name}</h1>
            <span className="text-sm text-muted-foreground">{config.type}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{config.description}</p>
        </div>

        <ProgressBar id="detail-progress" value={config.progress} />

        {(startDate || duration) && (
          <div id="detail-duration-stats" className="flex items-center gap-4 text-xs text-muted-foreground">
            {startDate && (
              <span className="flex items-center gap-1.5">
                <CalendarBlankIcon weight="bold" className="size-3.5 shrink-0" />
                {formatLocalDate(startDate)}
                {endDate && (
                  <>
                    <span className="text-muted-foreground/40 mx-0.5">→</span>
                    {formatLocalDate(endDate)}
                  </>
                )}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5">
                <TimerIcon weight="bold" className="size-3.5 shrink-0" />
                {duration}
              </span>
            )}
          </div>
        )}

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

      {(stories && stories.length > 0 || chartData.length > 0) && (
        <div id="detail-analytics" className="flex flex-col gap-6 border-t border-border pt-6">
          <ExecutionChart
            id="detail-execution-chart"
            data={chartData}
            hasPlanned={taskDates.length > 0}
            onDateSelect={setSelectedDate}
          />
          {stories && stories.length > 0 && (
            <TypeBreakdown id="detail-type-breakdown" stories={stories} />
          )}
          {selectedDate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Commits de {formatLocalDate(selectedDate)}</span>
              <button
                className="underline hover:text-foreground transition-colors"
                onClick={() => setSelectedDate(null)}
              >
                ver todos
              </button>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-border" />

      <StoriesTimeline
        id="stories-timeline"
        stories={stories}
        isLoading={isLoading}
        isError={isError}
        repo={repo ?? ""}
        filterDate={selectedDate}
      />
    </div>
  );
}
