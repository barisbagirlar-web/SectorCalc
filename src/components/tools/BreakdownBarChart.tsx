"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GeneratedToolBreakdown } from "@/lib/generated-tools/types";

type BreakdownBarChartProps = {
  readonly breakdown: GeneratedToolBreakdown;
  readonly labelMap?: Readonly<Record<string, string>>;
  readonly locale: string;
  readonly currency?: string;
};

type ChartDatum = {
  name: string;
  value: number;
  percent: string;
  displayValue: string;
};

function formatBreakdownKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function isRatioLikeKey(key: string): boolean {
  return /ratio|rate|percent|multiplier|availability|performance|quality|share/i.test(key);
}

function formatChartValue(
  value: number,
  key: string,
  locale: string,
  currency: string,
  useCurrency: boolean,
): string {
  if (value > 0 && value < 1 && isRatioLikeKey(key)) {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(value);
  }

  if (useCurrency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}

function buildChartData(
  breakdown: GeneratedToolBreakdown,
  labelMap: Readonly<Record<string, string>> | undefined,
  locale: string,
  currency: string,
  resolveLabel: (key: string) => string,
): ChartDatum[] {
  const entries = Object.entries(breakdown).filter(
    (entry): entry is [string, number] => {
      const value = entry[1];
      return typeof value === "number" && Number.isFinite(value);
    },
  );

  if (entries.length === 0) {
    return [];
  }

  const total = entries.reduce((sum, [, value]) => sum + Math.abs(value), 0);
  const safeTotal = total > 0 ? total : 1;
  const useCurrency = entries.every(
    ([key, value]) => !isRatioLikeKey(key) || Math.abs(value) >= 1,
  );

  return entries.map(([key, value]) => ({
    name: resolveLabel(key),
    value: Math.abs(value),
    percent: ((Math.abs(value) / safeTotal) * 100).toFixed(1),
    displayValue: formatChartValue(value, key, locale, currency, useCurrency),
  }));
}

export function BreakdownBarChart({
  breakdown,
  labelMap,
  locale,
  currency = "TRY",
}: BreakdownBarChartProps) {
  const t = useTranslations("generatedTool");
  const wasteT = useTranslations("wasteTypes");

  const resolveBreakdownLabel = useMemo(() => {
    return (key: string): string => {
      const normalizedKey = key.toLowerCase();
      if (wasteT.has(normalizedKey)) {
        return wasteT(normalizedKey);
      }
      const schemaLabel = labelMap?.[key];
      if (schemaLabel && schemaLabel !== key) {
        return schemaLabel;
      }
      return formatBreakdownKey(key);
    };
  }, [labelMap, wasteT]);

  const chartData = useMemo(
    () => buildChartData(breakdown, labelMap, locale, currency, resolveBreakdownLabel),
    [breakdown, labelMap, locale, currency, resolveBreakdownLabel],
  );

  const useCurrency = useMemo(() => {
    return Object.entries(breakdown).every(([key, value]) => {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return true;
      }
      return !isRatioLikeKey(key) || Math.abs(value) >= 1;
    });
  }, [breakdown]);

  const axisFormatter = useMemo(() => {
    return (value: number) =>
      formatChartValue(value, "", locale, currency, useCurrency);
  }, [currency, locale, useCurrency]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-technical-gray bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-premium-velvet">
        {t("breakdownTitle")}
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 8, bottom: 5 }}
          >
            <XAxis type="number" tickFormatter={axisFormatter} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, _name, item) => {
                const numericValue = typeof value === "number" ? value : Number(value);
                const payload = item.payload as ChartDatum | undefined;
                const display =
                  payload?.displayValue ??
                  (Number.isFinite(numericValue)
                    ? axisFormatter(numericValue)
                    : String(value ?? "—"));
                const percent = payload?.percent ?? "0.0";
                return [`${display} (${percent}%)`, t("breakdownTooltipValue")];
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill="#1e3a5f" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-body-charcoal">{t("breakdownFootnote")}</p>
    </div>
  );
}
