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
  planned: { label: "Planejado", color: "var(--muted-foreground)" },
  executed: { label: "Executado", color: "var(--foreground)" },
} satisfies ChartConfig;

interface ExecutionChartProps {
  id: string;
  data: ChartPoint[];
  hasPlanned: boolean;
  onDateSelect?: (date: string | null) => void;
}

export function ExecutionChart({ id, data, hasPlanned, onDateSelect }: ExecutionChartProps) {
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
      <ChartContainer config={chartConfig} className="h-48 w-full">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 0, left: -28, bottom: 0 }}
          onClick={(payload) => {
            if (!onDateSelect) return;
            const point = payload?.activePayload?.[0]?.payload as { isoDate?: string } | undefined;
            onDateSelect(point?.isoDate ?? null);
          }}
          style={onDateSelect ? { cursor: "pointer" } : undefined}
        >
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
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
          />
          {hasPlanned && (
            <Area
              type="monotone"
              dataKey="planned"
              stroke="var(--color-planned)"
              strokeWidth={2}
              strokeDasharray="5 3"
              strokeOpacity={0.5}
              fill="var(--color-planned)"
              fillOpacity={0.08}
              dot={false}
              activeDot={{ r: 3 }}
              connectNulls
              isAnimationActive={false}
            />
          )}
          <Area
            type="monotone"
            dataKey="executed"
            stroke="var(--color-executed)"
            strokeWidth={2}
            strokeOpacity={0.9}
            fill="var(--color-executed)"
            fillOpacity={0.15}
            dot={false}
            activeDot={{ r: 3 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
