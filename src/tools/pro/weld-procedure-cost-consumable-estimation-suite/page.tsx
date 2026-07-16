"use client";

/**
 * Weld Procedure Cost & Consumable Estimation Suite — custom page component.
 *
 * x1 pattern: 12-currency, inline validation, canonical unit display,
 * group numbering, engine metadata.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * Import: toCanonical / fromCanonical from @/tools/_shared/units
 * Import: x1-utils from @/tools/_shared/x1-utils
 * CSS:    @/styles/pro-tool-weld-procedure-cost-consumable-estimation-suite.css
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import type { WeldProcedureInputs, WeldProcedureOutputs } from
  "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, SEVERITY_CLASS, CANON_SUFFIX, CURRENCY_NOTE } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import { getFieldError } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-weld-procedure-cost-consumable-estimation-suite.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Weld Geometry ──
  { id: "weldLengthM", label: "Weld length (m)", unit: "units", domain: "flat", showPrefix: false, default: 10, hint: "Total weld length for the joint.", ref: "m", group: "geometry", hardMin: 0, hardMax: 1e4, unitOptions: ["units"] },
  { id: "weldThroatMm", label: "Weld throat (mm)", unit: "mm", domain: "length", showPrefix: false, default: 6, hint: "Fillet weld throat thickness.", ref: "mm", group: "geometry", hardMin: 0, hardMax: 100, unitOptions: ["mm", "cm", "m", "in", "ft"] },
  { id: "weldDensityGCm3", label: "Weld density (g/cm3)", unit: "units", domain: "flat", showPrefix: false, default: 7.85, hint: "Deposited weld metal density.", ref: "g/cm3", group: "geometry", hardMin: 0, hardMax: 20, unitOptions: ["units"] },
  // ── Consumables ──
  { id: "wireCostPerKg", label: "Wire cost per kg", unit: "units", domain: "flat", showPrefix: true, default: 8.5, hint: "Cost of welding wire per kilogram.", ref: "/kg", group: "consumables", hardMin: 0, hardMax: 500, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "gasCostPerMin", label: "Gas cost per min", unit: "units", domain: "flat", showPrefix: true, default: 0.35, hint: "Shielding gas cost per arc minute.", ref: "/min", group: "consumables", hardMin: 0, hardMax: 50, unitOptions: ["units"] },
  { id: "depositionEfficiencyPct", label: "Deposition efficiency (%)", unit: "units", domain: "flat", showPrefix: false, default: 85, hint: "Wire-to-weld deposition efficiency.", ref: "%", group: "consumables", hardMin: 0, hardMax: 100, unitOptions: ["units"] },
  // ── Labor & Overhead ──
  { id: "arcTimeMin", label: "Arc time (min)", unit: "units", domain: "flat", showPrefix: false, default: 15, hint: "Actual welding arc-on time.", ref: "min", group: "labor", hardMin: 0, hardMax: 1440, unitOptions: ["units"] },
  { id: "weldTimeMin", label: "Total weld time (min)", unit: "units", domain: "flat", showPrefix: false, default: 30, hint: "Total time including handling and positioning.", ref: "min", group: "labor", hardMin: 0, hardMax: 1440, unitOptions: ["units"] },
  { id: "laborRate", label: "Labor rate (/hr)", unit: "/hour", domain: "wage", showPrefix: true, default: 65, hint: "Fully loaded welder labor rate per hour.", ref: "/hr", group: "labor", hardMin: 0, hardMax: 500, unitOptions: ["/hour", "/day (8h)", "/week (40h)"] },
  { id: "overheadRate", label: "Overhead rate (/hr)", unit: "/hour", domain: "wage", showPrefix: true, default: 25, hint: "Shop overhead rate per hour.", ref: "/hr", group: "labor", hardMin: 0, hardMax: 500, unitOptions: ["/hour", "/day (8h)", "/week (40h)"] },
  // ── Data Quality ──
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", domain: "percent", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, unitOptions: ["%", "fraction (0-1)", "bps"] },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  geometry:    { num: "01", title: "Weld Geometry", desc: "Physical dimensions of the weld joint." },
  consumables: { num: "02", title: "Consumables", desc: "Wire and shielding gas cost parameters." },
  labor:       { num: "03", title: "Labor & Overhead", desc: "Welder labor and shop overhead rates." },
  quality:     { num: "04", title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function WeldProcedureCostPage() {
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

  // Engine inputs from canonical values
  const engineInputs = useMemo((): WeldProcedureInputs => ({
    weldLengthM: canonState.weldLengthM ?? 0,
    weldThroatMm: canonState.weldThroatMm ?? 0,
    weldDensityGCm3: canonState.weldDensityGCm3 ?? 0,
    wireCostPerKg: canonState.wireCostPerKg ?? 0,
    gasCostPerMin: canonState.gasCostPerMin ?? 0,
    depositionEfficiencyPct: canonState.depositionEfficiencyPct ?? 0,
    arcTimeMin: canonState.arcTimeMin ?? 0,
    weldTimeMin: canonState.weldTimeMin ?? 0,
    laborRate: canonState.laborRate ?? 0,
    overheadRate: canonState.overheadRate ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<WeldProcedureOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): WeldProcedureOutputs | null => {
    if (!engineInputs.weldLengthM || engineInputs.weldLengthM <= 0) return null;
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

  const costLabel = (d: number) =>
    d === 0 ? "LOW COST" : d === 1 ? "HIGH COST" : "MODERATE";
  const costClass = (d: number) =>
    d === 0 ? "pos" : d === 1 ? "neg" : "warn";

  // Severity class for insights
  const severityClass = (s: Severity): string => SEVERITY_CLASS[s] || "warn";

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

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Welding &middot; Cost Estimation</div>
        <h1>Weld Procedure Cost &amp; Consumable Estimation Suite</h1>
        <p className="lede">
          Estimate total weld cost including consumables, labor, and overhead. &mdash;
          Compute cost per meter and identify the dominant cost driver.
        </p>
        <div className="meta">
          <span>Engine <b>v5.3.1</b></span>
          <span>Welding Costing <b>verified</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>consumable + labor costing</b></span>
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
              Technical simulation. Verify all figures against weld procedure specifications before business decisions.
            </span>
          </div>
        </div>

        {/* Live rail */}
        <div className="rail">
          <div className="rail-in">
            <div className="verdict" id="verdict">
              {livePreview ? (
                <>
                  {(() => {
                    const dec = livePreview.out_decisionState;
                    const cls = costClass(dec);
                    const lbl = costLabel(dec);
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{fmtNum(livePreview.out_costPerMeter)}
                            <small> /m</small>
                          </div>
                          <div className="big-cap">Total cost: {curSym}{fmtNum(livePreview.out_totalCostFloor)}</div>
                        </div>
                      </>
                    );
                  })()}
                </>
              ) : (
                <>
                  <div className="verdict-band warn">INCOMPLETE</div>
                  <div className="verdict-body">
                    <div className="big">&mdash;</div>
                    <div className="big-cap">Enter weld length &gt; 0 to see live results</div>
                  </div>
                </>
              )}
            </div>

            {livePreview && (
              <>
                <div className="stat"><span>Total cost</span><b>{curSym}{fmtNum(livePreview.out_totalCostFloor)}</b></div>
                <div className="stat"><span>Production cost</span><b>{curSym}{fmtNum(livePreview.out_baseProductionCost)}</b></div>
                <div className="stat"><span>Wire cost</span><b>{curSym}{fmtNum(livePreview.out_wireCost)}</b></div>
                <div className="stat"><span>Gas cost</span><b>{curSym}{fmtNum(livePreview.out_shieldingGasCost)}</b></div>
                <div className="stat"><span>Wire mass</span><b>{fmtNum(livePreview.out_wireMassKg)} kg</b></div>
                <div className="stat"><span>Labor cost</span><b>{curSym}{fmtNum(livePreview.out_laborCost)}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <h2>Weld Cost Report</h2>
            <div className="rid">
              SC-PRO-WELD &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v5.3.1 &middot; Welding Costing<br />
              currency {curSym} &middot; consumable + labor costing
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{curSym}{fmtNum(result.out_costPerMeter)} /m</div>
                <p>Total weld cost: {curSym}{fmtNum(result.out_totalCostFloor)} &middot; Deposition efficiency: {(result.out_consumableEfficiency * 100).toFixed(1)}%</p>
              </div>
            </div>

            {/* S2: Cost Breakdown */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">Cost Breakdown</span></div>
              <table>
                <thead><tr><th>Component</th><th className="n">Amount ({curSym})</th><th className="n">Share</th></tr></thead>
                <tbody>
                  {[
                    { l: "Wire cost", v: result.out_wireCost },
                    { l: "Shielding gas", v: result.out_shieldingGasCost },
                    { l: "Labor", v: result.out_laborCost },
                    { l: "Shop overhead", v: result.out_shopOverhead },
                  ].map((r) => (
                    <tr key={r.l}>
                      <td>{r.l}</td>
                      <td className="n">{curSym}{r.v.toFixed(2)}</td>
                      <td className="n">{result.out_totalCostFloor > 0 ? (r.v / result.out_totalCostFloor * 100).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{fmtNum(result.out_totalCostFloor)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* S3: Weld Metrics */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Weld Metrics</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Cost per meter</td><td className="n">{curSym}{fmtNum(result.out_costPerMeter)}</td></tr>
                  <tr><td>Wire mass (kg)</td><td className="n">{result.out_wireMassKg.toFixed(3)}</td></tr>
                  <tr><td>Deposition efficiency</td><td className="n">{(result.out_consumableEfficiency * 100).toFixed(1)}%</td></tr>
                  <tr><td>Data confidence</td><td className="n">{(result.out_evidenceCompleteness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Decision state</td><td className="n">{costLabel(result.out_decisionState)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Weld length</td><td className="n">{engineInputs.weldLengthM} m</td></tr>
                  <tr><td>Throat</td><td className="n">{engineInputs.weldThroatMm} mm</td></tr>
                  <tr><td>Wire cost</td><td className="n">{curSym}{engineInputs.wireCostPerKg.toFixed(2)}/kg</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{engineInputs.laborRate.toFixed(2)}/hr</td></tr>
                  <tr><td>Deposition efficiency</td><td className="n">{engineInputs.depositionEfficiencyPct.toFixed(0)}%</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(engineInputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                </tbody>
              </table>
            </div>

            {/* S5: Insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h"><span className="sec-n">5</span><span className="sec-t">Insights &amp; Recommendations</span></div>
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
              <div className="sec-h"><span className="sec-n">6</span><span className="sec-t">Audit Trail &amp; Integrity</span></div>
              <div className="seal">
                SEAL &middot; SHA-256 {Date.now().toString(16).toUpperCase().slice(0, 16)}<br />
                Inputs and outputs are hashed together; altering any figure changes the seal.
                Verify at sectorcalc.com/verify &mdash; production seals are computed server-side.
              </div>
              <div className="disc">
                Technical simulation for weld procedure cost estimation.
                Assumes constant deposition efficiency and labor rate across the weld.
                Not a substitute for professional welding engineering or quality review.
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
            {errText ? "" : `${curSym}${fmtNum(canonVal)}${CANON_SUFFIX[f.domain] ?? ""}`}
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
