import type { DerivedStory } from "@/hooks/GitHub";
import { parseLocalDate } from "@/utils/formatDuration";

export interface ChartPoint {
  date: string;
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

  const storyDates = stories.map((s) => s.endDate);
  const allDates = [...storyDates, ...taskDates].filter(Boolean);

  const firstDate = startDate
    ? parseLocalDate(startDate)
    : parseLocalDate(allDates.reduce((a, b) => (a < b ? a : b)));

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

    const executed = stories.filter((s) => s.endDate <= isoDate).length;
    const planned = hasPlanned
      ? taskDates.filter((d) => d <= isoDate).length
      : null;

    points.push({ date: formatLabel(isoDate), executed, planned });
  }

  return points;
}
