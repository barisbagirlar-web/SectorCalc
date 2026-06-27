/**
 * ProToolPremiumRenderer — PRO Tool'lar için Premium UI Renderer
 * 
 * Sizin verdiğiniz premium tasarım (sc-premium-* CSS) ile PRO tool'ları
 * schema-driven olarak render eder. FreeToolPremiumCalculator ile aynı
 * CSS kullanılır, ancak PRO tool özellikleri (customCalc, FMEA, Audit,
 * conditional visibility) eklenmiştir.
 */
"use client";

import { useState, useCallback, useMemo, useRef, type FormEvent } from "react";
import type { ToolSchemaInput } from "@/lib/tool-schemas/types";

// ─── PROPS ────────────────────────────────────────────────────────────────

interface ProToolPremiumRendererProps {
  tool: any;
  locale?: string;
  onResult?: (result: any) => void;
  onCalculate?: () => Promise<boolean>;
  customCalc?: ((input: Record<string, any>) => any) | null;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────

function isInputHidden(inp: any, values: Record<string, any>): boolean {
  if (inp.visibleWhen) return values[inp.visibleWhen.field] !== inp.visibleWhen.equals;
  if (inp.conditional_on) return values[inp.conditional_on.field] !== inp.conditional_on.value;
  return false;
}

function confClass(label?: string): string {
  if (label === "KESİN" || label === "CERTAIN" || label === "HIGH") return "sc-premium-conf-kesin";
  if (label === "GÜÇLÜ" || label === "STRONG" || label === "MEDIUM") return "sc-premium-conf-guclu";
  return "sc-premium-conf-varsayim";
}

function translateConf(lbl?: string): string {
  if (!lbl) return "";
  const u = lbl.toUpperCase();
  if (u === "KESİN" || u === "CERTAIN" || u === "HIGH") return "Kesin";
  if (u === "GÜÇLÜ" || u === "STRONG" || u === "MEDIUM") return "Güçlü";
  if (u === "VARSAYIM" || u === "ASSUMPTION" || u === "LOW") return "Varsayım";
  return lbl;
}

function fmtVal(v: any, decimals = 3): string {
  if (v === null || v === undefined || isNaN(v)) return "—";
  const abs = Math.abs(v);
  if (abs === 0) return "0";
  if (abs >= 1e6) return Number(v).toExponential(2);
  if (abs >= 1000) return Number(v).toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (abs >= 1) return Number(v).toLocaleString("en-US", { maximumFractionDigits: decimals });
  if (abs >= 0.01) return Number(v).toLocaleString("en-US", { maximumFractionDigits: decimals + 1 });
  return Number(v).toExponential(2);
}

// ─── CONFIDENCE COLOR MAP ─────────────────────────────────────────────────

const CONF_COLORS: Record<string, string> = {
  KESİN: "#10B981", CERTAIN: "#10B981", HIGH: "#10B981",
  GÜÇLÜ: "#F59E0B", STRONG: "#F59E0B", MEDIUM: "#F59E0B",
  VARSAYIM: "#6B7280", ASSUMPTION: "#6B7280", LOW: "#6B7280",
};

// ─── MATERIAL DB ──────────────────────────────────────────────────────────

const MAT_DB: Record<string, { label: string; kc1: number; mc: number; vc: number[]; color: string }> = {
  "P_soft":   { label: "P — Steel (≤250 HB)",          kc1: 1900, mc: 0.26, vc: [180, 280, 400], color: "#3B82F6" },
  "P_hard":   { label: "P — Steel (250-350 HB)",        kc1: 2200, mc: 0.28, vc: [100, 180, 280], color: "#2563EB" },
  "M_aust":   { label: "M — Austenitic Stainless Steel", kc1: 2400, mc: 0.22, vc: [80, 160, 240], color: "#8B5CF6" },
  "M_duplex": { label: "M — Duplex Stainless Steel",     kc1: 2700, mc: 0.24, vc: [60, 120, 180], color: "#7C3AED" },
  "K_gg":     { label: "K — Cast Iron (GG)",            kc1: 1350, mc: 0.20, vc: [100, 200, 350], color: "#6B7280" },
  "K_ggg":    { label: "K — Nodular Iron (GGG)",         kc1: 1600, mc: 0.22, vc: [80, 160, 280], color: "#4B5563" },
  "N_al":     { label: "N — Aluminum Alloy",             kc1: 750,  mc: 0.14, vc: [400, 800, 1500], color: "#10B981" },
  "N_cu":     { label: "N — Copper/Brass",               kc1: 900,  mc: 0.16, vc: [200, 400, 800], color: "#059669" },
  "S_ti":     { label: "S — Titanium (Ti6Al4V)",         kc1: 2800, mc: 0.30, vc: [30, 60, 100], color: "#F59E0B" },
  "S_ni":     { label: "S — Inconel 718 / Ni Alloy",     kc1: 3000, mc: 0.32, vc: [20, 45, 80], color: "#D97706" },
  "H_hrc55":  { label: "H — Hardened Steel (>55 HRC)",   kc1: 3200, mc: 0.35, vc: [50, 120, 200], color: "#EF4444" },
};

// ─── SMART DEFAULTS ───────────────────────────────────────────────────────

function getSmartDefaults(tool: any, values: Record<string, any>): Record<string, any> {
  const s: Record<string, any> = {};
  if (values.material_group && (values.kc1 === undefined || values.kc1 === "")) {
    const m = MAT_DB[values.material_group];
    if (m) s.kc1 = m.kc1;
  }
  if (values.material_group && (values.mc === undefined || values.mc === "")) {
    const m = MAT_DB[values.material_group];
    if (m) s.mc = m.mc;
  }
  const taylor: Record<string, { C: number; n: number }> = {
    "P_soft": { C: 600, n: 0.25 }, "P_hard": { C: 400, n: 0.22 },
    "M_aust": { C: 350, n: 0.20 }, "M_duplex": { C: 280, n: 0.18 },
    "K_gg":   { C: 800, n: 0.20 }, "K_ggg":   { C: 650, n: 0.20 },
    "N_al":   { C: 1200, n: 0.30 }, "S_ti":   { C: 200, n: 0.15 },
    "S_ni":   { C: 150, n: 0.13 }, "H_hrc55": { C: 500, n: 0.30 },
  };
  if (values.material_group) {
    const t = taylor[values.material_group];
    if (t) {
      if (values.taylor_c === undefined || values.taylor_c === "") s.taylor_c = t.C;
      if (values.taylor_n === undefined || values.taylor_n === "") s.taylor_n = t.n;
    }
  }
  return s;
}

// ─── FORMULA ENGINE ────────────────────────────────────────────────────────

function evaluateFormula(fs: string, vars: Record<string, any>): { varName: string; value: any } | null {
  const eq = fs.indexOf("=");
  if (eq === -1) return null;
  const vn = fs.substring(0, eq).trim();
  let ex = fs.substring(eq + 1).split("//")[0].trim();
  ex = ex.replace(/\bPOWER\s*\(([^,]+),([^)]+)\)/gi, "Math.pow($1,$2)")
    .replace(/\bSQRT\s*\(([^)]+)\)/gi, "Math.sqrt($1)")
    .replace(/\bABS\s*\(([^)]+)\)/gi, "Math.abs($1)")
    .replace(/\bLN\s*\(([^)]+)\)/gi, "Math.log($1)")
    .replace(/\bLOG10\s*\(([^)]+)\)/gi, "Math.log10($1)")
    .replace(/\bEXP\s*\(([^)]+)\)/gi, "Math.exp($1)")
    .replace(/\bSIN\s*\(([^)]+)\)/gi, "Math.sin($1)")
    .replace(/\bCOS\s*\(([^)]+)\)/gi, "Math.cos($1)")
    .replace(/\bTAN\s*\(([^)]+)\)/gi, "Math.tan($1)")
    .replace(/\bPI\b/g, "Math.PI")
    .replace(/\bMAX\s*\(([^)]+)\)/gi, "Math.max($1)")
    .replace(/\bMIN\s*\(([^)]+)\)/gi, "Math.min($1)")
    .replace(/\bFLOOR\s*\(([^)]+)\)/gi, "Math.floor($1)")
    .replace(/\bCEIL\s*\(([^)]+)\)/gi, "Math.ceil($1)")
    .replace(/\bROUND\s*\(([^)]+)\)/gi, "Math.round($1)");
  const av = { ...vars };
  try {
    const keys = Object.keys(av);
    const vals = Object.values(av);
    const fn = new Function(...keys, `"use strict"; return (${ex});`);
    const r = fn(...vals);
    return { varName: vn, value: typeof r === "number" && isFinite(r) ? r : null };
  } catch { return { varName: vn, value: null }; }
}

function runFormulas(formulas: string[], parsed: Record<string, any>) {
  const computed = { ...parsed };
  const steps: Array<{ formula: string; varName: string; value: any; error?: boolean }> = [];
  for (const f of formulas) {
    if (!f.trim() || f.trim().startsWith("//")) continue;
    const r = evaluateFormula(f, computed);
    if (r && r.value !== null) { computed[r.varName] = r.value; steps.push({ formula: f, varName: r.varName, value: r.value }); }
    else if (r) steps.push({ formula: f, varName: r.varName, value: null, error: true });
  }
  return { computed, steps };
}

function runValidations(tool: any, computed: Record<string, any>) {
  const errs: Array<{ field: string; message: string; type: string }> = [];
  const v = tool.engine_rules?.validation || {};
  for (const [, rule] of Object.entries(v)) {
    const r = rule as any;
    if (r.condition) {
      try {
        const keys = Object.keys(computed);
        const vals = Object.values(computed);
        const fn = new Function(...keys, `"use strict"; return !!(${r.condition});`);
        if (fn(...vals)) errs.push({ field: r.condition, message: r.error_msg, type: r.action === "WARN" ? "warning" : "error" });
      } catch { /* ignore */ }
    }
  }
  return errs;
}

function runWarnings(tool: any, computed: Record<string, any>) {
  const w: Array<{ severity: string; source: string; message: string }> = [];
  const sw = tool.engine_rules?.smart_warnings || [];
  for (const ww of sw) {
    try {
      const keys = Object.keys(computed);
      const vals = Object.values(computed);
      const cs = (ww.condition || "").replace(/\s+AND\s+/gi, " && ").replace(/\s+OR\s+/gi, " || ");
      const fn = new Function(...keys, `"use strict"; return !!(${cs});`);
      if (fn(...vals)) w.push({ severity: ww.severity || "WARNING", source: ww.source || "", message: ww.message });
    } catch { /* ignore */ }
  }
  return w;
}

function makeOutputSteps(result: any): Array<{ varName: string; value: any }> {
  const keys = ["M_Rd", "V_Rd", "UC_flexure", "UC_shear", "UC", "governingMode", "status", "rho_l", "x", "z", "M_design", "V_design"];
  const steps: Array<{ varName: string; value: any }> = [];
  for (const k of keys) { if (result[k] !== undefined) steps.push({ varName: k, value: result[k] }); }
  for (const [k, val] of Object.entries(result)) {
    if (!keys.includes(k) && typeof val === "number" && !steps.find(s => s.varName === k)) steps.push({ varName: k, value: val });
  }
  return steps;
}

function extractFormulaName(fs: string): string { return fs.split("=")[0].trim(); }
function extractFormulaUnit(fs: string): string { const m = fs.match(/\/\/\s*\[([^\]]+)\]/); return m ? m[1] : ""; }

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────

export default function ProToolPremiumRenderer({
  tool,
  onResult = () => {},
  onCalculate = () => Promise.resolve(true),
  customCalc = null,
}: ProToolPremiumRendererProps) {
  const [values, setValues] = useState(() => {
    const init: Record<string, any> = {};
    (tool?.inputs || []).forEach((inp: any) => { if (inp.default !== undefined) init[inp.id] = inp.default; });
    return init;
  });
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [validErrors, setValidErrors] = useState<Array<{ field: string; message: string; type: string }>>([]);
  const [warnings, setWarnings] = useState<Array<{ severity: string; source: string; message: string }>>([]);
  const [activeTab, setActiveTab] = useState<string>("inputs");
  const [activeMat, setActiveMat] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const smartDefaults = useMemo(() => getSmartDefaults(tool, values), [tool, values]);
  const ucThreshold = tool.engine_rules?.uc_threshold || { pass_max: 0.9, warn_max: 1.0, fail_min: 1.0 };

  const handleChange = useCallback((id: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [id]: value === "" ? "" : (isNaN(value) ? value : Number(value)) }));
    setCalculated(false);
  }, []);

  const applyDefault = useCallback((id: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [id]: value }));
  }, []);

  // ─── CALCULATE ─────────────────────────────────────────────────────────

  const handleCalculate = useCallback(async () => {
    if (onCalculate) {
      const allowed = await onCalculate();
      if (!allowed) return;
    }

    const inputs = tool.inputs || [];
    const missing: Array<{ field: string; message: string; type: string }> = [];
    inputs.forEach((inp: any) => {
      if (isInputHidden(inp, values)) return;
      if (inp.required) {
        const v = values[inp.id];
        if (v === undefined || v === null || v === "") missing.push({ field: inp.id, message: `${inp.name || inp.id} required.`, type: "error" });
      }
    });
    if (missing.length > 0) { setValidErrors(missing); setCalculated(false); return; }

    const parsed: Record<string, any> = {};
    inputs.forEach((inp: any) => {
      const raw = values[inp.id];
      if (raw !== undefined && raw !== "") parsed[inp.id] = inp.type === "number" ? Number(raw) : raw;
    });

    if (customCalc) {
      try {
        const result = customCalc(parsed);
        setValidErrors([]);
        setWarnings(result.warnings || []);
        const steps = makeOutputSteps(result);
        const all = { ...parsed, ...Object.fromEntries(steps.map((s: any) => [s.varName, s.value])) };
        setResults({ computed: all, steps, parsed });
        setCalculated(true);
        if (onResult) onResult({ computed: all, warnings: result.warnings || [] });
      } catch (err: any) {
        setValidErrors([{ field: "calc", message: err.message || "Calculation error", type: "error" }]);
        setCalculated(false);
        return;
      }
    } else {
      const { computed, steps } = runFormulas(tool.formulas || [], parsed);
      const errors = runValidations(tool, computed);
      setValidErrors(errors);
      if (errors.some((e: any) => e.type === "error")) { setCalculated(false); return; }
      const warns = runWarnings(tool, computed);
      setWarnings(warns);
      const outSteps = steps.filter((s: any) => !Object.keys(parsed).includes(s.varName));
      setResults({ computed, steps: outSteps, parsed });
      setCalculated(true);
      if (onResult) onResult({ computed, warnings: warns });
    }

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, [tool, values, onResult, onCalculate, customCalc]);

  const reset = useCallback(() => {
    setValues({}); setCalculated(false); setResults(null); setValidErrors([]); setWarnings([]); setActiveTab("inputs"); setActiveMat(null);
  }, []);

  // ─── DERIVED ──────────────────────────────────────────────────────────

  if (!tool) return <div style={{ padding: 40, textAlign: "center", color: "rgba(26,25,21,0.4)" }}>Tool data not found.</div>;

  const inputs = tool.inputs || [];
  const visibleInputs = inputs.filter((inp: any) => !isInputHidden(inp, values));
  const enumInputs = visibleInputs.filter((i: any) => i.type === "enum");
  const numInputs = visibleInputs.filter((i: any) => i.type !== "enum");
  const hasFMEA = (tool.engine_rules?.fmea?.length || 0) > 0;
  const hasAudit = !!tool.engine_rules?.audit_log;
  const warningCounts = {
    CRITICAL: warnings.filter(w => w.severity === "CRITICAL").length,
    WARNING: warnings.filter(w => w.severity === "WARNING").length,
    INFO: warnings.filter(w => w.severity === "INFO").length,
  };

  const ucVal = results?.computed?.UC;
  let ucStatus: string | null = null;
  if (calculated && ucVal !== undefined) {
    if (ucVal > ucThreshold.fail_min) ucStatus = "FAIL";
    else if (ucVal > ucThreshold.pass_max) ucStatus = "WARN";
    else ucStatus = "PASS";
  }

  const allTabs = ["inputs", "results", "formulas", ...(hasFMEA ? ["fmea"] : []), ...(hasAudit ? ["audit"] : [])];

  // ─── HANDLE MATERIAL SELECT ───────────────────────────────────────────

  const handleMatSelect = (key: string) => {
    setActiveMat(key);
    const m = MAT_DB[key];
    if (m) { handleChange("kc1", m.kc1); handleChange("mc", m.mc); }
  };

  // ─── HANDLE FORM SUBMIT ───────────────────────────────────────────────

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleCalculate();
  };

  // ─── RENDER ──────────────────────────────────────────────────────────

  return (
    <div className="sc-premium">
      {/* Standards Strip */}
      {tool.engine_rules?.standards?.length > 0 && (
        <div className="sc-premium-std-strip">
          <span className="sc-premium-std-lbl">REFERENCE:</span>
          {tool.engine_rules.standards.map((s: string, i: number) => (
            <span key={i} className="sc-premium-std-tag">{s}</span>
          ))}
        </div>
      )}

      {/* Tool Card */}
      <div className="sc-premium-tool-card">
        {/* Header */}
        <div className="sc-premium-tool-hdr">
          <div>
            <div className="sc-premium-tool-eyebrow">{tool.category}</div>
            <div className="sc-premium-tool-title">{tool.tool_name || tool.title}</div>
            {tool.tool_id && <div className="sc-premium-tool-meta">{tool.tool_id}</div>}
          </div>
          <div className="sc-premium-status-area">
            {calculated && ucStatus ? (
              ucStatus === "FAIL" ? (
                <span className="sc-premium-badge sc-premium-badge-crit">✕ FAIL</span>
              ) : ucStatus === "WARN" ? (
                <span className="sc-premium-badge sc-premium-badge-warn">△ WARNING</span>
              ) : (
                <span className="sc-premium-badge sc-premium-badge-ok">✓ PASS</span>
              )
            ) : calculated && warningCounts.CRITICAL > 0 ? (
              <span className="sc-premium-badge sc-premium-badge-crit">⛔ {warningCounts.CRITICAL} CRITICAL</span>
            ) : calculated && warningCounts.WARNING > 0 ? (
              <span className="sc-premium-badge sc-premium-badge-warn">⚠ {warningCounts.WARNING} WARNING</span>
            ) : calculated && warnings.length === 0 ? (
              <span className="sc-premium-badge sc-premium-badge-ok">✓ NORMAL</span>
            ) : (
              <span className="sc-premium-badge sc-premium-badge-idle">— NOT RUN</span>
            )}
            {calculated && ucVal !== undefined && (
              <span style={{
                fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                padding: "3px 9px", background: "rgba(26,25,21,0.06)", color: "#1A1915",
                display: "inline-flex", alignItems: "center", whiteSpace: "nowrap",
              }}>UC = {fmtVal(ucVal, 3)}</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="sc-premium-tabs">
          {allTabs.map(tab => (
            <button
              key={tab}
              className={`sc-premium-tab-btn${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "inputs" ? "Input" : tab === "results" ? "Result" : tab === "formulas" ? "Formulas" : tab === "fmea" ? "FMEA" : "Audit"}
              {tab === "results" && calculated && warnings.length > 0 && <span className="sc-premium-tab-dot" />}
            </button>
          ))}
        </div>

        {/* ── INPUT PANEL ──────────────────────────────────────────────── */}
        {activeTab === "inputs" && (
          <div className="sc-premium-panel">
            <form onSubmit={handleFormSubmit} noValidate>
              {/* Material Selection */}
              {inputs.some((i: any) => i.id === "material_group") && (
                <div style={{ marginBottom: 16 }}>
                  <div className="sc-premium-sec-lbl">Class / Type Selection</div>
                  <div className="sc-premium-mat-grid">
                    {Object.entries(MAT_DB).map(([k, m]) => (
                      <div key={k} className={`sc-premium-mat-option${activeMat === k ? " selected" : ""}`} onClick={() => handleMatSelect(k)}>
                        <div className="sc-premium-mat-name" style={{ color: m.color }}>{m.label}</div>
                        <div className="sc-premium-mat-sub">kc1: {m.kc1} N/mm² · mc: {m.mc}</div>
                        <div className="sc-premium-mat-vc">Vc: {m.vc[0]}–{m.vc[2]} m/min</div>
                      </div>
                    ))}
                  </div>
                  {activeMat && MAT_DB[activeMat] && (
                    <div className="sc-premium-mat-info">
                      <div className="sc-premium-mat-accent-bar" style={{ background: MAT_DB[activeMat].color }} />
                      <div className="sc-premium-mat-info-body">
                        <div className="sc-premium-mat-ref">Sandvik C-2920 / ISO 513 Reference Values</div>
                        <div className="sc-premium-mat-stats">
                          {["Vc", "kc1", "mc"].map(f => {
                            const m = MAT_DB[activeMat];
                            const v = f === "Vc" ? `${m.vc[0]}–${m.vc[2]}` : f === "kc1" ? String(m.kc1) : String(m.mc);
                            return (
                              <div key={f} className="sc-premium-ms">
                                <span className="sc-premium-ms-l">{f}</span>
                                <span className="sc-premium-ms-v">{v}</span>
                                <span className="sc-premium-ms-s">{f === "Vc" ? "m/min" : f === "kc1" ? "N/mm²" : "Kienzle"}</span>
                              </div>
                            );
                          })}
                        </div>
                        {Object.keys(smartDefaults).length > 0 && (
                          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                            {Object.entries(smartDefaults).map(([id, val]) => (
                              <button key={id} type="button"
                                style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", background: "#BD5D3A", color: "#fff", border: "none", cursor: "pointer" }}
                                onClick={() => applyDefault(id, val)}
                              >Apply {id} = {val}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enum inputs (designStandard, etc.) */}
              {enumInputs.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div className="sc-premium-sec-lbl">CLASS / TYPE SELECTION</div>
                  <div className="sc-premium-inp-grid">
                    {enumInputs.map((inp: any) => {
                      const options = inp.options
                        ? (typeof inp.options[0] === "string" ? inp.options.map((o: string) => ({ value: o, label: o })) : inp.options)
                        : [];
                      return (
                        <div key={inp.id} className="sc-premium-inp-item">
                          <label className="sc-premium-inp-lbl">
                            {inp.name}{inp.required && <span className="sc-premium-inp-req">*</span>}
                            {inp.confidence_label && <span className={`sc-premium-conf ${confClass(inp.confidence_label)}`}>{translateConf(inp.confidence_label)}</span>}
                            {inp.symbol && inp.symbol !== inp.id && <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "rgba(26,25,21,0.35)" }}>[{inp.symbol}]</span>}
                          </label>
                          <select className="sc-premium-select" value={values[inp.id] ?? ""} onChange={e => handleChange(inp.id, e.target.value)}>
                            <option value="">— Select —</option>
                            {options.map((opt: any, i: number) => (
                              <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
                            ))}
                          </select>
                          {inp.note && <div className="sc-premium-inp-hint">{inp.note}</div>}
                          {validErrors.find(e => e.field === inp.id) && <div className="sc-premium-inp-err-msg">{validErrors.find(e => e.field === inp.id)?.message}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Numeric Inputs */}
              {numInputs.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div className="sc-premium-sec-lbl">INPUT PARAMETERS</div>
                  <div className="sc-premium-inp-grid">
                    {numInputs.map((inp: any) => {
                      const val = values[inp.id] ?? "";
                      const hasSugg = smartDefaults[inp.id] !== undefined && (values[inp.id] === undefined || values[inp.id] === "");
                      const error = validErrors.find(e => e.field === inp.id);
                      const confColor = CONF_COLORS[String(inp.confidence_label).toUpperCase()] || "#6B7280";

                      return (
                        <div key={inp.id} className={`sc-premium-inp-item${error ? " has-err" : ""}`}>
                          <label className="sc-premium-inp-lbl">
                            {inp.name}{inp.required && <span className="sc-premium-inp-req">*</span>}
                            {inp.confidence_label && (
                              <span className={`sc-premium-conf ${confClass(inp.confidence_label)}`} style={{ borderColor: confColor, color: confColor }}>
                                {translateConf(inp.confidence_label)}
                              </span>
                            )}
                            {inp.symbol && inp.symbol !== inp.id && (
                              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "rgba(26,25,21,0.35)" }}>[{inp.symbol}]</span>
                            )}
                          </label>
                          <div className="sc-premium-inp-row">
                            <input
                              type="number"
                              step={inp.resolution || "any"}
                              min={inp.absolute_min}
                              max={inp.absolute_max}
                              value={val === "" ? "" : String(val)}
                              placeholder={inp.default !== undefined ? `Default: ${inp.default}` : inp.note || "..."}
                              className={error ? "err" : ""}
                              onChange={e => handleChange(inp.id, e.target.value)}
                            />
                            {inp.unit && <span className="sc-premium-unit">{inp.unit}</span>}
                          </div>
                          <div className="sc-premium-inp-hint">
                            {inp.absolute_min !== undefined && `Min: ${inp.absolute_min}${inp.absolute_max !== undefined ? ` · Max: ${inp.absolute_max}` : ""}${inp.unit ? ` ${inp.unit}` : ""}`}
                          </div>
                          {hasSugg && (
                            <div className="sc-premium-suggestion">
                              <span>Suggested: <strong>{smartDefaults[inp.id]}</strong></span>
                              <button type="button" className="sc-premium-apply-btn" onClick={() => applyDefault(inp.id, smartDefaults[inp.id])}>Apply</button>
                            </div>
                          )}
                          {error && <div className="sc-premium-inp-err-msg">{error.message}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Validation Errors */}
              {validErrors.length > 0 && (
                <div className="sc-premium-err-panel">
                  {validErrors.map((e, i) => (
                    <div key={i} className="sc-premium-err-item">
                      <span className="sc-premium-err-icon">✕</span>
                      <span>{e.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Row */}
              <div className="sc-premium-action-row">
                <button type="submit" className="sc-premium-calc-btn">Calculate</button>
                {calculated && <button type="button" className="sc-premium-reset-btn" onClick={reset}>Reset</button>}
              </div>
            </form>
          </div>
        )}

        {/* ── RESULTS PANEL ──────────────────────────────────────────────── */}
        {activeTab === "results" && (
          <div className="sc-premium-panel" ref={resultsRef}>
            {!calculated ? (
              <div className="sc-premium-empty-res">
                <span style={{ display: "block", fontSize: 24, marginBottom: 8 }}>⚙</span>
                <p>Enter parameters in the input panel and click Calculate.</p>
              </div>
            ) : (
              <>
                {/* Warnings */}
                {warnings.length > 0 && (
                  <div className="sc-premium-warn-panel">
                    {warnings.map((w, i) => (
                      <div key={`w-${i}`} className={`sc-premium-warn-card ${w.severity}`}>
                        <div className="sc-premium-warn-hdr">
                          <span>{w.severity === "CRITICAL" ? "⛔" : w.severity === "WARNING" ? "⚠" : "ℹ"}</span>
                          <span className="sc-premium-warn-sev">{w.severity}</span>
                          {w.source && <span className="sc-premium-warn-src">{w.source}</span>}
                        </div>
                        <div className="sc-premium-warn-msg">{w.message}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Results Table */}
                {results.steps.length > 0 && (
                  <div className="sc-premium-res-table">
                    <div className="sc-premium-res-hdr">
                      <span>Calculated Value</span>
                      <span>Result</span>
                      <span>Unit</span>
                    </div>
                    {results.steps.map((step: any, i: number) => {
                      const isKey = ["total", "result", "final", "nett", "cost", "uc"].some(kw => step.varName.toLowerCase().includes(kw)) || i === 0;
                      const formulaArr = Array.isArray(tool.formulas) ? tool.formulas : [];
                      const unit = extractFormulaUnit(formulaArr.find((f: string) => extractFormulaName(f) === step.varName) || "");
                      const displayName = step.varName.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
                      return (
                        <div key={i} className="sc-premium-res-row">
                          <span className="sc-premium-res-name">
                            {displayName}
                            <span className="sc-premium-res-varname">{step.varName}</span>
                          </span>
                          <span className={`sc-premium-res-val${isKey ? " highlight" : ""}`}>{fmtVal(step.value)}</span>
                          <span className="sc-premium-res-unit">{unit || "—"}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* References */}
                {tool.engine_rules?.smart_warnings?.some((w: any) => w.source) && (
                  <div className="sc-premium-refs-row">
                    <span className="sc-premium-ref-ttl">SOURCE:</span>
                    {[...new Set((tool.engine_rules.smart_warnings || []).map((w: any) => w.source).filter(Boolean))].map((src: any, i: number) => (
                      <span key={i} className="sc-premium-ref-tag">{src}</span>
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
            {/* Formulas */}
            {tool.formulas && tool.formulas.filter((f: string) => f.trim() && !f.trim().startsWith("//")).length > 0 && (
              <>
                <div className="sc-premium-sec-lbl">Calculation Formulas</div>
                <div className="sc-premium-frm-list">
                  {tool.formulas.filter((f: string) => f.trim() && !f.trim().startsWith("//")).map((f: string, i: number) => {
                    const eq = f.indexOf("=");
                    if (eq === -1) return null;
                    const lhs = f.substring(0, eq).trim();
                    const rhs = f.substring(eq + 1).split("//")[0].trim();
                    const cmt = f.includes("//") ? f.split("//")[1].trim() : "";
                    return (
                      <div key={i} className="sc-premium-frm-row">
                        <div className="sc-premium-frm-lhs">{lhs}</div>
                        <div className="sc-premium-frm-eq">=</div>
                        <div className="sc-premium-frm-rhs">{rhs}{cmt && <span className="sc-premium-frm-note">{cmt}</span>}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Validation Rules */}
            {tool.engine_rules?.validation && Object.keys(tool.engine_rules.validation).length > 0 && (
              <>
                <div className="sc-premium-sec-lbl" style={{ marginTop: 14 }}>Validation Rules</div>
                <div className="sc-premium-val-list">
                  {Object.entries(tool.engine_rules.validation).map(([k, v]: [string, any], i: number) => (
                    <div key={i} className="sc-premium-val-item">
                      <div className="sc-premium-val-key">{k}</div>
                      <div className="sc-premium-val-msg">{v.error_msg}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(!tool.formulas || tool.formulas.length === 0) && (
              <div className="sc-premium-empty-res">No formula data available.</div>
            )}
          </div>
        )}

        {/* ── FMEA PANEL ────────────────────────────────────────────────── */}
        {activeTab === "fmea" && hasFMEA && (
          <div className="sc-premium-panel">
            <div className="sc-premium-sec-lbl">FAILURE MODE & EFFECTS ANALYSIS</div>
            <div className="sc-premium-res-table">
              <div className="sc-premium-res-hdr" style={{ gridTemplateColumns: "1fr 80px 100px 90px" }}>
                <span>Failure Mode</span>
                <span>Severity</span>
                <span>Condition</span>
                <span>RPN</span>
              </div>
              {(tool.engine_rules?.fmea || []).map((entry: any, i: number) => (
                <div key={i} className="sc-premium-res-row" style={{ gridTemplateColumns: "1fr 80px 100px 90px" }}>
                  <span className="sc-premium-res-name" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    {entry.failureMode}
                    <span style={{ fontSize: 9, color: "rgba(26,25,21,0.48)", lineHeight: 1.4, marginTop: 2 }}>{entry.description || entry.effect || ""}</span>
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", letterSpacing: "0.06em",
                    background: entry.severity === "HIGH" ? "#FEF2F2" : entry.severity === "MEDIUM" ? "#FFFBEB" : "#EFF6FF",
                    color: entry.severity === "HIGH" ? "#DC2626" : entry.severity === "MEDIUM" ? "#D97706" : "#2563EB",
                    display: "inline-block", textAlign: "center" as const,
                  }}>{entry.severity}</span>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "rgba(26,25,21,0.45)" }}>{entry.condition || entry.likelihood || "—"}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, textAlign: "right" as const,
                    color: (entry.rpn_high || entry.rpn || 0) > 200 ? "#DC2626" : (entry.rpn_high || entry.rpn || 0) > 100 ? "#D97706" : "#059669",
                  }}>{entry.rpn_high || entry.rpn || "—"}{entry.rpn_low ? ` / ${entry.rpn_low}` : ""}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AUDIT PANEL ──────────────────────────────────────────────── */}
        {activeTab === "audit" && hasAudit && (
          <div className="sc-premium-panel">
            <div className="sc-premium-sec-lbl">AUDIT LOG</div>
            {calculated && results?.computed ? (
              <div className="sc-premium-res-table">
                <div className="sc-premium-res-hdr" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <span>Field</span>
                  <span>Value</span>
                </div>
                {[
                  { label: "Tool ID", value: tool.tool_id },
                  { label: "Timestamp", value: new Date().toLocaleString() },
                  { label: "Design Standard", value: values.designStandard || "—" },
                  { label: "UC (Flexure)", value: results.computed.UC_flexure !== undefined ? fmtVal(results.computed.UC_flexure, 4) : "—" },
                  { label: "UC (Shear)", value: results.computed.UC_shear !== undefined ? fmtVal(results.computed.UC_shear, 4) : "—" },
                  { label: "UC (Governing)", value: results.computed.UC !== undefined ? fmtVal(results.computed.UC, 4) : "—" },
                  { label: "Status", value: ucStatus || results.computed.status || "—" },
                  { label: "Warnings", value: warnings.length },
                ].map((entry, i) => (
                  <div key={i} className="sc-premium-res-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(26,25,21,0.65)" }}>{entry.label}</span>
                    <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#1A1915", textAlign: "right" as const }}>{String(entry.value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sc-premium-empty-res">
                <span style={{ display: "block", fontSize: 24, marginBottom: 8 }}>📋</span>
                <p>Run a calculation to generate an audit log entry.</p>
              </div>
            )}
          </div>
        )}

        {/* ── CTA BAR ──────────────────────────────────────────────────────── */}
        {calculated && activeTab !== "results" && (
          <div className="sc-premium-cbar">
            <span>Calculation completed.</span>
            <button className="sc-premium-cbar-btn" onClick={() => setActiveTab("results")}>View Results →</button>
          </div>
        )}
      </div>
    </div>
  );
}
