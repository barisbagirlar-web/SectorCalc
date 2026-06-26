/**
 * SectorCalc Universal Industrial Calculator Engine
 * 
 * Usage:
 *   import UniversalCalculator from '@/components/calculators/UniversalCalculator'
 *   <UniversalCalculator tool={toolJson} locale="en" onResult={(r) => console.log(r)} />
 * 
 * toolJson format: Each tool object defined in JSON structure
 */

import { useState, useCallback, useMemo, useRef } from "react";

// ─── SANDVIK / ISO LOOKUP TABLES ────────────────────────────────────────────
const MATERIAL_DB = {
  // ISO 513 Group → { kc1_mid, mc, vc_min, vc_opt, vc_max, sf_static, sf_fatigue }
  "P_soft":   { label: "P — Steel (≤250 HB)",          kc1: 1900, mc: 0.26, vc: [180,280,400], color: "#3B82F6" },
  "P_hard":   { label: "P — Steel (250-350 HB)",        kc1: 2200, mc: 0.28, vc: [100,180,280], color: "#2563EB" },
  "M_aust":   { label: "M — Austenitic Stainless Steel",       kc1: 2400, mc: 0.22, vc: [80,160,240],  color: "#8B5CF6" },
  "M_duplex": { label: "M — Duplex Stainless Steel",           kc1: 2700, mc: 0.24, vc: [60,120,180],  color: "#7C3AED" },
  "K_gg":     { label: "K — Cast Iron (GG)",          kc1: 1350, mc: 0.20, vc: [100,200,350], color: "#6B7280" },
  "K_ggg":    { label: "K — Nodular Iron (GGG)",       kc1: 1600, mc: 0.22, vc: [80,160,280],  color: "#4B5563" },
  "N_al":     { label: "N — Aluminum Alloy",         kc1: 750,  mc: 0.14, vc: [400,800,1500],color: "#10B981" },
  "N_cu":     { label: "N — Copper/Brass",              kc1: 900,  mc: 0.16, vc: [200,400,800], color: "#059669" },
  "S_ti":     { label: "S — Titanium (Ti6Al4V)",        kc1: 2800, mc: 0.30, vc: [30,60,100],   color: "#F59E0B" },
  "S_ni":     { label: "S — Inconel 718 / Ni Alloy", kc1: 3000, mc: 0.32, vc: [20,45,80],    color: "#D97706" },
  "H_hrc55":  { label: "H — Hardened Steel (>55 HRC)", kc1: 3200, mc: 0.35, vc: [50,120,200],  color: "#EF4444" },
};

const SAFETY_FACTORS = {
  static_general:   { min: 2.0, warn: 2.5,  std: "ISO 6336"    },
  fatigue_general:  { min: 3.5, warn: 4.0,  std: "DIN 743"     },
  pressure_vessel:  { min: 4.0, warn: 5.0,  std: "ASME VIII"   },
  weld_static:      { min: 2.5, warn: 3.0,  std: "AWS D1.1"    },
  weld_fatigue:     { min: 5.0, warn: 6.0,  std: "AWS D1.1"    },
  bolt_static:      { min: 2.5, warn: 3.0,  std: "VDI 2230"    },
  bolt_dynamic:     { min: 4.0, warn: 5.0,  std: "VDI 2230"    },
  structural_axial: { min: 1.67,warn: 2.0,  std: "AISC 360"    },
  lifting:          { min: 5.0, warn: 6.0,  std: "FEM 1.001"   },
};

const QUALITY_THRESHOLDS = {
  cpk:            { critical: 1.0, warning: 1.33, good: 1.67, std: "IATF 16949" },
  grr_pct:        { good: 10,      warning: 30,   critical: 30, std: "AIAG MSA 4th" },
  aql_pct:        { good: 1.0,     warning: 2.5,  critical: 4.0, std: "ISO 2859-1" },
  sigma_level:    { critical: 3,   warning: 4,    good: 5,      std: "ASQ" },
};

const ENERGY_REFS = {
  co2_tr_grid:    0.547,  // kg CO2e/kWh — IEA 2023 Türkiye
  co2_eu_grid:    0.255,  // kg CO2e/kWh — EEA 2023 AB
  eu_ets_eur_ton: 62,     // EUR/tCO2e — EU ETS 2024 ortalama
  gwp_sf6:        23500,  // GWP100 — IPCC AR6
  gwp_r410a:      2088,   // GWP100 — IPCC AR6
};

// ─── FORMULA ENGINE ──────────────────────────────────────────────────────────
function evaluateFormula(formulaStr, vars) {
  // Parse "Result = expression" format
  const eqIdx = formulaStr.indexOf("=");
  if (eqIdx === -1) return null;
  const varName = formulaStr.substring(0, eqIdx).trim();
  let expr = formulaStr.substring(eqIdx + 1).split("//")[0].trim(); // strip comment line

  // Convert Math functions
  expr = expr
    .replace(/\bPOWER\s*\(([^,]+),([^)]+)\)/gi, "Math.pow($1,$2)")
    .replace(/\bSQRT\s*\(([^)]+)\)/gi, "Math.sqrt($1)")
    .replace(/\bABS\s*\(([^)]+)\)/gi, "Math.abs($1)")
    .replace(/\bLN\s*\(([^)]+)\)/gi, "Math.log($1)")
    .replace(/\bLOG10\s*\(([^)]+)\)/gi, "Math.log10($1)")
    .replace(/\bEXP\s*\(([^)]+)\)/gi, "Math.exp($1)")
    .replace(/\bSIN\s*\(([^)]+)\)/gi, "Math.sin($1)")
    .replace(/\bCOS\s*\(([^)]+)\)/gi, "Math.cos($1)")
    .replace(/\bTAN\s*\(([^)]+)\)/gi, "Math.tan($1)")
    .replace(/\bPI\b/g, "Math.PI")
    .replace(/\bNORMSINV\s*\(([^)]+)\)/gi, "_normsinv($1)")
    .replace(/\bNORMSDIST\s*\(([^)]+)\)/gi, "_normsdist($1)")
    .replace(/\bMAX\s*\(([^)]+)\)/gi, "Math.max($1)")
    .replace(/\bMIN\s*\(([^)]+)\)/gi, "Math.min($1)")
    .replace(/\bFLOOR\s*\(([^)]+)\)/gi, "Math.floor($1)")
    .replace(/\bCEIL\s*\(([^)]+)\)/gi, "Math.ceil($1)")
    .replace(/\bROUND\s*\(([^)]+)\)/gi, "Math.round($1)");

  // Inject variables — all computed + user inputs
  const allVars = { ...vars };

  // Safe eval
  try {
    const keys = Object.keys(allVars);
    const vals = Object.values(allVars);
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      "_normsinv", "_normsdist",
      ...keys,
      `"use strict"; return (${expr});`
    );
    const result = fn(_normsinv, _normsdist, ...vals);
    return { varName, value: typeof result === "number" && isFinite(result) ? result : null };
  } catch {
    return { varName, value: null };
  }
}

// Approximate normal distribution functions
function _normsdist(z) {
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return 0.5 * (1 + sign * y);
}
function _normsinv(p) {
  // Beasley-Springer-Moro algorithm
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [0,-3.969683028665376e+01,2.209460984245205e+02,-2.759285104469687e+02,1.383577518672690e+02,-3.066479806614716e+01,2.506628277459239e+00];
  const b = [0,-5.447609879822406e+01,1.615858368580409e+02,-1.556989798598866e+02,6.680131188771972e+01,-1.328068155288572e+01];
  const c = [0,-7.784894002430293e-03,-3.223964580411365e-01,-2.400758277161838e+00,-2.549732539343734e+00,4.374664141464968e+00,2.938163982698783e+00];
  const d = [0,7.784695709041462e-03,3.224671290700398e-01,2.445134137142996e+00,3.754408661907416e+00];
  const pLow = 0.02425, pHigh = 1 - pLow;
  let q, r;
  if (p < pLow) {
    q = Math.sqrt(-2*Math.log(p));
    return (((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6]) / ((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1);
  } else if (p <= pHigh) {
    q = p - 0.5; r = q*q;
    return (((((a[1]*r+a[2])*r+a[3])*r+a[4])*r+a[5])*r+a[6])*q / (((((b[1]*r+b[2])*r+b[3])*r+b[4])*r+b[5])*r+1);
  } else {
    q = Math.sqrt(-2*Math.log(1-p));
    return -(((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6]) / ((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1);
  }
}

function runAllFormulas(formulas, inputValues) {
  const computed = { ...inputValues };
  const steps = [];

  for (const formula of formulas) {
    const result = evaluateFormula(formula, computed);
    if (result && result.value !== null) {
      computed[result.varName] = result.value;
      steps.push({ formula, varName: result.varName, value: result.value });
    } else if (result) {
      steps.push({ formula, varName: result?.varName, value: null, error: true });
    }
  }
  return { computed, steps };
}

// ─── VALIDATION ENGINE ───────────────────────────────────────────────────────
function runValidations(tool, inputValues, computed) {
  const errors = [];
  const validations = tool.engine_rules?.validation || {};

  for (const [key, rule] of Object.entries(validations)) {
    // absolute_min / absolute_max
    if (rule.absolute_min !== undefined) {
      const inputId = key.replace(/_check$|_limit$/, "");
      const val = inputValues[inputId] ?? inputValues[key];
      if (val !== undefined && val !== "" && Number(val) < rule.absolute_min) {
        errors.push({ field: inputId, message: rule.error_msg, type: "error" });
      }
    }
    if (rule.absolute_max !== undefined) {
      const inputId = key.replace(/_check$|_limit$/, "");
      const val = inputValues[inputId] ?? inputValues[key];
      if (val !== undefined && val !== "" && Number(val) > rule.absolute_max) {
        errors.push({ field: inputId, message: rule.error_msg, type: "error" });
      }
    }
    // condition string (eval)
    if (rule.condition) {
      try {
        const allVars = { ...computed };
        const keys = Object.keys(allVars);
        const vals = Object.values(allVars);
        // eslint-disable-next-line no-new-func
        const fn = new Function(...keys, `"use strict"; return !!(${rule.condition});`);
        const triggered = fn(...vals);
        if (triggered) {
          errors.push({ field: key, message: rule.error_msg, type: "error" });
        }
      } catch { /* ignore */ }
    }
  }
  return errors;
}

// ─── WARNING ENGINE ──────────────────────────────────────────────────────────
function runWarnings(tool, computed) {
  const warnings = [];
  const smartWarnings = tool.engine_rules?.smart_warnings || [];

  for (const w of smartWarnings) {
    try {
      const keys = Object.keys(computed);
      const vals = Object.values(computed);
      // Support AND condition
      const condStr = w.condition.replace(/\s+AND\s+/gi, " && ").replace(/\s+OR\s+/gi, " || ");
      // eslint-disable-next-line no-new-func
      const fn = new Function(...keys, `"use strict"; return !!(${condStr});`);
      const triggered = fn(...vals);
      if (triggered) {
        warnings.push({
          severity: w.severity || "WARNING",
          source: w.source || "",
          message: w.message,
        });
      }
    } catch { /* ignore */ }
  }
  return warnings;
}

// ─── SMART DEFAULT SYSTEM ──────────────────────────────────────────────────
function getSmartDefaults(tool, inputValues) {
  const suggestions = {};

  // Material group → kc1 suggestion
  if (inputValues.material_group && (inputValues.kc1 === undefined || inputValues.kc1 === "")) {
    const mat = MATERIAL_DB[inputValues.material_group];
    if (mat) suggestions.kc1 = mat.kc1;
  }
  if (inputValues.material_group && (inputValues.mc === undefined || inputValues.mc === "")) {
    const mat = MATERIAL_DB[inputValues.material_group];
    if (mat) suggestions.mc = mat.mc;
  }

  // Taylor coefficients suggestion
  if (inputValues.material_group) {
    const taylorMap = {
      "P_soft": { C: 600, n: 0.25 }, "P_hard": { C: 400, n: 0.22 },
      "M_aust": { C: 350, n: 0.20 }, "M_duplex": { C: 280, n: 0.18 },
      "K_gg":   { C: 800, n: 0.20 }, "K_ggg":   { C: 650, n: 0.20 },
      "N_al":   { C: 1200,n: 0.30 }, "S_ti":    { C: 200, n: 0.15 },
      "S_ni":   { C: 150, n: 0.13 }, "H_hrc55": { C: 500, n: 0.30 },
    };
    const taylor = taylorMap[inputValues.material_group];
    if (taylor) {
      if (inputValues.taylor_c === undefined || inputValues.taylor_c === "") suggestions.taylor_c = taylor.C;
      if (inputValues.taylor_n === undefined || inputValues.taylor_n === "") suggestions.taylor_n = taylor.n;
    }
  }

  return suggestions;
}

// ─── NUMERIC FORMAT ──────────────────────────────────────────────────────────
function fmt(value, decimals = 3) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 1e6)  return value.toExponential(2);
  if (abs >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (abs >= 1)    return value.toLocaleString("en-US", { maximumFractionDigits: decimals });
  if (abs >= 0.01) return value.toLocaleString("en-US", { maximumFractionDigits: decimals + 1 });
  return value.toExponential(2);
}

// Extract unit: "result_variable = ... // [unit]"
function extractUnit(formulaStr) {
  const match = formulaStr.match(/\/\/\s*\[([^\]]+)\]/);
  return match ? match[1] : "";
}

function extractResultName(formulaStr) {
  return formulaStr.split("=")[0].trim();
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function UniversalCalculator({ tool, locale = "en", onResult = () => {}, onCalculate = () => Promise.resolve(true) }) {
  const [inputValues, setInputValues] = useState(() => {
    const init = {};
    (tool?.inputs || []).forEach(inp => {
      if (inp.default !== undefined) init[inp.id] = inp.default;
    });
    return init;
  });
  const [calculated, setCalculated] = useState(false);
  const [results, setResults]       = useState(null);
  const [validErrors, setValidErrors] = useState([]);
  const [warnings, setWarnings]     = useState([]);
  const [activeTab, setActiveTab]   = useState("inputs");
  const resultsRef = useRef(null);

  const smartDefaults = useMemo(
    () => getSmartDefaults(tool, inputValues),
    [tool, inputValues]
  );

  const handleChange = useCallback((id, value) => {
    setInputValues(prev => ({ ...prev, [id]: value === "" ? "" : (isNaN(value) ? value : Number(value)) }));
    setCalculated(false);
  }, []);

  const applyDefault = useCallback((id, value) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  }, []);

  const calculate = useCallback(async () => {
    if (onCalculate) {
      const allowed = await onCalculate();
      if (!allowed) return;
    }

    // Check required inputs
    const missingRequired = [];
    (tool.inputs || []).forEach(inp => {
      if (inp.required) {
        const val = inputValues[inp.id];
        if (val === undefined || val === null || val === "") {
          missingRequired.push({
            field: inp.id,
            message: `${inp.name || inp.id} is required.`,
            type: "error"
          });
        }
      }
    });

    if (missingRequired.length > 0) {
      setValidErrors(missingRequired);
      setCalculated(false);
      return;
    }

    // Input parse
    const parsed = {};
    (tool.inputs || []).forEach(inp => {
      const raw = inputValues[inp.id];
      if (raw !== undefined && raw !== "") {
        parsed[inp.id] = inp.type === "number" ? Number(raw) : raw;
      }
    });

    // Execute formulas
    const { computed, steps } = runAllFormulas(tool.formulas || [], parsed);

    // Validation
    const errors = runValidations(tool, parsed, computed);
    setValidErrors(errors);
    if (errors.some(e => e.type === "error")) {
      setCalculated(false);
      return;
    }

    // Warnings
    const warns = runWarnings(tool, computed);
    setWarnings(warns);

    // Prepare results — only formula outputs (not inputs)
    const outputSteps = steps.filter(s => !Object.keys(parsed).includes(s.varName));
    setResults({ computed, steps: outputSteps, parsed });
    setCalculated(true);

    if (onResult) onResult({ computed, warnings: warns });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [tool, inputValues, onResult, onCalculate]);

  const reset = useCallback(() => {
    setInputValues({});
    setCalculated(false);
    setResults(null);
    setValidErrors([]);
    setWarnings([]);
    setActiveTab("inputs");
  }, []);

  if (!tool) return <div style={S.empty}>Tool data not found.</div>;

  const inputs = tool.inputs || [];
  const enumInputs = inputs.filter(i => i.type === "enum");
  const numInputs  = inputs.filter(i => i.type !== "enum");

  const warningCounts = {
    CRITICAL: warnings.filter(w => w.severity === "CRITICAL").length,
    WARNING:  warnings.filter(w => w.severity === "WARNING").length,
    INFO:     warnings.filter(w => w.severity === "INFO").length,
  };

  return (
    <div style={S.root}>
      {/* HEADER */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <span style={S.category}>{tool.category}</span>
          <h1 style={S.title}>{tool.tool_name}</h1>
          {tool.tool_id && <span style={S.toolId}>{tool.tool_id}</span>}
        </div>
        {calculated && (
          <div style={S.statusBadge}>
            {warningCounts.CRITICAL > 0 && (
              <span style={{...S.badge, ...S.badgeCritical}}>
                ⚠ {warningCounts.CRITICAL} CRITICAL
              </span>
            )}
            {warningCounts.WARNING > 0 && (
              <span style={{...S.badge, ...S.badgeWarning}}>
                △ {warningCounts.WARNING} WARNING
              </span>
            )}
            {warningCounts.INFO > 0 && (
              <span style={{...S.badge, ...S.badgeInfo}}>
                ℹ {warningCounts.INFO} INFO
              </span>
            )}
            {warnings.length === 0 && (
              <span style={{...S.badge, ...S.badgeOk}}>✓ NORMAL RANGE</span>
            )}
          </div>
        )}
      </div>

      {/* TABS */}
      <div style={S.tabs}>
        {["inputs", "results", "formulas"].map(tab => (
          <button
            key={tab}
            style={{ ...S.tab, ...(activeTab === tab ? S.tabActive : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {{ inputs: "Input", results: "Result", formulas: "Formulas" }[tab]}
            {tab === "results" && calculated && warnings.length > 0 && (
              <span style={S.tabDot} />
            )}
          </button>
        ))}
      </div>

      {/* INPUT PANEL */}
      {activeTab === "inputs" && (
        <div style={S.panel}>

          {/* Enum inputs (material selection, etc.) — at the top */}
          {enumInputs.length > 0 && (
            <div style={S.section}>
              <div style={S.sectionLabel}>CLASS / TYPE SELECTION</div>
              <div style={S.enumGrid}>
                {enumInputs.map(inp => (
                  <EnumInput
                    key={inp.id}
                    inp={inp}
                    value={inputValues[inp.id] ?? ""}
                    onChange={handleChange}
                    materialDb={MATERIAL_DB}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Material preview — if material group is selected */}
          {inputValues.material_group && MATERIAL_DB[inputValues.material_group] && (
            <MaterialCard
              mat={MATERIAL_DB[inputValues.material_group]}
              suggestions={smartDefaults}
              onApply={applyDefault}
            />
          )}

          {/* Numeric inputs */}
          <div style={S.section}>
            <div style={S.sectionLabel}>PARAMETER INPUT</div>
            <div style={S.inputGrid}>
              {numInputs.map(inp => (
                <NumericInput
                  key={inp.id}
                  inp={inp}
                  value={inputValues[inp.id] ?? ""}
                  suggestedValue={smartDefaults[inp.id]}
                  error={validErrors.find(e => e.field === inp.id)}
                  onChange={handleChange}
                  onApplyDefault={applyDefault}
                />
              ))}
            </div>
          </div>

          {/* Validation errors */}
          {validErrors.length > 0 && (
            <div style={S.errorPanel}>
              {validErrors.map((e, i) => (
                <div key={i} style={S.errorItem}>
                  <span style={S.errorIcon}>✕</span>
                  <span>{e.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Calculate button */}
          <div style={S.actionRow}>
            <button style={S.calcBtn} onClick={calculate}>
              Calculate
            </button>
            {calculated && (
              <button style={S.resetBtn} onClick={reset}>
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* RESULTS PANEL */}
      {activeTab === "results" && (
        <div style={S.panel} ref={resultsRef}>
          {!calculated ? (
            <div style={S.emptyResults}>
              <span style={S.emptyIcon}>⚙</span>
              <p>Enter parameters in the input panel and click Calculate.</p>
            </div>
          ) : (
            <>
              {/* Warnings */}
              {warnings.length > 0 && (
                <div style={S.warnPanel}>
                  {warnings.map((w, i) => (
                    <WarningCard key={i} warning={w} />
                  ))}
                </div>
              )}

              {/* Result Table */}
              <div style={S.resultsTable}>
                <div style={S.resultsHeader}>
                  <span>Calculated Value</span>
                  <span>Result</span>
                  <span>Unit</span>
                </div>
                {results.steps.map((step, i) => {
                  const unit = extractUnit(tool.formulas?.find(f =>
                    extractResultName(f) === step.varName
                  ) || "");
                  return (
                    <ResultRow
                      key={i}
                      varName={step.varName}
                      value={step.value}
                      unit={unit}
                      index={i}
                      computed={results.computed}
                    />
                  );
                })}
              </div>

              {/* References */}
              {tool.engine_rules?.smart_warnings?.some(w => w.source) && (
                <div style={S.refsPanel}>
                  <div style={S.refsTitle}>Reference Standards</div>
                  {[...new Set(
                    (tool.engine_rules.smart_warnings || [])
                      .map(w => w.source).filter(Boolean)
                  )].map((src, i) => (
                    <span key={i} style={S.refTag}>{src}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* FORMULA PANEL */}
      {activeTab === "formulas" && (
        <div style={S.panel}>
          <div style={S.formulaList}>
            {(tool.formulas || []).map((f, i) => (
              <FormulaRow key={i} formula={f} index={i} />
            ))}
          </div>
          {tool.engine_rules?.validation && (
            <div style={S.validationList}>
              <div style={S.sectionLabel}>VALIDATION RULES</div>
              {Object.entries(tool.engine_rules.validation).map(([k, v], i) => (
                <div key={i} style={S.validationItem}>
                  <span style={S.validationKey}>{k}</span>
                  <span style={S.validationMsg}>{v.error_msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab switch after calculation */}
      {calculated && activeTab === "inputs" && (
        <div style={S.calcedBar}>
          <span>Calculation completed.</span>
          <button style={S.viewResultsBtn} onClick={() => setActiveTab("results")}>
            View Results →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────

function EnumInput({ inp, value, onChange, materialDb }) {
  const options = inp.options || Object.keys(materialDb).map(k => ({
    value: k, label: materialDb[k].label
  }));

  return (
    <div style={S.enumItem}>
      <label style={S.inputLabel}>
        {inp.name}
        {inp.required && <span style={S.required}>*</span>}
      </label>
      <select
        style={S.select}
        value={value}
        onChange={e => onChange(inp.id, e.target.value)}
      >
        <option value="">— Select —</option>
        {Array.isArray(options) && options.map((opt, i) => (
          typeof opt === "string"
            ? <option key={i} value={opt}>{opt}</option>
            : <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function MaterialCard({ mat, suggestions, onApply }) {
  return (
    <div style={S.matCard}>
      <div style={{ ...S.matAccent, background: mat.color }} />
      <div style={S.matContent}>
        <div style={S.matLabel}>Sandvik C-2920 / ISO 513 Reference Values</div>
        <div style={S.matGrid}>
          <div style={S.matStat}>
            <span style={S.matStatLabel}>Vc Range</span>
            <span style={S.matStatValue}>{mat.vc[0]}–{mat.vc[2]} m/min</span>
            <span style={S.matStatOpt}>Optimum: {mat.vc[1]}</span>
          </div>
          <div style={S.matStat}>
            <span style={S.matStatLabel}>kc1 (N/mm²)</span>
            <span style={S.matStatValue}>{mat.kc1}</span>
          </div>
          <div style={S.matStat}>
            <span style={S.matStatLabel}>mc Exponent</span>
            <span style={S.matStatValue}>{mat.mc}</span>
          </div>
        </div>
        {Object.keys(suggestions).length > 0 && (
          <div style={S.matSuggestions}>
            {Object.entries(suggestions).map(([id, val]) => (
              <button
                key={id}
                style={S.suggestBtn}
                onClick={() => onApply(id, val)}
              >
                Apply {id} = {val}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function translateConfidence(lbl) {
  if (!lbl) return "";
  const upper = lbl.toUpperCase();
  if (upper === "KESİN" || upper === "CERTAIN" || upper === "HIGH") return "High Confidence";
  if (upper === "GÜÇLÜ" || upper === "STRONG" || upper === "MEDIUM") return "Medium Confidence";
  if (upper === "VARSAYIM" || upper === "ASSUMPTION" || upper === "LOW") return "Assumption";
  return lbl;
}

function NumericInput({ inp, value, suggestedValue, error, onChange, onApplyDefault }) {
  const hasDefault = inp.default !== undefined;
  const hasSuggestion = suggestedValue !== undefined;
  const confidenceColor = {
    "CERTAIN": "#10B981", "HIGH": "#10B981", "KESİN": "#10B981",
    "STRONG": "#F59E0B", "MEDIUM": "#F59E0B", "GÜÇLÜ": "#F59E0B",
    "ASSUMPTION": "#6B7280", "LOW": "#6B7280", "VARSAYIM": "#6B7280"
  }[String(inp.confidence_label).toUpperCase()] || "#6B7280";

  return (
    <div style={{ ...S.inputItem, ...(error ? S.inputItemError : {}) }}>
      <label style={S.inputLabel}>
        {inp.name}
        {inp.required && <span style={S.required}>*</span>}
        {inp.confidence_label && (
          <span style={{ ...S.confidenceBadge, color: confidenceColor, borderColor: confidenceColor }}>
            {translateConfidence(inp.confidence_label)}
          </span>
        )}
      </label>
      <div style={S.inputRow}>
        <input
          type="number"
          style={{ ...S.input, ...(error ? S.inputError : {}) }}
          value={value}
          placeholder={hasDefault ? `Default: ${inp.default}` : ""}
          min={inp.absolute_min}
          max={inp.absolute_max}
          step="any"
          onChange={e => onChange(inp.id, e.target.value)}
        />
        {inp.unit && <span style={S.unit}>{inp.unit}</span>}
      </div>
      {hasSuggestion && value === "" && (
        <div style={S.suggestion}>
          <span>Suggested: <strong>{suggestedValue}</strong></span>
          <button style={S.applyBtn} onClick={() => onApplyDefault(inp.id, suggestedValue)}>
            Apply
          </button>
        </div>
      )}
      {inp.absolute_min !== undefined && (
        <div style={S.inputHint}>
          Min: {inp.absolute_min}{inp.absolute_max ? ` — Max: ${inp.absolute_max}` : ""}
          {inp.unit ? ` ${inp.unit}` : ""}
        </div>
      )}
      {error && <div style={S.inputErrMsg}>{error.message}</div>}
    </div>
  );
}

function WarningCard({ warning }) {
  const styles = {
    CRITICAL: { bg: "#FEF2F2", border: "#EF4444", icon: "⛔", labelColor: "#DC2626", label: "CRITICAL" },
    WARNING:  { bg: "#FFFBEB", border: "#F59E0B", icon: "⚠️",  labelColor: "#D97706", label: "WARNING" },
    INFO:     { bg: "#EFF6FF", border: "#3B82F6", icon: "ℹ️",  labelColor: "#2563EB", label: "INFO" },
  };
  const s = styles[warning.severity] || styles.WARNING;

  return (
    <div style={{ ...S.warnCard, background: s.bg, borderLeft: `3px solid ${s.border}` }}>
      <div style={S.warnHeader}>
        <span style={S.warnIcon}>{s.icon}</span>
        <span style={{ ...S.warnLabel, color: s.labelColor }}>{s.label}</span>
        {warning.source && <span style={S.warnSource}>{warning.source}</span>}
      </div>
      <p style={S.warnMsg}>{warning.message}</p>
    </div>
  );
}

function ResultRow({ varName, value, unit, index, computed }) {
  const isEven = index % 2 === 0;
  const displayName = varName
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  // Highlight important results
  const isKeyResult = varName.toLowerCase().includes("total") ||
    varName.toLowerCase().includes("result") ||
    varName.toLowerCase().includes("final") ||
    varName.toLowerCase().includes("nett") ||
    varName.toLowerCase().includes("cost") ||
    index === 0;

  return (
    <div style={{ ...S.resultRow, background: isEven ? "transparent" : "rgba(0,0,0,0.02)" }}>
      <span style={{ ...S.resultName, fontWeight: isKeyResult ? 600 : 400 }}>
        {displayName}
        <span style={S.resultVar}>{varName}</span>
      </span>
      <span style={{ ...S.resultValue, color: isKeyResult ? "#BD5D3A" : "#1A1915" }}>
        {fmt(value)}
      </span>
      <span style={S.resultUnit}>{unit || "—"}</span>
    </div>
  );
}

function FormulaRow({ formula, index }) {
  const eqIdx = formula.indexOf("=");
  if (eqIdx === -1) return null;
  const lhs = formula.substring(0, eqIdx).trim();
  const rhs = formula.substring(eqIdx + 1).split("//")[0].trim();
  const comment = formula.includes("//") ? formula.split("//")[1].trim() : "";

  return (
    <div style={{ ...S.formulaRow, background: index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
      <div style={S.formulaLhs}>{lhs}</div>
      <div style={S.formulaEq}>=</div>
      <div style={S.formulaRhs}>{rhs}</div>
      {comment && <div style={S.formulaComment}>{comment}</div>}
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
// SectorCalc design tokens: cream bg, near-black text, terracotta accent, zero border-radius, Georgia/Inter/JetBrains Mono
const S = {
  root: {
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F0EEE6",
    color: "#1A1915",
    maxWidth: 900,
    margin: "0 auto",
    border: "1px solid rgba(26,25,21,0.13)",
  },
  header: {
    padding: "22px 28px 18px",
    borderBottom: "2px solid #BD5D3A",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
  },
  headerLeft: { flex: 1 },
  category: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#BD5D3A",
    marginBottom: 5,
  },
  title: {
    fontFamily: "Georgia, serif",
    fontSize: 21,
    fontWeight: 700,
    color: "#1A1915",
    margin: "0 0 3px 0",
    lineHeight: 1.25,
  },
  toolId: {
    fontSize: 10,
    color: "rgba(26,25,21,0.38)",
    fontFamily: "'JetBrains Mono', monospace",
  },
  statusBadge: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-start", paddingTop: 4 },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.05em",
    padding: "3px 9px",
    display: "inline-block",
    whiteSpace: "nowrap",
  },
  badgeCritical: { background: "#DC2626", color: "#fff" },
  badgeWarning:  { background: "#D97706", color: "#fff" },
  badgeInfo:     { background: "#2563EB", color: "#fff" },
  badgeOk:       { background: "#059669", color: "#fff" },

  tabs: {
    display: "flex",
    borderBottom: "1px solid rgba(26,25,21,0.11)",
    background: "rgba(26,25,21,0.025)",
  },
  tab: {
    padding: "11px 20px",
    fontSize: 12,
    fontWeight: 500,
    border: "none",
    background: "transparent",
    color: "rgba(26,25,21,0.45)",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    position: "relative",
    transition: "color 0.12s",
  },
  tabActive: {
    color: "#1A1915",
    borderBottom: "2px solid #BD5D3A",
    fontWeight: 600,
  },
  tabDot: {
    display: "inline-block",
    width: 5,
    height: 5,
    background: "#EF4444",
    borderRadius: "50%",
    marginLeft: 5,
    verticalAlign: "2px",
  },

  panel: { padding: "22px 28px" },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(26,25,21,0.38)",
    marginBottom: 11,
    paddingBottom: 6,
    borderBottom: "1px solid rgba(26,25,21,0.08)",
  },

  enumGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 10,
    marginBottom: 16,
  },
  enumItem: { display: "flex", flexDirection: "column", gap: 5 },

  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: 10,
    marginBottom: 14,
  },
  inputItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "11px 13px",
    background: "#FAF9F5",
    border: "1px solid rgba(26,25,21,0.10)",
  },
  inputItemError: {
    border: "1px solid #EF4444",
    background: "#FEF2F2",
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#1A1915",
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  required: { color: "#BD5D3A", fontWeight: 700, marginLeft: 2 },
  confidenceBadge: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "0.07em",
    border: "1px solid",
    padding: "1px 4px",
    whiteSpace: "nowrap",
  },
  inputRow: { display: "flex", alignItems: "center", gap: 6 },
  input: {
    flex: 1,
    padding: "7px 9px",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    border: "1px solid rgba(26,25,21,0.19)",
    background: "#fff",
    color: "#1A1915",
    outline: "none",
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
  },
  inputError: { border: "1px solid #EF4444" },
  unit: {
    fontSize: 10,
    color: "rgba(26,25,21,0.45)",
    whiteSpace: "nowrap",
    minWidth: 24,
  },
  inputHint: { fontSize: 9, color: "rgba(26,25,21,0.35)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.4 },
  inputErrMsg: { fontSize: 10, color: "#DC2626", fontWeight: 500, marginTop: 1 },

  suggestion: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 10,
    color: "#BD5D3A",
    marginTop: 2,
  },
  applyBtn: {
    fontSize: 9,
    fontWeight: 700,
    padding: "1px 6px",
    background: "#BD5D3A",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  select: {
    width: "100%",
    padding: "7px 9px",
    fontSize: 12,
    border: "1px solid rgba(26,25,21,0.19)",
    background: "#fff",
    color: "#1A1915",
    outline: "none",
    cursor: "pointer",
    appearance: "auto",
  },

  matCard: {
    display: "flex",
    marginBottom: 16,
    border: "1px solid rgba(26,25,21,0.10)",
    background: "#FAF9F5",
    overflow: "hidden",
  },
  matAccent: { width: 4, flexShrink: 0 },
  matContent: { padding: "11px 15px", flex: 1 },
  matLabel: { fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", color: "rgba(26,25,21,0.38)", marginBottom: 8, textTransform: "uppercase" },
  matGrid: { display: "flex", gap: 20, flexWrap: "wrap" },
  matStat: { display: "flex", flexDirection: "column", gap: 2 },
  matStatLabel: { fontSize: 9, color: "rgba(26,25,21,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  matStatValue: { fontSize: 18, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#1A1915", lineHeight: 1 },
  matStatOpt: { fontSize: 9, color: "#BD5D3A" },
  matSuggestions: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  suggestBtn: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 10px",
    background: "#BD5D3A",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  errorPanel: {
    background: "#FEF2F2",
    border: "1px solid #EF4444",
    padding: "11px 15px",
    marginBottom: 14,
  },
  errorItem: { display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 5, fontSize: 12 },
  errorIcon: { color: "#DC2626", fontWeight: 700, flexShrink: 0, marginTop: 1 },

  actionRow: { display: "flex", gap: 10, marginTop: 8, alignItems: "center" },
  calcBtn: {
    padding: "12px 34px",
    background: "#1A1915",
    color: "#F0EEE6",
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "background 0.12s",
  },
  resetBtn: {
    padding: "11px 18px",
    background: "transparent",
    color: "#1A1915",
    border: "1px solid rgba(26,25,21,0.28)",
    fontSize: 12,
    cursor: "pointer",
  },

  warnPanel: { marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 },
  warnCard: { padding: "12px 15px" },
  warnHeader: { display: "flex", alignItems: "center", gap: 7, marginBottom: 5 },
  warnIcon: { fontSize: 16 },
  warnLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "0.07em" },
  warnSource: {
    fontSize: 9, fontWeight: 700, marginLeft: "auto",
    color: "rgba(26,25,21,0.48)",
    fontFamily: "'JetBrains Mono', monospace",
    border: "1px solid rgba(26,25,21,0.14)",
    padding: "1px 5px",
  },
  warnMsg: { fontSize: 12, color: "#1A1915", margin: 0, lineHeight: 1.55 },

  resultsTable: { border: "1px solid rgba(26,25,21,0.11)", overflow: "hidden", marginBottom: 16 },
  resultsHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 130px 80px",
    padding: "9px 14px",
    background: "#1A1915",
    color: "#F0EEE6",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  resultRow: {
    display: "grid",
    gridTemplateColumns: "1fr 130px 80px",
    padding: "9px 14px",
    borderTop: "1px solid rgba(26,25,21,0.06)",
    alignItems: "center",
  },
  resultName: { fontSize: 12, display: "flex", flexDirection: "column", gap: 1 },
  resultVar: { fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "rgba(26,25,21,0.35)" },
  resultValue: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, textAlign: "right" },
  resultUnit: { fontSize: 10, color: "rgba(26,25,21,0.45)", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" },

  refsPanel: { marginTop: 12, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  refsTitle: { fontSize: 9, fontWeight: 700, color: "rgba(26,25,21,0.38)", letterSpacing: "0.06em" },
  refTag: {
    fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
    padding: "2px 7px", border: "1px solid rgba(26,25,21,0.18)", color: "rgba(26,25,21,0.5)",
  },

  emptyResults: {
    textAlign: "center", padding: "44px 20px",
    color: "rgba(26,25,21,0.38)", fontSize: 13,
  },
  emptyIcon: { display: "block", fontSize: 24, marginBottom: 8 },

  formulaList: { display: "flex", flexDirection: "column", gap: 0, border: "1px solid rgba(26,25,21,0.10)", overflow: "hidden", marginBottom: 14 },
  formulaRow: {
    display: "grid",
    gridTemplateColumns: "160px 20px 1fr",
    padding: "9px 14px",
    alignItems: "baseline",
    gap: 8,
    borderTop: "1px solid rgba(26,25,21,0.06)",
  },
  formulaLhs: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#BD5D3A", fontWeight: 600 },
  formulaEq:  { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(26,25,21,0.3)", textAlign: "center" },
  formulaRhs: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#1A1915", wordBreak: "break-all", lineHeight: 1.5 },
  formulaComment: { gridColumn: "3", fontSize: 9, color: "rgba(26,25,21,0.38)", fontStyle: "italic", marginTop: 2, display: "block" },

  validationList: { marginTop: 14, display: "flex", flexDirection: "column", gap: 7 },
  validationItem: {
    display: "flex", gap: 10, padding: "7px 11px",
    borderLeft: "2px solid #BD5D3A",
    background: "rgba(189,93,58,0.04)",
    alignItems: "flex-start",
  },
  validationKey: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#BD5D3A", flexShrink: 0, paddingTop: 2, minWidth: 120 },
  validationMsg: { fontSize: 11, color: "#1A1915", lineHeight: 1.4 },

  calcedBar: {
    padding: "10px 28px",
    background: "#1A1915",
    color: "#F0EEE6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 12,
  },
  viewResultsBtn: {
    background: "#BD5D3A", color: "#fff", border: "none",
    padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },

  empty: { padding: 40, textAlign: "center", color: "rgba(26,25,21,0.4)" },
};
