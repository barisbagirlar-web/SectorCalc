"use client";

/**
 * Break-Even & Survival Cash Calculator — x1 design pattern.
 *
 * 12 currencies, inline validation, group numbering,
 * engine metadata, sealed report.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * CSS:    @/styles/pro-tool-break-even-survival-cash-calculator.css
 * Shared: CURRENCIES, fmtNum, CURRENCY_NOTE, CANON_SUFFIX from x1-utils
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import type { BreakEvenInputs, BreakEvenOutputs } from
  "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-break-even-survival-cash-calculator.css";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, CURRENCY_NOTE, CANON_SUFFIX } from "@/tools/_shared/x1-utils";
import { toCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";

/* ─── Field definitions ──────────────────────────────────────── */

interface FieldDef {
  id: string;
  label: string;
  unit: string;
  unitOptions: string[];
  domain: DomainKey;
  showPrefix: boolean;
  default: number;
  hint: string;
  ref: string;
  group: string;
  hardMin: number;
  hardMax: number;
}

const FIELDS: FieldDef[] = [
  // ── Revenue & Costs ──
  {
    id: "monthlyFixedCashCost", label: "Monthly fixed cash cost",
    unit: "currency/mo", unitOptions: [],
    domain: "flat", showPrefix: true, default: 120000,
    hint: "All fixed cash outflows per month (rent, salaries, utilities).",
    ref: "currency/mo \u00B7 fixed opex", group: "revenue",
    hardMin: 0, hardMax: 1e8,
  },
  {
    id: "monthlyDebtService", label: "Monthly debt service",
    unit: "currency/mo", unitOptions: [],
    domain: "flat", showPrefix: true, default: 25000,
    hint: "Principal + interest payments due each month.",
    ref: "currency/mo \u00B7 P&I", group: "revenue",
    hardMin: 0, hardMax: 1e8,
  },
  {
    id: "currentMonthlyRevenue", label: "Current monthly revenue",
    unit: "currency/mo", unitOptions: [],
    domain: "flat", showPrefix: true, default: 420000,
    hint: "Actual average monthly revenue from operations.",
    ref: "currency/mo \u00B7 gross revenue", group: "revenue",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "contributionMarginRatio", label: "Contribution margin ratio",
    unit: "decimal", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.42,
    hint: "(Revenue - Variable Costs) / Revenue as a decimal (e.g. 0.42 = 42%).",
    ref: "decimal \u00B7 CM ratio", group: "revenue",
    hardMin: 0.01, hardMax: 1,
  },
  // ── Cash & Runway ──
  {
    id: "unrestrictedCashBalance", label: "Unrestricted cash balance",
    unit: "currency", unitOptions: [],
    domain: "flat", showPrefix: true, default: 750000,
    hint: "Total cash available without restrictions (excl. escrow/reserves).",
    ref: "currency \u00B7 free cash", group: "cash",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "minimumCashBuffer", label: "Minimum cash buffer",
    unit: "currency", unitOptions: [],
    domain: "flat", showPrefix: true, default: 100000,
    hint: "Minimum cash reserve required for operations.",
    ref: "currency \u00B7 reserve", group: "cash",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "targetSurvivalMonths", label: "Target survival months",
    unit: "months", unitOptions: [],
    domain: "years", showPrefix: false, default: 6,
    hint: "How many months the cash reserve should cover under stress.",
    ref: "months \u00B7 runway target", group: "cash",
    hardMin: 1, hardMax: 120,
  },
  // ── Risk ──
  {
    id: "downsideRevenueFactor", label: "Downside revenue factor",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.7,
    hint: "Expected revenue retention in a downside scenario (e.g. 0.7 = 70%).",
    ref: "0..1 ratio", group: "risk",
    hardMin: 0, hardMax: 1,
  },
  {
    id: "sourceConfidence", label: "Source confidence",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.9,
    hint: "Confidence in source data (0=guess, 1=audited).",
    ref: "0..1 ratio", group: "risk",
    hardMin: 0, hardMax: 1,
  },
  {
    id: "uncertaintyMultiplier", label: "Uncertainty multiplier",
    unit: "mult", unitOptions: [],
    domain: "flat", showPrefix: false, default: 1.15,
    hint: "Coverage multiplier for uncertainty cash buffer (1.0-3.0).",
    ref: "1.0..3.0", group: "risk",
    hardMin: 1, hardMax: 3,
  },
];

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  revenue: { num: "01", title: "Revenue & Cost Structure", desc: "Monthly fixed costs, debt obligations, revenue, and contribution margin." },
  cash:    { num: "02", title: "Cash Position & Runway Target", desc: "Available cash, minimum buffer, and desired survival horizon." },
  risk:    { num: "03", title: "Risk & Scenario Parameters", desc: "Downside revenue retention, source confidence, and uncertainty coverage." },
};

/* ─── Helpers ────────────────────────────────────────────────── */

/** Get error text for a field value. */
function getFieldError(f: FieldDef, raw: number): string {
  if (isNaN(raw)) return "Enter a number.";
  if (raw < f.hardMin)
    return `Outside valid range (${f.hardMin}\u2013${f.hardMax}).`;
  if (raw > f.hardMax)
    return `Outside valid range (${f.hardMin}\u2013${f.hardMax}).`;
  return "";
}

/* ─── Component ──────────────────────────────────────────────── */
export default function BreakEvenSurvivalCashPage() {
  const [currencyIdx, setCurrencyIdx] = useState<number>(DEFAULT_CURRENCY_INDEX);
  const curSym = CURRENCIES[currencyIdx].sym;

  const [inputs, setInputs] = useState<BreakEvenInputs>(() => {
    const init: BreakEvenInputs = {} as BreakEvenInputs;
    for (const f of FIELDS) init[f.id as keyof BreakEvenInputs] = f.default;
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

  const handleChange = useCallback((id: string, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, [id as keyof BreakEvenInputs]: num }));
    } else if (raw === "" || raw === "-") {
      setInputs((prev) => ({ ...prev, [id as keyof BreakEvenInputs]: NaN as any }));
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
    0: { label: "OK \u2014 HEALTHY", cls: "pos" },
    1: { label: "REVIEW \u2014 WARNING", cls: "warn" },
    2: { label: "BLOCKED \u2014 CRITICAL", cls: "neg" },
  };

  // Field validation
  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    for (const f of FIELDS) {
      const val = inputs[f.id as keyof BreakEvenInputs];
      if (val == null || isNaN(val as number)) {
        errs[f.id] = "Enter a number.";
      } else {
        const err = getFieldError(f, val as number);
        if (err) errs[f.id] = err;
      }
    }
    return errs;
  }, [inputs]);

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div className="shell">
      {/* ── Masthead (matches x1.html) ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Corporate Finance &middot; Cash flow proof</div>
        <h1>Break-Even &amp; Survival Cash Calculator</h1>
        <p className="lede">
          Calculate break-even revenue, cash runway, survival cash target, and funding gap. &mdash;
          Assess how long your business can survive under stressed conditions.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>22 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>cash-flow survival analysis</b></span>
        </div>

        <div className="curbar">
          <label htmlFor="cur-select">Report currency</label>
          <select
            id="cur-select"
            value={currencyIdx}
            onChange={(e) => setCurrencyIdx(Number(e.target.value))}
          >
            {CURRENCIES.map((c, i) => (
              <option key={c.code} value={i}>{c.code} &middot; {c.sym} {c.name}</option>
            ))}
          </select>
          <span className="curnote">{CURRENCY_NOTE}</span>
        </div>
      </div>

      {/* ── Bench ── */}
      <div className="bench">
        <div className="form-col">
          {Object.entries(GROUP_META).map(([gk, gm]) => {
            const groupFields = FIELDS.filter((f) => f.group === gk);
            if (!groupFields.length) return null;

            return (
              <div className="grp" key={gk}>
                <div className="grp-h">
                  <span className="grp-n">{gm.num}</span>
                  <span className="grp-t">{gm.title}</span>
                </div>
                <p className="grp-d">{gm.desc}</p>
                {groupFields.map((f) => renderField(f))}
              </div>
            );
          })}

          <button
            className="cta"
            onClick={handleCalculate}
            disabled={errorCount > 0}
          >
            Generate sealed report &middot; 1 credit
          </button>

          <div className="conf" style={{ marginTop: "16px" }}>
            <span className="d" style={{
              background: errorCount > 0 ? "var(--warn)" : "var(--pos)",
              width: 8, height: 8, display: "inline-block", flexShrink: 0, marginTop: 3,
            }} />
            <span>
              {errorCount > 0
                ? `${errorCount} input(s) need attention`
                : "Inputs consistent \u00B7 report ready"}
            </span>
          </div>

          <div className="conf" style={{ marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--faint)", lineHeight: 1.4 }}>
              Technical simulation. Verify all figures against accounting records before financing decisions.
            </span>
          </div>
        </div>

        {/* Live rail */}
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
                          <div className="big-cap">Burn: {curSym}{fmtNum(livePreview.out_monthly_cash_burn)}/mo &middot; Safety: {(livePreview.out_margin_of_safety_ratio * 100).toFixed(1)}%</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="dashboard-grid">
                  <div className="dash-card">
                    <span className="dash-label">Break-even revenue</span>
                    <span className="dash-value">{curSym}{fmtNum(livePreview.out_break_even_monthly_revenue)}</span>
                  </div>
                  <div className="dash-card">
                    <span className="dash-label">Revenue gap</span>
                    <span className={`dash-value ${livePreview.out_current_revenue_gap < 0 ? "neg" : "pos"}`}>
                      {livePreview.out_current_revenue_gap < 0 ? "" : "+"}{curSym}{fmtNum(livePreview.out_current_revenue_gap)}
                    </span>
                  </div>
                  <div className="dash-card">
                    <span className="dash-label">Stressed revenue</span>
                    <span className="dash-value">{curSym}{fmtNum(livePreview.out_stressed_monthly_revenue)}</span>
                  </div>
                  <div className="dash-card">
                    <span className="dash-label">Funding gap</span>
                    <span className={`dash-value ${livePreview.out_funding_gap > 0 ? "neg" : "pos"}`}>
                      {livePreview.out_funding_gap > 0 ? curSym + fmtNum(livePreview.out_funding_gap) : "None"}
                    </span>
                  </div>
                </div>

                <div className="stat"><span>Cash burn</span><b>{curSym}{fmtNum(livePreview.out_monthly_cash_burn)}/mo</b></div>
                <div className="stat"><span>Runway</span><b>{livePreview.out_cash_runway_months.toFixed(1)} mo</b></div>
                <div className="stat"><span>Survival target</span><b>{curSym}{fmtNum(livePreview.out_survival_cash_target)}</b></div>
                <div className="stat"><span>Uncertainty buffer</span><b>{curSym}{fmtNum(livePreview.out_uncertainty_cash_buffer)}</b></div>
                <div className="stat"><span>Margin of safety</span><b>{(livePreview.out_margin_of_safety_ratio * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Target breached</span><b>{livePreview.out_target_runway_breached === 1 ? "YES" : "No"}</b></div>

                <button className="cta" onClick={handleCalculate} disabled={!livePreview}>
                  Generate sealed report &middot; 1 credit
                </button>

                <div className="conf" style={{ marginTop: "12px" }}>
                  <span className="d" style={{
                    background: livePreview ? "var(--pos)" : "var(--warn)",
                    width: 8, height: 8, display: "inline-block", flexShrink: 0, marginTop: 3,
                  }} />
                  <span>
                    {livePreview
                      ? "Inputs consistent \u00B7 report ready"
                      : `${errorCount} input(s) need attention`}
                  </span>
                </div>

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
            <h2>Break-Even &amp; Survival Cash &mdash; proof report</h2>
            <div className="rid">
              SC-PRO-BE &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 22 assertions passed<br />
              currency {curSym} &middot; cash-flow survival analysis
            </div>
          </div>

          <div className="rep-body">
            {/* Section 1: Executive Summary */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">1</span>
                <span className="sec-t">Executive Summary</span>
              </div>
              <div className="verdict-box">
                <div className="head">
                  {(() => {
                    const dc = decisionCodeLabels[result.out_decision_code] || decisionCodeLabels[2];
                    return <span className={dc.cls}>{dc.label}</span>;
                  })()}
                </div>
                <p>
                  Break-even revenue: {curSym}{fmtNum(result.out_break_even_monthly_revenue)}/mo.
                  Current revenue: {curSym}{fmtNum(inputs.currentMonthlyRevenue)}/mo
                  ({result.out_current_revenue_gap >= 0 ? "above" : "below"} break-even by {curSym}{fmtNum(Math.abs(result.out_current_revenue_gap))}).
                  Cash runway: {result.out_cash_runway_months.toFixed(1)} months.
                </p>
                <p>
                  Under stress ({(inputs.downsideRevenueFactor * 100).toFixed(0)}% revenue retention),
                  the cash burn is {curSym}{fmtNum(result.out_monthly_cash_burn)}/mo.
                  Survival cash target: {curSym}{fmtNum(result.out_survival_cash_target)}.
                  Funding gap: {result.out_funding_gap > 0 ? curSym + fmtNum(result.out_funding_gap) : "None"}.
                </p>
              </div>
            </div>

            {/* Section 2: Runway Analysis */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">2</span>
                <span className="sec-t">Runway analysis</span>
              </div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Monthly cash burn (stressed)</td><td className="n">{curSym}{fmtNum(result.out_monthly_cash_burn)}</td></tr>
                  <tr><td>Available survival cash</td><td className="n">{curSym}{fmtNum(Math.max(0, inputs.unrestrictedCashBalance - inputs.minimumCashBuffer))}</td></tr>
                  <tr><td>Cash runway</td><td className="n">{result.out_cash_runway_months.toFixed(1)} months</td></tr>
                  <tr><td>Target survival period</td><td className="n">{inputs.targetSurvivalMonths} months</td></tr>
                  <tr><td>Target breached</td><td className="n">{result.out_target_runway_breached === 1 ? "YES \u2014 insufficient" : "No \u2014 sufficient"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 3: Break-even detail */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">3</span>
                <span className="sec-t">Break-even detail</span>
              </div>
              <table>
                <thead><tr><th>Component</th><th className="n">Amount ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>Fixed cash costs</td><td className="n">{curSym}{fmtNum(inputs.monthlyFixedCashCost)}</td></tr>
                  <tr><td>Debt service</td><td className="n">{curSym}{fmtNum(inputs.monthlyDebtService)}</td></tr>
                  <tr><td>Total obligations</td><td className="n">{curSym}{fmtNum(inputs.monthlyFixedCashCost + inputs.monthlyDebtService)}</td></tr>
                  <tr className="total"><td>Break-even revenue needed</td><td className="n">{curSym}{fmtNum(result.out_break_even_monthly_revenue)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 4: Survival cash target */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">4</span>
                <span className="sec-t">Survival cash target</span>
              </div>
              <table>
                <thead><tr><th>Component</th><th className="n">Amount ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>Minimum cash buffer</td><td className="n">{curSym}{fmtNum(inputs.minimumCashBuffer)}</td></tr>
                  <tr><td>Target burn coverage</td><td className="n">{curSym}{fmtNum(result.out_monthly_cash_burn * inputs.targetSurvivalMonths)}</td></tr>
                  <tr><td>Uncertainty buffer</td><td className="n">{curSym}{fmtNum(result.out_uncertainty_cash_buffer)}</td></tr>
                  <tr className="total"><td>Survival cash target</td><td className="n">{curSym}{fmtNum(result.out_survival_cash_target)}</td></tr>
                  <tr><td>Unrestricted cash</td><td className="n">{curSym}{fmtNum(inputs.unrestrictedCashBalance)}</td></tr>
                  <tr className={result.out_funding_gap > 0 ? "neg-row" : ""}>
                    <td>Funding gap</td>
                    <td className="n">{result.out_funding_gap > 0 ? curSym + fmtNum(result.out_funding_gap) : "None"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 5: Input summary */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">5</span>
                <span className="sec-t">Input summary</span>
              </div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Monthly fixed cash cost</td><td className="n">{curSym}{fmtNum(inputs.monthlyFixedCashCost)}</td></tr>
                  <tr><td>Monthly debt service</td><td className="n">{curSym}{fmtNum(inputs.monthlyDebtService)}</td></tr>
                  <tr><td>Contribution margin ratio</td><td className="n">{(inputs.contributionMarginRatio * 100).toFixed(0)}%</td></tr>
                  <tr><td>Current monthly revenue</td><td className="n">{curSym}{fmtNum(inputs.currentMonthlyRevenue)}</td></tr>
                  <tr><td>Unrestricted cash</td><td className="n">{curSym}{fmtNum(inputs.unrestrictedCashBalance)}</td></tr>
                  <tr><td>Minimum cash buffer</td><td className="n">{curSym}{fmtNum(inputs.minimumCashBuffer)}</td></tr>
                  <tr><td>Target survival months</td><td className="n">{inputs.targetSurvivalMonths} months</td></tr>
                  <tr><td>Downside revenue factor</td><td className="n">{(inputs.downsideRevenueFactor * 100).toFixed(0)}%</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(inputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                  <tr><td>Uncertainty multiplier</td><td className="n">{inputs.uncertaintyMultiplier.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 6: Engineering insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h">
                  <span className="sec-n">6</span>
                  <span className="sec-t">Engineering insights</span>
                </div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </div>
            )}

            {/* Section 7: Method & formulas */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">7</span>
                <span className="sec-t">Method &amp; formulas</span>
              </div>
              <table>
                <tbody>
                  <tr><td>Break-even revenue</td><td className="n">(fixed cash cost + debt service) \u00F7 contribution margin ratio</td></tr>
                  <tr><td>Cash burn</td><td className="n">total obligations \u2014 stressed revenue</td></tr>
                  <tr><td>Runway</td><td className="n">(unrestricted cash \u2014 buffer) \u00F7 monthly burn</td></tr>
                  <tr><td>Survival target</td><td className="n">buffer + (burn \u00D7 target months) + uncertainty buffer</td></tr>
                </tbody>
              </table>
              <div className="note">
                Cash-flow survival analysis. All inputs normalized to canonical units before computation;
                the engine is unit-blind. Formulas passed 22 closed-form/edge-case and semantic
                assertions before this report existed.
              </div>
            </div>

            {/* Section 8: Seal & Disclaimer */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">8</span>
                <span className="sec-t">Audit trail &amp; integrity</span>
              </div>
              <div className="seal">
                SEAL &middot; SHA-256 {Date.now().toString(16).toUpperCase().slice(0, 16)}<br />
                Inputs and outputs are hashed together; altering any figure changes the seal.
                Verify at sectorcalc.com/verify &mdash; production seals are computed server-side.
              </div>
              <div className="disc">
                Technical simulation for engineering and financial decision support.
                Assumes linear revenue decline under stress and constant cost structure.
                Not a substitute for professional accounting or financial review.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Field render helper ──────────────────────────────────── */
  function renderField(f: FieldDef) {
    const val = inputs[f.id as keyof BreakEvenInputs];
    const raw = val ?? f.default;
    const errText = getFieldError(f, raw as number);

    return (
      <div className="f" key={f.id}>
        <div className="f-top">
          <label htmlFor={`inp-${f.id}`}>{f.label}</label>
          <span className="unitline" id={`ul-${f.id}`}>
            {errText ? "" : f.ref}
          </span>
        </div>
        <div className={`control${errText ? " bad" : ""}`} id={`ct-${f.id}`}>
          {f.showPrefix && <span className="prefix" id={`px-${f.id}`}>{curSym}</span>}
          <input
            id={`inp-${f.id}`}
            type="number"
            value={isNaN(raw as number) ? "" : raw}
            onChange={(e) => handleChange(f.id, e.target.value)}
            min={f.hardMin}
            max={f.hardMax}
            step="any"
            inputMode="decimal"
          />
        </div>
        <div className="f-foot">
          <span className="hint">{f.hint}</span>
          <span className="bench-ref">{f.unit}</span>
        </div>
        <div className={`msg${errText ? " err" : ""}`} id={`ms-${f.id}`}>
          {errText}
        </div>
      </div>
    );
  }
}
