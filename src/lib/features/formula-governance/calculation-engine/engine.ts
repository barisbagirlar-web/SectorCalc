/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CALCULATION ENGINE (v3 - Full Industrial 2‑Phase Validation)
 * ═══════════════════════════════════════════════════════════════════════════
 * • Topological sort of the formula DAG (with cycle detection)
 * • 2‑phase validation:
 *     Phase 1 (pre‑compute): input‑only rules → block if violated
 *     Phase 2 (post‑compute): output‑only rules → block if violated
 * • Fail‑closed: any BLOCK, domain‑guard failure, or non‑finite = no results
 * • Input unit conversion to canonical units
 * • Real GUM uncertainty (ISO/IEC Guide 98‑3) via central finite difference
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  ToolSchema, ComputeResult, UncertaintyResult, Uncertainty, ValidationRule,
} from './types';
import { compileSafe, dependencies, type ValidationContext } from './safe-expr';
import { toCanonical } from './units';

function standardUncertainty(u: Uncertainty, value: number): number {
  const half = u.relative ? Math.abs(value) * u.value : u.value;
  switch (u.distribution) {
    case 'normal': return half;
    case 'rectangular': return half / Math.sqrt(3);
    case 'triangular': return half / Math.sqrt(6);
    default: return half;
  }
}

interface Prepared {
  schema: ToolSchema;
  ctx: ValidationContext;
  order: string[];
  inputIds: Set<string>;
  /** Pre‑compiled pre‑validation rules */
  preRules: { compiled: ReturnType<typeof compileSafe>; rule: ValidationRule }[];
  /** Pre‑compiled post‑validation rules */
  postRules: { compiled: ReturnType<typeof compileSafe>; rule: ValidationRule }[];
}

export function prepare(schema: ToolSchema): Prepared {
  const inputIds = new Set(schema.inputs.map((i) => i.id));
  const outputIds = schema.formulas.map((f) => f.outputVar);
  const knownVars = new Set<string>([...inputIds, ...outputIds]);
  const ctx: ValidationContext = { knownVars };

  // Validate all formula and domain-guard expressions
  for (const f of schema.formulas) {
    compileSafe(f.expression, ctx);
    if (f.domainGuard) compileSafe(f.domainGuard.condition, ctx);
  }

  // Use preValidationRules / postValidationRules (fallback to legacy validationRules)
  const allRules = schema.preValidationRules || schema.validationRules || [];
  const preRules: Prepared['preRules'] = [];
  const postRules: Prepared['postRules'] = [];

  // Compile pre‑rules
  const preRaw = schema.preValidationRules || [];
  for (const r of allRules) {
    // Legacy mode: all rules treated as pre if no postValidationRules
    const compiled = compileSafe(r.condition, ctx);
    preRules.push({ compiled, rule: r });
  }

  // Compile post‑rules separately
  const postRaw = schema.postValidationRules || [];
  for (const r of postRaw) {
    const compiled = compileSafe(r.condition, ctx);
    postRules.push({ compiled, rule: r });
  }

  // Topological sort - track deps by formula ID (handles duplicate output vars)
  const outToFormula = new Map(schema.formulas.map((f) => [f.outputVar, f]));
  const depsById = new Map<string, Set<string>>();
  for (const f of schema.formulas) {
    const rawDeps = dependencies(f.expression, ctx);
    // Filter to only include vars that have a producing formula
    const d = new Set(rawDeps.filter((v) => outToFormula.has(v)));
    depsById.set(f.id, d);
  }
  // Track resolved formulas by ID
  const order: string[] = [];
  const resolvedIds = new Set<string>();
  const resolvedVars = new Set<string>();
  let progress = true;
  while (resolvedIds.size < schema.formulas.length && progress) {
    progress = false;
    for (const f of schema.formulas) {
      if (resolvedIds.has(f.id)) continue;
      const d = depsById.get(f.id)!;
      if ([...d].every((x) => resolvedVars.has(x))) {
        resolvedIds.add(f.id);
        if (!resolvedVars.has(f.outputVar)) {
          resolvedVars.add(f.outputVar);
        }
        order.push(f.id);
        progress = true;
      }
    }
  }
  if (resolvedIds.size < schema.formulas.length) {
    const stuck = schema.formulas.filter((f) => !resolvedIds.has(f.id)).map((f) => f.id);
    throw new Error(`Cyclic or unresolved formula dependency: ${stuck.join(', ')}`);
  }

  return { schema, ctx, order, inputIds, preRules, postRules };
}

function toCanonicalScope(schema: ToolSchema, raw: Record<string, number>): Record<string, number> {
  const scope: Record<string, number> = {};
  for (const inp of schema.inputs) {
    let v = raw[inp.id];
    if (v === undefined || v === null || Number.isNaN(v)) {
      if (inp.defaultValue !== undefined) v = inp.defaultValue;
    }
    if (v === undefined || v === null || Number.isNaN(v)) continue;
    scope[inp.id] = toCanonical(v, inp.unit);
  }
  return scope;
}

function evaluatePipeline(
  prep: Prepared,
  canonicalScope: Record<string, number>
): { results: Record<string, number> } | { blocked: string } {
  const { schema, ctx, order } = prep;
  const scope: Record<string, number> = { ...canonicalScope };
  const byId = new Map(schema.formulas.map((f) => [f.id, f]));

  for (const fid of order) {
    const f = byId.get(fid)!;
    const compiled = compileSafe(f.expression, ctx);
    let val: number;
    try {
      val = compiled.eval(scope);
    } catch (e: any) {
      return { blocked: `${f.id}: ${e.message}` };
    }
    scope[f.outputVar] = val;
    if (f.domainGuard) {
      const guard = compileSafe(f.domainGuard.condition, ctx);
      if (!guard.evalBool(scope)) return { blocked: f.domainGuard.errorMessage };
    }
  }
  return { results: scope };
}

function propagateUncertainty(
  prep: Prepared,
  rawInputs: Record<string, number>,
  baseResults: Record<string, number>
): UncertaintyResult | undefined {
  const { schema } = prep;
  if (!schema.gum) return undefined;
  const measurand = schema.gum.measurand;
  const k = schema.gum.coverageFactor ?? 2;
  const y0 = baseResults[measurand];
  if (y0 === undefined) return undefined;

  const contributions: { input: string; uShare: number; percent: number }[] = [];
  let variance = 0;

  for (const inp of schema.inputs) {
    if (!inp.uncertainty) continue;
    const xRaw = rawInputs[inp.id] ?? inp.defaultValue;
    if (xRaw === undefined || Number.isNaN(xRaw)) continue;

    const uStdRaw = standardUncertainty(inp.uncertainty, xRaw);
    const xCanon = toCanonical(xRaw, inp.unit);
    const uStd = Math.abs(toCanonical(xRaw + uStdRaw, inp.unit) - xCanon);

    const h = uStd > 0 ? uStd : Math.max(1e-6 * Math.abs(xCanon), 1e-9);

    const base = toCanonicalScope(schema, rawInputs);
    const plus = { ...base, [inp.id]: base[inp.id] + h };
    const minus = { ...base, [inp.id]: base[inp.id] - h };

    const rp = evaluatePipeline(prep, plus);
    const rm = evaluatePipeline(prep, minus);
    if ('blocked' in rp || 'blocked' in rm) continue;

    const yPlus = (rp as any).results[measurand];
    const yMinus = (rm as any).results[measurand];
    const sensitivity = (yPlus - yMinus) / (2 * h);
    const uContrib = sensitivity * uStd;
    variance += uContrib * uContrib;
    contributions.push({ input: inp.id, uShare: Math.abs(uContrib), percent: 0 });
  }

  const u_c = Math.sqrt(variance);
  for (const c of contributions) {
    c.percent = variance > 0 ? (c.uShare * c.uShare) / variance * 100 : 0;
  }
  contributions.sort((a, b) => b.percent - a.percent);

  return { measurand, value: y0, u_c, U: k * u_c, k, contributions };
}

/**
 * Run a set of compiled validation rules against a scope.
 * Returns blocked rules as errors and WARN rules as warnings.
 */
function runValidation(
  rules: Prepared['preRules'],
  scope: Record<string, number>,
  errors: { code: string; message: string }[],
  warnings: { code: string; message: string }[],
): void {
  for (const { compiled, rule } of rules) {
    let ok: boolean;
    try { ok = compiled.evalBool(scope); }
    catch { ok = false; }
    if (!ok) {
      if (rule.action === 'BLOCK') errors.push({ code: rule.id, message: rule.message });
      else warnings.push({ code: rule.id, message: rule.message });
    }
  }
}

export function compute(prep: Prepared, rawInputs: Record<string, number>): ComputeResult {
  const { schema, order } = prep;
  const errors: ComputeResult['errors'] = [];
  const warnings: ComputeResult['warnings'] = [];

  // ── Range / missing checks ─────────────────────────────────────────
  for (const inp of schema.inputs) {
    const v = rawInputs[inp.id] ?? inp.defaultValue;
    if (inp.required && (v === undefined || v === null || Number.isNaN(v))) {
      errors.push({ code: 'MISSING_INPUT', message: `Required input missing: ${inp.label} (${inp.symbol})` });
      continue;
    }
    if (v !== undefined && !Number.isNaN(v)) {
      if (inp.min !== undefined && v < inp.min) errors.push({ code: 'RANGE', message: `${inp.label} below minimum (${inp.min} ${inp.unit})` });
      if (inp.max !== undefined && v > inp.max) errors.push({ code: 'RANGE', message: `${inp.label} above maximum (${inp.max} ${inp.unit})` });
    }
  }
  if (errors.length) return { ok: false, results: {}, order, errors, warnings };

  const canonicalScope = toCanonicalScope(schema, rawInputs);

  // ── PHASE 1: Pre‑compute validation (input‑only rules) ─────────────
  runValidation(prep.preRules, canonicalScope, errors, warnings);
  if (errors.length) return { ok: false, results: {}, order, errors, warnings };

  // ── Compute pipeline ───────────────────────────────────────────────
  const piped = evaluatePipeline(prep, canonicalScope);
  if ('blocked' in piped) {
    errors.push({ code: 'DOMAIN_GUARD', message: piped.blocked });
    return { ok: false, results: {}, order, errors, warnings };
  }

  const fullScope = piped.results;

  // ── PHASE 2: Post‑compute validation (output‑only rules) ───────────
  runValidation(prep.postRules, fullScope, errors, warnings);
  if (errors.length) return { ok: false, results: fullScope, order, errors, warnings };

  // ── GUM uncertainty ────────────────────────────────────────────────
  const uncertainty = propagateUncertainty(prep, rawInputs, fullScope);

  return { ok: true, results: fullScope, order, errors, warnings, uncertainty };
}
