"use client";

/**
 * Motor Compressor Replacement ROI — custom page component.
 *
 * x1 pattern: 12-currency, inline validation, canonical unit display,
 * group numbering, engine metadata.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * Import: toCanonical / fromCanonical from @/tools/_shared/units
 * Import: x1-utils from @/tools/_shared/x1-utils
 * CSS:    @/styles/pro-tool-motor-compressor-replacement-roi.css
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import type { MotorCompressorInputs, MotorCompressorOutputs } from
  "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, SEVERITY_CLASS, CANON_SUFFIX, CURRENCY_NOTE } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import { getFieldError } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-motor-compressor-replacement-roi.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Motor Parameters ──
  { id: "motorPowerKw", label: "Motor power (kW)", unit: "kW", domain: "power", showPrefix: false, default: 150, hint: "Rated mechanical power of the motor.", ref: "kW", group: "motor", hardMin: 0, hardMax: 1e6, unitOptions: ["W", "kW", "MW", "HP (mech)"] },
  { id: "annualOperatingHours", label: "Annual operating hours", unit: "hours", domain: "hours", showPrefix: false, default: 8000, hint: "Total running hours per year.", ref: "h/yr", group: "motor", hardMin: 0, hardMax: 8760, unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"] },
  { id: "currentEfficiencyPct", label: "Current efficiency (%)", unit: "units", domain: "flat", showPrefix: false, default: 88, hint: "Nameplate or measured efficiency of existing motor.", ref: "%", group: "motor", hardMin: 0, hardMax: 100, unitOptions: ["units"] },
  { id: "newEfficiencyPct", label: "New efficiency (%)", unit: "units", domain: "flat", showPrefix: false, default: 95, hint: "Nameplate efficiency of replacement motor (IE3/IE4).", ref: "%", group: "motor", hardMin: 0, hardMax: 100, unitOptions: ["units"] },
  // ── Energy Cost ──
  { id: "avgKwhRate", label: "Average kWh rate", unit: "/kWh", domain: "energyPrice", showPrefix: true, default: 0.12, hint: "Blended electricity rate including demand charges.", ref: "/kWh", group: "energy", hardMin: 0, hardMax: 10, unitOptions: ["/kWh", "/MWh"] },
  // ── Investment ──
  { id: "replacementCost", label: "Replacement cost", unit: "units", domain: "flat", showPrefix: true, default: 45000, hint: "Cost of new motor including procurement.", ref: "one-time", group: "investment", hardMin: 0, hardMax: 1e7, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "installationCost", label: "Installation cost", unit: "units", domain: "flat", showPrefix: true, default: 8500, hint: "Labor, rigging, and commissioning costs.", ref: "one-time", group: "investment", hardMin: 0, hardMax: 1e7, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  // ── Savings & Horizon ──
  { id: "maintenanceSavingPerYear", label: "Maintenance saving per year", unit: "units", domain: "flat", showPrefix: true, default: 3000, hint: "Estimated annual maintenance cost reduction.", ref: "/yr", group: "savings", hardMin: 0, hardMax: 1e7, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "equipmentLifeYears", label: "Equipment life (years)", unit: "years", domain: "years", showPrefix: false, default: 10, hint: "Expected useful life of the new motor.", ref: "yr", group: "savings", hardMin: 1, hardMax: 50, unitOptions: ["months", "quarters", "years"] },
  { id: "discountRate", label: "Discount rate", unit: "fraction (0-1)", domain: "percent", showPrefix: false, default: 0.08, hint: "WACC or required rate of return (e.g. 0.08 = 8%).", ref: "0..1", group: "savings", hardMin: 0, hardMax: 1, unitOptions: ["%", "fraction (0-1)", "bps"] },
  // ── Data Quality ──
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", domain: "percent", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, unitOptions: ["%", "fraction (0-1)", "bps"] },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  motor:      { num: "01", title: "Motor Parameters", desc: "Current and replacement motor specifications." },
  energy:     { num: "02", title: "Energy Cost", desc: "Electricity rate to compute energy costs." },
  investment: { num: "03", title: "Investment", desc: "One-time costs for the replacement project." },
  savings:    { num: "04", title: "Savings & Horizon", desc: "Maintenance savings, life, and discount rate." },
  quality:    { num: "05", title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function MotorCompressorReplacementRoiPage() {
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
  const engineInputs = useMemo((): MotorCompressorInputs => ({
    motorPowerKw: canonState.motorPowerKw ?? 0,
    annualOperatingHours: canonState.annualOperatingHours ?? 0,
    currentEfficiencyPct: canonState.currentEfficiencyPct ?? 0,
    newEfficiencyPct: canonState.newEfficiencyPct ?? 0,
    avgKwhRate: canonState.avgKwhRate ?? 0,
    replacementCost: canonState.replacementCost ?? 0,
    installationCost: canonState.installationCost ?? 0,
    maintenanceSavingPerYear: canonState.maintenanceSavingPerYear ?? 0,
    equipmentLifeYears: canonState.equipmentLifeYears ?? 0,
    discountRate: canonState.discountRate ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<MotorCompressorOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): MotorCompressorOutputs | null => {
    if (!engineInputs.motorPowerKw || engineInputs.motorPowerKw <= 0) return null;
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

  const decisionLabel = (d: number) =>
    d === 0 ? "PROCEED" : d === 1 ? "REVIEW" : "HOLD";
  const decisionClass = (d: number) =>
    d === 0 ? "pos" : d === 1 ? "warn" : "neg";

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
        <div className="kicker">SectorCalc PRO &middot; Energy Efficiency &middot; Motor Replacement</div>
        <h1>Motor Compressor Replacement ROI</h1>
        <p className="lede">
          Evaluate the financial viability of replacing an existing motor or compressor with a high-efficiency unit. &mdash;
          Compute payback period, NPV, ROI, and energy savings.
        </p>
        <div className="meta">
          <span>Engine <b>v5.3.1</b></span>
          <span>Energy Efficiency <b>verified</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>NPV + payback analysis</b></span>
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
              Technical simulation. Verify all figures against equipment specs and energy bills before business decisions.
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
                    const dec = livePreview.out_finalDecisionState;
                    const cls = decisionClass(dec);
                    const lbl = decisionLabel(dec);
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {fmtNum(livePreview.out_scenarioDelta)}
                            <small> months payback</small>
                          </div>
                          <div className="big-cap">{curSym}{fmtNum(livePreview.out_utilizationMargin)} annual saving &middot; {curSym}{fmtNum(livePreview.out_moneyAtRisk)} investment</div>
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
                    <div className="big-cap">Enter motor power &gt; 0 to see live results</div>
                  </div>
                </>
              )}
            </div>

            {livePreview && (
              <>
                <div className="stat"><span>Annual saving</span><b>{curSym}{fmtNum(livePreview.out_utilizationMargin)}</b></div>
                <div className="stat"><span>Total investment</span><b>{curSym}{fmtNum(livePreview.out_moneyAtRisk)}</b></div>
                <div className="stat"><span>Current energy cost</span><b>{curSym}{fmtNum(livePreview.out_demandMetric)}</b></div>
                <div className="stat"><span>New energy cost</span><b>{curSym}{fmtNum(livePreview.out_capacityMetric)}</b></div>
                <div className="stat"><span>Eff. gap (pp)</span><b>{(livePreview.out_referenceDeviation * 100).toFixed(1)}</b></div>

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
            <h2>Motor Compressor Replacement ROI Report</h2>
            <div className="rid">
              SC-PRO-MCR &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v5.3.1 &middot; Energy Efficiency<br />
              currency {curSym} &middot; NPV + payback analysis
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>
                  Payback period: {result.out_scenarioDelta.toFixed(1)} months &middot;
                  Annual energy saving: {curSym}{fmtNum(result.out_utilizationMargin)} &middot;
                  Total investment: {curSym}{fmtNum(result.out_moneyAtRisk)}
                </p>
                <p>Replacing a {engineInputs.currentEfficiencyPct.toFixed(1)}% efficient motor with a {engineInputs.newEfficiencyPct.toFixed(1)}% unit yields {(result.out_referenceDeviation * 100).toFixed(1)} percentage point efficiency gain.</p>
              </div>
            </div>

            {/* S2: Cost Structure */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">Cost Structure</span></div>
              <table>
                <thead><tr><th>Component</th><th className="n">Amount ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>Current energy cost (annual)</td><td className="n">{curSym}{fmtNum(result.out_demandMetric)}</td></tr>
                  <tr><td>New energy cost (annual)</td><td className="n">{curSym}{fmtNum(result.out_capacityMetric)}</td></tr>
                  <tr><td>Annual energy saving</td><td className="n">{curSym}{fmtNum(result.out_utilizationMargin)}</td></tr>
                  <tr><td>Total investment (replacement + install)</td><td className="n">{curSym}{fmtNum(result.out_moneyAtRisk)}</td></tr>
                  <tr><td>Maintenance saving / yr</td><td className="n">{curSym}{fmtNum(engineInputs.maintenanceSavingPerYear)}</td></tr>
                  <tr><td>Uncertainty (maintenance)</td><td className="n">{curSym}{fmtNum(result.out_expandedUncertainty)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S3: Decision Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Decision Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Payback period</td><td className="n">{result.out_scenarioDelta.toFixed(1)} months</td></tr>
                  <tr><td>Threshold crossing</td><td className="n">{result.out_thresholdCrossing === 1 ? "Within 48mo threshold" : "Exceeds threshold"}</td></tr>
                  <tr><td>Efficiency gain</td><td className="n">{(result.out_referenceDeviation * 100).toFixed(1)} pp</td></tr>
                  <tr><td>Data confidence</td><td className="n">{(result.out_evidenceCompleteness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Derating factor</td><td className="n">{result.out_deratingFactor.toFixed(3)}</td></tr>
                  <tr><td>Sensitivity driver</td><td className="n">{result.out_sensitivityDriver === 1 ? "Replacement cost" : "Energy cost"}</td></tr>
                  <tr><td>Decision state</td><td className="n">{decisionLabel(result.out_finalDecisionState)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Motor power</td><td className="n">{fmtNum(engineInputs.motorPowerKw)} kW</td></tr>
                  <tr><td>Annual operating hours</td><td className="n">{fmtNum(engineInputs.annualOperatingHours)} h</td></tr>
                  <tr><td>Current efficiency</td><td className="n">{engineInputs.currentEfficiencyPct.toFixed(1)}%</td></tr>
                  <tr><td>New efficiency</td><td className="n">{engineInputs.newEfficiencyPct.toFixed(1)}%</td></tr>
                  <tr><td>Avg kWh rate</td><td className="n">{curSym}{engineInputs.avgKwhRate.toFixed(3)}</td></tr>
                  <tr><td>Replacement cost</td><td className="n">{curSym}{fmtNum(engineInputs.replacementCost)}</td></tr>
                  <tr><td>Installation cost</td><td className="n">{curSym}{fmtNum(engineInputs.installationCost)}</td></tr>
                  <tr><td>Maintenance saving/yr</td><td className="n">{curSym}{fmtNum(engineInputs.maintenanceSavingPerYear)}</td></tr>
                  <tr><td>Equipment life</td><td className="n">{engineInputs.equipmentLifeYears.toFixed(0)} yr</td></tr>
                  <tr><td>Discount rate</td><td className="n">{(engineInputs.discountRate * 100).toFixed(1)}%</td></tr>
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
                Technical simulation for energy efficiency investment decision support.
                Assumes constant motor loading, electricity price, and operating profile across the
                planning horizon. Not a substitute for professional engineering or financial review.
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
