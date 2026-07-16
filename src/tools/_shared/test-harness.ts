// SectorCalc — 4-Layer Test Harness V5.4
// Template for every PRO tool's engine.test.ts.
// All 4 layers are mandatory — no tool enters main without all passing.
//
// Layer 1 — Closed-form: hand-verified textbook scenarios
// Layer 2 — Edge/degenerate: zero, negative, extreme, NaN guards
// Layer 3 — Semantic: insight rule firing conditions, mutex checks
// Layer 4 — Integration: Playwright E2E (syntax, render, unit change, report)

import type { DomainKey } from "../_shared/units";
import { toCanonical, fromCanonical } from "../_shared/units";
import { isFiniteNumber } from "../_shared/engine-kit";

// ── Closed-form verification ───────────────────────────────────────────────

export interface TextbookScenario {
  name: string;
  inputs: Record<string, number>;
  expected: Record<string, number>;
  tolerance?: number; // relative tolerance for float comparison; default 1e-9
}

/**
 * Verify textbook scenarios against the engine.
 * Each scenario is a hand-calculated case (pen-and-paper math).
 */
export function verifyClosedForm(
  engineFn: (inputs: Record<string, number>) => Record<string, number>,
  scenarios: TextbookScenario[]
): string[] {
  const failures: string[] = [];
  for (const sc of scenarios) {
    const tol = sc.tolerance ?? 1e-9;
    const result = engineFn(sc.inputs);
    for (const [key, expected] of Object.entries(sc.expected)) {
      if (!(key in result)) {
        failures.push(`[${sc.name}] Missing output key "${key}"`);
        continue;
      }
      const actual = result[key];
      if (!isFiniteNumber(actual)) {
        failures.push(`[${sc.name}] Output "${key}" is not finite: ${actual}`);
        continue;
      }
      const absErr = Math.abs(actual - expected);
      const relErr = expected !== 0 ? absErr / Math.abs(expected) : absErr;
      if (relErr > tol && absErr > tol) {
        failures.push(
          `[${sc.name}] Output "${key}": expected ${expected}, got ${actual} (relErr=${relErr})`
        );
      }
    }
  }
  return failures;
}

// ── Edge-case generation ───────────────────────────────────────────────────

export interface EdgeCaseTest {
  name: string;
  inputs: Record<string, number>;
  checks: Array<{
    key: string;
    /** If set, value must be finite. If set to number, value must equal. */
    mustBeFinite?: boolean;
    mustEqual?: number;
    mustNotBeNaN?: boolean;
    mustNotBeInfinity?: boolean;
  }>;
}

/**
 * Run edge-case tests against the engine.
 * Verifies that degenerate inputs produce finite outputs (not NaN/Infinity).
 */
export function verifyEdgeCases(
  engineFn: (inputs: Record<string, number>) => Record<string, number>,
  tests: EdgeCaseTest[]
): string[] {
  const failures: string[] = [];
  for (const t of tests) {
    let result: Record<string, number>;
    try {
      result = engineFn(t.inputs);
    } catch (e) {
      failures.push(`[${t.name}] Engine threw: ${e}`);
      continue;
    }
    for (const check of t.checks) {
      const val = result[check.key];
      if (check.mustBeFinite && !isFiniteNumber(val)) {
        failures.push(`[${t.name}] Output "${check.key}" must be finite, got ${val}`);
      }
      if (check.mustNotBeNaN && (val === undefined || (typeof val === "number" && isNaN(val)))) {
        failures.push(`[${t.name}] Output "${check.key}" must not be NaN`);
      }
      if (check.mustNotBeInfinity && val !== undefined && val === Infinity) {
        failures.push(`[${t.name}] Output "${check.key}" must not be Infinity`);
      }
      if (check.mustEqual !== undefined && val !== check.mustEqual) {
        failures.push(
          `[${t.name}] Output "${check.key}" must equal ${check.mustEqual}, got ${val}`
        );
      }
    }
  }
  return failures;
}

// ── Semantic / Insight verification ────────────────────────────────────────

export interface InsightRule {
  name: string;
  /** Returns true if the insight should fire for this result. */
  condition: (outputs: Record<string, number>, inputs: Record<string, number>) => boolean;
}

export interface SemanticTest {
  name: string;
  inputs: Record<string, number>;
  /** Insight names that MUST fire for this test. */
  mustFire: string[];
  /** Insight names that MUST NOT fire for this test. */
  mustNotFire: string[];
}

/**
 * Verify that insight rules fire only in their intended scenarios.
 * Includes mutual exclusion checks for competing rules.
 */
export function verifySemantic(
  engineFn: (inputs: Record<string, number>) => Record<string, number>,
  rules: InsightRule[],
  tests: SemanticTest[]
): string[] {
  const failures: string[] = [];
  for (const t of tests) {
    const result = engineFn(t.inputs);
    for (const rule of rules) {
      const fired = rule.condition(result, t.inputs);
      if (t.mustFire.includes(rule.name) && !fired) {
        failures.push(`[${t.name}] Rule "${rule.name}" should fire but did not`);
      }
      if (t.mustNotFire.includes(rule.name) && fired) {
        failures.push(`[${t.name}] Rule "${rule.name}" should NOT fire but did`);
      }
    }
  }
  return failures;
}

// ── Round-trip verification ────────────────────────────────────────────────

export function verifyUnitRoundTrip(domain: DomainKey): string[] {
  const failures: string[] = [];
  const domainObj = UNITS[domain]; // imported from units
  for (const entry of domainObj.list) {
    for (const testVal of [0, 1, 100, 0.001, 1e6, -1]) {
      const canon = toCanonical(domain, testVal, entry.c);
      const back = fromCanonical(domain, canon, entry.c);
      const absErr = Math.abs(back - testVal);
      if (absErr > 1e-12) {
        failures.push(
          `[${entry.c}] Round-trip failed for ${testVal}: got ${back} (err=${absErr})`
        );
      }
    }
  }
  return failures;
}

// Need this import for verifyUnitRoundTrip
import { UNITS } from "../_shared/units";
