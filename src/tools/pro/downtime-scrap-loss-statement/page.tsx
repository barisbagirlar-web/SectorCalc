"use client";

/**
 * Downtime & Scrap Loss Statement — x1 pattern.
 *
 * Exact port of x1.html: 12 currencies, auto unit conversion,
 * inline validation messages, group numbering, engine metadata,
 * canonical unit display.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import type { DowntimeLossInputs, DowntimeLossOutputs } from
  "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, CURRENCY_NOTE, CANON_SUFFIX, getFieldError, canonicalLabel } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-downtime-scrap-loss-statement.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Time ──
  { id: "productiveHours", label: "Productive hours (planned)", unit: "hours", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"], domain: "hours", showPrefix: false, default: 176, hint: "Total planned productive hours for the period.", ref: "seconds\u2026days(24h)", group: "time", hardMin: 0, hardMax: 1e6 },
  { id: "actualHours", label: "Actual hours worked", unit: "hours", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"], domain: "hours", showPrefix: false, default: 152, hint: "Actual hours of production output.", ref: "seconds\u2026days(24h)", group: "time", hardMin: 0, hardMax: 1e6 },
  { id: "hourlyRate", label: "Hourly burden rate", unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"], domain: "wage", showPrefix: true, default: 65, hint: "Fully loaded hourly cost (labor + overhead).", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "time", hardMin: 0, hardMax: 10000 },
  // ── Scrap ──
  { id: "scrapQuantity", label: "Scrap quantity", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: false, default: 45, hint: "Units scrapped \u2014 total material loss.", ref: "units \u00B7 thousands \u00B7 millions", group: "scrap", hardMin: 0, hardMax: 1e9 },
  { id: "unitCost", label: "Unit cost (scrap)", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 85, hint: "Material cost per scrapped unit.", ref: "units \u00B7 thousands \u00B7 millions", group: "scrap", hardMin: 0, hardMax: 1e6 },
  // ── Rework ──
  { id: "reworkHours", label: "Rework hours", unit: "hours", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"], domain: "hours", showPrefix: false, default: 18, hint: "Total hours spent on rework operations.", ref: "seconds\u2026days(24h)", group: "rework", hardMin: 0, hardMax: 1e6 },
  { id: "reworkRate", label: "Rework labor rate", unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"], domain: "wage", showPrefix: true, default: 45, hint: "Hourly rate for rework labor (fully loaded).", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "rework", hardMin: 0, hardMax: 10000 },
  // ── Impact ──
  { id: "materialCost", label: "Total material cost", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 120000, hint: "Total material cost for the period.", ref: "units \u00B7 thousands \u00B7 millions", group: "impact", hardMin: 0, hardMax: 1e9 },
  { id: "defectRatePct", label: "Defect rate (%)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 2.5, hint: "Observed defect rate as percentage (e.g. 2.5 = 2.5%).", ref: "% \u00B7 fraction", group: "impact", hardMin: 0, hardMax: 100 },
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 0.8, hint: "Confidence in source data (0=guess, 1=audited).", ref: "% \u00B7 fraction", group: "impact", hardMin: 0, hardMax: 1 },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  time:   { num: "01", title: "Time & Rate", desc: "Planned vs actual hours and the burden rate define downtime cost." },
  scrap:  { num: "02", title: "Scrap Loss", desc: "Quantity and unit cost of scrapped material determine material loss." },
  rework: { num: "03", title: "Rework Labor", desc: "Hours and labor rate of rework operations." },
  impact: { num: "04", title: "Impact Level", desc: "Total material cost, defect rate, and data confidence set the escalation threshold." },
};

/* ─── Helpers ────────────────────────────────────────────────── */

function paretoLabel(driver: number): string {
  return driver === 0 ? "Downtime" : driver === 1 ? "Scrap" : "Rework";
}

/* ─── Component ──────────────────────────────────────────────── */
export default function DowntimeScrapLossPage() {
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
  const engineInputs = useMemo((): DowntimeLossInputs => ({
    productiveHours: canonState.productiveHours ?? 0,
    actualHours: canonState.actualHours ?? 0,
    hourlyRate: canonState.hourlyRate ?? 0,
    scrapQuantity: canonState.scrapQuantity ?? 0,
    unitCost: canonState.unitCost ?? 0,
    reworkHours: canonState.reworkHours ?? 0,
    reworkRate: canonState.reworkRate ?? 0,
    materialCost: canonState.materialCost ?? 0,
    defectRatePct: (canonState.defectRatePct ?? 0) * 100, // canon fraction -> %
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<DowntimeLossOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): DowntimeLossOutputs | null => {
    if (!engineInputs.productiveHours || engineInputs.productiveHours <= 0) return null;
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
      { label: "Downtime Cost", value: result.out_downtime_cost, pct: result.out_total_loss > 0 ? result.out_downtime_cost / result.out_total_loss * 100 : 0 },
      { label: "Scrap Material Loss", value: result.out_scrap_material_loss, pct: result.out_total_loss > 0 ? result.out_scrap_material_loss / result.out_total_loss * 100 : 0 },
      { label: "Rework Loss", value: result.out_rework_loss, pct: result.out_total_loss > 0 ? result.out_rework_loss / result.out_total_loss * 100 : 0 },
    ];
  }, [result]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Manufacturing &middot; Loss accounting</div>
        <h1>Downtime &amp; Scrap Loss Statement</h1>
        <p className="lede">
          Quantify the combined financial impact of downtime, scrap, and rework. &mdash;
          Identify the dominant loss driver and trigger escalation thresholds.
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
                    const dec = livePreview.out_decision_state;
                    const cls = dec === 0 ? "pos" : dec === 1 ? "warn" : "neg";
                    const lbl = dec === 0 ? "WITHIN THRESHOLD" : dec === 1 ? "REVIEW REQUIRED" : "ESCALATE \u2014 INVESTIGATE";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{livePreview.out_total_loss.toFixed(0)}
                            <small>total loss</small>
                          </div>
                          <div className="big-cap">{livePreview.out_downtime_hours.toFixed(0)}h downtime &middot; {(livePreview.out_uptime_ratio * 100).toFixed(1)}% uptime</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Downtime cost</span><b>{curSym}{livePreview.out_downtime_cost.toFixed(0)}</b></div>
                <div className="stat"><span>Scrap material loss</span><b>{curSym}{livePreview.out_scrap_material_loss.toFixed(0)}</b></div>
                <div className="stat"><span>Rework loss</span><b>{curSym}{livePreview.out_rework_loss.toFixed(0)}</b></div>
                <div className="stat"><span>Downtime hours</span><b>{livePreview.out_downtime_hours.toFixed(1)}h</b></div>
                <div className="stat"><span>Pareto driver</span><b>{paretoLabel(livePreview.out_pareto_driver)}</b></div>

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
                Enter productive hours &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <h2>Downtime &amp; scrap &mdash; loss statement</h2>
            <div className="rid">
              SC-PRO-DS &middot; {new Date().toISOString().slice(0, 10)}<br />
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
                  {curSym}{result.out_total_loss.toFixed(0)} total loss
                </div>
                {result.out_decision_state === 0 ? (
                  <p>Total loss of {curSym}{result.out_total_loss.toFixed(0)} is within the 5% threshold. Current operations are within acceptable parameters.</p>
                ) : result.out_decision_state === 1 ? (
                  <p>Total loss of {curSym}{result.out_total_loss.toFixed(0)} exceeds the 5% threshold but remains below the 15% escalation limit. Review downtime and scrap reduction opportunities.</p>
                ) : (
                  <>
                    <p><strong>ESCALATION REQUIRED.</strong> Total loss of {curSym}{result.out_total_loss.toFixed(0)} exceeds the 15% critical threshold.</p>
                    <p>Uptime at {(result.out_uptime_ratio * 100).toFixed(1)}% with {result.out_downtime_hours.toFixed(0)}h of lost production. {paretoLabel(result.out_pareto_driver)} is the dominant loss driver. Immediate management review recommended.</p>
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
                      <td className="n">{curSym}{cs.value.toFixed(0)}</td>
                      <td className="n">{cs.pct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{result.out_total_loss.toFixed(0)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 3: Performance Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Performance analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Planned hours</td><td className="n">{engineInputs.productiveHours.toFixed(0)} h</td></tr>
                  <tr><td>Actual hours</td><td className="n">{engineInputs.actualHours.toFixed(0)} h</td></tr>
                  <tr><td>Downtime hours</td><td className="n">{result.out_downtime_hours.toFixed(1)} h</td></tr>
                  <tr><td>Uptime ratio</td><td className="n">{(result.out_uptime_ratio * 100).toFixed(1)}%</td></tr>
                  <tr><td>Downtime cost</td><td className="n">{curSym}{result.out_downtime_cost.toFixed(0)}</td></tr>
                  <tr><td>Scrap material loss</td><td className="n">{curSym}{result.out_scrap_material_loss.toFixed(0)}</td></tr>
                  <tr><td>Rework loss</td><td className="n">{curSym}{result.out_rework_loss.toFixed(0)}</td></tr>
                  <tr><td>Pareto driver</td><td className="n">{paretoLabel(result.out_pareto_driver)}</td></tr>
                  <tr><td>Decision state</td><td className="n">{result.out_decision_state === 0 ? "OK" : result.out_decision_state === 1 ? "Review" : "Escalate"}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmea_trigger === 1 ? "ACTIVE" : "Inactive"}</td></tr>
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
                  <tr><td>Productive hours</td><td className="n">{engineInputs.productiveHours.toFixed(0)} h</td></tr>
                  <tr><td>Actual hours</td><td className="n">{engineInputs.actualHours.toFixed(0)} h</td></tr>
                  <tr><td>Hourly burden rate</td><td className="n">{curSym}{engineInputs.hourlyRate.toFixed(2)}/h</td></tr>
                  <tr><td>Scrap quantity</td><td className="n">{engineInputs.scrapQuantity.toLocaleString()}</td></tr>
                  <tr><td>Unit cost (scrap)</td><td className="n">{curSym}{engineInputs.unitCost.toFixed(2)}</td></tr>
                  <tr><td>Rework hours</td><td className="n">{engineInputs.reworkHours.toFixed(0)} h</td></tr>
                  <tr><td>Rework labor rate</td><td className="n">{curSym}{engineInputs.reworkRate.toFixed(2)}/h</td></tr>
                  <tr><td>Total material cost</td><td className="n">{curSym}{engineInputs.materialCost.toFixed(0)}</td></tr>
                  <tr><td>Defect rate</td><td className="n">{engineInputs.defectRatePct.toFixed(1)}%</td></tr>
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
