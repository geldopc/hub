import { WarningIcon } from "@phosphor-icons/react";
import type { DerivedStory } from "@/utils/commitGrouper";
import type { StoryType } from "@/utils/commitGrouper";
import { StoryRow } from "@/components/widgets/StoryRow";

const TYPE_LABELS: Record<StoryType, string> = {
  feature: "Features",
  fix: "Fixes",
  chore: "Chores",
  docs: "Docs",
};

const TYPE_ORDER: StoryType[] = ["feature", "fix", "docs", "chore"];

interface StoriesTimelineProps {
  id: string;
  stories?: DerivedStory[];
  isLoading: boolean;
  isError: boolean;
  repo: string;
}

export function StoriesTimeline({ id, stories, isLoading, isError, repo }: StoriesTimelineProps) {
  if (isError) {
    return (
      <div id={id} className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
        <WarningIcon weight="thin" size={32} className="opacity-40" />
        <p className="text-sm">Não foi possível carregar os dados do GitHub.</p>
      </div>
    );
  }

  if (isLoading || !stories) {
    return (
      <div id={id} className="flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-24 rounded bg-muted animate-pulse mb-1" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-10 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const grouped = TYPE_ORDER.reduce((acc, type) => {
    const group = stories.filter((s) => s.type === type);
    if (group.length > 0) acc.set(type, group);
    return acc;
  }, new Map<StoryType, DerivedStory[]>());

  if (grouped.size === 0) {
    return (
      <div id={id} className="py-12 text-center text-sm text-muted-foreground">
        Nenhuma story encontrada para <code className="font-mono">{repo}</code>.
      </div>
    );
  }

  return (
    <div id={id} className="flex flex-col gap-8">
      {TYPE_ORDER.filter((t) => grouped.has(t)).map((type) => (
        <section key={type} id={`${id}-${type}`}>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            {TYPE_LABELS[type]} ({grouped.get(type)!.length})
          </h2>
          <div className="flex flex-col divide-y divide-border border border-border rounded-xl overflow-hidden">
            {grouped.get(type)!.map((story, i) => (
              <StoryRow key={i} id={`story-${type}-${i}`} story={story} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
