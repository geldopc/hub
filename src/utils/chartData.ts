import type { DerivedStory } from "@/hooks/GitHub";
import { parseLocalDate } from "@/utils/formatDuration";

export interface ChartPoint {
  date: string;
  isoDate: string;
  executed: number;
  planned: number | null;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatLabel(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${parseInt(day)}/${parseInt(month)}`;
}

export function buildExecutionChart(
  stories: DerivedStory[],
  taskDates: string[],
  startDate: string | null | undefined,
  endDate: string | null | undefined
): ChartPoint[] {
  if (!stories.length && !startDate) return [];

  const storyDates = stories.map((s) => s.endDate?.slice(0, 10)).filter(Boolean) as string[];
  const allActivityDates = [...storyDates, ...taskDates].filter(Boolean);

  const configStart = startDate ? parseLocalDate(startDate) : null;

  const firstActivityDate = allActivityDates.length
    ? parseLocalDate(allActivityDates.reduce((a, b) => (a < b ? a : b)))
    : configStart;

  // Start from configStart OR 3 days before first activity — whichever is later.
  // This prevents showing a long empty leading section when all commits cluster at the end.
  const activityMinus3 = firstActivityDate ? addDays(firstActivityDate, -3) : null;
  const firstDate =
    configStart && activityMinus3 && configStart >= activityMinus3
      ? configStart
      : activityMinus3 ?? configStart ?? parseLocalDate(allActivityDates[0]);

  const lastDate = endDate
    ? parseLocalDate(endDate)
    : new Date();

  const totalDays = Math.max(
    1,
    Math.round((lastDate.getTime() - firstDate.getTime()) / 86_400_000)
  );

  const hasPlanned = taskDates.length > 0;

  const points: ChartPoint[] = [];
  for (let i = 0; i <= totalDays; i++) {
    const current = addDays(firstDate, i);
    const isoDate = toISO(current);

    const executed = stories.filter((s) => (s.endDate?.slice(0, 10) ?? "") <= isoDate).length;
    const planned = hasPlanned
      ? taskDates.filter((d) => d <= isoDate).length
      : null;

    points.push({ date: formatLabel(isoDate), isoDate, executed, planned });
  }

  return points;
}
