"use client";

/**
 * Loss-Making Job Detector — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 9 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import type { LossMakingJobInputs, LossMakingJobOutputs } from
  "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-loss-making-job-detector.css";

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
  id: keyof LossMakingJobInputs;
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
  // ── Cost Inputs ──
  { id: "machineRate", label: "Machine rate", defaultUnit: "/unit", showPrefix: true, default: 85, hint: "Cost allocation rate per machine unit.", ref: "rate \u00B7 /unit", group: "costs", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "materialCost", label: "Material cost", defaultUnit: "/batch", showPrefix: true, default: 300, hint: "Material cost allocated to the job.", ref: "cost \u00B7 /batch", group: "costs", hardMin: 0, hardMax: 1e7, step: "0.01" },
  { id: "laborRate", label: "Labor rate", defaultUnit: "/unit", showPrefix: true, default: 55, hint: "Direct labor rate per unit.", ref: "rate \u00B7 /unit", group: "costs", hardMin: 0, hardMax: 2000, step: "0.01" },
  { id: "overheadRate", label: "Overhead rate", defaultUnit: "/unit", showPrefix: true, default: 75, hint: "Allocated overhead per unit.", ref: "rate \u00B7 /unit", group: "costs", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "defectOrLossCost", label: "Defect / loss cost", defaultUnit: "/unit", showPrefix: true, default: 20, hint: "Estimated defect or loss cost per unit.", ref: "cost \u00B7 /unit", group: "costs", hardMin: 0, hardMax: 1e6, step: "0.01" },
  // ── Pricing ──
  { id: "targetMargin", label: "Target margin (ratio)", defaultUnit: "ratio", showPrefix: false, default: 0.25, hint: "Target contribution margin as a ratio (e.g. 0.25 = 25%).", ref: "0..1 ratio", group: "pricing", hardMin: 0, hardMax: 1, step: "0.01" },
  { id: "batchQuantity", label: "Batch quantity", defaultUnit: "units", showPrefix: false, default: 100, hint: "Number of units in the batch/job.", ref: "count", group: "pricing", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "annualVolume", label: "Annual volume", defaultUnit: "units/yr", showPrefix: false, default: 5000, hint: "Estimated annual production volume.", ref: "units/yr", group: "pricing", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "pricing", hardMin: 0, hardMax: 1, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  costs:   { title: "Cost Inputs", desc: "Machine rate, material, labor, overhead, and defect costs define the total job cost structure." },
  pricing: { title: "Pricing & Volume", desc: "Target margin, batch size, and volume determine pricing leverage and risk exposure." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function LossMakingJobDetectorPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<LossMakingJobInputs>(() => {
    const init: LossMakingJobInputs = {} as LossMakingJobInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<LossMakingJobOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): LossMakingJobOutputs | null => {
    if (!inputs.machineRate || inputs.machineRate <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof LossMakingJobInputs, raw: string) => {
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
      { label: "Machine Rate", value: inputs.machineRate },
      { label: "Material Cost", value: inputs.materialCost },
      { label: "Labor Rate", value: inputs.laborRate },
      { label: "Overhead Rate", value: inputs.overheadRate },
      { label: "Defect / Loss Cost", value: inputs.defectOrLossCost },
    ];
  }, [result, inputs]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Loss-Making Job Detector</h1>
        <p className="lede">
          Identify jobs that are priced below cost and quantify total loss exposure. &mdash;
          Evaluate unit economics, margin gaps, and annual profit erosion.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Corrective Action Context &bull; Auditable</span>
          <span><b>Cost Management</b></span>
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
            Generate Profitability Report
          </button>

          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against production records before business decisions.</span>
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
                    const cls = dec === 0 ? "pos" : dec === 1 ? "warn" : "neg";
                    const lbl = dec === 0 ? "PROFITABLE" : dec === 1 ? "BELOW TARGET — REVIEW" : "LOSS-MAKING — CRITICAL";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {(livePreview.out_utilization_margin * 100).toFixed(1)}%
                            <small>contribution margin</small>
                          </div>
                          <div className="big-cap">
                            {curSym}{livePreview.out_demand_metric.toFixed(0)} gross margin &middot;
                            {(livePreview.out_money_at_risk > 0) ? `${curSym}${livePreview.out_money_at_risk.toFixed(0)} at risk` : "No loss exposure"}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Revenue</span><b>{curSym}{livePreview.out_normalized_demand.toFixed(0)}</b></div>
                <div className="stat"><span>Gross margin</span><b>{curSym}{livePreview.out_demand_metric.toFixed(0)}</b></div>
                <div className="stat"><span>Contribution margin</span><b>{(livePreview.out_utilization_margin * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Minimum acceptable price</span><b>{curSym}{livePreview.out_capacity_metric.toFixed(0)}</b></div>
                <div className="stat"><span>Money at risk (annual)</span><b>{curSym}{livePreview.out_money_at_risk.toFixed(0)}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter machine rate &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>Loss-Making Job Detector Report</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Cost Management<br />
              Report ID: LJ-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {result.out_final_decision_state === 0 ? "Healthy" : result.out_final_decision_state === 1 ? "Below Target" : "Critical Loss"}
                </div>
                {result.out_final_decision_state === 0 ? (
                  <p>Contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}% meets the target. The job is priced profitably with no loss exposure.</p>
                ) : result.out_final_decision_state === 1 ? (
                  <p>Contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}% is below the {(inputs.targetMargin * 100).toFixed(1)}% target. While not loss-making, margin improvement is needed.</p>
                ) : (
                  <>
                    <p><strong>CRITICAL.</strong> This job is priced below cost with a contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}%.</p>
                    <p>Annual money at risk: {curSym}{result.out_money_at_risk.toFixed(0)}. Immediate pricing or cost restructuring is required.</p>
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
                    <th className="n">Cost ({curSym}/unit)</th>
                  </tr>
                </thead>
                <tbody>
                  {costStructure.map((cs) => (
                    <tr key={cs.label}>
                      <td>{cs.label}</td>
                      <td className="n">{curSym}{cs.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total Unit Cost</td>
                    <td className="n">{curSym}{costStructure.reduce((s, c) => s + c.value, 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* S3: Decision Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Decision Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Job revenue (price)</td><td className="n">{curSym}{result.out_normalized_demand.toFixed(2)}</td></tr>
                  <tr><td>Gross margin</td><td className="n">{curSym}{result.out_demand_metric.toFixed(2)}</td></tr>
                  <tr><td>Contribution margin</td><td className="n">{(result.out_utilization_margin * 100).toFixed(2)}%</td></tr>
                  <tr><td>Target margin</td><td className="n">{(inputs.targetMargin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Minimum acceptable price</td><td className="n">{curSym}{result.out_capacity_metric.toFixed(2)}</td></tr>
                  <tr><td>Annual loss exposure</td><td className="n">{curSym}{result.out_money_at_risk.toFixed(2)}</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_threshold_crossing === 0 ? "Within target" : "Below target"}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmea_trigger === 1 ? "ACTIVE" : "Inactive"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Machine rate</td><td className="n">{curSym}{inputs.machineRate.toFixed(2)}</td></tr>
                  <tr><td>Material cost</td><td className="n">{curSym}{inputs.materialCost.toFixed(2)}</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{inputs.laborRate.toFixed(2)}</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{curSym}{inputs.overheadRate.toFixed(2)}</td></tr>
                  <tr><td>Defect / loss cost</td><td className="n">{curSym}{inputs.defectOrLossCost.toFixed(2)}</td></tr>
                  <tr><td>Target margin</td><td className="n">{(inputs.targetMargin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Batch quantity</td><td className="n">{inputs.batchQuantity.toLocaleString()}</td></tr>
                  <tr><td>Annual volume</td><td className="n">{inputs.annualVolume.toLocaleString()}</td></tr>
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
                LOSS-JOB-REPORT-{Date.now().toString(36).toUpperCase()}<br />
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
