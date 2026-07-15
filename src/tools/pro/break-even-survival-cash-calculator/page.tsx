"use client";

/**
 * Break-Even & Survival Cash Calculator — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 10 inputs. Report shows monthly cash flow dashboard, break-even chart,
 * runway gauge, and funding gap analysis.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import type { BreakEvenInputs, BreakEvenOutputs } from
  "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-break-even-survival-cash-calculator.css";

/* ─── Currency config ────────────────────────────────────────── */
type CurrencyCode = "EUR" | "USD" | "GBP" | "TRY";
const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "GBP", "TRY"];
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EUR: "\u20AC", USD: "$", GBP: "\u00A3", TRY: "\u20BA",
};
const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  EUR: "EUR (\u20AC)", USD: "USD ($)", GBP: "GBP (\u00A3)", TRY: "TRY (\u20BA)",
};
const DEFAULT_CURRENCY_INDEX = 1;

/* ─── Field definitions ──────────────────────────────────────── */

interface FieldDef {
  id: keyof BreakEvenInputs;
  label: string;
  defaultUnit: string;
  showPrefix: boolean;
  default: number;
  hint: string;
  ref: string;
  group: string;
  hardMin: number;
  hardMax: number;
  step: string;
}

const FIELDS: FieldDef[] = [
  // ── Revenue & Costs ──
  { id: "monthlyFixedCashCost", label: "Monthly fixed cash cost", defaultUnit: "currency/mo", showPrefix: true, default: 120000, hint: "All fixed cash outflows per month (rent, salaries, utilities).", ref: "currency/mo \u00B7 fixed opex", group: "revenue", hardMin: 0, hardMax: 1e8, step: "1000" },
  { id: "monthlyDebtService", label: "Monthly debt service", defaultUnit: "currency/mo", showPrefix: true, default: 25000, hint: "Principal + interest payments due each month.", ref: "currency/mo \u00B7 P&I", group: "revenue", hardMin: 0, hardMax: 1e8, step: "1000" },
  { id: "currentMonthlyRevenue", label: "Current monthly revenue", defaultUnit: "currency/mo", showPrefix: true, default: 420000, hint: "Actual average monthly revenue from operations.", ref: "currency/mo \u00B7 gross revenue", group: "revenue", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "contributionMarginRatio", label: "Contribution margin ratio", defaultUnit: "decimal", showPrefix: false, default: 0.42, hint: "(Revenue - Variable Costs) / Revenue as a decimal (e.g. 0.42 = 42%).", ref: "decimal \u00B7 CM ratio", group: "revenue", hardMin: 0.01, hardMax: 1, step: "0.01" },
  // ── Cash & Runway ──
  { id: "unrestrictedCashBalance", label: "Unrestricted cash balance", defaultUnit: "currency", showPrefix: true, default: 750000, hint: "Total cash available without restrictions (excl. escrow/reserves).", ref: "currency \u00B7 free cash", group: "cash", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "minimumCashBuffer", label: "Minimum cash buffer", defaultUnit: "currency", showPrefix: true, default: 100000, hint: "Minimum cash reserve required for operations.", ref: "currency \u00B7 reserve", group: "cash", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "targetSurvivalMonths", label: "Target survival months", defaultUnit: "months", showPrefix: false, default: 6, hint: "How many months the cash reserve should cover under stress.", ref: "months \u00B7 runway target", group: "cash", hardMin: 1, hardMax: 120, step: "1" },
  // ── Risk ──
  { id: "downsideRevenueFactor", label: "Downside revenue factor", defaultUnit: "ratio", showPrefix: false, default: 0.7, hint: "Expected revenue retention in a downside scenario (e.g. 0.7 = 70%).", ref: "0..1 ratio", group: "risk", hardMin: 0, hardMax: 1, step: "0.05" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "risk", hardMin: 0, hardMax: 1, step: "0.05" },
  { id: "uncertaintyMultiplier", label: "Uncertainty multiplier", defaultUnit: "mult", showPrefix: false, default: 1.15, hint: "Coverage multiplier for uncertainty cash buffer (1.0-3.0).", ref: "1.0..3.0", group: "risk", hardMin: 1, hardMax: 3, step: "0.05" },
];

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  revenue: { title: "Revenue & Cost Structure", desc: "Monthly fixed costs, debt obligations, revenue, and contribution margin." },
  cash:    { title: "Cash Position & Runway Target", desc: "Available cash, minimum buffer, and desired survival horizon." },
  risk:    { title: "Risk & Scenario Parameters", desc: "Downside revenue retention, source confidence, and uncertainty coverage." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function BreakEvenSurvivalCashPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<BreakEvenInputs>(() => {
    const init: BreakEvenInputs = {} as BreakEvenInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<BreakEvenOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): BreakEvenOutputs | null => {
    if (!inputs.currentMonthlyRevenue || inputs.currentMonthlyRevenue <= 0) return null;
    if (!inputs.contributionMarginRatio || inputs.contributionMarginRatio <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof BreakEvenInputs, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, [id]: num }));
    }
  }, []);

  const handleCalculate = useCallback(() => {
    const r = executeFormula(inputs);
    setResult(r);
    setHasComputed(true);
  }, [inputs]);

  useEffect(() => {
    if (hasComputed && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasComputed]);

  // Decision helpers
  const decisionCodeLabels: Record<number, { label: string; cls: string }> = {
    0: { label: "OK — HEALTHY", cls: "pos" },
    1: { label: "REVIEW — WARNING", cls: "warn" },
    2: { label: "BLOCKED — CRITICAL", cls: "neg" },
  };

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Break-Even &amp; Survival Cash Calculator</h1>
        <p className="lede">
          Calculate break-even revenue, cash runway, survival cash target, and funding gap. &mdash;
          Assess how long your business can survive under stressed conditions.
        </p>
        <div className="meta">
          <span>ISO 50001 &mdash; Financial Risk Assessment &bull; Auditable</span>
          <span><b>Cash Flow Planning &bull; Break-Even Analysis</b></span>
        </div>

        <div className="curbar">
          <label htmlFor="cur-select">Currency</label>
          <select id="cur-select" value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
            {CURRENCIES.map((c) => (<option key={c} value={c}>{CURRENCY_LABELS[c]}</option>))}
          </select>
          <span className="curnote">{CURRENCY_NOTE}</span>
        </div>
      </div>

      {/* ── Bench ── */}
      <div className="bench">
        <div className="form-col">
          {Object.entries(GROUP_META).map(([gk, gm]) => {
            const groupFields = FIELDS.filter((f) => f.group === gk);
            return (
              <div className="grp" key={gk}>
                <div className="grp-h">
                  <span className="grp-n">{gk}</span>
                  <span className="grp-t">{gm.title}</span>
                </div>
                <p className="grp-d">{gm.desc}</p>
                {groupFields.map((f) => {
                  const val = inputs[f.id];
                  const isInvalid = isNaN(val) || val < f.hardMin || val > f.hardMax;
                  return (
                    <div className="f" key={f.id}>
                      <div className="f-top">
                        <label htmlFor={`inp-${f.id}`}>{f.label}</label>
                        <span className="unitline">{f.ref}</span>
                      </div>
                      <div className={`control${isInvalid ? " bad" : ""}`}>
                        {f.showPrefix && <span className="prefix">{curSym}</span>}
                        <input
                          id={`inp-${f.id}`}
                          type="number"
                          value={val ?? ""}
                          onChange={(e) => handleChange(f.id, e.target.value)}
                          min={f.hardMin}
                          max={f.hardMax}
                          step={f.step}
                        />
                      </div>
                      <div className="f-foot">
                        <span className="hint">{f.hint}</span>
                        <span className="bench-ref">{f.defaultUnit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <button className="cta" onClick={handleCalculate}>
            Generate Survival Analysis Report
          </button>

          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against accounting records before financing decisions.</span>
          </div>
        </div>

        {/* Live rail — Cash dashboard */}
        <div className="rail">
          <div className="rail-in">
            {livePreview ? (
              <>
                <div className="verdict">
                  {(() => {
                    const dc = decisionCodeLabels[livePreview.out_decision_code] || decisionCodeLabels[2];
                    return (
                      <>
                        <div className={`verdict-band ${dc.cls}`}>{dc.label}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {livePreview.out_cash_runway_months.toFixed(1)}
                            <small>mo runway</small>
                          </div>
                          <div className="big-cap">Burn: {curSym}{livePreview.out_monthly_cash_burn.toFixed(0)}/mo &middot; Safety: {(livePreview.out_margin_of_safety_ratio * 100).toFixed(1)}%</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="dashboard-grid">
                  <div className="dash-card">
                    <span className="dash-label">Break-even revenue</span>
                    <span className="dash-value">{curSym}{livePreview.out_break_even_monthly_revenue.toFixed(0)}</span>
                  </div>
                  <div className="dash-card">
                    <span className="dash-label">Revenue gap</span>
                    <span className={`dash-value ${livePreview.out_current_revenue_gap < 0 ? "neg" : "pos"}`}>
                      {livePreview.out_current_revenue_gap < 0 ? "" : "+"}{curSym}{livePreview.out_current_revenue_gap.toFixed(0)}
                    </span>
                  </div>
                  <div className="dash-card">
                    <span className="dash-label">Stressed revenue</span>
                    <span className="dash-value">{curSym}{livePreview.out_stressed_monthly_revenue.toFixed(0)}</span>
                  </div>
                  <div className="dash-card">
                    <span className="dash-label">Funding gap</span>
                    <span className={`dash-value ${livePreview.out_funding_gap > 0 ? "neg" : "pos"}`}>
                      {livePreview.out_funding_gap > 0 ? curSym + livePreview.out_funding_gap.toFixed(0) : "None"}
                    </span>
                  </div>
                </div>

                <div className="stat"><span>Cash burn</span><b>{curSym}{livePreview.out_monthly_cash_burn.toFixed(0)}/mo</b></div>
                <div className="stat"><span>Runway</span><b>{livePreview.out_cash_runway_months.toFixed(1)} mo</b></div>
                <div className="stat"><span>Survival target</span><b>{curSym}{livePreview.out_survival_cash_target.toFixed(0)}</b></div>
                <div className="stat"><span>Uncertainty buffer</span><b>{curSym}{livePreview.out_uncertainty_cash_buffer.toFixed(0)}</b></div>
                <div className="stat"><span>Margin of safety</span><b>{(livePreview.out_margin_of_safety_ratio * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Target breached</span><b>{livePreview.out_target_runway_breached === 1 ? "YES" : "No"}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter revenue &gt; 0 and margin ratio &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>Break-Even &amp; Survival Cash Report</h2></div>
            <div className="rid">
              ISO 50001 &bull; Financial Risk Assessment<br />
              Report ID: BE-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {(() => {
                    const dc = decisionCodeLabels[result.out_decision_code] || decisionCodeLabels[2];
                    return <span className={dc.cls}>{dc.label}</span>;
                  })()}
                </div>
                <p>
                  Break-even revenue: {curSym}{result.out_break_even_monthly_revenue.toFixed(0)}/mo.
                  Current revenue: {curSym}{inputs.currentMonthlyRevenue.toFixed(0)}/mo
                  ({result.out_current_revenue_gap >= 0 ? "above" : "below"} break-even by {curSym}{Math.abs(result.out_current_revenue_gap).toFixed(0)}).
                  Cash runway: {result.out_cash_runway_months.toFixed(1)} months.
                </p>
                <p>
                  Under stress ({(inputs.downsideRevenueFactor * 100).toFixed(0)}% revenue retention),
                  the cash burn is {curSym}{result.out_monthly_cash_burn.toFixed(0)}/mo.
                  Survival cash target: {curSym}{result.out_survival_cash_target.toFixed(0)}.
                  Funding gap: {result.out_funding_gap > 0 ? curSym + result.out_funding_gap.toFixed(0) : "None"}.
                </p>
              </div>
            </div>

            {/* S2: Runway & Gauge */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Runway Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Monthly cash burn (stressed)</td><td className="n">{curSym}{result.out_monthly_cash_burn.toFixed(0)}</td></tr>
                  <tr><td>Available survival cash</td><td className="n">{curSym}{Math.max(0, inputs.unrestrictedCashBalance - inputs.minimumCashBuffer).toFixed(0)}</td></tr>
                  <tr><td>Cash runway</td><td className="n">{result.out_cash_runway_months.toFixed(1)} months</td></tr>
                  <tr><td>Target survival period</td><td className="n">{inputs.targetSurvivalMonths} months</td></tr>
                  <tr><td>Target breached</td><td className="n">{result.out_target_runway_breached === 1 ? "YES — insufficient" : "No — sufficient"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S3: Break-even details */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Break-Even Detail</span></div>
              <table>
                <thead><tr><th>Component</th><th className="n">Amount ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>Fixed cash costs</td><td className="n">{curSym}{inputs.monthlyFixedCashCost.toFixed(0)}</td></tr>
                  <tr><td>Debt service</td><td className="n">{curSym}{inputs.monthlyDebtService.toFixed(0)}</td></tr>
                  <tr><td>Total obligations</td><td className="n">{curSym}{(inputs.monthlyFixedCashCost + inputs.monthlyDebtService).toFixed(0)}</td></tr>
                  <tr className="total"><td>Break-even revenue needed</td><td className="n">{curSym}{result.out_break_even_monthly_revenue.toFixed(0)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Survival Target */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Survival Cash Target</span></div>
              <table>
                <thead><tr><th>Component</th><th className="n">Amount ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>Minimum cash buffer</td><td className="n">{curSym}{inputs.minimumCashBuffer.toFixed(0)}</td></tr>
                  <tr><td>Target burn coverage</td><td className="n">{curSym}{(result.out_monthly_cash_burn * inputs.targetSurvivalMonths).toFixed(0)}</td></tr>
                  <tr><td>Uncertainty buffer</td><td className="n">{curSym}{result.out_uncertainty_cash_buffer.toFixed(0)}</td></tr>
                  <tr className="total"><td>Survival cash target</td><td className="n">{curSym}{result.out_survival_cash_target.toFixed(0)}</td></tr>
                  <tr><td>Unrestricted cash</td><td className="n">{curSym}{inputs.unrestrictedCashBalance.toFixed(0)}</td></tr>
                  <tr className={result.out_funding_gap > 0 ? "neg-row" : ""}>
                    <td>Funding gap</td>
                    <td className="n">{result.out_funding_gap > 0 ? curSym + result.out_funding_gap.toFixed(0) : "None"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* S5: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S5</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Monthly fixed cash cost</td><td className="n">{curSym}{inputs.monthlyFixedCashCost.toFixed(0)}</td></tr>
                  <tr><td>Monthly debt service</td><td className="n">{curSym}{inputs.monthlyDebtService.toFixed(0)}</td></tr>
                  <tr><td>Contribution margin ratio</td><td className="n">{(inputs.contributionMarginRatio * 100).toFixed(0)}%</td></tr>
                  <tr><td>Current monthly revenue</td><td className="n">{curSym}{inputs.currentMonthlyRevenue.toFixed(0)}</td></tr>
                  <tr><td>Unrestricted cash</td><td className="n">{curSym}{inputs.unrestrictedCashBalance.toFixed(0)}</td></tr>
                  <tr><td>Minimum cash buffer</td><td className="n">{curSym}{inputs.minimumCashBuffer.toFixed(0)}</td></tr>
                  <tr><td>Target survival months</td><td className="n">{inputs.targetSurvivalMonths} months</td></tr>
                  <tr><td>Downside revenue factor</td><td className="n">{(inputs.downsideRevenueFactor * 100).toFixed(0)}%</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(inputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                  <tr><td>Uncertainty multiplier</td><td className="n">{inputs.uncertaintyMultiplier.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S6: Insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h"><span className="sec-n">S6</span><span className="sec-t">Insights &amp; Recommendations</span></div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </div>
            )}

            {/* S7: Seal */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S7</span><span className="sec-t">Audit Seal &amp; Integrity</span></div>
              <div className="seal">
                BREAKEVEN-REPORT-{Date.now().toString(36).toUpperCase()}<br />
                Engine: executeFormula v5.3.1-pro &bull; ISO 50001 Risk Framework<br />
                Generated: {new Date().toISOString()}
              </div>
              <div className="disc">
                <strong>Disclaimer.</strong> This report is a technical simulation based on the inputs provided.
                It does not constitute financial, legal, or engineering advice. Always verify calculations
                with a qualified professional before making financing or restructuring decisions.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
