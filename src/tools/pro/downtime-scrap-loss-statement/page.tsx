"use client";

/**
 * Downtime & Scrap Loss Statement — custom page component.
 *
 * Uses executeFormula() from the shared formula registry.
 * 10 inputs with unit selectors, live result rail, report section,
 * cost structure breakdown, and insights.
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import type { DowntimeLossInputs, DowntimeLossOutputs } from
  "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-downtime-scrap-loss-statement.css";

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
  id: keyof DowntimeLossInputs;
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
  // ── Time ──
  { id: "productiveHours", label: "Productive hours (planned)", defaultUnit: "hours", showPrefix: false, default: 176, hint: "Total planned productive hours for the period.", ref: "hours", group: "time", hardMin: 0, hardMax: 1e6, step: "1" },
  { id: "actualHours", label: "Actual hours worked", defaultUnit: "hours", showPrefix: false, default: 152, hint: "Actual hours of production output.", ref: "hours", group: "time", hardMin: 0, hardMax: 1e6, step: "1" },
  { id: "hourlyRate", label: "Hourly burden rate", defaultUnit: "/hour", showPrefix: true, default: 65, hint: "Fully loaded hourly cost (labor + overhead).", ref: "/hour", group: "time", hardMin: 0, hardMax: 10000, step: "0.01" },
  // ── Scrap ──
  { id: "scrapQuantity", label: "Scrap quantity", defaultUnit: "units", showPrefix: false, default: 45, hint: "Units scrapped — total material loss.", ref: "units", group: "scrap", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "unitCost", label: "Unit cost (scrap)", defaultUnit: "/unit", showPrefix: true, default: 85, hint: "Material cost per scrapped unit.", ref: "/unit", group: "scrap", hardMin: 0, hardMax: 1e6, step: "0.01" },
  // ── Rework ──
  { id: "reworkHours", label: "Rework hours", defaultUnit: "hours", showPrefix: false, default: 18, hint: "Total hours spent on rework operations.", ref: "hours", group: "rework", hardMin: 0, hardMax: 1e6, step: "1" },
  { id: "reworkRate", label: "Rework labor rate", defaultUnit: "/hour", showPrefix: true, default: 45, hint: "Hourly rate for rework labor (fully loaded).", ref: "/hour", group: "rework", hardMin: 0, hardMax: 10000, step: "0.01" },
  // ── Impact ──
  { id: "materialCost", label: "Total material cost", defaultUnit: "currency", showPrefix: true, default: 120000, hint: "Total material cost for the period.", ref: "currency", group: "impact", hardMin: 0, hardMax: 1e9, step: "1" },
  { id: "defectRatePct", label: "Defect rate (%)", defaultUnit: "%", showPrefix: false, default: 2.5, hint: "Observed defect rate as percentage (e.g. 2.5 = 2.5%).", ref: "%", group: "impact", hardMin: 0, hardMax: 100, step: "0.1" },
  { id: "sourceConfidence", label: "Source confidence", defaultUnit: "ratio", showPrefix: false, default: 0.8, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "impact", hardMin: 0, hardMax: 1, step: "0.05" },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  time:   { title: "Time & Rate", desc: "Planned vs actual hours and the burden rate define downtime cost." },
  scrap:  { title: "Scrap Loss", desc: "Quantity and unit cost of scrapped material determine material loss." },
  rework: { title: "Rework Labor", desc: "Hours and labor rate of rework operations." },
  impact: { title: "Impact Level", desc: "Total material cost, defect rate, and data confidence set the escalation threshold." },
};

/* ─── Helpers ────────────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg", opp: "pos", info: "warn",
};

/* ─── Pareto label helper ────────────────────────────────────── */
function paretoLabel(driver: number): string {
  return driver === 0 ? "Downtime" : driver === 1 ? "Scrap" : "Rework";
}

/* ─── Component ──────────────────────────────────────────────── */
export default function DowntimeScrapLossPage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  const [inputs, setInputs] = useState<DowntimeLossInputs>(() => {
    const init: DowntimeLossInputs = {} as DowntimeLossInputs;
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });

  const [result, setResult] = useState<DowntimeLossOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): DowntimeLossOutputs | null => {
    if (!inputs.productiveHours || inputs.productiveHours <= 0) return null;
    return executeFormula(inputs);
  }, [inputs]);

  // Active insights
  const activeInsights = useMemo(() => {
    if (!livePreview) return [];
    return getActiveInsights(livePreview, inputs, curSym);
  }, [livePreview, inputs, curSym]);

  const handleChange = useCallback((id: keyof DowntimeLossInputs, raw: string) => {
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
      { label: "Downtime Cost", value: result.out_downtime_cost, pct: result.out_total_loss > 0 ? result.out_downtime_cost / result.out_total_loss * 100 : 0 },
      { label: "Scrap Material Loss", value: result.out_scrap_material_loss, pct: result.out_total_loss > 0 ? result.out_scrap_material_loss / result.out_total_loss * 100 : 0 },
      { label: "Rework Loss", value: result.out_rework_loss, pct: result.out_total_loss > 0 ? result.out_rework_loss / result.out_total_loss * 100 : 0 },
    ];
  }, [result]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Downtime &amp; Scrap Loss Statement</h1>
        <p className="lede">
          Quantify the combined financial impact of downtime, scrap, and rework. &mdash;
          Identify the dominant loss driver and trigger escalation thresholds.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Operational Performance Context &bull; Auditable</span>
          <span><b>Loss Accounting</b></span>
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
            Generate Loss Statement Report
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
                    const dec = livePreview.out_decision_state;
                    const cls = dec === 0 ? "pos" : dec === 1 ? "warn" : "neg";
                    const lbl = dec === 0 ? "WITHIN THRESHOLD" : dec === 1 ? "REVIEW REQUIRED" : "ESCALATE — INVESTIGATE";
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
            <div><h2>Downtime &amp; Scrap Loss Statement</h2></div>
            <div className="rid">
              ISO 9001:2015 &bull; Operational Performance Context<br />
              Report ID: DS-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S1</span><span className="sec-t">Executive Summary</span></div>
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
                    <td className="n">{curSym}{result.out_total_loss.toFixed(0)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* S3: Performance Analysis */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S3</span><span className="sec-t">Performance Analysis</span></div>
              <table>
                <thead><tr><th>Metric</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Planned hours</td><td className="n">{inputs.productiveHours.toFixed(0)} h</td></tr>
                  <tr><td>Actual hours</td><td className="n">{inputs.actualHours.toFixed(0)} h</td></tr>
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

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">S4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Productive hours</td><td className="n">{inputs.productiveHours.toFixed(0)} h</td></tr>
                  <tr><td>Actual hours</td><td className="n">{inputs.actualHours.toFixed(0)} h</td></tr>
                  <tr><td>Hourly burden rate</td><td className="n">{curSym}{inputs.hourlyRate.toFixed(2)}/h</td></tr>
                  <tr><td>Scrap quantity</td><td className="n">{inputs.scrapQuantity.toLocaleString()}</td></tr>
                  <tr><td>Unit cost (scrap)</td><td className="n">{curSym}{inputs.unitCost.toFixed(2)}</td></tr>
                  <tr><td>Rework hours</td><td className="n">{inputs.reworkHours.toFixed(0)} h</td></tr>
                  <tr><td>Rework labor rate</td><td className="n">{curSym}{inputs.reworkRate.toFixed(2)}/h</td></tr>
                  <tr><td>Total material cost</td><td className="n">{curSym}{inputs.materialCost.toFixed(0)}</td></tr>
                  <tr><td>Defect rate</td><td className="n">{inputs.defectRatePct.toFixed(1)}%</td></tr>
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
                DOWNTIME-LOSS-REPORT-{Date.now().toString(36).toUpperCase()}<br />
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
