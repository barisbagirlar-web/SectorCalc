// SectorCalc PRO V2 — Break-Even & Survival Cash: report chart pack.
// Scoped to a single tool (toolSlug guard below). Additive only — does not touch
// ProReportPanelV2.tsx, pro-tool-form.css, or any other locked/shared component.
// All data is derived from already-computed server outputs (response.outputs) and the
// sensitivity endpoint's canonical base-unit inputs (baseInputs) -- no unit re-derivation,
// no fabricated numbers.

"use client";

const COLOR = {
  positive: "#2D8A4E",
  warning: "#C59B3C",
  danger: "#C53C3C",
  neutral: "#57544C",
  track: "#EFEBE2",
  grid: "#D4D2C8",
  text: "#1A1915",
  muted: "#8C887E",
  accent: "#3A4D8F",
};

function fmtMoney(v: number, currency: string): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  const prefix = currency ? `${currency} ` : "";
  if (abs >= 1_000_000) return `${sign}${prefix}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}${prefix}${(abs / 1_000).toFixed(1)}k`;
  return `${sign}${prefix}${abs.toFixed(0)}`;
}

interface SensitivityDriverResult {
  inputId: string;
  label: string;
  up: number | null;
  down: number | null;
  span: number | null;
}

interface BreakEvenReportChartsProps {
  toolSlug: string;
  currencySymbol: string;
  outputs: Record<string, number>;
  sensitivity: {
    targetOutput: string;
    baseline: number | null;
    baseInputs: Record<string, number> | null;
    drivers: SensitivityDriverResult[];
  } | null;
}

export function BreakEvenReportCharts({ toolSlug, currencySymbol, outputs, sensitivity }: BreakEvenReportChartsProps) {
  if (toolSlug !== "break-even-survival-cash-calculator") return null;

  const cur = currencySymbol || "$";
  const base = sensitivity?.baseInputs ?? null;

  return (
    <div className="sc-report-charts-pack">
      <WaterfallChart base={base} cur={cur} />
      <TornadoChart sensitivity={sensitivity} cur={cur} />
      <RunwayDecayChart base={base} outputs={outputs} cur={cur} />
      <KpiGauges outputs={outputs} base={base} />
    </div>
  );
}

// ── 1. Waterfall: Current Monthly Revenue → -Variable Cost → -Fixed Cash Cost →
//    -Debt Service → Net Monthly Cash Flow. Built from raw canonical inputs only. ──
function WaterfallChart({ base, cur }: { base: Record<string, number> | null; cur: string }) {
  if (!base) return null;
  const revenue = base["n_current_monthly_revenue"];
  const cmRatio = base["n_contribution_margin_ratio"];
  const fixedCost = base["n_monthly_fixed_cash_cost"];
  const debtService = base["n_monthly_debt_service"];
  if (![revenue, cmRatio, fixedCost, debtService].every((v) => typeof v === "number" && Number.isFinite(v))) return null;

  const variableCost = revenue * (1 - cmRatio);
  const afterVariable = revenue - variableCost;
  const afterFixed = afterVariable - fixedCost;
  const netCashFlow = afterFixed - debtService;

  const steps: Array<{ label: string; start: number; end: number; kind: "total" | "drop" }> = [
    { label: "Current Monthly Revenue", start: 0, end: revenue, kind: "total" },
    { label: "Variable Cost", start: revenue, end: afterVariable, kind: "drop" },
    { label: "Fixed Cash Cost", start: afterVariable, end: afterFixed, kind: "drop" },
    { label: "Debt Service", start: afterFixed, end: netCashFlow, kind: "drop" },
    { label: "Net Monthly Cash Flow", start: 0, end: netCashFlow, kind: "total" },
  ];

  const W = 640;
  const H = 260;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxVal = Math.max(revenue, 0);
  const minVal = Math.min(0, netCashFlow);
  const span = maxVal - minVal || 1;
  const y = (v: number) => padT + plotH - ((v - minVal) / span) * plotH;
  const barW = plotW / steps.length - 18;

  return (
    <div className="sc-report-chart-block">
      <h4 className="sc-report-section-title">Waterfall: Where the Cash Goes</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="sc-report-chart-svg" role="img" aria-label="Monthly cash waterfall">
        <line x1={padL} y1={y(0)} x2={W - padR} y2={y(0)} stroke={COLOR.grid} strokeWidth={1} />
        {steps.map((s, i) => {
          const x = padL + i * (plotW / steps.length) + 9;
          const top = y(Math.max(s.start, s.end));
          const bottom = y(Math.min(s.start, s.end));
          const height = Math.max(1, bottom - top);
          const isNegativeDrop = s.kind === "drop" && s.end < s.start;
          const color = s.kind === "total" ? (s.end >= 0 ? COLOR.accent : COLOR.danger) : isNegativeDrop ? COLOR.danger : COLOR.positive;
          return (
            <g key={s.label}>
              <rect x={x} y={top} width={barW} height={height} fill={color} />
              <text x={x + barW / 2} y={top - 6} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill={COLOR.text}>
                {fmtMoney(s.end - (s.kind === "drop" ? 0 : 0), cur) === "" ? "" : fmtMoney(s.kind === "drop" ? s.end - s.start : s.end, cur)}
              </text>
              <text x={x + barW / 2} y={H - padB + 16} textAnchor="middle" fontSize="10.5" fill={COLOR.muted}>
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="sc-report-sensitivity-note">
        Revenue flows down through variable cost (at the entered contribution margin), fixed cash cost, and debt
        service to the net monthly cash flow. A negative final bar means the business is burning cash before any
        downside stress is applied.
      </p>
    </div>
  );
}

// ── 2. Tornado: ±10% sensitivity of the primary target output per driver, centered on baseline. ──
function TornadoChart({ sensitivity, cur }: { sensitivity: BreakEvenReportChartsProps["sensitivity"]; cur: string }) {
  if (!sensitivity || sensitivity.baseline === null) return null;
  const drivers = sensitivity.drivers.filter((d) => d.up !== null && d.down !== null).slice(0, 6);
  if (drivers.length === 0) return null;

  const baseline = sensitivity.baseline;
  const maxDeviation = Math.max(
    ...drivers.map((d) => Math.max(Math.abs((d.up as number) - baseline), Math.abs((d.down as number) - baseline))),
    1e-9,
  );

  const W = 640;
  const rowH = 34;
  const H = drivers.length * rowH + 30;
  const centerX = W / 2;
  const halfTrack = W / 2 - 170;

  return (
    <div className="sc-report-chart-block">
      <h4 className="sc-report-section-title">Tornado: What Moves Break-Even Revenue Most (±10%)</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="sc-report-chart-svg" role="img" aria-label="Tornado sensitivity diagram">
        <line x1={centerX} y1={4} x2={centerX} y2={H - 20} stroke={COLOR.grid} strokeWidth={1} />
        {drivers.map((d, i) => {
          const cy = 20 + i * rowH;
          const up = d.up as number;
          const down = d.down as number;
          const upW = (Math.max(0, up - baseline) / maxDeviation) * halfTrack;
          const downW = (Math.max(0, baseline - down) / maxDeviation) * halfTrack;
          const upIsRight = up >= baseline;
          return (
            <g key={d.inputId}>
              <text x={centerX - halfTrack - 8} y={cy + 4} textAnchor="end" fontSize="11" fill={COLOR.neutral}>
                {d.label}
              </text>
              <rect
                x={upIsRight ? centerX : centerX - upW}
                y={cy - 8}
                width={upIsRight ? upW : upW}
                height={16}
                fill={COLOR.positive}
                opacity={0.85}
              />
              <rect
                x={upIsRight ? centerX - downW : centerX}
                y={cy - 8}
                width={downW}
                height={16}
                fill={COLOR.danger}
                opacity={0.85}
              />
            </g>
          );
        })}
      </svg>
      <p className="sc-report-sensitivity-note">
        Green = effect of a +10% change in that input; red = effect of a -10% change; bars are centered on the
        baseline {sensitivity.targetOutput.replace(/^out_/, "").replace(/_/g, " ")} of{" "}
        {fmtMoney(baseline, cur)}. Longer bars mean the result is more sensitive to that input — verify those inputs
        first.
      </p>
    </div>
  );
}

// ── 3. Runway Decay: unrestricted cash burning down at the stressed monthly rate. ──
function RunwayDecayChart({
  base,
  outputs,
  cur,
}: {
  base: Record<string, number> | null;
  outputs: Record<string, number>;
  cur: string;
}) {
  if (!base) return null;
  const startCash = base["n_unrestricted_cash_balance"];
  const minBuffer = base["n_minimum_cash_buffer"];
  const targetMonths = base["n_target_survival_months"];
  const burn = outputs["out_monthly_cash_burn"];
  const runwayMonths = outputs["out_cash_runway_months"];
  if (![startCash, minBuffer, burn, runwayMonths].every((v) => typeof v === "number" && Number.isFinite(v))) return null;
  if (burn <= 0) return null;

  const horizonMonths = Math.max(1, Math.min(120, Math.ceil(Math.max(runwayMonths, targetMonths || 0)) + 2));
  const points: Array<{ t: number; cash: number }> = [];
  for (let t = 0; t <= horizonMonths; t++) {
    points.push({ t, cash: Math.max(minBuffer, startCash - burn * t) });
  }

  const W = 640;
  const H = 240;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxCash = Math.max(startCash, 1);
  const x = (t: number) => padL + (t / horizonMonths) * plotW;
  const y = (c: number) => padT + plotH - (c / maxCash) * plotH;

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.t)} ${y(p.cash)}`).join(" ");
  const areaPath = `${path} L ${x(horizonMonths)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  return (
    <div className="sc-report-chart-block">
      <h4 className="sc-report-section-title">Runway Decay: Cash Under Stress Over Time</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="sc-report-chart-svg" role="img" aria-label="Cash runway decay over time">
        {/* y-axis gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={padL} y1={padT + plotH * (1 - f)} x2={W - padR} y2={padT + plotH * (1 - f)} stroke={COLOR.track} strokeWidth={1} />
            <text x={padL - 6} y={padT + plotH * (1 - f) + 4} textAnchor="end" fontSize="9.5" fill={COLOR.muted}>
              {fmtMoney(maxCash * f, cur)}
            </text>
          </g>
        ))}
        <path d={areaPath} fill={COLOR.accent} opacity={0.12} />
        <path d={path} fill="none" stroke={COLOR.accent} strokeWidth={2} />
        {/* minimum cash buffer floor */}
        <line x1={padL} y1={y(minBuffer)} x2={W - padR} y2={y(minBuffer)} stroke={COLOR.danger} strokeWidth={1} strokeDasharray="4 3" />
        <text x={W - padR} y={y(minBuffer) - 4} textAnchor="end" fontSize="9.5" fill={COLOR.danger}>
          Minimum Cash Buffer
        </text>
        {/* target survival months marker */}
        {targetMonths > 0 && targetMonths <= horizonMonths && (
          <>
            <line x1={x(targetMonths)} y1={padT} x2={x(targetMonths)} y2={padT + plotH} stroke={COLOR.warning} strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(targetMonths)} y={padT - 4} textAnchor="middle" fontSize="9.5" fill={COLOR.warning}>
              Target ({targetMonths}mo)
            </text>
          </>
        )}
        {/* runway breach point */}
        {runwayMonths <= horizonMonths && (
          <circle cx={x(runwayMonths)} cy={y(Math.max(minBuffer, startCash - burn * runwayMonths))} r={4} fill={COLOR.danger} />
        )}
        <text x={padL} y={H - 8} fontSize="10" fill={COLOR.muted}>
          Month 0
        </text>
        <text x={W - padR} y={H - 8} textAnchor="end" fontSize="10" fill={COLOR.muted}>
          Month {horizonMonths}
        </text>
      </svg>
      <p className="sc-report-sensitivity-note">
        Projected at the stressed monthly cash burn of {fmtMoney(burn, cur)}/mo. The dot marks the month runway is
        exhausted down to the minimum cash buffer ({fmtMoney(runwayMonths, "")} months).
      </p>
    </div>
  );
}

// ── 4. KPI Gauges: Runway vs Target, Margin of Safety, Decision Status. ──
function gaugeArc(pct: number, r: number, cx: number, cy: number): string {
  const clamped = Math.max(0, Math.min(1, pct));
  const angle = Math.PI - clamped * Math.PI; // 180deg (left) -> 0deg (right)
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r * Math.cos(angle);
  const endY = cy - r * Math.sin(angle);
  const largeArc = clamped > 0.5 ? 1 : 0;
  return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
}

function Gauge({ label, valueLabel, pct, color }: { label: string; valueLabel: string; pct: number; color: string }) {
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

function KpiGauges({ outputs, base }: { outputs: Record<string, number>; base: Record<string, number> | null }) {
  const runway = outputs["out_cash_runway_months"];
  const margin = outputs["out_margin_of_safety_ratio"];
  const decisionCode = outputs["out_decision_code"];
  const targetMonths = base?.["n_target_survival_months"];
  if (typeof runway !== "number" || typeof margin !== "number") return null;

  const runwayPct = targetMonths ? Math.min(1, runway / (targetMonths * 2)) : Math.min(1, runway / 24);
  const runwayColor = typeof targetMonths === "number" && runway < targetMonths ? COLOR.danger : runway < 6 ? COLOR.warning : COLOR.positive;

  const marginPct = Math.max(0, Math.min(1, (margin + 0.2) / 0.6));
  const marginColor = margin < 0 ? COLOR.danger : margin < 0.15 ? COLOR.warning : COLOR.positive;

  const statusLabel = decisionCode === 0 ? "HEALTHY" : decisionCode === 1 ? "REVIEW" : "BLOCKED";
  const statusColor = decisionCode === 0 ? COLOR.positive : decisionCode === 1 ? COLOR.warning : COLOR.danger;
  const statusPct = decisionCode === 0 ? 1 : decisionCode === 1 ? 0.5 : 0.12;

  return (
    <div className="sc-report-chart-block">
      <h4 className="sc-report-section-title">Executive KPI Summary</h4>
      <div className="sc-report-kpi-gauge-row">
        <Gauge label="Cash Runway" valueLabel={`${runway.toFixed(1)}mo`} pct={runwayPct} color={runwayColor} />
        <Gauge label="Margin of Safety" valueLabel={`${(margin * 100).toFixed(1)}%`} pct={marginPct} color={marginColor} />
        <Gauge label="Status" valueLabel={statusLabel} pct={statusPct} color={statusColor} />
      </div>
    </div>
  );
}
