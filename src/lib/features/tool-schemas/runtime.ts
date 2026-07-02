/**
 * Universal Tool Runtime — Expression Evaluator & Schema Validator
 *
 * Interprets strings from ToolSchema.FormulaDef.expression using a
 * safe expression evaluator. Supports Math.*, ternary, variables,
 * and nested arithmetic — all from a single expression string (I1).
 */

import type {
  ToolSchema, ComputeRequest, ComputeResult,
  Severity, SmartWarning, FmeaMode,
} from "./types";
import { normalizeInputs } from "../premium-schema/unit-normalizer";

/* ══════════════════════════════════════════════════════════════════
 * EXPRESSION EVALUATOR
 * ══════════════════════════════════════════════════════════════════ */

/**
 * Safely evaluate an expression string against a scope of variables.
 * Supports: + - * / ** ( ), Math.*, ternary a ? b : c, comparison, Math.pow, Math.sqrt, Math.min, Math.max.
 * DANGER: no `eval`. We build a sandboxed Function with limited scope.
 */
/** Reserved globals that should not be passed as parameters (already in scope). */
const RESERVED_GLOBALS = new Set([
  "Math", "Infinity", "NaN", "undefined",
  "isFinite", "isNaN", "parseInt", "parseFloat",
  "Number", "String", "Boolean", "Array", "Object",
  "Map", "Set", "RegExp", "Date", "JSON", "Error",
  "console", "Promise", "Symbol", "BigInt",
]);

export function evaluateExpr(expr: string, scope: Record<string, number>): number {
  // 1. Collect all identifiers used in the expression
  const varPattern = /[a-zA-Z_]\w*/g;
  const used = new Set<string>();
  let match: RegExpExecArray | null;
  const varReg = new RegExp(varPattern);
  while ((match = varReg.exec(expr)) !== null) {
    used.add(match[0]);
  }

  // 2. Filter out reserved globals and Math.* members (they are always available)
  const mathMembers = new Set(Object.getOwnPropertyNames(Math));
  const varNames = [...used].filter(v =>
    !mathMembers.has(v) && !RESERVED_GLOBALS.has(v)
  );

  // 3. Build function params and args
  const params = varNames.join(",");
  const args = varNames.map(v => scope[v] ?? 0);

  // 4. Ensure exponentiation uses ** (already valid in modern JS/new Function)
  const sanitized = expr;

  try {
    const fn = new Function(...varNames, `"use strict"; return (${sanitized});`);
    const result = fn(...args);
    if (typeof result !== "number" || !isFinite(result)) {
      throw new Error(`Expression evaluation returned non-finite: ${expr} = ${result}`);
    }
    return result;
  } catch (err: any) {
    throw new Error(`Eval error in "${expr}": ${err.message}`);
  }
}

/* ══════════════════════════════════════════════════════════════════
 * VALIDATION
 * ══════════════════════════════════════════════════════════════════ */

export function validateSchema(
  schema: ToolSchema,
  standardId: string,
  values: Record<string, number>
): { ruleId: string; message: string }[] {
  const standard = schema.standards.find(s => s.id === standardId);
  if (!standard) return [{ ruleId: "V0", message: `Unknown standard: ${standardId}` }];

  const fired: { ruleId: string; message: string }[] = [];

  // 1. Required input check (fail-closed — I6)
  for (const inp of schema.inputs) {
    if (inp.optional) continue;
    if (inp.appliesTo && !inp.appliesTo.includes(standardId)) continue;
    const val = values[inp.id];
    if (val === undefined || val === null || val === 0) {
      fired.push({
        ruleId: `REQ_${inp.id}`,
        message: `${inp.label} (${inp.symbol}) is required.`,
      });
    }
  }

  // 2. Range checks from InputDef min/max
  for (const inp of schema.inputs) {
    if (inp.appliesTo && !inp.appliesTo.includes(standardId)) continue;
    const val = values[inp.id];
    if (val === undefined || val === null) continue;
    if (inp.min !== undefined && val < inp.min) {
      fired.push({
        ruleId: `MIN_${inp.id}`,
        message: `${inp.label} minimum is ${inp.min}. Got ${val}.`,
      });
    }
    if (inp.max !== undefined && val > inp.max) {
      fired.push({
        ruleId: `MAX_${inp.id}`,
        message: `${inp.label} maximum is ${inp.max}. Got ${val}.`,
      });
    }
  }

  // 3. Standard-level BLOCK validation rules — condition = TRUE means VIOLATED
  for (const rule of standard.validation) {
    if (rule.action !== "BLOCK") continue;
    try {
      const violated = evaluateExpr(rule.condition, values);
      if (violated) {
        fired.push({ ruleId: rule.id, message: rule.message });
      }
    } catch (err: any) {
      fired.push({ ruleId: rule.id, message: `Validation eval error: ${err.message}` });
    }
  }

  return fired;
}

/* ══════════════════════════════════════════════════════════════════
 * COMPUTE — Evaluate all formulas for a given standard
 * ══════════════════════════════════════════════════════════════════ */

export function computeStandard(
  schema: ToolSchema,
  standardId: string,
  values: Record<string, number>
): Record<string, number> {
  const standard = schema.standards.find(s => s.id === standardId);
  if (!standard) throw new Error(`Unknown standard: ${standardId}`);

  // Wire unit normalizer for FREE tools
  const normInputs = schema.inputs.map(i => ({
    id: i.id,
    unit: typeof i.unit === 'object' && i.unit !== null ? (i.unit as any).ref : i.unit as string
  }));
  const { values: normalizedValues, warnings } = normalizeInputs(normInputs, values);
  if (warnings.length > 0 && process.env.NODE_ENV !== "production") {
    console.warn(`[Unit Normalizer] Warnings for ${(schema as any).schemaId || (schema as any).name || 'schema'}:`, warnings);
  }

  const scope: Record<string, number> = { ...normalizedValues };

  for (const formula of standard.formulas) {
    try {
      const result = evaluateExpr(formula.expression, scope);
      scope[formula.output] = result;

      // Domain guard check — condition must evaluate to TRUE for valid domain
      if (formula.domainGuard) {
        const guardResult = evaluateExpr(formula.domainGuard.condition, scope);
        if (!guardResult) {
          throw new Error(
            `Domain guard failed at ${formula.id} (${formula.output}): ${formula.domainGuard.errorMessage}`
          );
        }
      }
    } catch (err: any) {
      throw new Error(`Formula ${formula.id} (${formula.output}): ${err.message}`);
    }
  }

  return scope;
}

/* ══════════════════════════════════════════════════════════════════
 * WARNINGS
 * ══════════════════════════════════════════════════════════════════ */

export function evaluateWarnings(
  standard: { warnings: SmartWarning[] },
  scope: Record<string, number>
): { id: string; severity: Severity; source: string; message: string }[] {
  const fired: { id: string; severity: Severity; source: string; message: string }[] = [];

  for (const w of standard.warnings) {
    try {
      const triggered = evaluateExpr(w.condition, scope);
      if (triggered) {
        const formatted = interpolateMessage(w.message, scope);
        fired.push({ id: w.id, severity: w.severity, source: w.source, message: formatted });
      }
    } catch {
      // Skip warnings that can't be evaluated (e.g. intermediate outputs not computed)
    }
  }

  return fired;
}

/* ══════════════════════════════════════════════════════════════════
 * FMEA
 * ══════════════════════════════════════════════════════════════════ */

export function evaluateFMEA(
  fmeaConfig: { modes: FmeaMode[]; mandatoryWhen: string },
  scope: Record<string, number>
): { modes: { mode: string; effect: string; sev: number; occ: number; det: number; rpn: number; mitigation?: string }[]; mandatory: boolean } {
  // Check mandatory gate
  let mandatory = false;
  try {
    mandatory = !!evaluateExpr(fmeaConfig.mandatoryWhen, scope);
  } catch { /* keep false */ }

  const modes = fmeaConfig.modes
    .filter(m => {
      if (!m.when) return true; // always shown
      try { return !!evaluateExpr(m.when, scope); }
      catch { return true; }
    })
    .map(m => ({
      mode: m.mode,
      effect: m.effect,
      sev: m.sev,
      occ: m.occ,
      det: m.det,
      rpn: m.sev * m.occ * m.det,
      mitigation: m.mitigation,
    }));

  return { modes, mandatory };
}

/* ══════════════════════════════════════════════════════════════════
 * DECISION / VERDICT
 * ══════════════════════════════════════════════════════════════════ */

export function evaluateDecision(
  decision: { governingOutput: string; thresholds: { pass: number; fail: number }; governingMode?: { expression: string; labels?: Record<string, string> }; verdictText: { pass: string; warn: string; fail: string } },
  scope: Record<string, number>
): { status: 'PASS' | 'WARN' | 'FAIL'; governing: { output: string; value: number; mode?: string }; verdict: string } {
  const govVal = scope[decision.governingOutput] ?? 0;
  const { pass, fail } = decision.thresholds;

  let mode: string | undefined;
  if (decision.governingMode) {
    try {
      const rawMode = evaluateExpr(decision.governingMode.expression, scope);
      // If the expression returns a number, leave it; labels map might exist
      const modeKey = decision.governingMode.labels ? String(Math.round(rawMode)) : String(rawMode);
      mode = decision.governingMode.labels?.[modeKey] ?? `${rawMode}`;
    } catch {
      mode = undefined;
    }
  }

  let status: 'PASS' | 'WARN' | 'FAIL';
  let verdict: string;

  if (govVal <= pass) {
    status = 'PASS';
    verdict = decision.verdictText.pass;
  } else if (govVal <= fail) {
    status = 'WARN';
    verdict = decision.verdictText.warn;
  } else {
    status = 'FAIL';
    verdict = decision.verdictText.fail;
  }

  return {
    status,
    governing: { output: decision.governingOutput, value: govVal, mode },
    verdict,
  };
}

/* ══════════════════════════════════════════════════════════════════
 * GUM UNCERTAINTY (numeric finite-difference)
 * ══════════════════════════════════════════════════════════════════ */

export function computeGUM(
  gumConfig: { measurand: string; method: 'analytic' | 'numeric'; coverageFactor?: number },
  schema: ToolSchema,
  standardId: string,
  values: Record<string, number>,
  baseScope: Record<string, number>
): { measurand: string; u_c: number; U: number; contributions: { input: string; share: number }[] } {
  const k = gumConfig.coverageFactor ?? 2;
  const measurand = gumConfig.measurand;
  const y0 = baseScope[measurand] ?? 0;

  // Identify uncertain inputs
  const uncertainInputs = schema.inputs.filter(
    inp => inp.uncertainty && (!inp.appliesTo || inp.appliesTo.includes(standardId))
  );

  if (uncertainInputs.length === 0 || y0 === 0) {
    return { measurand, u_c: 0, U: 0, contributions: [] };
  }

  // Numeric finite-difference: ∂y/∂xᵢ ≈ (y(xᵢ+δ) - y(xᵢ-δ)) / (2δ)
  const contributions: { input: string; share: number }[] = [];
  let u_c_sq = 0;

  for (const inp of uncertainInputs) {
    const unc = inp.uncertainty!;
    const x0 = values[inp.id] ?? 0;
    if (x0 === 0) continue;

    // Convert uncertainty to absolute standard uncertainty u(xᵢ)
    let u_xi: number;
    if (typeof unc.value === 'string' && unc.value.endsWith('%')) {
      const pct = parseFloat(unc.value) / 100;
      u_xi = Math.abs(x0 * pct);
    } else {
      u_xi = Math.abs(Number(unc.value));
    }

    // Distribution divisor
    const div: Record<string, number> = {
      normal: 1, rectangular: Math.sqrt(3), triangular: Math.sqrt(6), 'u-shaped': Math.sqrt(2),
    };
    u_xi /= div[unc.distribution] ?? 1;

    if (u_xi === 0) continue;

    // Perturbation
    const delta = Math.max(u_xi * 0.01, 1e-10);

    // Forward
    const fwdScope = { ...values, [inp.id]: x0 + delta };
    const fwdResult = computeStandard(schema, standardId, fwdScope);
    const y_fwd = fwdResult[measurand] ?? 0;

    // Backward
    const bwdScope = { ...values, [inp.id]: x0 - delta };
    const bwdResult = computeStandard(schema, standardId, bwdScope);
    const y_bwd = bwdResult[measurand] ?? 0;

    const dy_dx = (y_fwd - y_bwd) / (2 * delta);
    const contrib = dy_dx * u_xi;
    u_c_sq += contrib * contrib;

    contributions.push({
      input: inp.id,
      share: contrib * contrib, // Will normalize after loop
    });
  }

  const u_c = Math.sqrt(u_c_sq);
  const U = k * u_c;

  // Normalize contributions to % of variance
  const totalVar = contributions.reduce((s, c) => s + c.share, 0);
  for (const c of contributions) {
    c.share = totalVar > 0 ? (c.share / totalVar) * 100 : 0;
  }

  return { measurand, u_c, U, contributions };
}

/* ══════════════════════════════════════════════════════════════════
 * INPUT HASH (SHA-256 via Web Crypto)
 * ══════════════════════════════════════════════════════════════════ */

export async function hashInput(values: Record<string, number>): Promise<string> {
  const canonical = Object.keys(values)
    .sort()
    .map(k => `${k}:${values[k]}`)
    .join("|");

  const encoder = new TextEncoder();
  const data = encoder.encode(canonical);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ══════════════════════════════════════════════════════════════════
 * MESSAGE INTERPOLATION
 * ══════════════════════════════════════════════════════════════════ */

export function interpolateMessage(template: string, scope: Record<string, number>): string {
  return template.replace(/\{(\w+)(?::(\w+))?\}/g, (_, name: string, fmt?: string) => {
    const val = scope[name];
    if (val === undefined) return `{${name}}`;
    if (fmt === "2f") return val.toFixed(2);
    if (fmt === "3f") return val.toFixed(3);
    if (fmt === "1f") return val.toFixed(1);
    if (fmt === "0f") return val.toFixed(0);
    if (fmt === "pct") return (val * 100).toFixed(1);
    return String(val);
  });
}

/* ══════════════════════════════════════════════════════════════════
 * FULL COMPUTE PIPELINE
 * ══════════════════════════════════════════════════════════════════ */

export async function computeTool(req: ComputeRequest): Promise<ComputeResult> {
  const { schema, standardId, values } = req;

  // 1. Validate
  const validationFails = validateSchema(schema, standardId, values);
  const blockers = validationFails.filter(f => f.ruleId.startsWith("V") || f.ruleId.startsWith("REQ") || f.ruleId.startsWith("MIN") || f.ruleId.startsWith("MAX"));
  if (blockers.length > 0) {
    throw new Error(`Validation blocked: ${blockers.map(b => b.message).join("; ")}`);
  }

  const standard = schema.standards.find(s => s.id === standardId)!;

  // 2. Compute
  const scope = computeStandard(schema, standardId, values);

  // 3. Decision
  const decision = evaluateDecision(standard.decision, scope);

  // 4. Warnings
  const warnings = evaluateWarnings(standard, scope);

  // 5. FMEA
  const fmeaResult = evaluateFMEA(schema.fmea, scope);

  // 6. GUM uncertainty
  const uncertainty = computeGUM(standard.gum, schema, standardId, values, scope);

  // 7. Input hash
  const inputHash = await hashInput(values);

  return {
    standardId,
    status: decision.status,
    outputs: scope,
    governing: decision.governing,
    uncertainty,
    warnings,
    fmea: fmeaResult.modes,
    fmeaMandatory: fmeaResult.mandatory,
    inputHash,
    timestamp: new Date().toISOString(),
  };
}

/* ══════════════════════════════════════════════════════════════════
 * COMPUTE — Legacy wrapper (synchronous, no GUM, no hashing)
 * ══════════════════════════════════════════════════════════════════ */

export function computeLegacy(
  schema: ToolSchema,
  standardId: string,
  values: Record<string, number>
): ComputeResponse {
  const validationFails = validateSchema(schema, standardId, values);
  const blockers = validationFails.filter(f => f.ruleId.startsWith("V") || f.ruleId.startsWith("REQ") || f.ruleId.startsWith("MIN") || f.ruleId.startsWith("MAX"));
  if (blockers.length > 0) {
    return {
      status: 'BLOCKED',
      outputs: {},
      warnings: blockers.map(b => ({
        id: b.ruleId,
        severity: 'CRITICAL' as Severity,
        message: b.message,
      })),
    };
  }

  const standard = schema.standards.find(s => s.id === standardId)!;
  const scope = computeStandard(schema, standardId, values);
  const decision = evaluateDecision(standard.decision, scope);
  const warnings = evaluateWarnings(standard, scope);

  return {
    status: decision.status,
    outputs: scope,
    warnings,
  };
}

export interface ComputeResponse {
  status: 'PASS' | 'WARN' | 'FAIL' | 'BLOCKED';
  outputs: Record<string, number>;
  warnings: { id: string; severity: Severity; message: string }[];
}
