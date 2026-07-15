"use client";

/**
 * FX & Commodity Pass-Through Pricer — custom page component.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";
import type { FxCommodityPassThroughInputs, FxCommodityPassThroughOutputs } from
  "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";
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
  id: keyof FxCommodityPassThroughInputs;
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
  { id: "basePrice", label: "Base price", defaultUnit: "", showPrefix: true, default: 1000, hint: "Current contract or catalog price.", ref: "per unit", group: "pricing", hardMin: 0, hardMax: 1e7, step: "10" },
  { id: "annualVolume", label: "Annual volume", defaultUnit: "units/yr", showPrefix: false, default: 5000, hint: "Annual contracted volume.", ref: "units/yr", group: "pricing", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "fxRateSpot", label: "FX rate (spot)", defaultUnit: "", showPrefix: false, default: 1.12, hint: "Current spot exchange rate.", ref: "rate", group: "fx", hardMin: 0, hardMax: 100, step: "0.001" },
  { id: "fxRateBudget", label: "FX rate (budget)", defaultUnit: "", showPrefix: false, default: 1.08, hint: "Budgeted exchange rate.", ref: "rate", group: "fx", hardMin: 0, hardMax: 100, step: "0.001" },
  { id: "fxHedgePct", label: "FX hedge (%)", defaultUnit: "%", showPrefix: false, default: 60, hint: "Percentage of FX exposure hedged.", ref: "%", group: "fx", hardMin: 0, hardMax: 100, step: "1" },
  { id: "commodityIndexCurrent", label: "Commodity index (current)", defaultUnit: "", showPrefix: false, default: 185, hint: "Current commodity index value.", ref: "index", group: "commodity", hardMin: 0, hardMax: 1e6, step: "1" },
  { id: "commodityIndexBudget", label: "Commodity index (budget)", defaultUnit: "", showPrefix: false, default: 170, hint: "Budgeted commodity index value.", ref: "index", group: "commodity", hardMin: 0, hardMax: 1e6, step: "1" },
  { id: "commodityHedgePct", label: "Commodity hedge (%)", defaultUnit: "%", showPrefix: false, default: 50, hint: "Percentage of commodity exposure hedged.", ref: "%", group: "commodity", hardMin: 0, hardMax: 100, step: "1" },
  { id: "materialCostPct", label: "Material cost (% of price)", defaultUnit: "%", showPrefix: false, default: 45, hint: "Material cost as percentage of base price.", ref: "%", group: "exposure", hardMin: 0, hardMax: 100, step: "1" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, step: "0.05" },
];

const GROUP_META: Record<string, { title: string; desc: string }> = {
  pricing:   { title: "Pricing", desc: "Base price and annual volume." },
  fx:        { title: "FX Rate", desc: "Spot, budget, and hedge coverage for FX." },
  commodity: { title: "Commodity", desc: "Current, budget, and hedge for commodity index." },
  exposure:  { title: "Exposure", desc: "Material cost exposure as percentage of price." },
  quality:   { title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

const CURRENCY_NOTE = "All monetary values in the selected currency.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

export default function FxCommodityPassThroughPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<FxCommodityPassThroughInputs>(() => {
    const init: FxCommodityPassThroughInputs = {} as FxCommodityPassThroughInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<FxCommodityPassThroughOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const livePreview = useMemo((): FxCommodityPassThroughOutputs | null => {
    if (!inputs.basePrice || inputs.basePrice <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof FxCommodityPassThroughInputs, raw: string) => {
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
    d === 0 ? "OK" : d === 1 ? "REPRICE" : "HOLD";

  return (
    <div className="shell">
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>FX &amp; Commodity Pass-Through Pricer</h1>
        <p className="lede">
          Calculate pass-through adjustments for FX rate and commodity index movements. &mdash;
          Determine adjusted price, escalation amount, and decision state.
        </p>
        <div className="meta">
          <span>ISO 55000 &mdash; Asset Management &bull; Auditable</span>
          <span><b>Pricing</b></span>
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
          <button className="cta" onClick={handleCalculate}>Generate Pass-Through Analysis</button>
          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify against contract terms and market data before adjusting prices.</span>
          </div>
        </div>

        <div className="rail">
          <div className="rail-in">
            {livePreview ? (
              <>
                <div className="verdict">
                  <div className={`verdict-band ${livePreview.out_finalDecisionState === 0 ? "pos" : "warn"}`}>
                    {decisionLabel(livePreview.out_finalDecisionState)}
                  </div>
                  <div className="verdict-body">
                    <div className="big">{curSym}{livePreview.out_utilizationMargin.toFixed(4)}<small> price ratio</small></div>
                    <div className="big-cap">Pass-through: {((livePreview.out_utilizationMargin - 1) * 100).toFixed(2)}%</div>
                  </div>
                </div>
                <div className="stat"><span>Adjusted price</span><b>{curSym}{(livePreview.out_utilizationMargin * inputs.basePrice).toFixed(2)}</b></div>
                <div className="stat"><span>FX impact</span><b>{livePreview.out_referenceDeviation.toFixed(4)}</b></div>
                <div className="stat"><span>Money at risk</span><b>{curSym}{livePreview.out_moneyAtRisk.toFixed(0)}</b></div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter base price &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <div><h2>FX &amp; Commodity Pass-Through Report</h2></div>
            <div className="rid">ISO 55000 &bull; Asset Management<br />Report ID: FX-{Date.now().toString(36).toUpperCase()}</div>
          </div>
          <div className="rep-body">
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>Adjusted price: {curSym}{(result.out_utilizationMargin * inputs.basePrice).toFixed(2)} &middot; Pass-through: {((result.out_utilizationMargin - 1) * 100).toFixed(2)}% &middot; Base: {curSym}{inputs.basePrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Pass-Through Breakdown</span></div>
              <table>
                <thead><tr><th>Component</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>FX change</td><td className="n">{(result.out_referenceDeviation * 100).toFixed(2)}%</td></tr>
                  <tr><td>Sensitivity driver</td><td className="n">idx {result.out_sensitivityDriver}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmeaTrigger}</td></tr>
                  <tr><td>Money at risk</td><td className="n">{curSym}{result.out_moneyAtRisk.toFixed(0)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Decision Factors</span></div>
              <table>
                <thead><tr><th>Factor</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Data confidence</td><td className="n">{(result.out_evidenceCompleteness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Derating factor</td><td className="n">{result.out_deratingFactor.toFixed(4)}</td></tr>
                  <tr><td>Scenario delta</td><td className="n">{curSym}{result.out_scenarioDelta.toFixed(0)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Base price</td><td className="n">{curSym}{inputs.basePrice.toFixed(2)}</td></tr>
                  <tr><td>FX spot/budget</td><td className="n">{inputs.fxRateSpot}/{inputs.fxRateBudget}</td></tr>
                  <tr><td>Commodity curr/budget</td><td className="n">{inputs.commodityIndexCurrent}/{inputs.commodityIndexBudget}</td></tr>
                  <tr><td>Material cost %</td><td className="n">{inputs.materialCostPct.toFixed(0)}%</td></tr>
                  <tr><td>FX hedge</td><td className="n">{inputs.fxHedgePct.toFixed(0)}%</td></tr>
                  <tr><td>Commodity hedge</td><td className="n">{inputs.commodityHedgePct.toFixed(0)}%</td></tr>
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
              <div className="seal">FX-REPORT-{Date.now().toString(36).toUpperCase()}<br />Engine: executeFormula v5.3.1-pro &bull; ISO 55000<br />Generated: {new Date().toISOString()}</div>
              <div className="disc"><strong>Disclaimer.</strong> This report is a technical simulation based on the inputs provided. Always verify calculations with a qualified professional before making business decisions.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
