"use client";

/**
 * Customer SKU Profitability Forensics — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 10 inputs with unit selectors, live result rail, report section,
 * margin structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import type { SKUProfitInputs, SKUProfitOutputs } from
  "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-customer-sku-profitability-forensics.css";

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
  id: keyof SKUProfitInputs;
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
  // ── Revenue ──
  { id: "unitPrice", label: "Unit selling price", defaultUnit: "/unit", showPrefix: true, default: 250, hint: "Net selling price per unit after discounts.", ref: "/unit", group: "revenue", hardMin: 0, hardMax: 1e7, step: "0.01" },
  { id: "unitVariableCost", label: "Unit variable cost", defaultUnit: "/unit", showPrefix: true, default: 140, hint: "Direct material + direct labor + variable overhead per unit.", ref: "/unit", group: "revenue", hardMin: 0, hardMax: 1e7, step: "0.01" },
  { id: "annualVolume", label: "Annual sales volume", defaultUnit: "units/yr", showPrefix: false, default: 5000, hint: "Expected annual sales volume in units.", ref: "units/yr", group: "revenue", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Burden ──
  { id: "logisticsCostPct", label: "Logistics cost (% of price)", defaultUnit: "%", showPrefix: false, default: 8, hint: "Freight, warehousing, and distribution as % of unit price.", ref: "%", group: "burden", hardMin: 0, hardMax: 100, step: "0.1" },
  { id: "serviceCostPct", label: "Service & warranty cost (%)", defaultUnit: "%", showPrefix: false, default: 5, hint: "Field service, warranty claims, and technical support as % of price.", ref: "%", group: "burden", hardMin: 0, hardMax: 100, step: "0.1" },
  { id: "returnRatePct", label: "Return rate cost (%)", defaultUnit: "%", showPrefix: false, default: 3, hint: "Return processing, refurbishment, and write-off as % of price.", ref: "%", group: "burden", hardMin: 0, hardMax: 100, step: "0.1" },
  // ── Targets ──
  { id: "targetMargin", label: "Target contribution margin (%)", defaultUnit: "%", showPrefix: false, default: 25, hint: "Minimum acceptable contribution margin ratio.", ref: "%", group: "targets", hardMin: 0, hardMax: 100, step: "0.1" },
  { id: "laborRate", label: "Direct labor rate", defaultUnit: "/hour", showPrefix: true, default: 35, hint: "Hourly labor rate for direct production labor.", ref: "/hour", group: "targets", hardMin: 0, hardMax: 2000, step: "0.01" },
  { id: "overheadRate", label: "Overhead allocation rate (%)", defaultUnit: "%", showPrefix: false, default: 15, hint: "Manufacturing overhead as % of direct costs.", ref: "%", group: "targets", hardMin: 0, hardMax: 500, step: "0.1" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "targets", hardMin: 0, hardMax: 1, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  revenue: { title: "Revenue & Cost Base", desc: "Unit price, variable cost, and sales volume define the gross contribution baseline." },
  burden:  { title: "Burden Multipliers", desc: "Logistics, service, and return costs erode the gross contribution before final margin." },
  targets: { title: "Targets & Confidence", desc: "Margin target, labor rate, overhead allocation, and data confidence level." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

const BURDEN_LABELS = ["Logistics", "Service / Warranty", "Returns"];
const DECISION_LABELS = ["GROW", "HOLD", "CUT / DISCONTINUE"];

/* ─── Component ──────────────────────────────────────────────── */
export default function SKUProfitForensicsPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<SKUProfitInputs>(() => {
    const init: SKUProfitInputs = {} as SKUProfitInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<SKUProfitOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): SKUProfitOutputs | null => {
    if (!inputs.unitPrice || inputs.unitPrice <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof SKUProfitInputs, raw: string) => {
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

  // Margin structure for display
  const marginStructure = useMemo(() => {
    if (!result) return [];
    return [
      {
        label: "Unit Contribution",
        value: result.out_unitContribution,
        pct: result.out_unitContribution !== 0
          ? (result.out_contributionMarginRatio * 100) : 0,
      },
      {
        label: "Logistics Burden",
        value: result.out_logisticsBurden,
        pct: inputs.unitPrice > 0
          ? (result.out_logisticsBurden / inputs.unitPrice * 100) : 0,
      },
      {
        label: "Service / Warranty Burden",
        value: result.out_serviceBurden,
        pct: inputs.unitPrice > 0
          ? (result.out_serviceBurden / inputs.unitPrice * 100) : 0,
      },
      {
        label: "Return Burden",
        value: result.out_returnBurden,
        pct: inputs.unitPrice > 0
          ? (result.out_returnBurden / inputs.unitPrice * 100) : 0,
      },
    ];
  }, [result, inputs.unitPrice]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Customer SKU Profitability Forensics</h1>
        <p className="lede">
          Diagnose SKU-level profitability by isolating logistics, service, and return burdens. &mdash;
          Identify toxic SKUs, margin erosion drivers, and portfolio action recommendations.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Performance Evaluation Context &bull; Auditable</span>
          <span><b>Profitability Forensics</b></span>
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
            <span>Technical simulation. Verify all figures against financial records before business decisions.</span>
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
                    const lbl = DECISION_LABELS[dec];
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {livePreview.out_toxicFlag === 1 ? (
                              <span style={{ color: "var(--neg)" }}>TOXIC</span>
                            ) : (
                              <>{curSym}{livePreview.out_netMargin.toFixed(2)}</>
                            )}
                            <small>net margin per unit</small>
                          </div>
                          <div className="big-cap">
                            {(livePreview.out_contributionMarginRatio * 100).toFixed(1)}% CM ratio
                            &nbsp;&middot; Annual: {curSym}{(livePreview.out_totalAnnualMargin / 1000).toFixed(0)}k
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Unit contribution</span><b>{curSym}{livePreview.out_unitContribution.toFixed(2)}</b></div>
                <div className="stat"><span>CM ratio</span><b>{(livePreview.out_contributionMarginRatio * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Logistics burden</span><b>{curSym}{livePreview.out_logisticsBurden.toFixed(2)}</b></div>
                <div className="stat"><span>Service burden</span><b>{curSym}{livePreview.out_serviceBurden.toFixed(2)}</b></div>
                <div className="stat"><span>Return burden</span><b>{curSym}{livePreview.out_returnBurden.toFixed(2)}</b></div>
                <div className="stat"><span>Net margin</span><b>{curSym}{livePreview.out_netMargin.toFixed(2)}</b></div>
                <div className="stat"><span>Biggest burden</span><b>{BURDEN_LABELS[livePreview.out_biggestBurdenIndex]}</b></div>
                <div className="stat"><span>Annual margin</span><b>{curSym}{livePreview.out_totalAnnualMargin.toFixed(0)}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter unit price &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>SKU Profitability Report</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Performance Evaluation Context<br />
              Report ID: SKU-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {result.out_toxicFlag === 1 ? (
                    <span style={{ color: "var(--neg)" }}>TOXIC SKU &mdash; Negative Net Margin</span>
                  ) : (
                    <>{curSym}{result.out_netMargin.toFixed(2)} net margin per unit</>
                  )}
                </div>
                {result.out_decisionState === 0 ? (
                  <p>Contribution margin ratio of {(result.out_contributionMarginRatio * 100).toFixed(2)}% exceeds the {inputs.targetMargin.toFixed(1)}% target. Annual margin: {curSym}{result.out_totalAnnualMargin.toFixed(0)}. This SKU is positioned for <strong>growth</strong>.</p>
                ) : result.out_decisionState === 1 ? (
                  <p>Contribution margin ratio of {(result.out_contributionMarginRatio * 100).toFixed(2)}% is positive but below the {inputs.targetMargin.toFixed(1)}% target. Annual margin: {curSym}{result.out_totalAnnualMargin.toFixed(0)}. Recommend <strong>holding</strong> with cost improvement initiatives.</p>
                ) : (
                  <>
                    <p><strong>DISCONTINUE / CUT.</strong> Contribution margin ratio of {(result.out_contributionMarginRatio * 100).toFixed(2)}% is non-positive. Annual loss: {curSym}{Math.abs(result.out_totalAnnualMargin).toFixed(0)}.</p>
                    <p>The biggest burden is <strong>{BURDEN_LABELS[result.out_biggestBurdenIndex]}</strong> at {curSym}{[result.out_logisticsBurden, result.out_serviceBurden, result.out_returnBurden][result.out_biggestBurdenIndex].toFixed(2)} per unit. Portfolio rationalization recommended.</p>
                  </>
                )}
              </div>
            </div>

            {/* S2: Margin Structure */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Margin Structure</span></div>
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th className="n">Amount ({curSym})</th>
                    <th className="n">% of Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Unit Price</td>
                    <td className="n">{curSym}{inputs.unitPrice.toFixed(2)}</td>
                    <td className="n">100%</td>
                  </tr>
                  {marginStructure.map((ms) => (
                    <tr key={ms.label}>
                      <td>{ms.label}</td>
                      <td className="n">{curSym}{ms.value.toFixed(2)}</td>
                      <td className="n">{ms.pct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Net Margin</td>
                    <td className="n">{curSym}{result.out_netMargin.toFixed(2)}</td>
                    <td className="n">{(result.out_contributionMarginRatio * 100).toFixed(1)}%</td>
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
                  <tr><td>Decision state</td><td className="n">{DECISION_LABELS[result.out_decisionState]}</td></tr>
                  <tr><td>Contribution margin ratio</td><td className="n">{(result.out_contributionMarginRatio * 100).toFixed(2)}%</td></tr>
                  <tr><td>Target margin ratio</td><td className="n">{inputs.targetMargin.toFixed(1)}%</td></tr>
                  <tr><td>Unit net margin</td><td className="n">{curSym}{result.out_netMargin.toFixed(2)}</td></tr>
                  <tr><td>Annual total margin</td><td className="n">{curSym}{result.out_totalAnnualMargin.toFixed(0)}</td></tr>
                  <tr><td>Toxic flag</td><td className="n">{result.out_toxicFlag === 1 ? "TOXIC" : "OK"}</td></tr>
                  <tr><td>Threshold crossing</td><td className="n">{result.out_thresholdCrossing === 1 ? "ACTIVE" : "Inactive"}</td></tr>
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
                  <tr><td>Unit price</td><td className="n">{curSym}{inputs.unitPrice.toFixed(2)}</td></tr>
                  <tr><td>Unit variable cost</td><td className="n">{curSym}{inputs.unitVariableCost.toFixed(2)}</td></tr>
                  <tr><td>Annual volume</td><td className="n">{inputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>Logistics cost</td><td className="n">{inputs.logisticsCostPct.toFixed(1)}%</td></tr>
                  <tr><td>Service & warranty cost</td><td className="n">{inputs.serviceCostPct.toFixed(1)}%</td></tr>
                  <tr><td>Return rate cost</td><td className="n">{inputs.returnRatePct.toFixed(1)}%</td></tr>
                  <tr><td>Target margin</td><td className="n">{inputs.targetMargin.toFixed(1)}%</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{inputs.laborRate.toFixed(2)}/h</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{inputs.overheadRate.toFixed(1)}%</td></tr>
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
                SKU-REPORT-{Date.now().toString(36).toUpperCase()}<br />
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
