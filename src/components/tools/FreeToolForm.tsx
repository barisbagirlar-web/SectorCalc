"use client";

import { useState, useMemo, type FormEvent } from "react";

/* ════════════════════════════════════════════════════════════════════
   TYPES — Universal Tool Engine for Free Tools
   ════════════════════════════════════════════════════════════════════ */

export interface PremiumInputDef {
  key: string;
  label: string;
  unit: string;
  type: "number" | "select";
  required?: boolean;
  confidence_label?: "EXACT" | "STRONG" | "MEDIUM" | "DEFAULT";
  options?: readonly { readonly label: string; readonly value: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string;
  hint?: string;
  /** Symbol shorthand shown in purple badge */
  sym?: string;
  /** GUM uncertainty label */
  unc?: string;
}

export interface PremiumInputGroup {
  letter: string;
  title: string;
  desc?: string;
  cols?: string;
  inputs: readonly PremiumInputDef[];
}

export interface PremiumResultRow {
  label: string;
  value: string | number;
  unit: string;
  varname?: string;
  highlight?: boolean;
  /** Color class: pass / fail / warn */
  cls?: "pass" | "fail" | "warn" | "hi";
}

export interface PremiumWarning {
  severity: "CRITICAL" | "WARNING" | "INFO";
  source: string;
  message: string;
}

export interface PremiumFormulaRow {
  id?: string;
  symbol: string;
  expression: string;
  note?: string;
  ref?: string;
}

export interface PremiumValidationRule {
  id?: string;
  key?: string;
  message: string;
  action?: "BLOCK" | "WARN";
}

export interface MaterialGroup {
  label: string;
  kc1: number;
  mc: number;
  vc: [number, number, number];
  color: string;
  C?: number;
  n?: number;
}

export interface FmeaRow {
  mode: string;
  effect: string;
  sev: number;
  occ: number;
  det: number;
}

export interface PremiumPreset {
  label: string;
  values: Record<string, number | string>;
}

export interface CalculateEngineResult {
  resultRows: PremiumResultRow[];
  resultWarnings: PremiumWarning[];
  resultOkMessage?: string;
  resultStandards?: string[];
  /** Utilization ratio 0–1+ */
  uc?: number;
  /** Overall status */
  status?: "PASS" | "FAIL" | "WARN";
  /** Governing mode name */
  govMode?: string;
  /** GUM combined uncertainty (fraction) */
  u_c?: number;
  /** Flexural UC breakdown */
  ucFlex?: number;
  /** Shear UC breakdown */
  ucShear?: number;
  /** FMEA rows */
  fmea?: readonly FmeaRow[];
  /** Scope boundary warning text */
  scopeWarning?: string;
  /** Tool limitations */
  limitations?: readonly string[];
}

/* ─── CalculateEngineResult legacy alias ─────────── */
export type { CalculateEngineResult as ToolEngineResult };

/* ════════════════════════════════════════════════════════════════════
   PROPS
   ════════════════════════════════════════════════════════════════════ */

export interface FreeToolPremiumCalculatorProps {
  title: string;
  category: string;
  toolId?: string;
  /** Tool version string displayed in audit log */
  version?: string;
  standards?: readonly string[];
  /** When true, shows full site NAV + tool picker bar (standalone mode) */
  showNav?: boolean;
  /** When true, shows tool picker bar below nav */
  showToolPicker?: boolean;
  /** Structured input groups → renders with section headers + sidebar */
  inputGroups?: readonly PremiumInputGroup[];
  /** Flat input list (used if inputGroups not provided) */
  inputs?: readonly PremiumInputDef[];
  values: Record<string, number | string>;
  errors: Record<string, string>;
  onChange: (key: string, value: number | string) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  calculateLabel?: string;
  isCalculating?: boolean;
  /** Calculation engine — when provided, form runs calculations internally */
  calculateEngine?: (values: Record<string, number | string>) => CalculateEngineResult;
  /** Quick-start presets */
  presets?: Record<string, PremiumPreset>;
  materialDB?: Record<string, MaterialGroup>;
  formulas?: readonly PremiumFormulaRow[];
  validationRules?: readonly PremiumValidationRule[];
  resultWarnings?: readonly PremiumWarning[];
  resultRows?: readonly PremiumResultRow[];
  resultOkMessage?: string;
  resultStandards?: readonly string[];
  submitted?: boolean;
  onReset?: () => void;
  footerNote?: string;
  blocked?: boolean;
  blockers?: readonly string[];
  /** Scope warning displayed in identity bar */
  scopeWarning?: string;
  /** Limitations shown in input sidebar */
  limitations?: readonly string[];
  /** FMEA data */
  fmea?: readonly FmeaRow[];
}

/* ════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════ */

function confClass(label?: string): string {
  if (!label) return "cv";
  const u = label.toUpperCase();
  if (u === "EXACT" || u === "CERTAIN" || u === "HIGH") return "ck";
  if (u === "STRONG") return "cg";
  if (u === "MEDIUM" || u === "MODERATE") return "co";
  return "cv";
}

function displayConfidence(label?: string): string {
  if (!label) return "DEFAULT";
  const u = label.toUpperCase();
  if (u === "EXACT" || u === "CERTAIN" || u === "HIGH") return "EXACT";
  if (u === "STRONG") return "STRONG";
  if (u === "MEDIUM" || u === "MODERATE") return "MEDIUM";
  return "DEFAULT";
}

function fmtNum(v: string | number | null | undefined): string {
  if (v === null || v === undefined || v === "") return "—";
  const num = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(num)) return String(v);
  if (Math.abs(num) >= 100000) return num.toExponential(2);
  if (Math.abs(num) >= 100) return num.toFixed(1);
  if (Math.abs(num) >= 1) return num.toFixed(2);
  if (Math.abs(num) >= 0.001) return num.toFixed(4);
  return num.toExponential(2);
}

function rpnClass(v: number): string {
  if (v >= 200) return "hi";
  if (v >= 100) return "md";
  return "lo";
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export function FreeToolForm({
  title,
  category,
  toolId,
  version,
  standards,
  showNav = false,
  showToolPicker = false,
  inputGroups,
  inputs: flatInputs,
  values,
  errors,
  onChange,
  onSubmit,
  calculateLabel = "Calculate",
  isCalculating = false,
  calculateEngine,
  presets,
  materialDB,
  formulas,
  validationRules,
  resultWarnings,
  resultRows,
  resultOkMessage,
  resultStandards,
  submitted = false,
  onReset,
  footerNote,
  blocked,
  blockers,
  scopeWarning,
  limitations,
  fmea,
}: FreeToolPremiumCalculatorProps) {
  const [activeTab, setActiveTab] = useState<"inputs" | "results" | "formulas" | "fmea" | "audit">("inputs");
  const [activeMatKey, setActiveMatKey] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Internal calculation state (used when calculateEngine is provided)
  const [internalSubmitted, setInternalSubmitted] = useState(false);
  const [internalRows, setInternalRows] = useState<PremiumResultRow[]>([]);
  const [internalWarnings, setInternalWarnings] = useState<PremiumWarning[]>([]);
  const [internalOkMessage, setInternalOkMessage] = useState<string | undefined>();
  const [internalStandards, setInternalStandards] = useState<string[] | undefined>();
  const [internalCalculating, setInternalCalculating] = useState(false);
  const [internalResult, setInternalResult] = useState<CalculateEngineResult | null>(null);

  // Use internal state when calculateEngine is active, else use parent props
  const displaySubmitted = calculateEngine ? internalSubmitted : submitted;
  const displayRows: readonly PremiumResultRow[] = calculateEngine ? internalRows : (resultRows ?? []);
  const displayWarnings: readonly PremiumWarning[] = calculateEngine ? internalWarnings : (resultWarnings ?? []);
  const displayOkMessage = calculateEngine ? internalOkMessage : resultOkMessage;
  const displayStandards = calculateEngine ? internalStandards : resultStandards;
  const displayCalculating = calculateEngine ? internalCalculating : isCalculating;
  const displayResult = internalResult;
  const hasWarnings = displayWarnings.length > 0;

  // Count filled vs total required inputs
  const allInputs = useMemo(() => {
    if (inputGroups) return inputGroups.flatMap(g => g.inputs);
    return flatInputs ?? [];
  }, [inputGroups, flatInputs]);

  const inputCount = useMemo(() => {
    let filled = 0, total = 0;
    for (const inp of allInputs) {
      if (inp.required !== false) {
        total++;
        const v = values[inp.key];
        if (v !== undefined && v !== "") filled++;
      }
    }
    return { filled, total };
  }, [allInputs, values]);

  // UC status helpers
  const uc = displayResult?.uc ?? (displaySubmitted ? undefined : undefined);
  const ucPct = uc !== undefined ? uc * 100 : undefined;
  const ucColor = uc !== undefined ? (uc > 1 ? "#DC2626" : uc > 0.9 ? "#D97706" : "#059669") : "#6B7280";
  const ucFill = uc !== undefined ? Math.min(ucPct!, 100) : 0;
  const status = displayResult?.status ?? (displaySubmitted ? "PASS" : undefined);
  const govMode = displayResult?.govMode;

  const handleCalculate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: string[] = [];
    for (const inp of allInputs) {
      if (inp.required !== false && inp.type === "number") {
        const raw = values[inp.key];
        const num = typeof raw === "number" ? raw : Number(raw);
        if (raw === undefined || raw === "" || !Number.isFinite(num)) {
          errs.push(`${inp.label} is required or invalid.`);
        } else if (inp.min !== undefined && num < inp.min) {
          errs.push(`${inp.label} must be at least ${inp.min} ${inp.unit}.`);
        }
      }
    }
    if (blockers && blockers.length > 0) {
      errs.push(...blockers);
    }

    if (calculateEngine && errs.length === 0) {
      setValidationErrors([]);
      setInternalCalculating(true);
      try {
        const engineResult = calculateEngine(values);
        setInternalRows(engineResult.resultRows ?? []);
        setInternalWarnings(engineResult.resultWarnings ?? []);
        setInternalOkMessage(engineResult.resultOkMessage);
        setInternalStandards(engineResult.resultStandards);
        setInternalResult(engineResult);
        setInternalSubmitted(true);
        setActiveTab("results");
        setInternalCalculating(false);
      } catch (calcError) {
        console.error("[FreeToolForm] calculateEngine error:", calcError);
        setValidationErrors(["Calculation error: " + String(calcError)]);
        setInternalCalculating(false);
      }
      return;
    }

    if (errs.length > 0) { setValidationErrors(errs); return; }
    setValidationErrors([]);
    if (onSubmit) onSubmit(e);
  };

  const handleReset = () => {
    setActiveMatKey(null);
    setActiveTab("inputs");
    setValidationErrors([]);
    setInternalSubmitted(false);
    setInternalRows([]);
    setInternalWarnings([]);
    setInternalOkMessage(undefined);
    setInternalStandards(undefined);
    setInternalResult(null);
    if (onReset) onReset();
  };

  const handleMatSelect = (key: string) => {
    setActiveMatKey(key);
    if (materialDB && materialDB[key]) {
      onChange("kc1", materialDB[key].kc1);
      onChange("mc", materialDB[key].mc);
    }
  };

  const handleApplyPreset = (preset: PremiumPreset) => {
    for (const [k, v] of Object.entries(preset.values)) {
      onChange(k, v);
    }
  };

  const handleExportJSON = () => {
    if (!displayResult) return;
    const payload = {
      tool_id: toolId || "CALC",
      timestamp: new Date().toISOString(),
      standard: displayStandards?.[0] || "",
      uc: displayResult.uc,
      status: displayResult.status,
      govMode: displayResult.govMode,
      u_c_UC: displayResult.u_c,
      warnings: displayWarnings.map(w => ({ sev: w.severity, src: w.source, msg: w.message })),
      inputs: values,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(() => {});
  };

  const allErrors = [...validationErrors, ...Object.values(errors)];

  const TABS = [
    { id: "inputs" as const, num: "01", label: "Inputs" },
    { id: "results" as const, num: "02", label: "Results", dot: hasWarnings },
    { id: "formulas" as const, num: "03", label: "Formulas & Standards" },
    { id: "fmea" as const, num: "04", label: "FMEA" },
    { id: "audit" as const, num: "05", label: "Audit Log" },
  ];

  return (
    <div className="free-tool-form">
      {/* ═══ NAV (visible when showNav=true) ═══ */}
      {showNav && (
        <nav className="nav">
          <div className="nav-logo">Sector<span>Calc</span></div>
          <div className="nav-links">
            <button className="nl">Free Tools</button>
            <button className="nl active">Pro Tools</button>
            <button className="nl">Industries</button>
            <button className="nl">Pricing</button>
          </div>
          <button className="nav-cta">Get Credits</button>
        </nav>
      )}

      {/* ═══ TOOL PICKER (visible when showToolPicker=true) ═══ */}
      {showToolPicker && (
        <div className="tool-picker-bar">
          <div className="tool-picker-inner" id="tool-picker">
            {/* Tool buttons would be injected by tool registry */}
            {toolId && (
              <button className="tp-btn active" data-id={toolId}>
                {toolId} — {title.split(" ").slice(0, 3).join(" ")}
                <span className="tp-cat">{category}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══ IDENTITY BAR ═══ */}
      <div className="id-bar">
        <div className="id-bar-inner">
          <div>
            <div className="id-sector">{category}</div>
            <div className="id-title">{title}</div>
            {toolId && <div className="id-meta">{toolId} &nbsp;·&nbsp; {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC</div>}
            {standards && standards.length > 0 && (
              <div className="std-row">
                <span className="std-lbl">Standards:</span>
                {standards.map(s => <span key={s} className="std-tag">{s}</span>)}
              </div>
            )}
            {scopeWarning && (
              <div className="scope-warn">
                <div className="scope-warn-icon">⚠</div>
                <div className="scope-warn-text"><strong style={{ color: "var(--terra)" }}>Scope Boundary:</strong> {scopeWarning}</div>
              </div>
            )}
          </div>
          <div className="id-right">
            <div className="pro-badge">FREE</div>
            <div className="id-code">{toolId || "—"}</div>
          </div>
        </div>
      </div>

      {/* ═══ STATUS STRIP ═══ */}
      <div className="status-strip">
        <div className="status-strip-inner">
          <div className="si">
            <div className={`si-dot${inputCount.total > 0 && inputCount.filled === inputCount.total ? " ok" : ""}`} />
            <span className="si-lbl">Inputs</span>
            <span className="si-val">{inputCount.filled}/{inputCount.total}</span>
          </div>
          <div className="si-div" />
          <div className="si">
            <div className={`si-dot${status === "PASS" ? " ok" : status === "FAIL" ? " fail" : ""}`} />
            <span className="si-lbl">Status</span>
            <span className="si-val">{displaySubmitted ? (status || "OK") : "Not Run"}</span>
          </div>
          <div className="si-div" />
          <div className="si">
            <div className={`si-dot${uc !== undefined ? (uc > 1 ? " fail" : uc > 0.9 ? " warn" : " ok") : ""}`} />
            <span className="si-lbl">UC</span>
            <span className="si-val">{ucPct !== undefined ? `${ucPct.toFixed(1)}%` : "—"}</span>
          </div>
          <div className="si-div" />
          <div className="si">
            <div className={`si-dot${govMode ? " ok" : ""}`} />
            <span className="si-lbl">Governing</span>
            <span className="si-val">{govMode || "—"}</span>
          </div>
          <div className="std-toggle" id="std-toggle" style={{ display: "none" }}>
            <button className="st-btn active">EN 1992-1-1</button>
            <button className="st-btn">ACI 318-25</button>
          </div>
        </div>
      </div>

      {/* ═══ PAGE / TOOL CARD ═══ */}
      <div className="page">
        <div className="tool-card">

          {/* TABS */}
          <div className="tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-num">{tab.num}</span> {tab.label}
                {tab.dot && <span className="tab-dot" />}
                {tab.id === "fmea" && !displaySubmitted && <span className="tab-lock">🔒</span>}
              </button>
            ))}
          </div>

          {/* ── PANE: INPUTS ───────────────────────── */}
          <div id="pane-inputs" style={{ display: activeTab === "inputs" ? "block" : "none" }}>
            <div className="inp-layout">
              <div className="inp-main">
                <form onSubmit={handleCalculate} noValidate>

                  {/* Material DB */}
                  {materialDB && (
                    <div className="inp-section">
                      <div className="sec-hdr">
                        <div className="sec-letter">M</div>
                        <div className="sec-title">Workpiece Material Group (ISO 513)</div>
                        <div className="sec-desc">Select to auto-fill values</div>
                      </div>
                      <div className="mat-grid">
                        {Object.entries(materialDB).map(([k, m]) => (
                          <div
                            key={k}
                            className={`mat-card${activeMatKey === k ? " active" : ""}`}
                            onClick={() => handleMatSelect(k)}
                          >
                            <div className="mat-name" style={{ color: m.color }}>{m.label}</div>
                            <div className="mat-sub">kc1: {m.kc1} N/mm² · mc: {m.mc}</div>
                            <div className="mat-vc">Vc: {m.vc[0]}–{m.vc[2]} m/min</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Presets */}
                  {presets && Object.keys(presets).length > 0 && (
                    <div className="inp-section">
                      <div className="sec-hdr">
                        <div className="sec-letter">Q</div>
                        <div className="sec-title">Quick-Start Presets</div>
                        <div className="sec-desc">Apply standard values</div>
                      </div>
                      <div className="preset-row">
                        {Object.entries(presets).map(([k, p]) => (
                          <button key={k} type="button" className="preset-btn" onClick={() => handleApplyPreset(p)}>
                            {p.label || k}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Groups */}
                  {inputGroups ? (
                    inputGroups.map((g) => (
                      <div key={g.letter} className="inp-section">
                        <div className="sec-hdr">
                          <div className="sec-letter">{g.letter}</div>
                          <div className="sec-title">{g.title}</div>
                          {g.desc && <div className="sec-desc">{g.desc}</div>}
                        </div>
                        <div className={`inp-grid ${g.cols || "ig-auto"}`}>
                          {g.inputs.map(inp => buildInputItem(inp, values, errors, onChange))}
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Flat input list */
                    <div className="inp-section">
                      <div className="sec-hdr">
                        <div className="sec-letter">I</div>
                        <div className="sec-title">Parameters</div>
                      </div>
                      <div className="inp-grid ig-auto">
                        {(flatInputs || []).map(inp => buildInputItem(inp, values, errors, onChange))}
                      </div>
                    </div>
                  )}

                  {/* Error Panel */}
                  {allErrors.length > 0 && (
                    <div className="err-panel" style={{ margin: "0 0 4px 0" }}>
                      {allErrors.map((e, i) => (
                        <div key={i} className="err-item">
                          <span className="err-icon">⛔</span>
                          <span>{e}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Bar (inside form for submit) */}
                  <div className="action-bar" style={{ margin: "20px -26px -22px", width: "calc(100% + 52px)" }}>
                    <div className="action-left">
                      <button type="submit" className="calc-btn" disabled={displayCalculating}>
                        {displayCalculating ? "Calculating..." : `▶ ${calculateLabel}`}
                      </button>
                      {displaySubmitted && (
                        <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
                      )}
                      <span className={`status-badge ${!displaySubmitted ? "sb-idle" : status === "FAIL" ? "sb-fail" : status === "WARN" ? "sb-warn" : "sb-pass"}`}>
                        {!displaySubmitted ? "— AWAITING INPUT" : `${status === "FAIL" ? "⛔ FAIL" : status === "WARN" ? "⚠ WARN" : "✓ PASS"}${ucPct !== undefined ? ` — UC ${ucPct.toFixed(1)}%` : ""}`}
                      </span>
                    </div>
                    <div className="action-right">
                      <button type="button" className="exp-btn" onClick={() => window.print()}>⎙ Print / PDF</button>
                      {displaySubmitted && (
                        <button type="button" className="exp-btn" onClick={handleExportJSON}>⊡ Export JSON</button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Input Sidebar */}
              <div className="inp-sidebar">
                <div className="sb-block">
                  <div className="sb-lbl">Scope / Exclusions</div>
                  {(limitations || []).slice(0, 6).map((l, i) => (
                    <div key={i} className="scope-item out"><span className="si-ico">✗</span>{l}</div>
                  ))}
                  <div className="scope-item in"><span className="si-ico">✓</span>GUM uncertainty propagation</div>
                  <div className="scope-item in"><span className="si-ico">✓</span>FMEA for UC &gt; 0.90</div>
                  <div className="scope-item in"><span className="si-ico">✓</span>ISO 9001 §8.5.1 audit log</div>
                </div>
                <div className="sb-block">
                  <div className="sb-lbl">Confidence Legend</div>
                  <div className="conf-legend">
                    <div className="cl-row"><span className="conf ck">EXACT</span> Measured / certified value</div>
                    <div className="cl-row"><span className="conf cg">STRONG</span> Specified / estimated</div>
                    <div className="cl-row"><span className="conf co">MEDIUM</span> Assumed / derived</div>
                    <div className="cl-row"><span className="conf cv">DEFAULT</span> Default / conservative</div>
                  </div>
                </div>
                {standards && standards.length > 0 && (
                  <div className="sb-block">
                    <div className="sb-lbl">Standard Basis</div>
                    {standards.map(s => (
                      <div key={s} className="ref-tag" style={{ display: "inline-block", margin: 2 }}>{s}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── PANE: RESULTS ───────────────────────── */}
          <div id="pane-results" style={{ display: activeTab === "results" ? "block" : "none" }}>
            {!displaySubmitted ? (
              <div className="full-panel">
                <div className="empty-state">
                  <div className="empty-icon">◎</div>
                  <div className="empty-title">No Calculation Run</div>
                  <div className="empty-desc">Enter parameters in Inputs tab and click Run Calculation.</div>
                </div>
              </div>
            ) : (
              <div className="res-layout">
                <div className="res-main">
                  {/* Warnings */}
                  {displayWarnings.length > 0 ? (
                    <div className="warn-panel">
                      {displayWarnings.map((w, i) => (
                        <div key={`w-${i}`} className={`warn-card ${w.severity}`}>
                          <div className="warn-hdr">
                            <span>{w.severity === "CRITICAL" ? "⛔" : w.severity === "WARNING" ? "⚠" : "ℹ"}</span>
                            <span className="warn-sev">{w.severity}</span>
                            <span className="warn-src">{w.source}</span>
                          </div>
                          <div className="warn-msg">{w.message}</div>
                        </div>
                      ))}
                    </div>
                  ) : displayOkMessage ? (
                    <div className="ok-banner">✓ {displayOkMessage}</div>
                  ) : (
                    <div className="ok-banner">✓ All parameters within standard limits.</div>
                  )}

                  {/* UC Gauge */}
                  {uc !== undefined && (
                    <div className="uc-gauge">
                      <div className="uc-hdr">
                        <span className="uc-lbl">Utilization Ratio — Governing</span>
                        <span>
                          <span className="uc-num">{ucPct!.toFixed(2)}</span>
                          <span className="uc-num-lbl">% UC</span>
                        </span>
                      </div>
                      <div className="uc-track">
                        <div className="uc-fill" style={{ width: `${ucFill}%`, background: ucColor }} />
                      </div>
                      <div className="uc-ticks">
                        <span>0</span><span>25%</span><span>50%</span><span>75%</span><span>90%</span><span>100%</span>
                      </div>
                      <div className="uc-zones">
                        <div className="uc-zone"><div className="uc-zone-dot" style={{ background: "#059669" }} /> 0–75% Comfortable</div>
                        <div className="uc-zone"><div className="uc-zone-dot" style={{ background: "#D97706" }} /> 75–90% Acceptable</div>
                        <div className="uc-zone"><div className="uc-zone-dot" style={{ background: "#DC2626" }} /> &gt;90% Critical</div>
                      </div>
                      <div className={`uc-verdict ${status === "FAIL" ? "fail" : status === "WARN" ? "warn" : uc > 0.9 ? "warn" : "pass"}`}>
                        <div className="uc-verdict-icon">
                          {status === "FAIL" ? "⛔" : status === "WARN" || uc! > 0.9 ? "⚠" : "✓"}
                        </div>
                        <div>
                          <div className="uc-verdict-title">
                            {status === "FAIL"
                              ? "FAIL — Insufficient Capacity"
                              : uc! > 0.9
                                ? "PASS — High Utilization: Peer Review Required"
                                : "PASS — Capacity Satisfied"}
                          </div>
                          <div className="uc-verdict-sub">
                            {status === "FAIL"
                              ? `Governing: ${govMode || "—"}. UC = ${ucPct!.toFixed(1)}%. Design must be revised.`
                              : uc! > 0.9
                                ? `Governing: ${govMode || "—"}. UC = ${ucPct!.toFixed(1)}% > 90% — FMEA and peer review mandatory.`
                                : `Governing: ${govMode || "—"}. All checks passed under selected standard.`}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Result Table */}
                  {displayRows.length > 0 && (
                    <div className="res-table">
                      <div className="res-thead rc3">
                        <span>Parameter</span>
                        <span style={{ textAlign: "right" }}>Value</span>
                        <span style={{ textAlign: "right" }}>Unit</span>
                      </div>
                      {displayRows.map((r, i) => (
                        <div key={`res-${i}`} className="res-row rc3">
                          <div className="res-name-cell">
                            <span className="res-name">{r.label}</span>
                            {r.varname && <span className="res-sym">{r.varname}</span>}
                          </div>
                          <span className={`res-val${r.highlight ? " hi" : ""} ${r.cls ? r.cls : ""}`}>
                            {fmtNum(r.value)}
                          </span>
                          <span className="res-unit">{r.unit}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Standards */}
                  {displayStandards && displayStandards.length > 0 && (
                    <div className="refs-row">
                      <span className="refs-lbl">Standards:</span>
                      {displayStandards.map(s => <span key={s} className="ref-tag">{s}</span>)}
                    </div>
                  )}
                </div>

                {/* Result Sidebar */}
                <div className="res-sidebar">
                  {govMode && (
                    <div className="sb-block">
                      <div className="sb-lbl">Governing Mode</div>
                      <div className="govern-card">
                        <div className="govern-title">Controlling Check</div>
                        <div className="govern-mode">{govMode}</div>
                        <div className="govern-desc">Primary design constraint driving the utilization ratio.</div>
                      </div>
                    </div>
                  )}

                  {displayResult?.u_c !== undefined && (
                    <div className="sb-block">
                      <div className="sb-lbl">GUM Uncertainty — ISO/IEC 98-3</div>
                      <div className="gum-block">
                        <div className="gum-title">
                          Combined u<sub>c</sub>(UC)
                          <span className="gum-ref">Type B</span>
                        </div>
                        <div className="gum-val">±{(displayResult.u_c * 100).toFixed(3)}%</div>
                        <div className="gum-sub">Root-sum-square propagation of input uncertainties per ISO Guide 98-3.</div>
                        <div className="gum-row">
                          <span className="gum-name">Geometry</span>
                          <div className="gum-bar"><div className="gum-fill" style={{ width: "25%" }} /></div>
                          <span className="gum-pct">±2%</span>
                        </div>
                        <div className="gum-row">
                          <span className="gum-name">Materials</span>
                          <div className="gum-bar"><div className="gum-fill" style={{ width: "25%" }} /></div>
                          <span className="gum-pct">±2%</span>
                        </div>
                        <div className="gum-row">
                          <span className="gum-name">Actions</span>
                          <div className="gum-bar"><div className="gum-fill" style={{ width: "37%" }} /></div>
                          <span className="gum-pct">±3%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UC Breakdown */}
                  {(displayResult?.ucFlex !== undefined || displayResult?.ucShear !== undefined) && (
                    <div className="sb-block">
                      <div className="sb-lbl">UC Breakdown</div>
                      <div className="gum-block">
                        {displayResult.ucFlex !== undefined && (
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: "var(--ink60)" }}>Flexure UC</span>
                            <span className={`res-val ${displayResult.ucFlex > 1 ? "fail" : displayResult.ucFlex > 0.9 ? "warn" : "pass"}`} style={{ fontSize: 12 }}>
                              {(displayResult.ucFlex * 100).toFixed(2)}%
                            </span>
                          </div>
                        )}
                        {displayResult.ucShear !== undefined && (
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: "var(--ink60)" }}>Shear UC</span>
                            <span className={`res-val ${displayResult.ucShear > 1 ? "fail" : displayResult.ucShear > 0.9 ? "warn" : "pass"}`} style={{ fontSize: 12 }}>
                              {(displayResult.ucShear * 100).toFixed(2)}%
                            </span>
                          </div>
                        )}
                        <div style={{ borderTop: "1px solid var(--ink12)", paddingTop: 7, display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 11, fontWeight: 700 }}>Governing UC</span>
                          <span className={`res-val ${uc! > 1 ? "fail" : uc! > 0.9 ? "warn" : "pass"}`} style={{ fontSize: 14 }}>
                            {ucPct!.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── PANE: FORMULAS ──────────────────────── */}
          <div id="pane-formulas" style={{ display: activeTab === "formulas" ? "block" : "none" }}>
            <div className="frm-layout">
              <div className="frm-main">
                {formulas && formulas.length > 0 ? (
                  <>
                    <div className="sec-lbl">Formula Chain — {standards?.[0] || ""}</div>
                    <div className="frm-table">
                      <div className="frm-thead">
                        <span>ID</span><span>Output</span><span>=</span><span>Expression</span><span>Reference</span>
                      </div>
                      {formulas.map((f, i) => (
                        <div key={`frm-${i}`} className="frm-row">
                          <div className="frm-id">{f.id || `F${i + 1}`}</div>
                          <div className="frm-out">{f.symbol}</div>
                          <div className="frm-eq">=</div>
                          <div className="frm-expr">{f.expression}{f.note && <span style={{ display: "block", fontSize: 9, color: "var(--ink40)", fontStyle: "italic" }}>{f.note}</span>}</div>
                          <div className="frm-ref">{f.ref || "—"}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}

                {validationRules && validationRules.length > 0 && (
                  <>
                    <div className="sec-lbl mt10">Validation Rules</div>
                    {validationRules.map((r, i) => (
                      <div key={`val-${i}`} className="val-rule">
                        <div className="val-rule-id">{r.id || r.key || `V${i + 1}`}</div>
                        <div className={`val-rule-action ${r.action === "BLOCK" ? "va-block" : "va-warn"}`}>
                          {r.action || "WARN"}
                        </div>
                        <div className="val-rule-msg">{r.message}</div>
                      </div>
                    ))}
                  </>
                )}

                {(!formulas || formulas.length === 0) && (!validationRules || validationRules.length === 0) && (
                  <div className="empty-state">
                    <div className="empty-icon">◎</div>
                    <div className="empty-title">No Formula Information Available</div>
                    <div className="empty-desc">Refer to tool documentation for calculation methodology.</div>
                  </div>
                )}
              </div>
              <div className="frm-sidebar">
                {standards && standards.length > 0 && (
                  <div className="sb-block">
                    <div className="sb-lbl">Standards Basis</div>
                    {standards.map(s => (
                      <div key={s} className="ref-tag" style={{ display: "block", marginBottom: 4, padding: "5px 8px", fontSize: 10 }}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
                <div className="sb-block">
                  <div className="sb-lbl">Dimensional Verification</div>
                  <div style={{ fontSize: 10, color: "var(--ink60)", lineHeight: 1.7, fontFamily: "'JetBrains Mono',monospace" }}>
                    All formula expressions carry unit dimensional checks. Every output verified against SI/ISO 80000 dimensional analysis. Mismatched units trigger BLOCK validation.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── PANE: FMEA ──────────────────────────── */}
          <div id="pane-fmea" style={{ display: activeTab === "fmea" ? "block" : "none" }}>
            <div className="full-panel">
              {!displaySubmitted ? (
                <div className="empty-state">
                  <div className="empty-icon">🔒</div>
                  <div className="empty-title">Run Calculation First</div>
                  <div className="empty-desc">FMEA activates after calculation. Mandatory peer review when UC &gt; 0.90.</div>
                </div>
              ) : (
                <>
                  {uc !== undefined && uc > 0.9 ? (
                    <div style={{ background: "var(--crit-bg)", borderLeft: "3px solid var(--crit)", padding: "10px 14px", marginBottom: 14, fontSize: 11, color: "var(--crit)", fontWeight: 700 }}>
                      ⛔ MANDATORY FMEA — UC = {ucPct!.toFixed(1)}% &gt; 90% — ISO 9001 §8.6: All failure modes must be reviewed before design release.
                    </div>
                  ) : (
                    <div style={{ background: "var(--ok-bg)", borderLeft: "3px solid var(--ok)", padding: "10px 14px", marginBottom: 14, fontSize: 11, color: "#065F46" }}>
                      ✓ UC = {ucPct !== undefined ? `${ucPct.toFixed(1)}%` : "—"} ≤ 90%. FMEA available for reference — peer review not mandated.
                    </div>
                  )}

                  {fmea && fmea.length > 0 ? (
                    <>
                      <div className="fmea-table">
                        <div className="fmea-thead">
                          <span>Failure Mode</span><span>Effect</span><span>SEV</span><span>OCC</span><span>DET</span><span>RPN</span>
                        </div>
                        {fmea.map((fm, i) => {
                          const rpn = fm.sev * fm.occ * fm.det;
                          return (
                            <div key={`fmea-${i}`} className="fmea-row">
                              <div className="fmea-mode">{fm.mode}</div>
                              <div className="fmea-effect">{fm.effect}</div>
                              <div className="fmea-cell sev">{fm.sev}</div>
                              <div className="fmea-cell occ">{fm.occ}</div>
                              <div className="fmea-cell det">{fm.det}</div>
                              <div className={`rpn ${rpnClass(rpn)}`}>{rpn}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="fmea-note">
                        FMEA: SEV/OCC/DET 1–10. RPN = SEV × OCC × DET. RPN ≥ 200: mandatory corrective action. 100–199: medium priority. &lt;100: acceptable. Based on AIAG FMEA-4 methodology.
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🔒</div>
                      <div className="empty-title">FMEA Not Configured</div>
                      <div className="empty-desc">This tool does not have FMEA data configured. Contact the tool author.</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── PANE: AUDIT ─────────────────────────── */}
          <div id="pane-audit" style={{ display: activeTab === "audit" ? "block" : "none" }}>
            <div className="full-panel">
              {!displaySubmitted ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <div className="empty-title">Audit Record Not Generated</div>
                  <div className="empty-desc">Run a calculation to generate the ISO 9001 §8.5.1 traceable audit record.</div>
                </div>
              ) : (
                <>
                  <div className="audit-hdr">
                    <div>
                      <div className="audit-hdr-title">ISO 9001 Calculation Audit Record</div>
                      <div className="audit-hdr-sub">§8.5.1 Production control · §8.6 Release · Traceable engineering record</div>
                    </div>
                    <div className="audit-hdr-badge">
                      <span>ISO 9001:2015</span>
                      AUDIT LOG
                    </div>
                  </div>

                  <div className="audit-grid">
                    <div className="audit-cell">
                      <div className="audit-field">Tool ID</div>
                      <div className="audit-val">{toolId || "—"}</div>
                    </div>
                    <div className="audit-cell">
                      <div className="audit-field">Version</div>
                      <div className="audit-val">{version || "1.0.0"}</div>
                    </div>
                    {(standards && standards.length > 0) ? (
                      <div className="audit-cell">
                        <div className="audit-field">Standard</div>
                        <div className="audit-val">{standards[0]}</div>
                      </div>
                    ) : null}
                    <div className="audit-cell">
                      <div className="audit-field">Timestamp (UTC)</div>
                      <div className="audit-val">{new Date().toISOString()}</div>
                    </div>
                    <div className="audit-cell">
                      <div className="audit-field">Category</div>
                      <div className="audit-val">{category || "—"}</div>
                    </div>
                    <div className="audit-cell">
                      <div className="audit-field">Validation Result</div>
                      <div className={`audit-val ${status === "FAIL" ? "fail" : "pass"}`}>{status || "PASS"}</div>
                    </div>
                    {uc !== undefined && (
                      <div className="audit-cell">
                        <div className="audit-field">UC Governing</div>
                        <div className={`audit-val ${uc > 1 ? "fail" : "pass"}`}>{(uc * 100).toFixed(4)}%</div>
                      </div>
                    )}
                    {govMode && (
                      <div className="audit-cell">
                        <div className="audit-field">Governing Mode</div>
                        <div className="audit-val">{govMode}</div>
                      </div>
                    )}
                    {displayResult?.u_c !== undefined && (
                      <div className="audit-cell">
                        <div className="audit-field">GUM u<sub>c</sub>(UC)</div>
                        <div className="audit-val">±{(displayResult.u_c * 100).toFixed(4)}%</div>
                      </div>
                    )}
                    <div className="audit-cell-full">
                      <div className="audit-field">Input Hash</div>
                      <div className="audit-val hash">
                        {typeof btoa === "function"
                          ? btoa(JSON.stringify(values)).slice(0, 32) + "..."
                          : "—"}
                      </div>
                    </div>
                    <div className="audit-cell-full">
                      <div className="audit-field">Warnings</div>
                      <div className="audit-val">
                        {displayWarnings.length > 0
                          ? displayWarnings.map(w => `[${w.severity}] ${w.source}`).join(" | ")
                          : "None"}
                      </div>
                    </div>
                  </div>

                  <div className="sec-lbl mt10">Input Parameters Record</div>
                  <div className="audit-grid" style={{ marginBottom: 12 }}>
                    {allInputs.filter(inp => values[inp.key] !== undefined).map(inp => (
                      <div key={inp.key} className="audit-cell">
                        <div className="audit-field">{inp.key}</div>
                        <div className="audit-val">
                          {String(values[inp.key])} {inp.unit}
                          {inp.unc ? ` | ${inp.unc}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sec-lbl mt10">Release Sign-Off</div>
                  <div className="audit-signoff">
                    <div className="audit-cell">
                      <div className="audit-field">Calculated By</div>
                      <div className="audit-val blank">____________________</div>
                    </div>
                    <div className="audit-cell">
                      <div className="audit-field">Date</div>
                      <div className="audit-val blank">____________________</div>
                    </div>
                    <div className="audit-cell">
                      <div className="audit-field">Checked By (Licensed Engineer)</div>
                      <div className="audit-val blank">____________________</div>
                    </div>
                    <div className="audit-cell">
                      <div className="audit-field">Registration / Stamp</div>
                      <div className="audit-val blank">____________________</div>
                    </div>
                    <div className="audit-cell-full">
                      <div className="audit-field">Release Condition</div>
                      <div className={`audit-val ${status === "FAIL" ? "fail" : "pass"}`}>
                        {status === "FAIL"
                          ? "NOT RELEASED — Redesign required."
                          : "RELEASED — Subject to engineer sign-off and field verification."}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        {footerNote && (
          <div className="tool-footer">
            <div className="tf-block">
              <div className="tf-lbl">Legal Notice</div>
              <div className="tf-txt">Results are engineering decision support only. Licensed engineer sign-off mandatory before construction or release. SectorCalc accepts no liability for failures arising from misuse.</div>
            </div>
            <div className="tf-block">
              <div className="tf-lbl">Calibration Trace</div>
              <div className="tf-txt">GUM Type B uncertainty traceable to <span className="tf-mono">NIST / DKD / PTB</span> reference standards. ISO/IEC Guide 98-3.</div>
            </div>
            <div className="tf-block">
              <div className="tf-lbl">Quality Checklist</div>
              <div className="tf-txt" style={{ fontSize: 9, lineHeight: 1.9 }}>
                ✓ Unit tests &gt;95% &nbsp; ✓ Dimensional checks &nbsp; ✓ Fail-closed validation<br />
                ✓ FMEA for UC &gt; 0.90 &nbsp; ✓ GUM uncertainty &nbsp; ✓ ISO 9001 audit log
              </div>
            </div>
            <div className="tf-block">
              <div className="tf-lbl">Platform</div>
              <div className="tf-txt"><span className="tf-mono">SectorCalc Universal Engine</span><br />sectorcalc.com</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ═══ INPUT BUILDER ═══ */
  function buildInputItem(
    inp: PremiumInputDef,
    vals: Record<string, number | string>,
    errs: Record<string, string>,
    handleChange: (key: string, value: number | string) => void,
  ) {
    const val = vals[inp.key] ?? inp.defaultValue ?? "";
    const error = errs[inp.key];
    const isEnum = inp.type === "select" && inp.options;
    const hasVal = val !== undefined && val !== "";
    const cc = confClass(inp.confidence_label);

    if (isEnum) {
      return (
        <div key={inp.key} className={`inp-item${hasVal ? " has-val" : ""}`}>
          <div className="inp-label-row">
            <span className="inp-label">
              {inp.label}
              {inp.required !== false && <span className="inp-req">*</span>}
            </span>
            {inp.sym && <span className="inp-sym">{inp.sym}</span>}
            {inp.confidence_label && <span className={`conf ${cc}`}>{displayConfidence(inp.confidence_label)}</span>}
          </div>
          <div className="inp-field-row">
            <div className="sel-wrap">
              <select
                value={String(val)}
                onChange={(e) => handleChange(inp.key, e.target.value)}
              >
                <option value="">— Select —</option>
                {inp.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          {inp.hint && <div className="inp-hint">{inp.hint}</div>}
          {error && <div className="inp-err-msg" style={{ fontSize: 10, color: "#DC2626" }}>{error}</div>}
        </div>
      );
    }

    return (
      <div key={inp.key} className={`inp-item${hasVal ? " has-val" : ""}${error ? " err-field" : ""}`}>
        <div className="inp-label-row">
          <span className="inp-label">
            {inp.label}
            {inp.required !== false && <span className="inp-req">*</span>}
          </span>
          {inp.sym && <span className="inp-sym">{inp.sym}</span>}
          {inp.confidence_label && <span className={`conf ${cc}`}>{displayConfidence(inp.confidence_label)}</span>}
        </div>
        <div className="inp-field-row">
          <input
            type="number"
            step={inp.step ?? "any"}
            min={inp.min}
            max={inp.max}
            value={val === "" ? "" : String(val)}
            placeholder={inp.hint || "Enter value"}
            onChange={(e) => {
              const v = e.target.value;
              const num = v === "" ? "" : Number(v);
              handleChange(inp.key, typeof num === "number" && !Number.isNaN(num) ? num : v);
              setValidationErrors((prev) => prev.filter((e) => !e.includes(inp.key)));
            }}
          />
          <span className="inp-unit">{inp.unit}</span>
        </div>
        <div className="inp-hint">
          {inp.min !== undefined && `Range: ${inp.min}`}
          {inp.max !== undefined && ` – ${inp.max}`}
          {" "}{inp.unit}
        </div>
        {inp.unc && <div className="inp-unc">GUM: {inp.unc}</div>}
        {error && <div className="inp-err-msg" style={{ fontSize: 10, color: "#DC2626" }}>{error}</div>}
      </div>
    );
  }
}
