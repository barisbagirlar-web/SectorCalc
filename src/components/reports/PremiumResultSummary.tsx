"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";
import {
  resolvePrimaryOutputKey,
  resolveGeneratedToolTitle,
} from "@/lib/generated-tools/resolve-tool-display";
import { resolvePrimaryOutputUnit } from "@/lib/generated-tools/resolve-output-unit";
import { formatGeneratedNumericValue } from "@/lib/generated-tools/format-generated-numeric";
import { normalizeLocale } from "@/lib/format/localization";

/* ─── Tokens ──────────────────────────────────────────────────────── */
const T = {
  navy: "#0B1628",
  navy2: "#112240",
  slate: "#1E2D45",
  slate2: "#253552",
  gold: "#C9A84C",
  gold2: "#E8C86A",
  muted: "#8899B2",
  white: "#FFFFFF",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  blue: "#3B82F6",
  border: "rgba(201,168,76,0.22)",
} as const;

/* ─── Badge ───────────────────────────────────────────────────────── */
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
        borderRadius: 3,
        padding: "2px 7px",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
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
    <svg viewBox="0 0 100 55" width={100} height={58}>
      <defs>
        <linearGradient id="g-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={T.green} />
          <stop offset="50%" stopColor={T.amber} />
          <stop offset="100%" stopColor={T.red} />
        </linearGradient>
      </defs>
      <path
        d={`M${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke="url(#g-grad)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${total}`}
        strokeDashoffset={`${total - filled}`}
      />
      <text
        x={cx}
        y={cy + 9}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill={color}
        fontFamily="monospace"
      >
        {score}
      </text>
    </svg>
  );
}

/* ─── Callout ─────────────────────────────────────────────────────── */
const CALLOUT_COLORS: Record<string, { border: string; bg: string; titleColor: string }> = {
  warning: { border: T.amber, bg: `${T.amber}0e`, titleColor: T.amber },
  danger: { border: T.red, bg: `${T.red}0e`, titleColor: T.red },
  success: { border: T.green, bg: `${T.green}0e`, titleColor: T.green },
  info: { border: T.blue, bg: `${T.blue}0e`, titleColor: T.blue },
};

function Callout({ type, icon, title, text }: { type: string; icon: string; title: string; text: string }) {
  const c = CALLOUT_COLORS[type] ?? CALLOUT_COLORS.info;
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        background: c.bg,
        borderLeft: `3px solid ${c.border}`,
        borderRadius: 6,
        padding: "10px 12px",
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: c.titleColor,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: 3,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}

/* ─── Section Label ───────────────────────────────────────────────── */
function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ fontFamily: "monospace", fontSize: 9, color: T.gold, fontWeight: 700, letterSpacing: "0.05em" }}>
        {num}
      </span>
      <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: T.muted, fontWeight: 700 }}>
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

/* ─── Mini Result Card ────────────────────────────────────────────── */
function MiniCard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight: boolean }) {
  return (
    <div
      style={{
        background: T.slate2,
        border: `1px solid ${T.border}`,
        borderTop: highlight ? `2px solid ${T.gold}` : `1px solid ${T.border}`,
        borderRadius: 6,
        padding: "10px 13px",
      }}
    >
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.09em", color: T.muted, fontWeight: 600, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: T.gold2, fontFamily: "monospace", lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: T.muted, marginTop: 3 }}>{sub}</div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────── */
export type PremiumResultSummaryProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly result: GeneratedToolResult;
  readonly inputs: Record<string, unknown>;
  readonly onOpenFullReport: () => void;
};

export function PremiumResultSummary({
  slug,
  schema,
  result,
  inputs,
  onOpenFullReport,
}: PremiumResultSummaryProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.reportSummary");
  const title = resolveGeneratedToolTitle(slug, schema, locale);
  const primaryOutputKey = resolvePrimaryOutputKey(schema);
  const primaryUnit = resolvePrimaryOutputUnit(schema);

  const primaryRaw = result[primaryOutputKey];
  const primaryIsNumber = typeof primaryRaw === "number" && Number.isFinite(primaryRaw);
  const formattedPrimary = primaryIsNumber
    ? formatGeneratedNumericValue(primaryRaw as number, primaryOutputKey, locale, primaryUnit !== "—" ? primaryUnit : undefined)
    : String(primaryRaw ?? "—");

  const breakdown = result.breakdown ?? {};
  const breakdownEntries = useMemo(
    () =>
      Object.entries(breakdown).filter(
        (e): e is [string, number] => typeof e[1] === "number" && Number.isFinite(e[1]),
      ),
    [breakdown],
  );

  const riskScore =
    typeof result.dataConfidenceAdjusted === "number" && primaryIsNumber
      ? Math.min(Math.round((1 - result.dataConfidenceAdjusted / ((primaryRaw as number) * 2)) * 100), 100)
      : 45;

  const riskColor = riskScore <= 30 ? T.green : riskScore <= 60 ? T.amber : T.red;
  const riskLabelKey = riskScore <= 30 ? "riskLow" : riskScore <= 60 ? "riskMedium" : "riskHigh";
  const riskLabel = t(riskLabelKey);

  const hiddenDrivers: readonly string[] = Array.isArray(result.hiddenLossDrivers) ? result.hiddenLossDrivers : [];
  const suggestedActions: readonly string[] = Array.isArray(result.suggestedActions) ? result.suggestedActions : [];

  const miniCards = useMemo(() => {
    const cards: Array<{ label: string; value: string; sub: string; highlight: boolean }> = [];

    cards.push({
      label: t("primaryResult"),
      value: formattedPrimary,
      sub: t("simulationNotice"),
      highlight: true,
    });

    for (let i = 0; i < Math.min(breakdownEntries.length, 3); i++) {
      const [key, val] = breakdownEntries[i];
      const label = (schema.outputs.breakdown as Record<string, string> | undefined)?.[key] ?? key;
      const formatted = formatGeneratedNumericValue(val, key, locale);
      cards.push({ label, value: formatted, sub: t("breakdownItem"), highlight: false });
    }

    while (cards.length < 4) {
      if (cards.length === 1 && hiddenDrivers.length > 0) {
        cards.push({
          label: t("hiddenLosses"),
          value: `${hiddenDrivers.length}`,
          sub: t("detectedCount"),
          highlight: false,
        });
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
  }, [t, formattedPrimary, breakdownEntries, hiddenDrivers, riskLabel, riskScore, locale, schema.outputs.breakdown]);

  const insights = useMemo(() => {
    const items: Array<{ type: string; icon: string; title: string; text: string }> = [];

    if (hiddenDrivers.length > 0) {
      hiddenDrivers.slice(0, 2).forEach((d) => {
        items.push({ type: "warning", icon: "⚠", title: t("hiddenLoss"), text: d });
      });
    }

    if (suggestedActions.length > 0) {
      suggestedActions.slice(0, 2).forEach((a) => {
        items.push({ type: "info", icon: "↗", title: t("suggestedAction"), text: a });
      });
    }

    if (items.length === 0) {
      items.push({
        type: "success",
        icon: "✓",
        title: t("calculationComplete"),
        text: t("confidenceNote"),
      });
      items.push({
        type: "info",
        icon: "↗",
        title: t("dataConfidencePrefix"),
        text: `${t("dataConfidencePrefix")} ${typeof result.dataConfidenceAdjusted === "number" && primaryIsNumber ? Math.round((result.dataConfidenceAdjusted / (primaryRaw as number)) * 100) + "%" : t("standardDeviation")}. ${t("lowConfidence")}.`,
      });
    }

    return items;
  }, [hiddenDrivers, suggestedActions, t, result.dataConfidenceAdjusted, primaryRaw, primaryIsNumber]);

  const confidenceBadges = useMemo(() => {
    const badges: Array<{ label: string; color: string }> = [{ label: t("confidenceExact"), color: T.gold }];
    if (hiddenDrivers.length > 0) {
      badges.push({ label: t("confidenceProbable"), color: T.amber });
    }
    if (suggestedActions.length > 0) {
      badges.push({ label: t("confidenceRecommended"), color: T.blue });
    }
    badges.push({ label: `${t("riskScore")}: ${riskLabel}`, color: riskColor });
    return badges;
  }, [t, hiddenDrivers, suggestedActions, riskLabel, riskColor]);

  const now = new Date();
  const localeTag = normalizeLocale(locale);
  const localeMap: Record<string, string> = {
    tr: "tr-TR",
    en: "en-US",
    de: "de-DE",
    fr: "fr-FR",
    es: "es-ES",
    ar: "ar",
  };
  const dateStr = now.toLocaleDateString(localeMap[localeTag] || "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        background: T.navy,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
        fontFamily: "'Inter', system-ui, sans-serif",
        marginTop: 24,
      }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${T.gold} 0%, ${T.gold2} 60%, transparent 100%)` }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 22px 12px",
          background: T.navy2,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 11,
              color: T.navy,
            }}
          >
            SC
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.white }}>{t("title")}</div>
            <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {title}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 9, color: T.muted, fontFamily: "monospace" }}>
          <div style={{ color: T.gold, fontWeight: 700, letterSpacing: "0.05em" }}>{dateStr}</div>
          <div>{t("preAssessment")}</div>
        </div>
      </div>

      <div style={{ padding: "18px 22px 20px" }}>
        <div
          style={{
            background: T.slate,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 14,
            display: "flex",
          }}
        >
          <div style={{ width: 4, background: `linear-gradient(180deg, ${T.gold}, ${T.gold2})`, flexShrink: 0 }} />
          <div style={{ flex: 1, padding: "14px 18px", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: T.muted, fontWeight: 700, marginBottom: 4 }}>
                {schema.outputs.primary ?? t("primaryResult")}
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: T.gold2, fontFamily: "monospace", lineHeight: 1, marginBottom: 4 }}>
                {formattedPrimary}
              </div>
              <div style={{ fontSize: 10, color: T.muted }}>{t("simulationNotice")}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                {t("riskScore")}
              </div>
              <Gauge score={riskScore} color={riskColor} />
              <div style={{ marginTop: 3 }}>
                <Badge label={riskLabel} color={riskColor} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {miniCards.map((card, i) => (
            <MiniCard key={i} {...card} />
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <SectionLabel num="▸" title={t("calculationComments")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {insights.map((ins, i) => (
              <Callout key={i} {...ins} />
            ))}
          </div>
        </div>

        <div
          style={{
            background: T.slate2,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            padding: "10px 14px",
            marginBottom: 14,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, flexShrink: 0 }}>
            {t("dataConfidencePrefix")}
          </span>
          {confidenceBadges.map((b, i) => (
            <Badge key={i} label={b.label} color={b.color} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: T.muted, lineHeight: 1.4, textAlign: "right" }}>
            {t("detailedTooltip")}
          </span>
          <button
            type="button"
            onClick={onOpenFullReport}
            style={{
              background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
              color: T.navy,
              border: "none",
              borderRadius: 7,
              padding: "11px 22px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              letterSpacing: "0.03em",
              fontFamily: "inherit",
              boxShadow: `0 4px 18px ${T.gold}44`,
              whiteSpace: "nowrap",
            }}
          >
            📄 {t("fullReportCta")}
          </button>
        </div>
      </div>
    </div>
  );
}
