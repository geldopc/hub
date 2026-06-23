import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/css";
import type { ProjectStatus } from "@/data/config";

const statusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        Live: "bg-muted text-foreground",
        "In Progress": "border border-border bg-transparent text-foreground",
        Planning: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "Planning",
    },
  }
);

interface StatusBadgeProps {
  id: string;
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ id, status, className }: StatusBadgeProps) {
  return (
    <span id={id} className={cn(statusVariants({ status }), className)}>
      {status}
    </span>
  );
}
