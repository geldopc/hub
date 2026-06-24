import type { ReactNode } from "react";
import { cn } from "@/utils/css";

interface EmptyStateProps {
  id: string;
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ id, icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className
      )}
    >
      <div className="text-muted-foreground/30">{icon}</div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground/60 max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
