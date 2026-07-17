// SectorCalc PRO Report — KPI Scorecard (ISO 22400-2)
// Traffic-light KPI cards with dimensional unit tags and gate band.
// Pure presentational — no side effects.

export interface KpiCard {
  label: string;
  value: string | number;
  unit: string | null;
  state?: "pos" | "warn" | "neg";
}

interface KpiScorecardProps {
  cards: KpiCard[];
  verdictStatus?: "go" | "review" | "block";
  verdictLabel?: string;
  emptyLabel?: string;
}

export function KpiScorecard({
  cards,
  verdictStatus,
  verdictLabel,
  emptyLabel = "No metrics available.",
}: KpiScorecardProps) {
  if (!cards || cards.length === 0) {
    return (
      <div className="pro-report-sec">
        <div className="pro-report-sec-h">
          <span className="pro-report-sec-n">—</span>
          <span className="pro-report-sec-t">Key Performance Indicators</span>
        </div>
        <p className="pro-report-empty">{emptyLabel}</p>
      </div>
    );
  }

  const unitTag = (u: string | null): string => {
    if (!u) return "";
    const clean = u.trim();
    if (clean.startsWith("[") && clean.endsWith("]")) return clean;
    return `[${clean}]`;
  };

  return (
    <div className="pro-report-sec">
      <div className="pro-report-sec-h">
        <span className="pro-report-sec-n">KPI</span>
        <span className="pro-report-sec-t">Key Performance Indicators</span>
      </div>
      <div className="pro-report-kpi-grid">
        {cards.map((card, i) => {
          const stateClass = card.state ? `state-${card.state}` : "";
          const fmtVal =
            typeof card.value === "number" && Number.isFinite(card.value)
              ? card.value.toLocaleString("en-US", {
                  maximumFractionDigits: Math.abs(card.value) >= 100 ? 0 : 2,
                })
              : String(card.value);
          return (
            <div key={i} className={`pro-report-kpi-card ${stateClass}`}>
              <div className="pro-report-kpi-label">{card.label}</div>
              <div className="pro-report-kpi-value">{fmtVal}</div>
              {card.unit && <div className="pro-report-kpi-unit">{unitTag(card.unit)}</div>}
            </div>
          );
        })}
      </div>
      {verdictStatus && (
        <div className={`pro-report-gate-band ${verdictStatus}`}>
          {verdictLabel || verdictStatus}
        </div>
      )}
    </div>
  );
}
