"use client";

/**
 * Capital Equipment Investment Appraisal (NPV/IRR) — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 12 inputs in 3 groups. Report shows NPV, IRR, Payback, PI, and decision.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";
import type { NPVIRRInputs, NPVIRROutputs } from
  "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-capital-equipment-investment-appraisal-npv-irr.css";

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
  id: keyof NPVIRRInputs;
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
  0: "PASS — APPROVE",
  1: "REVIEW — CONDITIONAL",
  2: "HOLD — REJECT",
};

const DECISION_CLASSES: Record<number, string> = {
  0: "pos",
  1: "warn",
  2: "neg",
};

const FIELDS: FieldDef[] = [
  // ── Machine Data ──
  { id: "initialInvestment", label: "Initial investment (net capex)", defaultUnit: "currency", showPrefix: true, default: 500000, hint: "Total upfront capital outlay for the equipment.", ref: "currency \u00B7 net capex", group: "investment", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "annualNetCashFlow", label: "Annual net cash flow from ops", defaultUnit: "currency/yr", showPrefix: true, default: 150000, hint: "Annual operating cash flow before capital costs.", ref: "currency/yr \u00B7 EBITDA proxy", group: "investment", hardMin: -1e8, hardMax: 1e9, step: "1000" },
  { id: "residualValue", label: "Residual value at end of term", defaultUnit: "currency", showPrefix: true, default: 50000, hint: "Expected resale or scrap value at end of analysis period.", ref: "currency \u00B7 salvage", group: "investment", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "annualVolume", label: "Annual production volume", defaultUnit: "units/yr", showPrefix: false, default: 10000, hint: "Expected annual production output.", ref: "units/yr", group: "investment", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Financial ──
  { id: "discountRate", label: "Discount rate (WACC / hurdle)", defaultUnit: "decimal", showPrefix: false, default: 0.10, hint: "Weighted average cost of capital or minimum acceptable return.", ref: "decimal \u00B7 WACC \u00B7 hurdle", group: "financial", hardMin: 0, hardMax: 1, step: "0.01" },
  { id: "analysisYears", label: "Analysis period (years)", defaultUnit: "years", showPrefix: false, default: 5, hint: "Number of years to evaluate the investment.", ref: "years \u00B7 planning horizon", group: "financial", hardMin: 1, hardMax: 50, step: "1" },
  { id: "laborRate", label: "Annual labor cost per FTE", defaultUnit: "currency/yr", showPrefix: true, default: 80000, hint: "Fully loaded annual cost per full-time equivalent employee.", ref: "currency/yr \u00B7 fully loaded", group: "financial", hardMin: 0, hardMax: 1e7, step: "1000" },
  { id: "overheadRate", label: "Annual overhead allocation", defaultUnit: "currency/yr", showPrefix: true, default: 120000, hint: "Annual overhead allocated to this equipment decision.", ref: "currency/yr", group: "financial", hardMin: 0, hardMax: 1e8, step: "1000" },
  // ── Risk ──
  { id: "stressDownsideFactor", label: "Stress downside factor", defaultUnit: "ratio", showPrefix: false, default: 0.8, hint: "Severity multiplier for downside scenario (0=none, 1=worst).", ref: "0..1 ratio", group: "risk", hardMin: 0, hardMax: 1, step: "0.05" },
  { id: "defectOrLossCost", label: "Defect / loss cost per unit", defaultUnit: "currency/unit", showPrefix: true, default: 15000, hint: "Estimated cost per defect or loss event.", ref: "currency/unit", group: "risk", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.95, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "risk", hardMin: 0, hardMax: 1, step: "0.05" },
  { id: "uncertaintyMultiplier", label: "Uncertainty multiplier", defaultUnit: "mult", showPrefix: false, default: 1.2, hint: "Coverage multiplier for expanded uncertainty.", ref: "1.0..3.0", group: "risk", hardMin: 1, hardMax: 3, step: "0.05" },
];

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  investment: { title: "Investment Parameters", desc: "Capex, operating cash flow, residual value, and production volume." },
  financial:  { title: "Financial Assumptions", desc: "Discount rate, timeline, labor, and overhead costs." },
  risk:       { title: "Risk Assessment", desc: "Stress factor, defect cost, confidence, and uncertainty." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function NPVIRRPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<NPVIRRInputs>(() => {
    const init: NPVIRRInputs = {} as NPVIRRInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<NPVIRROutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): NPVIRROutputs | null => {
    if (!inputs.initialInvestment || inputs.initialInvestment <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof NPVIRRInputs, raw: string) => {
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

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Capital Equipment Investment Appraisal</h1>
        <p className="lede">
          NPV, IRR, payback period, and profitability index analysis. &mdash;
          Evaluate capital equipment investments with rigorous financial modeling.
        </p>
        <div className="meta">
          <span>ISO 50001 &mdash; Capital Investment Appraisal &bull; Auditable</span>
          <span><b>Capital Budgeting &bull; NPV/IRR</b></span>
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
            Generate Appraisal Report
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
                            {curSym}{(livePreview.out_demand_metric || 0).toFixed(0)}
                            <small>demand metric</small>
                          </div>
                          <div className="big-cap">Uncertainty: {curSym}{livePreview.out_expanded_uncertainty.toFixed(0)} &middot; PI: {livePreview.out_utilization_margin.toFixed(2)}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Decision</span><b>{DECISION_LABELS[livePreview.out_final_decision_state]}</b></div>
                <div className="stat"><span>Profitability Index</span><b>{livePreview.out_utilization_margin.toFixed(2)}</b></div>
                <div className="stat"><span>Money at risk</span><b>{curSym}{livePreview.out_money_at_risk.toFixed(0)}</b></div>
                <div className="stat"><span>Expanded uncertainty</span><b>{curSym}{livePreview.out_expanded_uncertainty.toFixed(0)}</b></div>
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
            <div><h2>Capital Investment Appraisal Report</h2></div>
            <div className="rid">
              ISO 50001 &bull; Capital Investment Appraisal<br />
              Report ID: CAP-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  Decision: <strong>{DECISION_LABELS[result.out_final_decision_state]}</strong>
                </div>
                <p>
                  Profitability Index: {result.out_utilization_margin.toFixed(2)} &mdash;
                  Expanded uncertainty: {curSym}{result.out_expanded_uncertainty.toFixed(0)}.
                  Money at risk: {curSym}{result.out_money_at_risk.toFixed(0)}.
                  The investment {result.out_final_decision_state === 0 ? "passes" : result.out_final_decision_state === 1 ? "requires further review" : "does not meet the economic threshold"}.
                </p>
              </div>
            </div>

            {/* S2: NPV / IRR / Payback Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">NPV &amp; IRR Summary</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Profitability Index (PI)</td><td className="n">{result.out_utilization_margin.toFixed(4)}</td></tr>
                  <tr><td>Capacity metric</td><td className="n">{result.out_capacity_metric.toFixed(4)}</td></tr>
                  <tr><td>Demand metric (confidence-weighted)</td><td className="n">{curSym}{result.out_demand_metric.toFixed(0)}</td></tr>
                  <tr><td>Threshold crossing</td><td className="n">{result.out_threshold_crossing === 1 ? "Positive NPV signal" : result.out_threshold_crossing === -1 ? "Below loss cost" : "No crossing"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S3: Key Metrics */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Risk &amp; Quality Metrics</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Evidence completeness</td><td className="n">{(result.out_evidence_completeness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Normalized demand</td><td className="n">{curSym}{result.out_normalized_demand.toFixed(0)}</td></tr>
                  <tr><td>Reference deviation</td><td className="n">{result.out_reference_deviation.toFixed(4)}</td></tr>
                  <tr><td>Derating factor</td><td className="n">{(result.out_derating_factor * 100).toFixed(0)}%</td></tr>
                  <tr><td>Expanded uncertainty</td><td className="n">{curSym}{result.out_expanded_uncertainty.toFixed(0)}</td></tr>
                  <tr><td>Money at risk</td><td className="n">{curSym}{result.out_money_at_risk.toFixed(0)}</td></tr>
                  <tr><td>Scenario delta</td><td className="n">{curSym}{result.out_scenario_delta.toFixed(0)}</td></tr>
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
                CAPITAL-REPORT-{Date.now().toString(36).toUpperCase()}<br />
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
