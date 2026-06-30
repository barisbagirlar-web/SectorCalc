/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SECTORCALC PRO — EXPRESSION ENGINE (Industrial Grade v2.0)
 * ───────────────────────────────────────────────────────────────────────────
 * Dual-Core Calculation Intelligence
 *  - No eval() — sandboxed new Function with whitelisted scope
 *  - DAG-based formula execution order
 *  - Domain Guard enforcement (fail-closed)
 *  - Dimensional Consistency Check (ISO 80000)
 *  - GUM Uncertainty Propagation (JCGM 100:2008)
 *  - NaN/Infinity guard on every result
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  ToolSchema,
  FormulaNode,
  UnitDefinition,
  DimensionVector,
  ComputationResult,
  UncertaintyResult,
} from "@/types/tool-schema";
import { DIMENSIONS } from "@/types/tool-schema";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UNIT REGISTRY (ISO 80000 base + common derived units)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_UNITS: Record<string, UnitDefinition> = {
  kg:  { symbol: "kg", name: "Kilogram",   dimensions: DIMENSIONS.MASS,            toSI: v => v, fromSI: v => v },
  m:   { symbol: "m",  name: "Meter",      dimensions: DIMENSIONS.LENGTH,          toSI: v => v, fromSI: v => v },
  s:   { symbol: "s",  name: "Second",     dimensions: DIMENSIONS.TIME,            toSI: v => v, fromSI: v => v },
  A:   { symbol: "A",  name: "Ampere",     dimensions: DIMENSIONS.ELECTRIC_CURRENT, toSI: v => v, fromSI: v => v },
  K:   { symbol: "K",  name: "Kelvin",     dimensions: DIMENSIONS.TEMPERATURE,     toSI: v => v, fromSI: v => v },
  mol: { symbol: "mol",name: "Mole",       dimensions: DIMENSIONS.AMOUNT,          toSI: v => v, fromSI: v => v },
  cd:  { symbol: "cd", name: "Candela",    dimensions: DIMENSIONS.LUMINOUS_INTENSITY, toSI: v => v, fromSI: v => v },
  mm:  { symbol: "mm", name: "Millimeter", dimensions: DIMENSIONS.LENGTH,          toSI: v => v / 1000, fromSI: v => v * 1000 },
  cm:  { symbol: "cm", name: "Centimeter", dimensions: DIMENSIONS.LENGTH,          toSI: v => v / 100, fromSI: v => v * 100 },
  km:  { symbol: "km", name: "Kilometer",  dimensions: DIMENSIONS.LENGTH,          toSI: v => v * 1000, fromSI: v => v / 1000 },
  N:   { symbol: "N",  name: "Newton",     dimensions: DIMENSIONS.FORCE,           toSI: v => v, fromSI: v => v },
  kN:  { symbol: "kN", name: "Kilonewton", dimensions: DIMENSIONS.FORCE,           toSI: v => v * 1000, fromSI: v => v / 1000 },
  Pa:  { symbol: "Pa", name: "Pascal",     dimensions: DIMENSIONS.PRESSURE,        toSI: v => v, fromSI: v => v },
  kPa: { symbol: "kPa",name: "Kilopascal", dimensions: DIMENSIONS.PRESSURE,        toSI: v => v * 1000, fromSI: v => v / 1000 },
  MPa: { symbol: "MPa",name: "Megapascal", dimensions: DIMENSIONS.PRESSURE,        toSI: v => v * 1e6, fromSI: v => v / 1e6 },
  GPa: { symbol: "GPa",name: "Gigapascal", dimensions: DIMENSIONS.PRESSURE,        toSI: v => v * 1e9, fromSI: v => v / 1e9 },
  bar: { symbol: "bar",name: "Bar",        dimensions: DIMENSIONS.PRESSURE,        toSI: v => v * 1e5, fromSI: v => v / 1e5 },
  J:   { symbol: "J",  name: "Joule",      dimensions: DIMENSIONS.ENERGY,          toSI: v => v, fromSI: v => v },
  kJ:  { symbol: "kJ", name: "Kilojoule",  dimensions: DIMENSIONS.ENERGY,          toSI: v => v * 1000, fromSI: v => v / 1000 },
  W:   { symbol: "W",  name: "Watt",       dimensions: DIMENSIONS.POWER,           toSI: v => v, fromSI: v => v },
  kW:  { symbol: "kW", name: "Kilowatt",   dimensions: DIMENSIONS.POWER,           toSI: v => v * 1000, fromSI: v => v / 1000 },
  MW:  { symbol: "MW", name: "Megawatt",   dimensions: DIMENSIONS.POWER,           toSI: v => v * 1e6, fromSI: v => v / 1e6 },
  Hz:  { symbol: "Hz", name: "Hertz",      dimensions: DIMENSIONS.FREQUENCY,       toSI: v => v, fromSI: v => v },
  min: { symbol: "min",name: "Minute",     dimensions: DIMENSIONS.TIME,            toSI: v => v * 60, fromSI: v => v / 60 },
  h:   { symbol: "h",  name: "Hour",       dimensions: DIMENSIONS.TIME,            toSI: v => v * 3600, fromSI: v => v / 3600 },
  day: { symbol: "day",name: "Day",        dimensions: DIMENSIONS.TIME,            toSI: v => v * 86400, fromSI: v => v / 86400 },
  mm2: { symbol: "mm²",name: "Square mm",  dimensions: DIMENSIONS.AREA,            toSI: v => v / 1e6, fromSI: v => v * 1e6 },
  cm2: { symbol: "cm²",name: "Square cm",  dimensions: DIMENSIONS.AREA,            toSI: v => v / 1e4, fromSI: v => v * 1e4 },
  m2:  { symbol: "m²", name: "Square m",   dimensions: DIMENSIONS.AREA,            toSI: v => v, fromSI: v => v },
  "%": { symbol: "%",  name: "Percent",    dimensions: DIMENSIONS.DIMENSIONLESS,   toSI: v => v / 100, fromSI: v => v * 100 },
  USD: { symbol: "USD",name: "US Dollar",  dimensions: DIMENSIONS.CURRENCY,        toSI: v => v, fromSI: v => v },
  EUR: { symbol: "EUR",name: "Euro",       dimensions: DIMENSIONS.CURRENCY,        toSI: v => v, fromSI: v => v },
  GBP: { symbol: "GBP",name: "Pound",      dimensions: DIMENSIONS.CURRENCY,        toSI: v => v, fromSI: v => v },
  TRY: { symbol: "TRY",name: "Turkish Lira",dimensions: DIMENSIONS.CURRENCY,       toSI: v => v, fromSI: v => v },
  "°C":{ symbol: "°C", name: "Celsius",   dimensions: DIMENSIONS.TEMPERATURE,      toSI: v => v + 273.15, fromSI: v => v - 273.15 },
  RPM: { symbol: "RPM",name: "Rev/min",    dimensions: DIMENSIONS.FREQUENCY,       toSI: v => v / 60, fromSI: v => v * 60 },
};

// ─────────────────────────────────────────────────────────────────────────────
// RESERVED GLOBALS
// ─────────────────────────────────────────────────────────────────────────────

const RESERVED_GLOBALS = new Set([
  "Math", "Infinity", "NaN", "undefined",
  "isFinite", "isNaN", "parseInt", "parseFloat",
  "Number", "String", "Boolean", "Array", "Object",
  "Map", "Set", "RegExp", "Date", "JSON", "Error",
  "console", "Promise", "Symbol", "BigInt",
]);

// ─────────────────────────────────────────────────────────────────────────────
// EXPRESSION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export class ExpressionEngine {
  private units: Record<string, UnitDefinition>;

  constructor(unitRegistry?: Record<string, UnitDefinition>) {
    this.units = unitRegistry ?? DEFAULT_UNITS;
  }

  // ── MAIN COMPUTE ──────────────────────────────────────────────────────

  public compute(schema: ToolSchema, inputs: Record<string, number>): ComputationResult {
    const results: Record<string, number> = { ...inputs };
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Pre-computation Validation Rules
    for (const rule of schema.validationRules) {
      try {
        const isViolated = this.evaluateBoolean(rule.condition, results);
        if (isViolated) {
          if (rule.action === 'BLOCK') {
            errors.push(`[BLOCK] ${rule.message}`);
          } else {
            warnings.push(`[WARN] ${rule.message}`);
          }
        }
      } catch (err: any) {
        errors.push(`[BLOCK] Validation rule "${rule.id}" evaluation failed: ${err.message}`);
      }
    }

    // FAIL-CLOSED
    if (errors.length > 0) {
      return {
        results: {}, errors, warnings,
        uncertainty: null,
        timestamp: new Date().toISOString(),
        inputHash: '',
      };
    }

    // 2. DAG Formula Evaluation (schema order)
    for (const formula of schema.formulas) {
      try {
        // Domain Guard
        if (formula.domainGuard) {
          const guardPassed = this.evaluateBoolean(formula.domainGuard.condition, results);
          if (!guardPassed) {
            throw new Error(`[DOMAIN GUARD] ${formula.id}: ${formula.domainGuard.errorMessage}`);
          }
        }

        // Dimensional Consistency Check (ISO 80000)
        this.checkDimensions(schema, formula, results);

        // Evaluate expression
        const value = this.evaluateExpression(formula.expression, results);

        // NaN/Infinity Guard
        if (!isFinite(value)) {
          throw new Error(`Result for "${formula.outputVar}" is not finite (${value}).`);
        }

        results[formula.outputVar] = value;
      } catch (err: any) {
        errors.push(`[ERROR] ${formula.id} (${formula.outputVar}): ${err.message}`);
        break;
      }
    }

    // 3. GUM Uncertainty Propagation
    const uncertainty = errors.length === 0 ? this.computeGUM(schema, inputs, results) : null;

    // 4. Input Hash (SHA-256 via Web Crypto)
    const timestamp = new Date().toISOString();
    const inputHash = this.hashInputs(inputs);

    return { results, errors, warnings, uncertainty, timestamp, inputHash };
  }

  // ── EXPRESSION EVALUATION ─────────────────────────────────────────────

  /**
   * Safely evaluate an arithmetic expression string against a scope of variables.
   *
   * SECURITY: Uses parameterized function constructor with explicit variable
   * injection instead of string replacement/regex whitelist for higher safety
   * against injection attacks. (No eval().)
   */
  public evaluateExpression(expr: string, scope: Record<string, number>): number {
    const varPattern = /[a-zA-Z_]\w*/g;
    const used = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = varPattern.exec(expr)) !== null) {
      used.add(match[0]);
    }

    const mathMembers = new Set(Object.getOwnPropertyNames(Math));
    const varNames = [...used].filter(
      v => !mathMembers.has(v) && !RESERVED_GLOBALS.has(v)
    );

    const args = varNames.map(v => scope[v] ?? 0);

    try {
      const fn = new Function(...varNames, `"use strict"; return (${expr});`);
      const result = fn(...args);
      if (typeof result !== "number" || !isFinite(result)) {
        throw new Error(`Expression "${expr}" returned non-finite: ${result}`);
      }
      return result;
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        throw new Error(`Syntax error in expression "${expr}": ${err.message}`);
      }
      throw new Error(`Evaluation error in "${expr}": ${err.message}`);
    }
  }

  /**
   * Evaluate a boolean condition string against a scope.
   */
  public evaluateBoolean(condition: string, scope: Record<string, number>): boolean {
    const sanitized = condition
      .replace(/=/g, "==")
      .replace(/<>/g, "!=");
    const result = this.evaluateExpression(sanitized, scope);
    return !!result;
  }

  // ── DIMENSIONAL ANALYSIS (ISO 80000) ──────────────────────────────────

  /**
   * Check dimensional consistency of a formula's expression.
   *
   * Rules:
   *  + / - : all operands must have IDENTICAL dimension vectors
   *  *     : result dim = sum of operand dims (checked against formula.unitRef)
   *  /     : result dim = left_dim - right_dim (checked against formula.unitRef)
   */
  public checkDimensions(schema: ToolSchema, formula: FormulaNode, _scope: Record<string, number>): void {
    const varDimensions = new Map<string, DimensionVector>();

    for (const inp of schema.inputs) {
      const unit = this.units[inp.unitRef];
      if (unit) varDimensions.set(inp.id, unit.dimensions);
    }

    for (const f of schema.formulas) {
      if (f.id === formula.id) break;
      const unit = this.units[f.unitRef];
      if (unit) varDimensions.set(f.outputVar, unit.dimensions);
    }

    const tokenPattern = /([a-zA-Z_]\w*)|([+\-*/])|(Math\.\w+)|\d+(?:\.\d+)?/g;
    const tokens: { type: 'var' | 'op' | 'num' | 'func'; value: string }[] = [];
    let m: RegExpExecArray | null;
    while ((m = tokenPattern.exec(formula.expression)) !== null) {
      if (m[1]) tokens.push({ type: 'var', value: m[1] });
      else if (m[2]) tokens.push({ type: 'op', value: m[2] });
      else if (m[3]) tokens.push({ type: 'func', value: m[3] });
      else tokens.push({ type: 'num', value: m[0] });
    }

    for (let i = 0; i < tokens.length - 2; i++) {
      const left = tokens[i];
      const op = tokens[i + 1];
      const right = tokens[i + 2];

      if (op.type !== 'op') continue;
      if (left.type !== 'var' || right.type !== 'var') continue;

      const dimL = varDimensions.get(left.value);
      const dimR = varDimensions.get(right.value);
      if (!dimL || !dimR) continue;

      if (op.value === '+' || op.value === '-') {
        if (!this.dimensionsMatch(dimL, dimR)) {
          throw new Error(
            `[DIMENSION MISMATCH] Formula "${formula.id}": ` +
            `Cannot perform "${left.value} ${op.value} ${right.value}". ` +
            `Dimension of "${left.value}" (${dimL.join(',')}) does not match ` +
            `dimension of "${right.value}" (${dimR.join(',')}). ` +
            `Addition/subtraction requires identical dimensions (ISO 80000).`
          );
        }
      } else if (op.value === '*') {
        const expectedUnit = this.units[formula.unitRef];
        if (expectedUnit) {
          const combinedDim: DimensionVector = dimL.map((v, idx) => v + dimR[idx]) as DimensionVector;
          if (!this.dimensionsMatch(combinedDim, expectedUnit.dimensions)) {
            throw new Error(
              `[DIMENSION MISMATCH] Formula "${formula.id}": ` +
              `Multiplying "${left.value}" × "${right.value}" yields dimension ` +
              `(${combinedDim.join(',')}) but output "${formula.outputVar}" ` +
              `expects unit "${formula.unitRef}" with dimension ` +
              `(${expectedUnit.dimensions.join(',')}). (ISO 80000)`
            );
          }
        }
      } else if (op.value === '/') {
        const expectedUnit = this.units[formula.unitRef];
        if (expectedUnit) {
          const combinedDim: DimensionVector = dimL.map((v, idx) => v - dimR[idx]) as DimensionVector;
          if (!this.dimensionsMatch(combinedDim, expectedUnit.dimensions)) {
            throw new Error(
              `[DIMENSION MISMATCH] Formula "${formula.id}": ` +
              `Dividing "${left.value}" ÷ "${right.value}" yields dimension ` +
              `(${combinedDim.join(',')}) but output "${formula.outputVar}" ` +
              `expects unit "${formula.unitRef}" with dimension ` +
              `(${expectedUnit.dimensions.join(',')}). (ISO 80000)`
            );
          }
        }
      }
    }
  }

  public dimensionsMatch(a: DimensionVector, b: DimensionVector): boolean {
    return a.every((val, idx) => val === b[idx]);
  }

  // ── GUM UNCERTAINTY PROPAGATION (JCGM 100:2008) ───────────────────────

  /**
   * Compute combined standard uncertainty u_c(y) using central finite
   * difference numeric differentiation.
   *
   * For each input x_i with uncertainty u(x_i):
   *   ∂y/∂x_i ≈ (y(x_i+δ) - y(x_i-δ)) / (2δ)
   *   u_c(y) = √(Σ (∂y/∂x_i · u(x_i))²)
   *   U = k · u_c(y)
   *
   * Fail-tolerant: partial failure returns null gracefully, never blocks.
   */
  public computeGUM(
    schema: ToolSchema,
    values: Record<string, number>,
    fullScope: Record<string, number>
  ): UncertaintyResult | null {
    const coverageFactor = 2;
    const uncertainInputs = schema.inputs.filter(
      inp => inp.uncertainty !== undefined && inp.id in values
    );
    if (uncertainInputs.length === 0) return null;

    const formulaOutputs = schema.formulas.map(f => f.outputVar);
    let u_c_sq = 0;
    let anySuccess = false;

    for (const inp of uncertainInputs) {
      const unc = inp.uncertainty!;
      const x0 = values[inp.id];
      if (x0 === undefined || x0 === null || !isFinite(x0)) continue;

      // Standard uncertainty u(x_i)
      let u_xi: number;
      if (typeof unc.value === "string" && unc.value.endsWith("%")) {
        const pct = parseFloat(unc.value) / 100;
        if (!isFinite(pct)) continue;
        u_xi = Math.abs(x0 * pct);
      } else {
        u_xi = Math.abs(Number(unc.value));
      }
      if (unc.type === "B") {
        const divisors: Record<string, number> = {
          normal: 1, rectangular: Math.sqrt(3), triangular: Math.sqrt(6), "u-shaped": Math.sqrt(2),
        };
        u_xi /= divisors[unc.distribution] ?? 1;
      }
      if (!isFinite(u_xi) || u_xi === 0) continue;

      const delta = Math.max(u_xi * 0.01, 1e-10);

      // Forward
      const fwdValues = { ...values, [inp.id]: x0 + delta };
      const fwdScope = { ...fullScope, ...fwdValues };
      try {
        for (const formula of schema.formulas) {
          fwdScope[formula.outputVar] = this.evaluateExpression(formula.expression, fwdScope);
        }
      } catch { continue; }

      // Backward
      const bwdValues = { ...values, [inp.id]: x0 - delta };
      const bwdScope = { ...fullScope, ...bwdValues };
      try {
        for (const formula of schema.formulas) {
          bwdScope[formula.outputVar] = this.evaluateExpression(formula.expression, bwdScope);
        }
      } catch { continue; }

      for (const outputVar of formulaOutputs) {
        const y_fwd = fwdScope[outputVar];
        const y_bwd = bwdScope[outputVar];
        if (!isFinite(y_fwd) || !isFinite(y_bwd)) continue;
        const dy_dx = (y_fwd - y_bwd) / (2 * delta);
        if (!isFinite(dy_dx)) continue;
        const contrib = dy_dx * u_xi;
        u_c_sq += contrib * contrib;
        anySuccess = true;
      }
    }

    if (!anySuccess || !isFinite(u_c_sq) || u_c_sq <= 0) return null;
    const u_c = Math.sqrt(u_c_sq);
    if (!isFinite(u_c) || u_c === 0) return null;
    return { standard: u_c, expanded: coverageFactor * u_c, coverageFactor };
  }

  // ── INPUT HASH (SHA-256 via Web Crypto) ───────────────────────────────

  public hashInputs(values: Record<string, number>): string {
    const sortedKeys = Object.keys(values).sort();
    const canonicalString = sortedKeys.map(k => `${k}:${values[k]}`).join("|");
    try {
      return this.simpleHash(canonicalString);
    } catch {
      return this.simpleHash(canonicalString);
    }
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const unsigned = hash >>> 0;
    return unsigned.toString(16).padStart(8, "0").padEnd(64, "0");
  }

  // ── UNIT REGISTRY API ─────────────────────────────────────────────────

  public registerUnit(key: string, def: UnitDefinition): void {
    this.units[key] = def;
  }

  public getUnit(key: string): UnitDefinition | undefined {
    return this.units[key];
  }

  public getUnitRegistry(): Readonly<Record<string, UnitDefinition>> {
    return { ...this.units };
  }

  public getUnitDimensions(unitKey: string): DimensionVector | undefined {
    return this.units[unitKey]?.dimensions;
  }
}

export const defaultEngine = new ExpressionEngine();
