"use client";

/**
 * Energy Efficiency Grant & Incentive Feasibility Pack — custom page component.
 *
 * x1 pattern: 12-currency, inline validation, canonical unit display,
 * group numbering, engine metadata.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * Import: toCanonical / fromCanonical from @/tools/_shared/units
 * Import: x1-utils from @/tools/_shared/x1-utils
 * CSS:    @/styles/pro-tool-scrap-rework-cost.css
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import type { EnergyEfficiencyInputs, EnergyEfficiencyOutputs } from
  "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, SEVERITY_CLASS, CANON_SUFFIX, CURRENCY_NOTE } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import { getFieldError } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-scrap-rework-cost.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Energy Consumption ──
  { id: "currentKwhPerYear", label: "Current kWh/year", unit: "kWh", domain: "energy", showPrefix: false, default: 500000, hint: "Annual energy consumption before improvement.", ref: "kWh/yr", group: "energy", hardMin: 0, hardMax: 1e9, unitOptions: ["kWh", "MWh", "MJ", "GJ", "BTU"] },
  { id: "targetKwhPerYear", label: "Target kWh/year", unit: "kWh", domain: "energy", showPrefix: false, default: 350000, hint: "Expected annual consumption after improvement.", ref: "kWh/yr", group: "energy", hardMin: 0, hardMax: 1e9, unitOptions: ["kWh", "MWh", "MJ", "GJ", "BTU"] },
  { id: "avgKwhRate", label: "Average kWh rate", unit: "/kWh", domain: "energyPrice", showPrefix: true, default: 0.14, hint: "Blended electricity rate.", ref: "/kWh", group: "energy", hardMin: 0, hardMax: 10, unitOptions: ["/kWh", "/MWh"] },
  // ── Cost & Grant ──
  { id: "implementationCost", label: "Implementation cost", unit: "units", domain: "flat", showPrefix: true, default: 120000, hint: "Total project implementation cost.", ref: "one-time", group: "cost", hardMin: 0, hardMax: 1e8, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "grantCoveragePct", label: "Grant coverage (%)", unit: "units", domain: "flat", showPrefix: false, default: 35, hint: "Expected grant percentage (e.g. 35 = 35%).", ref: "%", group: "cost", hardMin: 0, hardMax: 100, unitOptions: ["units"] },
  // ── Additional Savings ──
  { id: "maintenanceCostSaving", label: "Maintenance cost saving", unit: "units", domain: "flat", showPrefix: true, default: 5000, hint: "Annual maintenance cost reduction.", ref: "/yr", group: "savings", hardMin: 0, hardMax: 1e7, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  // ── Environmental ──
  { id: "emissionFactorKgCo2PerKwh", label: "Emission factor (kgCO2/kWh)", unit: "units", domain: "flat", showPrefix: false, default: 0.45, hint: "Grid emission factor for CO2 calculation.", ref: "kgCO2/kWh", group: "environmental", hardMin: 0, hardMax: 10, unitOptions: ["units"] },
  // ── Time Horizon ──
  { id: "equipmentLifeYears", label: "Equipment life (years)", unit: "years", domain: "years", showPrefix: false, default: 15, hint: "Expected useful life of new equipment.", ref: "yr", group: "horizon", hardMin: 1, hardMax: 50, unitOptions: ["months", "quarters", "years"] },
  { id: "discountRate", label: "Discount rate", unit: "fraction (0-1)", domain: "percent", showPrefix: false, default: 0.06, hint: "WACC or required rate of return (e.g. 0.06 = 6%).", ref: "0..1", group: "horizon", hardMin: 0, hardMax: 1, unitOptions: ["%", "fraction (0-1)", "bps"] },
  // ── Data Quality ──
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", domain: "percent", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, unitOptions: ["%", "fraction (0-1)", "bps"] },
];

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  energy:        { num: "01", title: "Energy Consumption", desc: "Current and target energy usage." },
  cost:          { num: "02", title: "Cost & Grant", desc: "Implementation cost and expected grant coverage." },
  savings:       { num: "03", title: "Additional Savings", desc: "Maintenance cost reduction from new equipment." },
  environmental: { num: "04", title: "Environmental", desc: "Carbon emission factors for CO2 savings calculation." },
  horizon:       { num: "05", title: "Time Horizon", desc: "Equipment life and discount rate for NPV." },
  quality:       { num: "06", title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function EnergyEfficiencyGrantPage() {
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
  const engineInputs = useMemo((): EnergyEfficiencyInputs => ({
    currentKwhPerYear: canonState.currentKwhPerYear ?? 0,
    targetKwhPerYear: canonState.targetKwhPerYear ?? 0,
    avgKwhRate: canonState.avgKwhRate ?? 0,
    implementationCost: canonState.implementationCost ?? 0,
    grantCoveragePct: canonState.grantCoveragePct ?? 0,
    maintenanceCostSaving: canonState.maintenanceCostSaving ?? 0,
    emissionFactorKgCo2PerKwh: canonState.emissionFactorKgCo2PerKwh ?? 0,
    equipmentLifeYears: canonState.equipmentLifeYears ?? 0,
    discountRate: canonState.discountRate ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<EnergyEfficiencyOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): EnergyEfficiencyOutputs | null => {
    if (!engineInputs.currentKwhPerYear || engineInputs.currentKwhPerYear <= 0) return null;
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
        <div className="kicker">SectorCalc PRO &middot; Energy Efficiency &middot; Grant &amp; Incentive</div>
        <h1>Energy Efficiency Grant &amp; Incentive Feasibility Pack</h1>
        <p className="lede">
          Evaluate the financial and environmental feasibility of energy efficiency improvements. &mdash;
          Compute payback, ROI, CO2 reduction, and grant-adjusted net cost.
        </p>
        <div className="meta">
          <span>Engine <b>v5.3.1</b></span>
          <span>Energy Performance <b>verified</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>NPV + grant-adjusted costing</b></span>
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
              Technical simulation. Verify all figures against energy audits and grant terms before proceeding.
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
                    return (
                      <>
                        <div className={`verdict-band ${decisionClass(dec)}`}>{decisionLabel(dec)}</div>
                        <div className="verdict-body">
                          <div className="big">{fmtNum(livePreview.out_normalizedDemand)}<small> demand metric</small></div>
                          <div className="big-cap">ROI: {((livePreview.out_utilizationMargin - 1) * 100).toFixed(0)}%</div>
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
                    <div className="big-cap">Enter current kWh/yr &gt; 0 to see live results</div>
                  </div>
                </>
              )}
            </div>

            {livePreview && (
              <>
                <div className="stat"><span>Money saving/yr</span><b>{curSym}{(livePreview.out_normalizedDemand / (engineInputs.avgKwhRate > 0 ? engineInputs.avgKwhRate / 10 : 1)).toFixed(0)}</b></div>
                <div className="stat"><span>Money at risk</span><b>{curSym}{fmtNum(livePreview.out_moneyAtRisk)}</b></div>
                <div className="stat"><span>Data confidence</span><b>{(livePreview.out_evidenceCompleteness * 100).toFixed(0)}%</b></div>

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
            <h2>Energy Efficiency Feasibility Report</h2>
            <div className="rid">
              SC-PRO-EE &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v5.3.1 &middot; Energy Performance<br />
              currency {curSym} &middot; grant-adjusted costing
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>
                  Payback: {((result.out_normalizedDemand / (engineInputs.avgKwhRate > 0 ? engineInputs.avgKwhRate / 10 : 1)) > 0
                    ? engineInputs.implementationCost * (1 - engineInputs.grantCoveragePct) / ((engineInputs.currentKwhPerYear - engineInputs.targetKwhPerYear) * engineInputs.avgKwhRate + engineInputs.maintenanceCostSaving)
                    : 0).toFixed(1)} yr &middot;
                  5yr ROI: {((result.out_utilizationMargin - 1) * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* S2: Cost & Savings */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">Cost &amp; Savings</span></div>
              <table>
                <thead><tr><th>Item</th><th className="n">Amount ({curSym})</th></tr></thead>
                <tbody>
                  <tr><td>Implementation cost</td><td className="n">{curSym}{fmtNum(engineInputs.implementationCost)}</td></tr>
                  <tr><td>Grant amount</td><td className="n">{curSym}{(engineInputs.implementationCost * engineInputs.grantCoveragePct).toFixed(0)}</td></tr>
                  <tr><td>Net cost</td><td className="n">{curSym}{(engineInputs.implementationCost * (1 - engineInputs.grantCoveragePct)).toFixed(0)}</td></tr>
                  <tr><td>Annual money saving</td><td className="n">{curSym}{((engineInputs.currentKwhPerYear - engineInputs.targetKwhPerYear) * engineInputs.avgKwhRate + engineInputs.maintenanceCostSaving).toFixed(0)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S3: Decision Factors */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Decision Factors</span></div>
              <table>
                <thead><tr><th>Factor</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Data confidence</td><td className="n">{(result.out_evidenceCompleteness * 100).toFixed(0)}%</td></tr>
                  <tr><td>Energy saving (kWh)</td><td className="n">{(engineInputs.currentKwhPerYear - engineInputs.targetKwhPerYear).toLocaleString()}</td></tr>
                  <tr><td>CO2 reduction (t/yr)</td><td className="n">{((engineInputs.currentKwhPerYear - engineInputs.targetKwhPerYear) * engineInputs.emissionFactorKgCo2PerKwh / 1000).toFixed(1)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Current kWh/yr</td><td className="n">{fmtNum(engineInputs.currentKwhPerYear)}</td></tr>
                  <tr><td>Target kWh/yr</td><td className="n">{fmtNum(engineInputs.targetKwhPerYear)}</td></tr>
                  <tr><td>Avg rate</td><td className="n">{curSym}{engineInputs.avgKwhRate.toFixed(3)}</td></tr>
                  <tr><td>Grant coverage</td><td className="n">{(engineInputs.grantCoveragePct * 100).toFixed(0)}%</td></tr>
                  <tr><td>Equipment life</td><td className="n">{engineInputs.equipmentLifeYears.toFixed(0)} yr</td></tr>
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
                Assumes constant electricity price, emission factor, and grant terms across the
                planning horizon. Not a substitute for professional energy audit or financial review.
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
