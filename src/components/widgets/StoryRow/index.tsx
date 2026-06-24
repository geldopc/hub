import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import type { DerivedStory } from "@/utils/commitGrouper";
import { cn } from "@/utils/css";

interface StoryRowProps {
  id: string;
  story: DerivedStory;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function StoryRow({ id, story }: StoryRowProps) {
  const [open, setOpen] = useState(false);
  const commitCount = story.commits.length;

  return (
    <div id={id} className="bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/40 transition-colors"
        aria-expanded={open}
      >
        <CaretDownIcon
          weight="bold"
          className={cn(
            "size-3 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
        <span className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium leading-snug truncate">{story.title}</span>
          {story.scope && (
            <span className="shrink-0 text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
              {story.scope}
            </span>
          )}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
          {commitCount} {commitCount === 1 ? "commit" : "commits"} · {formatDate(story.startDate)}
        </span>
      </button>

      {open && (
        <ul className="border-t border-border bg-muted/30 px-4 py-2 flex flex-col gap-1">
          {story.commits.map((commit) => (
            <li key={commit.sha} className="flex items-start gap-2 py-1">
              <a
                href={commit.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
              >
                {commit.sha.slice(0, 7)}
              </a>
              <span className="text-xs text-muted-foreground leading-snug">{commit.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
