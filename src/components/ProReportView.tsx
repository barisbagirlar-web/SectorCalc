// SectorCalc PRO Report View — V1
// Tool-agnostic report renderer from x1.html reference design.
// Pure presentational — no side effects, no demo data.
// Sections render only when their props are provided.

import { KpiScorecard, type KpiCard } from "@/components/report-charts/KpiScorecard";
import { SensitivityBars, type SensitivityDriver } from "@/components/report-charts/SensitivityBars";
import { ParetoChart, type ParetoSegment } from "@/components/report-charts/ParetoChart";
import { ControlBand } from "@/components/report-charts/ControlBand";

// ── Type exports ───────────────────────────────────────────────────────────

export type VerdictStatus = "go" | "review" | "block";

export interface VerdictData {
  status: VerdictStatus;
  headline: string;
  body: string[];
}

export interface BenchmarkEntry {
  name: string;
  value: number;
  refRange: string;
  source: string;
}

export interface InsightEntry {
  severity: "critical" | "opportunity" | "info";
  headline: string;
  body: string;
}

export interface UncertaintyData {
  total: number;
  band: string;
  method: string;
}

// ── Props ──────────────────────────────────────────────────────────────────

export interface ProReportViewProps {
  toolTitle: string;
  toolSubtitle: string;
  toolScope: string;
  engineLabel: string;
  assertionLabel: string;
  methodLabel: string;
  currencySymbol: string;
  onCurrencyChange?: (code: string) => void;
  supportedCurrencies?: Array<{ code: string; sym: string; name: string }>;

  // Verdict (primary result display)
  verdict?: VerdictData;

  // KPIs
  kpis?: KpiCard[];
  verdictStatus?: VerdictStatus;
  verdictLabel?: string;

  // Benchmarks
  benchmarks?: BenchmarkEntry[];

  // Sensitivity
  sensitivityDrivers?: SensitivityDriver[];

  // Pareto / cost breakdown
  paretoSegments?: ParetoSegment[];

  // Control band (SPC)
  controlBand?: {
    label: string;
    value: number;
    unit: string | null;
    lcl: number;
    ucl: number;
    specLow?: number;
    specHigh?: number;
  };

  // Insights
  insights?: InsightEntry[];

  // Uncertainty (ISO GUM)
  uncertainty?: UncertaintyData;

  // Structure: cost table rows (left column) and stats (right column) for x1 bench layout
  costTableRows?: Array<{ label: string; value: string; sub?: string }>;
  stats?: Array<{ label: string; value: string }>;
  statsTitle?: string;

  // Report identity
  reportId: string;
  timestamp: string;
  sealHash: string;

  // Disclaimer text
  disclaimer?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const CURRENCIES_DEFAULT = [
  { code: "EUR", sym: "€", name: "Euro" },
  { code: "USD", sym: "$", name: "US dollar" },
  { code: "GBP", sym: "£", name: "British pound" },
  { code: "TRY", sym: "₺", name: "Turkish lira" },
  { code: "INR", sym: "₹", name: "Indian rupee" },
  { code: "JPY", sym: "¥", name: "Japanese yen" },
  { code: "CNY", sym: "¥", name: "Chinese yuan" },
  { code: "AUD", sym: "A$", name: "Australian dollar" },
  { code: "CAD", sym: "C$", name: "Canadian dollar" },
  { code: "CHF", sym: "CHF", name: "Swiss franc" },
  { code: "SEK", sym: "kr", name: "Swedish krona" },
  { code: "AED", sym: "AED", name: "UAE dirham" },
];

const DEFAULT_DISCLAIMER =
  "Technical simulation for engineering and financial decision support. " +
  "Not a substitute for professional accounting or engineering review. " +
  "All figures should be verified against source documents before business decisions.";

/** "go"/"review"/"block" → verdict-band CSS class. */
function verdictBandClass(status: VerdictStatus): string {
  if (status === "go") return "go";
  if (status === "block") return "block";
  return "review";
}

/**
 * Format an output value for display — returns "—" for null/non-finite.
 * Matches display conventions in the rest of the form (integers = 0 decimals,
 * small numbers = up to 2 decimal places).
 */
function fmtOut(value: string | number | null | undefined): string {
  if (value == null) return "—";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "—";
    if (value === Math.floor(value) && Math.abs(value) < 1e12) {
      return value.toLocaleString("en-US");
    }
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  return String(value);
}

// ── Component ──────────────────────────────────────────────────────────────

export function ProReportView({
  toolTitle,
  toolSubtitle,
  toolScope,
  engineLabel,
  assertionLabel,
  methodLabel,
  currencySymbol,
  onCurrencyChange,
  supportedCurrencies,
  verdict,
  kpis,
  verdictStatus,
  verdictLabel: vLabel,
  benchmarks,
  sensitivityDrivers,
  paretoSegments,
  controlBand,
  insights,
  uncertainty,
  costTableRows,
  stats,
  statsTitle,
  reportId,
  timestamp,
  sealHash,
  disclaimer,
}: ProReportViewProps) {
  const currencies = supportedCurrencies ?? CURRENCIES_DEFAULT;
  const discText = disclaimer ?? DEFAULT_DISCLAIMER;

  return (
    <div className="pro-report-shell">

      {/*
        ── MASTHEAD ───────────────────────────────────────
        Renders when toolTitle is provided.
      */}
      {toolTitle && (
        <div className="pro-report-mast">
          <div className="pro-report-kicker">{toolSubtitle || "SectorCalc PRO"}</div>
          <h1>{toolTitle}</h1>
          {toolScope && <p className="pro-report-lede">{toolScope}</p>}
          <div className="pro-report-meta">
            {engineLabel && <span>Engine <b>{engineLabel}</b></span>}
            {assertionLabel && <span>{assertionLabel}</span>}
            <span>Report <b>sealed · SHA-256</b></span>
            {methodLabel && <span>Method <b>{methodLabel}</b></span>}
          </div>
          <div className="pro-report-curbar">
            <label htmlFor="pro-report-cur-select">Report currency</label>
            <select
              id="pro-report-cur-select"
              value={currencySymbol}
              onChange={(e) => onCurrencyChange?.(e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.sym}>
                  {c.code} · {c.sym} {c.name}
                </option>
              ))}
            </select>
            <span className="pro-report-curnote">
              Symbol only — no exchange-rate conversion applied. Enter every figure in the same currency.
            </span>
          </div>
        </div>
      )}

      {/*
        ── VERDICT + STATS (rail panel) ───────────────────
        Renders when verdict is provided.
      */}
      {verdict && (
        <div className="pro-report-verdict" id="pro-report-verdict">
          <div className={`pro-report-verdict-band ${verdictBandClass(verdict.status)}`}>
            {verdict.status === "go" ? "GO" : verdict.status === "review" ? "REVIEW" : "BLOCK"}
          </div>
          <div className="pro-report-verdict-body">
            <div className="pro-report-big">
              {verdict.headline}
            </div>
            {verdict.body.map((line, i) => (
              <div key={i} className="pro-report-big-cap">{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Stats block */}
      {stats && stats.length > 0 && (
        <div>
          {stats.map((s, i) => (
            <div key={i} className="pro-report-stat">
              <span>{s.label}</span>
              <b>{s.value}</b>
            </div>
          ))}
        </div>
      )}

      {/*
        ── KPI SCORECARD ──────────────────────────────────
        Renders when kpis array is provided and non-empty.
      */}
      {kpis && kpis.length > 0 && (
        <KpiScorecard
          cards={kpis}
          verdictStatus={verdictStatus}
          verdictLabel={vLabel}
        />
      )}

      {/*
        ── VERDICT BOX ────────────────────────────────────
        Renders when verdict has headline and body.
      */}
      {verdict && (verdict.headline || verdict.body.length > 0) && (
        <div className="pro-report-sec">
          <div className="pro-report-sec-h">
            <span className="pro-report-sec-n">R</span>
            <span className="pro-report-sec-t">Result Summary</span>
          </div>
          <div className="pro-report-verdict-box">
            {verdict.headline && <div className="head">{verdict.headline}</div>}
            {verdict.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      )}

      {/*
        ── REPORT BODY ────────────────────────────────────
        Full report with sections.
        Only rendered when either costTableRows or stats are provided.
      */}
      {(costTableRows || stats || sensitivityDrivers || paretoSegments || insights || controlBand || uncertainty) && (
        <>
          <div className="pro-report-rep-mast">
            <h2>{toolTitle} — Proof Report</h2>
            <div className="pro-report-rid">
              {reportId}<br />
              {timestamp}<br />
              {engineLabel && <>engine {engineLabel}</>}{assertionLabel && <> · {assertionLabel}</>}<br />
              currency {currencySymbol} · {methodLabel || "standard costing"}
            </div>
          </div>

          <div className="pro-report-rep-body">

            {/* Cost structure table */}
            {costTableRows && costTableRows.length > 0 && (
              <div className="pro-report-sec">
                <div className="pro-report-sec-h">
                  <span className="pro-report-sec-n">1</span>
                  <span className="pro-report-sec-t">Cost Structure</span>
                </div>
                <div className="pro-report-table-wrap">
                  <table className="pro-report-table">
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th style={{ textAlign: "right" }}>{currencySymbol}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costTableRows.map((row, i) => (
                        <tr key={i} className={row.sub === "total" ? "pro-report-total" : ""}>
                          <td>{row.label}</td>
                          <td className="n">{row.value || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Benchmarks */}
            {benchmarks && benchmarks.length > 0 && (
              <div className="pro-report-sec">
                <div className="pro-report-sec-h">
                  <span className="pro-report-sec-n">B</span>
                  <span className="pro-report-sec-t">Benchmarks</span>
                </div>
                <div className="pro-report-table-wrap">
                  <table className="pro-report-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th style={{ textAlign: "right" }}>Value</th>
                        <th>Reference Range</th>
                        <th>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarks.map((b, i) => (
                        <tr key={i}>
                          <td>{b.name}</td>
                          <td className="n">{fmtOut(b.value)}</td>
                          <td>{b.refRange}</td>
                          <td>{b.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Uncertainty (ISO GUM) */}
            {uncertainty && (
              <div className="pro-report-sec">
                <div className="pro-report-sec-h">
                  <span className="pro-report-sec-n">U</span>
                  <span className="pro-report-sec-t">Measurement Uncertainty (ISO GUM / IEC 98-3)</span>
                </div>
                <div className="pro-report-table-wrap">
                  <table className="pro-report-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th style={{ textAlign: "right" }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Combined Standard Uncertainty</td>
                        <td className="n">{fmtOut(uncertainty.total)}</td>
                      </tr>
                      <tr>
                        <td>Coverage Band</td>
                        <td className="n">{uncertainty.band}</td>
                      </tr>
                      <tr>
                        <td>Method</td>
                        <td className="n">{uncertainty.method}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sensitivity bars */}
            {sensitivityDrivers && sensitivityDrivers.length > 0 && (
              <SensitivityBars
                drivers={sensitivityDrivers}
                currencySymbol={currencySymbol}
              />
            )}

            {/* Pareto chart */}
            {paretoSegments && paretoSegments.length > 0 && (
              <ParetoChart
                segments={paretoSegments}
                currencySymbol={currencySymbol}
              />
            )}

            {/* Control band */}
            {controlBand && (
              <ControlBand
                label={controlBand.label}
                value={controlBand.value}
                unit={controlBand.unit}
                lcl={controlBand.lcl}
                ucl={controlBand.ucl}
                specLow={controlBand.specLow}
                specHigh={controlBand.specHigh}
              />
            )}

            {/* Insights */}
            {insights && insights.length > 0 && (
              <div className="pro-report-sec">
                <div className="pro-report-sec-h">
                  <span className="pro-report-sec-n">I</span>
                  <span className="pro-report-sec-t">Engineering Insights</span>
                </div>
                {insights.map((ins, i) => {
                  let cssClass = "info";
                  if (ins.severity === "critical") cssClass = "crit";
                  else if (ins.severity === "opportunity") cssClass = "opp";
                  return (
                    <div key={i} className={`pro-report-ins ${cssClass}`}>
                      <span className="t">
                        {ins.severity === "critical" ? "critical" : ins.severity === "opportunity" ? "opportunity" : "context"}
                      </span>
                      <strong>{ins.headline}</strong> {ins.body}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Seal */}
            <div className="pro-report-seal">
              SEAL · SHA-256 {sealHash}<br />
              Inputs and outputs are hashed together; altering any figure changes the seal.
              Verify at sectorcalc.com/verify — production seals are computed server-side.
            </div>

            {/* Disclaimer */}
            <div className="pro-report-disc">{discText}</div>

          </div>
        </>
      )}
    </div>
  );
}

export default ProReportView;
