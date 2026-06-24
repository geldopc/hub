import { CheckIcon, TimerIcon } from "@phosphor-icons/react";
import type { ProjectStatus } from "@/data/config";
import { formatDuration } from "@/utils/formatDuration";

interface DurationBadgeProps {
  id: string;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  status: ProjectStatus;
}

export function DurationBadge({ id, startDate, endDate, status }: DurationBadgeProps) {
  const label = formatDuration(startDate, endDate, status);
  if (!label) return null;

  const done = status === "Live" && !!endDate;

  return (
    <span
      id={id}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 tabular-nums"
    >
      {done ? (
        <CheckIcon weight="bold" className="size-3 shrink-0" />
      ) : (
        <TimerIcon weight="bold" className="size-3 shrink-0" />
      )}
      {label}
    </span>
  );
}
