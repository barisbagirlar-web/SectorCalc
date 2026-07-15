"use client";

/**
 * Plant-Wide Shop Rate Cost Structure Audit — custom page component.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
import type { PlantWideShopRateInputs, PlantWideShopRateOutputs } from
  "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
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
  id: keyof PlantWideShopRateInputs;
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
  { id: "totalAnnualCost", label: "Total annual cost", defaultUnit: "", showPrefix: true, default: 1200000, hint: "Total plant-wide cost (direct + indirect).", ref: "annual", group: "cost", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "totalProductiveHours", label: "Total productive hours", defaultUnit: "hrs", showPrefix: false, default: 32000, hint: "Total billed or productive hours.", ref: "hr/yr", group: "cost", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "machineGroupCost", label: "Machine group cost", defaultUnit: "", showPrefix: true, default: 450000, hint: "Cost attributed to target machine group.", ref: "annual", group: "machines", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "machineGroupHours", label: "Machine group hours", defaultUnit: "hrs", showPrefix: false, default: 12000, hint: "Productive hours for machine group.", ref: "hr/yr", group: "machines", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "overheadPool", label: "Overhead pool", defaultUnit: "", showPrefix: true, default: 380000, hint: "Total overhead costs to allocate.", ref: "annual", group: "overhead", hardMin: 0, hardMax: 1e9, step: "1000" },
  { id: "overheadAllocationBase", label: "Overhead allocation base", defaultUnit: "hrs", showPrefix: false, default: 32000, hint: "Allocation base (e.g., direct labor hours).", ref: "hrs", group: "overhead", hardMin: 0, hardMax: 1e7, step: "100" },
  { id: "currentShopRate", label: "Current shop rate", defaultUnit: "/hr", showPrefix: true, default: 65, hint: "Current billing rate per hour.", ref: "/hr", group: "pricing", hardMin: 0, hardMax: 5000, step: "0.5" },
  { id: "targetMarginPct", label: "Target margin (%)", defaultUnit: "%", showPrefix: false, default: 15, hint: "Desired profit margin on shop rate.", ref: "%", group: "pricing", hardMin: 0, hardMax: 200, step: "1" },
  { id: "utilizationPct", label: "Utilization (%)", defaultUnit: "%", showPrefix: false, default: 78, hint: "Actual capacity utilization rate.", ref: "%", group: "pricing", hardMin: 0, hardMax: 100, step: "1" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, step: "0.05" },
];

const GROUP_META: Record<string, { title: string; desc: string }> = {
  cost:      { title: "Plant-Wide Costs", desc: "Total annual cost and productive hours." },
  machines:  { title: "Machine Group", desc: "Cost and hours for the target machine group." },
  overhead:  { title: "Overhead Allocation", desc: "Overhead pool and allocation base." },
  pricing:   { title: "Pricing & Utilization", desc: "Current rate, target margin, and utilization." },
  quality:   { title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

const CURRENCY_NOTE = "All monetary values in the selected currency.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

export default function PlantWideShopRatePage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<PlantWideShopRateInputs>(() => {
    const init: PlantWideShopRateInputs = {} as PlantWideShopRateInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<PlantWideShopRateOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const livePreview = useMemo((): PlantWideShopRateOutputs | null => {
    if (!inputs.totalAnnualCost || inputs.totalAnnualCost <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof PlantWideShopRateInputs, raw: string) => {
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
    d === 0 ? "OK" : d === 1 ? "REPRICE" : "REVIEW";
  const decisionClass = (d: number) =>
    d === 0 ? "pos" : d === 1 ? "warn" : "neg";

  return (
    <div className="shell">
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Plant-Wide Shop Rate Cost Structure Audit</h1>
        <p className="lede">
          Audit plant-wide shop rates against actual cost structure. &mdash;
          Compute plant-wide rate, machine group rate, overhead absorption, and pricing floor.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Cost Accounting &bull; Auditable</span>
          <span><b>Cost Audit</b></span>
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
          <button className="cta" onClick={handleCalculate}>Generate Rate Audit Report</button>
          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against accounting records before repricing decisions.</span>
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
                          <div className="big">{curSym}{livePreview.out_demandMetric.toFixed(2)}<small> /hr plant rate</small></div>
                          <div className="big-cap">Floor: {curSym}{(livePreview.out_demandMetric * (1 + inputs.targetMarginPct / 100)).toFixed(2)}/hr</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="stat"><span>Plant-wide rate</span><b>{curSym}{livePreview.out_demandMetric.toFixed(2)}</b></div>
                <div className="stat"><span>Machine group rate</span><b>{curSym}{livePreview.out_capacityMetric.toFixed(2)}</b></div>
                <div className="stat"><span>Under-recovery</span><b>{curSym}{livePreview.out_moneyAtRisk.toFixed(0)}</b></div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter total annual cost &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>Shop Rate Cost Structure Audit Report</h2></div>
            <div className="rid">ISO 9001:2015 &bull; Cost Accounting<br />Report ID: SR-{Date.now().toString(36).toUpperCase()}</div>
          </div>
          <div className="rep-body">
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>Plant-wide rate: {curSym}{result.out_demandMetric.toFixed(2)}/hr &middot; Pricing floor: {curSym}{(result.out_demandMetric * (1 + inputs.targetMarginPct / 100)).toFixed(2)}/hr &middot; Current rate: {curSym}{inputs.currentShopRate.toFixed(2)}/hr</p>
              </div>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Rate Structure</span></div>
              <table>
                <thead><tr><th>Component</th><th className="n">Rate ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>Plant-wide rate</td><td className="n">{curSym}{result.out_demandMetric.toFixed(2)}</td></tr>
                  <tr><td>Machine group rate</td><td className="n">{curSym}{result.out_capacityMetric.toFixed(2)}</td></tr>
                  <tr><td>Overhead abs. rate</td><td className="n">{curSym}{result.out_expandedUncertainty.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Decision Factors</span></div>
              <table>
                <thead><tr><th>Factor</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Utilization</td><td className="n">{(result.out_utilizationMargin * 100).toFixed(0)}%</td></tr>
                  <tr><td>Under-recovery</td><td className="n">{curSym}{result.out_moneyAtRisk.toFixed(0)}</td></tr>
                  <tr><td>Scenario delta</td><td className="n">{curSym}{result.out_scenarioDelta.toFixed(2)}</td></tr>
                  <tr><td>Data confidence</td><td className="n">{(result.out_evidenceCompleteness * 100).toFixed(0)}%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Total annual cost</td><td className="n">{curSym}{inputs.totalAnnualCost.toLocaleString()}</td></tr>
                  <tr><td>Productive hours</td><td className="n">{inputs.totalProductiveHours.toLocaleString()}</td></tr>
                  <tr><td>Current shop rate</td><td className="n">{curSym}{inputs.currentShopRate.toFixed(2)}/hr</td></tr>
                  <tr><td>Target margin</td><td className="n">{inputs.targetMarginPct.toFixed(0)}%</td></tr>
                  <tr><td>Utilization</td><td className="n">{inputs.utilizationPct.toFixed(0)}%</td></tr>
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
              <div className="seal">SR-REPORT-{Date.now().toString(36).toUpperCase()}<br />Engine: executeFormula v5.3.1-pro &bull; ISO 9001:2015<br />Generated: {new Date().toISOString()}</div>
              <div className="disc"><strong>Disclaimer.</strong> This report is a technical simulation based on the inputs provided. Always verify calculations with a qualified professional before making business decisions.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
