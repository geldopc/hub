import type { ProjectStatus } from "@/data/config";

export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatLocalDate(isoDate: string): string {
  return parseLocalDate(isoDate).toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export function formatDuration(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  status: ProjectStatus
): string | null {
  if (!startDate) return null;

  const start = parseLocalDate(startDate);
  const end = endDate ? parseLocalDate(endDate) : new Date();

  const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));

  if (status === "Live" && endDate) {
    return `em ${diffDays} dia${diffDays !== 1 ? "s" : ""}`;
  }

  return `há ${diffDays} dia${diffDays !== 1 ? "s" : ""}`;
}
