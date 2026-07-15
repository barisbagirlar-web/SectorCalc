"use client";

/**
 * Receivables Cost / Payment Term Addendum — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 7 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import type { ReceivablesCostInputs, ReceivablesCostOutputs } from
  "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-receivables-cost-payment-term-addendum.css";

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
  id: keyof ReceivablesCostInputs;
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
  // ── Receivables ──
  { id: "machineRate", label: "Machine rate", defaultUnit: "/hour", showPrefix: true, default: 85, hint: "Machine hourly rate for production.", ref: "rate \u00B7 /hour", group: "receivables", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "cycleTime", label: "Cycle time", defaultUnit: "minutes", showPrefix: false, default: 12, hint: "Cycle time per unit in minutes.", ref: "minutes \u00B7 hours", group: "receivables", hardMin: 0, hardMax: 1e4, step: "0.1" },
  { id: "materialCost", label: "Material cost per unit", defaultUnit: "/unit", showPrefix: true, default: 25, hint: "Cost of raw material per unit.", ref: "/unit", group: "receivables", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "batchQuantity", label: "Batch quantity", defaultUnit: "units", showPrefix: false, default: 500, hint: "Number of units per batch.", ref: "count", group: "receivables", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Cost Parameters ──
  { id: "overheadRate", label: "Overhead rate", defaultUnit: "annual", showPrefix: true, default: 350000, hint: "Annual overhead allocation.", ref: "annual cost", group: "cost-params", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "defectOrLossCost", label: "Defect / loss cost", defaultUnit: "annual", showPrefix: true, default: 12000, hint: "Annual defect or loss cost.", ref: "annual cost", group: "cost-params", hardMin: 0, hardMax: 1e9, step: "100" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "cost-params", hardMin: 0, hardMax: 1, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  "receivables": { title: "Receivables", desc: "Machine rate, cycle time, material cost, and batch quantity determine the receivables amount." },
  "cost-params": { title: "Cost Parameters", desc: "Overhead, defect costs, and confidence level define the financing cost structure." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function ReceivablesCostPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<ReceivablesCostInputs>(() => {
    const init: ReceivablesCostInputs = {} as ReceivablesCostInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<ReceivablesCostOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): ReceivablesCostOutputs | null => {
    if (!inputs.machineRate || inputs.machineRate <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof ReceivablesCostInputs, raw: string) => {
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
        <h1>Receivables Cost / Payment Term Addendum</h1>
        <p className="lede">
          Calculate the finance cost of extended payment terms and evaluate payment term addendum impact. &mdash;
          Quantify the hidden cost of carrying receivables.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Financial Risk Context &bull; Auditable</span>
          <span><b>Working Capital</b></span>
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
            Generate Receivables Cost Report
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
                    const lbl = dec === 0 ? "LOW FINANCE COST" : dec === 1 ? "MODERATE COST" : "HIGH FINANCE COST";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {(livePreview.out_utilization_margin * 100).toFixed(2)}%
                            <small>finance cost ratio</small>
                          </div>
                          <div className="big-cap">
                            {curSym}{livePreview.out_money_at_risk.toFixed(0)} total finance cost
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Receivables amount</span><b>{curSym}{livePreview.out_normalized_demand.toFixed(0)}</b></div>
                <div className="stat"><span>Finance cost</span><b>{curSym}{livePreview.out_demand_metric.toFixed(0)}</b></div>
                <div className="stat"><span>Cost ratio</span><b>{(livePreview.out_utilization_margin * 100).toFixed(2)}%</b></div>
                <div className="stat"><span>Total cost of receivables</span><b>{curSym}{livePreview.out_capacity_metric.toFixed(0)}</b></div>
                <div className="stat"><span>Penalty &amp; hedge cost</span><b>{curSym}{(livePreview.out_money_at_risk - livePreview.out_demand_metric).toFixed(0)}</b></div>

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
            <div><h2>Receivables Cost Report</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Financial Risk Context<br />
              Report ID: RC-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {curSym}{result.out_money_at_risk.toFixed(0)} total receivables cost
                </div>
                {result.out_final_decision_state === 0 ? (
                  <p>Finance cost ratio of {(result.out_utilization_margin * 100).toFixed(2)}% is within the low range. Current payment terms are efficiently structured.</p>
                ) : result.out_final_decision_state === 1 ? (
                  <p>Finance cost ratio of {(result.out_utilization_margin * 100).toFixed(2)}% is moderate. Consider reviewing payment term structure.</p>
                ) : (
                  <>
                    <p><strong>ELEVATED.</strong> Finance cost ratio of {(result.out_utilization_margin * 100).toFixed(2)}% represents a significant burden on working capital.</p>
                    <p>Total cost: {curSym}{result.out_money_at_risk.toFixed(0)}. Payment term addendum or early payment discount is strongly recommended.</p>
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
                  <tr><td>Financing cost</td><td className="n">{curSym}{result.out_demand_metric.toFixed(0)}</td><td className="n">{result.out_money_at_risk > 0 ? ((result.out_demand_metric / result.out_money_at_risk) * 100).toFixed(1) : "N/A"}%</td></tr>
                  <tr><td>Penalty cost</td><td className="n">{curSym}{(result.out_money_at_risk - result.out_demand_metric).toFixed(0)}</td><td className="n">{result.out_money_at_risk > 0 ? (((result.out_money_at_risk - result.out_demand_metric) / result.out_money_at_risk) * 100).toFixed(1) : "N/A"}%</td></tr>
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{result.out_money_at_risk.toFixed(0)}</td>
                    <td className="n">100%</td>
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
                  <tr><td>Receivables amount</td><td className="n">{curSym}{result.out_normalized_demand.toFixed(2)}</td></tr>
                  <tr><td>Finance cost (annual)</td><td className="n">{curSym}{result.out_demand_metric.toFixed(2)}</td></tr>
                  <tr><td>Finance cost ratio</td><td className="n">{(result.out_utilization_margin * 100).toFixed(2)}%</td></tr>
                  <tr><td>Total receivables cost</td><td className="n">{curSym}{result.out_capacity_metric.toFixed(2)}</td></tr>
                  <tr><td>Penalty cost</td><td className="n">{curSym}{result.out_money_at_risk.toFixed(2)}</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_threshold_crossing === 0 ? "Low impact" : "Above threshold"}</td></tr>
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
                  <tr><td>Machine rate</td><td className="n">{curSym}{inputs.machineRate.toFixed(2)}/h</td></tr>
                  <tr><td>Cycle time</td><td className="n">{inputs.cycleTime.toFixed(1)} min</td></tr>
                  <tr><td>Material cost</td><td className="n">{curSym}{inputs.materialCost.toFixed(2)}/unit</td></tr>
                  <tr><td>Batch quantity</td><td className="n">{inputs.batchQuantity.toLocaleString()}</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{curSym}{inputs.overheadRate.toFixed(0)}/yr</td></tr>
                  <tr><td>Defect / loss cost</td><td className="n">{curSym}{inputs.defectOrLossCost.toFixed(0)}/yr</td></tr>
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
                RECEIVABLES-REPORT-{Date.now().toString(36).toUpperCase()}<br />
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
