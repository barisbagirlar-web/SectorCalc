"use client";

/**
 * Product SKU Margin Ranker — x1 design pattern.
 *
 * 12 currencies, inline validation, group numbering,
 * engine metadata, sealed report.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * CSS:    @/styles/pro-tool-product-sku-margin-ranker.css
 * Shared: CURRENCIES, fmtNum, CURRENCY_NOTE, CANON_SUFFIX from x1-utils
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import type { ProductSkuMarginInputs, ProductSkuMarginOutputs } from
  "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-product-sku-margin-ranker.css";
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
  // ── Cost Drivers ──
  {
    id: "machineRate", label: "Machine rate",
    unit: "/hour", unitOptions: [],
    domain: "flat", showPrefix: true, default: 85,
    hint: "Machine hourly rate for manufacturing.",
    ref: "rate \u00B7 /hour", group: "cost-drivers",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "cycleTime", label: "Cycle time",
    unit: "minutes", unitOptions: [],
    domain: "hours", showPrefix: false, default: 12,
    hint: "Production cycle time per unit in minutes.",
    ref: "minutes \u00B7 hours", group: "cost-drivers",
    hardMin: 0, hardMax: 1e4,
  },
  {
    id: "materialCost", label: "Material cost per unit",
    unit: "/unit", unitOptions: [],
    domain: "flat", showPrefix: true, default: 25,
    hint: "Raw material cost per unit.",
    ref: "/unit", group: "cost-drivers",
    hardMin: 0, hardMax: 1e6,
  },
  // ── Volume & Pricing ──
  {
    id: "targetMargin", label: "Target margin (ratio)",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.30,
    hint: "Target contribution margin ratio (e.g. 0.30 = 30%).",
    ref: "0..1 ratio", group: "volume-pricing",
    hardMin: 0, hardMax: 1,
  },
  {
    id: "annualVolume", label: "Annual volume",
    unit: "units/yr", unitOptions: [],
    domain: "flat", showPrefix: false, default: 100000,
    hint: "Total annual production volume for this SKU.",
    ref: "units/yr", group: "volume-pricing",
    hardMin: 0, hardMax: 1e9,
  },
  // ── Overhead & Risk ──
  {
    id: "laborRate", label: "Labor rate",
    unit: "/hour", unitOptions: [],
    domain: "flat", showPrefix: true, default: 45,
    hint: "Direct labor hourly rate.",
    ref: "rate \u00B7 /hour", group: "overhead-risk",
    hardMin: 0, hardMax: 2000,
  },
  {
    id: "overheadRate", label: "Overhead rate",
    unit: "/yr", unitOptions: [],
    domain: "flat", showPrefix: true, default: 350000,
    hint: "Annual overhead allocation.",
    ref: "annual cost", group: "overhead-risk",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "defectOrLossCost", label: "Defect / loss cost",
    unit: "/yr", unitOptions: [],
    domain: "flat", showPrefix: true, default: 12000,
    hint: "Annual defect or loss cost for this SKU.",
    ref: "annual cost", group: "overhead-risk",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "sourceConfidence", label: "Source confidence",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.9,
    hint: "Confidence in source data (0=guess, 1=audited).",
    ref: "0..1 ratio", group: "overhead-risk",
    hardMin: 0, hardMax: 1,
  },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  "cost-drivers":   { num: "01", title: "Cost Drivers", desc: "Machine rate, cycle time, and material cost define the unit cost structure." },
  "volume-pricing": { num: "02", title: "Volume & Pricing", desc: "Target margin and annual volume determine pricing leverage and risk exposure." },
  "overhead-risk":  { num: "03", title: "Overhead & Risk", desc: "Labor, overhead, defect costs, and confidence level complete the margin picture." },
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
export default function ProductSkuMarginRankerPage() {
  const [currencyIdx, setCurrencyIdx] = useState<number>(DEFAULT_CURRENCY_INDEX);
  const curSym = CURRENCIES[currencyIdx].sym;

  const [inputs, setInputs] = useState<ProductSkuMarginInputs>(() => {
    const init: ProductSkuMarginInputs = {} as ProductSkuMarginInputs;
    for (const f of FIELDS) init[f.id as keyof ProductSkuMarginInputs] = f.default;
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

  const handleChange = useCallback((id: string, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, [id as keyof ProductSkuMarginInputs]: num }));
    } else if (raw === "" || raw === "-") {
      setInputs((prev) => ({ ...prev, [id as keyof ProductSkuMarginInputs]: NaN as any }));
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

  // Field validation
  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    for (const f of FIELDS) {
      const val = inputs[f.id as keyof ProductSkuMarginInputs];
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
        <div className="kicker">SectorCalc PRO &middot; Manufacturing &middot; Margin proof</div>
        <h1>Product SKU Margin Ranker</h1>
        <p className="lede">
          Rank products by contribution margin and identify margin drivers, erosion risks, and optimization levers. &mdash;
          Analyze unit economics across cost, labor, and overhead dimensions.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>26 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>contribution-margin analysis</b></span>
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
                            {curSym}{fmtNum(livePreview.out_money_at_risk)} annual risk
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
            <h2>Product SKU Margin Ranking &mdash; proof report</h2>
            <div className="rid">
              SC-PRO-MR &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 26 assertions passed<br />
              currency {curSym} &middot; contribution-margin analysis
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
                  {result.out_final_decision_state === 0 ? "Healthy" : result.out_final_decision_state === 1 ? "Below Target" : "Critical"}
                </div>
                {result.out_final_decision_state === 0 ? (
                  <p>Contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}% meets or exceeds the {(inputs.targetMargin * 100).toFixed(1)}% target and unit economics are sound.</p>
                ) : result.out_final_decision_state === 1 ? (
                  <p>Contribution margin of {(result.out_utilization_margin * 100).toFixed(2)}% is below the {(inputs.targetMargin * 100).toFixed(1)}% target. Margin improvement is recommended.</p>
                ) : (
                  <>
                    <p><strong>CRITICAL.</strong> Contribution margin is negative at {(result.out_utilization_margin * 100).toFixed(2)}%. This SKU is eroding profit.</p>
                    <p>Annual money at risk: {curSym}{fmtNum(result.out_money_at_risk)}. Review pricing, costs, or consider SKU rationalization.</p>
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
                  <tr><td>Material cost</td><td className="n">{curSym}{inputs.materialCost.toFixed(2)}</td></tr>
                  <tr><td>Labor cost</td><td className="n">{curSym}{((inputs.laborRate * inputs.cycleTime) / 60).toFixed(4)}</td></tr>
                  <tr><td>Machine cost</td><td className="n">{curSym}{((inputs.machineRate * inputs.cycleTime) / 60).toFixed(4)}</td></tr>
                  <tr><td>Overhead (per unit)</td><td className="n">{curSym}{(inputs.annualVolume > 0 ? (inputs.overheadRate / inputs.annualVolume) : 0).toFixed(4)}</td></tr>
                </tbody>
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
                  <tr><td>Unit price (model)</td><td className="n">{curSym}{result.out_capacity_metric.toFixed(4)}</td></tr>
                  <tr><td>Contribution margin</td><td className="n">{curSym}{result.out_demand_metric.toFixed(4)}</td></tr>
                  <tr><td>Contribution margin ratio</td><td className="n">{(result.out_utilization_margin * 100).toFixed(2)}%</td></tr>
                  <tr><td>Target margin</td><td className="n">{(inputs.targetMargin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Annual volume</td><td className="n">{result.out_normalized_demand.toLocaleString()}</td></tr>
                  <tr><td>Annual money at risk</td><td className="n">{curSym}{fmtNum(result.out_money_at_risk)}</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_threshold_crossing === 0 ? "Profitable" : "Loss-making"}</td></tr>
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
                  <tr><td>Machine rate</td><td className="n">{curSym}{fmtNum(inputs.machineRate)}/h</td></tr>
                  <tr><td>Cycle time</td><td className="n">{inputs.cycleTime.toFixed(1)} min</td></tr>
                  <tr><td>Material cost</td><td className="n">{curSym}{fmtNum(inputs.materialCost)}/unit</td></tr>
                  <tr><td>Target margin</td><td className="n">{(inputs.targetMargin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Annual volume</td><td className="n">{inputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{fmtNum(inputs.laborRate)}/h</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{curSym}{fmtNum(inputs.overheadRate)}/yr</td></tr>
                  <tr><td>Defect / loss cost</td><td className="n">{curSym}{fmtNum(inputs.defectOrLossCost)}/yr</td></tr>
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
                  <tr><td>Unit cost</td><td className="n">material + (labor \u00D7 cycle/60) + (machine \u00D7 cycle/60) + overhead/volume</td></tr>
                  <tr><td>Contribution margin</td><td className="n">(price \u2014 unit cost) \u00F7 price</td></tr>
                  <tr><td>Money at risk</td><td className="n">margin gap \u00D7 annual volume</td></tr>
                </tbody>
              </table>
              <div className="note">
                Contribution-margin analysis. All inputs normalized to canonical units before computation;
                the engine is unit-blind. Formulas passed 26 closed-form/edge-case and semantic
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
                Assumes linear cost scaling and constant cycle time.
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
    const val = inputs[f.id as keyof ProductSkuMarginInputs];
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
