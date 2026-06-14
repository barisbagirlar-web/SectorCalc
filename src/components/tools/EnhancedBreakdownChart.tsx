"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
import { Link } from "@/i18n/routing";
import { normalizeWasteTypeKey } from "@/lib/chart-helpers";
import {
  buildBreakdownChartData,
  formatChartValue,
  shouldUseCurrencyAxis,
  type BreakdownChartItem,
} from "@/lib/chart-helpers/breakdown-chart-data";
import type { GeneratedToolBreakdown } from "@/lib/generated-tools/types";

type ChartType = "bar" | "pie";

export type EnhancedBreakdownChartProps = {
  readonly breakdown: GeneratedToolBreakdown;
  readonly labelMap?: Readonly<Record<string, string>>;
  readonly locale?: string;
  readonly currency?: string;
  readonly isPro?: boolean;
  readonly onItemClick?: (item: BreakdownChartItem) => void;
  readonly onActionClick?: (action: string, item: BreakdownChartItem) => void;
};

function resolveWasteDescriptionKey(key: string): string {
  return normalizeWasteTypeKey(key);
}

export function EnhancedBreakdownChart({
  breakdown,
  labelMap,
  locale: localeProp,
  currency = "TRY",
  isPro = false,
  onItemClick,
  onActionClick,
}: EnhancedBreakdownChartProps) {
  const hookLocale = useLocale();
  const locale = localeProp ?? hookLocale;
  const t = useTranslations("generatedTool");
  const tChart = useTranslations("generatedTool.breakdownChart");
  const wasteT = useTranslations("wasteTypes");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const resolveBreakdownLabel = useMemo(() => {
    return (key: string): string => {
      const wasteKey = normalizeWasteTypeKey(key);
      if (wasteT.has(wasteKey)) {
        return wasteT(wasteKey);
      }
      const schemaLabel = labelMap?.[key];
      if (schemaLabel && schemaLabel !== key) {
        return schemaLabel;
      }
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    };
  }, [labelMap, wasteT]);

  const chartData = useMemo(
    () => buildBreakdownChartData(breakdown, locale, currency, resolveBreakdownLabel),
    [breakdown, currency, locale, resolveBreakdownLabel],
  );

  const useCurrency = useMemo(() => shouldUseCurrencyAxis(breakdown), [breakdown]);

  const axisFormatter = useMemo(
    () => (value: number) => formatChartValue(value, "", locale, currency, useCurrency),
    [currency, locale, useCurrency],
  );

  const resolveDescription = (item: BreakdownChartItem): string => {
    const wasteKey = resolveWasteDescriptionKey(item.key);
    if (tChart.has(`descriptions.${wasteKey}`)) {
      return tChart(`descriptions.${wasteKey}`);
    }
    return tChart("descriptions.default");
  };

  const resolveAction = (item: BreakdownChartItem): string => {
    const wasteKey = resolveWasteDescriptionKey(item.key);
    if (tChart.has(`actions.${wasteKey}`)) {
      return tChart(`actions.${wasteKey}`);
    }
    return tChart("actions.default");
  };

  const handleActionRequest = (item: BreakdownChartItem) => {
    const action = resolveAction(item);
    if (isPro) {
      onActionClick?.(action, item);
      setPendingAction(action);
      return;
    }
    setPendingAction(action);
  };

  type BreakdownTooltipProps = {
    readonly active?: boolean;
    readonly payload?: ReadonlyArray<{ payload?: BreakdownChartItem }>;
  };

  const CustomTooltip = ({ active, payload }: BreakdownTooltipProps) => {
    const item = payload?.[0]?.payload;
    if (!active || !item) {
      return null;
    }

    return (
      <div className="max-w-xs rounded-lg border border-technical-gray bg-white p-3 shadow-lg">
        <p className="font-semibold text-premium-velvet">{item.name}</p>
        <p className="text-sm text-body-charcoal">
          {item.displayValue} ({item.percent}%)
        </p>
        <p className="mt-1 text-xs text-body-charcoal/80">{resolveDescription(item)}</p>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleActionRequest(item);
          }}
          className="mt-2 min-h-[36px] rounded-md bg-premium-velvet px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          {isPro ? tChart("suggestedAction") : tChart("suggestedActionLocked")}
        </button>
      </div>
    );
  };

  const handleBarClick = (item: BreakdownChartItem) => {
    onItemClick?.(item);
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <>
      <div className="rounded-xl border border-technical-gray bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-premium-velvet">{t("breakdownTitle")}</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setChartType("bar")}
              aria-pressed={chartType === "bar"}
              className={`min-h-[36px] rounded-md px-3 py-1 text-sm font-medium ${
                chartType === "bar"
                  ? "bg-premium-velvet text-white"
                  : "bg-surface-cream text-body-charcoal"
              }`}
            >
              {tChart("chartTypeBar")}
            </button>
            <button
              type="button"
              onClick={() => setChartType("pie")}
              aria-pressed={chartType === "pie"}
              className={`min-h-[36px] rounded-md px-3 py-1 text-sm font-medium ${
                chartType === "pie"
                  ? "bg-premium-velvet text-white"
                  : "bg-surface-cream text-body-charcoal"
              }`}
            >
              {tChart("chartTypePie")}
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, left: 8, bottom: 5 }}
              >
                <XAxis type="number" tickFormatter={axisFormatter} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  cursor="pointer"
                  onClick={(barData) => {
                    const item = (barData as { payload?: BreakdownChartItem }).payload;
                    if (item) {
                      handleBarClick(item);
                    }
                  }}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.percent}%`}
                  cursor="pointer"
                  onClick={(_data, index) => {
                    const item = chartData[index];
                    if (item) {
                      handleBarClick(item);
                    }
                  }}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        <p className="mt-2 text-xs text-body-charcoal">{tChart("clickHint")}</p>
        <p className="mt-1 text-xs text-body-charcoal/70">{t("breakdownFootnote")}</p>
      </div>

      {pendingAction ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="breakdown-action-title"
          onClick={() => setPendingAction(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="breakdown-action-title" className="text-base font-semibold text-premium-velvet">
                {tChart("actionModalTitle")}
              </h2>
              <button
                type="button"
                className="min-h-[44px] min-w-[44px] text-sm text-body-charcoal"
                onClick={() => setPendingAction(null)}
              >
                {tChart("close")}
              </button>
            </div>
            <p className="mt-3 text-sm text-body-charcoal">{pendingAction}</p>
            {!isPro ? (
              <p className="mt-3 text-sm text-body-charcoal">
                {tChart("actionProHint")}{" "}
                <Link href="/pricing" className="font-semibold text-premium-copper hover:underline">
                  {tChart("actionProCta")}
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
