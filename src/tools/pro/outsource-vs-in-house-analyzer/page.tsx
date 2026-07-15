"use client";

/**
 * Outsource vs In-House Analyzer — custom page component.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import type { OutsourceVsInHouseInputs, OutsourceVsInHouseOutputs } from
  "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
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
  id: keyof OutsourceVsInHouseInputs;
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
  { id: "inHouseMaterialCost", label: "In-house material cost/unit", defaultUnit: "/unit", showPrefix: true, default: 12.5, hint: "Direct material cost per unit.", ref: "/unit", group: "inhouse", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "inHouseLaborCost", label: "In-house labor cost/unit", defaultUnit: "/unit", showPrefix: true, default: 8, hint: "Direct labor cost per unit.", ref: "/unit", group: "inhouse", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "inHouseOverhead", label: "In-house overhead/unit", defaultUnit: "/unit", showPrefix: true, default: 4.5, hint: "Allocated overhead per unit.", ref: "/unit", group: "inhouse", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "inHouseSetupCost", label: "In-house setup cost", defaultUnit: "", showPrefix: true, default: 5000, hint: "Tooling, programming, and batch setup cost.", ref: "one-time", group: "inhouse", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "outsourceUnitPrice", label: "Outsource unit price", defaultUnit: "/unit", showPrefix: true, default: 18, hint: "Supplier quoted price per unit.", ref: "/unit", group: "outsource", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "outsourceLogisticsCost", label: "Outsource logistics/unit", defaultUnit: "/unit", showPrefix: true, default: 2.5, hint: "Freight, duties, and handling per unit.", ref: "/unit", group: "outsource", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "annualVolume", label: "Annual volume", defaultUnit: "units/yr", showPrefix: false, default: 10000, hint: "Total annual production volume.", ref: "units/yr", group: "volume", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "qualityRiskPremiumPct", label: "Quality risk premium (%)", defaultUnit: "%", showPrefix: false, default: 5, hint: "Risk premium applied to outsource cost.", ref: "%", group: "risk", hardMin: 0, hardMax: 100, step: "0.1" },
  { id: "capacityUtilizationPct", label: "Capacity utilization (%)", defaultUnit: "%", showPrefix: false, default: 75, hint: "Current in-house capacity utilization.", ref: "%", group: "risk", hardMin: 0, hardMax: 100, step: "1" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, step: "0.05" },
];

const GROUP_META: Record<string, { title: string; desc: string }> = {
  inhouse:   { title: "In-House Costs", desc: "Direct costs for internal production." },
  outsource: { title: "Outsource Costs", desc: "Supplier pricing and logistics." },
  volume:    { title: "Volume", desc: "Annual demand driving economies of scale." },
  risk:      { title: "Risk Factors", desc: "Quality risk and capacity utilization." },
  quality:   { title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

const CURRENCY_NOTE = "All monetary values in the selected currency.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

export default function OutsourceVsInHousePage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<OutsourceVsInHouseInputs>(() => {
    const init: OutsourceVsInHouseInputs = {} as OutsourceVsInHouseInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<OutsourceVsInHouseOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const livePreview = useMemo((): OutsourceVsInHouseOutputs | null => {
    if (!inputs.annualVolume || inputs.annualVolume <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof OutsourceVsInHouseInputs, raw: string) => {
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
    d === 0 ? "MAKE" : d === 1 ? "BUY" : "REVIEW";
  const decisionClass = (d: number) =>
    d === 0 ? "pos" : d === 1 ? "warn" : "neg";

  return (
    <div className="shell">
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Outsource vs In-House Analyzer</h1>
        <p className="lede">
          Compare total cost of in-house production vs outsourcing. &mdash;
          Risk-adjusted deltas including quality premium and capacity opportunity cost.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Outsourced Processes &bull; Auditable</span>
          <span><b>Sourcing Decision</b></span>
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
          <button className="cta" onClick={handleCalculate}>Generate Sourcing Analysis</button>
          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against actual quotes and accounting data before decisions.</span>
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
                          <div className="big">{curSym}{livePreview.out_moneyAtRisk.toFixed(0)}<small> money at risk</small></div>
                          <div className="big-cap">Delta/unit: {curSym}{livePreview.out_scenarioDelta.toFixed(2)}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="stat"><span>In-house unit cost</span><b>{curSym}{livePreview.out_demandMetric.toFixed(2)}</b></div>
                <div className="stat"><span>Outsource unit cost</span><b>{curSym}{livePreview.out_capacityMetric.toFixed(2)}</b></div>
                <div className="stat"><span>Annual volume</span><b>{livePreview.out_normalizedDemand.toFixed(0)}</b></div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter annual volume &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>Outsource vs In-House Analysis Report</h2></div>
            <div className="rid">ISO 9001:2015 &bull; Outsourced Processes<br />Report ID: OIH-{Date.now().toString(36).toUpperCase()}</div>
          </div>
          <div className="rep-body">
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>Money at risk: {curSym}{result.out_moneyAtRisk.toFixed(0)} &middot; Savings/unit: {curSym}{result.out_scenarioDelta.toFixed(2)}</p>
              </div>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Cost Comparison</span></div>
              <table>
                <thead><tr><th>Scenario</th><th className="n">Total ({curSym})</th><th className="n">Unit ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>In-house</td><td className="n">{curSym}{(result.out_demandMetric * inputs.annualVolume).toFixed(0)}</td><td className="n">{curSym}{result.out_demandMetric.toFixed(2)}</td></tr>
                  <tr><td>Outsource</td><td className="n">{curSym}{(result.out_capacityMetric * inputs.annualVolume).toFixed(0)}</td><td className="n">{curSym}{result.out_capacityMetric.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Decision Factors</span></div>
              <table>
                <thead><tr><th>Factor</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Capacity utilization</td><td className="n">{(result.out_utilizationMargin * 100).toFixed(0)}%</td></tr>
                  <tr><td>Quality risk premium</td><td className="n">{(result.out_referenceDeviation * 100).toFixed(1)}%</td></tr>
                  <tr><td>Data confidence</td><td className="n">{(result.out_evidenceCompleteness * 100).toFixed(0)}%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Annual volume</td><td className="n">{inputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>In-house mat/lab/oh</td><td className="n">{curSym}{inputs.inHouseMaterialCost.toFixed(2)}/{curSym}{inputs.inHouseLaborCost.toFixed(2)}/{curSym}{inputs.inHouseOverhead.toFixed(2)}</td></tr>
                  <tr><td>Outsource price/logistics</td><td className="n">{curSym}{inputs.outsourceUnitPrice.toFixed(2)}/{curSym}{inputs.outsourceLogisticsCost.toFixed(2)}</td></tr>
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
              <div className="seal">OIH-REPORT-{Date.now().toString(36).toUpperCase()}<br />Engine: executeFormula v5.3.1-pro &bull; ISO 9001:2015<br />Generated: {new Date().toISOString()}</div>
              <div className="disc"><strong>Disclaimer.</strong> This report is a technical simulation based on the inputs provided. Always verify calculations with a qualified professional before making business decisions.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
