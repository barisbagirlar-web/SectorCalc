import { describe, expect, it } from "vitest";

import type { ProFormulaModule, ProFormulaResult } from "@/sectorcalc/formulas/pro-v531/pro-formula-contract";
import { getAllModules } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";

function stableResult(result: ProFormulaResult): string {
  return JSON.stringify({
    status: result.status,
    outputs: Object.fromEntries(
      Object.entries(result.outputs).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    ),
    warnings: [...result.warnings].sort(),
  });
}

function perturbations(value: number): number[] {
  const candidates = new Set<number>();
  if (value === 0) {
    candidates.add(1);
    candidates.add(0.1);
  } else if (value > 0 && value <= 1) {
    candidates.add(value === 1 ? 0.9 : Math.min(0.999999, value * 1.1));
    candidates.add(Math.max(0.000001, value * 0.5));
  } else {
    candidates.add(value * 1.1);
    candidates.add(value * 0.9);
    candidates.add(value + 1);
    if (value > 1) candidates.add(value - 1);
  }
  return [...candidates].filter(
    (candidate) => Number.isFinite(candidate) && candidate !== value,
  );
}

function assertInputInfluencesResult(module: ProFormulaModule, key: string): void {
  const baseline = module.calculate({ ...module.sampleInputs });
  expect(baseline.status, `${module.toolKey} sample must execute`).not.toBe("BLOCKED");
  const baselineStable = stableResult(baseline);
  const original = module.sampleInputs[key];
  expect(Number.isFinite(original), `${module.toolKey}:${key} needs a finite sample`).toBe(true);

  let foundValidCandidate = false;
  let changedResult = false;
  for (const candidate of perturbations(original)) {
    const result = module.calculate({
      ...module.sampleInputs,
      [key]: candidate,
    });
    if (result.status === "BLOCKED") continue;
    foundValidCandidate = true;
    if (stableResult(result) !== baselineStable) {
      changedResult = true;
      break;
    }
  }

  expect(
    foundValidCandidate,
    `${module.toolKey}:${key} has no valid nearby perturbation; review its sample/bounds`,
  ).toBe(true);
  expect(
    changedResult,
    `${module.toolKey}:${key} is accepted and billed but has no observable effect on outputs, status or warnings`,
  ).toBe(true);
}

describe("every LIVE PRO input has observable formula influence", () => {
  for (const module of getAllModules()) {
    const requiredInputKeys = module.requiredInputKeys ?? Object.keys(module.sampleInputs);
    for (const key of requiredInputKeys) {
      it(`${module.toolKey}:${key}`, () => {
        assertInputInfluencesResult(module, key);
      });
    }
  }
});
