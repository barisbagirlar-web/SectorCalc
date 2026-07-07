"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/features/generated-tools/types";
import {
  resolvePrimaryOutputKey,
  resolveGeneratedToolTitle,
} from "@/lib/features/generated-tools/resolve-tool-display";
import { resolvePrimaryOutputUnit } from "@/lib/features/generated-tools/resolve-output-unit";
import { formatGeneratedNumericValue } from "@/lib/features/generated-tools/format-generated-numeric";
import { normalizeLocale } from "@/lib/core/format/localization";
import { resolvePrimaryPrintValue, resolveBreakdownLabel } from "@/lib/features/reports/resolve-print-values";

/* ─── Badge ───────────────────────────────────────────────────────── */
function Badge({ label, variant }: { label: string; variant: "gold" | "amber" | "green" | "blue" | "red" }) {
  const colors: Record<string, string> = {
    gold: "bg-amber-50 text-amber-800 border-amber-200",
    amber: "bg-orange-50 text-orange-700 border-orange-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${colors[variant]}`}>
      {label}
    </span>
  );
}

/* ─── Gauge ───────────────────────────────────────────────────────── */
function Gauge({ score, color }: { score: number; color: string }) {
  const r = 36;
  const cx = 50;
  const cy = 46;
  const total = Math.PI * r;
  const filled = (score / 100) * total;
  return (
    <svg viewBox="0 0 100 55" width={88} height={52}>
      <defs>
        <linearGradient id="g-grad-sm" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>
      <path d={`M${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} stroke="#E5E7EB" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} stroke="url(#g-grad-sm)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={`${total}`} strokeDashoffset={`${total - filled}`} />
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize="10" fontWeight="700" fill={color} fontFamily="monospace">{score}</text>
    </svg>
  );
}

/* ─── Callout ─────────────────────────────────────────────────────── */
function Callout({ type, icon, title, text }: { type: string; icon: string; title: string; text: string }) {
  const borderMap: Record<string, string> = { warning: "border-l-amber-400", danger: "border-l-red-400", success: "border-l-emerald-400", info: "border-l-blue-400" };
  const bgMap: Record<string, string> = { warning: "bg-amber-50", danger: "bg-red-50", success: "bg-emerald-50", info: "bg-blue-50" };
  const titleColorMap: Record<string, string> = { warning: "text-amber-800", danger: "text-red-800", success: "text-emerald-800", info: "text-blue-800" };
  return (
    <div className={`flex gap-2.5 rounded-md p-2.5 border-l-4 ${borderMap[type] ?? "border-l-blue-400"} ${bgMap[type] ?? "bg-blue-50"}`}>
      <span className="text-sm flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${titleColorMap[type] ?? "text-blue-800"}`}>{title}</div>
        <div className="text-xs text-gray-600 leading-relaxed">{text}</div>
      </div>
    </div>
  );
}

/* ─── Mini Card ───────────────────────────────────────────────────── */
function MiniCard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight: boolean }) {
  return (
    <div className={`rounded-lg p-3 border ${highlight ? "border-amber-300 bg-amber-50/40" : "border-gray-200 bg-kil-surface"}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-gray-900 font-mono leading-tight">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────── */
export type PremiumResultSummaryProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly result: GeneratedToolResult;
  readonly onOpenFullReport: () => void;
};

export function PremiumResultSummary({ slug, schema, result, onOpenFullReport }: PremiumResultSummaryProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.reportSummary");
  const title = resolveGeneratedToolTitle(slug, schema, locale);
  const primaryOutputKey = resolvePrimaryOutputKey(schema);
  const primaryUnit = resolvePrimaryOutputUnit(schema);

  const primaryRaw = resolvePrimaryPrintValue(result, primaryOutputKey);
  const primaryIsNumber = primaryRaw !== null;
  const formattedPrimary = primaryIsNumber
    ? formatGeneratedNumericValue(primaryRaw, primaryOutputKey, locale, primaryUnit !== "-" ? primaryUnit : undefined)
    : "-";

  const breakdownEntries = useMemo(
    () => {
      const b = result.breakdown ?? {};
      return Object.entries(b).filter((e): e is [string, number] => typeof e[1] === "number" && Number.isFinite(e[1]));
    },
    [result.breakdown],
  );

  const riskScore =
    primaryRaw !== null && typeof result.dataConfidenceAdjusted === "number" && primaryRaw !== 0
      ? Math.min(Math.max(Math.round((1 - result.dataConfidenceAdjusted / (primaryRaw * 2)) * 100), 0), 100)
      : 45;

  const riskColor = riskScore <= 30 ? "#22C55E" : riskScore <= 60 ? "#F59E0B" : "#EF4444";
  const riskLabelKey: "riskLow" | "riskMedium" | "riskHigh" = riskScore <= 30 ? "riskLow" : riskScore <= 60 ? "riskMedium" : "riskHigh";
  const riskLabel = t(riskLabelKey);
  const riskBadgeVariant: "green" | "amber" | "red" = riskScore <= 30 ? "green" : riskScore <= 60 ? "amber" : "red";

  const hiddenDrivers = useMemo(
    () => (Array.isArray(result.hiddenLossDrivers) ? result.hiddenLossDrivers : []),
    [result.hiddenLossDrivers],
  );
  const suggestedActions = useMemo(
    () => (Array.isArray(result.suggestedActions) ? result.suggestedActions : []),
    [result.suggestedActions],
  );

  const miniCards = useMemo(() => {
    const cards: Array<{ label: string; value: string; sub: string; highlight: boolean }> = [];
    cards.push({ label: t("primaryResult"), value: formattedPrimary, sub: t("simulationNotice"), highlight: true });
    for (let i = 0; i < Math.min(breakdownEntries.length, 3); i++) {
      const [key, val] = breakdownEntries[i];
      const label = resolveBreakdownLabel(
        key,
        schema.outputs.breakdown,
        schema.outputs.breakdown_i18n,
        locale,
      );
      cards.push({ label, value: formatGeneratedNumericValue(val, key, locale), sub: t("breakdownItem"), highlight: false });
    }
    while (cards.length < 4) {
      if (cards.length === 1 && hiddenDrivers.length > 0) {
        cards.push({ label: t("hiddenLosses"), value: `${hiddenDrivers.length}`, sub: t("detectedCount"), highlight: false });
      } else {
        const isRisk = cards.length % 2 === 0;
        cards.push({
          label: isRisk ? t("riskScore") : t("confidenceLevel"),
          value: isRisk ? riskLabel : `${riskScore}/100`,
          sub: isRisk ? "" : t("dataQuality"),
          highlight: false,
        });
      }
    }
    return cards.slice(0, 4);
  }, [t, formattedPrimary, breakdownEntries, hiddenDrivers, riskLabel, riskScore, locale, schema.outputs.breakdown, schema.outputs.breakdown_i18n]);

  const insights = useMemo(() => {
    const items: Array<{ type: string; icon: string; title: string; text: string }> = [];
    if (hiddenDrivers.length > 0) {
      hiddenDrivers.slice(0, 2).forEach((d) => items.push({ type: "warning", icon: "⚠", title: t("hiddenLoss"), text: d }));
    }
    if (suggestedActions.length > 0) {
      suggestedActions.slice(0, 2).forEach((a) => items.push({ type: "info", icon: "↗", title: t("suggestedAction"), text: a }));
    }
    if (items.length === 0) {
      items.push({ type: "success", icon: "✓", title: t("calculationComplete"), text: t("confidenceNote") });
      items.push({
        type: "info", icon: "↗", title: t("dataConfidencePrefix"),
        text: `${primaryRaw !== null && typeof result.dataConfidenceAdjusted === "number" && primaryRaw !== 0 ? Math.round((result.dataConfidenceAdjusted / primaryRaw) * 100) + "%" : t("standardDeviation")}. ${t("lowConfidence")}.`,
      });
    }
    return items;
  }, [hiddenDrivers, suggestedActions, t, result.dataConfidenceAdjusted, primaryRaw]);

  const confidenceBadges = useMemo(() => {
    const badges: Array<{ label: string; variant: "gold" | "amber" | "green" | "blue" | "red" }> = [{ label: t("confidenceExact"), variant: "gold" }];
    if (hiddenDrivers.length > 0) badges.push({ label: t("confidenceProbable"), variant: "amber" });
    if (suggestedActions.length > 0) badges.push({ label: t("confidenceRecommended"), variant: "blue" });
    badges.push({ label: `${t("riskScore")}: ${riskLabel}`, variant: riskBadgeVariant });
    return badges;
  }, [t, hiddenDrivers, suggestedActions, riskLabel, riskBadgeVariant]);

  const now = new Date();
  const localeTag = normalizeLocale(locale);
  const localeMap: Record<string, string> = { tr: "tr-TR", en: "en-US", de: "de-DE", fr: "fr-FR", es: "es-ES", ar: "ar-SA" };
  const dateStr = now.toLocaleDateString(localeMap[localeTag] || "en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-kil-surface shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-amber-400 flex items-center justify-center font-extrabold text-xs text-white">SC</div>
          <div>
            <div className="text-sm font-bold text-gray-900">{t("title")}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{title}</div>
          </div>
        </div>
        <div className="text-right text-[10px] text-gray-400 font-mono">
          <div className="text-amber-700 font-bold tracking-wide">{dateStr}</div>
          <div className="text-gray-500">{t("preAssessment")}</div>
        </div>
      </div>

      <div className="p-5">
        {/* Primary Result + Gauge */}
        <div className="flex gap-4 items-stretch mb-4">
          <div className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
              {schema.outputs.primary ?? t("primaryResult")}
            </div>
            <div className="text-3xl font-extrabold text-gray-900 font-mono leading-tight mb-1">{formattedPrimary}</div>
            <div className="text-xs text-gray-400">{t("simulationNotice")}</div>
          </div>
          <div className="flex flex-col items-center justify-center px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 min-w-[110px]">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">{t("riskScore")}</div>
            <Gauge score={riskScore} color={riskColor} />
            <div className="mt-1"><Badge label={riskLabel} variant={riskBadgeVariant} /></div>
          </div>
        </div>

        {/* 4 Mini Cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {miniCards.map((card, i) => <MiniCard key={i} {...card} />)}
        </div>

        {/* Insights */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{t("calculationComments")}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex flex-col gap-2">
            {insights.map((ins, i) => <Callout key={i} {...ins} />)}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 items-center px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50 mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 flex-shrink-0">{t("dataConfidencePrefix")}</span>
          {confidenceBadges.map((b, i) => <Badge key={i} label={b.label} variant={b.variant} />)}
        </div>

        {/* CTA - sole export button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onOpenFullReport}
            className="sc-cta-primary sc-ledger-cta-primary min-h-[44px] px-5 text-sm font-bold inline-flex items-center gap-2"
          >
            <span>⬇</span> {t("printDownload")} - {t("fullReportCta")}
          </button>
        </div>
      </div>
    </div>
  );
}
