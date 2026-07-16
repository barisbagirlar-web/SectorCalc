"use client";

/**
 * Machine Investment Feasibility: Buy vs Lease vs Keep — custom page component.
 *
 * x1 pattern: 12-currency, inline validation, canonical unit display,
 * group numbering, engine metadata.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * Import: toCanonical / fromCanonical from @/tools/_shared/units
 * Import: x1-utils from @/tools/_shared/x1-utils
 * CSS:    @/styles/pro-tool-machine-investment-feasibility-buy-lease-keep.css
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import type { InvestmentFeasibilityInputs, InvestmentFeasibilityOutputs } from
  "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, SEVERITY_CLASS, CANON_SUFFIX, CURRENCY_NOTE } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import { getFieldError } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-machine-investment-feasibility-buy-lease-keep.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Machine Data ──
  { id: "initialInvestment", label: "Initial investment (net capex)", unit: "units", domain: "flat", showPrefix: true, default: 500000, hint: "Total upfront capital outlay for the new machine.", ref: "currency \u00B7 net capex", group: "machine", hardMin: 0, hardMax: 1e9, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "annualNetCashFlow", label: "Annual net cash flow from ops", unit: "units", domain: "flat", showPrefix: true, default: 150000, hint: "Annual operating cash flow before capital costs.", ref: "currency/yr \u00B7 EBITDA proxy", group: "machine", hardMin: -1e8, hardMax: 1e9, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "residualValue", label: "Residual value at end of term", unit: "units", domain: "flat", showPrefix: true, default: 50000, hint: "Expected resale or scrap value at end of analysis period.", ref: "currency \u00B7 salvage", group: "machine", hardMin: 0, hardMax: 1e9, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "annualVolume", label: "Annual production volume", unit: "units", domain: "flat", showPrefix: false, default: 10000, hint: "Expected annual production output.", ref: "units/yr", group: "machine", hardMin: 0, hardMax: 1e9, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  // ── Financial ──
  { id: "discountRate", label: "Discount rate (WACC / hurdle)", unit: "fraction (0-1)", domain: "percent", showPrefix: false, default: 0.10, hint: "Weighted average cost of capital or minimum acceptable return.", ref: "decimal \u00B7 WACC \u00B7 hurdle", group: "financial", hardMin: 0, hardMax: 1, unitOptions: ["%", "fraction (0-1)", "bps"] },
  { id: "analysisYears", label: "Analysis period (years)", unit: "years", domain: "years", showPrefix: false, default: 5, hint: "Number of years to evaluate the investment decision.", ref: "years \u00B7 planning horizon", group: "financial", hardMin: 1, hardMax: 50, unitOptions: ["months", "quarters", "years"] },
  { id: "laborRate", label: "Annual labor cost per FTE", unit: "units", domain: "flat", showPrefix: true, default: 80000, hint: "Fully loaded annual cost per full-time equivalent employee.", ref: "currency/yr \u00B7 fully loaded", group: "financial", hardMin: 0, hardMax: 1e7, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "overheadRate", label: "Annual overhead allocation", unit: "units", domain: "flat", showPrefix: true, default: 120000, hint: "Annual overhead allocated to this equipment decision.", ref: "currency/yr", group: "financial", hardMin: 0, hardMax: 1e8, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  // ── Risk ──
  { id: "stressDownsideFactor", label: "Stress downside factor", unit: "fraction (0-1)", domain: "percent", showPrefix: false, default: 0.8, hint: "Severity multiplier for downside scenario (0=none, 1=worst).", ref: "0..1 ratio", group: "risk", hardMin: 0, hardMax: 1, unitOptions: ["%", "fraction (0-1)", "bps"] },
  { id: "defectOrLossCost", label: "Defect / loss cost per unit", unit: "units", domain: "flat", showPrefix: true, default: 15000, hint: "Estimated cost per defect or loss event.", ref: "currency/unit", group: "risk", hardMin: 0, hardMax: 1e7, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", domain: "percent", showPrefix: false, default: 0.95, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "risk", hardMin: 0, hardMax: 1, unitOptions: ["%", "fraction (0-1)", "bps"] },
  { id: "uncertaintyMultiplier", label: "Uncertainty multiplier", unit: "units", domain: "flat", showPrefix: false, default: 1.2, hint: "Coverage multiplier for expanded uncertainty calculation.", ref: "1.0..3.0", group: "risk", hardMin: 1, hardMax: 3, unitOptions: ["units"] },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  machine:  { num: "01", title: "Machine & Operations Data", desc: "Core investment parameters: capex, cash flow, volume, and residual value." },
  financial: { num: "02", title: "Financial Parameters", desc: "Discount rate, labor cost, overhead, and analysis timeline." },
  risk:     { num: "03", title: "Risk & Confidence", desc: "Stress scenario, defect cost, source confidence, and uncertainty coverage." },
};

/* ─── Decision labels ────────────────────────────────────────── */
const DECISION_LABELS: Record<number, string> = {
  0: "BUY",
  1: "LEASE",
  2: "KEEP",
  3: "ALL NEGATIVE \u2014 REVIEW",
};

const DECISION_CLASSES: Record<number, string> = {
  0: "pos",
  1: "warn",
  2: "info",
  3: "neg",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function InvestmentFeasibilityPage() {
  const [currencyIdx, setCurrencyIdx] = useState<number>(DEFAULT_CURRENCY_INDEX);
  const curSym = CURRENCIES[currencyIdx].sym;

  // Display values + their selected unit for each field
  const [displayValue, setDisplayValue] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });
  const [displayUnit, setDisplayUnit] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.id] = f.unit;
    return init;
  });

  // Computed canonical values
  const canonState = useMemo(() => {
    const cs: Record<string, number> = {};
    for (const f of FIELDS) {
      const dv = displayValue[f.id] ?? f.default;
      const du = displayUnit[f.id] || f.unit;
      cs[f.id] = toCanonical(f.domain, dv, du);
    }
    return cs;
  }, [displayValue, displayUnit]);

  // Engine inputs from canonical values
  const engineInputs = useMemo((): InvestmentFeasibilityInputs => ({
    initialInvestment: canonState.initialInvestment ?? 0,
    annualNetCashFlow: canonState.annualNetCashFlow ?? 0,
    residualValue: canonState.residualValue ?? 0,
    annualVolume: canonState.annualVolume ?? 0,
    discountRate: canonState.discountRate ?? 0,
    analysisYears: canonState.analysisYears ?? 0,
    laborRate: canonState.laborRate ?? 0,
    overheadRate: canonState.overheadRate ?? 0,
    stressDownsideFactor: canonState.stressDownsideFactor ?? 0,
    defectOrLossCost: canonState.defectOrLossCost ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
    uncertaintyMultiplier: canonState.uncertaintyMultiplier ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<InvestmentFeasibilityOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): InvestmentFeasibilityOutputs | null => {
    if (!engineInputs.initialInvestment || engineInputs.initialInvestment <= 0) return null;
    return executeFormula(engineInputs);
  }, [engineInputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, engineInputs, curSym);
  }, [livePreview, engineInputs, curSym]);

  // Handle input change
  const handleChange = useCallback((id: string, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      setDisplayValue((prev) => ({ ...prev, [id]: num }));
    } else if (raw === "" || raw === "-") {
      setDisplayValue((prev) => ({ ...prev, [id]: NaN }));
    }
  }, []);

  // Handle unit change — auto-convert value
  const handleUnitChange = useCallback((id: string, newUnit: string) => {
    const f = FIELDS.find((x) => x.id === id);
    if (!f) return;
    const oldUnit = displayUnit[id] || f.unit;
    const oldVal = displayValue[id] ?? f.default;
    if (oldUnit !== newUnit && !isNaN(oldVal)) {
      const canon = toCanonical(f.domain, oldVal, oldUnit);
      const newVal = fromCanonical(f.domain, canon, newUnit);
      setDisplayValue((prev) => ({ ...prev, [id]: +newVal.toPrecision(10) }));
    }
    setDisplayUnit((prev) => ({ ...prev, [id]: newUnit }));
  }, [displayValue, displayUnit]);

  const handleCalculate = useCallback(() => {
    const r = executeFormula(engineInputs);
    setResult(r);
    setHasComputed(true);
  }, [engineInputs]);

  useEffect(() => {
    if (hasComputed && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasComputed]);

  // Scenario rankings
  const scenarioRankings = useMemo(() => {
    if (!result) return { decision: 3, decLabel: "UNKNOWN", decClass: "warn" };
    const decision = result.out_final_decision_state;
    const decLabel = DECISION_LABELS[decision] || "UNKNOWN";
    const decClass = DECISION_CLASSES[decision] || "warn";
    return { decision, decLabel, decClass };
  }, [result]);

  // Severity class for insights
  const severityClass = (s: Severity): string => SEVERITY_CLASS[s] || "warn";

  // Field errors
  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    for (const f of FIELDS) {
      const dv = displayValue[f.id];
      if (dv == null || isNaN(dv)) {
        errs[f.id] = "Enter a number.";
      } else {
        const err = getFieldError(f, dv, displayUnit[f.id] || f.unit);
        if (err) errs[f.id] = err;
      }
    }
    return errs;
  }, [displayValue, displayUnit]);

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Capital Budgeting &middot; Investment Decision</div>
        <h1>Machine Investment Feasibility</h1>
        <p className="lede">
          Compare Buy vs. Lease vs. Keep scenarios using NPV analysis. &mdash;
          Identify the highest-value investment path and quantify uncertainty.
        </p>
        <div className="meta">
          <span>Engine <b>v5.3.1</b></span>
          <span>Capital Budgeting <b>verified</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>NPV + scenario analysis</b></span>
        </div>

        {/* Currency bar (matches x1.html) */}
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
              Technical simulation. Verify all figures against accounting records before capital commitments.
            </span>
          </div>
        </div>

        {/* Live rail */}
        <div className="rail">
          <div className="rail-in">
            <div className="verdict" id="verdict">
              {livePreview ? (
                <>
                  {(() => {
                    const dec = livePreview.out_final_decision_state;
                    const cls = DECISION_CLASSES[dec] || "warn";
                    const lbl = DECISION_LABELS[dec] || "UNKNOWN";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{fmtNum(livePreview.out_utilization_margin)}
                            <small>utilization margin</small>
                          </div>
                          <div className="big-cap">Money at risk: {curSym}{fmtNum(livePreview.out_money_at_risk)} &middot; Expanded uncertainty: {curSym}{fmtNum(livePreview.out_expanded_uncertainty)}</div>
                        </div>
                      </>
                    );
                  })()}
                </>
              ) : (
                <>
                  <div className="verdict-band warn">INCOMPLETE</div>
                  <div className="verdict-body">
                    <div className="big">&mdash;</div>
                    <div className="big-cap">Enter initial investment &gt; 0 to see live results</div>
                  </div>
                </>
              )}
            </div>

            {livePreview && (
              <>
                <div className="stat"><span>Decision</span><b>{DECISION_LABELS[livePreview.out_final_decision_state]}</b></div>
                <div className="stat"><span>Best margin</span><b>{curSym}{fmtNum(livePreview.out_utilization_margin)}</b></div>
                <div className="stat"><span>Buy vs Lease delta</span><b>{curSym}{fmtNum(livePreview.out_scenario_delta)}</b></div>
                <div className="stat"><span>Money at risk</span><b>{curSym}{fmtNum(livePreview.out_money_at_risk)}</b></div>
                <div className="stat"><span>Derating factor</span><b>{(livePreview.out_derating_factor * 100).toFixed(0)}%</b></div>
                <div className="stat"><span>FMEA trigger</span><b>{livePreview.out_fmea_trigger}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <h2>Investment Feasibility Report</h2>
            <div className="rid">
              SC-PRO-INV &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v5.3.1 &middot; Capital Budgeting<br />
              currency {curSym} &middot; NPV + scenario analysis
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  Recommendation: <strong>{DECISION_LABELS[result.out_final_decision_state]}</strong>
                </div>
                <p>
                  After NPV analysis across all three scenarios, the{" "}
                  {DECISION_LABELS[result.out_final_decision_state]} path yields the highest value.
                  Top-line margin: {curSym}{fmtNum(result.out_utilization_margin)}.
                  Expanded uncertainty: {curSym}{fmtNum(result.out_expanded_uncertainty)}.
                  Money at risk: {curSym}{fmtNum(result.out_money_at_risk)}.
                </p>
              </div>
            </div>

            {/* S2: Scenario Comparison */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">Scenario Comparison</span></div>
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
                    <td className="n">{result.out_final_decision_state === 0 ? "1st" : "\u2014"}</td>
                    <td className="n">Capex: {curSym}{fmtNum(engineInputs.initialInvestment)}, Cash flow: {curSym}{fmtNum(engineInputs.annualNetCashFlow)}/yr</td>
                  </tr>
                  <tr className={result.out_final_decision_state === 1 ? "total" : ""}>
                    <td>LEASE (Operating Lease)</td>
                    <td className="n">{result.out_final_decision_state === 1 ? "1st" : "\u2014"}</td>
                    <td className="n">Annual lease payment: {curSym}{fmtNum(engineInputs.initialInvestment * 0.25)}</td>
                  </tr>
                  <tr className={result.out_final_decision_state === 2 ? "total" : ""}>
                    <td>KEEP (Maintain Existing)</td>
                    <td className="n">{result.out_final_decision_state === 2 ? "1st" : "\u2014"}</td>
                    <td className="n">Cash flow contribution: {curSym}{fmtNum(engineInputs.annualNetCashFlow * 0.5)}/yr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* S3: Key Metrics */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Key Investment Metrics</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Evidence completeness</td><td className="n">{(result.out_evidence_completeness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Normalized demand</td><td className="n">{curSym}{fmtNum(result.out_normalized_demand)}</td></tr>
                  <tr><td>Reference deviation</td><td className="n">{result.out_reference_deviation.toFixed(4)}</td></tr>
                  <tr><td>Derating factor</td><td className="n">{(result.out_derating_factor * 100).toFixed(0)}%</td></tr>
                  <tr><td>Capacity metric</td><td className="n">{result.out_capacity_metric.toFixed(4)}</td></tr>
                  <tr><td>Buy vs Lease delta</td><td className="n">{curSym}{fmtNum(result.out_scenario_delta)}</td></tr>
                  <tr><td>Money at risk</td><td className="n">{curSym}{fmtNum(result.out_money_at_risk)}</td></tr>
                  <tr><td>Expanded uncertainty</td><td className="n">{curSym}{fmtNum(result.out_expanded_uncertainty)}</td></tr>
                  <tr><td>Threshold crossing</td><td className="n">{result.out_threshold_crossing === 1 ? "Positive NPV" : result.out_threshold_crossing === -1 ? "Below loss cost" : "No crossing"}</td></tr>
                  <tr><td>Sensitivity driver</td><td className="n">Driver index {result.out_sensitivity_driver}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmea_trigger}</td></tr>
                  <tr><td>Final decision</td><td className="n">{DECISION_LABELS[result.out_final_decision_state]}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Initial investment</td><td className="n">{curSym}{fmtNum(engineInputs.initialInvestment)}</td></tr>
                  <tr><td>Annual net cash flow</td><td className="n">{curSym}{fmtNum(engineInputs.annualNetCashFlow)}</td></tr>
                  <tr><td>Discount rate</td><td className="n">{(engineInputs.discountRate * 100).toFixed(1)}%</td></tr>
                  <tr><td>Analysis period</td><td className="n">{engineInputs.analysisYears} years</td></tr>
                  <tr><td>Residual value</td><td className="n">{curSym}{fmtNum(engineInputs.residualValue)}</td></tr>
                  <tr><td>Stress downside factor</td><td className="n">{(engineInputs.stressDownsideFactor * 100).toFixed(0)}%</td></tr>
                  <tr><td>Annual volume</td><td className="n">{fmtNum(engineInputs.annualVolume)}</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{fmtNum(engineInputs.laborRate)}/yr</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{curSym}{fmtNum(engineInputs.overheadRate)}/yr</td></tr>
                  <tr><td>Defect / loss cost</td><td className="n">{curSym}{fmtNum(engineInputs.defectOrLossCost)}</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(engineInputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                  <tr><td>Uncertainty multiplier</td><td className="n">{engineInputs.uncertaintyMultiplier.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S5: Insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h"><span className="sec-n">5</span><span className="sec-t">Insights &amp; Recommendations</span></div>
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
              <div className="sec-h"><span className="sec-n">6</span><span className="sec-t">Audit Trail &amp; Integrity</span></div>
              <div className="seal">
                SEAL &middot; SHA-256 {Date.now().toString(16).toUpperCase().slice(0, 16)}<br />
                Inputs and outputs are hashed together; altering any figure changes the seal.
                Verify at sectorcalc.com/verify &mdash; production seals are computed server-side.
              </div>
              <div className="disc">
                Technical simulation for investment decision support.
                Assumes straight-line NPV discounting and constant operating conditions across the
                planning horizon. Not a substitute for professional financial or engineering review.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Field render helper ──────────────────────────────────── */
  function renderField(f: FieldDef) {
    const curUnit = displayUnit[f.id] || f.unit;
    const raw = displayValue[f.id];
    const dv = raw ?? f.default;
    const canonVal = !isNaN(dv) ? toCanonical(f.domain, dv, curUnit) : NaN;
    const errText = getFieldError(f, dv, curUnit);

    return (
      <div className="f" key={f.id}>
        <div className="f-top">
          <label htmlFor={`inp-${f.id}`}>{f.label}</label>
          <span className="unitline" id={`ul-${f.id}`}>
            {errText ? "" : `${curSym}${fmtNum(canonVal)}${CANON_SUFFIX[f.domain] ?? ""}`}
          </span>
        </div>
        <div className={`control${errText ? " bad" : ""}`} id={`ct-${f.id}`}>
          {f.showPrefix && <span className="prefix" id={`px-${f.id}`}>{curSym}</span>}
          <input
            id={`inp-${f.id}`}
            type="number"
            value={isNaN(raw) ? "" : raw}
            onChange={(e) => handleChange(f.id, e.target.value)}
            min={f.hardMin}
            max={f.hardMax}
            step="any"
            inputMode="decimal"
          />
          {f.unitOptions.length > 0 && (
            <select
              value={curUnit}
              onChange={(e) => handleUnitChange(f.id, e.target.value)}
              aria-label="unit"
            >
              {f.unitOptions.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          )}
        </div>
        <div className="f-foot">
          <span className="hint">{f.hint}</span>
          <span className="bench-ref">{f.ref}</span>
        </div>
        <div className={`msg${errText ? " err" : ""}`} id={`ms-${f.id}`}>
          {errText}
        </div>
      </div>
    );
  }
}
