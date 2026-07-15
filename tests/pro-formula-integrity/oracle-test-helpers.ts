import { expect } from "vitest";

export interface FormulaResult {
  status: "OK" | "REVIEW" | "BLOCKED";
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
}

export function output(result: FormulaResult, id: string): number {
  const value = result.outputs[id];
  expect(Number.isFinite(value), `${id} must be finite`).toBe(true);
  return value;
}

export function expectClose(
  result: FormulaResult,
  id: string,
  expected: number,
  precision = 6,
): void {
  expect(output(result, id), id).toBeCloseTo(expected, precision);
}
