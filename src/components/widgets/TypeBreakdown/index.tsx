import type { DerivedStory, StoryType } from "@/hooks/GitHub";

const TYPE_ORDER: StoryType[] = ["feature", "fix", "chore", "docs"];

interface TypeBreakdownProps {
  id: string;
  stories: DerivedStory[];
}

export function TypeBreakdown({ id, stories }: TypeBreakdownProps) {
  const total = stories.length;
  if (total === 0) return null;

  const counts = TYPE_ORDER.map((type) => ({
    type,
    count: stories.filter((s) => s.type === type).length,
  })).filter((t) => t.count > 0);

  return (
    <div id={id} className="flex flex-col gap-2">
      {counts.map(({ type, count }) => (
        <div key={type} className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-xs text-muted-foreground">{type}</span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full"
              style={{ width: `${(count / total) * 100}%`, opacity: type === "feature" ? 1 : type === "fix" ? 0.55 : 0.3 }}
            />
          </div>
          <span className="w-4 text-right text-xs text-muted-foreground tabular-nums">{count}</span>
        </div>
      ))}
    </div>
  );
}
