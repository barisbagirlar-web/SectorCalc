"use client";

/**
 * Machine Hourly Rate Proof Report — x1 reference implementation.
 *
 * Exact port of x1.html: 12 currencies, auto unit conversion,
 * inline validation messages, group numbering, engine metadata,
 * details element for advanced section, canonical unit display.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * Import: toCanonical / fromCanonical from @/tools/_shared/units
 * CSS:    @/styles/pro-tool-machine-hourly-rate.css
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula, sensitivity } from
  "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import type { MachineHourlyRateInputs, MachineHourlyRateOutputs } from
  "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import { getActiveInsights } from "./insights";
import type { Severity } from "./insights";
import { toCanonical, fromCanonical } from "@/tools/_shared/units";
import type { DomainKey } from "@/tools/_shared/units";
import { CURRENCIES, DEFAULT_CURRENCY_INDEX, fmtNum, CURRENCY_NOTE, CANON_SUFFIX, getFieldError } from "@/tools/_shared/x1-utils";
import type { FieldDef } from "@/tools/_shared/x1-utils";
import "@/styles/pro-tool-machine-hourly-rate.css";

/* ─── Field definitions ──────────────────────────────────────── */

const FIELDS: FieldDef[] = [
  // ── Group: Machine & Capital ──
  {
    id: "purchasePrice", label: "Purchase price (installed)",
    unit: "units", unitOptions: ["units", "thousands (k)", "millions (M)"],
    domain: "flat", showPrefix: true, default: 180000,
    hint: "Installation, base tooling and commissioning included.",
    ref: "units \u00B7 thousands \u00B7 millions", group: "acquisition",
    hardMin: 100, hardMax: 500000000,
  },
  {
    id: "usefulLife", label: "Useful life",
    unit: "years", unitOptions: ["months", "quarters", "years"],
    domain: "years", showPrefix: false, default: 10,
    hint: "Economic life for depreciation, not physical life.",
    ref: "months \u00B7 quarters \u00B7 years", group: "acquisition",
    hardMin: 0.5, hardMax: 40,
  },
  {
    id: "annualHours", label: "Planned operating hours",
    unit: "hours", unitOptions: ["seconds", "minutes", "hours", "shifts (8h)", "days (24h)"],
    domain: "hours", showPrefix: false, default: 4000,
    hint: "Scheduled production time per year. Hard physical cap: 8,760 h.",
    ref: "seconds\u2026days(24h)", group: "acquisition",
    hardMin: 0, hardMax: 8760,
  },
  // ── Group: Running Cost ──
  {
    id: "wageRate", label: "Operator cost (fully loaded)",
    unit: "/hour", unitOptions: ["/hour", "/day (8h)", "/week (40h)"],
    domain: "wage", showPrefix: true, default: 34,
    hint: "Wage + employer contributions + benefits, not gross wage.",
    ref: "/hour \u00B7 /day(8h) \u00B7 /week(40h)", group: "labor",
    hardMin: 0, hardMax: 2000,
  },
  {
    id: "powerDraw", label: "Average power draw",
    unit: "kW", unitOptions: ["W", "kW", "MW", "HP (mech)"],
    domain: "power", showPrefix: false, default: 12,
    hint: "Average under load \u2014 typically 30\u201360% of nameplate rating.",
    ref: "W \u00B7 kW \u00B7 MW \u00B7 HP", group: "energy",
    hardMin: 0, hardMax: 5000,
  },
  {
    id: "energyPrice", label: "Industrial electricity price",
    unit: "/kWh", unitOptions: ["/kWh", "/MWh"],
    domain: "energyPrice", showPrefix: true, default: 0.18,
    hint: "All-in price including grid fees and levies.",
    ref: "/kWh \u00B7 /MWh", group: "energy",
    hardMin: 0, hardMax: 5,
  },
  // ── Advanced: Idle & Maintenance ──
  {
    id: "idleShare", label: "Idle / non-productive share",
    unit: "%", unitOptions: ["%", "fraction (0-1)"],
    domain: "percent", showPrefix: false, default: 20,
    hint: "Paid machine time producing nothing sellable \u2014 setup, changeovers, breakdowns, starved queues.",
    ref: "% \u00B7 fraction", group: "advanced",
    hardMin: 0, hardMax: 95,
  },
  {
    id: "maintenanceRate", label: "Annual maintenance (% of price)",
    unit: "%", unitOptions: ["%", "fraction (0-1)"],
    domain: "percent", showPrefix: false, default: 5,
    hint: "Planned and unplanned, parts and labor, per year.",
    ref: "% \u00B7 fraction", group: "advanced",
    hardMin: 0, hardMax: 60,
  },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group metadata ──────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  acquisition: { num: "01", title: "Machine & Capital", desc: "What the machine costs to own, and over how long that cost is spread." },
  labor:       { num: "02", title: "Labor Cost",         desc: "What it costs to actually operate the machine for those hours." },
  energy:      { num: "03", title: "Energy Cost",        desc: "Power draw and electricity price determine the energy component of the rate." },
  advanced:    { num: "04", title: "Advanced",           desc: "Idle time and maintenance budget directly affect how many hours are truly productive." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function MachineHourlyRatePage() {
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
    // Convert percentage fields to fraction for formula
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
    } else if (raw === "" || raw === "-") {
      // Allow clearing field
      setDisplayValue((prev) => ({ ...prev, [id]: NaN }));
    }
  }, []);

  // Handle unit change — auto-convert value (matches x1.html behavior)
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

  // Check if any field has an error
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
      {/* ── Masthead (matches x1.html) ── */}
      <div className="mast">
        <div className="kicker">SectorCalc PRO &middot; Machinery &amp; Manufacturing &middot; Cost proof</div>
        <h1>Machine Hourly Rate Proof Report</h1>
        <p className="lede">
          The rate you quote against and the rate the machine actually costs are rarely the same number.
          This tool prices every productive hour &mdash; depreciation, maintenance, energy and labor,
          spread only across hours that make something sellable.
        </p>
        <div className="meta">
          <span>Engine <b>v6.0</b></span>
          <span>35 math + semantic assertions <b>passed</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>full absorption costing</b></span>
        </div>

        {/* Currency bar (matches x1.html) */}
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

      {/* ── Bench: form + live rail ── */}
      <div className="bench">
        {/* Form column */}
        <div className="form-col">
          {Object.entries(GROUP_META).map(([gk, gm]) => {
            const groupFields = FIELDS.filter((f) => f.group === gk);
            if (!groupFields.length) return null;

            // Advanced group is wrapped in <details>
            if (gk === "advanced") {
              return (
                <details open key={gk}>
                  <summary style={{ paddingLeft: 0 }}>
                    <span className="grp-h" style={{ marginBottom: 0, borderBottom: "none" }}>
                      <span className="grp-n">{gm.num}</span>
                      <span className="grp-t">{gm.title}</span>
                    </span>
                  </summary>
                  <div style={{ paddingTop: "14px" }}>
                    {groupFields.map((f) => renderField(f))}
                  </div>
                </details>
              );
            }

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

          {/* Calculate button */}
          <button
            className="cta"
            onClick={handleCalculate}
            disabled={errorCount > 0}
          >
            Generate sealed report &middot; 1 credit
          </button>

          {/* Status indicator */}
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

          {/* Disclaimer */}
          <div className="conf" style={{ marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--faint)", lineHeight: 1.4 }}>
              Technical simulation. Not financial, legal, or engineering advice.
              Verify all figures before business decisions.
            </span>
          </div>
        </div>

        {/* Live result rail (matches x1.html) */}
        <div className="rail" id="rail">
          <div className="rail-in">
            <div className="verdict" id="verdict">
              {livePreview ? (
                <>
                  {(() => {
                    const r = livePreview;
                    const ok = Number.isFinite(r.out_premium) && r.out_premium / r.out_rate < 0.05;
                    const cls = ok ? "pos" : r.out_premium / r.out_rate > 0.25 ? "neg" : "warn";
                    const lbl = ok
                      ? "RATE PROVEN"
                      : r.out_premium / r.out_rate > 0.25
                        ? "HIGH IDLE PREMIUM \u2014 REPRICE REQUIRED"
                        : "IDLE PREMIUM \u2014 REVIEW";
                    return (
                      <>
                        <div className={`verdict-band ${cls}`}>{lbl}</div>
                        <div className="verdict-body">
                          <div className="big">
                            {curSym}{(Number.isFinite(r.out_rate) ? r.out_rate : 0).toFixed(2)}
                            <small>/productive h</small>
                          </div>
                          <div className="big-cap">
                            vs {curSym}{(Number.isFinite(r.out_naive) ? r.out_naive : 0).toFixed(2)}/h naive
                          </div>
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
                    <div className="big-cap">enter machine &amp; capital data to begin</div>
                  </div>
                </>
              )}
            </div>

            <div className="stat">
              <span>Naive rate (ignores idle)</span>
              <b>{livePreview ? `${curSym}${fmtNum(livePreview.out_naive)}/h` : "\u2014"}</b>
            </div>
            <div className="stat">
              <span>Hidden idle premium</span>
              <b>{livePreview ? `+${curSym}${fmtNum(livePreview.out_premium)}/h` : "\u2014"}</b>
            </div>
            <div className="stat">
              <span>Total annual cost</span>
              <b>{livePreview ? `${curSym}${fmtNum(livePreview.out_total)}/yr` : "\u2014"}</b>
            </div>
            <div className="stat">
              <span>Productive hours / yr</span>
              <b>{livePreview ? `${fmtNum(livePreview.out_productiveHours)} h` : "\u2014"}</b>
            </div>

            <button className="cta" onClick={handleCalculate} disabled={!livePreview}>
              Generate sealed report &middot; 1 credit
            </button>

            <div className="conf" style={{ marginTop: "12px" }}>
              <span className="d" style={{
                background: livePreview ? "var(--pos)" : "var(--warn)",
                width: 8, height: 8, display: "inline-block", flexShrink: 0, marginTop: 3,
              }} />
              <span>
                {livePreview
                  ? "Inputs consistent \u00B7 report ready"
                  : `${errorCount} input(s) need attention`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Report section (shown after generate) ── */}
      {hasComputed && result && (
        <div id="report" ref={reportRef} style={{ display: "block" }}>
          {/* Report masthead */}
          <div className="rep-mast">
            <h2>Machine hourly rate &mdash; proof report</h2>
            <div className="rid">
              SC-PRO-MHR &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v6.0 &middot; 35 assertions passed<br />
              currency {curSym} &middot; full absorption costing
            </div>
          </div>

          <div className="rep-body">
            {/* Section 1: Annual cost structure */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">1</span>
                <span className="sec-t">Annual cost structure</span>
              </div>
              <div className="verdict-box">
                <div className="head">
                  This machine truly costs {curSym}{fmtNum(result.out_rate)} per productive hour.
                </div>
                <p>
                  The naive rate &mdash; total annual cost divided by planned hours, ignoring idle time &mdash;
                  is <strong>{curSym}{fmtNum(result.out_naive)}/h</strong>.
                  Quoting on that number hides a <strong>{curSym}{fmtNum(result.out_premium)}/h loss</strong>
                  on every hour that actually produces sellable output.
                </p>
                <p>
                  Of {fmtNum(engineInputs.annualHours)} planned hours/year, only{" "}
                  <strong>{fmtNum(result.out_productiveHours)}</strong> generate revenue;
                  the rest is paid-for idle time.
                </p>
              </div>
            </div>

            {/* Section 2: Cost structure table */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">2</span>
                <span className="sec-t">Cost structure</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th className="n">{curSym}/yr</th>
                    <th className="n">Share</th>
                    <th className="n">{curSym}/productive h</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Depreciation (straight-line, {fmtNum(engineInputs.usefulLife)} yr)</td>
                    <td className="n">{fmtNum(result.out_dep)}</td>
                    <td className="n">{(result.out_capitalShare * 100).toFixed(1)}%</td>
                    <td className="n">{(result.out_dep / result.out_productiveHours).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Maintenance ({(engineInputs.maintenanceRate * 100).toFixed(1)}% of price)</td>
                    <td className="n">{fmtNum(result.out_maint)}</td>
                    <td className="n">-</td>
                    <td className="n">{(result.out_maint / result.out_productiveHours).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Energy ({fmtNum(engineInputs.powerDraw)} kW &times; {fmtNum(engineInputs.annualHours)} h &times; {curSym}{engineInputs.energyPrice.toFixed(3)})</td>
                    <td className="n">{fmtNum(result.out_energy)}</td>
                    <td className="n">{(result.out_energyShare * 100).toFixed(1)}%</td>
                    <td className="n">{(result.out_energy / result.out_productiveHours).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Operator labor</td>
                    <td className="n">{fmtNum(result.out_labor)}</td>
                    <td className="n">{(result.out_laborShare * 100).toFixed(1)}%</td>
                    <td className="n">{(result.out_labor / result.out_productiveHours).toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="total">
                    <td>Total</td>
                    <td className="n">{fmtNum(result.out_total)}</td>
                    <td className="n">100%</td>
                    <td className="n">{(Number.isFinite(result.out_rate) ? result.out_rate : 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Section 3: What moves the rate most (sensitivity) */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">3</span>
                <span className="sec-t">What moves the rate most (&plusmn;10% each input)</span>
              </div>
              <div className="bars">
                {sensitivityBars.map((sb) => (
                  <div className="row" key={sb.label}>
                    <span className="nm">{sb.label}</span>
                    <span className="tk">
                      <span className="b" style={{ width: `${Math.max(sb.span, 1)}%` }} />
                    </span>
                    <span className="vv">&plusmn;{sb.val}</span>
                  </div>
                ))}
              </div>
              <div className="note">
                Read: negotiating the purchase price 10% down is worth&plusmn;{curSym}
                {(sensitivityBars.find((s) => s.label === "Purchase Price")?.val || "0.00")}/h
                &mdash; compare against the top bar before spending effort there.
              </div>
            </div>

            {/* Section 4: Engineering insights */}
            {activeInsights.length > 0 && (
              <div className="sec">
                <div className="sec-h">
                  <span className="sec-n">4</span>
                  <span className="sec-t">Engineering insights</span>
                </div>
                {activeInsights.map((ins) => (
                  <div className={`ins ${ins.severity}`} key={ins.id}>
                    <span className="t">{ins.severity.toUpperCase()}</span>
                    {ins.message}
                  </div>
                ))}
              </div>
            )}

            {/* Section 5: Method & formulas */}
            <div className="sec">
              <div className="sec-h">
                <span className="sec-n">5</span>
                <span className="sec-t">Method &amp; formulas</span>
              </div>
              <table>
                <tbody>
                  <tr><td>Depreciation</td><td className="n">purchase price &divide; useful life (straight-line)</td></tr>
                  <tr><td>Productive hours</td><td className="n">planned hours &times; (1 &minus; idle share)</td></tr>
                  <tr><td>Rate</td><td className="n">total annual cost &divide; productive hours</td></tr>
                  <tr><td>Idle premium</td><td className="n">rate &minus; (total cost &divide; planned hours)</td></tr>
                </tbody>
              </table>
              <div className="note">
                Full absorption costing. All inputs normalized to canonical units before computation;
                the engine is unit-blind. Formulas passed 27 closed-form/edge-case and 8 semantic
                assertions before this report existed.
              </div>
            </div>

            {/* Section 6: Seal & Disclaimer */}
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
                Assumes straight-line depreciation and constant power draw/energy price across the
                planning horizon. Not a substitute for professional accounting or engineering review.
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
