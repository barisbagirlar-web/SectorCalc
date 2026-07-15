"use client";

/**
 * Weld Procedure Cost & Consumable Estimation Suite — custom page component.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import type { WeldProcedureInputs, WeldProcedureOutputs } from
  "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-weld-procedure-cost-consumable-estimation-suite.css";

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
  id: keyof WeldProcedureInputs;
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
  { id: "weldLengthM", label: "Weld length (m)", defaultUnit: "m", showPrefix: false, default: 10, hint: "Total weld length for the joint.", ref: "m", group: "geometry", hardMin: 0, hardMax: 1e4, step: "0.1" },
  { id: "weldThroatMm", label: "Weld throat (mm)", defaultUnit: "mm", showPrefix: false, default: 6, hint: "Fillet weld throat thickness.", ref: "mm", group: "geometry", hardMin: 0, hardMax: 100, step: "0.5" },
  { id: "weldDensityGCm3", label: "Weld density (g/cm3)", defaultUnit: "g/cm3", showPrefix: false, default: 7.85, hint: "Deposited weld metal density.", ref: "g/cm3", group: "geometry", hardMin: 0, hardMax: 20, step: "0.01" },
  { id: "wireCostPerKg", label: "Wire cost per kg", defaultUnit: "/kg", showPrefix: true, default: 8.5, hint: "Cost of welding wire per kilogram.", ref: "/kg", group: "consumables", hardMin: 0, hardMax: 500, step: "0.01" },
  { id: "gasCostPerMin", label: "Gas cost per min", defaultUnit: "/min", showPrefix: true, default: 0.35, hint: "Shielding gas cost per arc minute.", ref: "/min", group: "consumables", hardMin: 0, hardMax: 50, step: "0.01" },
  { id: "depositionEfficiencyPct", label: "Deposition efficiency (%)", defaultUnit: "%", showPrefix: false, default: 85, hint: "Wire-to-weld deposition efficiency.", ref: "%", group: "consumables", hardMin: 0, hardMax: 100, step: "1" },
  { id: "arcTimeMin", label: "Arc time (min)", defaultUnit: "min", showPrefix: false, default: 15, hint: "Actual welding arc-on time.", ref: "min", group: "labor", hardMin: 0, hardMax: 1440, step: "1" },
  { id: "weldTimeMin", label: "Total weld time (min)", defaultUnit: "min", showPrefix: false, default: 30, hint: "Total time including handling and positioning.", ref: "min", group: "labor", hardMin: 0, hardMax: 1440, step: "1" },
  { id: "laborRate", label: "Labor rate (/hr)", defaultUnit: "/hr", showPrefix: true, default: 65, hint: "Fully loaded welder labor rate per hour.", ref: "/hr", group: "labor", hardMin: 0, hardMax: 500, step: "0.5" },
  { id: "overheadRate", label: "Overhead rate (/hr)", defaultUnit: "/hr", showPrefix: true, default: 25, hint: "Shop overhead rate per hour.", ref: "/hr", group: "labor", hardMin: 0, hardMax: 500, step: "0.5" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, step: "0.05" },
];

const GROUP_META: Record<string, { title: string; desc: string }> = {
  geometry:    { title: "Weld Geometry", desc: "Physical dimensions of the weld joint." },
  consumables: { title: "Consumables", desc: "Wire and shielding gas cost parameters." },
  labor:       { title: "Labor & Overhead", desc: "Welder labor and shop overhead rates." },
  quality:     { title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

export default function WeldProcedureCostPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<WeldProcedureInputs>(() => {
    const init: WeldProcedureInputs = {} as WeldProcedureInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<WeldProcedureOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const livePreview = useMemo((): WeldProcedureOutputs | null => {
    if (!inputs.weldLengthM || inputs.weldLengthM <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof WeldProcedureInputs, raw: string) => {
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

  const costLabel = (d: number) =>
    d === 0 ? "LOW COST" : d === 1 ? "HIGH COST" : "MODERATE";
  const costClass = (d: number) =>
    d === 0 ? "pos" : d === 1 ? "neg" : "warn";

  return (
    <div className="shell">
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Weld Procedure Cost &amp; Consumable Estimation Suite</h1>
        <p className="lede">
          Estimate total weld cost including consumables, labor, and overhead. &mdash;
          Compute cost per meter and identify the dominant cost driver.
        </p>
        <div className="meta">
          <span>ISO 3834 &mdash; Welding Quality Requirements &bull; Auditable</span>
          <span><b>Welding Costing</b></span>
        </div>

        <div className="curbar">
          <label htmlFor="cur-select">Currency</label>
          <select id="cur-select" value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
            {CURRENCIES.map((c) => (<option key={c} value={c}>{CURRENCY_LABELS[c]}</option>))}
          </select>
          <span className="curnote">{CURRENCY_NOTE}</span>
        </div>
      </div>

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
            Generate Weld Cost Report
          </button>

          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against weld procedure specifications before business decisions.</span>
          </div>
        </div>

        <div className="rail">
          <div className="rail-in">
            {livePreview ? (
              <>
                <div className="verdict">
                  {(() => {
                    const dec = livePreview.out_decisionState;
                    const cls = costClass(dec);
                    const lbl = costLabel(dec);
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{livePreview.out_costPerMeter.toFixed(2)}
                            <small> /m</small>
                          </div>
                          <div className="big-cap">Total cost: {curSym}{livePreview.out_totalCostFloor.toFixed(2)}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Total cost</span><b>{curSym}{livePreview.out_totalCostFloor.toFixed(2)}</b></div>
                <div className="stat"><span>Production cost</span><b>{curSym}{livePreview.out_baseProductionCost.toFixed(2)}</b></div>
                <div className="stat"><span>Wire cost</span><b>{curSym}{livePreview.out_wireCost.toFixed(2)}</b></div>
                <div className="stat"><span>Gas cost</span><b>{curSym}{livePreview.out_shieldingGasCost.toFixed(2)}</b></div>
                <div className="stat"><span>Wire mass</span><b>{livePreview.out_wireMassKg.toFixed(3)} kg</b></div>
                <div className="stat"><span>Labor cost</span><b>{curSym}{livePreview.out_laborCost.toFixed(2)}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter weld length &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>Weld Cost Report</h2></div>
            <div className="rid">
              ISO 3834 &bull; Welding Quality Requirements<br />
              Report ID: WC-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{curSym}{result.out_costPerMeter.toFixed(2)} /m</div>
                <p>Total weld cost: {curSym}{result.out_totalCostFloor.toFixed(2)} &middot; Deposition efficiency: {(result.out_consumableEfficiency * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Cost Breakdown</span></div>
              <table>
                <thead><tr><th>Component</th><th className="n">Amount ({curSym})</th><th className="n">Share</th></tr></thead>
                <tbody>
                  {[
                    { l: "Wire cost", v: result.out_wireCost },
                    { l: "Shielding gas", v: result.out_shieldingGasCost },
                    { l: "Labor", v: result.out_laborCost },
                    { l: "Shop overhead", v: result.out_shopOverhead },
                  ].map((r) => (
                    <tr key={r.l}>
                      <td>{r.l}</td>
                      <td className="n">{curSym}{r.v.toFixed(2)}</td>
                      <td className="n">{result.out_totalCostFloor > 0 ? (r.v / result.out_totalCostFloor * 100).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{result.out_totalCostFloor.toFixed(2)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Weld Metrics</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Cost per meter</td><td className="n">{curSym}{result.out_costPerMeter.toFixed(2)}</td></tr>
                  <tr><td>Wire mass (kg)</td><td className="n">{result.out_wireMassKg.toFixed(3)}</td></tr>
                  <tr><td>Deposition efficiency</td><td className="n">{(result.out_consumableEfficiency * 100).toFixed(1)}%</td></tr>
                  <tr><td>Data confidence</td><td className="n">{(result.out_evidenceCompleteness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Decision state</td><td className="n">{costLabel(result.out_decisionState)}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Weld length</td><td className="n">{inputs.weldLengthM} m</td></tr>
                  <tr><td>Throat</td><td className="n">{inputs.weldThroatMm} mm</td></tr>
                  <tr><td>Wire cost</td><td className="n">{curSym}{inputs.wireCostPerKg.toFixed(2)}/kg</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{inputs.laborRate.toFixed(2)}/hr</td></tr>
                  <tr><td>Deposition efficiency</td><td className="n">{inputs.depositionEfficiencyPct.toFixed(0)}%</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(inputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                </tbody>
              </table>
            </div>

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

            <div className="sec">
              <div className="sec-h"><span className="sec-n">S6</span><span className="sec-t">Audit Seal &amp; Integrity</span></div>
              <div className="seal">
                WELD-REPORT-{Date.now().toString(36).toUpperCase()}<br />
                Engine: executeFormula v5.3.1-pro &bull; ISO 3834<br />
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
