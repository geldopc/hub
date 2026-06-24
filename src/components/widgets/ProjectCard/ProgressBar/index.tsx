interface ProgressBarProps {
  id: string;
  value: number;
}

export function ProgressBar({ id, value }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div id={id} className="w-full h-px bg-border rounded-full overflow-hidden">
      <div
        className="h-full bg-foreground rounded-full transition-all duration-500"
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
