import * as React from "react";
import { CheckIcon, TrashIcon } from "@phosphor-icons/react";
import { PlayButton } from "@/components/elements/PlayButton";
import { Button } from "@/components/elements/Button";
import { cn } from "@/utils/css";
import type { Task } from "@/utils/tasks";

interface TaskCardProps {
  id: string;
  task: Task;
  isActive: boolean;
  onPlay: () => void;
  onPause: () => void;
  onComplete: () => void;
  onRemove: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TaskCard({
  id,
  task,
  isActive,
  onPlay,
  onPause,
  onComplete,
  onRemove,
}: TaskCardProps) {
  const isDone = task.status === "done";

  return (
    <div
      id={id}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-all duration-200",
        isActive && "border-foreground/20 bg-accent/40",
        isDone && "opacity-50"
      )}
    >
      <PlayButton
        id={`${id}-play`}
        active={isActive}
        disabled={isDone}
        onPlay={onPlay}
        onPause={onPause}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <span
          className={cn(
            "text-sm font-medium leading-snug truncate",
            isDone && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          {task.elapsedSeconds > 0 && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatTime(task.elapsedSeconds)}
            </span>
          )}
          {task.estimatedMinutes && (
            <span className="text-xs text-muted-foreground">
              / {task.estimatedMinutes}min
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isDone && (
          <Button
            id={`${id}-complete`}
            size="icon-sm"
            variant="ghost"
            onClick={onComplete}
            aria-label="Marcar como concluída"
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <CheckIcon weight="bold" className="size-3.5" />
          </Button>
        )}
        <Button
          id={`${id}-remove`}
          size="icon-sm"
          variant="ghost"
          onClick={onRemove}
          aria-label="Remover tarefa"
          className="rounded-full text-muted-foreground hover:text-destructive"
        >
          <TrashIcon weight="bold" className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
