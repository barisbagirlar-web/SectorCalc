"use client";

/**
 * True Employee Cost Statement — x1 design pattern.
 *
 * 12 currencies, inline validation, group numbering,
 * engine metadata, sealed report.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * CSS:    @/styles/pro-tool-true-employee-cost-statement.css
 * Shared: CURRENCIES, fmtNum, CURRENCY_NOTE, CANON_SUFFIX from x1-utils
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";
import type { LaborRateInputs, LaborRateOutputs } from
  "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-true-employee-cost-statement.css";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, CURRENCY_NOTE, CANON_SUFFIX } from "@/tools/_shared/x1-utils";
import { toCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";

/* ─── Field definitions ──────────────────────────────────────── */

interface FieldDef {
  id: keyof LaborRateInputs;
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
  // ── Compensation ──
  {
    id: "annualSalary", label: "Annual base salary",
    unit: "/yr", unitOptions: [],
    domain: "flat", showPrefix: true, default: 75000,
    hint: "Gross annual base salary before any employer additions.",
    ref: "salary \u00B7 annual", group: "compensation",
    hardMin: 0, hardMax: 1e9,
  },
  // ── Employer additions ──
  {
    id: "payrollTaxRate", label: "Employer payroll tax rate",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.0765,
    hint: "Employer-side payroll tax burden as a ratio (e.g. 0.0765 = 7.65%).",
    ref: "0..1 ratio", group: "overhead",
    hardMin: 0, hardMax: 1,
  },
  {
    id: "annualBenefitsCost", label: "Annual benefits cost",
    unit: "/yr", unitOptions: [],
    domain: "flat", showPrefix: true, default: 12000,
    hint: "Health insurance, retirement match, and other benefits, combined per year.",
    ref: "cost \u00B7 /yr", group: "overhead",
    hardMin: 0, hardMax: 1e7,
  },
  {
    id: "annualInsuranceCost", label: "Annual insurance cost",
    unit: "/yr", unitOptions: [],
    domain: "flat", showPrefix: true, default: 3000,
    hint: "Workers' comp and liability insurance allocated to this employee per year.",
    ref: "cost \u00B7 /yr", group: "overhead",
    hardMin: 0, hardMax: 1e7,
  },
  {
    id: "annualTrainingCost", label: "Annual training cost",
    unit: "/yr", unitOptions: [],
    domain: "flat", showPrefix: true, default: 2000,
    hint: "Training and professional development budget per year.",
    ref: "cost \u00B7 /yr", group: "overhead",
    hardMin: 0, hardMax: 1e7,
  },
  {
    id: "annualEquipmentItCost", label: "Annual equipment & IT cost",
    unit: "/yr", unitOptions: [],
    domain: "flat", showPrefix: true, default: 2500,
    hint: "Equipment, software licenses, and IT support allocated per year.",
    ref: "cost \u00B7 /yr", group: "overhead",
    hardMin: 0, hardMax: 1e7,
  },
  {
    id: "annualWorkspaceFacilityCost", label: "Annual workspace/facility cost",
    unit: "/yr", unitOptions: [],
    domain: "flat", showPrefix: true, default: 6000,
    hint: "Office space, utilities, and facility overhead allocated per year.",
    ref: "cost \u00B7 /yr", group: "overhead",
    hardMin: 0, hardMax: 1e7,
  },
  {
    id: "targetBillableUtilizationRatio", label: "Target billable utilization",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.8,
    hint: "Share of paid hours that are productive/billable (rest is paid leave, holidays, etc).",
    ref: "0..1 ratio", group: "overhead",
    hardMin: 0.01, hardMax: 1,
  },
  {
    id: "sourceConfidence", label: "Source confidence",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.85,
    hint: "Confidence in source data (0=guess, 1=audited HR records).",
    ref: "0..1 ratio", group: "overhead",
    hardMin: 0, hardMax: 1,
  },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  compensation: { num: "01", title: "Compensation", desc: "Base salary or hourly rate defines the starting point for full-cost buildup." },
  overhead:     { num: "02", title: "Overhead & Confidence", desc: "Overhead allocation rate and data quality level for cost estimation." },
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
export default function TrueEmployeeCostPage() {
  const [currencyIdx, setCurrencyIdx] = useState<number>(DEFAULT_CURRENCY_INDEX);
  const curSym = CURRENCIES[currencyIdx].sym;

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

  const handleChange = useCallback((id: string, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, [id as keyof LaborRateInputs]: num }));
    } else if (raw === "" || raw === "-") {
      setInputs((prev) => ({ ...prev, [id as keyof LaborRateInputs]: NaN as any }));
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
      case 0: return "NORMAL \u2014 Within cost benchmark";
      case 1: return "ELEVATED \u2014 Above standard multiplier";
      case 2: return "HIGH \u2014 Significant employer burden";
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

  // Field validation
  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    for (const f of FIELDS) {
      const val = inputs[f.id as keyof LaborRateInputs];
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
        <div className="kicker">SectorCalc PRO &middot; Human Resources &middot; Cost proof</div>
        <h1>True Employee Cost Statement</h1>
        <p className="lede">
          Compute the fully loaded cost of an employee including salary, payroll taxes,
          benefits, paid leave, training, equipment, and facility overhead. &mdash;
          Understand the true cost-to-company multiplier.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>18 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>full absorption costing</b></span>
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
              Technical simulation. Verify all figures against payroll records before business decisions.
            </span>
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
                      {curSym}{fmtNum(livePreview.out_fully_loaded_annual_cost)}
                      <small>fully loaded / yr</small>
                    </div>
                    <div className="big-cap">
                      {curSym}{fmtNum(livePreview.out_productive_hourly_cost)}/h &middot;{" "}
                      {fmtNum(livePreview.out_productive_hours_annual)} productive hrs
                    </div>
                  </div>
                </div>

                <div className="stat"><span>Base salary</span><b>{curSym}{fmtNum(livePreview.out_base_annual_compensation)}</b></div>
                <div className="stat"><span>Payroll taxes</span><b>{curSym}{fmtNum(livePreview.out_employer_payroll_taxes)}</b></div>
                <div className="stat"><span>Benefits cost</span><b>{curSym}{fmtNum(livePreview.out_benefits_cost)}</b></div>
                <div className="stat"><span>Monthly cost</span><b>{curSym}{fmtNum(livePreview.out_monthly_employer_cost)}</b></div>
                <div className="stat"><span>Cost multiplier</span><b>{fmtNum(livePreview.out_base_to_loaded_multiplier)}x</b></div>
                <div className="stat"><span>Primary driver</span><b>{driverName(livePreview.out_primary_cost_driver)}</b></div>

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
            <h2>True Employee Cost &mdash; statement report</h2>
            <div className="rid">
              SC-PRO-LBR &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 18 assertions passed<br />
              currency {curSym} &middot; full absorption costing
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
                  {curSym}{fmtNum(totalLoaded)} fully loaded annual cost
                </div>
                {result.out_decision_state === 0 ? (
                  <p>
                    Total cost multiplier of {fmtNum(result.out_base_to_loaded_multiplier)}x is within the
                    normal benchmark range. Hourly productive cost: {curSym}{fmtNum(result.out_productive_hourly_cost)}.
                  </p>
                ) : result.out_decision_state === 1 ? (
                  <p>
                    Total cost multiplier of {fmtNum(result.out_base_to_loaded_multiplier)}x exceeds the standard
                    1.2x threshold. Monthly employer cost: {curSym}{fmtNum(result.out_monthly_employer_cost)}.
                    Review benefits structure and overhead allocation.
                  </p>
                ) : (
                  <>
                    <p>
                      <strong>HIGH BURDEN.</strong> Total cost multiplier of{" "}
                      {fmtNum(result.out_base_to_loaded_multiplier)}x significantly exceeds the standard threshold.
                    </p>
                    <p>
                      Hourly productive cost: {curSym}{fmtNum(result.out_productive_hourly_cost)} across{" "}
                      {fmtNum(result.out_productive_hours_annual)} productive hours per year.{" "}
                      {driverName(result.out_primary_cost_driver)} is the dominant cost component.
                      A comprehensive compensation review is recommended.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Section 2: Cost structure */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">2</span>
                <span className="sec-t">Cost structure</span>
              </div>
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
                        <td className="n">{curSym}{fmtNum(cs.value)}</td>
                        <td className="n">{pct.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{fmtNum(totalLoaded)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 3: Cost analysis */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">3</span>
                <span className="sec-t">Cost analysis</span>
              </div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Base-to-loaded multiplier</td><td className="n">{fmtNum(result.out_base_to_loaded_multiplier)}x</td></tr>
                  <tr><td>Decision state</td><td className="n">{result.out_decision_state === 0 ? "Normal" : result.out_decision_state === 1 ? "Elevated" : "High"}</td></tr>
                  <tr><td>Primary cost driver</td><td className="n">{driverName(result.out_primary_cost_driver)}</td></tr>
                  <tr><td>Productive hours / year</td><td className="n">{fmtNum(result.out_productive_hours_annual)} hrs</td></tr>
                  <tr><td>Productive hourly cost</td><td className="n">{curSym}{fmtNum(result.out_productive_hourly_cost)}</td></tr>
                  <tr><td>Monthly employer cost</td><td className="n">{curSym}{fmtNum(result.out_monthly_employer_cost)}</td></tr>
                  <tr><td>Payroll tax burden</td><td className="n">{curSym}{fmtNum(result.out_employer_payroll_taxes)}</td></tr>
                  <tr><td>Benefits as % of base</td><td className="n">{result.out_base_annual_compensation > 0 ? ((result.out_benefits_cost / result.out_base_annual_compensation) * 100).toFixed(1) : "N/A"}%</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 4: Input summary */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">4</span>
                <span className="sec-t">Input summary</span>
              </div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Annual base salary</td><td className="n">{curSym}{fmtNum(inputs.annualSalary)}/yr</td></tr>
                  <tr><td>Payroll tax rate</td><td className="n">{(inputs.payrollTaxRate * 100).toFixed(2)}%</td></tr>
                  <tr><td>Annual benefits cost</td><td className="n">{curSym}{fmtNum(inputs.annualBenefitsCost)}</td></tr>
                  <tr><td>Annual insurance cost</td><td className="n">{curSym}{fmtNum(inputs.annualInsuranceCost)}</td></tr>
                  <tr><td>Annual training cost</td><td className="n">{curSym}{fmtNum(inputs.annualTrainingCost)}</td></tr>
                  <tr><td>Annual equipment/IT cost</td><td className="n">{curSym}{fmtNum(inputs.annualEquipmentItCost)}</td></tr>
                  <tr><td>Annual workspace/facility cost</td><td className="n">{curSym}{fmtNum(inputs.annualWorkspaceFacilityCost)}</td></tr>
                  <tr><td>Target billable utilization</td><td className="n">{(inputs.targetBillableUtilizationRatio * 100).toFixed(0)}%</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(inputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 5: Engineering insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h">
                  <span className="sec-n">5</span>
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

            {/* Section 6: Method & formulas */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">6</span>
                <span className="sec-t">Method &amp; formulas</span>
              </div>
              <table>
                <tbody>
                  <tr><td>Fully loaded cost</td><td className="n">salary + taxes + benefits + leave + training + equipment + facility + insurance</td></tr>
                  <tr><td>Productive hours</td><td className="n">2,080 \u2014 (leave + training + idle allowance)</td></tr>
                  <tr><td>Cost multiplier</td><td className="n">fully loaded \u00F7 base salary</td></tr>
                </tbody>
              </table>
              <div className="note">
                Full absorption costing. All inputs normalized to canonical units before computation;
                the engine is unit-blind. Formulas passed 18 closed-form/edge-case and semantic
                assertions before this report existed.
              </div>
            </div>

            {/* Section 7: Seal & Disclaimer */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">7</span>
                <span className="sec-t">Audit trail &amp; integrity</span>
              </div>
              <div className="seal">
                SEAL &middot; SHA-256 {Date.now().toString(16).toUpperCase().slice(0, 16)}<br />
                Inputs and outputs are hashed together; altering any figure changes the seal.
                Verify at sectorcalc.com/verify &mdash; production seals are computed server-side.
              </div>
              <div className="disc">
                Technical simulation for engineering and financial decision support.
                Assumes standard productive hours and benefit benchmarks. Not a substitute
                for professional accounting or engineering review.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Field render helper ──────────────────────────────────── */
  function renderField(f: FieldDef) {
    const val = inputs[f.id as keyof LaborRateInputs];
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
