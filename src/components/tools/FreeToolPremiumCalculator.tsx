"use client";

import { useState, useMemo, type FormEvent } from "react";

/* ─── TYPES ──────────────────────────────────────────────────────────── */

export interface PremiumInputDef {
  key: string;
  label: string;
  unit: string;
  type: "number" | "select";
  required?: boolean;
  confidence_label?: "EXACT" | "STRONG" | "MEDIUM" | "DEFAULT";
  getConfLabel: (label?: string) => string;
  getConfClass: (label?: string) => string;
  options?: readonly { readonly label: string; readonly value: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string;
  hint?: string;
}

export interface PremiumResultRow {
  label: string;
  value: string | number;
  unit: string;
  varname?: string;
  highlight?: boolean;
}

export interface PremiumWarning {
  severity: "CRITICAL" | "WARNING" | "INFO";
  source: string;
  message: string;
}

export interface PremiumFormulaRow {
  symbol: string;
  expression: string;
  note?: string;
}

export interface PremiumValidationRule {
  key: string;
  message: string;
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

/* ─── PROPS ──────────────────────────────────────────────────────────── */

export interface FreeToolPremiumCalculatorProps {
  /* Tool metadata */
  title: string;
  category: string;
  toolId?: string;

  /* Standards references */
  standards?: readonly string[];

  /* Inputs */
  inputs: readonly PremiumInputDef[];
  values: Record<string, number | string>;
  errors: Record<string, string>;

  /* Events */
  onChange: (key: string, value: number | string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;

  /* UI state */
  calculateLabel?: string;
  isCalculating?: boolean;

  /* Optional material database (CNC-like tools) */
  materialDB?: Record<string, MaterialGroup>;

  /* Formulas (display in Formulas tab) */
  formulas?: readonly PremiumFormulaRow[];

  /* Validation rules (display in Formulas tab) */
  validationRules?: readonly PremiumValidationRule[];

  /* Results */
  resultWarnings?: readonly PremiumWarning[];
  resultRows?: readonly PremiumResultRow[];
  resultOkMessage?: string;
  resultStandards?: readonly string[];

  /* Result state (from parent) */
  submitted?: boolean;

  /* Callbacks */
  onReset?: () => void;

  /* Extra footer */
  footerNote?: string;
}

/* ─── CONFIDENCE CLASS HELPER ────────────────────────────────────────── */

function confClass(label?: string): string {
  if (label === "EXACT" || label === "CERTAIN" || label === "HIGH") return "sc-premium-conf-kesin";
  if (label === "STRONG" || label === "MEDIUM") return "sc-premium-conf-guclu";
  return "sc-premium-conf-varsayim";
}

/* ─── FORMAT VALUE HELPER ───────────────────────────────────────────── */

function fmtValue(v: string | number | null | undefined): string {
  if (v === null || v === undefined || v === "") return "—";
  const num = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(num)) return String(v);
  if (Math.abs(num) >= 100000) return num.toExponential(2);
  if (Math.abs(num) >= 100) return num.toFixed(1);
  if (Math.abs(num) >= 1) return num.toFixed(2);
  if (Math.abs(num) >= 0.001) return num.toFixed(4);
  return num.toExponential(2);
}

/* ─── COMPONENT ──────────────────────────────────────────────────────── */

export function FreeToolPremiumCalculator({
  title,
  category,
  toolId,
  standards,
  inputs,
  values,
  errors,
  onChange,
  onSubmit,
  calculateLabel = "Calculate",
  isCalculating = false,
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
}: FreeToolPremiumCalculatorProps) {
  const [activeTab, setActiveTab] = useState<"inputs" | "results" | "formulas">("inputs");
  const [activeMatKey, setActiveMatKey] = useState<string | null>(null);
  const [localValues, setLocalValues] = useState<Record<string, number | string>>({});
  const [showResult, setShowResult] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  /* Derive combined values: parent values + local overrides */
  const effectiveValues = useMemo(() => ({ ...values, ...localValues }), [values, localValues]);

  /* Has warnings for dot indicator */
  const hasWarnings = resultWarnings && resultWarnings.length > 0;

  /* Handle calculate */
  const handleCalculate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* Run client-side validation on required fields */
    const errs: string[] = [];
    for (const inp of inputs) {
      if (inp.required && inp.type === "number") {
        const raw = effectiveValues[inp.key];
        const num = typeof raw === "number" ? raw : Number(raw);
        if (raw === undefined || raw === "" || !Number.isFinite(num)) {
          errs.push(`${inp.label}: required or invalid.`);
        } else if (inp.min !== undefined && num < inp.min) {
          errs.push(`${inp.label}: minimum ${inp.min} ${inp.unit}.`);
        }
      }
    }
    if (errs.length > 0) {
      setValidationErrors(errs);
      return;
    }
    setValidationErrors([]);
    setShowResult(true);
    onSubmit(e);
  };

  /* Handle reset */
  const handleReset = () => {
    setActiveMatKey(null);
    setLocalValues({});
    setShowResult(false);
    setValidationErrors([]);
    setActiveTab("inputs");
    if (onReset) onReset();
  };

  /* Handle material selection */
  const handleMatSelect = (key: string) => {
    setActiveMatKey(key);
    if (materialDB && materialDB[key]) {
      const m = materialDB[key];
      onChange("kc1", m.kc1);
      onChange("mc", m.mc);
    }
  };

  /* Handle suggestion apply */
  const handleSuggestionApply = (key: string, value: number) => {
    onChange(key, value);
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  };

  /* Handle input change — delegates to parent + local */
  const handleInputChange = (key: string, value: string) => {
    const num = value === "" ? "" : Number(value);
    onChange(key, typeof num === "number" && !Number.isNaN(num) ? num : value);
    setLocalValues((prev) => ({ ...prev, [key]: value }));
    /* Clear field validation on edit */
    setValidationErrors((prev) => prev.filter((e) => !e.includes(key)));
  };

  /* Tab switch handler */
  const handleTabSwitch = (tab: "inputs" | "results" | "formulas") => {
    setActiveTab(tab);
  };

  /* ─── RENDER ───────────────────────────────────────────────────────── */

  return (
    <div className="sc-premium">
      {/* Standards Strip */}
      {standards && standards.length > 0 && (
        <div className="sc-premium-std-strip">
          <span className="sc-premium-std-lbl">Referans:</span>
          {standards.map((s) => (
            <span key={s} className="sc-premium-std-tag">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Tool Card */}
      <div className="sc-premium-tool-card">
        {/* Header */}
        <div className="sc-premium-tool-hdr">
          <div>
            <div className="sc-premium-tool-eyebrow">{category}</div>
            <div className="sc-premium-tool-title">{title}</div>
            {toolId && <div className="sc-premium-tool-meta">{toolId}</div>}
          </div>
          <div className="sc-premium-status-area">
            {submitted && resultWarnings && resultWarnings.length > 0 ? (
              (() => {
                const crit = resultWarnings.filter((w) => w.severity === "CRITICAL").length;
                const warn = resultWarnings.filter((w) => w.severity === "WARNING").length;
                if (crit > 0)
                  return (
                    <span className="sc-premium-badge sc-premium-badge-crit">
                      ⛔ {crit} CRITICAL
                    </span>
                  );
                if (warn > 0)
                  return (
                    <span className="sc-premium-badge sc-premium-badge-warn">
                      ⚠ {warn} WARNING
                    </span>
                  );
                return (
                  <span className="sc-premium-badge sc-premium-badge-ok">✓ PASS</span>
                );
              })()
            ) : submitted ? (
              <span className="sc-premium-badge sc-premium-badge-ok">✓ PASS</span>
            ) : (
              <span className="sc-premium-badge sc-premium-badge-idle">— NOT ENTERED</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="sc-premium-tabs">
          <button
            className={`sc-premium-tab-btn${activeTab === "inputs" ? " active" : ""}`}
            onClick={() => handleTabSwitch("inputs")}
          >
            Inputs
          </button>
          <button
            className={`sc-premium-tab-btn${activeTab === "results" ? " active" : ""}`}
            onClick={() => handleTabSwitch("results")}
          >
            Result
            {hasWarnings && (
              <span className="sc-premium-tab-dot" />
            )}
          </button>
          <button
            className={`sc-premium-tab-btn${activeTab === "formulas" ? " active" : ""}`}
            onClick={() => handleTabSwitch("formulas")}
          >
            Formulas
          </button>
        </div>

        {/* ── INPUT PANEL ─────────────────────────────────────────────── */}
        {activeTab === "inputs" && (
          <div className="sc-premium-panel">
            <form onSubmit={handleCalculate} noValidate>
              {/* Material Selection (optional) */}
              {materialDB && (
                <div style={{ marginBottom: 16 }}>
                  <div className="sc-premium-sec-lbl">
                    Workpiece Material Group (ISO 513) — Select
                  </div>
                  <div className="sc-premium-mat-grid">
                    {Object.entries(materialDB).map(([k, m]) => (
                      <div
                        key={k}
                        className={`sc-premium-mat-option${activeMatKey === k ? " selected" : ""}`}
                        onClick={() => handleMatSelect(k)}
                      >
                        <div
                          className="sc-premium-mat-name"
                          style={{ color: m.color }}
                        >
                          {m.label}
                        </div>
                        <div className="sc-premium-mat-sub">
                          kc1: {m.kc1} N/mm² &middot; mc: {m.mc}
                        </div>
                        <div className="sc-premium-mat-vc">
                          Vc: {m.vc[0]}–{m.vc[2]} m/dak
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeMatKey && materialDB[activeMatKey] && (
                    <div className="sc-premium-mat-info">
                      <div
                        className="sc-premium-mat-accent-bar"
                        style={{ background: materialDB[activeMatKey].color }}
                      />
                      <div className="sc-premium-mat-info-body">
                        <div className="sc-premium-mat-ref">
                          Reference Values
                        </div>
                        <div className="sc-premium-mat-stats">
                          {["Vc", "kc1", "mc"].map((field) => {
                            const m = materialDB[activeMatKey];
                            const val =
                              field === "Vc"
                                ? `${m.vc[0]}–${m.vc[2]}`
                                : field === "kc1"
                                  ? String(m.kc1)
                                  : String(m.mc);
                            const unit =
                              field === "Vc"
                                ? "m/dak"
                                : field === "kc1"
                                  ? "N/mm²"
                                  : "Kienzle";
                            return (
                              <div key={field} className="sc-premium-ms">
                                <span className="sc-premium-ms-l">{field}</span>
                                <span className="sc-premium-ms-v">{val}</span>
                                <span className="sc-premium-ms-s">{unit}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Input Grid */}
              <div className="sc-premium-inp-grid">
                {inputs.map((inp) => {
                  const val = effectiveValues[inp.key] ?? inp.defaultValue ?? "";
                  const error = errors[inp.key];
                  const isEnum = inp.type === "select" && inp.options;
                  const hasSugg =
                    inp.key !== "kc1" &&
                    inp.key !== "mc" &&
                    activeMatKey &&
                    materialDB?.[activeMatKey] &&
                    !localValues[inp.key];

                  if (isEnum) {
                    return (
                      <div
                        key={inp.key}
                        className="sc-premium-inp-item"
                      >
                        <label className="sc-premium-inp-lbl">
                          {inp.label}
                          {inp.required && <span className="sc-premium-inp-req">*</span>}
                          {inp.confidence_label && (
                            <span className={`sc-premium-conf ${confClass(inp.confidence_label)}`}>
                              {inp.confidence_label}
                            </span>
                          )}
                        </label>
                        <select
                          className="sc-premium-select"
                          value={String(val)}
                          onChange={(e) => onChange(inp.key, e.target.value)}
                        >
                          {inp.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {inp.hint && <div className="sc-premium-inp-hint">{inp.hint}</div>}
                        {error && <div className="sc-premium-inp-err-msg">{error}</div>}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={inp.key}
                      className={`sc-premium-inp-item${error ? " has-err" : ""}`}
                    >
                      <label className="sc-premium-inp-lbl">
                        {inp.label}
                        {inp.required && <span className="sc-premium-inp-req">*</span>}
                        {inp.confidence_label && (
                          <span className={`sc-premium-conf ${confClass(inp.confidence_label)}`}>
                            {inp.confidence_label}
                          </span>
                        )}
                      </label>
                      <div className="sc-premium-inp-row">
                        <input
                          type="number"
                          step={inp.step ?? "any"}
                          min={inp.min}
                          max={inp.max}
                          value={val === "" ? "" : String(val)}
                          placeholder={inp.hint || "Enter value"}
                          className={error ? "err" : ""}
                          onChange={(e) => handleInputChange(inp.key, e.target.value)}
                        />
                        <span className="sc-premium-unit">{inp.unit}</span>
                      </div>
                      <div className="sc-premium-inp-hint">
                        {inp.min !== undefined && `Min: ${inp.min}${inp.max !== undefined ? ` · Max: ${inp.max}` : ""} ${inp.unit}`}
                      </div>
                      {error && <div className="sc-premium-inp-err-msg">{error}</div>}
                      {hasSugg && (
                        <div className="sc-premium-suggestion">
                          <span>Suggestion: <strong>{val}</strong></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Validation Errors */}
              {(validationErrors.length > 0 || Object.keys(errors).length > 0) && (
                <div className="sc-premium-err-panel">
                  {validationErrors.map((e, i) => (
                    <div key={`ve-${i}`} className="sc-premium-err-item">
                      <span className="sc-premium-err-icon">✕</span>
                      <span>{e}</span>
                    </div>
                  ))}
                  {Object.entries(errors).map(([key, msg]) => (
                    <div key={key} className="sc-premium-err-item">
                      <span className="sc-premium-err-icon">✕</span>
                      <span>{msg}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Row */}
              <div className="sc-premium-action-row">
                <button
                  type="submit"
                  className="sc-premium-calc-btn"
                  disabled={isCalculating}
                >
                  {isCalculating ? "Calculating..." : calculateLabel}
                </button>
                {onReset && (
                  <button
                    type="button"
                    className="sc-premium-reset-btn"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ── RESULT PANEL ──────────────────────────────────────────────── */}
        {activeTab === "results" && (
          <div className="sc-premium-panel">
            {!submitted ? (
              <div className="sc-premium-empty-res">
                No calculation performed. Enter parameters in the Inputs tab.
              </div>
            ) : (
              <>
                {/* Warnings */}
                {resultWarnings && resultWarnings.length > 0 ? (
                  <div className="sc-premium-warn-panel">
                    {resultWarnings.map((w, i) => (
                      <div key={`w-${i}`} className={`sc-premium-warn-card ${w.severity}`}>
                        <div className="sc-premium-warn-hdr">
                          <span>
                            {w.severity === "CRITICAL"
                              ? "⛔"
                              : w.severity === "WARNING"
                                ? "⚠"
                                : "ℹ"}
                          </span>
                          <span className="sc-premium-warn-sev">{w.severity}</span>
                          <span className="sc-premium-warn-src">{w.source}</span>
                        </div>
                        <div className="sc-premium-warn-msg">{w.message}</div>
                      </div>
                    ))}
                  </div>
                ) : resultOkMessage ? (
                  <div className="sc-premium-ok-banner">{resultOkMessage}</div>
                ) : null}

                {/* Results Table */}
                {resultRows && resultRows.length > 0 && (
                  <div className="sc-premium-res-table">
                    <div className="sc-premium-res-hdr">
                      <span>Parameter</span>
              <span>Result</span>
                      <span>Unit</span>
                    </div>
                    {resultRows.map((r, i) => (
                      <div key={`res-${i}`} className="sc-premium-res-row">
                        <span className="sc-premium-res-name">
                          {r.label}
                          {r.varname && (
                            <span className="sc-premium-res-varname">{r.varname}</span>
                          )}
                        </span>
                        <span
                          className={`sc-premium-res-val${r.highlight ? " highlight" : ""}`}
                        >
                          {fmtValue(r.value)}
                        </span>
                        <span className="sc-premium-res-unit">{r.unit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Standards References */}
                {resultStandards && resultStandards.length > 0 && (
                  <div className="sc-premium-refs-row">
                    <span className="sc-premium-ref-ttl">SOURCE:</span>
                    {resultStandards.map((s) => (
                      <span key={s} className="sc-premium-ref-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── FORMULA PANEL ─────────────────────────────────────────────── */}
        {activeTab === "formulas" && (
          <div className="sc-premium-panel">
            {formulas && formulas.length > 0 && (
              <>
                <div className="sc-premium-sec-lbl">Calculation Formulas</div>
                <div className="sc-premium-frm-list">
                  {formulas.map((f, i) => (
                    <div key={`frm-${i}`} className="sc-premium-frm-row">
                      <div className="sc-premium-frm-lhs">{f.symbol}</div>
                      <div className="sc-premium-frm-eq">=</div>
                      <div className="sc-premium-frm-rhs">
                        {f.expression}
                        {f.note && <span className="sc-premium-frm-note">{f.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {validationRules && validationRules.length > 0 && (
              <>
                <div className="sc-premium-sec-lbl" style={{ marginTop: 14 }}>
                  Validation Rules
                </div>
                <div className="sc-premium-val-list">
                  {validationRules.map((r, i) => (
                    <div key={`val-${i}`} className="sc-premium-val-item">
                      <div className="sc-premium-val-key">{r.key}</div>
                      <div className="sc-premium-val-msg">{r.message}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(!formulas || formulas.length === 0) &&
              (!validationRules || validationRules.length === 0) && (
                <div className="sc-premium-empty-res">
                  Formula information not available.
                </div>
              )}
          </div>
        )}

        {/* ── CTA BAR ──────────────────────────────────────────────────────── */}
        {submitted && activeTab !== "results" && (
          <div className="sc-premium-cbar">
            <span>Calculation complete.</span>
            <button
              className="sc-premium-cbar-btn"
              onClick={() => handleTabSwitch("results")}
            >
              View Results →
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      {footerNote && <div className="sc-premium-tool-footer">{footerNote}</div>}
    </div>
  );
}
