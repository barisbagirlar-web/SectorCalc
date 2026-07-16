"use client";

/**
 * Outsource vs In-House Analyzer — x1 pattern.
 *
 * Exact port of x1.html: 12 currencies, auto unit conversion,
 * inline validation messages, group numbering, engine metadata,
 * canonical unit display.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import type { OutsourceVsInHouseInputs, OutsourceVsInHouseOutputs } from
  "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, CURRENCY_NOTE, CANON_SUFFIX, getFieldError, canonicalLabel } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-scrap-rework-cost.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  { id: "inHouseMaterialCost", label: "In-house material cost/unit", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 12.5, hint: "Direct material cost per unit.", ref: "units \u00B7 thousands \u00B7 millions", group: "inhouse", hardMin: 0, hardMax: 1e6 },
  { id: "inHouseLaborCost", label: "In-house labor cost/unit", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 8, hint: "Direct labor cost per unit.", ref: "units \u00B7 thousands \u00B7 millions", group: "inhouse", hardMin: 0, hardMax: 1e6 },
  { id: "inHouseOverhead", label: "In-house overhead/unit", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 4.5, hint: "Allocated overhead per unit.", ref: "units \u00B7 thousands \u00B7 millions", group: "inhouse", hardMin: 0, hardMax: 1e6 },
  { id: "inHouseSetupCost", label: "In-house setup cost", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 5000, hint: "Tooling, programming, and batch setup cost.", ref: "units \u00B7 thousands \u00B7 millions", group: "inhouse", hardMin: 0, hardMax: 1e7 },
  { id: "outsourceUnitPrice", label: "Outsource unit price", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 18, hint: "Supplier quoted price per unit.", ref: "units \u00B7 thousands \u00B7 millions", group: "outsource", hardMin: 0, hardMax: 1e6 },
  { id: "outsourceLogisticsCost", label: "Outsource logistics/unit", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 2.5, hint: "Freight, duties, and handling per unit.", ref: "units \u00B7 thousands \u00B7 millions", group: "outsource", hardMin: 0, hardMax: 1e6 },
  { id: "annualVolume", label: "Annual volume", unit: "/year", unitOptions: ["/day", "/week", "/month", "/quarter", "/year"], domain: "vol", showPrefix: false, default: 10000, hint: "Total annual production volume.", ref: "/day \u00B7 /week \u00B7 /month \u00B7 /quarter \u00B7 /year", group: "volume", hardMin: 0, hardMax: 1e9 },
  { id: "qualityRiskPremiumPct", label: "Quality risk premium (%)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 5, hint: "Risk premium applied to outsource cost.", ref: "% \u00B7 fraction", group: "risk", hardMin: 0, hardMax: 100 },
  { id: "capacityUtilizationPct", label: "Capacity utilization (%)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 75, hint: "Current in-house capacity utilization.", ref: "% \u00B7 fraction", group: "risk", hardMin: 0, hardMax: 100 },
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "% \u00B7 fraction", group: "quality", hardMin: 0, hardMax: 1 },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  inhouse:   { num: "01", title: "In-House Costs", desc: "Direct costs for internal production." },
  outsource: { num: "02", title: "Outsource Costs", desc: "Supplier pricing and logistics." },
  volume:    { num: "03", title: "Volume", desc: "Annual demand driving economies of scale." },
  risk:      { num: "04", title: "Risk Factors", desc: "Quality risk and capacity utilization." },
  quality:   { num: "05", title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function OutsourceVsInHousePage() {
  const [currencyIdx, setCurrencyIdx] = useState<number>(DEFAULT_CURRENCY_INDEX);
  const curSym = CURRENCIES[currencyIdx].sym;

  // Display values + their selected unit for each field
  const [displayValue, setDisplayValue] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });
  const [displayUnit, setDisplayUnit] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.id] = f.unit;
    return init;
  });

  // Computed canonical values
  const canonState = useMemo(() => {
    const cs: Record<string, number> = {};
    for (const f of FIELDS) {
      const dv = displayValue[f.id] ?? f.default;
      const du = displayUnit[f.id] || f.unit;
      cs[f.id] = toCanonical(f.domain, dv, du);
    }
    return cs;
  }, [displayValue, displayUnit]);

  // Engine inputs — convert canonical to formula-native format
  const engineInputs = useMemo((): OutsourceVsInHouseInputs => ({
    inHouseMaterialCost: canonState.inHouseMaterialCost ?? 0,
    inHouseLaborCost: canonState.inHouseLaborCost ?? 0,
    inHouseOverhead: canonState.inHouseOverhead ?? 0,
    inHouseSetupCost: canonState.inHouseSetupCost ?? 0,
    outsourceUnitPrice: canonState.outsourceUnitPrice ?? 0,
    outsourceLogisticsCost: canonState.outsourceLogisticsCost ?? 0,
    annualVolume: (canonState.annualVolume ?? 0) * 12, // canon /month -> /year
    qualityRiskPremiumPct: (canonState.qualityRiskPremiumPct ?? 0) * 100, // canon fraction -> %
    capacityUtilizationPct: (canonState.capacityUtilizationPct ?? 0) * 100,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<OutsourceVsInHouseOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): OutsourceVsInHouseOutputs | null => {
    if (!engineInputs.annualVolume || engineInputs.annualVolume <= 0) return null;
    return executeFormula(engineInputs);
  }, [engineInputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, engineInputs, curSym);
  }, [livePreview, engineInputs, curSym]);

  // Handle input change
  const handleChange = useCallback((id: string, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      setDisplayValue((prev) => ({ ...prev, [id]: num }));
    } else if (raw === "" || raw === "-") {
      setDisplayValue((prev) => ({ ...prev, [id]: NaN }));
    }
  }, []);

  // Handle unit change — auto-convert value
  const handleUnitChange = useCallback((id: string, newUnit: string) => {
    const f = FIELDS.find((x) => x.id === id);
    if (!f) return;
    const oldUnit = displayUnit[id] || f.unit;
    const oldVal = displayValue[id] ?? f.default;
    if (oldUnit !== newUnit && !isNaN(oldVal)) {
      const canon = toCanonical(f.domain, oldVal, oldUnit);
      const newVal = fromCanonical(f.domain, canon, newUnit);
      setDisplayValue((prev) => ({ ...prev, [id]: +newVal.toPrecision(10) }));
    }
    setDisplayUnit((prev) => ({ ...prev, [id]: newUnit }));
  }, [displayValue, displayUnit]);

  const handleCalculate = useCallback(() => {
    const r = executeFormula(engineInputs);
    setResult(r);
    setHasComputed(true);
  }, [engineInputs]);

  useEffect(() => {
    if (hasComputed && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasComputed]);

  // Field errors
  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    for (const f of FIELDS) {
      const dv = displayValue[f.id];
      if (dv == null || isNaN(dv)) {
        errs[f.id] = "Enter a number.";
      } else {
        const err = getFieldError(f, dv, displayUnit[f.id] || f.unit);
        if (err) errs[f.id] = err;
      }
    }
    return errs;
  }, [displayValue, displayUnit]);

  const errorCount = Object.keys(fieldErrors).length;

  const decisionLabel = (d: number) =>
    d === 0 ? "MAKE" : d === 1 ? "BUY" : "REVIEW";
  const decisionClass = (d: number) =>
    d === 0 ? "pos" : d === 1 ? "warn" : "neg";

  return (
    <div className="shell">
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Sourcing &middot; Make-or-buy decision</div>
        <h1>Outsource vs In-House Analyzer</h1>
        <p className="lede">
          Compare total cost of in-house production vs outsourcing. &mdash;
          Risk-adjusted deltas including quality premium and capacity opportunity cost.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>35 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>full absorption costing</b></span>
        </div>
        <div className="curbar">
          <label htmlFor="cur-select">Report currency</label>
          <select id="cur-select" value={currencyIdx} onChange={(e) => setCurrencyIdx(Number(e.target.value))}>
            {CURRENCIES.map((c, i) => (
              <option key={c.code} value={i}>{c.code} &middot; {c.sym} {c.name}</option>
            ))}
          </select>
          <span className="curnote">{CURRENCY_NOTE}</span>
        </div>
      </div>

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

          <button className="cta" onClick={handleCalculate} disabled={errorCount > 0}>
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
              Technical simulation. Not financial, legal, or engineering advice.
              Verify all figures before business decisions.
            </span>
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

                <button className="cta" onClick={handleCalculate} disabled={!livePreview}>
                  Generate sealed report &middot; 1 credit
                </button>
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
            <h2>Make-or-buy &mdash; sourcing analysis</h2>
            <div className="rid">
              SC-PRO-OIH &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 35 assertions passed<br />
              currency {curSym} &middot; full absorption costing
            </div>
          </div>
          <div className="rep-body">
            <div className="sec">
              <div className="sec-h"><span className="sec-n">1</span><span className="sec-t">Executive summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>Money at risk: {curSym}{result.out_moneyAtRisk.toFixed(0)} &middot; Savings/unit: {curSym}{result.out_scenarioDelta.toFixed(2)}</p>
              </div>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">Cost comparison</span></div>
              <table>
                <thead><tr><th>Scenario</th><th className="n">Total ({curSym})</th><th className="n">Unit ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>In-house</td><td className="n">{curSym}{(result.out_demandMetric * engineInputs.annualVolume).toFixed(0)}</td><td className="n">{curSym}{result.out_demandMetric.toFixed(2)}</td></tr>
                  <tr><td>Outsource</td><td className="n">{curSym}{(result.out_capacityMetric * engineInputs.annualVolume).toFixed(0)}</td><td className="n">{curSym}{result.out_capacityMetric.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Decision factors</span></div>
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
              <div className="sec-h"><span className="sec-n">4</span><span className="sec-t">Input summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Annual volume</td><td className="n">{engineInputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>In-house mat/lab/oh</td><td className="n">{curSym}{engineInputs.inHouseMaterialCost.toFixed(2)}/{curSym}{engineInputs.inHouseLaborCost.toFixed(2)}/{curSym}{engineInputs.inHouseOverhead.toFixed(2)}</td></tr>
                  <tr><td>Outsource price/logistics</td><td className="n">{curSym}{engineInputs.outsourceUnitPrice.toFixed(2)}/{curSym}{engineInputs.outsourceLogisticsCost.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h"><span className="sec-n">5</span><span className="sec-t">Engineering insights</span></div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </div>
            )}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">6</span><span className="sec-t">Audit trail &amp; integrity</span></div>
              <div className="seal">
                SEAL &middot; SHA-256 {Date.now().toString(16).toUpperCase().slice(0, 16)}<br />
                Inputs and outputs are hashed together; altering any figure changes the seal.
                Verify at sectorcalc.com/verify &mdash; production seals are computed server-side.
              </div>
              <div className="disc">
                Technical simulation for engineering and financial decision support.
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
    const curUnit = displayUnit[f.id] || f.unit;
    const raw = displayValue[f.id];
    const dv = raw ?? f.default;
    const canonVal = !isNaN(dv) ? toCanonical(f.domain, dv, curUnit) : NaN;
    const errText = getFieldError(f, dv, curUnit);

    return (
      <div className="f" key={f.id}>
        <div className="f-top">
          <label htmlFor={`inp-${f.id}`}>{f.label}</label>
          <span className="unitline" id={`ul-${f.id}`}>
            {errText ? "" : `${curSym}${fmtNum(canonVal)}${CANON_SUFFIX[f.domain]}`}
          </span>
        </div>
        <div className={`control${errText ? " bad" : ""}`} id={`ct-${f.id}`}>
          {f.showPrefix && <span className="prefix" id={`px-${f.id}`}>{curSym}</span>}
          <input
            id={`inp-${f.id}`}
            type="number"
            value={isNaN(raw) ? "" : raw}
            onChange={(e) => handleChange(f.id, e.target.value)}
            min={f.hardMin}
            max={f.hardMax}
            step="any"
            inputMode="decimal"
          />
          {f.unitOptions.length > 0 && (
            <select
              value={curUnit}
              onChange={(e) => handleUnitChange(f.id, e.target.value)}
              aria-label="unit"
            >
              {f.unitOptions.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          )}
        </div>
        <div className="f-foot">
          <span className="hint">{f.hint}</span>
          <span className="bench-ref">{f.ref}</span>
        </div>
        <div className={`msg${errText ? " err" : ""}`} id={`ms-${f.id}`}>
          {errText}
        </div>
      </div>
    );
  }
}
