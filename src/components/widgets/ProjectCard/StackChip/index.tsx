import * as React from "react";

interface StackChipProps {
  id: string;
  label: string;
}

export function StackChip({ id, label }: StackChipProps) {
  return (
    <span
      id={id}
      className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
    >
      {label}
    </span>
  );
}
