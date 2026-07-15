"use client";

/**
 * Product SKU Margin Ranker — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 9 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import type { ProductSkuMarginInputs, ProductSkuMarginOutputs } from
  "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-product-sku-margin-ranker.css";

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
  id: keyof ProductSkuMarginInputs;
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
  // ── Cost Drivers ──
  { id: "machineRate", label: "Machine rate", defaultUnit: "/hour", showPrefix: true, default: 85, hint: "Machine hourly rate for manufacturing.", ref: "rate \u00B7 /hour", group: "cost-drivers", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "cycleTime", label: "Cycle time", defaultUnit: "minutes", showPrefix: false, default: 12, hint: "Production cycle time per unit in minutes.", ref: "minutes \u00B7 hours", group: "cost-drivers", hardMin: 0, hardMax: 1e4, step: "0.1" },
  { id: "materialCost", label: "Material cost per unit", defaultUnit: "/unit", showPrefix: true, default: 25, hint: "Raw material cost per unit.", ref: "/unit", group: "cost-drivers", hardMin: 0, hardMax: 1e6, step: "0.01" },
  // ── Volume & Pricing ──
  { id: "targetMargin", label: "Target margin (ratio)", defaultUnit: "ratio", showPrefix: false, default: 0.30, hint: "Target contribution margin ratio (e.g. 0.30 = 30%).", ref: "0..1 ratio", group: "volume-pricing", hardMin: 0, hardMax: 1, step: "0.01" },
  { id: "annualVolume", label: "Annual volume", defaultUnit: "units/yr", showPrefix: false, default: 100000, hint: "Total annual production volume for this SKU.", ref: "units/yr", group: "volume-pricing", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Overhead & Risk ──
  { id: "laborRate", label: "Labor rate", defaultUnit: "/hour", showPrefix: true, default: 45, hint: "Direct labor hourly rate.", ref: "rate \u00B7 /hour", group: "overhead-risk", hardMin: 0, hardMax: 2000, step: "0.01" },
  { id: "overheadRate", label: "Overhead rate", defaultUnit: "/yr", showPrefix: true, default: 350000, hint: "Annual overhead allocation.", ref: "annual cost", group: "overhead-risk", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "defectOrLossCost", label: "Defect / loss cost", defaultUnit: "/yr", showPrefix: true, default: 12000, hint: "Annual defect or loss cost for this SKU.", ref: "annual cost", group: "overhead-risk", hardMin: 0, hardMax: 1e9, step: "100" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "overhead-risk", hardMin: 0, hardMax: 1, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  "cost-drivers":   { title: "Cost Drivers", desc: "Machine rate, cycle time, and material cost define the unit cost structure." },
  "volume-pricing": { title: "Volume & Pricing", desc: "Target margin and annual volume determine pricing leverage and risk exposure." },
  "overhead-risk":  { title: "Overhead & Risk", desc: "Labor, overhead, defect costs, and confidence level complete the margin picture." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function ProductSkuMarginRankerPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<ProductSkuMarginInputs>(() => {
    const init: ProductSkuMarginInputs = {} as ProductSkuMarginInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<ProductSkuMarginOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): ProductSkuMarginOutputs | null => {
    if (!inputs.machineRate || inputs.machineRate <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof ProductSkuMarginInputs, raw: string) => {
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
        <h1>Product SKU Margin Ranker</h1>
        <p className="lede">
          Rank products by contribution margin and identify margin drivers, erosion risks, and optimization levers. &mdash;
          Analyze unit economics across cost, labor, and overhead dimensions.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Product Profitability Context &bull; Auditable</span>
          <span><b>Margin Analysis</b></span>
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
            Generate Margin Ranking Report
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
                    const lbl = dec === 0 ? "HEALTHY MARGIN" : dec === 1 ? "BELOW TARGET" : "LOSS-MAKING";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {(livePreview.out_utilization_margin * 100).toFixed(1)}%
                            <small>contribution margin</small>
                          </div>
                          <div className="big-cap">
                            {curSym}{livePreview.out_demand_metric.toFixed(4)} per unit &middot;
                            {curSym}{livePreview.out_money_at_risk.toFixed(0)} annual risk
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Unit price (model)</span><b>{curSym}{livePreview.out_capacity_metric.toFixed(4)}</b></div>
                <div className="stat"><span>Contribution margin</span><b>{curSym}{livePreview.out_demand_metric.toFixed(4)}</b></div>
                <div className="stat"><span>Margin ratio</span><b>{(livePreview.out_utilization_margin * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Annual volume</span><b>{livePreview.out_normalized_demand.toLocaleString()}</b></div>
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
            <div><h2>Product SKU Margin Ranking Report</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Product Profitability Context<br />
              Report ID: MR-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {result.out_final_decision_state === 0 ? "Healthy" : result.out_final_decision_state === 1 ? "Below Target" : "Critical"}
                </div>
                {result.out_final_decision_state === 0 ? (
                  <p>Contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}% meets or exceeds the {(inputs.targetMargin * 100).toFixed(1)}% target and unit economics are sound.</p>
                ) : result.out_final_decision_state === 1 ? (
                  <p>Contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}% is below the {(inputs.targetMargin * 100).toFixed(1)}% target. Margin improvement is recommended.</p>
                ) : (
                  <>
                    <p><strong>CRITICAL.</strong> Contribution margin is negative at {(result.out_utilization_margin * 100).toFixed(2)}%. This SKU is eroding profit.</p>
                    <p>Annual money at risk: {curSym}{result.out_money_at_risk.toFixed(0)}. Review pricing, costs, or consider SKU rationalization.</p>
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
                  <tr><td>Material cost</td><td className="n">{curSym}{inputs.materialCost.toFixed(2)}</td></tr>
                  <tr><td>Labor cost</td><td className="n">{curSym}{((inputs.laborRate * inputs.cycleTime) / 60).toFixed(4)}</td></tr>
                  <tr><td>Machine cost</td><td className="n">{curSym}{((inputs.machineRate * inputs.cycleTime) / 60).toFixed(4)}</td></tr>
                  <tr><td>Overhead (per unit)</td><td className="n">{curSym}{(inputs.annualVolume > 0 ? (inputs.overheadRate / inputs.annualVolume) : 0).toFixed(4)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S3: Decision Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Decision Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Unit price (model)</td><td className="n">{curSym}{result.out_capacity_metric.toFixed(4)}</td></tr>
                  <tr><td>Contribution margin</td><td className="n">{curSym}{result.out_demand_metric.toFixed(4)}</td></tr>
                  <tr><td>Contribution margin ratio</td><td className="n">{(result.out_utilization_margin * 100).toFixed(2)}%</td></tr>
                  <tr><td>Target margin</td><td className="n">{(inputs.targetMargin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Annual volume</td><td className="n">{result.out_normalized_demand.toLocaleString()}</td></tr>
                  <tr><td>Annual money at risk</td><td className="n">{curSym}{result.out_money_at_risk.toFixed(0)}</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_threshold_crossing === 0 ? "Profitable" : "Loss-making"}</td></tr>
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
                  <tr><td>Target margin</td><td className="n">{(inputs.targetMargin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Annual volume</td><td className="n">{inputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{inputs.laborRate.toFixed(2)}/h</td></tr>
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
                MARGIN-REPORT-{Date.now().toString(36).toUpperCase()}<br />
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
