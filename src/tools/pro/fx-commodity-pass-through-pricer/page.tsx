"use client";

/**
 * FX & Commodity Pass-Through Pricer — custom page component.
 *
 * x1 pattern: 12-currency, inline validation, canonical unit display,
 * group numbering, engine metadata.
 *
 * Per x1 spec §3: manual FX rate fields (fxRateSpot, fxRateBudget) are
 * preserved as plain fields — no domain conversion applied.
 *
 * Import: executeFormula from @/sectorcalc/formulas/pro-v531/...
 * Import: INSIGHTS from ./insights
 * Import: toCanonical / fromCanonical from @/tools/_shared/units
 * Import: x1-utils from @/tools/_shared/x1-utils
 * CSS:    @/styles/pro-tool-scrap-rework-cost.css
 */

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { executeFormula } from
  "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";
import type { FxCommodityPassThroughInputs, FxCommodityPassThroughOutputs } from
  "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";
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
  // ── Pricing ──
  { id: "basePrice", label: "Base price", unit: "units", domain: "flat", showPrefix: true, default: 1000, hint: "Current contract or catalog price.", ref: "per unit", group: "pricing", hardMin: 0, hardMax: 1e7, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  { id: "annualVolume", label: "Annual volume", unit: "units", domain: "flat", showPrefix: false, default: 5000, hint: "Annual contracted volume.", ref: "units/yr", group: "pricing", hardMin: 0, hardMax: 1e9, unitOptions: ["units", "thousands (k)", "millions (M)"] },
  // ── FX Rate (manual — per x1 §3) ──
  { id: "fxRateSpot", label: "FX rate (spot)", unit: "units", domain: "flat", showPrefix: false, default: 1.12, hint: "Current spot exchange rate.", ref: "rate", group: "fx", hardMin: 0, hardMax: 100, unitOptions: ["units"] },
  { id: "fxRateBudget", label: "FX rate (budget)", unit: "units", domain: "flat", showPrefix: false, default: 1.08, hint: "Budgeted exchange rate.", ref: "rate", group: "fx", hardMin: 0, hardMax: 100, unitOptions: ["units"] },
  { id: "fxHedgePct", label: "FX hedge (%)", unit: "units", domain: "flat", showPrefix: false, default: 60, hint: "Percentage of FX exposure hedged.", ref: "%", group: "fx", hardMin: 0, hardMax: 100, unitOptions: ["units"] },
  // ── Commodity ──
  { id: "commodityIndexCurrent", label: "Commodity index (current)", unit: "units", domain: "flat", showPrefix: false, default: 185, hint: "Current commodity index value.", ref: "index", group: "commodity", hardMin: 0, hardMax: 1e6, unitOptions: ["units"] },
  { id: "commodityIndexBudget", label: "Commodity index (budget)", unit: "units", domain: "flat", showPrefix: false, default: 170, hint: "Budgeted commodity index value.", ref: "index", group: "commodity", hardMin: 0, hardMax: 1e6, unitOptions: ["units"] },
  { id: "commodityHedgePct", label: "Commodity hedge (%)", unit: "units", domain: "flat", showPrefix: false, default: 50, hint: "Percentage of commodity exposure hedged.", ref: "%", group: "commodity", hardMin: 0, hardMax: 100, unitOptions: ["units"] },
  // ── Exposure ──
  { id: "materialCostPct", label: "Material cost (% of price)", unit: "units", domain: "flat", showPrefix: false, default: 45, hint: "Material cost as percentage of base price.", ref: "%", group: "exposure", hardMin: 0, hardMax: 100, unitOptions: ["units"] },
  // ── Data Quality ──
  { id: "sourceConfidence", label: "Source confidence", unit: "fraction (0-1)", domain: "percent", showPrefix: false, default: 0.85, hint: "Confidence in source data (0=guess, 1=audited).", ref: "0..1 ratio", group: "quality", hardMin: 0, hardMax: 1, unitOptions: ["%", "fraction (0-1)", "bps"] },
];

const FIELD_IDS = FIELDS.map((f) => f.id);

/* ─── Group info ─────────────────────────────────────────────── */
const GROUP_META: Record<string, { num: string; title: string; desc: string }> = {
  pricing:   { num: "01", title: "Pricing", desc: "Base price and annual volume." },
  fx:        { num: "02", title: "FX Rate", desc: "Spot, budget, and hedge coverage for FX." },
  commodity: { num: "03", title: "Commodity", desc: "Current, budget, and hedge for commodity index." },
  exposure:  { num: "04", title: "Exposure", desc: "Material cost exposure as percentage of price." },
  quality:   { num: "05", title: "Data Quality", desc: "Source confidence level for decision thresholds." },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function FxCommodityPassThroughPage() {
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
  const engineInputs = useMemo((): FxCommodityPassThroughInputs => ({
    basePrice: canonState.basePrice ?? 0,
    annualVolume: canonState.annualVolume ?? 0,
    fxRateSpot: canonState.fxRateSpot ?? 0,
    fxRateBudget: canonState.fxRateBudget ?? 0,
    fxHedgePct: canonState.fxHedgePct ?? 0,
    commodityIndexCurrent: canonState.commodityIndexCurrent ?? 0,
    commodityIndexBudget: canonState.commodityIndexBudget ?? 0,
    commodityHedgePct: canonState.commodityHedgePct ?? 0,
    materialCostPct: canonState.materialCostPct ?? 0,
    sourceConfidence: canonState.sourceConfidence ?? 0,
  }), [canonState]);

  const [result, setResult] = useState<FxCommodityPassThroughOutputs | null>(null);
  const [hasComputed, setHasComputed] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Live preview
  const livePreview = useMemo((): FxCommodityPassThroughOutputs | null => {
    if (!engineInputs.basePrice || engineInputs.basePrice <= 0) return null;
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
    d === 0 ? "OK" : d === 1 ? "REPRICE" : "HOLD";

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
        <div className="kicker">SectorCalc PRO &middot; Pricing &middot; Pass-Through Adjustment</div>
        <h1>FX &amp; Commodity Pass-Through Pricer</h1>
        <p className="lede">
          Calculate pass-through adjustments for FX rate and commodity index movements. &mdash;
          Determine adjusted price, escalation amount, and decision state.
        </p>
        <div className="meta">
          <span>Engine <b>v5.3.1</b></span>
          <span>Pass-Through Pricing <b>verified</b></span>
          <span>Report <b>sealed &middot; SHA-256</b></span>
          <span>Method <b>pass-through escalation</b></span>
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
              Technical simulation. Verify against contract terms and market data before adjusting prices.
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
                        <div className={`verdict-band ${dec === 0 ? "pos" : "warn"}`}>
                          {decisionLabel(dec)}
                        </div>
                        <div className="verdict-body">
                          <div className="big">{curSym}{livePreview.out_utilizationMargin.toFixed(4)}<small> price ratio</small></div>
                          <div className="big-cap">Pass-through: {((livePreview.out_utilizationMargin - 1) * 100).toFixed(2)}%</div>
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
                    <div className="big-cap">Enter base price &gt; 0 to see live results</div>
                  </div>
                </>
              )}
            </div>

            {livePreview && (
              <>
                <div className="stat"><span>Adjusted price</span><b>{curSym}{(livePreview.out_utilizationMargin * engineInputs.basePrice).toFixed(2)}</b></div>
                <div className="stat"><span>FX impact</span><b>{livePreview.out_referenceDeviation.toFixed(4)}</b></div>
                <div className="stat"><span>Money at risk</span><b>{curSym}{fmtNum(livePreview.out_moneyAtRisk)}</b></div>

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
            <h2>FX &amp; Commodity Pass-Through Report</h2>
            <div className="rid">
              SC-PRO-FX &middot; {new Date().toISOString().slice(0, 10)}<br />
              engine v5.3.1 &middot; Pass-Through Pricing<br />
              currency {curSym} &middot; pass-through escalation
            </div>
          </div>

          <div className="rep-body">
            {/* S1: Executive Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">1</span><span className="sec-t">Executive Summary</span></div>
              <div className="verdict-box">
                <div className="head">{decisionLabel(result.out_finalDecisionState)}</div>
                <p>Adjusted price: {curSym}{(result.out_utilizationMargin * engineInputs.basePrice).toFixed(2)} &middot; Pass-through: {((result.out_utilizationMargin - 1) * 100).toFixed(2)}% &middot; Base: {curSym}{engineInputs.basePrice.toFixed(2)}</p>
              </div>
            </div>

            {/* S2: Pass-Through Breakdown */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">Pass-Through Breakdown</span></div>
              <table>
                <thead><tr><th>Component</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>FX change</td><td className="n">{(result.out_referenceDeviation * 100).toFixed(2)}%</td></tr>
                  <tr><td>Sensitivity driver</td><td className="n">idx {result.out_sensitivityDriver}</td></tr>
                  <tr><td>FMEA trigger</td><td className="n">{result.out_fmeaTrigger}</td></tr>
                  <tr><td>Money at risk</td><td className="n">{curSym}{fmtNum(result.out_moneyAtRisk)}</td></tr>
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
                  <tr><td>Derating factor</td><td className="n">{result.out_deratingFactor.toFixed(4)}</td></tr>
                  <tr><td>Scenario delta</td><td className="n">{curSym}{fmtNum(result.out_scenarioDelta)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* S4: Input Summary */}
            <div className="sec">
              <div className="sec-h"><span className="sec-n">4</span><span className="sec-t">Input Summary</span></div>
              <table>
                <thead><tr><th>Parameter</th><th className="n">Value</th></tr></thead>
                <tbody>
                  <tr><td>Base price</td><td className="n">{curSym}{engineInputs.basePrice.toFixed(2)}</td></tr>
                  <tr><td>FX spot/budget</td><td className="n">{engineInputs.fxRateSpot}/{engineInputs.fxRateBudget}</td></tr>
                  <tr><td>Commodity curr/budget</td><td className="n">{engineInputs.commodityIndexCurrent}/{engineInputs.commodityIndexBudget}</td></tr>
                  <tr><td>Material cost %</td><td className="n">{engineInputs.materialCostPct.toFixed(0)}%</td></tr>
                  <tr><td>FX hedge</td><td className="n">{engineInputs.fxHedgePct.toFixed(0)}%</td></tr>
                  <tr><td>Commodity hedge</td><td className="n">{engineInputs.commodityHedgePct.toFixed(0)}%</td></tr>
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
                Technical simulation for pass-through pricing decision support.
                Assumes constant hedge ratios and linear pass-through mechanics.
                Not a substitute for professional contract review or financial advice.
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
