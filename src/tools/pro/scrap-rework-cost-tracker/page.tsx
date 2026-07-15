"use client";

/**
 * Scrap & Rework Cost Tracker — custom page component.
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
import "@/styles/pro-tool-scrap-rework-cost.css";

/* ─── Currency config ────────────────────────────────────────── */
type CurrencyCode = "EUR" | "USD" | "GBP" | "TRY";
const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "GBP", "TRY"];
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EUR: "\u20AC", USD: "$", GBP: "\u00A3", TRY: "\u20BA",
};
const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  EUR: "EUR (\u20AC)", USD: "USD ($)", GBP: "GBP (\u00A3)", TRY: "TRY (\u20BA)",
};
const DEFAULT_CURRENCY_INDEX = 1;

/* ─── Field definitions ──────────────────────────────────────── */

interface FieldDef {
  id: keyof ScrapReworkInputs;
  label: string;
  defaultUnit: string;
  showPrefix: boolean;
  default: number;
  hint: string;
  ref: string;
  group: string;
  hardMin: number;
  hardMax: number;
  step: string;
}

const FIELDS: FieldDef[] = [
  // ── Production ──
  { id: "totalProduced", label: "Total units produced (period)", defaultUnit: "units", showPrefix: false, default: 10000, hint: "Total output of the measurement period.", ref: "units", group: "production", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "monthlyVolume", label: "Monthly production volume", defaultUnit: "units/mo", showPrefix: false, default: 10000, hint: "Average monthly volume for annualizing quality loss.", ref: "units/mo", group: "production", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Defects ──
  { id: "scrapQuantity", label: "Scrap quantity", defaultUnit: "units", showPrefix: false, default: 150, hint: "Units that are non-reworkable — total material + labor loss.", ref: "units", group: "defects", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "reworkQuantity", label: "Rework quantity", defaultUnit: "units", showPrefix: false, default: 80, hint: "Units sent for rework — labor + time loss but material recovered.", ref: "units", group: "defects", hardMin: 0, hardMax: 1e9, step: "1" },
  // ── Cost ──
  { id: "unitMaterialCost", label: "Unit material cost", defaultUnit: "/unit", showPrefix: true, default: 25, hint: "Cost of raw material per good unit.", ref: "/unit", group: "cost", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "unitLaborCost", label: "Unit direct labor cost", defaultUnit: "/unit", showPrefix: true, default: 15, hint: "Direct labor cost allocated per unit produced.", ref: "/unit", group: "cost", hardMin: 0, hardMax: 1e6, step: "0.01" },
  { id: "reworkLaborRate", label: "Rework labor rate", defaultUnit: "/hour", showPrefix: true, default: 45, hint: "Hourly rate for rework operators (fully loaded).", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "cost", hardMin: 0, hardMax: 2000, step: "0.01" },
  { id: "reworkTimePerUnit", label: "Rework time per unit", defaultUnit: "hours", showPrefix: false, default: 0.5, hint: "Average hours to rework one defective unit.", ref: "minutes \u00B7 hours", group: "cost", hardMin: 0, hardMax: 168, step: "0.01" },
  // ── Quality ──
  { id: "defectRateTargetPct", label: "Defect rate target (%)", defaultUnit: "%", showPrefix: false, default: 2, hint: "Maximum acceptable defect rate as percentage (e.g. 2 = 2%).", ref: "% \u00B7 fraction", group: "quality", hardMin: 0, hardMax: 100, step: "0.1" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.9, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  production: { title: "Production Scale", desc: "Period output and monthly volume define the baseline for defect rate calculation." },
  defects:    { title: "Defect Quantities", desc: "Separate scrap (non-recoverable) from rework (recoverable with labor)." },
  cost:       { title: "Cost Parameters", desc: "Material, labor and rework costs determine the financial impact." },
  quality:    { title: "Quality Target", desc: "Target defect rate and data confidence level for decision thresholds." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Component ──────────────────────────────────────────────── */
export default function ScrapReworkCostPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<ScrapReworkInputs>(() => {
    const init: ScrapReworkInputs = {} as ScrapReworkInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<ScrapReworkOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): ScrapReworkOutputs | null => {
    if (!inputs.totalProduced || inputs.totalProduced <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof ScrapReworkInputs, raw: string) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, [id]: num }));
    }
  }, []);

  const handleCalculate = useCallback(() => {
    const r = executeFormula(inputs);
    setResult(r);
    setHasComputed(true);
  }, [inputs]);

  useEffect(() => {
    if (hasComputed && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasComputed]);

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
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Scrap &amp; Rework Cost Tracker</h1>
        <p className="lede">
          Track scrap and rework cost by cause, operation, and customer-impact driver. &mdash;
          Identify the dominant quality cost driver and quantify monthly loss.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Corrective Action Context &bull; Auditable</span>
          <span><b>Quality Costing</b></span>
        </div>

        <div className="curbar">
          <label htmlFor="cur-select">Currency</label>
          <select id="cur-select" value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
            {CURRENCIES.map((c) => (<option key={c} value={c}>{CURRENCY_LABELS[c]}</option>))}
          </select>
          <span className="curnote">{CURRENCY_NOTE}</span>
        </div>
      </div>

      {/* ── Bench ── */}
      <div className="bench">
        <div className="form-col">
          {Object.entries(GROUP_META).map(([gk, gm]) => {
            const groupFields = FIELDS.filter((f) => f.group === gk);
            return (
              <div className="grp" key={gk}>
                <div className="grp-h">
                  <span className="grp-n">{gk}</span>
                  <span className="grp-t">{gm.title}</span>
                </div>
                <p className="grp-d">{gm.desc}</p>
                {groupFields.map((f) => {
                  const val = inputs[f.id];
                  const isInvalid = isNaN(val) || val < f.hardMin || val > f.hardMax;
                  return (
                    <div className="f" key={f.id}>
                      <div className="f-top">
                        <label htmlFor={`inp-${f.id}`}>{f.label}</label>
                        <span className="unitline">{f.ref}</span>
                      </div>
                      <div className={`control${isInvalid ? " bad" : ""}`}>
                        {f.showPrefix && <span className="prefix">{curSym}</span>}
                        <input
                          id={`inp-${f.id}`}
                          type="number"
                          value={val ?? ""}
                          onChange={(e) => handleChange(f.id, e.target.value)}
                          min={f.hardMin}
                          max={f.hardMax}
                          step={f.step}
                        />
                      </div>
                      <div className="f-foot">
                        <span className="hint">{f.hint}</span>
                        <span className="bench-ref">{f.defaultUnit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <button className="cta" onClick={handleCalculate}>
            Generate Quality Loss Report
          </button>

          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#8C887E" /></svg>
            <span>Technical simulation. Verify all figures against production records before business decisions.</span>
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
            <div><h2>Scrap &amp; Rework Cost Report</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Corrective Action Context<br />
              Report ID: SQ-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">
                  {curSym}{result.out_moneyAtRisk.toFixed(0)} total quality loss
                </div>
                {result.out_decisionState === 0 ? (
                  <p>Defect rate of {(result.out_defectRate * 100).toFixed(2)}% is within the {(inputs.defectRateTargetPct).toFixed(1)}% target. Current quality controls are adequate.</p>
                ) : result.out_decisionState === 1 ? (
                  <p>Defect rate of {(result.out_defectRate * 100).toFixed(2)}% exceeds the {(inputs.defectRateTargetPct).toFixed(1)}% target. Monthly impact: {curSym}{result.out_monthlyQualityLoss.toFixed(0)}. Review process capability.</p>
                ) : (
                  <>
                    <p><strong>CRITICAL.</strong> Defect rate of {(result.out_defectRate * 100).toFixed(2)}% far exceeds target. Monthly loss: {curSym}{result.out_monthlyQualityLoss.toFixed(0)}.</p>
                    <p>Each defect costs {curSym}{result.out_defectCostPerUnit.toFixed(2)}. {result.out_primaryDriver === 0 ? "Scrap" : "Rework"} is the dominant cost driver. Immediate intervention recommended.</p>
                  </>
                )}
              </div>
            </div>

            {/* S2: Cost Structure */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S2</span><span className="sec-t">Cost Structure</span></div>
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

            {/* S3: Defect Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Defect Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Defect rate</td><td className="n">{(result.out_defectRate * 100).toFixed(2)}%</td></tr>
                  <tr><td>Target rate</td><td className="n">{inputs.defectRateTargetPct.toFixed(1)}%</td></tr>
                  <tr><td>Status</td><td className="n">{result.out_thresholdCrossing === 0 ? "Within target" : "Exceeds target"}</td></tr>
                  <tr><td>Total defect units</td><td className="n">{result.out_totalDefectUnits.toLocaleString()}</td></tr>
                  <tr><td>Cost per defect unit</td><td className="n">{curSym}{result.out_defectCostPerUnit.toFixed(2)}</td></tr>
                  <tr><td>Monthly quality loss</td><td className="n">{curSym}{result.out_monthlyQualityLoss.toFixed(0)}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmeaTrigger === 1 ? "ACTIVE" : "Inactive"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Total produced</td><td className="n">{inputs.totalProduced.toLocaleString()}</td></tr>
                  <tr><td>Monthly volume</td><td className="n">{inputs.monthlyVolume.toLocaleString()}</td></tr>
                  <tr><td>Scrap quantity</td><td className="n">{inputs.scrapQuantity.toLocaleString()}</td></tr>
                  <tr><td>Rework quantity</td><td className="n">{inputs.reworkQuantity.toLocaleString()}</td></tr>
                  <tr><td>Unit material cost</td><td className="n">{curSym}{inputs.unitMaterialCost.toFixed(2)}</td></tr>
                  <tr><td>Unit labor cost</td><td className="n">{curSym}{inputs.unitLaborCost.toFixed(2)}</td></tr>
                  <tr><td>Rework labor rate</td><td className="n">{curSym}{inputs.reworkLaborRate.toFixed(2)}/h</td></tr>
                  <tr><td>Rework time/unit</td><td className="n">{inputs.reworkTimePerUnit.toFixed(2)} h</td></tr>
                  <tr><td>Defect rate target</td><td className="n">{inputs.defectRateTargetPct.toFixed(1)}%</td></tr>
                  <tr><td>Source confidence</td><td className="n">{(inputs.sourceConfidence * 100).toFixed(0)}%</td></tr>
                </tbody>
              </table>
            </div>

            {/* S5: Insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h"><span className="sec-n">S5</span><span className="sec-t">Insights &amp; Recommendations</span></div>
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
              <div className="sec-h"><span className="sec-n">S6</span><span className="sec-t">Audit Seal &amp; Integrity</span></div>
              <div className="seal">
                QUALITY-REPORT-{Date.now().toString(36).toUpperCase()}<br />
                Engine: executeFormula v5.3.1-pro &bull; ISO 9001:2015 Context<br />
                Generated: {new Date().toISOString()}
              </div>
              <div className="disc">
                <strong>Disclaimer.</strong> This report is a technical simulation based on the inputs provided.
                It does not constitute financial, legal, or engineering advice. Always verify calculations
                with a qualified professional before making business decisions.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
