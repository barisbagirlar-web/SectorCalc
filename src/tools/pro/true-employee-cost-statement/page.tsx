"use client";

/**
 * True Employee Cost Statement — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 3 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";
import type { LaborRateInputs, LaborRateOutputs } from
  "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-true-employee-cost-statement.css";

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
  id: keyof LaborRateInputs;
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
  // ── Compensation ──
  { id: "annualSalary", label: "Annual salary / labor rate", defaultUnit: "/yr", showPrefix: true, default: 75000, hint: "Gross annual salary before deductions. Values below 100 treated as hourly rate.", ref: "salary \u00B7 hourly \u00B7 annual", group: "compensation", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Overhead ──
  { id: "overheadRate", label: "Overhead allocation rate", defaultUnit: "%", showPrefix: false, default: 15, hint: "Indirect cost allocation rate as percentage of base salary.", ref: "% \u00B7 ratio", group: "overhead", hardMin: 0, hardMax: 100, step: "0.5" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited HR records).", ref: "0..1 ratio", group: "overhead", hardMin: 0, hardMax: 1, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  compensation: { title: "Compensation", desc: "Base salary or hourly rate defines the starting point for full-cost buildup." },
  overhead:     { title: "Overhead & Confidence", desc: "Overhead allocation rate and data quality level for cost estimation." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function TrueEmployeeCostPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<LaborRateInputs>(() => {
    const init: LaborRateInputs = {} as LaborRateInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<LaborRateOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): LaborRateOutputs | null => {
    if (!inputs.annualSalary || inputs.annualSalary <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof LaborRateInputs, raw: string) => {
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

  // Cost structure for display
  const costStructure = useMemo(() => {
    if (!result) return [];
    return [
      { label: "Base Salary", value: result.out_base_annual_compensation },
      { label: "Payroll Taxes", value: result.out_employer_payroll_taxes },
      { label: "Benefits", value: result.out_benefits_cost },
      { label: "Paid Leave", value: result.out_paid_leave_cost },
      { label: "Training", value: result.out_training_allocation },
      { label: "Equipment & IT", value: result.out_equipment_it_cost },
      { label: "Workspace & Facility", value: result.out_workspace_facility_cost },
      { label: "Insurance Burden", value: result.out_insurance_burden },
    ];
  }, [result]);

  const totalLoaded = useMemo(() => {
    if (!result) return 0;
    return result.out_fully_loaded_annual_cost;
  }, [result]);

  // Decision state display
  const decisionLabel = (state: number): string => {
    switch (state) {
      case 0: return "NORMAL — Within cost benchmark";
      case 1: return "ELEVATED — Above standard multiplier";
      case 2: return "HIGH — Significant employer burden";
      default: return "UNDEFINED";
    }
  };

  const decisionClass = (state: number): string => {
    switch (state) {
      case 0: return "pos";
      case 1: return "warn";
      case 2: return "neg";
      default: return "";
    }
  };

  // Primary driver name
  const driverName = (idx: number): string => {
    const names = [
      "Base Salary", "Payroll Taxes", "Benefits",
      "Paid Leave", "Training", "Equipment & IT",
      "Workspace & Facility", "Insurance Burden",
    ];
    return names[idx] ?? "Unknown";
  };

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>True Employee Cost Statement</h1>
        <p className="lede">
          Compute the fully loaded cost of an employee including salary, payroll taxes,
          benefits, paid leave, training, equipment, and facility overhead. &mdash;
          Understand the true cost-to-company multiplier.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Cost of Quality Context &bull; Auditable</span>
          <span><b>Labor Costing</b></span>
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
            Generate Employee Cost Report
          </button>

          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against payroll records before business decisions.</span>
          </div>
        </div>

        {/* Live rail */}
        <div className="rail">
          <div className="rail-in">
            {livePreview ? (
              <>
                <div className="verdict">
                  <div className={`verdict-band ${decisionClass(livePreview.out_decision_state)}`}>
                    {decisionLabel(livePreview.out_decision_state)}
                  </div>
                  <div className="verdict-body">
                    <div className="big">
                      {curSym}{livePreview.out_fully_loaded_annual_cost.toFixed(0)}
                      <small>fully loaded / yr</small>
                    </div>
                    <div className="big-cap">
                      {curSym}{livePreview.out_productive_hourly_cost.toFixed(2)}/h &middot;{" "}
                      {livePreview.out_productive_hours_annual.toFixed(0)} productive hrs
                    </div>
                  </div>
                </div>

                <div className="stat"><span>Base salary</span><b>{curSym}{livePreview.out_base_annual_compensation.toFixed(0)}</b></div>
                <div className="stat"><span>Payroll taxes</span><b>{curSym}{livePreview.out_employer_payroll_taxes.toFixed(0)}</b></div>
                <div className="stat"><span>Benefits cost</span><b>{curSym}{livePreview.out_benefits_cost.toFixed(0)}</b></div>
                <div className="stat"><span>Monthly cost</span><b>{curSym}{livePreview.out_monthly_employer_cost.toFixed(0)}</b></div>
                <div className="stat"><span>Cost multiplier</span><b>{livePreview.out_base_to_loaded_multiplier.toFixed(2)}x</b></div>
                <div className="stat"><span>Primary driver</span><b>{driverName(livePreview.out_primary_cost_driver)}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter annual salary &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>True Employee Cost Report</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Cost of Quality Context<br />
              Report ID: LC-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {curSym}{totalLoaded.toFixed(0)} fully loaded annual cost
                </div>
                {result.out_decision_state === 0 ? (
                  <p>
                    Total cost multiplier of {result.out_base_to_loaded_multiplier.toFixed(2)}x is within the
                    normal benchmark range. Hourly productive cost: {curSym}{result.out_productive_hourly_cost.toFixed(2)}.
                  </p>
                ) : result.out_decision_state === 1 ? (
                  <p>
                    Total cost multiplier of {result.out_base_to_loaded_multiplier.toFixed(2)}x exceeds the standard
                    1.2x threshold. Monthly employer cost: {curSym}{result.out_monthly_employer_cost.toFixed(0)}.
                    Review benefits structure and overhead allocation.
                  </p>
                ) : (
                  <>
                    <p>
                      <strong>HIGH BURDEN.</strong> Total cost multiplier of{" "}
                      {result.out_base_to_loaded_multiplier.toFixed(2)}x significantly exceeds the standard threshold.
                    </p>
                    <p>
                      Hourly productive cost: {curSym}{result.out_productive_hourly_cost.toFixed(2)} across{" "}
                      {result.out_productive_hours_annual.toFixed(0)} productive hours per year.{" "}
                      {driverName(result.out_primary_cost_driver)} is the dominant cost component.
                      A comprehensive compensation review is recommended.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* S2: Cost Structure */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Cost Structure</span></div>
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th className="n">Amount ({curSym})</th>
                    <th className="n">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {costStructure.map((cs) => {
                    const pct = totalLoaded > 0 ? (cs.value / totalLoaded) * 100 : 0;
                    return (
                      <tr key={cs.label}>
                        <td>{cs.label}</td>
                        <td className="n">{curSym}{cs.value.toFixed(0)}</td>
                        <td className="n">{pct.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{totalLoaded.toFixed(0)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* S3: Cost Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Cost Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Base-to-loaded multiplier</td><td className="n">{result.out_base_to_loaded_multiplier.toFixed(2)}x</td></tr>
                  <tr><td>Decision state</td><td className="n">{result.out_decision_state === 0 ? "Normal" : result.out_decision_state === 1 ? "Elevated" : "High"}</td></tr>
                  <tr><td>Primary cost driver</td><td className="n">{driverName(result.out_primary_cost_driver)}</td></tr>
                  <tr><td>Productive hours / year</td><td className="n">{result.out_productive_hours_annual.toFixed(0)} hrs</td></tr>
                  <tr><td>Productive hourly cost</td><td className="n">{curSym}{result.out_productive_hourly_cost.toFixed(2)}</td></tr>
                  <tr><td>Monthly employer cost</td><td className="n">{curSym}{result.out_monthly_employer_cost.toFixed(2)}</td></tr>
                  <tr><td>Payroll tax burden</td><td className="n">{curSym}{result.out_employer_payroll_taxes.toFixed(0)}</td></tr>
                  <tr><td>Benefits as % of base</td><td className="n">{result.out_base_annual_compensation > 0 ? ((result.out_benefits_cost / result.out_base_annual_compensation) * 100).toFixed(1) : "N/A"}%</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Annual salary / labor rate</td><td className="n">{curSym}{inputs.annualSalary.toFixed(2)}{inputs.annualSalary <= 100 ? "/h" : "/yr"}</td></tr>
                  <tr><td>Overhead allocation rate</td><td className="n">{inputs.overheadRate.toFixed(1)}%</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(inputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
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
                LABOR-COST-{Date.now().toString(36).toUpperCase()}<br />
                Engine: executeFormula v5.3.1-pro &bull; ISO 9001:2015 Context<br />
                Generated: {new Date().toISOString()}
              </div>
              <div className="disc">
                <strong>Disclaimer.</strong> This report is a technical simulation based on the inputs provided.
                It does not constitute financial, legal, or engineering advice. Always verify calculations
                with a qualified professional before making business decisions.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
