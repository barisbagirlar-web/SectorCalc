// SectorCalc PRO Report — Pareto Chart (ISO 7870)
// SVG bar chart with cumulative percentage line, dual axis.
// Pure presentational — no side effects.

export interface ParetoSegment {
  label: string;
  value: number;
}

interface ParetoChartProps {
  segments: ParetoSegment[];
  title?: string;
  currencySymbol?: string;
  emptyLabel?: string;
}

function fmtVal(v: number): string {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + "M";
  if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(0) + "k";
  return v.toFixed(0);
}

export function ParetoChart({
  segments,
  title = "Cost Breakdown — Pareto",
  currencySymbol = "$",
  emptyLabel = "No breakdown data available.",
}: ParetoChartProps) {
  if (!segments || segments.length === 0) {
    return (
      <div className="pro-report-sec">
        <div className="pro-report-sec-h">
          <span className="pro-report-sec-n">P</span>
          <span className="pro-report-sec-t">{title}</span>
        </div>
        <p className="pro-report-empty">{emptyLabel}</p>
      </div>
    );
  }

  const sorted = [...segments].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const total = sorted.reduce((s, seg) => s + Math.abs(seg.value), 0);
  if (total <= 0) {
    return (
      <div className="pro-report-sec">
        <div className="pro-report-sec-h">
          <span className="pro-report-sec-n">P</span>
          <span className="pro-report-sec-t">{title}</span>
        </div>
        <p className="pro-report-empty">All values are zero — nothing to distribute.</p>
      </div>
    );
  }

  const maxVal = Math.max(...sorted.map((s) => Math.abs(s.value)));

  const W = 640;
  const H = 240;
  const padL = 8;
  const padR = 54;
  const padT = 12;
  const padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = sorted.length;
  const barW = Math.max(8, plotW / (n + 1) - 10);
  const barGap = (plotW - barW * n) / (n + 1);

  const barY = (v: number) => padT + plotH - (Math.abs(v) / maxVal) * plotH;

  let cumulative = 0;

  return (
    <div className="pro-report-sec">
      <div className="pro-report-sec-h">
        <span className="pro-report-sec-n">P</span>
        <span className="pro-report-sec-t">{title}</span>
      </div>
      <div className="pro-report-pareto-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Pareto chart">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padT + plotH - pct * plotH;
            return (
              <g key={pct}>
                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#E4E0D6" strokeWidth={1} />
                <text x={W - padR + 6} y={y + 3} fontSize="9" fill="#8C887E" fontFamily="JetBrains Mono, monospace">
                  {(pct * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {sorted.map((seg, i) => {
            const x = padL + i * (barW + barGap) + barGap;
            const yTop = barY(seg.value);
            const h = Math.max(1, padT + plotH - yTop);
            const pctShare = (100 * Math.abs(seg.value)) / total;
            cumulative += pctShare;
            return (
              <g key={seg.label}>
                <rect x={x} y={yTop} width={barW} height={h} fill={seg.value < 0 ? "#9C3520" : "#C15F3C"} />
                <text
                  x={x + barW / 2}
                  y={yTop - 5}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                  fill="#181713"
                >
                  {fmtVal(seg.value)}
                </text>
                <text
                  x={x + barW / 2}
                  y={H - padB + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#8C887E"
                >
                  {seg.label.length > 14 ? seg.label.slice(0, 12) + "…" : seg.label}
                </text>
                {/* Cumulative line point */}
                <circle
                  cx={x + barW / 2}
                  cy={padT + plotH - (cumulative / 100) * plotH}
                  r={3}
                  fill="#3A4D8F"
                />
              </g>
            );
          })}

          {/* Cumulative line */}
          <polyline
            points={sorted
              .map((_, i) => {
                const x = padL + i * (barW + barGap) + barGap + barW / 2;
                const cumPct = sorted
                  .slice(0, i + 1)
                  .reduce((s, seg) => s + (100 * Math.abs(seg.value)) / total, 0);
                const y = padT + plotH - (cumPct / 100) * plotH;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#3A4D8F"
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
        </svg>
      </div>
      <p className="pro-report-note">
        Bars ranked by magnitude; dashed line shows cumulative share. When a small number of
        components account for most of the total (the 80/20 pattern), fixing those first gives
        the largest return for the least effort.
      </p>
    </div>
  );
}
