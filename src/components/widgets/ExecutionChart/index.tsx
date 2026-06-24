import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ChartPoint } from "@/utils/chartData";

const chartConfig = {
  planned: { label: "Planejado" },
  executed: { label: "Executado" },
} satisfies ChartConfig;

interface ExecutionChartProps {
  id: string;
  data: ChartPoint[];
  hasPlanned: boolean;
}

export function ExecutionChart({ id, data, hasPlanned }: ExecutionChartProps) {
  if (!data.length) return null;

  const interval = Math.max(0, Math.floor(data.length / 6) - 1);

  return (
    <div id={id} className="w-full">
      <div className="flex items-center gap-4 mb-3">
        {hasPlanned && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block w-4 h-px border-t border-dashed border-muted-foreground/50" />
            planejado
          </span>
        )}
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block w-4 h-px bg-foreground/70" />
          executado
        </span>
      </div>
      <ChartContainer id={id} config={chartConfig} className="h-36 w-full">
        <AreaChart data={data} margin={{ top: 8, right: 0, left: -28, bottom: 0 }}>
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="3 4"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
            interval={interval}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }} />
          {hasPlanned && (
            <Area
              type="monotone"
              dataKey="planned"
              stroke="hsl(var(--muted-foreground) / 0.4)"
              fill="hsl(var(--muted-foreground) / 0.08)"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 3, stroke: "hsl(var(--background))", fill: "hsl(var(--muted-foreground))" }}
              connectNulls
            />
          )}
          <Area
            type="monotone"
            dataKey="executed"
            stroke="hsl(var(--foreground) / 0.7)"
            fill="hsl(var(--foreground) / 0.08)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, stroke: "hsl(var(--background))", fill: "hsl(var(--foreground))" }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
