"use client";

/**
 * Setup Time Reduction ROI (SMED) — x1 pattern.
 *
 * Uses executeFormula() from the shared formula registry.
 * 7 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import type { SetupTimeReductionInputs, SetupTimeReductionOutputs } from
  "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, SEVERITY_CLASS, CURRENCY_NOTE, CANON_SUFFIX, getFieldError } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import "@/styles/pro-tool-setup-time-reduction-roi-smed.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Operations ──
  {
    id: "machineRate", label: "Machine rate",
    unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"],
    domain: "wage", showPrefix: true, default: 85,
    hint: "Machine hourly operating rate.",
    ref: "rate \u00B7 /hour", group: "operations",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "setupTime", label: "Current setup time",
    unit: "minutes", unitOptions: ["seconds", "minutes", "hours"],
    domain: "hours", showPrefix: false, default: 30,
    hint: "Current setup time per changeover in minutes.",
    ref: "minutes", group: "operations",
    hardMin: 0, hardMax: 1e4,
  },
  {
    id: "setupTimeReductionTargetPct", label: "Setup time reduction target",
    unit: "ratio", unitOptions: [],
    domain: "percent", showPrefix: false, default: 0.5,
    hint: "Realistic target reduction in setup time from a SMED program (e.g. 0.5 = 50%).",
    ref: "0..1 ratio", group: "operations",
    hardMin: 0, hardMax: 1,
  },
  {
    id: "smedInvestmentCost", label: "SMED implementation investment",
    unit: "currency", unitOptions: [],
    domain: "money", showPrefix: true, default: 45000,
    hint: "Real one-time investment cost for the SMED changeover-reduction program.",
    ref: "cost \u00B7 one-time", group: "operations",
    hardMin: 0, hardMax: 1e8,
  },
  {
    id: "batchQuantity", label: "Batch quantity",
    unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"],
    domain: "flat", showPrefix: false, default: 500,
    hint: "Average units per production batch.",
    ref: "count", group: "operations",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "annualVolume", label: "Annual volume",
    unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"],
    domain: "flat", showPrefix: false, default: 100000,
    hint: "Total annual production volume.",
    ref: "units/yr", group: "operations",
    hardMin: 0, hardMax: 1e9,
  },
  // ── Investment ──
  {
    id: "laborRate", label: "Labor rate",
    unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"],
    domain: "wage", showPrefix: true, default: 45,
    hint: "Direct labor hourly rate.",
    ref: "rate \u00B7 /hour", group: "investment",
    hardMin: 0, hardMax: 2000,
  },
  {
    id: "overheadRate", label: "Overhead rate",
    unit: "/year", unitOptions: ["/day", "/week", "/month", "/quarter", "/year"],
    domain: "money", showPrefix: true, default: 350000,
    hint: "Annual overhead allocation (used to estimate SMED investment).",
    ref: "annual cost", group: "investment",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "sourceConfidence", label: "Source confidence",
    unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)", "bps"],
    domain: "percent", showPrefix: false, default: 0.9,
    hint: "Confidence in source data (0=guess, 1=audited).",
    ref: "0..1 ratio", group: "investment",
    hardMin: 0, hardMax: 1,
  },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  operations: { num: "01", title: "Operations", desc: "Machine rate, setup time, batch size, and volume define the opportunity for setup reduction." },
  investment: { num: "02", title: "Investment Parameters", desc: "Labor rate, overhead, and confidence level determine SMED investment cost and ROI." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function SetupTimeReductionRoiPage() {
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

  const [result, setResult] = useState<SetupTimeReductionOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Engine inputs from canonical values
  const engineInputs = useMemo((): SetupTimeReductionInputs => ({
    machineRate: canonState.machineRate ?? 0,
    setupTime: canonState.setupTime ?? 0,
    setupTimeReductionTargetPct: canonState.setupTimeReductionTargetPct ?? 0.5,
    smedInvestmentCost: canonState.smedInvestmentCost ?? 0,
    batchQuantity: canonState.batchQuantity ?? 0,
    annualVolume: canonState.annualVolume ?? 0,
    laborRate: canonState.laborRate ?? 0,
    overheadRate: canonState.overheadRate ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  // Live preview (always)
  const livePreview = useMemo((): SetupTimeReductionOutputs | null => {
    if (!engineInputs.machineRate || engineInputs.machineRate <= 0) return null;
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

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Lean Manufacturing &middot; Setup reduction</div>
        <h1>Setup Time Reduction ROI (SMED)</h1>
        <p className="lede">
          Calculate the return on investment for Single-Minute Exchange of Die (SMED) implementation. &mdash;
          Evaluate payback period, annual savings, and capacity recovery.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>28 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>payback &amp; ROI analysis</b></span>
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
                    const dec = livePreview.out_final_decision_state;
                    const cls = dec === 0 ? "pos" : dec === 1 ? "warn" : "neg";
                    const lbl = dec === 0 ? "FAST PAYBACK" : dec === 1 ? "MODERATE" : "SLOW PAYBACK";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {(livePreview.out_utilization_margin * 100).toFixed(0)}%
                            <small>ROI</small>
                          </div>
                          <div className="big-cap">
                            {curSym}{livePreview.out_demand_metric.toFixed(0)} annual savings &middot;
                            {curSym}{livePreview.out_money_at_risk.toFixed(0)} investment
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Annual hours recovered</span><b>{livePreview.out_normalized_demand.toFixed(1)} h</b></div>
                <div className="stat"><span>Annual savings</span><b>{curSym}{livePreview.out_demand_metric.toFixed(0)}</b></div>
                <div className="stat"><span>Capacity value released</span><b>{curSym}{livePreview.out_capacity_metric.toFixed(0)}</b></div>
                <div className="stat"><span>ROI</span><b>{(livePreview.out_utilization_margin * 100).toFixed(0)}%</b></div>
                <div className="stat"><span>Investment cost</span><b>{curSym}{livePreview.out_money_at_risk.toFixed(0)}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter machine rate &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <h2>Setup time reduction — proof report</h2>
            <div className="rid">
              SC-PRO-SMED &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 28 assertions passed<br />
              currency {curSym} &middot; payback &amp; ROI analysis
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
                  {(result.out_utilization_margin * 100).toFixed(0)}% ROI &mdash; {curSym}{result.out_demand_metric.toFixed(0)} annual savings
                </div>
                {result.out_final_decision_state === 0 ? (
                  <p>SMED payback period is under 12 months. This is a high-return investment with annual savings of {curSym}{result.out_demand_metric.toFixed(0)} against an investment of {curSym}{result.out_money_at_risk.toFixed(0)}.</p>
                ) : result.out_final_decision_state === 1 ? (
                  <p>SMED payback period is 12\u201324 months. A viable investment with annual savings of {curSym}{result.out_demand_metric.toFixed(0)}. Consider phased implementation.</p>
                ) : (
                  <>
                    <p><strong>CAUTION.</strong> Payback period exceeds 24 months. Annual savings of {curSym}{result.out_demand_metric.toFixed(0)} may not justify the {curSym}{result.out_money_at_risk.toFixed(0)} investment.</p>
                    <p>Explore lower-cost alternatives or verify setup time reduction assumptions.</p>
                  </>
                )}
              </div>
            </div>

            {/* Section 2: Investment & Returns */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">2</span>
                <span className="sec-t">Investment &amp; Returns</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th className="n">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Annual hours recovered</td><td className="n">{result.out_normalized_demand.toFixed(1)} h</td></tr>
                  <tr><td>Annual savings (machine rate)</td><td className="n">{curSym}{result.out_demand_metric.toFixed(0)}</td></tr>
                  <tr><td>Capacity value released</td><td className="n">{curSym}{result.out_capacity_metric.toFixed(0)}</td></tr>
                  <tr><td>SMED investment cost</td><td className="n">{curSym}{result.out_money_at_risk.toFixed(0)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 3: Decision Analysis */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">3</span>
                <span className="sec-t">Decision Analysis</span>
              </div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>ROI</td><td className="n">{(result.out_utilization_margin * 100).toFixed(1)}%</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_threshold_crossing === 0 ? "Above threshold" : "Below threshold"}</td></tr>
                  <tr><td>Payback classification</td><td className="n">{result.out_final_decision_state === 0 ? "Fast (< 12 mo)" : result.out_final_decision_state === 1 ? "Moderate (12-24 mo)" : "Slow (> 24 mo)"}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmea_trigger === 1 ? "ACTIVE" : "Inactive"}</td></tr>
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
                  <tr><td>Machine rate</td><td className="n">{curSym}{engineInputs.machineRate.toFixed(2)}/h</td></tr>
                  <tr><td>Setup time</td><td className="n">{engineInputs.setupTime.toFixed(0)} min</td></tr>
                  <tr><td>Batch quantity</td><td className="n">{engineInputs.batchQuantity.toLocaleString()}</td></tr>
                  <tr><td>Annual volume</td><td className="n">{engineInputs.annualVolume.toLocaleString()}</td></tr>
                  <tr><td>Labor rate</td><td className="n">{curSym}{engineInputs.laborRate.toFixed(2)}/h</td></tr>
                  <tr><td>Overhead rate</td><td className="n">{curSym}{engineInputs.overheadRate.toFixed(0)}/yr</td></tr>
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
                Assumes straight-line payback calculation and constant operating parameters.
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
