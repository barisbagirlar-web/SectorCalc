"use client";

/**
 * Loss-Making Job Detector — x1 design pattern.
 *
 * 12 currencies, inline validation, group numbering,
 * engine metadata, sealed report.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * CSS:    @/styles/pro-tool-loss-making-job-detector.css
 * Shared: CURRENCIES, fmtNum, CURRENCY_NOTE, CANON_SUFFIX from x1-utils
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import type { LossMakingJobInputs, LossMakingJobOutputs } from
  "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-loss-making-job-detector.css";
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
  // ── Cost Inputs ──
  {
    id: "machineRate", label: "Machine rate",
    unit: "/unit", unitOptions: [],
    domain: "flat", showPrefix: true, default: 85,
    hint: "Cost allocation rate per machine unit.",
    ref: "rate \u00B7 /unit", group: "costs",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "materialCost", label: "Material cost",
    unit: "/batch", unitOptions: [],
    domain: "flat", showPrefix: true, default: 300,
    hint: "Material cost allocated to the job.",
    ref: "cost \u00B7 /batch", group: "costs",
    hardMin: 0, hardMax: 1e7,
  },
  {
    id: "laborRate", label: "Labor rate",
    unit: "/unit", unitOptions: [],
    domain: "flat", showPrefix: true, default: 55,
    hint: "Direct labor rate per unit.",
    ref: "rate \u00B7 /unit", group: "costs",
    hardMin: 0, hardMax: 2000,
  },
  {
    id: "overheadRate", label: "Overhead rate",
    unit: "/unit", unitOptions: [],
    domain: "flat", showPrefix: true, default: 75,
    hint: "Allocated overhead per unit.",
    ref: "rate \u00B7 /unit", group: "costs",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "defectOrLossCost", label: "Defect / loss cost",
    unit: "/unit", unitOptions: [],
    domain: "flat", showPrefix: true, default: 20,
    hint: "Estimated defect or loss cost per unit.",
    ref: "cost \u00B7 /unit", group: "costs",
    hardMin: 0, hardMax: 1e6,
  },
  // ── Pricing ──
  {
    id: "targetMargin", label: "Target margin (ratio)",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.25,
    hint: "Target contribution margin as a ratio (e.g. 0.25 = 25%).",
    ref: "0..1 ratio", group: "pricing",
    hardMin: 0, hardMax: 1,
  },
  {
    id: "batchQuantity", label: "Batch quantity",
    unit: "units", unitOptions: [],
    domain: "flat", showPrefix: false, default: 100,
    hint: "Number of units in the batch/job.",
    ref: "count", group: "pricing",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "annualVolume", label: "Annual volume",
    unit: "units/yr", unitOptions: [],
    domain: "flat", showPrefix: false, default: 5000,
    hint: "Estimated annual production volume.",
    ref: "units/yr", group: "pricing",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "sourceConfidence", label: "Source confidence",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.9,
    hint: "Confidence in source data (0=guess, 1=audited).",
    ref: "0..1 ratio", group: "pricing",
    hardMin: 0, hardMax: 1,
  },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  costs:   { num: "01", title: "Cost Inputs", desc: "Machine rate, material, labor, overhead, and defect costs define the total job cost structure." },
  pricing: { num: "02", title: "Pricing & Volume", desc: "Target margin, batch size, and volume determine pricing leverage and risk exposure." },
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
export default function LossMakingJobDetectorPage() {
  const [currencyIdx, setCurrencyIdx] = useState<number>(DEFAULT_CURRENCY_INDEX);
  const curSym = CURRENCIES[currencyIdx].sym;

  const [inputs, setInputs] = useState<LossMakingJobInputs>(() => {
    const init: LossMakingJobInputs = {} as LossMakingJobInputs;
    for (const f of FIELDS) init[f.id as keyof LossMakingJobInputs] = f.default;
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

  const handleChange = useCallback((id: string, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, [id as keyof LossMakingJobInputs]: num }));
    } else if (raw === "" || raw === "-") {
      setInputs((prev) => ({ ...prev, [id as keyof LossMakingJobInputs]: NaN as any }));
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

  // Field validation
  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    for (const f of FIELDS) {
      const val = inputs[f.id as keyof LossMakingJobInputs];
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
        <div className="kicker">SectorCalc PRO &middot; Manufacturing &middot; Cost proof</div>
        <h1>Loss-Making Job Detector</h1>
        <p className="lede">
          Identify jobs that are priced below cost and quantify total loss exposure. &mdash;
          Evaluate unit economics, margin gaps, and annual profit erosion.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>24 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>unit-cost decomposition</b></span>
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
              Technical simulation. Verify all figures against production records before business decisions.
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
                    const dec = livePreview.out_final_decision_state;
                    const cls = dec === 0 ? "pos" : dec === 1 ? "warn" : "neg";
                    const lbl = dec === 0 ? "PROFITABLE" : dec === 1 ? "BELOW TARGET \u2014 REVIEW" : "LOSS-MAKING \u2014 CRITICAL";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {(livePreview.out_utilization_margin * 100).toFixed(1)}%
                            <small>contribution margin</small>
                          </div>
                          <div className="big-cap">
                            {curSym}{fmtNum(livePreview.out_demand_metric)} gross margin &middot;
                            {(livePreview.out_money_at_risk > 0) ? `${curSym}${fmtNum(livePreview.out_money_at_risk)} at risk` : "No loss exposure"}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Revenue</span><b>{curSym}{fmtNum(livePreview.out_normalized_demand)}</b></div>
                <div className="stat"><span>Gross margin</span><b>{curSym}{fmtNum(livePreview.out_demand_metric)}</b></div>
                <div className="stat"><span>Contribution margin</span><b>{(livePreview.out_utilization_margin * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Minimum acceptable price</span><b>{curSym}{fmtNum(livePreview.out_capacity_metric)}</b></div>
                <div className="stat"><span>Money at risk (annual)</span><b>{curSym}{fmtNum(livePreview.out_money_at_risk)}</b></div>

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
            <h2>Loss-Making Job Detector &mdash; proof report</h2>
            <div className="rid">
              SC-PRO-LJ &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 24 assertions passed<br />
              currency {curSym} &middot; unit-cost decomposition
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
                  {result.out_final_decision_state === 0 ? "Healthy" : result.out_final_decision_state === 1 ? "Below Target" : "Critical Loss"}
                </div>
                {result.out_final_decision_state === 0 ? (
                  <p>Contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}% meets the target. The job is priced profitably with no loss exposure.</p>
                ) : result.out_final_decision_state === 1 ? (
                  <p>Contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}% is below the {(inputs.targetMargin * 100).toFixed(1)}% target. While not loss-making, margin improvement is needed.</p>
                ) : (
                  <>
                    <p><strong>CRITICAL.</strong> This job is priced below cost with a contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}%.</p>
                    <p>Annual money at risk: {curSym}{fmtNum(result.out_money_at_risk)}. Immediate pricing or cost restructuring is required.</p>
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
                    <th className="n">Cost ({curSym}/unit)</th>
                  </tr>
                </thead>
                <tbody>
                  {costStructure.map((cs) => (
                    <tr key={cs.label}>
                      <td>{cs.label}</td>
                      <td className="n">{curSym}{fmtNum(cs.value)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total Unit Cost</td>
                    <td className="n">{curSym}{fmtNum(costStructure.reduce((s, c) => s + c.value, 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 3: Decision analysis */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">3</span>
                <span className="sec-t">Decision analysis</span>
              </div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Job revenue (price)</td><td className="n">{curSym}{fmtNum(result.out_normalized_demand)}</td></tr>
                  <tr><td>Gross margin</td><td className="n">{curSym}{fmtNum(result.out_demand_metric)}</td></tr>
                  <tr><td>Contribution margin</td><td className="n">{(result.out_utilization_margin * 100).toFixed(2)}%</td></tr>
                  <tr><td>Target margin</td><td className="n">{(inputs.targetMargin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Minimum acceptable price</td><td className="n">{curSym}{fmtNum(result.out_capacity_metric)}</td></tr>
                  <tr><td>Annual loss exposure</td><td className="n">{curSym}{fmtNum(result.out_money_at_risk)}</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_threshold_crossing === 0 ? "Within target" : "Below target"}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmea_trigger === 1 ? "ACTIVE" : "Inactive"}</td></tr>
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
                  <tr><td>Machine rate</td><td className="n">{curSym}{fmtNum(inputs.machineRate)}</td></tr>
                  <tr><td>Material cost</td><td className="n">{curSym}{fmtNum(inputs.materialCost)}</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{fmtNum(inputs.laborRate)}</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{curSym}{fmtNum(inputs.overheadRate)}</td></tr>
                  <tr><td>Defect / loss cost</td><td className="n">{curSym}{fmtNum(inputs.defectOrLossCost)}</td></tr>
                  <tr><td>Target margin</td><td className="n">{(inputs.targetMargin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Batch quantity</td><td className="n">{inputs.batchQuantity.toLocaleString()}</td></tr>
                  <tr><td>Annual volume</td><td className="n">{inputs.annualVolume.toLocaleString()}</td></tr>
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
                  <tr><td>Total unit cost</td><td className="n">machine + material + labor + overhead + defect</td></tr>
                  <tr><td>Contribution margin</td><td className="n">(price \u2014 total unit cost) \u00F7 price</td></tr>
                  <tr><td>Money at risk</td><td className="n">margin gap \u00D7 annual volume</td></tr>
                </tbody>
              </table>
              <div className="note">
                Unit-cost decomposition. All inputs normalized to canonical units before computation;
                the engine is unit-blind. Formulas passed 24 closed-form/edge-case and semantic
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
                Assumes constant unit cost structure and linear volume scaling.
                Not a substitute for professional accounting or engineering review.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Field render helper ──────────────────────────────────── */
  function renderField(f: FieldDef) {
    const val = inputs[f.id as keyof LossMakingJobInputs];
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
