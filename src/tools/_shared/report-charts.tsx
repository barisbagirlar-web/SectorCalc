"use client";

// SectorCalc PRO — shared report chart components for bespoke per-tool pages
// (src/tools/pro/<slug>/page.tsx). Pure SVG, no new dependency, no fabricated data --
// every chart takes real numbers computed by the tool's own executeFormula().

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
  clay: "#C15F3C",
};

export function fmtChartNum(x: number, cur = ""): string {
  if (x == null || Number.isNaN(x)) return "—";
  if (!Number.isFinite(x)) return "∞";
  const abs = Math.abs(x);
  const sign = x < 0 ? "-" : "";
  const prefix = cur ? `${cur}` : "";
  if (abs >= 1_000_000) return `${sign}${prefix}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}${prefix}${(abs / 1_000).toFixed(1)}k`;
  return `${sign}${prefix}${abs.toFixed(0)}`;
}

// ── 1. Waterfall: sequential running-total cascade ──
export interface WaterfallStep {
  label: string;
  delta: number; // signed change at this step (first/last steps are usually totals with delta = full value)
  isTotal?: boolean;
}

export function WaterfallChart({ steps, cur = "" }: { steps: WaterfallStep[]; cur?: string }) {
  if (steps.length === 0) return null;
  let running = 0;
  const bars = steps.map((s) => {
    const start = s.isTotal ? 0 : running;
    const end = s.isTotal ? s.delta : running + s.delta;
    running = end;
    return { ...s, start, end };
  });

  const W = 640;
  const H = 240;
  const padL = 8, padR = 8, padT = 20, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxV = Math.max(...bars.map((b) => Math.max(b.start, b.end)), 0);
  const minV = Math.min(...bars.map((b) => Math.min(b.start, b.end)), 0);
  const span = maxV - minV || 1;
  const y = (v: number) => padT + plotH - ((v - minV) / span) * plotH;
  const barW = plotW / bars.length - 14;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Waterfall chart">
      <line x1={padL} y1={y(0)} x2={W - padR} y2={y(0)} stroke={COLOR.grid} strokeWidth={1} />
      {bars.map((b, i) => {
        const x = padL + i * (plotW / bars.length) + 7;
        const top = y(Math.max(b.start, b.end));
        const bottom = y(Math.min(b.start, b.end));
        const height = Math.max(1, bottom - top);
        const negative = b.end < b.start;
        const color = b.isTotal ? (b.end >= 0 ? COLOR.accent : COLOR.danger) : negative ? COLOR.danger : COLOR.positive;
        return (
          <g key={b.label + i}>
            <rect x={x} y={top} width={barW} height={height} fill={color} />
            <text x={x + barW / 2} y={top - 6} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={COLOR.text}>
              {fmtChartNum(b.isTotal ? b.end : b.end - b.start, cur)}
            </text>
            <text x={x + barW / 2} y={H - padB + 16} textAnchor="middle" fontSize="10" fill={COLOR.muted}>
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── 2. Tornado: bidirectional ±10% sensitivity, centered on baseline ──
export interface TornadoDriver {
  label: string;
  up: number;
  down: number;
}

export function TornadoChart({ drivers, baseline, cur = "" }: { drivers: TornadoDriver[]; baseline: number; cur?: string }) {
  if (drivers.length === 0) return null;
  const sorted = [...drivers].sort(
    (a, b) => Math.max(Math.abs(b.up - baseline), Math.abs(b.down - baseline)) - Math.max(Math.abs(a.up - baseline), Math.abs(a.down - baseline)),
  );
  const maxDev = Math.max(...sorted.map((d) => Math.max(Math.abs(d.up - baseline), Math.abs(d.down - baseline))), 1e-9);

  const W = 640;
  const rowH = 34;
  const H = sorted.length * rowH + 20;
  const centerX = W / 2;
  const halfTrack = W / 2 - 170;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Tornado sensitivity chart">
      <line x1={centerX} y1={4} x2={centerX} y2={H - 10} stroke={COLOR.grid} strokeWidth={1} />
      {sorted.map((d, i) => {
        const cy = 18 + i * rowH;
        const upWidth = (Math.max(0, d.up - baseline) / maxDev) * halfTrack;
        const downFromUpWidth = (Math.max(0, baseline - d.up) / maxDev) * halfTrack;
        const downWidth = (Math.max(0, d.down - baseline) / maxDev) * halfTrack;
        const downFromDownWidth = (Math.max(0, baseline - d.down) / maxDev) * halfTrack;
        const upOnRight = d.up >= baseline;
        const downOnRight = d.down >= baseline;
        return (
          <g key={d.label}>
            <text x={centerX - halfTrack - 8} y={cy + 4} textAnchor="end" fontSize="11" fill={COLOR.neutral}>
              {d.label}
            </text>
            <rect
              x={upOnRight ? centerX : centerX - downFromUpWidth}
              y={cy - 8}
              width={upOnRight ? upWidth : downFromUpWidth}
              height={16}
              fill={COLOR.positive}
              opacity={0.85}
            />
            <rect
              x={downOnRight ? centerX : centerX - downFromDownWidth}
              y={cy - 8}
              width={downOnRight ? downWidth : downFromDownWidth}
              height={16}
              fill={COLOR.danger}
              opacity={0.85}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ── 3. Time decay: a value declining/evolving over a horizon (e.g. cash runway) ──
export interface TimeDecayPoint {
  t: number;
  value: number;
}

export function TimeDecayChart({
  points,
  floorValue,
  floorLabel,
  targetT,
  targetLabel,
  cur = "",
}: {
  points: TimeDecayPoint[];
  floorValue?: number;
  floorLabel?: string;
  targetT?: number;
  targetLabel?: string;
  cur?: string;
}) {
  if (points.length === 0) return null;
  const W = 640, H = 220;
  const padL = 56, padR = 16, padT = 16, padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxT = Math.max(...points.map((p) => p.t), 1);
  const maxV = Math.max(...points.map((p) => p.value), floorValue ?? 0, 1);
  const x = (t: number) => padL + (t / maxT) * plotW;
  const y = (v: number) => padT + plotH - (v / maxV) * plotH;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.t)} ${y(p.value)}`).join(" ");
  const areaPath = `${path} L ${x(maxT)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Time decay chart">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={padL} y1={padT + plotH * (1 - f)} x2={W - padR} y2={padT + plotH * (1 - f)} stroke={COLOR.track} strokeWidth={1} />
          <text x={padL - 6} y={padT + plotH * (1 - f) + 4} textAnchor="end" fontSize="9.5" fill={COLOR.muted}>
            {fmtChartNum(maxV * f, cur)}
          </text>
        </g>
      ))}
      <path d={areaPath} fill={COLOR.accent} opacity={0.12} />
      <path d={path} fill="none" stroke={COLOR.accent} strokeWidth={2} />
      {floorValue !== undefined && (
        <>
          <line x1={padL} y1={y(floorValue)} x2={W - padR} y2={y(floorValue)} stroke={COLOR.danger} strokeWidth={1} strokeDasharray="4 3" />
          <text x={W - padR} y={y(floorValue) - 4} textAnchor="end" fontSize="9.5" fill={COLOR.danger}>
            {floorLabel ?? "Floor"}
          </text>
        </>
      )}
      {targetT !== undefined && targetT <= maxT && (
        <>
          <line x1={x(targetT)} y1={padT} x2={x(targetT)} y2={padT + plotH} stroke={COLOR.warning} strokeWidth={1} strokeDasharray="3 3" />
          <text x={x(targetT)} y={padT - 4} textAnchor="middle" fontSize="9.5" fill={COLOR.warning}>
            {targetLabel ?? `t=${targetT}`}
          </text>
        </>
      )}
      <text x={padL} y={H - 8} fontSize="10" fill={COLOR.muted}>0</text>
      <text x={W - padR} y={H - 8} textAnchor="end" fontSize="10" fill={COLOR.muted}>{maxT.toFixed(0)}</text>
    </svg>
  );
}

// ── 4. KPI Gauges: 2-3 radial gauges + flat status cards ──
function gaugeArc(pct: number, r: number, cx: number, cy: number): string {
  const clamped = Math.max(0, Math.min(1, pct));
  const angle = Math.PI - clamped * Math.PI;
  const startX = cx - r, startY = cy;
  const endX = cx + r * Math.cos(angle), endY = cy - r * Math.sin(angle);
  const largeArc = clamped > 0.5 ? 1 : 0;
  return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
}

export interface KpiGaugeSpec {
  label: string;
  valueLabel: string;
  pct: number; // 0..1 fill
  color: string;
}

export function KpiGauges({ items }: { items: KpiGaugeSpec[] }) {
  if (items.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 8 }}>
      {items.map((g) => (
        <div key={g.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 128 }}>
          <svg viewBox="0 0 128 78" style={{ width: "100%", height: "auto" }} role="img" aria-label={g.label}>
            <path d={gaugeArc(1, 52, 64, 64)} fill="none" stroke={COLOR.track} strokeWidth={12} strokeLinecap="round" />
            <path d={gaugeArc(g.pct, 52, 64, 64)} fill="none" stroke={g.color} strokeWidth={12} strokeLinecap="round" />
            <text x={64} y={58} textAnchor="middle" fontSize="15" fontFamily="monospace" fill={COLOR.text} fontWeight={700}>
              {g.valueLabel}
            </text>
          </svg>
          <span style={{ fontSize: 11.5, color: COLOR.neutral, marginTop: 4, textAlign: "center" }}>{g.label}</span>
        </div>
      ))}
    </div>
  );
}

export const CHART_COLOR = COLOR;
