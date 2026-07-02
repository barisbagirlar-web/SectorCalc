"use client";

import { useState, useMemo, useCallback, type FormEvent } from "react";
import { usePremiumToolAccess } from "@/lib/features/billing/use-premium-tool-access";
import { calculateRCBeamShearFlexure } from "@/lib/features/calculators/rc-beam-shear-flexure";
import Link from "next/link";

// ─── PROPS ────────────────────────────────────────────────────────────────

interface ProToolFormProps {
  tool: any;
  locale: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────

const fmt = (v: any, d = 2): string => {
  if (v === null || v === undefined || isNaN(v)) return "-";
  if (Math.abs(v) > 1e6) return Number(v).toExponential(2);
  if (Math.abs(v) >= 1000) return Number(v).toFixed(0);
  if (Math.abs(v) >= 100) return Number(v).toFixed(1);
  if (Math.abs(v) >= 10) return Number(v).toFixed(2);
  return Number(v).toFixed(d);
};

const fmtCurrency = (v: any): string =>
  v === null || isNaN(v) ? "-" : "$" + Number(v).toLocaleString("en-US", { maximumFractionDigits: 0 });

const hashStr = (s: string): string => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
};

const nowISO = () => new Date().toISOString();

const ucColor = (uc: number): string => (uc >= 1 ? "crit" : uc >= 0.9 ? "warn" : "ok");

const confClass = (lbl?: string): string => {
  if (!lbl) return "pro-conf-approx";
  const u = lbl.toUpperCase();
  if (u === "EXACT" || u === "CERTAIN" || u === "HIGH") return "pro-conf-exact";
  if (u === "STRONG" || u === "MEDIUM") return "pro-conf-strong";
  return "pro-conf-approx";
};

function isInputHidden(inp: any, values: Record<string, any>): boolean {
  if (inp.visibleWhen) return values[inp.visibleWhen.field] !== inp.visibleWhen.equals;
  if (inp.conditional_on) return values[inp.conditional_on.field] !== inp.conditional_on.value;
  return false;
}

function confidenceLabel(lbl?: string): string | undefined {
  if (!lbl) return undefined;
  const u = lbl.toUpperCase();
  if (u === "EXACT" || u === "CERTAIN" || u === "HIGH") return "EXACT";
  if (u === "STRONG" || u === "MEDIUM") return "STRONG";
  if (u === "MODERATE") return "MODERATE";
  return "DEFAULT";
}

// ─── MATERIAL DB ──────────────────────────────────────────────────────────

const MAT_DB: Record<string, { label: string; kc1: number; mc: number; vc: [number, number, number]; color: string; C?: number; n?: number }> = {
  P_soft:   { label: "P - Steel (≤250 HB)",          kc1: 1900, mc: 0.26, vc: [180, 280, 400] as [number, number, number], color: "#3B82F6", C: 600, n: 0.25 },
  P_hard:   { label: "P - Steel (250–350 HB)",        kc1: 2200, mc: 0.28, vc: [100, 180, 280] as [number, number, number], color: "#2563EB", C: 400, n: 0.22 },
  M_aust:   { label: "M - Austenitic Stainless",       kc1: 2400, mc: 0.22, vc: [80, 160, 240] as [number, number, number], color: "#7C3AED", C: 350, n: 0.20 },
  M_duplex: { label: "M - Duplex Stainless",           kc1: 2700, mc: 0.24, vc: [60, 120, 180] as [number, number, number], color: "#6D28D9", C: 280, n: 0.18 },
  K_gg:     { label: "K - Cast Iron (GG/GGG)",         kc1: 1350, mc: 0.20, vc: [100, 200, 350] as [number, number, number], color: "#4B5563", C: 800, n: 0.20 },
  N_al:     { label: "N - Aluminium Alloy",            kc1: 750,  mc: 0.14, vc: [400, 800, 1500] as [number, number, number], color: "#059669", C: 1200, n: 0.30 },
  S_ti:     { label: "S - Titanium Ti6Al4V",           kc1: 2800, mc: 0.30, vc: [30, 60, 100] as [number, number, number], color: "#D97706", C: 200, n: 0.15 },
  H_hrc55:  { label: "H - Hardened Steel >55 HRC",     kc1: 3200, mc: 0.35, vc: [50, 120, 200] as [number, number, number], color: "#DC2626", C: 500, n: 0.30 },
};

// ─── FORMULA ENGINE (v2 - Multi-statement, const, object-literal safe) ──

// ─── FORMULA ENGINE (v5 - Full-formula execution with scope-aware tracing) ──

/**
 * Recursively replace all math function calls (POWER, SQRT, ABS, LN, LOG10,
 * EXP, MAX, MIN, FLOOR, CEIL, ROUND, COS, SIN, TAN) with their Math.*
 * equivalents, properly handling arbitrarily nested parentheses.
 */
function replaceMathFuncs(str: string): string {
  const funcMap: Record<string, string> = {
    COS: "cos", SIN: "sin", TAN: "tan",
    POWER: "pow", SQRT: "sqrt", ABS: "abs",
    LN: "log", LOG10: "log10", EXP: "exp",
    MAX: "max", MIN: "min", FLOOR: "floor",
    CEIL: "ceil", ROUND: "round",
  };
  const names = Object.keys(funcMap).join("|");
  const re = new RegExp(`(?<!\\.)\\b(${names})\\s*\\(`, "gi");

  let result = "";
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(str)) !== null) {
    result += str.slice(lastIndex, m.index);

    const fname = m[1].toUpperCase();
    const openIdx = str.indexOf("(", m.index);
    let depth = 1;
    let i = openIdx + 1;
    while (i < str.length && depth > 0) {
      if (str[i] === "(") depth++;
      else if (str[i] === ")") depth--;
      i++;
    }
    const closeIdx = i - 1;
    const inner = str.slice(openIdx + 1, closeIdx);
    const innerReplaced = replaceMathFuncs(inner);

    result += `Math.${funcMap[fname]}(${innerReplaced})`;
    lastIndex = closeIdx + 1;
    re.lastIndex = lastIndex;
  }

  result += str.slice(lastIndex);
  return result;
}

function sanitizeExpression(ex: string): string {
  let result = ex;
  result = result.replace(/π/g, "Math.PI");
  result = replaceMathFuncs(result);

  // Convert x^y (exponentiation) to Math.pow(x,y).
  // In engineering formulas ^ is always exponentiation, never bitwise XOR.
  // Handle: var^number, (expr)^number, var^var patterns
  result = result.replace(/(\b[a-zA-Z_]\w*\b)\s*\^\s*(\d+(?:\.\d+)?)/g, "Math.pow($1,$2)");
  result = result.replace(/\(([^)]+)\)\s*\^\s*(\d+(?:\.\d+)?)/g, "Math.pow($1,$2)");
  // Handle var^var (second operand is also an identifier)
  result = result.replace(/(\b[a-zA-Z_]\w*\b)\s*\^\s*(\b[a-zA-Z_]\w*\b)/g, "Math.pow($1,$2)");

  result = result.replace(/(?<!\.)\bAND\b/gi, "&&").replace(/(?<!\.)\bOR\b/gi, "||");
  return result;
}

/** Known JavaScript built‑in / reserved identifiers that are NOT formula vars */
const JS_RESERVED = new Set([
  "Math","Number","String","Array","Object","Boolean","Date","JSON","console",
  "undefined","NaN","Infinity","parseInt","parseFloat","isNaN","eval","isFinite",
  "RegExp","Error","Symbol","Map","Set","Promise","Proxy","Reflect","BigInt",
  "this","arguments","function","class","return","if","else","for","while","do",
  "switch","case","break","continue","try","catch","finally","throw","import",
  "export","default","from","as","const","let","var","yield","await","super",
  "static","get","set","of","in","instanceof","typeof","void","delete","new",
  "NORMSDIST",
]);

// ═══════════════════════════════════════════════════════════════════════
// UNCERTAINTY / RSS PROPAGATION ENGINE
// ═══════════════════════════════════════════════════════════════════════

interface InputUncertainty {
  id: string;
  /** Absolute uncertainty value (e.g. 0.05 for ±5%, 2 for ±2°C) */
  abs: number;
  /** Whether it's relative (% → true) or absolute (unit → false) */
  isRelative: boolean;
  /** Raw display string like "±5%" */
  raw: string;
}

/** Parse an uncertainty string like "±5%", "±2°C", "±0.5°" into absolute value + flags */
function parseUncertainty(raw: string, inputValue: number): InputUncertainty | null {
  if (!raw || inputValue === null || inputValue === undefined || inputValue === 0) return null;
  const m = raw.match(/^±\s*([\d.]+)\s*(%|°C|°|°F|K)?$/);
  if (!m) return null;
  const num = parseFloat(m[1]);
  const suffix = m[2] || "";
  const isRelative = suffix === "%";
  const abs = isRelative ? (num / 100) * Math.abs(inputValue) : num;
  return { id: "", abs, isRelative, raw };
}

/**
 * Compute combined standard uncertainty (uc) for each output variable
 * using numerical finite-difference sensitivity and the Root-Sum-Square (RSS) method.
 *
 * For each input xi with uncertainty u(xi):
 *   ∂f/∂xi ≈ (f(xi + δ) - f(xi - δ)) / (2δ)
 *   u_ci = |∂f/∂xi| * u(xi)
 *
 * Combined: uc(y) = sqrt(Σ(u_ci²))
 * Expanded: U = k × uc   (k = 2 → ~95 % confidence)
 */
const K_COVERAGE = 2;

function computeRSSUncertainties(
  tool: any,
  inputs: any[],
  baseValues: Record<string, any>,
  baseResults: Record<string, any>,
  runFormulasFn: (formulas: string[], scope: Record<string, any>, knownOuts: string[]) => Record<string, any>
): Record<string, { uc: number; expandedU: number; contributors: Array<{ id: string; percent: number; abs: number }> }> {
  const uMap: Record<string, { uc: number; expandedU: number; contributors: Array<{ id: string; percent: number; abs: number }> }> = {};
  if (!baseResults || !inputs) return uMap;

  // Identify inputs that have parseable uncertainty
  const uncertainInputs: Array<{ inp: any; u: InputUncertainty }> = [];
  for (const inp of inputs) {
    const parsed = parseUncertainty(inp.uncertainty, baseValues[inp.id]);
    if (parsed && parsed.abs > 0) {
      parsed.id = inp.id;
      uncertainInputs.push({ inp, u: parsed });
    }
  }
  if (uncertainInputs.length === 0) return uMap;

  // Determine which variables to propagate
  const knownOuts: string[] = [];
  for (const rr of tool?.result_rows || []) {
    if (Array.isArray(rr.formulaNames)) knownOuts.push(...rr.formulaNames);
  }

  for (const outputKey of Object.keys(baseResults)) {
    const baseVal = baseResults[outputKey];
    if (baseVal === null || baseVal === undefined || typeof baseVal !== "number" || !isFinite(baseVal)) continue;

    let uc2 = 0;
    const contributors: Array<{ id: string; percent: number; abs: number }> = [];

    for (const { inp, u } of uncertainInputs) {
      const xi = baseValues[inp.id];
      if (xi === null || xi === undefined || typeof xi !== "number" || !isFinite(xi)) continue;

      // Perturbation: 1% of the value or 1% of the uncertainty, whichever is smaller
      const delta = Math.max(Math.abs(xi) * 1e-4, Math.abs(u.abs) * 1e-4, 1e-12);

      // Run with +δ
      const valuesPlus = { ...baseValues, [inp.id]: xi + delta };
      const resultsPlus = runFormulasFn(tool.formulas || [], valuesPlus, knownOuts);

      // Run with -δ
      const valuesMinus = { ...baseValues, [inp.id]: xi - delta };
      const resultsMinus = runFormulasFn(tool.formulas || [], valuesMinus, knownOuts);

      const yPlus = resultsPlus?.[outputKey];
      const yMinus = resultsMinus?.[outputKey];
      if (yPlus === undefined || yMinus === undefined || typeof yPlus !== "number" || typeof yMinus !== "number") continue;

      // Central-difference sensitivity
      const sensitivity = (yPlus - yMinus) / (2 * delta);

      // Uncertainty contribution in output units
      const contrib = Math.abs(sensitivity) * u.abs;
      uc2 += contrib * contrib;
      contributors.push({ id: inp.id, abs: contrib, percent: 0 });
    }

    if (uc2 > 0) {
      const uc = Math.sqrt(uc2);
      // Compute percentage contributions
      const totalC = contributors.reduce((s, c) => s + c.abs, 0);
      for (const c of contributors) {
        c.percent = totalC > 0 ? (c.abs / totalC) * 100 : 0;
      }
      uMap[outputKey] = { uc, expandedU: uc * K_COVERAGE, contributors };
    }
  }

  return uMap;
}

/**
 * Execute a single formula string and return { varName: value } for each
 * variable that was newly computed.
 *
 * Strategy:
 * 1. Extract all assigned variable names from the formula (skipping JS reserved words
 *    and identifiers that appear after `const ` to avoid redeclaration errors).
 * 2. Pre‑declare mutable vars with `var` so the formula body can assign to them.
 * 3. Copy input-variable values from the scope arguments into local vars.
 * 4. Execute the ENTIRE formula as one function (supports for-loops, mutation, etc.).
 * 5. Return the subset that was NEW (not present in the original inputs).
 */
function execFullFormula(
  fs: string,
  scope: Record<string, any>
): Record<string, any> | null {
  const clean = fs.split("//")[0].trim();
  if (!clean) return null;

  const keys = Object.keys(scope);
  const vals = Object.values(scope);

  // Strip for-loop bodies and destructuring const {…} = … to avoid
  // capturing loop counters and destructured temp vars as formula outputs
  let stripped = clean.replace(/for\s*\([^)]*\)/g, "for(;;)");
  stripped = stripped.replace(/\bconst\s*\{[^}]*\}\s*=\s*[^;]+;/g, "");
  stripped = stripped.replace(/\blet\s+\{[^}]*\}\s*=\s*[^;]+;/g, "");

  // Extract LHS variable names
  const declRe = /(?:var|let|const)?\s*([a-zA-Z_$][\w$]*)\s*=\s*/g;
  const allNames: string[] = [];
  let dm: RegExpExecArray | null;
  while ((dm = declRe.exec(stripped)) !== null) {
    const n = dm[1];
    if (!JS_RESERVED.has(n) && n.length > 0) allNames.push(n);
  }
  const uniqueFormulaVars = [...new Set(allNames)];

  // Identify const/let/var declared vars so we don't re-declare them
  const alreadyDeclared = new Set<string>();
  const declKWRe = /\b(const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=/g;
  let dkm: RegExpExecArray | null;
  while ((dkm = declKWRe.exec(clean)) !== null) alreadyDeclared.add(dkm[2]);

  // Also skip vars already in scope params
  const scopeKeySet = new Set(keys);

  // Pre‑declare mutable vars that are NOT already declared and NOT already a parameter
  const mutableVars = uniqueFormulaVars.filter(
    (v) => !alreadyDeclared.has(v) && !scopeKeySet.has(v)
  );

  const body = sanitizeExpression(clean);

  try {
    const helperSrc =
      "var NORMSDIST=function(z){var x=Math.abs(z)/Math.SQRT2,t=1/(1+0.3275911*x),y=1-(((((1.061405429*t+1.421413741)*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);return 0.5*(1+(z>=0?1:-1)*y)};";
    const varDecl = mutableVars.length > 0 ? `var ${mutableVars.join(",")};` : "";

    // Return ALL variables so we can track everything for subsequent formulas
    const allReturnable = [...new Set([...keys, ...mutableVars, ...uniqueFormulaVars])];
    const returnBody = `return {${allReturnable.join(",")}};`;

    const fnStr = `"use strict";${helperSrc}${varDecl}${body};${returnBody}`;
    const fn = new Function(...keys, fnStr);
    const result: Record<string, any> = fn(...vals);
    return result || null;
  } catch {
    return null;
  }
}

function runFormulas(
  formulas: string[],
  parsed: Record<string, any>,
  knownOutputVars: string[] = []
) {
  const computed = { ...parsed };

  for (const f of formulas) {
    if (!f.trim() || f.trim().startsWith("//")) continue;

    // Build a unified scope (inputs + already-computed)
    const scope: Record<string, any> = {};
    for (const key of Object.keys(computed)) scope[key] = computed[key];

    const result = execFullFormula(f, scope);
    if (result) {
      for (const [k, v] of Object.entries(result)) {
        // Always store in computed so subsequent formulas can reference intermediate vars.
        // Only store non-junk values (not undefined/null/NaN).
        if (v !== undefined && v !== null && !Number.isNaN(v)) {
          computed[k] = v;
        }
      }
    }
  }
  return computed;
}

function runWarnings(tool: any, computed: Record<string, any>) {
  const w: Array<{ severity: string; source: string; message: string; id?: string }> = [];
  const sw = tool.engine_rules?.smart_warnings || [];
  sw.forEach((ww: any, i: number) => {
    try {
      const keys = Object.keys(computed);
      const vals = Object.values(computed);
      const cs = (ww.condition || "").replace(/\s+AND\s+/gi, " && ").replace(/\s+OR\s+/gi, " || ");
      const fn = new Function(...keys, `"use strict"; return !!(${cs});`);
      if (fn(...vals)) w.push({ severity: ww.severity || "WARNING", source: ww.source || "", message: ww.message, id: ww.id || `W${i}` });
    } catch { /* ignore */ }
  });
  return w;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────

export default function ProToolForm({ tool, locale }: ProToolFormProps) {
  const {
    canAccessAnalyzer, needsCreditLoad, requiresCreditConsume,
    creditPending, consumeCreditForRun, startCreditPackCheckout,
    creditBalance,
  } = usePremiumToolAccess(tool?.tool_id);

  // State
  const [values, setValues] = useState(() => {
    const init: Record<string, any> = {};
    (tool?.inputs || []).forEach((inp: any) => { if (inp.default !== undefined) init[inp.id] = inp.default; });
    return init;
  });
  const [results, setResults] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errs, setErrs] = useState<Array<{ id: string; msg: string }>>([]);
  const [warns, setWarns] = useState<Array<{ severity: string; source: string; message: string; id?: string }>>([]);
  const [uncertainties, setUncertainties] = useState<Record<string, { uc: number; expandedU: number; contributors: Array<{ id: string; percent: number; abs: number }> }> | null>(null);
  const [activeTab, setActiveTab] = useState("inputs");
  const [activeMat, setActiveMat] = useState<string | null>(null);
  const [creditMsg, setCreditMsg] = useState<string | null>(null);

  const inputs = tool?.inputs || [];
  const hasMatDB = inputs.some((i: any) => i.id === "material_group");
  const hasFMEA = (tool?.engine_rules?.fmea?.length || 0) > 0;
  const hasAudit = !!tool?.engine_rules?.audit_log;
  const allTabs = ["inputs", "results", "formulas", ...(hasFMEA ? ["fmea"] : []), ...(hasAudit ? ["audit"] : [])];

  // Handlers
  const handleChange = useCallback((id: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [id]: value === "" ? "" : isNaN(value) ? value : Number(value) }));
    setSubmitted(false);
    setResults(null);
    setErrs([]);
  }, []);

  const handleMatSelect = useCallback((key: string) => {
    setActiveMat(key);
    const m = MAT_DB[key];
    if (m) {
      setValues((prev: any) => ({ ...prev, kc1: m.kc1, mc: m.mc }));
    }
  }, []);

  const handleCalc = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setErrs([]);
    setWarns([]);
    setCreditMsg(null);

    // Credit check
    if (!canAccessAnalyzer && needsCreditLoad) { setCreditMsg("You need to load credits to run this calculation."); return; }
    if (requiresCreditConsume) {
      setCreditMsg("Consuming credit...");
      const res = await consumeCreditForRun(tool.tool_id);
      if (!res.ok) { setCreditMsg("Could not deduct credit."); return; }
      setCreditMsg(null);
    }

    // Parse inputs
    const parsed: Record<string, any> = {};
    const errList: Array<{ id: string; msg: string }> = [];
    inputs.forEach((inp: any) => {
      if (isInputHidden(inp, values)) return;
      const raw = values[inp.id];
      if (inp.required && (raw === undefined || raw === null || raw === "")) {
        errList.push({ id: "V0", msg: `${inp.name || inp.id} is required.` });
        return;
      }
      if (raw !== undefined && raw !== "") parsed[inp.id] = inp.type === "enum" ? raw : Number(raw);
    });
    // Validation rules from tool
    const v = tool?.engine_rules?.validation || {};
    const vRules = Array.isArray(v.rules) ? v.rules : [];
    vRules.forEach((rule: any) => {
      if (rule?.condition) {
        try {
          const keys = Object.keys(parsed);
          const vals = Object.values(parsed);
          const fn = new Function(...keys, `"use strict"; return !!(${rule.condition});`);
          if (fn(...vals)) {
            errList.push({ id: rule.id || "VX", msg: rule.message || rule.error_msg || "Validation failed" });
          }
        } catch { /* ignore */ }
      }
    });

    if (errList.length > 0) { setErrs(errList); return; }

    // Calculate
    try {
      let computed: Record<string, any>;
      let w: Array<{ severity: string; source: string; message: string; id?: string }>;

      if (tool.tool_id === "PRO_117") {
        const r = calculateRCBeamShearFlexure(parsed as any);
        computed = r;
        w = r.warnings || [];
      } else {
        // Collect known output vars from result_rows for robust variable tracking
        const knownOuts: string[] = [];
        for (const rr of (tool as any)?.result_rows || []) {
          if (Array.isArray(rr.formulaNames)) knownOuts.push(...rr.formulaNames);
        }
        computed = runFormulas(tool.formulas || [], parsed, knownOuts);
        w = runWarnings(tool, computed);
      }

      setResults(computed);
      setWarns(w);

      // --- RSS Uncertainty Propagation ---
      if (tool.tool_id !== "PRO_117") {
        // PRO_117 uses external calc - skip RSS for now
        try {
          const u = computeRSSUncertainties(tool, inputs, parsed, computed, runFormulas);
          setUncertainties(u);
        } catch {
          // Silent - uncertainty is a bonus feature, never block results
          setUncertainties(null);
        }
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrs([{ id: "ENG", msg: err.message || "Calculation error" }]);
    }
  }, [tool, values, canAccessAnalyzer, needsCreditLoad, requiresCreditConsume, consumeCreditForRun, inputs]);

  const handleReset = useCallback(() => {
    setValues({}); setSubmitted(false); setResults(null); setErrs([]); setWarns([]); setUncertainties(null);
    setActiveTab("inputs"); setActiveMat(null); setCreditMsg(null);
  }, []);

  // Build results
  const resultRows = useMemo(() => {
    if (!results || !submitted) return [];
    const formulaNames = (tool?.formulas || [])
      .filter((f: string) => f.includes("="))
      .map((f: string) => {
        // Extract the first LHS variable name from the formula, stripping const/let/var
        const clean = f.split("//")[0].trim().replace(/^(?:const|let|var)\s+/, "");
        // For multi-statement formulas, only take the first meaningful LHS
        const parts = clean.split(";");
        for (const p of parts) {
          const trimmed = p.trim();
          if (trimmed.includes("=")) {
            const lhs = trimmed.split("=")[0].trim();
            // Skip loop variables and destructuring patterns
            if (lhs && lhs.length > 0 && !lhs.includes("{") && !lhs.includes("(") && !["i","j","k","n","t","x","y","z","di","df","dm","fn","r","p"].includes(lhs)) {
              return lhs;
            }
          }
        }
        return null;
      })
      .filter(Boolean);

    // Also extract from result_rows formulaNames (more reliable source)
    const rrNames: string[] = [];
    for (const rr of (tool as any)?.result_rows || []) {
      if (Array.isArray(rr.formulaNames)) rrNames.push(...rr.formulaNames);
    }

    const keys = [...new Set([
      ...formulaNames,
      ...rrNames,
      ...Object.keys(results).filter(k => !inputs.some((i: any) => i.id === k))
    ])];
    return keys
      .filter(k => !k.startsWith("_") && !k.startsWith("//") && !["warnings"].includes(k))
      .map(key => {
        const val = results[key];
        if (val === undefined) return null;
        const inp = inputs.find((i: any) => i.id === key);
        const isKey = ["UC", "uc", "MRR", "T", "P_c", "F_c", "OEE", "CE", "L_fin"].some(kw => key.toUpperCase().includes(kw.toUpperCase()));
        const u = uncertainties?.[key];
        return {
          name: inp?.name || key.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          sym: inp?.symbol || key,
          unit: inp?.unit || "",
          value: val,
          fmt: fmt(val, 3),
          hl: isKey,
          uncertainty: u
            ? { display: `± ${fmt(u.expandedU, 3)}`, raw: u.expandedU, uc: u.uc }
            : null,
        };
      })
      .filter(Boolean);
  }, [results, submitted, tool, inputs, uncertainties]);

  const critCount = warns.filter(w => w.severity === "CRITICAL").length;
  const warnCount = warns.filter(w => w.severity === "WARNING").length;

  const ucVal = results?.UC !== undefined ? results.UC : results?.OEE !== undefined ? results.OEE / 100 : null;
  const ucPct = ucVal !== null ? (typeof ucVal === "number" ? ucVal * 100 : ucVal) : null;
  const ucCls = ucPct !== null ? (ucPct >= 100 ? "fail" : ucPct >= 85 ? "warn" : "pass") : "pass";

  const tabLabels: Record<string, string> = {
    inputs: "Inputs",
    results: "Results",
    formulas: "Formulas & Standards",
    fmea: "FMEA",
    audit: "Audit Log",
  };

  const inputSections = useMemo(() => {
    // Separate enum and numeric inputs
    const visible = inputs.filter((i: any) => !isInputHidden(i, values));
    const enums = visible.filter((i: any) => i.type === "enum");
    const nums = visible.filter((i: any) => i.type !== "enum");
    return { enums, nums };
  }, [inputs, values]);

  return (
    <div className="pro-form">
      {/* Credit messages */}
      {!canAccessAnalyzer && needsCreditLoad ? (
        <div style={{ background: "#FFFBEB", border: "1px solid #F59E0B", padding: "20px", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D97706", margin: 0 }}>CREDITS REQUIRED</p>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "#1A1915", margin: 0 }}>Load credits to run this professional calculator</h3>
          <p style={{ fontSize: 13, color: "rgba(26,25,21,0.7)", margin: 0, lineHeight: 1.5 }}>Each full premium calculation uses 1 credit. SectorCalc Pro subscribers can run calculations without credits.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
            <button disabled={creditPending} onClick={() => void startCreditPackCheckout({ toolSlug: tool.tool_id, returnPath: `/pro-tools/${tool.tool_id}`, locale, creditPackSize: 5 }).catch(() => undefined)}
              style={{ background: "#BD5D3A", color: "#fff", border: "none", padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {creditPending ? "Processing..." : "Load 5 credits - $4.99"}
            </button>
            <Link href="/pricing" style={{ background: "transparent", color: "#1A1915", border: "1px solid rgba(26,25,21,0.3)", padding: "10px 20px", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>View Pro Plans</Link>
          </div>
        </div>
      ) : requiresCreditConsume ? (
        <div style={{ background: "#FAF9F5", border: "1px solid rgba(26,25,21,0.12)", padding: "12px 16px", fontSize: 13, color: "rgba(26,25,21,0.7)", marginBottom: 16 }}>
          Credits Balance: <strong>{creditBalance}</strong> - 1 credit will be deducted per premium run.
        </div>
      ) : null}
      {creditMsg && (
        <div style={{ background: "#EFF6FF", borderLeft: "3px solid #3B82F6", padding: "12px 16px", fontSize: 13, color: "#1E40AF", marginBottom: 16 }}>{creditMsg}</div>
      )}

      {/* Breadcrumb */}
      <div className="pro-breadcrumb">
        <Link href="/pro-tools">PRO Tools</Link>
        <span className="pro-breadcrumb-sep">/</span>
        <Link href={`/pro-tools?category=${(tool.category || "").toLowerCase().replace(/\s+/g, "-")}`}>{tool.category || "Tool"}</Link>
        <span className="pro-breadcrumb-sep">/</span>
        <span>{tool.tool_name || tool.title}</span>
      </div>

      {/* Standards strip */}
      {tool.engine_rules?.standards?.length > 0 && (
        <div className="pro-std-strip">
          <span className="pro-std-lbl">Standards:</span>
          {tool.engine_rules.standards.map((s: string, i: number) => (
            <span key={i} className="pro-std-tag">{s}</span>
          ))}
        </div>
      )}

      {/* Tool Card */}
      <div className="pro-tool-card">
        {/* ── HEADER ─────────────────────────────────── */}
        <div className="pro-tool-hdr">
          <div>
            <div className="pro-tool-eyebrow">{tool.category}</div>
            <div className="pro-tool-title">{tool.tool_name || tool.title}</div>
            <div className="pro-tool-meta">
              <span>{tool.tool_id}</span>
              <span className="pro-tool-meta-dot"></span>
              <span>{tool.category}</span>
              <span className="pro-tool-meta-dot"></span>
              <span>ECMI</span>
            </div>
          </div>
          <div className="pro-hdr-badges">
            <span className="pro-cert-badge pro-cert-tuv">TUV-class</span>
            <span className="pro-cert-badge pro-cert-iso">ISO 9001 §8.5.1</span>
            <span className="pro-cert-badge pro-cert-ecmi">ECMI</span>
          </div>
        </div>

        {/* ── STATUS ROW ─────────────────────────────────── */}
        <div className="pro-status-row">
          <div>
            {!submitted ? (
              <span className="pro-badge pro-badge-idle">- NOT CALCULATED</span>
            ) : critCount > 0 ? (
              <span className="pro-badge pro-badge-crit">⛔ {critCount} CRITICAL</span>
            ) : warnCount > 0 ? (
              <span className="pro-badge pro-badge-warn">⚠ {warnCount} WARNING</span>
            ) : (
              <span className="pro-badge pro-badge-ok">✓ PASS</span>
            )}
          </div>
          {submitted && ucPct !== null && (
            <span className="pro-status-uc">
              {tool.tool_id === "PRO_098" ? "OEE" : "UC"}: <strong>{typeof ucPct === "number" ? ucPct.toFixed(1) : "-"}%</strong>
            </span>
          )}
        </div>

        {/* ── TABS ──────────────────────────────────── */}
        <div className="pro-tabs">
          {allTabs.map(tab => (
            <button
              key={tab}
              className={`pro-tab-btn${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabLabels[tab] || tab}
              {tab === "results" && submitted && warns.length > 0 && <span className="pro-tab-dot" />}
              {tab === "fmea" && hasFMEA && <span className="pro-tab-pill">{(tool.engine_rules?.fmea || []).length}</span>}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════
            INPUTS PANEL
        ══════════════════════════════════════════════ */}
        {activeTab === "inputs" && (
          <div className="pro-panel">
            <form onSubmit={handleCalc} noValidate>
              {/* Material DB */}
              {hasMatDB && (
                <>
                  <div className="pro-sec-lbl">
                    Workpiece Material - Select Group
                    <span className="pro-sec-note">Sandvik C-2920 Database</span>
                  </div>
                  <div className="pro-mat-grid">
                    {Object.entries(MAT_DB).map(([k, m]) => (
                      <div
                        key={k}
                        className={`pro-mat-option${activeMat === k ? " selected" : ""}`}
                        onClick={() => handleMatSelect(k)}
                      >
                        <div className="pro-mat-name" style={{ color: m.color }}>{m.label}</div>
                        <div className="pro-mat-code">ISO 513:2012</div>
                        <div className="pro-mat-vc">V_c: {m.vc[0]}–{m.vc[2]} m/min</div>
                        <div className="pro-mat-kc">k_c1: {m.kc1} N/mm² · m_c: {m.mc}</div>
                      </div>
                    ))}
                  </div>

                  {activeMat && MAT_DB[activeMat] && (
                    <div className="pro-mat-info-card" style={{ marginBottom: 14 }}>
                      <div className="pro-mat-accent" style={{ background: MAT_DB[activeMat].color }}></div>
                      <div className="pro-mat-info-body">
                        <div className="pro-mat-info-ref">Sandvik C-2920 / ISO 513 Reference Data</div>
                        <div className="pro-mat-stats">
                          {["Vc", "kc1", "mc"].map(f => {
                            const m = MAT_DB[activeMat];
                            const v = f === "Vc" ? `${m.vc[0]}–${m.vc[2]}` : f === "kc1" ? String(m.kc1) : String(m.mc);
                            const u = f === "Vc" ? "m/min" : f === "kc1" ? "N/mm²" : "Kienzle";
                            return (
                              <div key={f} className="pro-ms-item">
                                <span className="pro-ms-label">{f}</span>
                                <span className="pro-ms-value">{v}</span>
                                <span className="pro-ms-unit">{u}</span>
                              </div>
                            );
                          })}
                        </div>
                        <button type="button" className="pro-apply-mat-btn" onClick={() => handleMatSelect(activeMat)}>Apply Preset →</button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Enum inputs */}
              {inputSections.enums.length > 0 && (
                <>
                  <div className="pro-sec-lbl" style={{ marginTop: 6 }}>
                    {hasMatDB ? "Cutting Parameters" : "Configuration"}
                    <span className="pro-sec-note">Required: all marked *</span>
                  </div>
                  <div className="pro-enum-row">
                    {inputSections.enums.map((inp: any) => {
                      const opts = inp.options
                        ? (typeof inp.options[0] === "string" ? inp.options.map((o: string) => ({ value: o, label: o })) : inp.options.map((o: any) => ({ value: o.value || o, label: o.label || o })))
                        : [];
                      return (
                        <div key={inp.id} className="pro-inp-item pro-enum-item">
                          <div className="pro-inp-lbl">
                            {inp.name || inp.id}
                            {inp.symbol && <span className="pro-sym">{inp.symbol}</span>}
                            {inp.required && <span className="pro-req">*</span>}
                            {inp.confidence_label && <span className={`pro-conf-badge ${confClass(inp.confidence_label)}`}>{confidenceLabel(inp.confidence_label)}</span>}
                          </div>
                          <div className="pro-inp-row">
                            <select
                              value={values[inp.id] ?? ""}
                              onChange={e => handleChange(inp.id, e.target.value)}
                              style={{ appearance: "auto" }}
                            >
                              <option value="">- Select -</option>
                              {opts.map((opt: any, i: number) => (
                                <option key={i} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          {inp.note && <div className="pro-inp-hint">{inp.note}</div>}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Numeric inputs */}
              <div className="pro-sec-lbl" style={{ marginTop: 6 }}>
                {hasMatDB ? "Cutting Parameters" : "Input Parameters"}
                <span className="pro-sec-note">Required: all marked *</span>
              </div>
              <div className="pro-inp-grid">
                {inputSections.nums.map((inp: any) => {
                  const val = values[inp.id] ?? "";
                  const confLbl = inp.confidence_label ? confidenceLabel(inp.confidence_label) : "";
                  const cc = confClass(inp.confidence_label);

                  return (
                    <div key={inp.id} className="pro-inp-item">
                      <div className="pro-inp-lbl">
                        {inp.name || inp.id}
                        {inp.symbol && <span className="pro-sym">{inp.symbol}</span>}
                        {inp.required && <span className="pro-req">*</span>}
                        {confLbl && <span className={`pro-conf-badge ${cc}`}>{confLbl}</span>}
                      </div>
                      <div className="pro-inp-row">
                        <input
                          type="number"
                          step={inp.resolution || "any"}
                          min={inp.absolute_min}
                          max={inp.absolute_max}
                          value={val === "" ? "" : String(val)}
                          placeholder={inp.note || "..."}
                          onChange={e => handleChange(inp.id, e.target.value)}
                        />
                        {inp.unit && <span className="pro-inp-unit">{inp.unit}</span>}
                      </div>
                      <div className="pro-inp-meta">
                        <span className="pro-inp-hint">
                          {inp.absolute_min !== undefined ? `≥${inp.absolute_min}` : ""}
                          {inp.absolute_max !== undefined ? ` ≤${inp.absolute_max}` : ""}
                          {" "}{inp.unit}
                        </span>
                        {inp.uncertainty && <span className="pro-inp-unc">{inp.uncertainty}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Error panel */}
              {errs.length > 0 && (
                <div className="pro-err-panel">
                  {errs.map((e, i) => (
                    <div key={i} className="pro-err-item">
                      <span className="pro-err-code">{e.id}</span>
                      <span className="pro-err-msg">{e.msg}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action row */}
              <div className="pro-action-row">
                <button type="submit" className="pro-calc-btn">Calculate</button>
                {submitted && (
                  <button type="button" className="pro-reset-btn" onClick={handleReset}>Reset</button>
                )}
                <div className="pro-action-note">
                  ISO/IEC Guide 98-3 GUM<br />
                  Uncertainty propagation included
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            RESULTS PANEL
        ══════════════════════════════════════════════ */}
        {activeTab === "results" && (
          <div className="pro-panel">
            {!submitted ? (
              <div className="pro-empty-state">
                <div className="pro-empty-state-icon">⚙</div>
                No calculation performed. Enter parameters in the Inputs tab.
              </div>
            ) : (
              <div id="pro-results-content">
                {/* Verdict Banner */}
                {critCount > 0 ? (
                  <div className="pro-verdict-banner fail">
                    <span className="pro-verdict-icon">⛔</span>
                    <div className="pro-verdict-body">
                      <div className="pro-verdict-title">CRITICAL - Calculation requires attention</div>
                      <div className="pro-verdict-sub">{critCount} critical warnings · Review parameters</div>
                    </div>
                  </div>
                ) : warnCount > 0 ? (
                  <div className="pro-verdict-banner warn">
                    <span className="pro-verdict-icon">⚠</span>
                    <div className="pro-verdict-body">
                      <div className="pro-verdict-title">WARNING - Parameters at limit</div>
                      <div className="pro-verdict-sub">{warnCount} warnings · Verify before production use</div>
                    </div>
                  </div>
                ) : (
                  <div className="pro-verdict-banner pass">
                    <span className="pro-verdict-icon">✓</span>
                    <div className="pro-verdict-body">
                      <div className="pro-verdict-title">PARAMETERS WITHIN LIMITS</div>
                      <div className="pro-verdict-sub">All validations passed · Calculation complete</div>
                    </div>
                  </div>
                )}

                {/* Warning cards */}
                {warns.length > 0 && (
                  <div className="pro-warn-panel">
                    {warns.map((w, i) => (
                      <div key={i} className={`pro-warn-card ${w.severity}`}>
                        <div className="pro-warn-hdr">
                          <span>{w.severity === "CRITICAL" ? "⛔" : w.severity === "WARNING" ? "⚠" : "ℹ"}</span>
                          <span className="pro-warn-sev">{w.severity}</span>
                          {w.id && <span className="pro-warn-id">{w.id}</span>}
                          {w.source && <span className="pro-warn-src">{w.source}</span>}
                        </div>
                        <div className="pro-warn-msg">{w.message}</div>
                      </div>
                    ))}
                  </div>
                )}
                {warns.length === 0 && (
                  <div className="pro-ok-banner">✓ All parameters within standard ranges. No critical conditions detected.</div>
                )}

                {/* UC Gauge */}
                {ucPct !== null && (
                  <div className="pro-uc-gauge-wrap">
                    <div className="pro-uc-gauge-hdr">
                      <span className="pro-uc-label">
                        {tool.tool_id === "PRO_098" ? "OEE Score" : "Capacity Utilization Ratio"}
                      </span>
                      <span className={`pro-uc-value-display ${ucCls}`}>
                        {typeof ucPct === "number" ? ucPct.toFixed(1) : "-"}%
                      </span>
                    </div>
                    <div className="pro-uc-gauge-track">
                      <div className="pro-uc-gauge-fill" style={{
                        width: `${Math.min(Number(ucPct), 100)}%`,
                        background: ucCls === "fail" ? "#DC2626" : ucCls === "warn" ? "#D97706" : "#059669",
                      }} />
                    </div>
                    <div className="pro-uc-gauge-zones">
                      <span className="pro-uc-zone">0%</span>
                      <span className="pro-uc-zone" style={{ textAlign: "center" }}>75% Recommended Max</span>
                      <span className="pro-uc-zone">100%</span>
                    </div>
                  </div>
                )}

                {/* Results Table */}
                {resultRows.length > 0 && (
                  <>
                    <div className="pro-sec-lbl">
                      Calculated Results
                      <span className="pro-sec-note">All expressions dimensionally verified</span>
                    </div>
                    <div className="pro-res-table">
                      <div className="pro-res-hdr">
                        <span>Parameter</span>
                        <span></span>
                        <span>Value</span>
                        <span>± Unc.</span>
                        <span>Unit</span>
                      </div>
                      {resultRows.map((r: any, i: number) => (
                        <div key={i} className="pro-res-row">
                          <span className="pro-res-name">
                            {r.name}
                            <span className="pro-res-sym">{r.sym}</span>
                          </span>
                          <span></span>
                          <span className={`pro-res-val${r.hl ? " hl" : ""}`}>{r.fmt}</span>
                          <span className="pro-res-unc">{r.uncertainty?.display || "-"}</span>
                          <span className="pro-res-unit">{r.unit}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* References */}
                {tool.engine_rules?.standards?.length > 0 && (
                  <div className="pro-refs-row">
                    <span className="pro-ref-ttl">References:</span>
                    {tool.engine_rules.standards.map((s: string, i: number) => (
                      <span key={i} className="pro-ref-tag">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            FORMULAS PANEL
        ══════════════════════════════════════════════ */}
        {activeTab === "formulas" && (
          <div className="pro-panel">
            <div className="pro-sec-lbl">
              Calculation Formulas
              <span className="pro-sec-note">All expressions dimensionally verified</span>
            </div>

            {(tool?.formulas || []).filter((f: string) => f.trim() && !f.trim().startsWith("//")).length > 0 ? (
              <div className="pro-frm-list">
                {(tool?.formulas || []).filter((f: string) => f.trim() && !f.trim().startsWith("//")).map((f: string, i: number) => {
                  const eqIdx = f.indexOf("=");
                  if (eqIdx === -1) return null;
                  const lhs = f.substring(0, eqIdx).trim();
                  let rhs = f.substring(eqIdx + 1).trim();
                  let ref = "";
                  if (rhs.includes("//")) {
                    const ci = rhs.indexOf("//");
                    ref = rhs.substring(ci + 2).trim();
                    rhs = rhs.substring(0, ci).trim();
                  }
                  const fid = `F${i + 1}`;
                  return (
                    <div key={i} className="pro-frm-row">
                      <div>
                        <div className="pro-frm-id">{fid}</div>
                        <div className="pro-frm-lhs">{lhs}</div>
                      </div>
                      <div className="pro-frm-eq">=</div>
                      <div className="pro-frm-body">
                        <div className="pro-frm-rhs">{rhs}</div>
                        {ref && <div className="pro-frm-ref">{ref}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pro-empty-state">
                <div className="pro-empty-state-icon">📐</div>
                <p>No formula data available for this tool.</p>
              </div>
            )}

            {/* Validation Rules */}
            {tool?.engine_rules?.validation && Object.keys(tool.engine_rules.validation).length > 0 && (
              <>
                <div className="pro-sec-lbl" style={{ marginTop: 14 }}>
                  Validation Rules
                  <span className="pro-sec-note">BLOCK = calculation prevented · WARN = flagged output</span>
                </div>
                <div className="pro-val-table">
                  <div className="pro-val-hdr">
                    <span>Rule ID</span>
                    <span>Action</span>
                    <span>Condition & Message</span>
                  </div>
                  {Object.entries(tool.engine_rules.validation).map(([k, r]: [string, any], i: number) => (
                    <div key={i} className="pro-val-row">
                      <span className="pro-val-id">{k}</span>
                      <div>
                        {r.action === "WARN" ? (
                          <span className="pro-val-action-warn">WARN</span>
                        ) : (
                          <span className="pro-val-action-block">BLOCK</span>
                        )}
                      </div>
                      <span className="pro-val-msg">{r.error_msg || r.message}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            FMEA PANEL
        ══════════════════════════════════════════════ */}
        {activeTab === "fmea" && hasFMEA && (
          <div className="pro-panel">
            <div className="pro-sec-lbl">
              Failure Mode & Effects Analysis (FMEA)
              <span className="pro-sec-note">RPN = Severity × Occurrence × Detection (1–10 each)</span>
            </div>
            <div className="pro-fmea-table">
              <div className="pro-fmea-hdr">
                <span>Failure Mode</span>
                <span>Effect / Hazard</span>
                <span style={{ textAlign: "center" }}>S</span>
                <span style={{ textAlign: "center" }}>O</span>
                <span style={{ textAlign: "center" }}>D</span>
                <span style={{ textAlign: "center" }}>RPN</span>
                <span>Control Measure</span>
              </div>
              {(tool.engine_rules?.fmea || []).map((entry: any, i: number) => {
                const rpn = entry.rpn_high || entry.rpn || 0;
                const rpnCls = rpn > 200 ? "pro-rpn-high" : rpn > 100 ? "pro-rpn-med" : "pro-rpn-low";
                return (
                  <div key={i} className="pro-fmea-row">
                    <div className="pro-fmea-mode">{entry.failureMode || entry.failure_mode || entry.name || "-"}</div>
                    <div className="pro-fmea-effect">{entry.effect || entry.description || entry.effect_description || "-"}</div>
                    <div className="pro-fmea-score">{entry.severity_score || entry.severity || "-"}</div>
                    <div className="pro-fmea-score">{entry.occurrence || entry.occurrence_score || "-"}</div>
                    <div className="pro-fmea-score">{entry.detection || entry.detection_score || "-"}</div>
                    <div className={`pro-fmea-rpn ${rpnCls}`}>{rpn}{entry.rpn_low ? ` / ${entry.rpn_low}` : ""}</div>
                    <div className="pro-fmea-ctrl">{entry.control_measure || entry.controls || entry.current_controls || "-"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            AUDIT PANEL
        ══════════════════════════════════════════════ */}
        {activeTab === "audit" && hasAudit && (
          <div className="pro-panel">
            <div className="pro-audit-log">
              <div className="pro-audit-hdr">
                <span className="pro-audit-hdr-title">ISO 9001 §8.5.1 Calculation Audit Trail</span>
                <span className="pro-audit-hdr-badge">{tool.tool_id} · SectorCalc</span>
              </div>
              {submitted && results ? (
                <div className="pro-audit-body">
                  {[
                    { k: "tool_id", v: tool.tool_id },
                    { k: "version", v: "1.0.0" },
                    { k: "timestamp", v: nowISO() },
                    { k: "design_standard", v: (tool.engine_rules?.standards || []).join(" / ") || "-" },
                    { k: "input_hash", v: hashStr(JSON.stringify(values)) },
                    ...Object.entries(results)
                      .filter(([, v]) => typeof v === "number" || typeof v === "string")
                      .slice(0, 20)
                      .map(([k, v]) => ({ k, v: String(v) })),
                    ...(uncertainties
                      ? Object.entries(uncertainties).slice(0, 8).map(([k, u]) => ({
                          k: `U(${k})`,
                          v: `± ${fmt(u.expandedU, 3)} (k=${K_COVERAGE})`,
                        }))
                      : []),
                    { k: "critical_count", v: String(critCount), cls: critCount > 0 ? "fail" : "ok" },
                    { k: "validation_result", v: critCount > 0 ? "FAIL" : "PASS", cls: critCount > 0 ? "fail" : "ok" },
                    { k: "disclaimer", v: "Engineering decision support only. Field validation by qualified engineer required." },
                  ].map((entry, i) => (
                    <div key={i} className="pro-audit-row">
                      <span className="pro-audit-key">{entry.k}</span>
                      <span className={`pro-audit-val ${(entry as any).cls || ""}`}>{entry.v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pro-audit-empty">No calculation performed. Run calculator to generate audit record.</div>
              )}
            </div>
          </div>
        )}

        {/* ── CTA BAR ──────────────────────────────────────── */}
        {submitted && activeTab !== "results" && (
          <div className="pro-cbar">
            <div className="pro-cbar-left">
              {critCount > 0 ? (
                <span className="pro-badge pro-badge-crit">⛔ {critCount} CRITICAL</span>
              ) : warnCount > 0 ? (
                <span className="pro-badge pro-badge-warn">⚠ {warnCount} WARNING</span>
              ) : (
                <span className="pro-badge pro-badge-ok">✓ PASS</span>
              )}
              <span className="pro-cbar-status">ISO 513 · GUM uncertainty propagated</span>
            </div>
            <button className="pro-cbar-btn" onClick={() => setActiveTab("results")}>View Results →</button>
          </div>
        )}
      </div>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <div className="pro-tool-footer">
        <span>📐 {[(tool.engine_rules?.standards || []).join(" · ") || "Industry standards"]}</span>
        <span>🔬 GUM ISO/IEC 98-3 uncertainty propagation included</span>
        <span>⚠ Engineering decision support only - field validation by qualified engineer required</span>
        <span>SectorCalc {tool.tool_id} v1.0.0</span>
      </div>
    </div>
  );
}
