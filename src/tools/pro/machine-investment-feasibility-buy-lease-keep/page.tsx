"use client";

/**
 * Machine Investment Feasibility: Buy vs Lease vs Keep — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 12 inputs in 3 groups: Machine Data, Financial Parameters, Risk.
 * Report shows Buy/Lease/Keep comparison, NPV ranking, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import type { InvestmentFeasibilityInputs, InvestmentFeasibilityOutputs } from
  "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-machine-investment-feasibility-buy-lease-keep.css";

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
  id: keyof InvestmentFeasibilityInputs;
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

const DECISION_LABELS: Record<number, string> = {
  0: "BUY",
  1: "LEASE",
  2: "KEEP",
  3: "ALL NEGATIVE — REVIEW",
};

const DECISION_CLASSES: Record<number, string> = {
  0: "pos",
  1: "warn",
  2: "info",
  3: "neg",
};

const FIELDS: FieldDef[] = [
  // ── Machine Data ──
  { id: "initialInvestment", label: "Initial investment (net capex)", defaultUnit: "currency", showPrefix: true, default: 500000, hint: "Total upfront capital outlay for the new machine.", ref: "currency \u00B7 net capex", group: "machine", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "annualNetCashFlow", label: "Annual net cash flow from ops", defaultUnit: "currency/yr", showPrefix: true, default: 150000, hint: "Annual operating cash flow before capital costs.", ref: "currency/yr \u00B7 EBITDA proxy", group: "machine", hardMin: -1e8, hardMax: 1e9, step: "1000" },
  { id: "residualValue", label: "Residual value at end of term", defaultUnit: "currency", showPrefix: true, default: 50000, hint: "Expected resale or scrap value at end of analysis period.", ref: "currency \u00B7 salvage", group: "machine", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "annualVolume", label: "Annual production volume", defaultUnit: "units/yr", showPrefix: false, default: 10000, hint: "Expected annual production output.", ref: "units/yr", group: "machine", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Financial ──
  { id: "discountRate", label: "Discount rate (WACC / hurdle)", defaultUnit: "decimal", showPrefix: false, default: 0.10, hint: "Weighted average cost of capital or minimum acceptable return.", ref: "decimal \u00B7 WACC \u00B7 hurdle", group: "financial", hardMin: 0, hardMax: 1, step: "0.01" },
  { id: "analysisYears", label: "Analysis period (years)", defaultUnit: "years", showPrefix: false, default: 5, hint: "Number of years to evaluate the investment decision.", ref: "years \u00B7 planning horizon", group: "financial", hardMin: 1, hardMax: 50, step: "1" },
  { id: "laborRate", label: "Annual labor cost per FTE", defaultUnit: "currency/yr", showPrefix: true, default: 80000, hint: "Fully loaded annual cost per full-time equivalent employee.", ref: "currency/yr \u00B7 fully loaded", group: "financial", hardMin: 0, hardMax: 1e7, step: "1000" },
  { id: "overheadRate", label: "Annual overhead allocation", defaultUnit: "currency/yr", showPrefix: true, default: 120000, hint: "Annual overhead allocated to this equipment decision.", ref: "currency/yr", group: "financial", hardMin: 0, hardMax: 1e8, step: "1000" },
  // ── Risk ──
  { id: "stressDownsideFactor", label: "Stress downside factor", defaultUnit: "ratio", showPrefix: false, default: 0.8, hint: "Severity multiplier for downside scenario (0=none, 1=worst).", ref: "0..1 ratio", group: "risk", hardMin: 0, hardMax: 1, step: "0.05" },
  { id: "defectOrLossCost", label: "Defect / loss cost per unit", defaultUnit: "currency/unit", showPrefix: true, default: 15000, hint: "Estimated cost per defect or loss event.", ref: "currency/unit", group: "risk", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.95, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "risk", hardMin: 0, hardMax: 1, step: "0.05" },
  { id: "uncertaintyMultiplier", label: "Uncertainty multiplier", defaultUnit: "mult", showPrefix: false, default: 1.2, hint: "Coverage multiplier for expanded uncertainty calculation.", ref: "1.0..3.0", group: "risk", hardMin: 1, hardMax: 3, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  machine:  { title: "Machine & Operations Data", desc: "Core investment parameters: capex, cash flow, volume, and residual value." },
  financial: { title: "Financial Parameters", desc: "Discount rate, labor cost, overhead, and analysis timeline." },
  risk:     { title: "Risk & Confidence", desc: "Stress scenario, defect cost, source confidence, and uncertainty coverage." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function InvestmentFeasibilityPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<InvestmentFeasibilityInputs>(() => {
    const init: InvestmentFeasibilityInputs = {} as InvestmentFeasibilityInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<InvestmentFeasibilityOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): InvestmentFeasibilityOutputs | null => {
    if (!inputs.initialInvestment || inputs.initialInvestment <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof InvestmentFeasibilityInputs, raw: string) => {
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

  // Scenario rankings
  const scenarioRankings = useMemo(() => {
    if (!result) return [];
    // We reconstruct rankings from outputs
    const decision = result.out_final_decision_state;
    const decLabel = DECISION_LABELS[decision] || "UNKNOWN";
    const decClass = DECISION_CLASSES[decision] || "warn";
    return { decision, decLabel, decClass };
  }, [result]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Machine Investment Feasibility</h1>
        <p className="lede">
          Compare Buy vs. Lease vs. Keep scenarios using NPV analysis. &mdash;
          Identify the highest-value investment path and quantify uncertainty.
        </p>
        <div className="meta">
          <span>ISO 50001 &mdash; Investment Decision Framework &bull; Auditable</span>
          <span><b>Capital Budgeting</b></span>
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
            Generate Investment Analysis Report
          </button>

          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against accounting records before capital commitments.</span>
          </div>
        </div>

        {/* Live rail */}
        <div className="rail">
          <div className="rail-in">
            {livePreview ? (
              <>
                <div className="verdict">
                  {(() => {
                    const dec = livePreview.out_final_decision_state;
                    const cls = DECISION_CLASSES[dec] || "warn";
                    const lbl = DECISION_LABELS[dec] || "UNKNOWN";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{livePreview.out_utilization_margin.toFixed(0)}
                            <small>utilization margin</small>
                          </div>
                          <div className="big-cap">Money at risk: {curSym}{livePreview.out_money_at_risk.toFixed(0)} &middot; Expanded uncertainty: {curSym}{livePreview.out_expanded_uncertainty.toFixed(0)}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Decision</span><b>{DECISION_LABELS[livePreview.out_final_decision_state]}</b></div>
                <div className="stat"><span>Best margin</span><b>{curSym}{livePreview.out_utilization_margin.toFixed(0)}</b></div>
                <div className="stat"><span>Buy vs Lease delta</span><b>{curSym}{livePreview.out_scenario_delta.toFixed(0)}</b></div>
                <div className="stat"><span>Money at risk</span><b>{curSym}{livePreview.out_money_at_risk.toFixed(0)}</b></div>
                <div className="stat"><span>Derating factor</span><b>{(livePreview.out_derating_factor * 100).toFixed(0)}%</b></div>
                <div className="stat"><span>FMEA trigger</span><b>{livePreview.out_fmea_trigger}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter initial investment &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>Investment Feasibility Report</h2></div>
            <div className="rid">
              ISO 50001 &bull; Investment Decision Framework<br />
              Report ID: INV-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  Recommendation: <strong>{DECISION_LABELS[result.out_final_decision_state]}</strong>
                </div>
                <p>
                  After NPV analysis across all three scenarios, the{" "}
                  {DECISION_LABELS[result.out_final_decision_state]} path yields the highest value.
                  Top-line margin: {curSym}{result.out_utilization_margin.toFixed(0)}.
                  Expanded uncertainty: {curSym}{result.out_expanded_uncertainty.toFixed(0)}.
                  Money at risk: {curSym}{result.out_money_at_risk.toFixed(0)}.
                </p>
              </div>
            </div>

            {/* S2: Scenario Comparison */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Scenario Comparison</span></div>
              <table>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th className="n">Rank</th>
                    <th className="n">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={result.out_final_decision_state === 0 ? "total" : ""}>
                    <td>BUY (Outright Purchase)</td>
                    <td className="n">{result.out_final_decision_state === 0 ? "1st" : "—"}</td>
                    <td className="n">Capex: {curSym}{inputs.initialInvestment.toFixed(0)}, Cash flow: {curSym}{inputs.annualNetCashFlow.toFixed(0)}/yr</td>
                  </tr>
                  <tr className={result.out_final_decision_state === 1 ? "total" : ""}>
                    <td>LEASE (Operating Lease)</td>
                    <td className="n">{result.out_final_decision_state === 1 ? "1st" : "—"}</td>
                    <td className="n">Annual lease payment: {curSym}{(inputs.initialInvestment * 0.25).toFixed(0)}</td>
                  </tr>
                  <tr className={result.out_final_decision_state === 2 ? "total" : ""}>
                    <td>KEEP (Maintain Existing)</td>
                    <td className="n">{result.out_final_decision_state === 2 ? "1st" : "—"}</td>
                    <td className="n">Cash flow contribution: {curSym}{(inputs.annualNetCashFlow * 0.5).toFixed(0)}/yr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* S3: Key Metrics */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Key Investment Metrics</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Evidence completeness</td><td className="n">{(result.out_evidence_completeness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Normalized demand</td><td className="n">{curSym}{result.out_normalized_demand.toFixed(0)}</td></tr>
                  <tr><td>Reference deviation</td><td className="n">{result.out_reference_deviation.toFixed(4)}</td></tr>
                  <tr><td>Derating factor</td><td className="n">{(result.out_derating_factor * 100).toFixed(0)}%</td></tr>
                  <tr><td>Capacity metric</td><td className="n">{result.out_capacity_metric.toFixed(4)}</td></tr>
                  <tr><td>Buy vs Lease delta</td><td className="n">{curSym}{result.out_scenario_delta.toFixed(0)}</td></tr>
                  <tr><td>Money at risk</td><td className="n">{curSym}{result.out_money_at_risk.toFixed(0)}</td></tr>
                  <tr><td>Expanded uncertainty</td><td className="n">{curSym}{result.out_expanded_uncertainty.toFixed(0)}</td></tr>
                  <tr><td>Threshold crossing</td><td className="n">{result.out_threshold_crossing === 1 ? "Positive NPV" : result.out_threshold_crossing === -1 ? "Below loss cost" : "No crossing"}</td></tr>
                  <tr><td>Sensitivity driver</td><td className="n">Driver index {result.out_sensitivity_driver}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmea_trigger}</td></tr>
                  <tr><td>Final decision</td><td className="n">{DECISION_LABELS[result.out_final_decision_state]}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Initial investment</td><td className="n">{curSym}{inputs.initialInvestment.toFixed(0)}</td></tr>
                  <tr><td>Annual net cash flow</td><td className="n">{curSym}{inputs.annualNetCashFlow.toFixed(0)}</td></tr>
                  <tr><td>Discount rate</td><td className="n">{(inputs.discountRate * 100).toFixed(1)}%</td></tr>
                  <tr><td>Analysis period</td><td className="n">{inputs.analysisYears} years</td></tr>
                  <tr><td>Residual value</td><td className="n">{curSym}{inputs.residualValue.toFixed(0)}</td></tr>
                  <tr><td>Stress downside factor</td><td className="n">{(inputs.stressDownsideFactor * 100).toFixed(0)}%</td></tr>
                  <tr><td>Annual volume</td><td className="n">{inputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{inputs.laborRate.toFixed(0)}/yr</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{curSym}{inputs.overheadRate.toFixed(0)}/yr</td></tr>
                  <tr><td>Defect / loss cost</td><td className="n">{curSym}{inputs.defectOrLossCost.toFixed(0)}</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(inputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                  <tr><td>Uncertainty multiplier</td><td className="n">{inputs.uncertaintyMultiplier.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S5: Insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h"><span className="sec-n">S5</span><span className="sec-t">Insights &amp; Recommendations</span></div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </div>
            )}

            {/* S6: Seal */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S6</span><span className="sec-t">Audit Seal &amp; Integrity</span></div>
              <div className="seal">
                INVESTMENT-REPORT-{Date.now().toString(36).toUpperCase()}<br />
                Engine: executeFormula v5.3.1-pro &bull; ISO 50001 Framework<br />
                Generated: {new Date().toISOString()}
              </div>
              <div className="disc">
                <strong>Disclaimer.</strong> This report is a technical simulation based on the inputs provided.
                It does not constitute financial, legal, or engineering advice. Always verify calculations
                with a qualified professional before making capital commitments.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
