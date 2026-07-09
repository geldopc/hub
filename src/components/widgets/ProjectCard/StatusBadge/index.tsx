import { cn } from "@/utils/css";
import type { ProjectStatus } from "@/data/config";

const DOT: Record<ProjectStatus, string> = {
  Live: "bg-green-500",
  "In Progress": "bg-amber-400",
  Planning: "bg-zinc-500",
  Paused: "bg-zinc-400",
};

const TEXT: Record<ProjectStatus, string> = {
  Live: "text-foreground font-medium",
  "In Progress": "text-foreground",
  Planning: "text-muted-foreground",
  Paused: "text-muted-foreground",
};

interface StatusBadgeProps {
  id: string;
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ id, status, className }: StatusBadgeProps) {
  return (
    <span id={id} className={cn("inline-flex items-center gap-1.5 text-xs", TEXT[status], className)}>
      <span className={cn("inline-block size-1.5 rounded-full shrink-0", DOT[status])} />
      {status}
    </span>
  );
}
