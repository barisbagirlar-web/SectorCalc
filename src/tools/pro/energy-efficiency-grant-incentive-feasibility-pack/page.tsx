"use client";

/**
 * Energy Efficiency Grant & Incentive Feasibility Pack — custom page component.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import type { EnergyEfficiencyInputs, EnergyEfficiencyOutputs } from
  "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-scrap-rework-cost.css";

type CurrencyCode = "EUR" | "USD" | "GBP" | "TRY";
const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "GBP", "TRY"];
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EUR: "\u20AC", USD: "$", GBP: "\u00A3", TRY: "\u20BA",
};
const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  EUR: "EUR (\u20AC)", USD: "USD ($)", GBP: "GBP (\u00A3)", TRY: "TRY (\u20BA)",
};
const DEFAULT_CURRENCY_INDEX = 1;

interface FieldDef {
  id: keyof EnergyEfficiencyInputs;
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
  { id: "currentKwhPerYear", label: "Current kWh/year", defaultUnit: "kWh/yr", showPrefix: false, default: 500000, hint: "Annual energy consumption before improvement.", ref: "kWh/yr", group: "energy", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "targetKwhPerYear", label: "Target kWh/year", defaultUnit: "kWh/yr", showPrefix: false, default: 350000, hint: "Expected annual consumption after improvement.", ref: "kWh/yr", group: "energy", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "avgKwhRate", label: "Average kWh rate", defaultUnit: "/kWh", showPrefix: true, default: 0.14, hint: "Blended electricity rate.", ref: "/kWh", group: "energy", hardMin: 0, hardMax: 10, step: "0.001" },
  { id: "implementationCost", label: "Implementation cost", defaultUnit: "", showPrefix: true, default: 120000, hint: "Total project implementation cost.", ref: "one-time", group: "cost", hardMin: 0, hardMax: 1e8, step: "1000" },
  { id: "grantCoveragePct", label: "Grant coverage (%)", defaultUnit: "%", showPrefix: false, default: 35, hint: "Expected grant percentage (e.g. 35 = 35%).", ref: "%", group: "cost", hardMin: 0, hardMax: 100, step: "1" },
  { id: "maintenanceCostSaving", label: "Maintenance cost saving", defaultUnit: "/yr", showPrefix: true, default: 5000, hint: "Annual maintenance cost reduction.", ref: "/yr", group: "savings", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "emissionFactorKgCo2PerKwh", label: "Emission factor (kgCO2/kWh)", defaultUnit: "kgCO2/kWh", showPrefix: false, default: 0.45, hint: "Grid emission factor for CO2 calculation.", ref: "kgCO2/kWh", group: "environmental", hardMin: 0, hardMax: 10, step: "0.01" },
  { id: "equipmentLifeYears", label: "Equipment life (years)", defaultUnit: "yr", showPrefix: false, default: 15, hint: "Expected useful life of new equipment.", ref: "yr", group: "horizon", hardMin: 1, hardMax: 50, step: "1" },
  { id: "discountRate", label: "Discount rate", defaultUnit: "rate", showPrefix: false, default: 0.06, hint: "WACC or required rate of return (e.g. 0.06 = 6%).", ref: "0..1", group: "horizon", hardMin: 0, hardMax: 1, step: "0.01" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, step: "0.05" },
];

const GROUP_META: Record<string, { title: string; desc: string }> = {
  energy:        { title: "Energy Consumption", desc: "Current and target energy usage." },
  cost:          { title: "Cost & Grant", desc: "Implementation cost and expected grant coverage." },
  savings:       { title: "Additional Savings", desc: "Maintenance cost reduction from new equipment." },
  environmental: { title: "Environmental", desc: "Carbon emission factors for CO2 savings calculation." },
  horizon:       { title: "Time Horizon", desc: "Equipment life and discount rate for NPV." },
  quality:       { title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

const CURRENCY_NOTE = "All monetary values in the selected currency.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

export default function EnergyEfficiencyGrantPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<EnergyEfficiencyInputs>(() => {
    const init: EnergyEfficiencyInputs = {} as EnergyEfficiencyInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<EnergyEfficiencyOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const livePreview = useMemo((): EnergyEfficiencyOutputs | null => {
    if (!inputs.currentKwhPerYear || inputs.currentKwhPerYear <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof EnergyEfficiencyInputs, raw: string) => {
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
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Energy Efficiency Grant &amp; Incentive Feasibility Pack</h1>
        <p className="lede">
          Evaluate the financial and environmental feasibility of energy efficiency improvements. &mdash;
          Compute payback, ROI, CO2 reduction, and grant-adjusted net cost.
        </p>
        <div className="meta">
          <span>ISO 50001 &mdash; Energy Performance &bull; Auditable</span>
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
          <button className="cta" onClick={handleCalculate}>Generate Feasibility Report</button>
          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against energy audits and grant terms before proceeding.</span>
          </div>
        </div>

        <div className="rail">
          <div className="rail-in">
            {livePreview ? (
              <>
                <div className="verdict">
                  {(() => {
                    const dec = livePreview.out_finalDecisionState;
                    return (
                      <>
                        <div className={`verdict-band ${decisionClass(dec)}`}>{decisionLabel(dec)}</div>
                        <div className="verdict-body">
                          <div className="big">{livePreview.out_normalizedDemand.toFixed(0)}<small> demand metric</small></div>
                          <div className="big-cap">ROI: {((livePreview.out_utilizationMargin - 1) * 100).toFixed(0)}%</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="stat"><span>Money saving/yr</span><b>{curSym}{(livePreview.out_normalizedDemand / (inputs.avgKwhRate > 0 ? inputs.avgKwhRate / 10 : 1)).toFixed(0)}</b></div>
                <div className="stat"><span>Money at risk</span><b>{curSym}{livePreview.out_moneyAtRisk.toFixed(0)}</b></div>
                <div className="stat"><span>Data confidence</span><b>{(livePreview.out_evidenceCompleteness * 100).toFixed(0)}%</b></div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter current kWh/yr &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>Energy Efficiency Feasibility Report</h2></div>
            <div className="rid">ISO 50001 &bull; Energy Performance<br />Report ID: EE-{Date.now().toString(36).toUpperCase()}</div>
          </div>
          <div className="rep-body">
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>Payback: {((result.out_normalizedDemand / (inputs.avgKwhRate > 0 ? inputs.avgKwhRate / 10 : 1)) > 0 ? inputs.implementationCost * (1 - inputs.grantCoveragePct) / (inputs.currentKwhPerYear - inputs.targetKwhPerYear) * inputs.avgKwhRate + inputs.maintenanceCostSaving : 0).toFixed(1)} yr &middot; 5yr ROI: {((result.out_utilizationMargin - 1) * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Cost &amp; Savings</span></div>
              <table>
                <thead><tr><th>Item</th><th className="n">Amount ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>Implementation cost</td><td className="n">{curSym}{inputs.implementationCost.toLocaleString()}</td></tr>
                  <tr><td>Grant amount</td><td className="n">{curSym}{(inputs.implementationCost * inputs.grantCoveragePct).toFixed(0)}</td></tr>
                  <tr><td>Net cost</td><td className="n">{curSym}{(inputs.implementationCost * (1 - inputs.grantCoveragePct)).toFixed(0)}</td></tr>
                  <tr><td>Annual money saving</td><td className="n">{curSym}{((inputs.currentKwhPerYear - inputs.targetKwhPerYear) * inputs.avgKwhRate + inputs.maintenanceCostSaving).toFixed(0)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Decision Factors</span></div>
              <table>
                <thead><tr><th>Factor</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Data confidence</td><td className="n">{(result.out_evidenceCompleteness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Energy saving (kWh)</td><td className="n">{(inputs.currentKwhPerYear - inputs.targetKwhPerYear).toLocaleString()}</td></tr>
                  <tr><td>CO2 reduction (t/yr)</td><td className="n">{((inputs.currentKwhPerYear - inputs.targetKwhPerYear) * inputs.emissionFactorKgCo2PerKwh / 1000).toFixed(1)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Current kWh/yr</td><td className="n">{inputs.currentKwhPerYear.toLocaleString()}</td></tr>
                  <tr><td>Target kWh/yr</td><td className="n">{inputs.targetKwhPerYear.toLocaleString()}</td></tr>
                  <tr><td>Avg rate</td><td className="n">{curSym}{inputs.avgKwhRate.toFixed(3)}</td></tr>
                  <tr><td>Grant coverage</td><td className="n">{(inputs.grantCoveragePct * 100).toFixed(0)}%</td></tr>
                  <tr><td>Equipment life</td><td className="n">{inputs.equipmentLifeYears.toFixed(0)} yr</td></tr>
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
              <div className="seal">EE-REPORT-{Date.now().toString(36).toUpperCase()}<br />Engine: executeFormula v5.3.1-pro &bull; ISO 50001:2018<br />Generated: {new Date().toISOString()}</div>
              <div className="disc"><strong>Disclaimer.</strong> This report is a technical simulation based on the inputs provided. Always verify calculations with a qualified professional before making business decisions.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
