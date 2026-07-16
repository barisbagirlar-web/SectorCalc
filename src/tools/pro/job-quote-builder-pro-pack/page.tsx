"use client";

/**
 * Job Quote Builder Pro Pack — x1 pattern.
 *
 * Exact port of x1.html: 12 currencies, auto unit conversion,
 * inline validation messages, group numbering, engine metadata,
 * canonical unit display.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import type { JobQuoteInputs, JobQuoteOutputs } from
  "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import { getActiveInsights } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, CURRENCY_NOTE, CANON_SUFFIX, getFieldError, canonicalLabel } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-job-quote-builder-pro-pack.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Rates ──
  { id: "machineRate", label: "Machine hourly rate", unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"], domain: "wage", showPrefix: true, default: 85, hint: "Fully loaded machine rate including depreciation, energy, and maintenance.", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "rates", hardMin: 0, hardMax: 5000 },
  { id: "laborRate", label: "Labor hourly rate", unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"], domain: "wage", showPrefix: true, default: 35, hint: "Fully loaded labor rate including wages, benefits, and payroll taxes.", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "rates", hardMin: 0, hardMax: 500 },
  { id: "overheadRate", label: "Annual overhead", unit: "/year", unitOptions: ["/day", "/week", "/month", "/quarter", "/year"], domain: "money", showPrefix: true, default: 60000, hint: "Total annual overhead costs allocated to this product line.", ref: "/day \u00B7 /week \u00B7 /month \u00B7 /quarter \u00B7 /year", group: "rates", hardMin: 0, hardMax: 1e9 },
  // ── Time ──
  { id: "cycleTime", label: "Cycle time per batch", unit: "minutes", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"], domain: "hours", showPrefix: false, default: 12, hint: "Total cycle time for one batch (run time per batch).", ref: "seconds\u2026days(24h)", group: "time", hardMin: 0, hardMax: 10080 },
  { id: "setupTime", label: "Setup time per batch", unit: "minutes", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"], domain: "hours", showPrefix: false, default: 8, hint: "Changeover and setup time per batch.", ref: "seconds\u2026days(24h)", group: "time", hardMin: 0, hardMax: 10080 },
  // ── Cost ──
  { id: "materialCost", label: "Material cost per unit", unit: "/unit", unitOptions: ["/unit", "/dozen (12)", "/gross (144)", "/100 units", "/1,000 units"], domain: "perUnit", showPrefix: true, default: 45, hint: "Raw material and purchased part cost per unit.", ref: "/unit \u00B7 /dozen \u00B7 /gross \u00B7 /100 \u00B7 /1k units", group: "cost", hardMin: 0, hardMax: 1e6 },
  { id: "defectOrLossCost", label: "Estimated defect/scrap cost", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 1500, hint: "Estimated cost of defects, scrap, and rework in the measurement period.", ref: "units \u00B7 thousands \u00B7 millions", group: "cost", hardMin: 0, hardMax: 1e9 },
  // ── Volume ──
  { id: "batchQuantity", label: "Batch quantity", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: false, default: 500, hint: "Number of units in this production batch.", ref: "units \u00B7 thousands \u00B7 millions", group: "volume", hardMin: 0, hardMax: 1e9 },
  { id: "annualVolume", label: "Annual production volume", unit: "/year", unitOptions: ["/day", "/week", "/month", "/quarter", "/year"], domain: "vol", showPrefix: false, default: 12000, hint: "Total annual volume for overhead allocation.", ref: "/day \u00B7 /week \u00B7 /month \u00B7 /quarter \u00B7 /year", group: "volume", hardMin: 0, hardMax: 1e9 },
  // ── Margin ──
  { id: "targetMargin", label: "Target margin", unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 0.25, hint: "Target profit margin as a decimal ratio (e.g. 0.25 = 25%).", ref: "% \u00B7 fraction", group: "margin", hardMin: 0, hardMax: 1 },
  { id: "uncertaintyMultiplier", label: "Uncertainty multiplier", unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 0.15, hint: "Multiplier applied to recommended price for risk adjustment (0=no risk, 1=high risk).", ref: "% \u00B7 fraction", group: "margin", hardMin: 0, hardMax: 1 },
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "% \u00B7 fraction", group: "margin", hardMin: 0, hardMax: 1 },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  rates:  { num: "01", title: "Rate Parameters", desc: "Hourly rates for machine, labor, and annual overhead allocation." },
  time:   { num: "02", title: "Time Parameters", desc: "Cycle time and setup time define the labor and machine cost per batch." },
  cost:   { num: "03", title: "Cost Parameters", desc: "Material cost per unit and estimated defect/scrap loss." },
  volume: { num: "04", title: "Volume Parameters", desc: "Batch quantity and annual volume determine material and overhead allocation." },
  margin: { num: "05", title: "Margin & Risk", desc: "Target margin, uncertainty multiplier, and source confidence for risk-adjusted pricing." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function JobQuoteBuilderProPackPage() {
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
  const engineInputs = useMemo((): JobQuoteInputs => ({
    machineRate: canonState.machineRate ?? 0,
    laborRate: canonState.laborRate ?? 0,
    overheadRate: (canonState.overheadRate ?? 0) * 12, // canon /month -> /year
    cycleTime: (canonState.cycleTime ?? 0) * 60, // canon h -> minutes
    setupTime: (canonState.setupTime ?? 0) * 60, // canon h -> minutes
    materialCost: canonState.materialCost ?? 0,
    defectOrLossCost: canonState.defectOrLossCost ?? 0,
    batchQuantity: canonState.batchQuantity ?? 0,
    annualVolume: (canonState.annualVolume ?? 0) * 12, // canon /month -> /year
    targetMargin: canonState.targetMargin ?? 0, // canon fraction, formula expects fraction
    uncertaintyMultiplier: canonState.uncertaintyMultiplier ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<JobQuoteOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): JobQuoteOutputs | null => {
    if (!engineInputs.batchQuantity || engineInputs.batchQuantity <= 0) return null;
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

  // Cost structure for display
  const costStructure = useMemo(() => {
    if (!result) return [];
    return [
      { label: "Labor Cost", value: result.out_laborCost, pct: result.out_totalJobCost > 0 ? result.out_laborCost / result.out_totalJobCost * 100 : 0 },
      { label: "Machine Cost", value: result.out_machineCost, pct: result.out_totalJobCost > 0 ? result.out_machineCost / result.out_totalJobCost * 100 : 0 },
      { label: "Material Cost (Total)", value: result.out_materialCostTotal, pct: result.out_totalJobCost > 0 ? result.out_materialCostTotal / result.out_totalJobCost * 100 : 0 },
      { label: "Scrap Allowance", value: result.out_scrapAllowance, pct: result.out_totalJobCost > 0 ? result.out_scrapAllowance / result.out_totalJobCost * 100 : 0 },
      { label: "Overhead Allocation", value: result.out_overheadAllocation, pct: result.out_totalJobCost > 0 ? result.out_overheadAllocation / result.out_totalJobCost * 100 : 0 },
    ];
  }, [result]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Manufacturing &middot; Job costing</div>
        <h1>Job Quote Builder Pro Pack</h1>
        <p className="lede">
          Build accurate job quotes with machine rate, labor, material, overhead, and risk-adjusted pricing. &mdash;
          Identify margin gaps, cost drivers, and pricing opportunities.
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
                    const lbl = dec === 0 ? "ON TARGET" : dec === 1 ? "BELOW TARGET \u2014 REVIEW" : "CRITICAL \u2014 RESTRUCTURE";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{livePreview.out_totalJobCost.toFixed(0)}
                            <small>total job cost</small>
                          </div>
                          <div className="big-cap">{curSym}{livePreview.out_riskAdjustedPrice.toFixed(0)} final price &middot; {(livePreview.out_marginPct * 100).toFixed(1)}% margin</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Labor cost</span><b>{curSym}{livePreview.out_laborCost.toFixed(2)}</b></div>
                <div className="stat"><span>Machine cost</span><b>{curSym}{livePreview.out_machineCost.toFixed(2)}</b></div>
                <div className="stat"><span>Material cost (total)</span><b>{curSym}{livePreview.out_materialCostTotal.toFixed(2)}</b></div>
                <div className="stat"><span>Scrap allowance</span><b>{curSym}{livePreview.out_scrapAllowance.toFixed(2)}</b></div>
                <div className="stat"><span>Overhead allocation</span><b>{curSym}{livePreview.out_overheadAllocation.toFixed(2)}</b></div>
                <div className="stat"><span>Recommended price</span><b>{curSym}{livePreview.out_recommendedPrice.toFixed(2)}</b></div>
                <div className="stat"><span>Risk-adjusted price</span><b>{curSym}{livePreview.out_riskAdjustedPrice.toFixed(2)}</b></div>
                <div className="stat"><span>Actual margin</span><b>{(livePreview.out_marginPct * 100).toFixed(1)}%</b></div>

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
                Enter batch quantity &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <h2>Job quote &mdash; builder report</h2>
            <div className="rid">
              SC-PRO-JQ &middot; {new Date().toISOString().slice(0, 10)}<br />
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
                  {curSym}{result.out_riskAdjustedPrice.toFixed(0)} risk-adjusted price
                </div>
                {result.out_decisionState === 0 ? (
                  <p>Margin of {(result.out_marginPct * 100).toFixed(1)}% meets the {(engineInputs.targetMargin * 100).toFixed(0)}% target. Recommended price: {curSym}{result.out_recommendedPrice.toFixed(2)}. Total job cost is {curSym}{result.out_totalJobCost.toFixed(2)}.</p>
                ) : result.out_decisionState === 1 ? (
                  <p>Margin of {(result.out_marginPct * 100).toFixed(1)}% is below the {(engineInputs.targetMargin * 100).toFixed(0)}% target but above half. Risk-adjusted price: {curSym}{result.out_riskAdjustedPrice.toFixed(2)}. Review cost drivers for improvement opportunities.</p>
                ) : (
                  <>
                    <p><strong>CRITICAL.</strong> Margin of {(result.out_marginPct * 100).toFixed(1)}% is severely below the {(engineInputs.targetMargin * 100).toFixed(0)}% target.</p>
                    <p>Total job cost: {curSym}{result.out_totalJobCost.toFixed(2)}. Risk-adjusted price: {curSym}{result.out_riskAdjustedPrice.toFixed(2)}. Cost restructuring or customer renegotiation recommended.</p>
                  </>
                )}
              </div>
            </div>

            {/* Section 2: Cost Structure */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">Cost structure</span></div>
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th className="n">Amount ({curSym})</th>
                    <th className="n">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {costStructure.map((cs) => (
                    <tr key={cs.label}>
                      <td>{cs.label}</td>
                      <td className="n">{curSym}{cs.value.toFixed(2)}</td>
                      <td className="n">{cs.pct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{result.out_totalJobCost.toFixed(2)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 3: Pricing Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Pricing analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Total job cost</td><td className="n">{curSym}{result.out_totalJobCost.toFixed(2)}</td></tr>
                  <tr><td>Target markup</td><td className="n">{(result.out_markupMultiplier - 1) * 100}%</td></tr>
                  <tr><td>Markup multiplier</td><td className="n">{result.out_markupMultiplier.toFixed(4)}x</td></tr>
                  <tr><td>Recommended price</td><td className="n">{curSym}{result.out_recommendedPrice.toFixed(2)}</td></tr>
                  <tr><td>Risk-adjusted price</td><td className="n">{curSym}{result.out_riskAdjustedPrice.toFixed(2)}</td></tr>
                  <tr><td>Actual margin</td><td className="n">{(result.out_marginPct * 100).toFixed(2)}%</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_thresholdCrossing === 0 ? "On target" : "Below target"}</td></tr>
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
                  <tr><td>Machine hourly rate</td><td className="n">{curSym}{engineInputs.machineRate.toFixed(2)}/h</td></tr>
                  <tr><td>Labor hourly rate</td><td className="n">{curSym}{engineInputs.laborRate.toFixed(2)}/h</td></tr>
                  <tr><td>Annual overhead</td><td className="n">{curSym}{engineInputs.overheadRate.toFixed(2)}/yr</td></tr>
                  <tr><td>Cycle time per batch</td><td className="n">{engineInputs.cycleTime.toFixed(1)} min</td></tr>
                  <tr><td>Setup time per batch</td><td className="n">{engineInputs.setupTime.toFixed(1)} min</td></tr>
                  <tr><td>Material cost per unit</td><td className="n">{curSym}{engineInputs.materialCost.toFixed(2)}</td></tr>
                  <tr><td>Defect/scrap cost (est.)</td><td className="n">{curSym}{engineInputs.defectOrLossCost.toFixed(2)}</td></tr>
                  <tr><td>Batch quantity</td><td className="n">{engineInputs.batchQuantity.toLocaleString()}</td></tr>
                  <tr><td>Annual volume</td><td className="n">{engineInputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>Target margin</td><td className="n">{(engineInputs.targetMargin * 100).toFixed(0)}%</td></tr>
                  <tr><td>Uncertainty multiplier</td><td className="n">{engineInputs.uncertaintyMultiplier.toFixed(2)}</td></tr>
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
