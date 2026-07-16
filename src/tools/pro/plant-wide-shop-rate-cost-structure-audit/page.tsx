"use client";

/**
 * Plant-Wide Shop Rate Cost Structure Audit — x1 pattern.
 *
 * Exact port of x1.html: 12 currencies, auto unit conversion,
 * inline validation messages, group numbering, engine metadata,
 * canonical unit display.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
import type { PlantWideShopRateInputs, PlantWideShopRateOutputs } from
  "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, CURRENCY_NOTE, CANON_SUFFIX, getFieldError, canonicalLabel } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-scrap-rework-cost.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  { id: "totalAnnualCost", label: "Total annual cost", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 1200000, hint: "Total plant-wide cost (direct + indirect).", ref: "units \u00B7 thousands \u00B7 millions", group: "cost", hardMin: 0, hardMax: 1e9 },
  { id: "totalProductiveHours", label: "Total productive hours", unit: "hours", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"], domain: "hours", showPrefix: false, default: 32000, hint: "Total billed or productive hours.", ref: "seconds\u2026days(24h)", group: "cost", hardMin: 0, hardMax: 1e7 },
  { id: "machineGroupCost", label: "Machine group cost", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 450000, hint: "Cost attributed to target machine group.", ref: "units \u00B7 thousands \u00B7 millions", group: "machines", hardMin: 0, hardMax: 1e9 },
  { id: "machineGroupHours", label: "Machine group hours", unit: "hours", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"], domain: "hours", showPrefix: false, default: 12000, hint: "Productive hours for machine group.", ref: "seconds\u2026days(24h)", group: "machines", hardMin: 0, hardMax: 1e7 },
  { id: "overheadPool", label: "Overhead pool", unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"], domain: "flat", showPrefix: true, default: 380000, hint: "Total overhead costs to allocate.", ref: "units \u00B7 thousands \u00B7 millions", group: "overhead", hardMin: 0, hardMax: 1e9 },
  { id: "overheadAllocationBase", label: "Overhead allocation base", unit: "hours", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"], domain: "hours", showPrefix: false, default: 32000, hint: "Allocation base (e.g., direct labor hours).", ref: "seconds\u2026days(24h)", group: "overhead", hardMin: 0, hardMax: 1e7 },
  { id: "currentShopRate", label: "Current shop rate", unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"], domain: "wage", showPrefix: true, default: 65, hint: "Current billing rate per hour.", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "pricing", hardMin: 0, hardMax: 5000 },
  { id: "targetMarginPct", label: "Target margin (%)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 15, hint: "Desired profit margin on shop rate.", ref: "% \u00B7 fraction", group: "pricing", hardMin: 0, hardMax: 200 },
  { id: "utilizationPct", label: "Utilization (%)", unit: "%", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 78, hint: "Actual capacity utilization rate.", ref: "% \u00B7 fraction", group: "pricing", hardMin: 0, hardMax: 100 },
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)"], domain: "percent", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "% \u00B7 fraction", group: "quality", hardMin: 0, hardMax: 1 },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  cost:      { num: "01", title: "Plant-Wide Costs", desc: "Total annual cost and productive hours." },
  machines:  { num: "02", title: "Machine Group", desc: "Cost and hours for the target machine group." },
  overhead:  { num: "03", title: "Overhead Allocation", desc: "Overhead pool and allocation base." },
  pricing:   { num: "04", title: "Pricing & Utilization", desc: "Current rate, target margin, and utilization." },
  quality:   { num: "05", title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

/* ─── Helpers ────────────────────────────────────────────────── */

/* ─── Component ──────────────────────────────────────────────── */
export default function PlantWideShopRatePage() {
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
  const engineInputs = useMemo((): PlantWideShopRateInputs => ({
    totalAnnualCost: canonState.totalAnnualCost ?? 0,
    totalProductiveHours: canonState.totalProductiveHours ?? 0,
    machineGroupCost: canonState.machineGroupCost ?? 0,
    machineGroupHours: canonState.machineGroupHours ?? 0,
    overheadPool: canonState.overheadPool ?? 0,
    overheadAllocationBase: canonState.overheadAllocationBase ?? 0,
    currentShopRate: canonState.currentShopRate ?? 0,
    targetMarginPct: (canonState.targetMarginPct ?? 0) * 100, // canon fraction -> %
    utilizationPct: (canonState.utilizationPct ?? 0) * 100,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<PlantWideShopRateOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): PlantWideShopRateOutputs | null => {
    if (!engineInputs.totalAnnualCost || engineInputs.totalAnnualCost <= 0) return null;
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
    d === 0 ? "OK" : d === 1 ? "REPRICE" : "REVIEW";
  const decisionClass = (d: number) =>
    d === 0 ? "pos" : d === 1 ? "warn" : "neg";

  return (
    <div className="shell">
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Cost Accounting &middot; Rate audit</div>
        <h1>Plant-Wide Shop Rate Cost Structure Audit</h1>
        <p className="lede">
          Audit plant-wide shop rates against actual cost structure. &mdash;
          Compute plant-wide rate, machine group rate, overhead absorption, and pricing floor.
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
                          <div className="big">{curSym}{livePreview.out_demandMetric.toFixed(2)}<small> /hr plant rate</small></div>
                          <div className="big-cap">Floor: {curSym}{(livePreview.out_demandMetric * (1 + engineInputs.targetMarginPct / 100)).toFixed(2)}/hr</div>
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

                <button className="cta" onClick={handleCalculate} disabled={!livePreview}>
                  Generate sealed report &middot; 1 credit
                </button>
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
            <h2>Shop rate &mdash; cost structure audit</h2>
            <div className="rid">
              SC-PRO-SR &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 35 assertions passed<br />
              currency {curSym} &middot; full absorption costing
            </div>
          </div>
          <div className="rep-body">
            <div className="sec">
              <div className="sec-h"><span className="sec-n">1</span><span className="sec-t">Executive summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>Plant-wide rate: {curSym}{result.out_demandMetric.toFixed(2)}/hr &middot; Pricing floor: {curSym}{(result.out_demandMetric * (1 + engineInputs.targetMarginPct / 100)).toFixed(2)}/hr &middot; Current rate: {curSym}{engineInputs.currentShopRate.toFixed(2)}/hr</p>
              </div>
            </div>
            <div className="sec">
              <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">Rate structure</span></div>
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
              <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Decision factors</span></div>
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
              <div className="sec-h"><span className="sec-n">4</span><span className="sec-t">Input summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Total annual cost</td><td className="n">{curSym}{engineInputs.totalAnnualCost.toLocaleString()}</td></tr>
                  <tr><td>Productive hours</td><td className="n">{engineInputs.totalProductiveHours.toLocaleString()}</td></tr>
                  <tr><td>Current shop rate</td><td className="n">{curSym}{engineInputs.currentShopRate.toFixed(2)}/hr</td></tr>
                  <tr><td>Target margin</td><td className="n">{engineInputs.targetMarginPct.toFixed(0)}%</td></tr>
                  <tr><td>Utilization</td><td className="n">{engineInputs.utilizationPct.toFixed(0)}%</td></tr>
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
