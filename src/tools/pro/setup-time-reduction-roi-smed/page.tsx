"use client";

/**
 * Setup Time Reduction ROI (SMED) — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 7 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import type { SetupTimeReductionInputs, SetupTimeReductionOutputs } from
  "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-setup-time-reduction-roi-smed.css";

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
  id: keyof SetupTimeReductionInputs;
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
  // ── Operations ──
  { id: "machineRate", label: "Machine rate", defaultUnit: "/hour", showPrefix: true, default: 85, hint: "Machine hourly operating rate.", ref: "rate \u00B7 /hour", group: "operations", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "setupTime", label: "Current setup time", defaultUnit: "minutes", showPrefix: false, default: 30, hint: "Current setup time per changeover in minutes.", ref: "minutes", group: "operations", hardMin: 0, hardMax: 1e4, step: "1" },
  { id: "batchQuantity", label: "Batch quantity", defaultUnit: "units", showPrefix: false, default: 500, hint: "Average units per production batch.", ref: "count", group: "operations", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "annualVolume", label: "Annual volume", defaultUnit: "units/yr", showPrefix: false, default: 100000, hint: "Total annual production volume.", ref: "units/yr", group: "operations", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Investment ──
  { id: "laborRate", label: "Labor rate", defaultUnit: "/hour", showPrefix: true, default: 45, hint: "Direct labor hourly rate.", ref: "rate \u00B7 /hour", group: "investment", hardMin: 0, hardMax: 2000, step: "0.01" },
  { id: "overheadRate", label: "Overhead rate", defaultUnit: "/yr", showPrefix: true, default: 350000, hint: "Annual overhead allocation (used to estimate SMED investment).", ref: "annual cost", group: "investment", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "investment", hardMin: 0, hardMax: 1, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  operations: { title: "Operations", desc: "Machine rate, setup time, batch size, and volume define the opportunity for setup reduction." },
  investment: { title: "Investment Parameters", desc: "Labor rate, overhead, and confidence level determine SMED investment cost and ROI." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function SetupTimeReductionRoiPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<SetupTimeReductionInputs>(() => {
    const init: SetupTimeReductionInputs = {} as SetupTimeReductionInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<SetupTimeReductionOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): SetupTimeReductionOutputs | null => {
    if (!inputs.machineRate || inputs.machineRate <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof SetupTimeReductionInputs, raw: string) => {
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
        <h1>Setup Time Reduction ROI (SMED)</h1>
        <p className="lede">
          Calculate the return on investment for Single-Minute Exchange of Die (SMED) implementation. &mdash;
          Evaluate payback period, annual savings, and capacity recovery.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Process Improvement Context &bull; Auditable</span>
          <span><b>Lean Manufacturing</b></span>
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
            Generate SMED ROI Report
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
                    const lbl = dec === 0 ? "FAST PAYBACK" : dec === 1 ? "MODERATE" : "SLOW PAYBACK";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {(livePreview.out_utilization_margin * 100).toFixed(0)}%
                            <small>ROI</small>
                          </div>
                          <div className="big-cap">
                            {curSym}{livePreview.out_demand_metric.toFixed(0)} annual savings &middot;
                            {curSym}{livePreview.out_money_at_risk.toFixed(0)} investment
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Annual hours recovered</span><b>{livePreview.out_normalized_demand.toFixed(1)} h</b></div>
                <div className="stat"><span>Annual savings</span><b>{curSym}{livePreview.out_demand_metric.toFixed(0)}</b></div>
                <div className="stat"><span>Capacity value released</span><b>{curSym}{livePreview.out_capacity_metric.toFixed(0)}</b></div>
                <div className="stat"><span>ROI</span><b>{(livePreview.out_utilization_margin * 100).toFixed(0)}%</b></div>
                <div className="stat"><span>Investment cost</span><b>{curSym}{livePreview.out_money_at_risk.toFixed(0)}</b></div>

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
            <div><h2>SMED ROI Report</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Process Improvement Context<br />
              Report ID: SMED-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {(result.out_utilization_margin * 100).toFixed(0)}% ROI &mdash; {curSym}{result.out_demand_metric.toFixed(0)} annual savings
                </div>
                {result.out_final_decision_state === 0 ? (
                  <p>SMED payback period is under 12 months. This is a high-return investment with annual savings of {curSym}{result.out_demand_metric.toFixed(0)} against an investment of {curSym}{result.out_money_at_risk.toFixed(0)}.</p>
                ) : result.out_final_decision_state === 1 ? (
                  <p>SMED payback period is 12–24 months. A viable investment with annual savings of {curSym}{result.out_demand_metric.toFixed(0)}. Consider phased implementation.</p>
                ) : (
                  <>
                    <p><strong>CAUTION.</strong> Payback period exceeds 24 months. Annual savings of {curSym}{result.out_demand_metric.toFixed(0)} may not justify the {curSym}{result.out_money_at_risk.toFixed(0)} investment.</p>
                    <p>Explore lower-cost alternatives or verify setup time reduction assumptions.</p>
                  </>
                )}
              </div>
            </div>

            {/* S2: Cost Structure */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Investment &amp; Returns</span></div>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th className="n">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Annual hours recovered</td><td className="n">{result.out_normalized_demand.toFixed(1)} h</td></tr>
                  <tr><td>Annual savings (machine rate)</td><td className="n">{curSym}{result.out_demand_metric.toFixed(0)}</td></tr>
                  <tr><td>Capacity value released</td><td className="n">{curSym}{result.out_capacity_metric.toFixed(0)}</td></tr>
                  <tr><td>SMED investment cost</td><td className="n">{curSym}{result.out_money_at_risk.toFixed(0)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S3: Decision Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Decision Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>ROI</td><td className="n">{(result.out_utilization_margin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_threshold_crossing === 0 ? "Above threshold" : "Below threshold"}</td></tr>
                  <tr><td>Payback classification</td><td className="n">{result.out_final_decision_state === 0 ? "Fast (< 12 mo)" : result.out_final_decision_state === 1 ? "Moderate (12-24 mo)" : "Slow (> 24 mo)"}</td></tr>
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
                  <tr><td>Setup time</td><td className="n">{inputs.setupTime.toFixed(0)} min</td></tr>
                  <tr><td>Batch quantity</td><td className="n">{inputs.batchQuantity.toLocaleString()}</td></tr>
                  <tr><td>Annual volume</td><td className="n">{inputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{inputs.laborRate.toFixed(2)}/h</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{curSym}{inputs.overheadRate.toFixed(0)}/yr</td></tr>
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
                SMED-REPORT-{Date.now().toString(36).toUpperCase()}<br />
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
