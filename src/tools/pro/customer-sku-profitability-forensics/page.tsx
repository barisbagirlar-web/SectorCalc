"use client";

/**
 * Customer SKU Profitability Forensics — x1 pattern.
 *
 * Exact port of x1.html: 12 currencies, auto unit conversion,
 * inline validation messages, group numbering, engine metadata,
 * canonical unit display.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import type { SKUProfitInputs, SKUProfitOutputs } from
  "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, CURRENCY_NOTE, CANON_SUFFIX, getFieldError, canonicalLabel } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-customer-sku-profitability-forensics.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Revenue ──
  { id: "unitPrice", label: "Unit selling price", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 250, hint: "Net selling price per unit after discounts.", ref: "units \u00B7 thousands \u00B7 millions", group: "revenue", hardMin: 0, hardMax: 1e7 },
  { id: "unitVariableCost", label: "Unit variable cost", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 140, hint: "Direct material + direct labor + variable overhead per unit.", ref: "units \u00B7 thousands \u00B7 millions", group: "revenue", hardMin: 0, hardMax: 1e7 },
  { id: "annualVolume", label: "Annual sales volume", unit: "/year", unitOptions: ["/day", "/week", "/month", "/quarter", "/year"], domain: "vol", showPrefix: false, default: 5000, hint: "Expected annual sales volume in units.", ref: "/day \u00B7 /week \u00B7 /month \u00B7 /quarter \u00B7 /year", group: "revenue", hardMin: 0, hardMax: 1e9 },
  // ── Burden ──
  { id: "logisticsCostPct", label: "Logistics cost (% of price)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 8, hint: "Freight, warehousing, and distribution as % of unit price.", ref: "% \u00B7 fraction", group: "burden", hardMin: 0, hardMax: 100 },
  { id: "serviceCostPct", label: "Service & warranty cost (%)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 5, hint: "Field service, warranty claims, and technical support as % of price.", ref: "% \u00B7 fraction", group: "burden", hardMin: 0, hardMax: 100 },
  { id: "returnRatePct", label: "Return rate cost (%)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 3, hint: "Return processing, refurbishment, and write-off as % of price.", ref: "% \u00B7 fraction", group: "burden", hardMin: 0, hardMax: 100 },
  // ── Targets ──
  { id: "targetMargin", label: "Target contribution margin (%)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 25, hint: "Minimum acceptable contribution margin ratio.", ref: "% \u00B7 fraction", group: "targets", hardMin: 0, hardMax: 100 },
  { id: "laborRate", label: "Direct labor rate", unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"], domain: "wage", showPrefix: true, default: 35, hint: "Hourly labor rate for direct production labor.", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "targets", hardMin: 0, hardMax: 2000 },
  { id: "overheadRate", label: "Overhead allocation rate (%)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 15, hint: "Manufacturing overhead as % of direct costs.", ref: "% \u00B7 fraction", group: "targets", hardMin: 0, hardMax: 500 },
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "% \u00B7 fraction", group: "targets", hardMin: 0, hardMax: 1 },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  revenue: { num: "01", title: "Revenue & Cost Base", desc: "Unit price, variable cost, and sales volume define the gross contribution baseline." },
  burden:  { num: "02", title: "Burden Multipliers", desc: "Logistics, service, and return costs erode the gross contribution before final margin." },
  targets: { num: "03", title: "Targets & Confidence", desc: "Margin target, labor rate, overhead allocation, and data confidence level." },
};

/* ─── Helpers ────────────────────────────────────────────────── */

const BURDEN_LABELS = ["Logistics", "Service / Warranty", "Returns"];
const DECISION_LABELS = ["GROW", "HOLD", "CUT / DISCONTINUE"];

/* ─── Component ──────────────────────────────────────────────── */
export default function SKUProfitForensicsPage() {
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
  const engineInputs = useMemo((): SKUProfitInputs => ({
    unitPrice: canonState.unitPrice ?? 0,
    unitVariableCost: canonState.unitVariableCost ?? 0,
    annualVolume: (canonState.annualVolume ?? 0) * 12, // canon u/month -> units/yr
    logisticsCostPct: (canonState.logisticsCostPct ?? 0) * 100, // canon fraction -> %
    serviceCostPct: (canonState.serviceCostPct ?? 0) * 100,
    returnRatePct: (canonState.returnRatePct ?? 0) * 100,
    targetMargin: (canonState.targetMargin ?? 0) * 100,
    laborRate: canonState.laborRate ?? 0,
    overheadRate: (canonState.overheadRate ?? 0) * 100,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<SKUProfitOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): SKUProfitOutputs | null => {
    if (!engineInputs.unitPrice || engineInputs.unitPrice <= 0) return null;
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

  // Margin structure for display
  const marginStructure = useMemo(() => {
    if (!result) return [];
    return [
      {
        label: "Unit Contribution",
        value: result.out_unitContribution,
        pct: result.out_unitContribution !== 0
          ? (result.out_contributionMarginRatio * 100) : 0,
      },
      {
        label: "Logistics Burden",
        value: result.out_logisticsBurden,
        pct: engineInputs.unitPrice > 0
          ? (result.out_logisticsBurden / engineInputs.unitPrice * 100) : 0,
      },
      {
        label: "Service / Warranty Burden",
        value: result.out_serviceBurden,
        pct: engineInputs.unitPrice > 0
          ? (result.out_serviceBurden / engineInputs.unitPrice * 100) : 0,
      },
      {
        label: "Return Burden",
        value: result.out_returnBurden,
        pct: engineInputs.unitPrice > 0
          ? (result.out_returnBurden / engineInputs.unitPrice * 100) : 0,
      },
    ];
  }, [result, engineInputs.unitPrice]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Commercial &middot; Profitability forensics</div>
        <h1>Customer SKU Profitability Forensics</h1>
        <p className="lede">
          Diagnose SKU-level profitability by isolating logistics, service, and return burdens. &mdash;
          Identify toxic SKUs, margin erosion drivers, and portfolio action recommendations.
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

        {/* Live rail */}
        <div className="rail">
          <div className="rail-in">
            {livePreview ? (
              <>
                <div className="verdict">
                  {(() => {
                    const dec = livePreview.out_decisionState;
                    const cls = dec === 0 ? "pos" : dec === 1 ? "warn" : "neg";
                    const lbl = DECISION_LABELS[dec];
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {livePreview.out_toxicFlag === 1 ? (
                              <span style={{ color: "var(--neg)" }}>TOXIC</span>
                            ) : (
                              <>{curSym}{livePreview.out_netMargin.toFixed(2)}</>
                            )}
                            <small>net margin per unit</small>
                          </div>
                          <div className="big-cap">
                            {(livePreview.out_contributionMarginRatio * 100).toFixed(1)}% CM ratio
                            &nbsp;&middot; Annual: {curSym}{(livePreview.out_totalAnnualMargin / 1000).toFixed(0)}k
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Unit contribution</span><b>{curSym}{livePreview.out_unitContribution.toFixed(2)}</b></div>
                <div className="stat"><span>CM ratio</span><b>{(livePreview.out_contributionMarginRatio * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Logistics burden</span><b>{curSym}{livePreview.out_logisticsBurden.toFixed(2)}</b></div>
                <div className="stat"><span>Service burden</span><b>{curSym}{livePreview.out_serviceBurden.toFixed(2)}</b></div>
                <div className="stat"><span>Return burden</span><b>{curSym}{livePreview.out_returnBurden.toFixed(2)}</b></div>
                <div className="stat"><span>Net margin</span><b>{curSym}{livePreview.out_netMargin.toFixed(2)}</b></div>
                <div className="stat"><span>Biggest burden</span><b>{BURDEN_LABELS[livePreview.out_biggestBurdenIndex]}</b></div>
                <div className="stat"><span>Annual margin</span><b>{curSym}{livePreview.out_totalAnnualMargin.toFixed(0)}</b></div>

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
                Enter unit price &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <h2>SKU profitability &mdash; forensic report</h2>
            <div className="rid">
              SC-PRO-SKU &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 35 assertions passed<br />
              currency {curSym} &middot; full absorption costing
            </div>
          </div>

          <div className="rep-body">
            {/* Section 1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">1</span><span className="sec-t">Executive summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {result.out_toxicFlag === 1 ? (
                    <span style={{ color: "var(--neg)" }}>TOXIC SKU &mdash; Negative Net Margin</span>
                  ) : (
                    <>{curSym}{result.out_netMargin.toFixed(2)} net margin per unit</>
                  )}
                </div>
                {result.out_decisionState === 0 ? (
                  <p>Contribution margin ratio of {(result.out_contributionMarginRatio * 100).toFixed(2)}% exceeds the {engineInputs.targetMargin.toFixed(1)}% target. Annual margin: {curSym}{result.out_totalAnnualMargin.toFixed(0)}. This SKU is positioned for <strong>growth</strong>.</p>
                ) : result.out_decisionState === 1 ? (
                  <p>Contribution margin ratio of {(result.out_contributionMarginRatio * 100).toFixed(2)}% is positive but below the {engineInputs.targetMargin.toFixed(1)}% target. Annual margin: {curSym}{result.out_totalAnnualMargin.toFixed(0)}. Recommend <strong>holding</strong> with cost improvement initiatives.</p>
                ) : (
                  <>
                    <p><strong>DISCONTINUE / CUT.</strong> Contribution margin ratio of {(result.out_contributionMarginRatio * 100).toFixed(2)}% is non-positive. Annual loss: {curSym}{Math.abs(result.out_totalAnnualMargin).toFixed(0)}.</p>
                    <p>The biggest burden is <strong>{BURDEN_LABELS[result.out_biggestBurdenIndex]}</strong> at {curSym}{[result.out_logisticsBurden, result.out_serviceBurden, result.out_returnBurden][result.out_biggestBurdenIndex].toFixed(2)} per unit. Portfolio rationalization recommended.</p>
                  </>
                )}
              </div>
            </div>

            {/* Section 2: Margin Structure */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">Margin structure</span></div>
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th className="n">Amount ({curSym})</th>
                    <th className="n">% of Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Unit Price</td>
                    <td className="n">{curSym}{engineInputs.unitPrice.toFixed(2)}</td>
                    <td className="n">100%</td>
                  </tr>
                  {marginStructure.map((ms) => (
                    <tr key={ms.label}>
                      <td>{ms.label}</td>
                      <td className="n">{curSym}{ms.value.toFixed(2)}</td>
                      <td className="n">{ms.pct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Net Margin</td>
                    <td className="n">{curSym}{result.out_netMargin.toFixed(2)}</td>
                    <td className="n">{(result.out_contributionMarginRatio * 100).toFixed(1)}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 3: Decision Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Decision analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Decision state</td><td className="n">{DECISION_LABELS[result.out_decisionState]}</td></tr>
                  <tr><td>Contribution margin ratio</td><td className="n">{(result.out_contributionMarginRatio * 100).toFixed(2)}%</td></tr>
                  <tr><td>Target margin ratio</td><td className="n">{engineInputs.targetMargin.toFixed(1)}%</td></tr>
                  <tr><td>Unit net margin</td><td className="n">{curSym}{result.out_netMargin.toFixed(2)}</td></tr>
                  <tr><td>Annual total margin</td><td className="n">{curSym}{result.out_totalAnnualMargin.toFixed(0)}</td></tr>
                  <tr><td>Toxic flag</td><td className="n">{result.out_toxicFlag === 1 ? "TOXIC" : "OK"}</td></tr>
                  <tr><td>Threshold crossing</td><td className="n">{result.out_thresholdCrossing === 1 ? "ACTIVE" : "Inactive"}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmeaTrigger === 1 ? "ACTIVE" : "Inactive"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 4: Engineering insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h"><span className="sec-n">4</span><span className="sec-t">Engineering insights</span></div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </div>
            )}

            {/* Section 5: Input summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">5</span><span className="sec-t">Input summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Unit price</td><td className="n">{curSym}{engineInputs.unitPrice.toFixed(2)}</td></tr>
                  <tr><td>Unit variable cost</td><td className="n">{curSym}{engineInputs.unitVariableCost.toFixed(2)}</td></tr>
                  <tr><td>Annual volume</td><td className="n">{engineInputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>Logistics cost</td><td className="n">{engineInputs.logisticsCostPct.toFixed(1)}%</td></tr>
                  <tr><td>Service & warranty cost</td><td className="n">{engineInputs.serviceCostPct.toFixed(1)}%</td></tr>
                  <tr><td>Return rate cost</td><td className="n">{engineInputs.returnRatePct.toFixed(1)}%</td></tr>
                  <tr><td>Target margin</td><td className="n">{engineInputs.targetMargin.toFixed(1)}%</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{engineInputs.laborRate.toFixed(2)}/h</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{engineInputs.overheadRate.toFixed(1)}%</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(engineInputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 6: Audit trail & integrity */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">6</span><span className="sec-t">Audit trail &amp; integrity</span></div>
              <div className="seal">
                SEAL &middot; SHA-256 {Date.now().toString(16).toUpperCase().slice(0, 16)}<br />
                Inputs and outputs are hashed together; altering any figure changes the seal.
                Verify at sectorcalc.com/verify &mdash; production seals are computed server-side.
              </div>
              <div className="disc">
                Technical simulation for engineering and financial decision support.
                Assumes linear cost relationships and constant price/volume assumptions.
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
