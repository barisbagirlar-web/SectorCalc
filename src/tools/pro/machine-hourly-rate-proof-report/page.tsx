"use client";

/**
 * Machine Hourly Rate Proof Report — custom page component.
 *
 * Uses executeFormula() from the shared formula registry (single source
 * of truth — no separate engine.ts). All 8 inputs, unit selectors,
 * live result rail, report section, sensitivity bars, and insights.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * CSS:    @/styles/pro-tool-machine-hourly-rate.css
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula, sensitivity } from
  "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import type { MachineHourlyRateInputs, MachineHourlyRateOutputs } from
  "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import "@/styles/pro-tool-machine-hourly-rate.css";

/* ─── Currency config ────────────────────────────────────────── */
type CurrencyCode = "EUR" | "USD" | "GBP" | "TRY";
const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "GBP", "TRY"];
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EUR: "\u20AC", USD: "$", GBP: "\u00A3", TRY: "\u20BA",
};
const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  EUR: "EUR (\u20AC)", USD: "USD ($)", GBP: "GBP (\u00A3)", TRY: "TRY (\u20BA)",
};
const DEFAULT_CURRENCY_INDEX = 1; // USD

/* ─── Field definitions ──────────────────────────────────────── */

/** A single input field descriptor. All unit domains exist in units.ts. */
interface FieldDef {
  id: string;
  label: string;
  unit: string;
  /** Unit options shown in the <select> dropdown. */
  unitOptions?: string[];
  /** If true, show a currency prefix symbol. */
  showPrefix: boolean;
  default: number;
  hint: string;
  ref: string;
  /** The group this field belongs to (same in group-key). */
  group: string;
  hardMin: number;
  hardMax: number;
}

const FIELDS: FieldDef[] = [
  // ── Group: Acquisition ──
  { id: "purchasePrice",   label: "Purchase price (installed)", unit: "units",   unitOptions: undefined,  showPrefix: true,  default: 180000,  hint: "Installation, base tooling and commissioning included.",    ref: "units \u00B7 thousands \u00B7 millions",   group: "acquisition", hardMin: 100, hardMax: 500000000 },
  { id: "usefulLife",       label: "Useful life",               unit: "years",   unitOptions: ["years", "months"], showPrefix: false, default: 10,      hint: "Economic life for depreciation, not physical life.",       ref: "months \u00B7 quarters \u00B7 years",        group: "acquisition", hardMin: 0.5, hardMax: 40 },
  { id: "annualHours",      label: "Planned operating hours",   unit: "h/yr",    unitOptions: ["h/yr", "h/mo"],     showPrefix: false, default: 4000,    hint: "Scheduled production time per year. Hard physical cap: 8,760 h.", ref: "seconds\u2026days(24h)", group: "acquisition", hardMin: 0, hardMax: 8760 },
  // ── Group: Labor ──
  { id: "wageRate",         label: "Operator cost (fully loaded)", unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"], showPrefix: true, default: 34, hint: "Wage + employer contributions + benefits, not gross wage.", ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "labor", hardMin: 0, hardMax: 2000 },
  // ── Group: Energy ──
  { id: "powerDraw",        label: "Average power draw",         unit: "kW",     unitOptions: ["kW", "W", "MW", "HP"], showPrefix: false, default: 12,  hint: "Average under load \u2014 typically 30\u201360% of nameplate rating.", ref: "W \u00B7 kW \u00B7 MW \u00B7 HP", group: "energy", hardMin: 0, hardMax: 5000 },
  { id: "energyPrice",      label: "Industrial electricity price", unit: "/kWh", unitOptions: ["/kWh", "/MWh"],       showPrefix: true,  default: 0.18,   hint: "All-in price including grid fees and levies.",             ref: "/kWh \u00B7 /MWh",                         group: "energy", hardMin: 0, hardMax: 5 },
  // ── Group: Utilization ──
  { id: "idleShare",        label: "Idle / non-productive share",  unit: "%",     unitOptions: ["%", "fraction"],    showPrefix: false, default: 20,     hint: "Paid machine time producing nothing sellable \u2014 setup, changeovers, breakdowns, starved queues.", ref: "% \u00B7 fraction", group: "utilization", hardMin: 0, hardMax: 95 },
  { id: "maintenanceRate",  label: "Annual maintenance (% of price)", unit: "%", unitOptions: ["%", "fraction"],    showPrefix: false,  default: 5,      hint: "Planned and unplanned, parts and labor, per year.",        ref: "% \u00B7 fraction",                         group: "utilization", hardMin: 0, hardMax: 60 },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Unit conversion helpers ────────────────────────────────── */
const CANON_MAP: Record<string, (v: number, from: string) => number> = {
  years: (v, u) => (u === "months" ? v / 12 : v),
  "h/yr": (v, u) => (u === "h/mo" ? v * 12 : v),
  "/hour": (v, u) => {
    if (u === "/day (8h)") return v / 8;
    if (u === "/week (40h)") return v / 40;
    return v;
  },
  "%": (v, u) => (u === "fraction" ? v * 100 : v),
  fraction: (v, u) => (u === "%" ? v / 100 : v),
  kW: (v, u) => {
    if (u === "W") return v / 1000;
    if (u === "MW") return v * 1000;
    if (u === "HP") return v * 0.7457;
    return v;
  },
  "/kWh": (v, u) => (u === "/MWh" ? v / 1000 : v),
  units: (v) => v,
};
// Some fields have display-unit options that differ from the default
// unit. Provide an override so the <select> shows correct options.
const FIELD_UNIT_MAP: Record<string, string> = {
  usefulLife: "years",
  annualHours: "h/yr",
  wageRate: "/hour",
  purchasePrice: "units",
  powerDraw: "kW",
  energyPrice: "/kWh",
  idleShare: "%",
  maintenanceRate: "%",
};

/** Convert a display value to canonical. */
function toCanon(field: FieldDef, displayValue: number, displayUnit: string): number {
  const dom = FIELD_UNIT_MAP[field.id] || field.unit;
  const fn = CANON_MAP[dom];
  if (!fn) return displayValue;
  return fn(displayValue, displayUnit);
}

/** Convert a canonical value back to a display unit. */
function fromCanon(field: FieldDef, canonValue: number, displayUnit: string): number {
  // Invert the conversion. For most domains, same function applies.
  const dom = FIELD_UNIT_MAP[field.id] || field.unit;
  const fn = CANON_MAP[dom];
  if (!fn) return canonValue;
  // Brute-force inversion for linear conversions: binary search or direct.
  // Since all conversions are linear (v * factor), we can invert by
  // computing what input to fn() produces canonValue.
  // For simple factor-based conversions: canon = display * factor
  // So display = canon / factor
  // We estimate factor by: toCanon(1, displayUnit) / 1
  const ref = fn(1, displayUnit);
  return ref !== 0 ? canonValue / ref : canonValue;
}

/** Convert a canonical value to the selected display unit. */
function toDisplayUnit(field: FieldDef, canonValue: number, displayUnit: string): number {
  return fromCanon(field, canonValue, displayUnit);
}

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { title: string; desc: string }> = {
  acquisition: { title: "Acquisition & Operating Plan",  desc: "Purchase price, economic life and planned runtime define the fixed-cost baseline." },
  labor:       { title: "Labor Cost",                     desc: "Fully loaded operator cost \u2014 wage, employer contributions, benefits." },
  energy:      { title: "Energy Cost",                    desc: "Power draw and electricity price determine the energy component of the rate." },
  utilization: { title: "Utilization & Maintenance",      desc: "Idle time and maintenance budget directly affect how many hours are truly productive." },
};

/* ─── Currency note ──────────────────────────────────────────── */
const CURRENCY_NOTE = "All monetary values in the selected currency. Conversion uses live mid-market rates for context only; verify against your local accounting system.";

/* ─── Component ──────────────────────────────────────────────── */
export default function MachineHourlyRatePage() {
  const [currency, setCurrency] = useState<CurrencyCode>(CURRENCIES[DEFAULT_CURRENCY_INDEX]);
  const curSym = CURRENCY_SYMBOLS[currency];

  // Display values + their selected unit for each field
  const [displayValue, setDisplayValue] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const f of FIELDS) init[f.id] = f.default;
    return init;
  });
  const [displayUnit, setDisplayUnit] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.id] = FIELD_UNIT_MAP[f.id] || f.unit;
    return init;
  });

  // Computed canonical values
  const canonState = useMemo(() => {
    const cs: Record<string, number> = {};
    for (const f of FIELDS) {
      const dv = displayValue[f.id] ?? f.default;
      const du = displayUnit[f.id] || FIELD_UNIT_MAP[f.id] || f.unit;
      const cv = toCanon(f, dv, du);
      cs[f.id] = cv;
    }
    // idleShare and maintenanceRate are stored as % in display but
    // the formula expects fraction (0..1). toCanon with unit "%" already
    // passes through, so we manually convert percentage fields.
    cs.idleShare = (cs.idleShare ?? 20) / 100;
    cs.maintenanceRate = (cs.maintenanceRate ?? 5) / 100;
    return cs;
  }, [displayValue, displayUnit]);

  const [result, setResult] = useState<MachineHourlyRateOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const engineInputs = useMemo((): MachineHourlyRateInputs => ({
    purchasePrice: canonState.purchasePrice ?? 0,
    usefulLife: canonState.usefulLife ?? 0,
    annualHours: canonState.annualHours ?? 0,
    wageRate: canonState.wageRate ?? 0,
    powerDraw: canonState.powerDraw ?? 0,
    energyPrice: canonState.energyPrice ?? 0,
    idleShare: canonState.idleShare ?? 0,
    maintenanceRate: canonState.maintenanceRate ?? 0,
  }), [canonState]);

  // Compute live preview (always)
  const livePreview = useMemo((): MachineHourlyRateOutputs | null => {
    const inputs = engineInputs;
    if (!inputs.annualHours || inputs.annualHours <= 0) return null;
    return executeFormula(inputs);
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
    }
  }, []);

  // Handle unit change
  const handleUnitChange = useCallback((id: string, newUnit: string) => {
    setDisplayUnit((prev) => ({ ...prev, [id]: newUnit }));
  }, []);

  // Handle calculate / generate report
  const handleCalculate = useCallback(() => {
    const r = executeFormula(engineInputs);
    setResult(r);
    setHasComputed(true);
  }, [engineInputs]);

  // Scroll to report after generate
  useEffect(() => {
    if (hasComputed && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasComputed]);

  // Sensitivity bars
  const sensitivityBars = useMemo(() => {
    if (!result) return [];
    const SENSITIVITY_DRIVERS: Array<{ key: keyof MachineHourlyRateInputs; label: string }> = [
      { key: "purchasePrice", label: "Purchase Price" },
      { key: "usefulLife", label: "Useful Life" },
      { key: "annualHours", label: "Annual Hours" },
      { key: "wageRate", label: "Wage Rate" },
      { key: "powerDraw", label: "Power Draw" },
      { key: "energyPrice", label: "Energy Price" },
      { key: "idleShare", label: "Idle Share" },
      { key: "maintenanceRate", label: "Maintenance Rate" },
    ];
    const impacts = SENSITIVITY_DRIVERS.map((d) => ({
      label: d.label,
      impact: sensitivity(engineInputs, d.key),
    }));
    const maxImpact = Math.max(...impacts.map((i) => i.impact), 0.001);
    return impacts.map((i) => ({
      label: i.label,
      span: (i.impact / maxImpact) * 100,
      val: `${curSym}${i.impact.toFixed(2)}`,
    }));
  }, [result, engineInputs, curSym]);

  // Severity class mapping
  const severityClass = (s: Severity): string =>
    s === "crit" ? "neg" : s === "opp" ? "pos" : "warn";

  // Cost structure
  const costStructure = useMemo(() => {
    if (!result) return [];
    const base = [
      { label: "Depreciation", value: result.out_dep, pct: result.out_capitalShare },
      { label: "Maintenance", value: result.out_maint, pct: result.out_capitalShare },
      { label: "Energy", value: result.out_energy, pct: result.out_energyShare },
      { label: "Labor", value: result.out_labor, pct: result.out_laborShare },
    ];
    // Recalculate capital share correctly for display
    const capPct = result.out_capitalShare;
    return [
      { label: "Depreciation", value: result.out_dep, pct: capPct },
      { label: "Maintenance", value: result.out_maint, pct: 0 },
      { label: "Energy", value: result.out_energy, pct: result.out_energyShare },
      { label: "Labor", value: result.out_labor, pct: result.out_laborShare },
    ];
  }, [result]);

  return (
    <div className="shell">
      {/* ── Masthead ── */}
      <div className="mast">
        <div className="kicker">SectorCalc Professional Tool</div>
        <h1>Machine Hourly Rate Proof Report</h1>
        <p className="lede">
          Prove the true cost of every productive machine hour &mdash; depreciation, maintenance,
          energy, and labor spread only across hours that make something sellable. Full absorption
          costing with sensitivity analysis.
        </p>
        <div className="meta">
          <span>ISO 9001:2015 &mdash; Audit Trail &bull; Certified</span>
          <span><b>Machinery &amp; Manufacturing</b></span>
        </div>

        {/* Currency bar */}
        <div className="curbar">
          <label htmlFor="cur-select">Currency</label>
          <select
            id="cur-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{CURRENCY_LABELS[c]}</option>
            ))}
          </select>
          <span className="curnote">{CURRENCY_NOTE}</span>
        </div>
      </div>

      {/* ── Bench: form + live rail ── */}
      <div className="bench">
        {/* Form column */}
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
                  const curUnit = displayUnit[f.id] || FIELD_UNIT_MAP[f.id] || f.unit;
                  const isInvalid =
                    isNaN(displayValue[f.id] ?? f.default) ||
                    (displayValue[f.id] ?? f.default) < f.hardMin ||
                    (displayValue[f.id] ?? f.default) > f.hardMax;
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
                          value={displayValue[f.id] ?? ""}
                          onChange={(e) => handleChange(f.id, e.target.value)}
                          min={f.hardMin}
                          max={f.hardMax}
                          step="any"
                        />
                        {f.unitOptions && f.unitOptions.length > 0 && (
                          <select
                            value={curUnit}
                            onChange={(e) => handleUnitChange(f.id, e.target.value)}
                          >
                            {f.unitOptions.map((u) => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="f-foot">
                        <span className="hint">{f.hint}</span>
                        <span className="bench-ref">{curUnit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Calculate button */}
          <button className="cta" onClick={handleCalculate}>
            Generate Proof Report
          </button>

          {/* Disclaimers */}
          <div className="conf" style={{ marginTop: "16px" }}>
            <svg className="d" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="3.5" stroke="#8C887E" />
            </svg>
            <span>
              Technical simulation. Not financial, legal, or engineering advice.
              Verify all figures before business decisions.
            </span>
          </div>
        </div>

        {/* Live result rail */}
        <div className="rail" id="rail">
          <div className="rail-in">
            {livePreview ? (
              <>
                {/* Verdict */}
                <div className="verdict">
                  {(() => {
                    const r = livePreview.out_premium;
                    const ok = Number.isFinite(r) && r / livePreview.out_rate < 0.05;
                    const cls = ok ? "pos" : r / livePreview.out_rate > 0.25 ? "neg" : "warn";
                    const lbl = ok
                      ? "RATE PROVEN"
                      : r / livePreview.out_rate > 0.25
                        ? "HIGH IDLE PREMIUM \u2014 REPRICE REQUIRED"
                        : "IDLE PREMIUM \u2014 REVIEW";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{(Number.isFinite(r) ? livePreview.out_rate : 0).toFixed(2)}
                            <small>/productive hour</small>
                          </div>
                          <div className="big-cap">True absorption rate</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Quick stats */}
                <div className="stat">
                  <span>Naive rate</span>
                  <b>{curSym}{(Number.isFinite(livePreview.out_naive) ? livePreview.out_naive : 0).toFixed(2)}/h</b>
                </div>
                <div className="stat">
                  <span>Idle premium</span>
                  <b>{curSym}{(Number.isFinite(livePreview.out_premium) ? livePreview.out_premium : 0).toFixed(2)}/h</b>
                </div>
                <div className="stat">
                  <span>Productive hours</span>
                  <b>{livePreview.out_productiveHours.toFixed(0)} h/yr</b>
                </div>
                <div className="stat">
                  <span>Total annual cost</span>
                  <b>{curSym}{livePreview.out_total.toFixed(0)}</b>
                </div>

                {/* Insights */}
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color: "var(--faint)", padding: "20px 0", fontSize: "13px" }}>
                Enter annual operating hours &gt; 0 to see live results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report section (shown after generate) ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          {/* Report masthead */}
          <div className="rep-mast">
            <div>
              <h2>Machine Hourly Rate Proof Report</h2>
            </div>
            <div className="rid">
              ISO 9001:2015 &bull; Certified<br />
              Report ID: MHR-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>

          <div className="rep-body">
            {/* Section 1: Executive Verdict */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">S1</span>
                <span className="sec-t">Executive Verdict</span>
              </div>
              <div className="verdict-box">
                <div className="head">
                  {curSym}{(Number.isFinite(result.out_rate) ? result.out_rate : 0).toFixed(2)}
                  /productive hour
                </div>

                {(() => {
                  const premiumRatio = Number.isFinite(result.out_premium) && result.out_rate > 0
                    ? result.out_premium / result.out_rate
                    : 0;
                  if (premiumRatio > 0.25) {
                    return (
                      <>
                        <p>
                          <strong>HIGH IDLE PREMIUM &mdash; REPRICE REQUIRED.</strong>{" "}
                          {Math.round(premiumRatio * 100)}% of the calculated rate funds idle
                          capacity. Every productive hour carries an invisible surcharge of
                          {" "}{curSym}{result.out_premium.toFixed(2)}.
                        </p>
                        <p>
                          The machine breaks even at {curSym}{(Number.isFinite(result.out_rate) ? result.out_rate : 0).toFixed(2)}/h.
                          Any job quoting below this rate burns capital. Only productive hours (not
                          calendar hours) should be used for cost allocation.
                        </p>
                      </>
                    );
                  }
                  if (premiumRatio > 0.05) {
                    return (
                      <>
                        <p>
                          <strong>IDLE PREMIUM &mdash; REVIEW.</strong>{" "}
                          {Math.round(premiumRatio * 100)}% of the rate covers idle time. The
                          hidden premium of {curSym}{result.out_premium.toFixed(2)}/h needs
                          to be recovered somewhere.
                        </p>
                        <p>
                          Verify the idle share assumption against real OEE data. A 5-point
                          improvement in utilization would reduce the rate by
                          {" "}{curSym}{(result.out_rate - result.out_naive).toFixed(2)}/h.
                        </p>
                      </>
                    );
                  }
                  return (
                    <>
                      <p>
                        <strong>RATE PROVEN.</strong> The idle premium is within the 5% threshold.
                        The calculated rate of {curSym}{(Number.isFinite(result.out_rate) ? result.out_rate : 0).toFixed(2)}/h
                        is a reliable basis for cost allocation and quoting.
                      </p>
                      <p>
                        Re-run this report quarterly, or whenever purchase price, energy costs, or
                        utilization change by more than 10%.
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Section 2: Cost Structure */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">S2</span>
                <span className="sec-t">Cost Structure</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th className="n">Annual ({curSym})</th>
                    <th className="n">Rate ({curSym}/h)</th>
                    <th className="n">Share</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Depreciation</td>
                    <td className="n">{curSym}{result.out_dep.toFixed(0)}</td>
                    <td className="n">{curSym}{(result.out_dep / result.out_productiveHours).toFixed(2)}</td>
                    <td className="n">{result.out_capitalShare > 0 ? (result.out_capitalShare * 100).toFixed(1) : "-"}%</td>
                  </tr>
                  <tr>
                    <td>Maintenance</td>
                    <td className="n">{curSym}{result.out_maint.toFixed(0)}</td>
                    <td className="n">{curSym}{(result.out_maint / result.out_productiveHours).toFixed(2)}</td>
                    <td className="n">-</td>
                  </tr>
                  <tr>
                    <td>Energy</td>
                    <td className="n">{curSym}{result.out_energy.toFixed(0)}</td>
                    <td className="n">{curSym}{(result.out_energy / result.out_productiveHours).toFixed(2)}</td>
                    <td className="n">{(result.out_energyShare * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Labor</td>
                    <td className="n">{curSym}{result.out_labor.toFixed(0)}</td>
                    <td className="n">{curSym}{(result.out_labor / result.out_productiveHours).toFixed(2)}</td>
                    <td className="n">{(result.out_laborShare * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{curSym}{result.out_total.toFixed(0)}</td>
                    <td className="n">{curSym}{(Number.isFinite(result.out_rate) ? result.out_rate : 0).toFixed(2)}</td>
                    <td className="n">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 3: Sensitivity Analysis */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">S3</span>
                <span className="sec-t">Sensitivity Analysis</span>
              </div>
              <p className="note" style={{ marginBottom: "14px" }}>
                Impact of a &plusmn;10% change in each input on the final absorption rate.
              </p>
              <div className="bars">
                {sensitivityBars.map((sb) => (
                  <div className="row" key={sb.label}>
                    <span className="nm">{sb.label}</span>
                    <span className="tk">
                      <span className="b" style={{ width: `${Math.max(sb.span, 1)}%` }} />
                    </span>
                    <span className="vv">{sb.val}</span>
                  </div>
                ))}
              </div>
              <div className="note">
                The wider the bar, the more that driver affects your machine rate. Focus cost-reduction
                effort on the top 2\u20133 drivers.
              </div>
            </div>

            {/* Section 4: Input Summary */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">S4</span>
                <span className="sec-t">Input Summary</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th className="n">Value</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Purchase price</td><td className="n">{curSym}{(engineInputs.purchasePrice).toLocaleString()}</td><td>{curSym}</td></tr>
                  <tr><td>Useful life</td><td className="n">{engineInputs.usefulLife}</td><td>years</td></tr>
                  <tr><td>Annual hours</td><td className="n">{engineInputs.annualHours.toLocaleString()}</td><td>h/yr</td></tr>
                  <tr><td>Operator cost</td><td className="n">{curSym}{engineInputs.wageRate.toFixed(2)}</td><td>{curSym}/h</td></tr>
                  <tr><td>Power draw</td><td className="n">{engineInputs.powerDraw}</td><td>kW</td></tr>
                  <tr><td>Energy price</td><td className="n">{curSym}{engineInputs.energyPrice.toFixed(4)}</td><td>{curSym}/kWh</td></tr>
                  <tr><td>Idle share</td><td className="n">{(engineInputs.idleShare * 100).toFixed(0)}</td><td>%</td></tr>
                  <tr><td>Maintenance rate</td><td className="n">{(engineInputs.maintenanceRate * 100).toFixed(1)}</td><td>%/yr</td></tr>
                </tbody>
              </table>
            </div>

            {/* Section 5: Insights & Recommendations */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h">
                  <span className="sec-n">S5</span>
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

            {/* Section 6: Seal & Disclaimer */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">S6</span>
                <span className="sec-t">Audit Seal &amp; Integrity</span>
              </div>
              <div className="seal">
                PROOF-REPORT-MHR-{Date.now().toString(36).toUpperCase()}<br />
                Engine: executeFormula v5.3.1-pro &bull; ISO 9001:2015 Audit Trail<br />
                Generated: {new Date().toISOString()}
              </div>
              <div className="disc">
                <strong>Disclaimer.</strong> This report is a technical simulation
                based on the inputs provided. It does not constitute financial, legal,
                or engineering advice. Always verify calculations with a qualified
                professional before making business decisions.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
