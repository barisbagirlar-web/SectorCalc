// SectorCalc PRO Report — Sensitivity Bars
// Horizontal bar chart showing ±impact of each input on a target metric.
// Pure presentational — no side effects.

export interface SensitivityDriver {
  label: string;
  span: number;
}

interface SensitivityBarsProps {
  drivers: SensitivityDriver[];
  currencySymbol?: string;
  emptyLabel?: string;
}

export function SensitivityBars({
  drivers,
  currencySymbol = "$",
  emptyLabel = "No sensitivity data available.",
}: SensitivityBarsProps) {
  if (!drivers || drivers.length === 0) {
    return (
      <div className="pro-report-sec">
        <div className="pro-report-sec-h">
          <span className="pro-report-sec-n">—</span>
          <span className="pro-report-sec-t">Sensitivity Analysis</span>
        </div>
        <p className="pro-report-empty">{emptyLabel}</p>
      </div>
    );
  }

  const maxSpan = Math.max(...drivers.map((d) => Math.abs(d.span)), 1e-9);

  const fmtSpan = (v: number): string => {
    if (!Number.isFinite(v)) return "—";
    if (Math.abs(v) >= 1000) return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
    return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  return (
    <div className="pro-report-sec">
      <div className="pro-report-sec-h">
        <span className="pro-report-sec-n">S</span>
        <span className="pro-report-sec-t">Sensitivity Analysis (±10% each input)</span>
      </div>
      <div className="pro-report-bars">
        {drivers.map((d, i) => {
          const pct = (100 * Math.abs(d.span)) / maxSpan;
          return (
            <div key={i} className="row">
              <span className="nm">{d.label}</span>
              <div className="tk">
                <div className="b" style={{ width: `${Math.max(2, pct)}%` }} />
              </div>
              <span className="vv">
                ±{currencySymbol}{fmtSpan(d.span / 2)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="pro-report-note">
        Ranked by impact for a ±10% change in each input, holding all others constant.
        Spend negotiation and improvement effort on the top bars first.
      </p>
    </div>
  );
}
