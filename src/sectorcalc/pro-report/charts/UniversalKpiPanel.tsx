// SectorCalc PRO V2 — Universal KPI Gauge Panel.
// Renders confidence, decision-status, and money-at-risk cards for ANY tool that exposes
// the shared out_evidence_completeness / out_final_decision_state / out_money_at_risk /
// out_fmea_trigger outputs -- no per-tool declaration needed. Purely additive: renders
// nothing if a tool doesn't expose these outputs (e.g. break-even, which has its own
// bespoke gauge set already).

"use client";

const COLOR = {
  positive: "#2D8A4E",
  warning: "#C59B3C",
  danger: "#C53C3C",
  track: "#EFEBE2",
  text: "#1A1915",
};

function gaugeArc(pct: number, r: number, cx: number, cy: number): string {
  const clamped = Math.max(0, Math.min(1, pct));
  const angle = Math.PI - clamped * Math.PI;
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r * Math.cos(angle);
  const endY = cy - r * Math.sin(angle);
  const largeArc = clamped > 0.5 ? 1 : 0;
  return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
}

function fmtMoney(v: number, currency: string): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  const prefix = currency ? `${currency} ` : "";
  if (abs >= 1_000_000) return `${sign}${prefix}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}${prefix}${(abs / 1_000).toFixed(1)}k`;
  return `${sign}${prefix}${abs.toFixed(0)}`;
}

function ArcGauge({ label, valueLabel, pct, color }: { label: string; valueLabel: string; pct: number; color: string }) {
  const r = 52;
  const cx = 64;
  const cy = 64;
  return (
    <div className="sc-report-kpi-gauge">
      <svg viewBox="0 0 128 78" className="sc-report-chart-svg" role="img" aria-label={label}>
        <path d={gaugeArc(1, r, cx, cy)} fill="none" stroke={COLOR.track} strokeWidth={12} strokeLinecap="round" />
        <path d={gaugeArc(pct, r, cx, cy)} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15" fontFamily="JetBrains Mono, monospace" fill={COLOR.text} fontWeight={700}>
          {valueLabel}
        </text>
      </svg>
      <span className="sc-report-kpi-gauge-label">{label}</span>
    </div>
  );
}

function FlatCard({ label, valueLabel, color }: { label: string; valueLabel: string; color: string }) {
  return (
    <div className="sc-report-kpi-flat-card" style={{ borderColor: color }}>
      <span className="sc-report-kpi-flat-value" style={{ color }}>
        {valueLabel}
      </span>
      <span className="sc-report-kpi-gauge-label">{label}</span>
    </div>
  );
}

interface UniversalKpiPanelProps {
  toolSlug: string;
  currencyCode: string;
  outputs: Record<string, number>;
}

const DECISION_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "GO", color: COLOR.positive },
  1: { label: "REVIEW", color: COLOR.warning },
  2: { label: "BLOCKED", color: COLOR.danger },
};

export function UniversalKpiPanel({ toolSlug, currencyCode, outputs }: UniversalKpiPanelProps) {
  // Break-Even already renders its own bespoke gauge set (BreakEvenReportCharts) -- avoid
  // showing a redundant/less-specific generic panel underneath it.
  if (toolSlug === "break-even-survival-cash-calculator") return null;

  const confidence = outputs["out_evidence_completeness"];
  const decisionState = outputs["out_final_decision_state"];
  const moneyAtRisk = outputs["out_money_at_risk"];
  const fmeaTrigger = outputs["out_fmea_trigger"];
  const thresholdCrossing = outputs["out_threshold_crossing"];

  const hasConfidence = typeof confidence === "number" && Number.isFinite(confidence);
  const hasDecision = typeof decisionState === "number" && Number.isFinite(decisionState);
  const hasMoney = typeof moneyAtRisk === "number" && Number.isFinite(moneyAtRisk);
  const hasFmea = typeof fmeaTrigger === "number" && Number.isFinite(fmeaTrigger);
  const hasThreshold = typeof thresholdCrossing === "number" && Number.isFinite(thresholdCrossing);

  if (!hasConfidence && !hasDecision && !hasMoney && !hasFmea && !hasThreshold) return null;

  const decisionInfo = hasDecision ? DECISION_LABELS[Math.round(decisionState)] ?? DECISION_LABELS[1] : null;
  const confColor = hasConfidence ? (confidence < 0.5 ? COLOR.danger : confidence < 0.7 ? COLOR.warning : COLOR.positive) : COLOR.positive;
  const moneyColor = decisionInfo?.color ?? (hasMoney && moneyAtRisk > 0 ? COLOR.warning : COLOR.positive);
  const fmeaInfo = hasFmea
    ? fmeaTrigger > 0
      ? { label: "TRIGGERED", color: COLOR.danger }
      : { label: "CLEAR", color: COLOR.positive }
    : hasThreshold
      ? thresholdCrossing > 0
        ? { label: "BREACHED", color: COLOR.danger }
        : { label: "WITHIN LIMIT", color: COLOR.positive }
      : null;

  return (
    <div className="sc-report-chart-block">
      <h4 className="sc-report-section-title">Executive KPI Summary</h4>
      <div className="sc-report-kpi-gauge-row">
        {hasConfidence && (
          <ArcGauge label="Input Confidence" valueLabel={`${(confidence * 100).toFixed(0)}%`} pct={confidence} color={confColor} />
        )}
        {decisionInfo && <FlatCard label="Decision Status" valueLabel={decisionInfo.label} color={decisionInfo.color} />}
        {hasMoney && <FlatCard label="Money at Risk" valueLabel={fmtMoney(moneyAtRisk, currencyCode)} color={moneyColor} />}
        {!hasMoney && fmeaInfo && <FlatCard label="FMEA / Threshold Risk" valueLabel={fmeaInfo.label} color={fmeaInfo.color} />}
      </div>
    </div>
  );
}
