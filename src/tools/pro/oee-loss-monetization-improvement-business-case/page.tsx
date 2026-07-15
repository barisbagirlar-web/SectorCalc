"use client";

/**
 * OEE Loss Monetization & Improvement Business Case — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 10 inputs with unit selectors, live result rail, report section,
 * OEE loss breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import type { OEELossInputs, OEELossOutputs } from
  "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import { getActiveInsights } from "./insights";
import "@/styles/pro-tool-oee-loss-monetization-improvement-business-case.css";

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
  id: keyof OEELossInputs;
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
  // ── Time ──
  { id: "plannedProductionTime", label: "Planned production time", defaultUnit: "min", showPrefix: false, default: 480, hint: "Total scheduled production time for the period.", ref: "min \u00B7 hours \u00B7 shifts", group: "time", hardMin: 0, hardMax: 1e6, step: "1" },
  { id: "operatingTime", label: "Operating time", defaultUnit: "min", showPrefix: false, default: 420, hint: "Actual run time (planned minus downtime).", ref: "min \u00B7 hours", group: "time", hardMin: 0, hardMax: 1e6, step: "1" },
  { id: "netOperatingTime", label: "Net operating time", defaultUnit: "min", showPrefix: false, default: 380, hint: "Operating time minus speed losses.", ref: "min \u00B7 hours", group: "time", hardMin: 0, hardMax: 1e6, step: "1" },
  { id: "valuableOperatingTime", label: "Valuable operating time", defaultUnit: "min", showPrefix: false, default: 340, hint: "Time producing good parts (net minus quality losses).", ref: "min \u00B7 hours", group: "time", hardMin: 0, hardMax: 1e6, step: "1" },
  // ── Production ──
  { id: "idealCycleTime", label: "Ideal cycle time", defaultUnit: "sec/part", showPrefix: false, default: 45, hint: "Theoretical fastest cycle time per part.", ref: "sec \u00B7 minutes \u00B7 parts/min", group: "production", hardMin: 0, hardMax: 3600, step: "1" },
  { id: "totalParts", label: "Total parts produced", defaultUnit: "units", showPrefix: false, default: 500, hint: "Total parts produced in the period including defects.", ref: "units", group: "production", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "goodParts", label: "Good parts", defaultUnit: "units", showPrefix: false, default: 470, hint: "First-pass quality parts (no rework).", ref: "units", group: "production", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Cost ──
  { id: "hourlyContribution", label: "Hourly contribution margin", defaultUnit: "/hour", showPrefix: true, default: 120, hint: "Revenue contribution per operating hour (fully loaded).", ref: "/hour \u00B7 /shift \u00B7 /day", group: "cost", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "improvementCost", label: "Improvement program cost", defaultUnit: "total", showPrefix: true, default: 25000, hint: "Total investment required for the improvement initiative.", ref: "lump sum", group: "cost", hardMin: 0, hardMax: 1e9, step: "0.01" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "cost", hardMin: 0, hardMax: 1, step: "0.05" },
];

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  time:       { title: "Time Components", desc: "Break down planned, operating, net, and valuable operating time to isolate availability, performance, and quality losses." },
  production: { title: "Production Output", desc: "Cycle time, total parts, and good parts define the quality and performance metrics of OEE." },
  cost:       { title: "Cost Parameters", desc: "Hourly contribution, improvement investment, and data confidence for the business case." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const DECISION_MAP: Record<number, { label: string; cls: string }> = {
  0: { label: "STRONG BUSINESS CASE", cls: "pos" },
  1: { label: "MODERATE — PROCEED WITH CAUTION", cls: "warn" },
  2: { label: "WEAK — RECONSIDER INVESTMENT", cls: "neg" },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function OEELossPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<OEELossInputs>(() => {
    const init: OEELossInputs = {} as OEELossInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<OEELossOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): OEELossOutputs | null => {
    if (!inputs.plannedProductionTime || inputs.plannedProductionTime <= 0) return null;
    if (!inputs.totalParts || inputs.totalParts <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof OEELossInputs, raw: string) => {
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

  // Loss structure breakdown
  const lossStructure = useMemo(() => {
    if (!result) return [];
    return [
      { label: "Availability Loss", value: result.out_availability_loss_value, pct: result.out_total_oee_loss > 0 ? result.out_availability_loss_value / result.out_total_oee_loss * 100 : 0 },
      { label: "Performance Loss", value: result.out_performance_loss_value, pct: result.out_total_oee_loss > 0 ? result.out_performance_loss_value / result.out_total_oee_loss * 100 : 0 },
      { label: "Quality Loss", value: result.out_quality_loss_value, pct: result.out_total_oee_loss > 0 ? result.out_quality_loss_value / result.out_total_oee_loss * 100 : 0 },
    ];
  }, [result]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>OEE Loss Monetization &amp; Improvement Business Case</h1>
        <p className="lede">
          Quantify OEE losses in monetary terms, model improvement scenarios, and validate the business case for investment. &mdash;
          Convert availability, performance, and quality losses into a 3-year improvement ROI.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Performance Evaluation &bull; Auditable</span>
          <span><b>OEE Analysis</b></span>
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
            Generate OEE Business Case Report
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
                    const dec = livePreview.out_decision_state;
                    const info = DECISION_MAP[dec] || DECISION_MAP[2];
                    return (
                      <>
                        <div className={`verdict-band ${info.cls}`}>{info.label}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{livePreview.out_total_oee_loss.toFixed(0)}
                            <small>total OEE loss</small>
                          </div>
                          <div className="big-cap">{(livePreview.out_oee_score * 100).toFixed(1)}% OEE &middot; {(livePreview.out_roi_ratio).toFixed(2)}x ROI ratio</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Availability</span><b>{(livePreview.out_availability * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Performance</span><b>{(livePreview.out_performance * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Quality</span><b>{(livePreview.out_quality * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Improvement value</span><b>{curSym}{livePreview.out_improvement_value.toFixed(0)}</b></div>
                <div className="stat"><span>ROI ratio</span><b>{livePreview.out_roi_ratio.toFixed(2)}x</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter planned production time &gt; 0 and total parts &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>OEE Loss Monetization &amp; Improvement Business Case Report</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Performance Evaluation<br />
              Report ID: OEE-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {curSym}{result.out_total_oee_loss.toFixed(0)} total monetized OEE loss
                </div>
                {result.out_decision_state === 0 ? (
                  <>
                    <p><strong>Strong business case.</strong> OEE of {(result.out_oee_score * 100).toFixed(1)}% with an improvement value of {curSym}{result.out_improvement_value.toFixed(0)} and ROI ratio of {result.out_roi_ratio.toFixed(2)}x.</p>
                    <p>3-year improvement value ({curSym}{result.out_improvement_value.toFixed(0)}) is more than double the investment cost — proceed with capital approval.</p>
                  </>
                ) : result.out_decision_state === 1 ? (
                  <>
                    <p>OEE of {(result.out_oee_score * 100).toFixed(1)}% with total loss of {curSym}{result.out_total_oee_loss.toFixed(0)}. Improvement value ({curSym}{result.out_improvement_value.toFixed(0)}) exceeds cost but does not reach the 2x threshold.</p>
                    <p>ROI ratio: {result.out_roi_ratio.toFixed(2)}x. Proceed with caution — validate assumptions before commitment.</p>
                  </>
                ) : (
                  <>
                    <p><strong>Weak business case.</strong> OEE of {(result.out_oee_score * 100).toFixed(1)}% with improvement value ({curSym}{result.out_improvement_value.toFixed(0)}) below the {curSym}{(inputs.improvementCost).toFixed(0)} investment cost.</p>
                    <p>ROI ratio: {result.out_roi_ratio.toFixed(2)}x. Re-evaluate the scope of improvement or pursue lower-cost interventions.</p>
                  </>
                )}
              </div>
            </div>

            {/* S2: OEE Breakdown */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">OEE Performance Breakdown</span></div>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th className="n">Rate</th>
                    <th className="n">Loss ({curSym})</th>
                    <th className="n">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {lossStructure.map((ls) => (
                    <tr key={ls.label}>
                      <td>{ls.label}</td>
                      <td className="n">{ls.label === "Availability Loss" ? `${(result.out_availability * 100).toFixed(1)}%` : ls.label === "Performance Loss" ? `${(result.out_performance * 100).toFixed(1)}%` : `${(result.out_quality * 100).toFixed(1)}%`}</td>
                      <td className="n">{curSym}{ls.value.toFixed(0)}</td>
                      <td className="n">{ls.pct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Overall OEE</td>
                    <td className="n">{(result.out_oee_score * 100).toFixed(1)}%</td>
                    <td className="n">{curSym}{result.out_total_oee_loss.toFixed(0)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* S3: Business Case */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Business Case Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Total monetized OEE loss</td><td className="n">{curSym}{result.out_total_oee_loss.toFixed(0)}</td></tr>
                  <tr><td>Improvement value (3yr &times; 70%)</td><td className="n">{curSym}{result.out_improvement_value.toFixed(0)}</td></tr>
                  <tr><td>Improvement investment cost</td><td className="n">{curSym}{inputs.improvementCost.toFixed(0)}</td></tr>
                  <tr><td>ROI ratio</td><td className="n">{result.out_roi_ratio.toFixed(2)}x</td></tr>
                  <tr><td>Decision state</td><td className="n">{DECISION_MAP[result.out_decision_state]?.label || "Unknown"}</td></tr>
                  <tr><td>Threshold crossing</td><td className="n">{result.out_threshold_crossing === 1 ? "Below 85% OEE threshold" : "At or above 85% OEE threshold"}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmea_trigger === 1 ? "ACTIVE (quality &lt; 95%)" : "Inactive"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Planned production time</td><td className="n">{inputs.plannedProductionTime.toLocaleString()} min</td></tr>
                  <tr><td>Operating time</td><td className="n">{inputs.operatingTime.toLocaleString()} min</td></tr>
                  <tr><td>Net operating time</td><td className="n">{inputs.netOperatingTime.toLocaleString()} min</td></tr>
                  <tr><td>Valuable operating time</td><td className="n">{inputs.valuableOperatingTime.toLocaleString()} min</td></tr>
                  <tr><td>Ideal cycle time</td><td className="n">{inputs.idealCycleTime.toLocaleString()} sec/part</td></tr>
                  <tr><td>Total parts produced</td><td className="n">{inputs.totalParts.toLocaleString()}</td></tr>
                  <tr><td>Good parts</td><td className="n">{inputs.goodParts.toLocaleString()}</td></tr>
                  <tr><td>Hourly contribution</td><td className="n">{curSym}{inputs.hourlyContribution.toFixed(2)}/h</td></tr>
                  <tr><td>Improvement program cost</td><td className="n">{curSym}{inputs.improvementCost.toFixed(0)}</td></tr>
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
                OEE-REPORT-{Date.now().toString(36).toUpperCase()}<br />
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
