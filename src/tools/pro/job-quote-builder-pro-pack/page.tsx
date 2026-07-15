"use client";

/**
 * Job Quote Builder Pro Pack — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 12 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import type { JobQuoteInputs, JobQuoteOutputs } from
  "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import { getActiveInsights } from "./insights";
import "@/styles/pro-tool-job-quote-builder-pro-pack.css";

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
  id: keyof JobQuoteInputs;
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
  // ── Rates ──
  { id: "machineRate", label: "Machine hourly rate", defaultUnit: "/hour", showPrefix: true, default: 85, hint: "Fully loaded machine rate including depreciation, energy, and maintenance.", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "rates", hardMin: 0, hardMax: 5000, step: "0.01" },
  { id: "laborRate", label: "Labor hourly rate", defaultUnit: "/hour", showPrefix: true, default: 35, hint: "Fully loaded labor rate including wages, benefits, and payroll taxes.", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "rates", hardMin: 0, hardMax: 500, step: "0.01" },
  { id: "overheadRate", label: "Annual overhead", defaultUnit: "/year", showPrefix: true, default: 60000, hint: "Total annual overhead costs allocated to this product line.", ref: "/year \u00B7 /quarter \u00B7 /month", group: "rates", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Time ──
  { id: "cycleTime", label: "Cycle time per batch", defaultUnit: "min", showPrefix: false, default: 12, hint: "Total cycle time for one batch (run time per batch).", ref: "min \u00B7 hours", group: "time", hardMin: 0, hardMax: 10080, step: "0.1" },
  { id: "setupTime", label: "Setup time per batch", defaultUnit: "min", showPrefix: false, default: 8, hint: "Changeover and setup time per batch.", ref: "min \u00B7 hours", group: "time", hardMin: 0, hardMax: 10080, step: "0.1" },
  // ── Cost ──
  { id: "materialCost", label: "Material cost per unit", defaultUnit: "/unit", showPrefix: true, default: 45, hint: "Raw material and purchased part cost per unit.", ref: "/unit \u00B7 /batch", group: "cost", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "defectOrLossCost", label: "Estimated defect/scrap cost", defaultUnit: "/period", showPrefix: true, default: 1500, hint: "Estimated cost of defects, scrap, and rework in the measurement period.", ref: "/period \u00B7 /year", group: "cost", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Volume ──
  { id: "batchQuantity", label: "Batch quantity", defaultUnit: "units", showPrefix: false, default: 500, hint: "Number of units in this production batch.", ref: "units", group: "volume", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "annualVolume", label: "Annual production volume", defaultUnit: "units/yr", showPrefix: false, default: 12000, hint: "Total annual volume for overhead allocation.", ref: "units/yr \u00B7 /quarter", group: "volume", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Margin ──
  { id: "targetMargin", label: "Target margin", defaultUnit: "ratio", showPrefix: false, default: 0.25, hint: "Target profit margin as a decimal ratio (e.g. 0.25 = 25%).", ref: "0..1 ratio \u00B7 %", group: "margin", hardMin: 0, hardMax: 1, step: "0.01" },
  { id: "uncertaintyMultiplier", label: "Uncertainty multiplier", defaultUnit: "ratio", showPrefix: false, default: 0.15, hint: "Multiplier applied to recommended price for risk adjustment (0=no risk, 1=high risk).", ref: "0..1+ ratio", group: "margin", hardMin: 0, hardMax: 1, step: "0.01" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "margin", hardMin: 0, hardMax: 1, step: "0.05" },
];

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  rates:  { title: "Rate Parameters", desc: "Hourly rates for machine, labor, and annual overhead allocation." },
  time:   { title: "Time Parameters", desc: "Cycle time and setup time define the labor and machine cost per batch." },
  cost:   { title: "Cost Parameters", desc: "Material cost per unit and estimated defect/scrap loss." },
  volume: { title: "Volume Parameters", desc: "Batch quantity and annual volume determine material and overhead allocation." },
  margin: { title: "Margin & Risk", desc: "Target margin, uncertainty multiplier, and source confidence for risk-adjusted pricing." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

/* ─── Component ──────────────────────────────────────────────── */
export default function JobQuoteBuilderProPackPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<JobQuoteInputs>(() => {
    const init: JobQuoteInputs = {} as JobQuoteInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<JobQuoteOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): JobQuoteOutputs | null => {
    if (!inputs.batchQuantity || inputs.batchQuantity <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof JobQuoteInputs, raw: string) => {
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
      { label: "Labor Cost", value: result.out_laborCost, pct: result.out_totalJobCost > 0 ? result.out_laborCost / result.out_totalJobCost * 100 : 0 },
      { label: "Machine Cost", value: result.out_machineCost, pct: result.out_totalJobCost > 0 ? result.out_machineCost / result.out_totalJobCost * 100 : 0 },
      { label: "Material Cost (Total)", value: result.out_materialCostTotal, pct: result.out_totalJobCost > 0 ? result.out_materialCostTotal / result.out_totalJobCost * 100 : 0 },
      { label: "Scrap Allowance", value: result.out_scrapAllowance, pct: result.out_totalJobCost > 0 ? result.out_scrapAllowance / result.out_totalJobCost * 100 : 0 },
      { label: "Overhead Allocation", value: result.out_overheadAllocation, pct: result.out_totalJobCost > 0 ? result.out_overheadAllocation / result.out_totalJobCost * 100 : 0 },
    ];
  }, [result]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Job Quote Builder Pro Pack</h1>
        <p className="lede">
          Build accurate job quotes with machine rate, labor, material, overhead, and risk-adjusted pricing. &mdash;
          Identify margin gaps, cost drivers, and pricing opportunities.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Quotation Context &bull; Auditable</span>
          <span><b>Job Costing</b></span>
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
            Generate Job Quote Report
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
                    const dec = livePreview.out_decisionState;
                    const cls = dec === 0 ? "pos" : dec === 1 ? "warn" : "neg";
                    const lbl = dec === 0 ? "ON TARGET" : dec === 1 ? "BELOW TARGET \u2014 REVIEW" : "CRITICAL \u2014 RESTRUCTURE";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{livePreview.out_totalJobCost.toFixed(0)}
                            <small>total job cost</small>
                          </div>
                          <div className="big-cap">{curSym}{livePreview.out_riskAdjustedPrice.toFixed(0)} final price &middot; {(livePreview.out_marginPct * 100).toFixed(1)}% margin</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Labor cost</span><b>{curSym}{livePreview.out_laborCost.toFixed(2)}</b></div>
                <div className="stat"><span>Machine cost</span><b>{curSym}{livePreview.out_machineCost.toFixed(2)}</b></div>
                <div className="stat"><span>Material cost (total)</span><b>{curSym}{livePreview.out_materialCostTotal.toFixed(2)}</b></div>
                <div className="stat"><span>Scrap allowance</span><b>{curSym}{livePreview.out_scrapAllowance.toFixed(2)}</b></div>
                <div className="stat"><span>Overhead allocation</span><b>{curSym}{livePreview.out_overheadAllocation.toFixed(2)}</b></div>
                <div className="stat"><span>Recommended price</span><b>{curSym}{livePreview.out_recommendedPrice.toFixed(2)}</b></div>
                <div className="stat"><span>Risk-adjusted price</span><b>{curSym}{livePreview.out_riskAdjustedPrice.toFixed(2)}</b></div>
                <div className="stat"><span>Actual margin</span><b>{(livePreview.out_marginPct * 100).toFixed(1)}%</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter batch quantity &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>Job Quote Report</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Quotation Context<br />
              Report ID: JQ-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {curSym}{result.out_riskAdjustedPrice.toFixed(0)} risk-adjusted price
                </div>
                {result.out_decisionState === 0 ? (
                  <p>Margin of {(result.out_marginPct * 100).toFixed(1)}% meets the {(inputs.targetMargin * 100).toFixed(0)}% target. Recommended price: {curSym}{result.out_recommendedPrice.toFixed(2)}. Total job cost is {curSym}{result.out_totalJobCost.toFixed(2)}.</p>
                ) : result.out_decisionState === 1 ? (
                  <p>Margin of {(result.out_marginPct * 100).toFixed(1)}% is below the {(inputs.targetMargin * 100).toFixed(0)}% target but above half. Risk-adjusted price: {curSym}{result.out_riskAdjustedPrice.toFixed(2)}. Review cost drivers for improvement opportunities.</p>
                ) : (
                  <>
                    <p><strong>CRITICAL.</strong> Margin of {(result.out_marginPct * 100).toFixed(1)}% is severely below the {(inputs.targetMargin * 100).toFixed(0)}% target.</p>
                    <p>Total job cost: {curSym}{result.out_totalJobCost.toFixed(2)}. Risk-adjusted price: {curSym}{result.out_riskAdjustedPrice.toFixed(2)}. Cost restructuring or customer renegotiation recommended.</p>
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
                  {costStructure.map((cs) => (
                    <tr key={cs.label}>
                      <td>{cs.label}</td>
                      <td className="n">{curSym}{cs.value.toFixed(2)}</td>
                      <td className="n">{cs.pct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{result.out_totalJobCost.toFixed(2)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* S3: Pricing Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Pricing Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Total job cost</td><td className="n">{curSym}{result.out_totalJobCost.toFixed(2)}</td></tr>
                  <tr><td>Target markup</td><td className="n">{(result.out_markupMultiplier - 1) * 100}%</td></tr>
                  <tr><td>Markup multiplier</td><td className="n">{result.out_markupMultiplier.toFixed(4)}x</td></tr>
                  <tr><td>Recommended price</td><td className="n">{curSym}{result.out_recommendedPrice.toFixed(2)}</td></tr>
                  <tr><td>Risk-adjusted price</td><td className="n">{curSym}{result.out_riskAdjustedPrice.toFixed(2)}</td></tr>
                  <tr><td>Actual margin</td><td className="n">{(result.out_marginPct * 100).toFixed(2)}%</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_thresholdCrossing === 0 ? "On target" : "Below target"}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmeaTrigger === 1 ? "ACTIVE" : "Inactive"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Machine hourly rate</td><td className="n">{curSym}{inputs.machineRate.toFixed(2)}/h</td></tr>
                  <tr><td>Labor hourly rate</td><td className="n">{curSym}{inputs.laborRate.toFixed(2)}/h</td></tr>
                  <tr><td>Annual overhead</td><td className="n">{curSym}{inputs.overheadRate.toFixed(2)}/yr</td></tr>
                  <tr><td>Cycle time per batch</td><td className="n">{inputs.cycleTime.toFixed(1)} min</td></tr>
                  <tr><td>Setup time per batch</td><td className="n">{inputs.setupTime.toFixed(1)} min</td></tr>
                  <tr><td>Material cost per unit</td><td className="n">{curSym}{inputs.materialCost.toFixed(2)}</td></tr>
                  <tr><td>Defect/scrap cost (est.)</td><td className="n">{curSym}{inputs.defectOrLossCost.toFixed(2)}</td></tr>
                  <tr><td>Batch quantity</td><td className="n">{inputs.batchQuantity.toLocaleString()}</td></tr>
                  <tr><td>Annual volume</td><td className="n">{inputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>Target margin</td><td className="n">{(inputs.targetMargin * 100).toFixed(0)}%</td></tr>
                  <tr><td>Uncertainty multiplier</td><td className="n">{inputs.uncertaintyMultiplier.toFixed(2)}</td></tr>
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
                JOB-QUOTE-{Date.now().toString(36).toUpperCase()}<br />
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
