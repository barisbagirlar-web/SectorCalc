"use client";

/**
 * SectorCalc Universal Industrial Calculator Engine
 * 
 * Kullanım:
 *   import UniversalCalculator from '@/components/calculators/UniversalCalculator'
 *   <UniversalCalculator tool={toolJson} locale="tr" onResult={(r) => console.log(r)} />
 * 
 * toolJson formatı: pro_hesaplama_araclari_193_.txt içindeki her araç objesi
 */

import { useState, useCallback, useMemo, useRef } from "react";

// ─── SANDVIK / ISO LOOKUP TABLOLARI ────────────────────────────────────────────
const MATERIAL_DB = {
  // ISO 513 Grubu → { kc1_mid, mc, vc_min, vc_opt, vc_max, sf_static, sf_fatigue }
  "P_soft":   { label: "P — Çelik (≤250 HB)",          kc1: 1900, mc: 0.26, vc: [180,280,400], color: "#3B82F6" },
  "P_hard":   { label: "P — Çelik (250-350 HB)",        kc1: 2200, mc: 0.28, vc: [100,180,280], color: "#2563EB" },
  "M_aust":   { label: "M — Paslanmaz Östenitik",       kc1: 2400, mc: 0.22, vc: [80,160,240],  color: "#8B5CF6" },
  "M_duplex": { label: "M — Paslanmaz Duplex",           kc1: 2700, mc: 0.24, vc: [60,120,180],  color: "#7C3AED" },
  "K_gg":     { label: "K — Dökme Demir (GG)",          kc1: 1350, mc: 0.20, vc: [100,200,350], color: "#6B7280" },
  "K_ggg":    { label: "K — Nodüler Demir (GGG)",       kc1: 1600, mc: 0.22, vc: [80,160,280],  color: "#4B5563" },
  "N_al":     { label: "N — Alüminyum Alaşımı",         kc1: 750,  mc: 0.14, vc: [400,800,1500],color: "#10B981" },
  "N_cu":     { label: "N — Bakır/Pirinç",              kc1: 900,  mc: 0.16, vc: [200,400,800], color: "#059669" },
  "S_ti":     { label: "S — Titanyum (Ti6Al4V)",        kc1: 2800, mc: 0.30, vc: [30,60,100],   color: "#F59E0B" },
  "S_ni":     { label: "S — Inconel 718 / Ni Alaşımı", kc1: 3000, mc: 0.32, vc: [20,45,80],    color: "#D97706" },
  "H_hrc55":  { label: "H — Sertleştirilmiş (>55 HRC)", kc1: 3200, mc: 0.35, vc: [50,120,200],  color: "#EF4444" },
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

const mathContext = {
  IF: (cond, t, f) => (cond ? t : f),
  POW: Math.pow,
  MAX: Math.max,
  MIN: Math.min,
  SQRT: Math.sqrt,
  ABS: Math.abs,
  LN: Math.log,
  EXP: Math.exp,
  SIN: Math.sin,
  COS: Math.cos,
  TAN: Math.tan,
  PI: Math.PI,
  PMT: (rate, nper, pv) => {
    if (rate === 0) return -(pv / nper);
    const pvif = Math.pow(1 + rate, nper);
    return -(rate * pv * pvif) / (pvif - 1);
  },
  NPV: (rate, ...values) => {
    if (Array.isArray(values[0])) values = values[0];
    return values.reduce((acc, val, i) => acc + val / Math.pow(1 + rate, i + 1), 0);
  },
  SUM: (...args) => {
    if (Array.isArray(args[0])) args = args[0];
    return args.reduce((a, b) => a + Number(b || 0), 0);
  }
};

// ─── FORMULA ENGINE ──────────────────────────────────────────────────────────
function evaluateFormula(formulaStr, vars) {
  // "Result = expression" formatını parse et
  const eqIdx = formulaStr.indexOf("=");
  if (eqIdx === -1) return null;
  const varName = formulaStr.substring(0, eqIdx).trim();
  let expr = formulaStr.substring(eqIdx + 1).split("//")[0].trim(); // yorum satırını at

  // Math fonksiyonlarını dönüştür
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

  // Değişkenleri enjekte et — tüm hesaplanan + kullanıcı inputları
  const allVars = { ...vars, ...mathContext };

  // Güvenli eval
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
  } catch (err) {
    return { varName, value: null };
  }
}

// Yaklaşık normal dağılım fonksiyonları
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
        const allVars = { ...computed, ...mathContext };
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
      const allVars = { ...computed, ...mathContext };
      const keys = Object.keys(allVars);
      const vals = Object.values(allVars);
      // AND koşulunu destekle
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

// ─── AKILLI DEFAULT SİSTEMİ ──────────────────────────────────────────────────
function getSmartDefaults(tool, inputValues) {
  const suggestions = {};

  // Material group → kc1 önerisi
  if (inputValues.material_group && (inputValues.kc1 === undefined || inputValues.kc1 === "")) {
    const mat = MATERIAL_DB[inputValues.material_group];
    if (mat) suggestions.kc1 = mat.kc1;
  }
  if (inputValues.material_group && (inputValues.mc === undefined || inputValues.mc === "")) {
    const mat = MATERIAL_DB[inputValues.material_group];
    if (mat) suggestions.mc = mat.mc;
  }

  // Taylor katsayıları önerisi
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

// ─── SAYISAL FORMAT ──────────────────────────────────────────────────────────
function fmt(value, decimals = 3) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 1e6)  return value.toExponential(2);
  if (abs >= 1000) return value.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
  if (abs >= 1)    return value.toLocaleString("tr-TR", { maximumFractionDigits: decimals });
  if (abs >= 0.01) return value.toLocaleString("tr-TR", { maximumFractionDigits: decimals + 1 });
  return value.toExponential(2);
}

// Birim çıkar: "result_variable = ... // [birim]"
function extractUnit(formulaStr) {
  const match = formulaStr.match(/\/\/\s*\[([^\]]+)\]/);
  return match ? match[1] : "";
}

function extractResultName(formulaStr) {
  return formulaStr.split("=")[0].trim();
}

// ─── ANA COMPONENT ───────────────────────────────────────────────────────────
export default function UniversalCalculator({ tool, locale = "tr", onResult }) {
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

  const calculate = useCallback(() => {
    // Input parse
    const parsed = {};
    (tool.inputs || []).forEach(inp => {
      const raw = inputValues[inp.id];
      if (raw !== undefined && raw !== "") {
        parsed[inp.id] = inp.type === "number" ? Number(raw) : raw;
      }
    });

    // Formülleri çalıştır
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

    // Sonuçları hazırla — sadece formül çıktıları (inputlar değil)
    const outputSteps = steps.filter(s => !Object.keys(parsed).includes(s.varName));
    setResults({ computed, steps: outputSteps, parsed });
    setCalculated(true);

    if (onResult) onResult({ computed, warnings: warns });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [tool, inputValues, onResult]);

  const reset = useCallback(() => {
    setInputValues({});
    setCalculated(false);
    setResults(null);
    setValidErrors([]);
    setWarnings([]);
    setActiveTab("inputs");
  }, []);

  if (!tool) return <div style={S.empty}>Araç verisi bulunamadı.</div>;

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
      {/* BAŞLIK */}
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
                ⚠ {warningCounts.CRITICAL} KRİTİK
              </span>
            )}
            {warningCounts.WARNING > 0 && (
              <span style={{...S.badge, ...S.badgeWarning}}>
                △ {warningCounts.WARNING} UYARI
              </span>
            )}
            {warningCounts.INFO > 0 && (
              <span style={{...S.badge, ...S.badgeInfo}}>
                ℹ {warningCounts.INFO} BİLGİ
              </span>
            )}
            {warnings.length === 0 && (
              <span style={{...S.badge, ...S.badgeOk}}>✓ NORMAL ARALIK</span>
            )}
          </div>
        )}
      </div>

      {/* SEKMELER */}
      <div style={S.tabs}>
        {["inputs", "results", "formulas"].map(tab => (
          <button
            key={tab}
            style={{ ...S.tab, ...(activeTab === tab ? S.tabActive : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {{ inputs: "Girdi", results: "Sonuç", formulas: "Formüller" }[tab]}
            {tab === "results" && calculated && warnings.length > 0 && (
              <span style={S.tabDot} />
            )}
          </button>
        ))}
      </div>

      {/* GİRDİ PANELİ */}
      {activeTab === "inputs" && (
        <div style={S.panel}>

          {/* Enum inputlar (malzeme seçimi vb.) — üstte */}
          {enumInputs.length > 0 && (
            <div style={S.section}>
              <div style={S.sectionLabel}>SINIF / TİP SEÇİMİ</div>
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

          {/* Material preview — malzeme grubu seçildiyse */}
          {inputValues.material_group && MATERIAL_DB[inputValues.material_group] && (
            <MaterialCard
              mat={MATERIAL_DB[inputValues.material_group]}
              suggestions={smartDefaults}
              onApply={applyDefault}
            />
          )}

          {/* Sayısal inputlar */}
          <div style={S.section}>
            <div style={S.sectionLabel}>PARAMETRE GİRİŞİ</div>
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

          {/* Validation hataları */}
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

          {/* Hesapla butonu */}
          <div style={S.actionRow}>
            <button style={S.calcBtn} onClick={calculate}>
              Hesapla
            </button>
            {calculated && (
              <button style={S.resetBtn} onClick={reset}>
                Sıfırla
              </button>
            )}
          </div>
        </div>
      )}

      {/* SONUÇ PANELİ */}
      {activeTab === "results" && (
        <div style={S.panel} ref={resultsRef}>
          {!calculated ? (
            <div style={S.emptyResults}>
              <span style={S.emptyIcon}>⚙</span>
              <p>Girdi panelinden parametreleri girin ve hesapla butonuna tıklayın.</p>
            </div>
          ) : (
            <>
              {/* Uyarılar */}
              {warnings.length > 0 && (
                <div style={S.warnPanel}>
                  {warnings.map((w, i) => (
                    <WarningCard key={i} warning={w} />
                  ))}
                </div>
              )}

              {/* Sonuç tablosu */}
              <div style={S.resultsTable}>
                <div style={S.resultsHeader}>
                  <span>Hesaplanan Değer</span>
                  <span>Sonuç</span>
                  <span>Birim</span>
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

              {/* Referanslar */}
              {tool.engine_rules?.smart_warnings?.some(w => w.source) && (
                <div style={S.refsPanel}>
                  <div style={S.refsTitle}>Referans Standartlar</div>
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

      {/* FORMÜL PANELİ */}
      {activeTab === "formulas" && (
        <div style={S.panel}>
          <div style={S.formulaList}>
            {(tool.formulas || []).map((f, i) => (
              <FormulaRow key={i} formula={f} index={i} />
            ))}
          </div>
          {tool.engine_rules?.validation && (
            <div style={S.validationList}>
              <div style={S.sectionLabel}>VALİDASYON KURALLARI</div>
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

      {/* Hesapla sonrası sekme geçişi */}
      {calculated && activeTab === "inputs" && (
        <div style={S.calcedBar}>
          <span>Hesaplama tamamlandı.</span>
          <button style={S.viewResultsBtn} onClick={() => setActiveTab("results")}>
            Sonuçları Gör →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ALT COMPONENT'LAR ────────────────────────────────────────────────────────

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
        <option value="">— Seçin —</option>
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
        <div style={S.matLabel}>Sandvik C-2920 / ISO 513 Referans Değerleri</div>
        <div style={S.matGrid}>
          <div style={S.matStat}>
            <span style={S.matStatLabel}>Vc Aralığı</span>
            <span style={S.matStatValue}>{mat.vc[0]}–{mat.vc[2]} m/dak</span>
            <span style={S.matStatOpt}>Optimum: {mat.vc[1]}</span>
          </div>
          <div style={S.matStat}>
            <span style={S.matStatLabel}>kc1 (N/mm²)</span>
            <span style={S.matStatValue}>{mat.kc1}</span>
          </div>
          <div style={S.matStat}>
            <span style={S.matStatLabel}>mc Üssü</span>
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
                {id} = {val} uygula
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NumericInput({ inp, value, suggestedValue, error, onChange, onApplyDefault }) {
  const hasDefault = inp.default !== undefined;
  const hasSuggestion = suggestedValue !== undefined;
  const confidenceColor = {
    "KESİN": "#10B981", "GÜÇLÜ": "#F59E0B", "VARSAYIM": "#6B7280"
  }[inp.confidence_label] || "#6B7280";

  return (
    <div style={{ ...S.inputItem, ...(error ? S.inputItemError : {}) }}>
      <label style={S.inputLabel}>
        {inp.name}
        {inp.required && <span style={S.required}>*</span>}
        {inp.confidence_label && (
          <span style={{ ...S.confidenceBadge, color: confidenceColor, borderColor: confidenceColor }}>
            {inp.confidence_label}
          </span>
        )}
      </label>
      <div style={S.inputRow}>
        <input
          type="number"
          style={{ ...S.input, ...(error ? S.inputError : {}) }}
          value={value}
          placeholder={hasDefault ? `Varsayılan: ${inp.default}` : ""}
          min={inp.absolute_min}
          max={inp.absolute_max}
          step="any"
          onChange={e => onChange(inp.id, e.target.value)}
        />
        {inp.unit && <span style={S.unit}>{inp.unit}</span>}
      </div>
      {hasSuggestion && value === "" && (
        <div style={S.suggestion}>
          <span>Önerilen: <strong>{suggestedValue}</strong></span>
          <button style={S.applyBtn} onClick={() => onApplyDefault(inp.id, suggestedValue)}>
            Uygula
          </button>
        </div>
      )}
      {inp.absolute_min !== undefined && (
        <div style={S.inputHint}>
          Min: {inp.absolute_min}{inp.absolute_max ? ` — Maks: ${inp.absolute_max}` : ""}
          {inp.unit ? ` ${inp.unit}` : ""}
        </div>
      )}
      {error && <div style={S.inputErrMsg}>{error.message}</div>}
    </div>
  );
}

function WarningCard({ warning }) {
  const styles = {
    CRITICAL: { bg: "#FEF2F2", border: "#EF4444", icon: "⛔", labelColor: "#DC2626", label: "KRİTİK" },
    WARNING:  { bg: "#FFFBEB", border: "#F59E0B", icon: "⚠️",  labelColor: "#D97706", label: "UYARI" },
    INFO:     { bg: "#EFF6FF", border: "#3B82F6", icon: "ℹ️",  labelColor: "#2563EB", label: "BİLGİ" },
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

  // Önemli sonuçları vurgula
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

// ─── STİLLER ─────────────────────────────────────────────────────────────────
// SectorCalc design tokens: cream bg, near-black text, terracotta accent, zero border-radius, Georgia/Inter/JetBrains Mono
const S = {
  root: {
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F0EEE6",
    color: "#1A1915",
    maxWidth: 900,
    margin: "0 auto",
    border: "1px solid rgba(26,25,21,0.12)",
  },
  header: {
    padding: "24px 28px 20px",
    borderBottom: "2px solid #BD5D3A",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  },
  headerLeft: { flex: 1 },
  category: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#BD5D3A",
    marginBottom: 6,
  },
  title: {
    fontFamily: "Georgia, serif",
    fontSize: 22,
    fontWeight: 700,
    color: "#1A1915",
    margin: "0 0 4px 0",
    lineHeight: 1.3,
  },
  toolId: {
    fontSize: 11,
    color: "rgba(26,25,21,0.4)",
    fontFamily: "'JetBrains Mono', monospace",
  },
  statusBadge: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.05em",
    padding: "4px 10px",
    display: "inline-block",
  },
  badgeCritical: { background: "#DC2626", color: "#fff" },
  badgeWarning:  { background: "#D97706", color: "#fff" },
  badgeInfo:     { background: "#2563EB", color: "#fff" },
  badgeOk:       { background: "#059669", color: "#fff" },

  tabs: {
    display: "flex",
    borderBottom: "1px solid rgba(26,25,21,0.12)",
    background: "rgba(26,25,21,0.03)",
  },
  tab: {
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 500,
    border: "none",
    background: "transparent",
    color: "rgba(26,25,21,0.5)",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    position: "relative",
    transition: "color 0.15s",
  },
  tabActive: {
    color: "#1A1915",
    borderBottom: "2px solid #BD5D3A",
    fontWeight: 600,
  },
  tabDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#EF4444",
  },

  panel: { padding: "24px 28px" },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(26,25,21,0.4)",
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: "1px solid rgba(26,25,21,0.08)",
  },

  enumGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  },
  enumItem: { display: "flex", flexDirection: "column", gap: 6 },

  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 16,
  },
  inputItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "12px 14px",
    background: "#FAF9F5",
    border: "1px solid rgba(26,25,21,0.10)",
  },
  inputItemError: {
    border: "1px solid #EF4444",
    background: "#FEF2F2",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#1A1915",
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  required: { color: "#BD5D3A", fontWeight: 700 },
  confidenceBadge: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.08em",
    border: "1px solid",
    padding: "1px 5px",
  },
  inputRow: { display: "flex", alignItems: "center", gap: 6 },
  input: {
    flex: 1,
    padding: "8px 10px",
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    border: "1px solid rgba(26,25,21,0.20)",
    background: "#fff",
    color: "#1A1915",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  inputError: { border: "1px solid #EF4444" },
  unit: {
    fontSize: 11,
    color: "rgba(26,25,21,0.5)",
    whiteSpace: "nowrap",
    minWidth: 30,
  },
  inputHint: { fontSize: 10, color: "rgba(26,25,21,0.4)", fontFamily: "'JetBrains Mono', monospace" },
  inputErrMsg: { fontSize: 11, color: "#DC2626", fontWeight: 500 },

  suggestion: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 11,
    color: "#BD5D3A",
    marginTop: 2,
  },
  applyBtn: {
    fontSize: 10,
    fontWeight: 600,
    padding: "2px 8px",
    background: "#BD5D3A",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.03em",
  },

  select: {
    padding: "8px 10px",
    fontSize: 13,
    border: "1px solid rgba(26,25,21,0.20)",
    background: "#fff",
    color: "#1A1915",
    width: "100%",
    outline: "none",
    cursor: "pointer",
  },

  matCard: {
    display: "flex",
    marginBottom: 20,
    border: "1px solid rgba(26,25,21,0.10)",
    background: "#FAF9F5",
    overflow: "hidden",
  },
  matAccent: { width: 4, flexShrink: 0 },
  matContent: { padding: "14px 16px", flex: 1 },
  matLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(26,25,21,0.5)", marginBottom: 10, textTransform: "uppercase" },
  matGrid: { display: "flex", gap: 24, flexWrap: "wrap" },
  matStat: { display: "flex", flexDirection: "column", gap: 2 },
  matStatLabel: { fontSize: 10, color: "rgba(26,25,21,0.5)", fontWeight: 600 },
  matStatValue: { fontSize: 18, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#1A1915" },
  matStatOpt: { fontSize: 10, color: "#BD5D3A" },
  matSuggestions: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  suggestBtn: {
    fontSize: 11, fontWeight: 600, padding: "4px 10px",
    background: "transparent", color: "#BD5D3A",
    border: "1px solid #BD5D3A", cursor: "pointer",
  },

  errorPanel: {
    background: "#FEF2F2",
    border: "1px solid #EF4444",
    padding: "12px 16px",
    marginBottom: 16,
  },
  errorItem: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, fontSize: 13 },
  errorIcon: { color: "#DC2626", fontWeight: 700, flexShrink: 0 },

  actionRow: { display: "flex", gap: 12, marginTop: 8 },
  calcBtn: {
    padding: "13px 36px",
    background: "#1A1915",
    color: "#F0EEE6",
    border: "none",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "pointer",
    textTransform: "uppercase",
  },
  resetBtn: {
    padding: "13px 20px",
    background: "transparent",
    color: "#1A1915",
    border: "1px solid rgba(26,25,21,0.30)",
    fontSize: 13,
    cursor: "pointer",
  },

  warnPanel: { marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 },
  warnCard: { padding: "14px 16px" },
  warnHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  warnIcon: { fontSize: 16 },
  warnLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" },
  warnSource: {
    fontSize: 10, fontWeight: 600, marginLeft: "auto",
    color: "rgba(26,25,21,0.5)",
    fontFamily: "'JetBrains Mono', monospace",
    border: "1px solid rgba(26,25,21,0.15)",
    padding: "1px 6px",
  },
  warnMsg: { fontSize: 13, color: "#1A1915", margin: 0, lineHeight: 1.5 },

  resultsTable: { border: "1px solid rgba(26,25,21,0.10)", overflow: "hidden" },
  resultsHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 140px 80px",
    padding: "10px 16px",
    background: "#1A1915",
    color: "#F0EEE6",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  resultRow: {
    display: "grid",
    gridTemplateColumns: "1fr 140px 80px",
    padding: "10px 16px",
    borderTop: "1px solid rgba(26,25,21,0.06)",
    alignItems: "center",
  },
  resultName: { fontSize: 13, display: "flex", flexDirection: "column", gap: 1 },
  resultVar: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "rgba(26,25,21,0.4)" },
  resultValue: { fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, textAlign: "right" },
  resultUnit: { fontSize: 11, color: "rgba(26,25,21,0.5)", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" },

  refsPanel: { marginTop: 20, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  refsTitle: { fontSize: 11, fontWeight: 700, color: "rgba(26,25,21,0.5)", letterSpacing: "0.06em", marginRight: 4 },
  refTag: {
    fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
    padding: "3px 8px", border: "1px solid rgba(26,25,21,0.20)", color: "rgba(26,25,21,0.6)",
  },

  emptyResults: {
    textAlign: "center", padding: "48px 24px",
    color: "rgba(26,25,21,0.4)", fontSize: 14,
  },
  emptyIcon: { display: "block", fontSize: 32, marginBottom: 12 },

  formulaList: { display: "flex", flexDirection: "column", gap: 0, border: "1px solid rgba(26,25,21,0.10)", marginBottom: 20 },
  formulaRow: {
    display: "grid",
    gridTemplateColumns: "180px 20px 1fr",
    padding: "10px 16px",
    alignItems: "baseline",
    gap: 8,
    borderTop: "1px solid rgba(26,25,21,0.06)",
  },
  formulaLhs: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#BD5D3A", fontWeight: 600 },
  formulaEq:  { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(26,25,21,0.4)", textAlign: "center" },
  formulaRhs: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#1A1915", wordBreak: "break-all" },
  formulaComment: { gridColumn: "3", fontSize: 10, color: "rgba(26,25,21,0.4)", fontStyle: "italic", marginTop: 2 },

  validationList: { marginTop: 16 },
  validationItem: {
    display: "flex", gap: 12, padding: "8px 12px",
    borderLeft: "2px solid #BD5D3A", marginBottom: 8,
    background: "rgba(189,93,58,0.04)",
    alignItems: "flex-start",
  },
  validationKey: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#BD5D3A", flexShrink: 0, paddingTop: 2 },
  validationMsg: { fontSize: 12, color: "#1A1915" },

  calcedBar: {
    padding: "12px 28px",
    background: "#1A1915",
    color: "#F0EEE6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 13,
  },
  viewResultsBtn: {
    background: "#BD5D3A", color: "#fff", border: "none",
    padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },

  empty: { padding: 40, textAlign: "center", color: "rgba(26,25,21,0.4)" },
};
