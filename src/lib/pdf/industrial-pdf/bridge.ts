/**
 * Bridge — converts PremiumReportExportPayload → IndustrialPdfData
 * with automatic chart generation and engineering content resolution.
 */

import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { normalizeLocale } from "@/lib/format/localization";
import type { PremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";
import {
  buildIndustrialPdfData,
  type IndustrialPdfData,
  type PdfBarChartData,
  type PdfPieChartData,
  type PdfChartConfig,
} from "@/lib/pdf/industrial-pdf/types";
import { resolveEngineeringContent } from "@/lib/pdf/industrial-pdf/content/engineering-explanations";

const DRIVER_COLORS = [
  "#1E40AF", "#D97706", "#059669", "#DC2626",
  "#7C3AED", "#0891B2", "#D946EF", "#65A30D",
];

function pickColor(index: number): string {
  return DRIVER_COLORS[index % DRIVER_COLORS.length];
}

function parseNumeric(raw: number, formatted: string): number {
  if (Number.isFinite(raw) && raw !== 0) return Math.abs(raw);
  const cleaned = formatted.replace(/[^0-9.,\-]/g, "").replace(",", ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? Math.abs(parsed) : 0;
}

function buildChartConfig(drivers: PremiumReportExportPayload["hiddenDrivers"]): PdfChartConfig | undefined {
  if (drivers.length === 0) return undefined;

  const bars: PdfBarChartData[] = drivers.map((d, i) => ({
    label: d.label,
    value: parseNumeric(d.rawValue, d.value),
    color: pickColor(i),
    formatted: d.value,
  }));

  const total = bars.reduce((s, b) => s + b.value, 0) || 1;
  const distribution: PdfPieChartData[] = bars.map((b) => ({
    label: b.label,
    value: b.value,
    percentage: (b.value / total) * 100,
    color: b.color,
  }));

  return { impactBars: bars, distribution };
}

const CATEGORY_MAP: Record<string, string> = {
  "quote": "cost", "machine-hour": "cost", "break-even": "cost", "labor-cost": "cost",
  "employee-cost": "cost", "inflation": "cost", "irr": "cost", "npv": "cost",
  "payback": "cost", "unit-cost": "cost", "bid": "cost",
  "calibration": "calibration", "gage": "measurement", "spc": "measurement",
  "sample-size": "measurement", "cpk": "measurement",
  "scrap": "scrap", "defect": "scrap", "rework": "scrap", "quality-cost": "scrap",
  "taguchi": "scrap", "ppm": "scrap", "six-sigma": "scrap", "aql": "scrap",
  "oee": "oee", "downtime": "oee", "takt": "oee", "line-balancing": "oee",
  "bottleneck": "oee",
  "energy": "energy", "kwh": "energy", "compressor": "energy",
  "steam": "energy", "heat-exchanger": "energy", "electricity": "energy",
  "carbon": "carbon", "co2": "carbon", "cbam": "carbon", "emission": "carbon",
  "sustainability": "carbon",
  "time-study": "time", "standard-time": "time", "learning-curve": "time",
  "productivity": "time",
  "route": "route", "logistic": "route", "transport": "route",
  "warehouse": "route", "eoq": "route",
  "benchmark": "benchmark", "kpi": "benchmark", "comparison": "benchmark",
};

function resolveCategory(slug: string): string | undefined {
  const lower = slug.toLowerCase();
  for (const [pattern, category] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(pattern)) return category;
  }
  return undefined;
}

export function bridgePayloadToIndustrialPdf(
  payload: PremiumReportExportPayload,
  locale: string,
  options?: {
    readonly inputs?: readonly { readonly label: string; readonly value: string }[];
    readonly verificationUrl?: string;
    readonly isSample?: boolean;
  },
): IndustrialPdfData {
  const fmtLocale = normalizeLocale(locale);
  const formulaCategory = resolveCategory(payload.schemaSlug);
  const engineeringContent = resolveEngineeringContent(formulaCategory, fmtLocale);
  const chartConfig = buildChartConfig(payload.hiddenDrivers);

  return buildIndustrialPdfData(payload, fmtLocale, {
    ...options,
    chartConfig,
    engineeringContent,
    formulaCategory,
  });
}
