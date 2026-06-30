"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatChartValueForDimension,
  resolveChartAxisWidth,
  resolveChartPanelHeight,
  type BreakdownChartGroup,
  type BreakdownChartItem,
} from "@/lib/ui-shared/chart-helpers/breakdown-chart-data";
import type { BreakdownChartDimension } from "@/lib/ui-shared/chart-helpers/breakdown-chart-dimensions";

type ChartType = "bar" | "pie";

type BreakdownChartGroupPanelProps = {
  readonly group: BreakdownChartGroup;
  readonly chartType: ChartType;
  readonly locale: string;
  readonly currency: string;
  readonly groupTitle: string;
  readonly axisSuffix?: string;
  readonly renderTooltip: (props: {
    readonly active?: boolean;
    readonly payload?: ReadonlyArray<{ payload?: BreakdownChartItem }>;
  }) => ReactNode;
  readonly onItemClick: (item: BreakdownChartItem) => void;
};

function axisFormatterForDimension(
  dimension: BreakdownChartDimension,
  locale: string,
  currency: string,
  suffix?: string,
): (value: number) => string {
  return (value: number) => {
    const formatted = formatChartValueForDimension(value, dimension, locale, currency);
    if (dimension === "time" && suffix) {
      return `${formatted} ${suffix}`;
    }
    return formatted;
  };
}

export function BreakdownChartGroupPanel({
  group,
  chartType,
  locale,
  currency,
  groupTitle,
  axisSuffix,
  renderTooltip,
  onItemClick,
}: BreakdownChartGroupPanelProps) {
  const { items, dimension } = group;
  const panelHeight = resolveChartPanelHeight(items.length);
  const yAxisWidth = resolveChartAxisWidth(items);
  const axisFormatter = axisFormatterForDimension(dimension, locale, currency, axisSuffix);
  const effectiveChartType = chartType === "pie" && items.length < 2 ? "bar" : chartType;

  return (
    <section
      className="rounded-lg border border-technical-gray/70 bg-surface-cream/40 p-3 sm:p-4"
      aria-label={groupTitle}
    >
      <h4 className="mb-3 text-sm font-semibold text-premium-velvet">{groupTitle}</h4>
      <div className="w-full" style={{ height: panelHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          {effectiveChartType === "bar" ? (
            <BarChart
              layout="vertical"
              data={items}
              margin={{ top: 8, right: 24, left: 4, bottom: 8 }}
            >
              <XAxis type="number" tickFormatter={axisFormatter} />
              <YAxis
                type="category"
                dataKey="name"
                width={yAxisWidth}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <Tooltip content={renderTooltip} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                cursor="pointer"
                onClick={(barData) => {
                  const item = (barData as { payload?: BreakdownChartItem }).payload;
                  if (item) {
                    onItemClick(item);
                  }
                }}
              >
                {items.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={Math.min(96, panelHeight / 2 - 24)}
                labelLine={false}
                label={({ percent }) => `${percent}%`}
                cursor="pointer"
                onClick={(_data, index) => {
                  const item = items[index];
                  if (item) {
                    onItemClick(item);
                  }
                }}
              >
                {items.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
