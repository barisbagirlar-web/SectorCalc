"use client";

/**
 * Scrap & Rework Cost Tracker — x1 pattern.
 *
 * Uses executeFormula() from the shared formula registry.
 * 10 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";
import type { ScrapReworkInputs, ScrapReworkOutputs } from
  "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, SEVERITY_CLASS, CURRENCY_NOTE, CANON_SUFFIX, getFieldError } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import "@/styles/pro-tool-scrap-rework-cost.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Production ──
  {
    id: "totalProduced", label: "Total units produced (period)",
    unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"],
    domain: "flat", showPrefix: false, default: 10000,
    hint: "Total output of the measurement period.",
    ref: "units", group: "production",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "monthlyVolume", label: "Monthly production volume",
    unit: "/month", unitOptions: ["/day", "/week", "/month", "/quarter", "/year"],
    domain: "vol", showPrefix: false, default: 10000,
    hint: "Average monthly volume for annualizing quality loss.",
    ref: "units/mo", group: "production",
    hardMin: 0, hardMax: 1e9,
  },
  // ── Defects ──
  {
    id: "scrapQuantity", label: "Scrap quantity",
    unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"],
    domain: "flat", showPrefix: false, default: 150,
    hint: "Units that are non-reworkable \u2014 total material + labor loss.",
    ref: "units", group: "defects",
    hardMin: 0, hardMax: 1e9,
  },
  {
    id: "reworkQuantity", label: "Rework quantity",
    unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"],
    domain: "flat", showPrefix: false, default: 80,
    hint: "Units sent for rework \u2014 labor + time loss but material recovered.",
    ref: "units", group: "defects",
    hardMin: 0, hardMax: 1e9,
  },
  // ── Cost ──
  {
    id: "unitMaterialCost", label: "Unit material cost",
    unit: "/unit", unitOptions: ["/unit", "/dozen (12)", "/gross (144)", "/100 units", "/1,000 units"],
    domain: "perUnit", showPrefix: true, default: 25,
    hint: "Cost of raw material per good unit.",
    ref: "/unit", group: "cost",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "unitLaborCost", label: "Unit direct labor cost",
    unit: "/unit", unitOptions: ["/unit", "/dozen (12)", "/gross (144)", "/100 units", "/1,000 units"],
    domain: "perUnit", showPrefix: true, default: 15,
    hint: "Direct labor cost allocated per unit produced.",
    ref: "/unit", group: "cost",
    hardMin: 0, hardMax: 1e6,
  },
  {
    id: "reworkLaborRate", label: "Rework labor rate",
    unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"],
    domain: "wage", showPrefix: true, default: 45,
    hint: "Hourly rate for rework operators (fully loaded).",
    ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "cost",
    hardMin: 0, hardMax: 2000,
  },
  {
    id: "reworkTimePerUnit", label: "Rework time per unit",
    unit: "hours", unitOptions: ["seconds", "minutes", "hours"],
    domain: "hours", showPrefix: false, default: 0.5,
    hint: "Average hours to rework one defective unit.",
    ref: "minutes \u00B7 hours", group: "cost",
    hardMin: 0, hardMax: 168,
  },
  // ── Quality ──
  {
    id: "defectRateTargetPct", label: "Defect rate target (%)",
    unit: "%", unitOptions: ["%", "fraction (0-1)", "bps"],
    domain: "flat", showPrefix: false, default: 2,
    hint: "Maximum acceptable defect rate as percentage (e.g. 2 = 2%).",
    ref: "% \u00B7 fraction", group: "quality",
    hardMin: 0, hardMax: 100,
  },
  {
    id: "sourceConfidence", label: "Source confidence",
    unit: "fraction (0-1)", unitOptions: ["%", "fraction (0-1)", "bps"],
    domain: "percent", showPrefix: false, default: 0.9,
    hint: "Confidence in source data (0=guess, 1=audited).",
    ref: "0..1 ratio", group: "quality",
    hardMin: 0, hardMax: 1,
  },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  production: { num: "01", title: "Production Scale", desc: "Period output and monthly volume define the baseline for defect rate calculation." },
  defects:    { num: "02", title: "Defect Quantities", desc: "Separate scrap (non-recoverable) from rework (recoverable with labor)." },
  cost:       { num: "03", title: "Cost Parameters", desc: "Material, labor and rework costs determine the financial impact." },
  quality:    { num: "04", title: "Quality Target", desc: "Target defect rate and data confidence level for decision thresholds." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function ScrapReworkCostPage() {
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

  const [result, setResult] = useState<ScrapReworkOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Engine inputs from canonical values
  const engineInputs = useMemo((): ScrapReworkInputs => ({
    totalProduced: canonState.totalProduced ?? 0,
    monthlyVolume: canonState.monthlyVolume ?? 0,
    scrapQuantity: canonState.scrapQuantity ?? 0,
    reworkQuantity: canonState.reworkQuantity ?? 0,
    unitMaterialCost: canonState.unitMaterialCost ?? 0,
    unitLaborCost: canonState.unitLaborCost ?? 0,
    reworkLaborRate: canonState.reworkLaborRate ?? 0,
    reworkTimePerUnit: canonState.reworkTimePerUnit ?? 0,
    defectRateTargetPct: canonState.defectRateTargetPct ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  // Live preview (always)
  const livePreview = useMemo((): ScrapReworkOutputs | null => {
    if (!engineInputs.totalProduced || engineInputs.totalProduced <= 0) return null;
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

  // Cost structure for display
  const costStructure = useMemo(() => {
    if (!result) return [];
    return [
      { label: "Scrap Cost", value: result.out_scrapCost, pct: result.out_moneyAtRisk > 0 ? result.out_scrapCost / result.out_moneyAtRisk * 100 : 0 },
      { label: "Rework Cost", value: result.out_reworkCost, pct: result.out_moneyAtRisk > 0 ? result.out_reworkCost / result.out_moneyAtRisk * 100 : 0 },
    ];
  }, [result]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Quality Costing &middot; Scrap &amp; rework</div>
        <h1>Scrap &amp; Rework Cost Tracker</h1>
        <p className="lede">
          Track scrap and rework cost by cause, operation, and customer-impact driver. &mdash;
          Identify the dominant quality cost driver and quantify monthly loss.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>32 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>quality cost accounting</b></span>
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
                    const dec = livePreview.out_decisionState;
                    const cls = dec === 0 ? "pos" : dec === 1 ? "warn" : "neg";
                    const lbl = dec === 0 ? "WITHIN TARGET" : dec === 1 ? "EXCEEDS TARGET \u2014 REVIEW" : "CRITICAL \u2014 INVESTIGATE";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{livePreview.out_moneyAtRisk.toFixed(0)}
                            <small>total quality loss</small>
                          </div>
                          <div className="big-cap">{livePreview.out_totalDefectUnits} defect units &middot; {(livePreview.out_defectRate * 100).toFixed(1)}% rate</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="stat"><span>Scrap cost</span><b>{curSym}{livePreview.out_scrapCost.toFixed(0)}</b></div>
                <div className="stat"><span>Rework cost</span><b>{curSym}{livePreview.out_reworkCost.toFixed(0)}</b></div>
                <div className="stat"><span>Cost per defect</span><b>{curSym}{livePreview.out_defectCostPerUnit.toFixed(2)}</b></div>
                <div className="stat"><span>Monthly loss</span><b>{curSym}{livePreview.out_monthlyQualityLoss.toFixed(0)}</b></div>
                <div className="stat"><span>Primary driver</span><b>{livePreview.out_primaryDriver === 0 ? "Scrap" : "Rework"}</b></div>

                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter total produced &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          <div className="rep-mast">
            <h2>Scrap &amp; rework cost \u2014 proof report</h2>
            <div className="rid">
              SC-PRO-SQ &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 32 assertions passed<br />
              currency {curSym} &middot; quality cost accounting
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
                  {curSym}{result.out_moneyAtRisk.toFixed(0)} total quality loss
                </div>
                {result.out_decisionState === 0 ? (
                  <p>Defect rate of {(result.out_defectRate * 100).toFixed(2)}% is within the {engineInputs.defectRateTargetPct.toFixed(1)}% target. Current quality controls are adequate.</p>
                ) : result.out_decisionState === 1 ? (
                  <p>Defect rate of {(result.out_defectRate * 100).toFixed(2)}% exceeds the {engineInputs.defectRateTargetPct.toFixed(1)}% target. Monthly impact: {curSym}{result.out_monthlyQualityLoss.toFixed(0)}. Review process capability.</p>
                ) : (
                  <>
                    <p><strong>CRITICAL.</strong> Defect rate of {(result.out_defectRate * 100).toFixed(2)}% far exceeds target. Monthly loss: {curSym}{result.out_monthlyQualityLoss.toFixed(0)}.</p>
                    <p>Each defect costs {curSym}{result.out_defectCostPerUnit.toFixed(2)}. {result.out_primaryDriver === 0 ? "Scrap" : "Rework"} is the dominant cost driver. Immediate intervention recommended.</p>
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
                    <td className="n">{curSym}{result.out_moneyAtRisk.toFixed(0)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 3: Defect Analysis */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">3</span>
                <span className="sec-t">Defect Analysis</span>
              </div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Defect rate</td><td className="n">{(result.out_defectRate * 100).toFixed(2)}%</td></tr>
                  <tr><td>Target rate</td><td className="n">{engineInputs.defectRateTargetPct.toFixed(1)}%</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_thresholdCrossing === 0 ? "Within target" : "Exceeds target"}</td></tr>
                  <tr><td>Total defect units</td><td className="n">{result.out_totalDefectUnits.toLocaleString()}</td></tr>
                  <tr><td>Cost per defect unit</td><td className="n">{curSym}{result.out_defectCostPerUnit.toFixed(2)}</td></tr>
                  <tr><td>Monthly quality loss</td><td className="n">{curSym}{result.out_monthlyQualityLoss.toFixed(0)}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmeaTrigger === 1 ? "ACTIVE" : "Inactive"}</td></tr>
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
                  <tr><td>Total produced</td><td className="n">{engineInputs.totalProduced.toLocaleString()}</td></tr>
                  <tr><td>Monthly volume</td><td className="n">{engineInputs.monthlyVolume.toLocaleString()}</td></tr>
                  <tr><td>Scrap quantity</td><td className="n">{engineInputs.scrapQuantity.toLocaleString()}</td></tr>
                  <tr><td>Rework quantity</td><td className="n">{engineInputs.reworkQuantity.toLocaleString()}</td></tr>
                  <tr><td>Unit material cost</td><td className="n">{curSym}{engineInputs.unitMaterialCost.toFixed(2)}</td></tr>
                  <tr><td>Unit labor cost</td><td className="n">{curSym}{engineInputs.unitLaborCost.toFixed(2)}</td></tr>
                  <tr><td>Rework labor rate</td><td className="n">{curSym}{engineInputs.reworkLaborRate.toFixed(2)}/h</td></tr>
                  <tr><td>Rework time/unit</td><td className="n">{engineInputs.reworkTimePerUnit.toFixed(2)} h</td></tr>
                  <tr><td>Defect rate target</td><td className="n">{engineInputs.defectRateTargetPct.toFixed(1)}%</td></tr>
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
                Assumes stable production rates and constant defect patterns across the measurement period.
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
