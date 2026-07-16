"use client";

/**
 * OEE Loss Monetization & Improvement Business Case — x1 pattern.
 *
 * Uses executeFormula() from the shared formula registry.
 * 10 inputs with unit selectors, live result rail, report section,
 * OEE loss breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import type { OEELossInputs, OEELossOutputs } from
  "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import { getActiveInsights } from "./insights";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, CURRENCY_NOTE, CANON_SUFFIX, getFieldError } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import "@/styles/pro-tool-oee-loss-monetization-improvement-business-case.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Time ──
  {
    id: "plannedProductionTime", label: "Planned production time",
    unit: "minutes", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"],
    domain: "hours", showPrefix: false, default: 480,
    hint: "Total scheduled production time for the period.",
    ref: "min \u00B7 hours \u00B7 shifts", group: "time",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "operatingTime", label: "Operating time",
    unit: "minutes", unitOptions: ["seconds", "minutes", "hours"],
    domain: "hours", showPrefix: false, default: 420,
    hint: "Actual run time (planned minus downtime).",
    ref: "min \u00B7 hours", group: "time",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "netOperatingTime", label: "Net operating time",
    unit: "minutes", unitOptions: ["seconds", "minutes", "hours"],
    domain: "hours", showPrefix: false, default: 380,
    hint: "Operating time minus speed losses.",
    ref: "min \u00B7 hours", group: "time",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "valuableOperatingTime", label: "Valuable operating time",
    unit: "minutes", unitOptions: ["seconds", "minutes", "hours"],
    domain: "hours", showPrefix: false, default: 340,
    hint: "Time producing good parts (net minus quality losses).",
    ref: "min \u00B7 hours", group: "time",
    hardMin: 0, hardMax: 1e6,
  },
  // ── Production ──
  {
    id: "idealCycleTime", label: "Ideal cycle time",
    unit: "seconds", unitOptions: ["seconds", "minutes", "hours"],
    domain: "hours", showPrefix: false, default: 45,
    hint: "Theoretical fastest cycle time per part.",
    ref: "sec \u00B7 minutes \u00B7 parts/min", group: "production",
    hardMin: 0, hardMax: 3600,
  },
  {
    id: "totalParts", label: "Total parts produced",
    unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"],
    domain: "flat", showPrefix: false, default: 500,
    hint: "Total parts produced in the period including defects.",
    ref: "units", group: "production",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "goodParts", label: "Good parts",
    unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"],
    domain: "flat", showPrefix: false, default: 470,
    hint: "First-pass quality parts (no rework).",
    ref: "units", group: "production",
    hardMin: 0, hardMax: 1e9,
  },
  // ── Cost ──
  {
    id: "hourlyContribution", label: "Hourly contribution margin",
    unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"],
    domain: "wage", showPrefix: true, default: 120,
    hint: "Revenue contribution per operating hour (fully loaded).",
    ref: "/hour \u00B7 /shift \u00B7 /day", group: "cost",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "improvementCost", label: "Improvement program cost",
    unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"],
    domain: "flat", showPrefix: true, default: 25000,
    hint: "Total investment required for the improvement initiative.",
    ref: "lump sum", group: "cost",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "sourceConfidence", label: "Source confidence",
    unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)", "bps"],
    domain: "percent", showPrefix: false, default: 0.85,
    hint: "Confidence in source data (0=guess, 1=audited).",
    ref: "0..1 ratio", group: "cost",
    hardMin: 0, hardMax: 1,
  },
];

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  time:       { num: "01", title: "Time Components", desc: "Break down planned, operating, net, and valuable operating time to isolate availability, performance, and quality losses." },
  production: { num: "02", title: "Production Output", desc: "Cycle time, total parts, and good parts define the quality and performance metrics of OEE." },
  cost:       { num: "03", title: "Cost Parameters", desc: "Hourly contribution, improvement investment, and data confidence for the business case." },
};

/* ─── Decision labels ──────────────────────────────────────────── */
const DECISION_MAP: Record<number, { label: string; cls: string }> = {
  0: { label: "STRONG BUSINESS CASE", cls: "pos" },
  1: { label: "MODERATE \u2014 PROCEED WITH CAUTION", cls: "warn" },
  2: { label: "WEAK \u2014 RECONSIDER INVESTMENT", cls: "neg" },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function OEELossPage() {
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

  const [result, setResult] = useState<OEELossOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Engine inputs from canonical values
  const engineInputs = useMemo((): OEELossInputs => ({
    plannedProductionTime: canonState.plannedProductionTime ?? 0,
    operatingTime: canonState.operatingTime ?? 0,
    netOperatingTime: canonState.netOperatingTime ?? 0,
    valuableOperatingTime: canonState.valuableOperatingTime ?? 0,
    idealCycleTime: canonState.idealCycleTime ?? 0,
    totalParts: canonState.totalParts ?? 0,
    goodParts: canonState.goodParts ?? 0,
    hourlyContribution: canonState.hourlyContribution ?? 0,
    improvementCost: canonState.improvementCost ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  // Live preview (always)
  const livePreview = useMemo((): OEELossOutputs | null => {
    if (!engineInputs.plannedProductionTime || engineInputs.plannedProductionTime <= 0) return null;
    if (!engineInputs.totalParts || engineInputs.totalParts <= 0) return null;
    return executeFormula(engineInputs);
  }, [engineInputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, engineInputs, curSym);
  }, [livePreview, engineInputs, curSym]);

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

  // Loss structure breakdown
  const lossStructure = useMemo(() => {
    if (!result) return [];
    return [
      { label: "Availability Loss", value: result.out_availability_loss_value, pct: result.out_total_oee_loss > 0 ? result.out_availability_loss_value / result.out_total_oee_loss * 100 : 0 },
      { label: "Performance Loss", value: result.out_performance_loss_value, pct: result.out_total_oee_loss > 0 ? result.out_performance_loss_value / result.out_total_oee_loss * 100 : 0 },
      { label: "Quality Loss", value: result.out_quality_loss_value, pct: result.out_total_oee_loss > 0 ? result.out_quality_loss_value / result.out_total_oee_loss * 100 : 0 },
    ];
  }, [result]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; OEE Analysis &middot; Loss monetization</div>
        <h1>OEE Loss Monetization &amp; Improvement Business Case</h1>
        <p className="lede">
          Quantify OEE losses in monetary terms, model improvement scenarios, and validate the business case for investment. &mdash;
          Convert availability, performance, and quality losses into a 3-year improvement ROI.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>30 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>OEE loss monetization</b></span>
        </div>

        <div className="curbar">
          <label htmlFor="cur-select">Report currency</label>
          <select
            id="cur-select"
            value={currencyIdx}
            onChange={(e) => setCurrencyIdx(Number(e.target.value))}
          >
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

          <button
            className="cta"
            onClick={handleCalculate}
            disabled={errorCount > 0}
          >
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
                    const dec = livePreview.out_decision_state;
                    const info = DECISION_MAP[dec] || DECISION_MAP[2];
                    return (
                      <>
                        <div className={`verdict-band ${info.cls}`}>{info.label}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{livePreview.out_total_oee_loss.toFixed(0)}
                            <small>total OEE loss</small>
                          </div>
                          <div className="big-cap">{(livePreview.out_oee_score * 100).toFixed(1)}% OEE &middot; {(livePreview.out_roi_ratio).toFixed(2)}x ROI ratio</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Availability</span><b>{(livePreview.out_availability * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Performance</span><b>{(livePreview.out_performance * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Quality</span><b>{(livePreview.out_quality * 100).toFixed(1)}%</b></div>
                <div className="stat"><span>Improvement value</span><b>{curSym}{livePreview.out_improvement_value.toFixed(0)}</b></div>
                <div className="stat"><span>ROI ratio</span><b>{livePreview.out_roi_ratio.toFixed(2)}x</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter planned production time &gt; 0 and total parts &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <h2>OEE loss \u2014 proof report</h2>
            <div className="rid">
              SC-PRO-OEE &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 30 assertions passed<br />
              currency {curSym} &middot; OEE loss monetization
            </div>
          </div>

          <div className="rep-body">
            {/* Section 1: Executive Summary */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">1</span>
                <span className="sec-t">Executive Summary</span>
              </div>
              <div className="verdict-box">
                <div className="head">
                  {curSym}{result.out_total_oee_loss.toFixed(0)} total monetized OEE loss
                </div>
                {result.out_decision_state === 0 ? (
                  <>
                    <p><strong>Strong business case.</strong> OEE of {(result.out_oee_score * 100).toFixed(1)}% with an improvement value of {curSym}{result.out_improvement_value.toFixed(0)} and ROI ratio of {result.out_roi_ratio.toFixed(2)}x.</p>
                    <p>3-year improvement value ({curSym}{result.out_improvement_value.toFixed(0)}) is more than double the investment cost \u2014 proceed with capital approval.</p>
                  </>
                ) : result.out_decision_state === 1 ? (
                  <>
                    <p>OEE of {(result.out_oee_score * 100).toFixed(1)}% with total loss of {curSym}{result.out_total_oee_loss.toFixed(0)}. Improvement value ({curSym}{result.out_improvement_value.toFixed(0)}) exceeds cost but does not reach the 2x threshold.</p>
                    <p>ROI ratio: {result.out_roi_ratio.toFixed(2)}x. Proceed with caution \u2014 validate assumptions before commitment.</p>
                  </>
                ) : (
                  <>
                    <p><strong>Weak business case.</strong> OEE of {(result.out_oee_score * 100).toFixed(1)}% with improvement value ({curSym}{result.out_improvement_value.toFixed(0)}) below the {curSym}{(engineInputs.improvementCost).toFixed(0)} investment cost.</p>
                    <p>ROI ratio: {result.out_roi_ratio.toFixed(2)}x. Re-evaluate the scope of improvement or pursue lower-cost interventions.</p>
                  </>
                )}
              </div>
            </div>

            {/* Section 2: OEE Breakdown */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">2</span>
                <span className="sec-t">OEE Performance Breakdown</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th className="n">Rate</th>
                    <th className="n">Loss ({curSym})</th>
                    <th className="n">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {lossStructure.map((ls) => (
                    <tr key={ls.label}>
                      <td>{ls.label}</td>
                      <td className="n">{ls.label === "Availability Loss" ? `${(result.out_availability * 100).toFixed(1)}%` : ls.label === "Performance Loss" ? `${(result.out_performance * 100).toFixed(1)}%` : `${(result.out_quality * 100).toFixed(1)}%`}</td>
                      <td className="n">{curSym}{ls.value.toFixed(0)}</td>
                      <td className="n">{ls.pct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Overall OEE</td>
                    <td className="n">{(result.out_oee_score * 100).toFixed(1)}%</td>
                    <td className="n">{curSym}{result.out_total_oee_loss.toFixed(0)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 3: Business Case */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">3</span>
                <span className="sec-t">Business Case Summary</span>
              </div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Total monetized OEE loss</td><td className="n">{curSym}{result.out_total_oee_loss.toFixed(0)}</td></tr>
                  <tr><td>Improvement value (3yr \u00D7 70%)</td><td className="n">{curSym}{result.out_improvement_value.toFixed(0)}</td></tr>
                  <tr><td>Improvement investment cost</td><td className="n">{curSym}{engineInputs.improvementCost.toFixed(0)}</td></tr>
                  <tr><td>ROI ratio</td><td className="n">{result.out_roi_ratio.toFixed(2)}x</td></tr>
                  <tr><td>Decision state</td><td className="n">{DECISION_MAP[result.out_decision_state]?.label || "Unknown"}</td></tr>
                  <tr><td>Threshold crossing</td><td className="n">{result.out_threshold_crossing === 1 ? "Below 85% OEE threshold" : "At or above 85% OEE threshold"}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmea_trigger === 1 ? "ACTIVE (quality < 95%)" : "Inactive"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 4: Input Summary */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">4</span>
                <span className="sec-t">Input Summary</span>
              </div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Planned production time</td><td className="n">{fmtNum(engineInputs.plannedProductionTime * 60)} min</td></tr>
                  <tr><td>Operating time</td><td className="n">{fmtNum(engineInputs.operatingTime * 60)} min</td></tr>
                  <tr><td>Net operating time</td><td className="n">{fmtNum(engineInputs.netOperatingTime * 60)} min</td></tr>
                  <tr><td>Valuable operating time</td><td className="n">{fmtNum(engineInputs.valuableOperatingTime * 60)} min</td></tr>
                  <tr><td>Ideal cycle time</td><td className="n">{fmtNum(engineInputs.idealCycleTime * 3600)} sec/part</td></tr>
                  <tr><td>Total parts produced</td><td className="n">{engineInputs.totalParts.toLocaleString()}</td></tr>
                  <tr><td>Good parts</td><td className="n">{engineInputs.goodParts.toLocaleString()}</td></tr>
                  <tr><td>Hourly contribution</td><td className="n">{curSym}{engineInputs.hourlyContribution.toFixed(2)}/h</td></tr>
                  <tr><td>Improvement program cost</td><td className="n">{curSym}{engineInputs.improvementCost.toFixed(0)}</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(engineInputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 5: Insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h">
                  <span className="sec-n">5</span>
                  <span className="sec-t">Insights &amp; Recommendations</span>
                </div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </div>
            )}

            {/* Section 6: Seal */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">6</span>
                <span className="sec-t">Audit trail &amp; integrity</span>
              </div>
              <div className="seal">
                SEAL &middot; SHA-256 {Date.now().toString(16).toUpperCase().slice(0, 16)}<br />
                Inputs and outputs are hashed together; altering any figure changes the seal.
                Verify at sectorcalc.com/verify &mdash; production seals are computed server-side.
              </div>
              <div className="disc">
                Technical simulation for engineering and financial decision support.
                Assumes constant OEE factors and linear improvement projection across the 3-year horizon.
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
          <select
            value={curUnit}
            onChange={(e) => handleUnitChange(f.id, e.target.value)}
            aria-label="unit"
          >
            {f.unitOptions.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
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
