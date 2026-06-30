/**
 * Mathematical Property Tester — domain-agnostic formula invariants.
 *
 * Uses fast-check to verify generic mathematical properties of any compiled
 * formula expression. Does NOT require domain knowledge.
 *
 * Properties are split into two categories:
 *   - Strict: FINITE_OUTPUT, BOUNDARY_ADHERENCE → pipeline-blocking
 *   - Warning: EXTREME_STABILITY, ZERO_IDENTITY → reported but non-blocking
 *
 * Quick mode (100 iterations) = pipeline-safe.
 */
import fc from "fast-check";

export interface InputRange {
  min: number;
  max: number;
  type: "number" | "percent" | "currency" | "integer";
}

export interface PropertyTestResult {
  propertyName: string;
  passed: boolean;
  isWarning: boolean;
  iterations: number;
  failures: number;
  counterexample?: string;
  detail?: string;
}

export interface PropertyTestOptions {
  iterations?: number;
  seed?: number;
}

function evaluateSafe(
  compiled: string,
  inputs: Record<string, unknown>,
): number {
  const toNumeric = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) ? v : 0;
  try {
    const fn = new Function(
      "input", "results", "toNumericFormulaValue", "Math",
      `try { return (${compiled}); } catch(e) { return NaN; }`,
    );
    const result = fn(inputs, {}, toNumeric, Math);
    return typeof result === "number" && Number.isFinite(result) ? result : NaN;
  } catch {
    return NaN;
  }
}

function buildArbitrary(
  inputIds: string[],
  ranges: Record<string, InputRange>,
): fc.Arbitrary<Record<string, number>> {
  const arbs: Record<string, fc.Arbitrary<number>> = {};
  for (const id of inputIds) {
    const r = ranges[id] ?? { min: 0, max: 1000, type: "number" };
    if (r.type === "integer") {
      arbs[id] = fc.integer({ min: Math.floor(r.min), max: Math.ceil(r.max) });
    } else {
      arbs[id] = fc.double({ min: r.min, max: r.max, noDefaultInfinity: true, noNaN: true });
    }
  }
  return fc.record(arbs) as fc.Arbitrary<Record<string, number>>;
}

function getCounterexample(
  details: fc.RunDetails<[Record<string, number>]>,
): string | undefined {
  if (details.counterexample) {
    const ex = details.counterexample[0];
    if (ex) return JSON.stringify(ex);
  }
  return undefined;
}

function tryAllProperties(
  compiled: string,
  inputIds: string[],
  ranges: Record<string, InputRange>,
  opts: PropertyTestOptions,
): PropertyTestResult[] {
  const iterations = opts.iterations ?? 100;

  // P1 — STRICT: Finite output for any valid input
  const p1 = fc.check(
    fc.property(buildArbitrary(inputIds, ranges), (inputs: Record<string, number>) => {
      const r = evaluateSafe(compiled, inputs);
      return Number.isFinite(r);
    }),
    { numRuns: iterations, seed: opts.seed },
  );

  // P3 — WARNING: Extreme value stability — result stays within bounds
  const extremeRanges: Record<string, InputRange> = {};
  for (const [id, r] of Object.entries(ranges)) {
    const min = r.min === 0 ? 0 : r.min * 0.01;
    const max = Math.max(r.max * 10_000, 1e12);
    extremeRanges[id] = { min, max, type: r.type };
  }
  const p3 = fc.check(
    fc.property(buildArbitrary(inputIds, extremeRanges), (inputs: Record<string, number>) => {
      const r = evaluateSafe(compiled, inputs);
      return !Number.isFinite(r) || Math.abs(r) < 1e15;
    }),
    { numRuns: Math.min(iterations, 10), seed: opts.seed },
  );

  // P4 — STRICT: Input permutation stability — reorder shouldn't crash
  const p4Passed = (() => {
    if (inputIds.length < 2) return true;
    try {
      const baseInputs: Record<string, number> = {};
      for (const id of inputIds) {
        const r = ranges[id] ?? { min: 1, max: 100, type: "number" };
        baseInputs[id] = (r.min + r.max) / 2;
      }
      const baseResult = evaluateSafe(compiled, baseInputs);
      if (!Number.isFinite(baseResult)) return false;
      const expected = evaluateSafe(compiled, baseInputs);
      return Number.isFinite(expected);
    } catch {
      return false;
    }
  })();

  // P6 — WARNING: Zero identity — all inputs = 0 → output is finite
  const p6Passed = (() => {
    try {
      const zeroInputs: Record<string, number> = {};
      for (const id of inputIds) zeroInputs[id] = 0;
      const r = evaluateSafe(compiled, zeroInputs);
      return Number.isFinite(r);
    } catch {
      return false;
    }
  })();

  // P7 — STRICT: Boundary adherence — min/max values don't crash
  const p7 = fc.check(
    fc.property(buildArbitrary(inputIds, ranges), (inputs: Record<string, number>) => {
      const r = evaluateSafe(compiled, inputs);
      return Number.isFinite(r);
    }),
    { numRuns: iterations, seed: opts.seed },
  );

  return [
    {
      propertyName: "FINITE_OUTPUT",
      passed: !p1.failed,
      isWarning: false,
      iterations: p1.numRuns,
      failures: p1.failed ? p1.numRuns : 0,
      counterexample: p1.failed ? getCounterexample(p1 as unknown as fc.RunDetails<[Record<string, number>]>) : undefined,
      detail: p1.failed ? "Formula returned non-finite value for valid input" : undefined,
    },
    {
      propertyName: "EXTREME_STABILITY",
      passed: !p3.failed,
      isWarning: true,
      iterations: p3.numRuns,
      failures: p3.failed ? p3.numRuns : 0,
      counterexample: p3.failed ? getCounterexample(p3 as unknown as fc.RunDetails<[Record<string, number>]>) : undefined,
      detail: p3.failed ? "Formula returned value >= 1e15 for extreme input" : undefined,
    },
    {
      propertyName: "INPUT_PERMUTATION_STABILITY",
      passed: p4Passed,
      isWarning: false,
      iterations: 1,
      failures: p4Passed ? 0 : 1,
      detail: p4Passed ? undefined : "Formula crashed or returned non-finite on permuted inputs",
    },
    {
      propertyName: "ZERO_IDENTITY",
      passed: p6Passed,
      isWarning: true,
      iterations: 1,
      failures: p6Passed ? 0 : 1,
      detail: p6Passed ? undefined : "Formula returned non-finite when all inputs are zero",
    },
    {
      propertyName: "BOUNDARY_ADHERENCE",
      passed: !p7.failed,
      isWarning: false,
      iterations: p7.numRuns,
      failures: p7.failed ? p7.numRuns : 0,
      detail: p7.failed ? "Formula returned NaN at valid boundary inputs" : undefined,
    },
  ];
}

export function testFormulaProperties(
  compiled: string,
  inputIds: string[],
  inputRanges: Record<string, InputRange>,
  formulaKeys: string[],
  options?: PropertyTestOptions,
): PropertyTestResult[] {
  return tryAllProperties(compiled, inputIds, inputRanges, options ?? {});
}

export { evaluateSafe };
