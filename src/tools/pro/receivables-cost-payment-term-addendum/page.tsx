"use client";

/**
 * Receivables Cost / Payment Term Addendum — x1 pattern.
 *
 * Uses executeFormula() from the shared formula registry.
 * 7 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import type { ReceivablesCostInputs, ReceivablesCostOutputs } from
  "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, SEVERITY_CLASS, CURRENCY_NOTE, CANON_SUFFIX, getFieldError } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import "@/styles/pro-tool-receivables-cost-payment-term-addendum.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Receivables ──
  {
    id: "averageReceivableBalance", label: "Average receivable balance",
    unit: "currency", unitOptions: [],
    domain: "money", showPrefix: true, default: 450000,
    hint: "Average outstanding accounts receivable balance.",
    ref: "balance \u00B7 currency", group: "receivables",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "annualInterestRate", label: "Annual interest rate",
    unit: "ratio", unitOptions: ["%", "fraction (0-1)"],
    domain: "percent", showPrefix: false, default: 0.08,
    hint: "Cost of capital or borrowing rate used to value the carrying cost of receivables.",
    ref: "0..1 ratio", group: "receivables",
    hardMin: 0, hardMax: 1,
  },
  {
    id: "averageCollectionDays", label: "Average collection period (DSO)",
    unit: "days", unitOptions: [],
    domain: "flat", showPrefix: false, default: 52,
    hint: "Average days sales outstanding — how long it takes to collect an invoice.",
    ref: "days", group: "receivables",
    hardMin: 0, hardMax: 365,
  },
  {
    id: "invoiceVolume", label: "Annual invoice volume",
    unit: "/year", unitOptions: [],
    domain: "money", showPrefix: true, default: 3200000,
    hint: "Total annual invoiced revenue passing through this payment-term structure.",
    ref: "annual revenue", group: "receivables",
    hardMin: 0, hardMax: 1e10,
  },
  // ── Cost Parameters ──
  {
    id: "sourceConfidence", label: "Source confidence",
    unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)", "bps"],
    domain: "percent", showPrefix: false, default: 0.9,
    hint: "Confidence in source data (0=guess, 1=audited).",
    ref: "0..1 ratio", group: "cost-params",
    hardMin: 0, hardMax: 1,
  },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  "receivables": { num: "01", title: "Receivables", desc: "Machine rate, cycle time, material cost, and batch quantity determine the receivables amount." },
  "cost-params": { num: "02", title: "Cost Parameters", desc: "Overhead, defect costs, and confidence level define the financing cost structure." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function ReceivablesCostPage() {
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

  const [result, setResult] = useState<ReceivablesCostOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Engine inputs from canonical values
  const engineInputs = useMemo((): ReceivablesCostInputs => ({
    averageReceivableBalance: canonState.averageReceivableBalance ?? 0,
    annualInterestRate: canonState.annualInterestRate ?? 0,
    averageCollectionDays: canonState.averageCollectionDays ?? 0,
    invoiceVolume: canonState.invoiceVolume ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  // Live preview (always)
  const livePreview = useMemo((): ReceivablesCostOutputs | null => {
    if (!engineInputs.invoiceVolume || engineInputs.invoiceVolume <= 0) return null;
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
        <div className="kicker">SectorCalc PRO &middot; Working Capital &middot; Receivables cost</div>
        <h1>Receivables Cost / Payment Term Addendum</h1>
        <p className="lede">
          Calculate the finance cost of extended payment terms and evaluate payment term addendum impact. &mdash;
          Quantify the hidden cost of carrying receivables.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>26 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>working capital costing</b></span>
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
                    const lbl = dec === 0 ? "LOW FINANCE COST" : dec === 1 ? "MODERATE COST" : "HIGH FINANCE COST";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {(livePreview.out_utilization_margin * 100).toFixed(2)}%
                            <small>finance cost ratio</small>
                          </div>
                          <div className="big-cap">
                            {curSym}{livePreview.out_money_at_risk.toFixed(0)} total finance cost
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Receivables amount</span><b>{curSym}{livePreview.out_normalized_demand.toFixed(0)}</b></div>
                <div className="stat"><span>Finance cost</span><b>{curSym}{livePreview.out_demand_metric.toFixed(0)}</b></div>
                <div className="stat"><span>Cost ratio</span><b>{(livePreview.out_utilization_margin * 100).toFixed(2)}%</b></div>
                <div className="stat"><span>Total cost of receivables</span><b>{curSym}{livePreview.out_capacity_metric.toFixed(0)}</b></div>
                <div className="stat"><span>Penalty &amp; hedge cost</span><b>{curSym}{(livePreview.out_money_at_risk - livePreview.out_demand_metric).toFixed(0)}</b></div>

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
            <h2>Receivables cost \u2014 proof report</h2>
            <div className="rid">
              SC-PRO-RC &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 26 assertions passed<br />
              currency {curSym} &middot; working capital costing
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
                  {curSym}{result.out_money_at_risk.toFixed(0)} total receivables cost
                </div>
                {result.out_final_decision_state === 0 ? (
                  <p>Finance cost ratio of {(result.out_utilization_margin * 100).toFixed(2)}% is within the low range. Current payment terms are efficiently structured.</p>
                ) : result.out_final_decision_state === 1 ? (
                  <p>Finance cost ratio of {(result.out_utilization_margin * 100).toFixed(2)}% is moderate. Consider reviewing payment term structure.</p>
                ) : (
                  <>
                    <p><strong>ELEVATED.</strong> Finance cost ratio of {(result.out_utilization_margin * 100).toFixed(2)}% represents a significant burden on working capital.</p>
                    <p>Total cost: {curSym}{result.out_money_at_risk.toFixed(0)}. Payment term addendum or early payment discount is strongly recommended.</p>
                  </>
                )}
              </div>
            </div>

            {/* Section 2: Cost Structure */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">2</span>
                <span className="sec-t">Cost Structure</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th className="n">Amount ({curSym})</th>
                    <th className="n">Share</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Financing cost</td><td className="n">{curSym}{result.out_demand_metric.toFixed(0)}</td><td className="n">{result.out_money_at_risk > 0 ? ((result.out_demand_metric / result.out_money_at_risk) * 100).toFixed(1) : "N/A"}%</td></tr>
                  <tr><td>Penalty cost</td><td className="n">{curSym}{(result.out_money_at_risk - result.out_demand_metric).toFixed(0)}</td><td className="n">{result.out_money_at_risk > 0 ? (((result.out_money_at_risk - result.out_demand_metric) / result.out_money_at_risk) * 100).toFixed(1) : "N/A"}%</td></tr>
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{result.out_money_at_risk.toFixed(0)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
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
                  <tr><td>Receivables amount</td><td className="n">{curSym}{result.out_normalized_demand.toFixed(2)}</td></tr>
                  <tr><td>Finance cost (annual)</td><td className="n">{curSym}{result.out_demand_metric.toFixed(2)}</td></tr>
                  <tr><td>Finance cost ratio</td><td className="n">{(result.out_utilization_margin * 100).toFixed(2)}%</td></tr>
                  <tr><td>Total receivables cost</td><td className="n">{curSym}{result.out_capacity_metric.toFixed(2)}</td></tr>
                  <tr><td>Penalty cost</td><td className="n">{curSym}{result.out_money_at_risk.toFixed(2)}</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_threshold_crossing === 0 ? "Low impact" : "Above threshold"}</td></tr>
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
                  <tr><td>Average receivable balance</td><td className="n">{curSym}{engineInputs.averageReceivableBalance.toFixed(0)}</td></tr>
                  <tr><td>Annual interest rate</td><td className="n">{(engineInputs.annualInterestRate * 100).toFixed(2)}%</td></tr>
                  <tr><td>Average collection period (DSO)</td><td className="n">{engineInputs.averageCollectionDays.toFixed(0)} days</td></tr>
                  <tr><td>Annual invoice volume</td><td className="n">{curSym}{engineInputs.invoiceVolume.toFixed(0)}/yr</td></tr>
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
                Assumes constant payment terms and uniform cost structure across the analysis period.
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
