const RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TasksRingProps {
  id: string;
  total: number;
  done: number;
}

export function TasksRing({ id, total, done }: TasksRingProps) {
  if (total === 0) return null;

  const pct = Math.min(done / total, 1);
  const doneArc = pct * CIRCUMFERENCE;

  return (
    <div id={id} className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 36 36" className="shrink-0">
        <circle
          cx="18" cy="18" r={RADIUS}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3.5"
          strokeOpacity="0.3"
        />
        {done > 0 && (
          <circle
            cx="18" cy="18" r={RADIUS}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3.5"
            strokeDasharray={`${doneArc} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        )}
        <text
          x="18" y="18"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="7"
          fill="currentColor"
          fontFamily="inherit"
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <span className="text-xs text-muted-foreground tabular-nums">
        {done}/{total} tasks
      </span>
    </div>
  );
}
