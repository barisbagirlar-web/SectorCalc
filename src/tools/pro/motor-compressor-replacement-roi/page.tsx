"use client";

/**
 * Motor Compressor Replacement ROI — custom page component.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import type { MotorCompressorInputs, MotorCompressorOutputs } from
  "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-motor-compressor-replacement-roi.css";

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
  id: keyof MotorCompressorInputs;
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
  { id: "motorPowerKw", label: "Motor power (kW)", defaultUnit: "kW", showPrefix: false, default: 150, hint: "Rated mechanical power of the motor.", ref: "kW", group: "motor", hardMin: 0, hardMax: 1e6, step: "1" },
  { id: "annualOperatingHours", label: "Annual operating hours", defaultUnit: "h/yr", showPrefix: false, default: 8000, hint: "Total running hours per year.", ref: "h/yr", group: "motor", hardMin: 0, hardMax: 8760, step: "1" },
  { id: "currentEfficiencyPct", label: "Current efficiency (%)", defaultUnit: "%", showPrefix: false, default: 88, hint: "Nameplate or measured efficiency of existing motor.", ref: "%", group: "motor", hardMin: 0, hardMax: 100, step: "0.1" },
  { id: "newEfficiencyPct", label: "New efficiency (%)", defaultUnit: "%", showPrefix: false, default: 95, hint: "Nameplate efficiency of replacement motor (IE3/IE4).", ref: "%", group: "motor", hardMin: 0, hardMax: 100, step: "0.1" },
  { id: "avgKwhRate", label: "Average kWh rate", defaultUnit: "/kWh", showPrefix: true, default: 0.12, hint: "Blended electricity rate including demand charges.", ref: "/kWh", group: "energy", hardMin: 0, hardMax: 10, step: "0.001" },
  { id: "replacementCost", label: "Replacement cost", defaultUnit: "", showPrefix: true, default: 45000, hint: "Cost of new motor including procurement.", ref: "one-time", group: "investment", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "installationCost", label: "Installation cost", defaultUnit: "", showPrefix: true, default: 8500, hint: "Labor, rigging, and commissioning costs.", ref: "one-time", group: "investment", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "maintenanceSavingPerYear", label: "Maintenance saving per year", defaultUnit: "/yr", showPrefix: true, default: 3000, hint: "Estimated annual maintenance cost reduction.", ref: "/yr", group: "savings", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "equipmentLifeYears", label: "Equipment life (years)", defaultUnit: "yr", showPrefix: false, default: 10, hint: "Expected useful life of the new motor.", ref: "yr", group: "savings", hardMin: 1, hardMax: 50, step: "1" },
  { id: "discountRate", label: "Discount rate", defaultUnit: "rate", showPrefix: false, default: 0.08, hint: "WACC or required rate of return (e.g. 0.08 = 8%).", ref: "0..1", group: "savings", hardMin: 0, hardMax: 1, step: "0.01" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  motor:      { title: "Motor Parameters", desc: "Current and replacement motor specifications." },
  energy:     { title: "Energy Cost", desc: "Electricity rate to compute energy costs." },
  investment: { title: "Investment", desc: "One-time costs for the replacement project." },
  savings:    { title: "Savings & Horizon", desc: "Maintenance savings, life, and discount rate." },
  quality:    { title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function MotorCompressorReplacementRoiPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<MotorCompressorInputs>(() => {
    const init: MotorCompressorInputs = {} as MotorCompressorInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<MotorCompressorOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const livePreview = useMemo((): MotorCompressorOutputs | null => {
    if (!inputs.motorPowerKw || inputs.motorPowerKw <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof MotorCompressorInputs, raw: string) => {
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

  const decisionLabel = (d: number) =>
    d === 0 ? "PROCEED" : d === 1 ? "REVIEW" : "HOLD";
  const decisionClass = (d: number) =>
    d === 0 ? "pos" : d === 1 ? "warn" : "neg";

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Motor Compressor Replacement ROI</h1>
        <p className="lede">
          Evaluate the financial viability of replacing an existing motor or compressor with a high-efficiency unit. &mdash;
          Compute payback period, NPV, ROI, and energy savings.
        </p>
        <div className="meta">
          <span>ISO 50001 &mdash; Energy Performance Indicator &bull; Auditable</span>
          <span><b>Energy Efficiency</b></span>
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
            Generate ROI Report
          </button>

          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against equipment specs and energy bills before business decisions.</span>
          </div>
        </div>

        {/* Live rail */}
        <div className="rail">
          <div className="rail-in">
            {livePreview ? (
              <>
                <div className="verdict">
                  {(() => {
                    const dec = livePreview.out_finalDecisionState;
                    const cls = decisionClass(dec);
                    const lbl = decisionLabel(dec);
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {livePreview.out_scenarioDelta.toFixed(1)}
                            <small> months payback</small>
                          </div>
                          <div className="big-cap">{curSym}{livePreview.out_utilizationMargin.toFixed(0)} annual saving &middot; {curSym}{livePreview.out_moneyAtRisk.toFixed(0)} investment</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Annual saving</span><b>{curSym}{livePreview.out_utilizationMargin.toFixed(0)}</b></div>
                <div className="stat"><span>Total investment</span><b>{curSym}{livePreview.out_moneyAtRisk.toFixed(0)}</b></div>
                <div className="stat"><span>Current energy cost</span><b>{curSym}{livePreview.out_demandMetric.toFixed(0)}</b></div>
                <div className="stat"><span>New energy cost</span><b>{curSym}{livePreview.out_capacityMetric.toFixed(0)}</b></div>
                <div className="stat"><span>Eff. gap (pp)</span><b>{(livePreview.out_referenceDeviation * 100).toFixed(1)}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter motor power &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>Motor Compressor Replacement ROI Report</h2></div>
            <div className="rid">
              ISO 50001 &bull; Energy Performance Indicator<br />
              Report ID: ROI-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>
                  Payback period: {result.out_scenarioDelta.toFixed(1)} months &middot;
                  Annual energy saving: {curSym}{result.out_utilizationMargin.toFixed(0)} &middot;
                  Total investment: {curSym}{result.out_moneyAtRisk.toFixed(0)}
                </p>
                <p>Replacing a {inputs.currentEfficiencyPct.toFixed(1)}% efficient motor with a {inputs.newEfficiencyPct.toFixed(1)}% unit yields {(result.out_referenceDeviation * 100).toFixed(1)} percentage point efficiency gain.</p>
              </div>
            </div>

            {/* S2: Cost Structure */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Cost Structure</span></div>
              <table>
                <thead><tr><th>Component</th><th className="n">Amount ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>Current energy cost (annual)</td><td className="n">{curSym}{result.out_demandMetric.toFixed(0)}</td></tr>
                  <tr><td>New energy cost (annual)</td><td className="n">{curSym}{result.out_capacityMetric.toFixed(0)}</td></tr>
                  <tr><td>Annual energy saving</td><td className="n">{curSym}{result.out_utilizationMargin.toFixed(0)}</td></tr>
                  <tr><td>Total investment (replacement + install)</td><td className="n">{curSym}{result.out_moneyAtRisk.toFixed(0)}</td></tr>
                  <tr><td>Maintenance saving / yr</td><td className="n">{curSym}{inputs.maintenanceSavingPerYear.toFixed(0)}</td></tr>
                  <tr><td>Uncertainty (maintenance)</td><td className="n">{curSym}{result.out_expandedUncertainty.toFixed(0)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S3: Decision Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Decision Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Payback period</td><td className="n">{result.out_scenarioDelta.toFixed(1)} months</td></tr>
                  <tr><td>Threshold crossing</td><td className="n">{result.out_thresholdCrossing === 1 ? "Within 48mo threshold" : "Exceeds threshold"}</td></tr>
                  <tr><td>Efficiency gain</td><td className="n">{(result.out_referenceDeviation * 100).toFixed(1)} pp</td></tr>
                  <tr><td>Data confidence</td><td className="n">{(result.out_evidenceCompleteness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Derating factor</td><td className="n">{result.out_deratingFactor.toFixed(3)}</td></tr>
                  <tr><td>Sensitivity driver</td><td className="n">{result.out_sensitivityDriver === 1 ? "Replacement cost" : "Energy cost"}</td></tr>
                  <tr><td>Decision state</td><td className="n">{decisionLabel(result.out_finalDecisionState)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Motor power</td><td className="n">{inputs.motorPowerKw.toLocaleString()} kW</td></tr>
                  <tr><td>Annual operating hours</td><td className="n">{inputs.annualOperatingHours.toLocaleString()} h</td></tr>
                  <tr><td>Current efficiency</td><td className="n">{inputs.currentEfficiencyPct.toFixed(1)}%</td></tr>
                  <tr><td>New efficiency</td><td className="n">{inputs.newEfficiencyPct.toFixed(1)}%</td></tr>
                  <tr><td>Avg kWh rate</td><td className="n">{curSym}{inputs.avgKwhRate.toFixed(3)}</td></tr>
                  <tr><td>Replacement cost</td><td className="n">{curSym}{inputs.replacementCost.toFixed(0)}</td></tr>
                  <tr><td>Installation cost</td><td className="n">{curSym}{inputs.installationCost.toFixed(0)}</td></tr>
                  <tr><td>Maintenance saving/yr</td><td className="n">{curSym}{inputs.maintenanceSavingPerYear.toFixed(0)}</td></tr>
                  <tr><td>Equipment life</td><td className="n">{inputs.equipmentLifeYears.toFixed(0)} yr</td></tr>
                  <tr><td>Discount rate</td><td className="n">{(inputs.discountRate * 100).toFixed(1)}%</td></tr>
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
                ROI-REPORT-{Date.now().toString(36).toUpperCase()}<br />
                Engine: executeFormula v5.3.1-pro &bull; ISO 50001:2018<br />
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
