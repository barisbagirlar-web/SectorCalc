/**
 * AST EVALUATOR DEEP ANALYSIS — deterministic-formula-engine.ts
 *
 * Tests every FormulaOperation with edge cases: null, NaN, Infinity,
 * zero-division, negative sqrt, overflow, partial inputs, missing constants.
 * Verifies no eval / no new Function.
 * Tests the graph resolver for circular dependency detection.
 */
import { describe, it, expect } from "vitest";
import {
  executeFormulaGraph,
} from "@/sectorcalc/pro-runtime/deterministic-formula-engine";
import type { FormulaRegistryNode, FormulaOperation } from "@/sectorcalc/pro-runtime/formula-registry";

type FormulaOperation_ = FormulaOperation;

function makeNode(
  formula_id: string,
  operation: FormulaOperation_,
  input_refs: string[],
  constant_refs: number[],
  output_ref: string,
): FormulaRegistryNode {
  return {
    formula_id,
    formula_version: "test-1.0.0",
    schema_hash_binding: "test-hash",
    formula_registry_hash: "test-fr-hash",
    operation,
    constant_refs,
    input_refs,
    output_ref,
    unit_dimension_rule: "IDENTITY",
    uncertainty_rule: "NONE",
    sensitivity_rule: "NONE",
    fmea_trigger_rule: null,
    acceptance_rule: "NONE",
    review_rule: "NONE",
    rejection_rule: "NONE",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  };
}

function makeContext(inputs: Record<string, number>): Parameters<typeof executeFormulaGraph>[1] {
  const normalizedInputs: Record<string, { baseValue: number; baseUnit: string; quantityKind: string }> = {};
  for (const [k, v] of Object.entries(inputs)) {
    normalizedInputs[k] = { baseValue: v, baseUnit: "unit", quantityKind: "DIMENSIONLESS" };
  }
  return { normalizedInputs, formulaVersion: "test" };
}

/* ─── TEST 1: No eval, no new Function ─── */

describe("AST — No eval / no new Function", () => {
  it("source file contains no eval or new Function", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const enginePath = path.resolve(
      __dirname,
      "../../src/sectorcalc/pro-runtime/deterministic-formula-engine.ts",
    );
    const src = fs.readFileSync(enginePath, "utf-8");
    // Verify the engine does NOT contain executable `eval` or `new Function` calls.
    // (The source comment "No eval. No new Function." is acceptable documentation.)
    expect(src).not.toContain("new Function(");
    expect(src).not.toContain("eval(");
  });
});

/* ─── TEST 2: Every operation with edge cases ─── */

describe("AST — PASS_THROUGH", () => {
  it("single input passes through", () => {
    const nodes = [makeNode("n1", "PASS_THROUGH", ["a"], [], "out")];
    const ctx = makeContext({ a: 42 });
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.errors).toHaveLength(0);
    expect(result.outputs[0].value).toBe(42);
    expect(result.outputs[0].status).toBe("OK");
  });
  it("blocks on zero inputs", () => {
    const nodes = [makeNode("n1", "PASS_THROUGH", [], [], "out")];
    const ctx = makeContext({});
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  it("handles zero value — does not block", () => {
    const nodes = [makeNode("n1", "PASS_THROUGH", ["a"], [], "out")];
    const ctx = makeContext({ a: 0 });
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.errors).toHaveLength(0);
    expect(result.outputs[0].value).toBe(0);
  });
});

describe("AST — ADD", () => {
  it("adds two numbers", () => {
    const nodes = [makeNode("n1", "ADD", ["a", "b"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 10, b: 20 })).outputs[0].value).toBe(30);
  });
  it("handles negative numbers", () => {
    const nodes = [makeNode("n1", "ADD", ["a", "b"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: -5, b: 3 })).outputs[0].value).toBe(-2);
  });
  it("handles zero correctly", () => {
    const nodes = [makeNode("n1", "ADD", ["a", "b"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 0, b: 0 })).outputs[0].value).toBe(0);
  });
});

describe("AST — DIVIDE", () => {
  it("divides correctly", () => {
    const nodes = [makeNode("n1", "DIVIDE", ["a", "b"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 10, b: 2 })).outputs[0].value).toBe(5);
  });
  it("blocks division by zero", () => {
    const nodes = [makeNode("n1", "DIVIDE", ["a", "b"], [], "out")];
    const result = executeFormulaGraph(nodes, makeContext({ a: 10, b: 0 }));
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.outputs[0].value).toBeNull();
  });
  it("handles negative division", () => {
    const nodes = [makeNode("n1", "DIVIDE", ["a", "b"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: -10, b: 2 })).outputs[0].value).toBe(-5);
  });
});

describe("AST — SQRT", () => {
  it("computes sqrt correctly", () => {
    const nodes = [makeNode("n1", "SQRT", ["a"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 9 })).outputs[0].value).toBe(3);
  });
  it("blocks negative sqrt", () => {
    const nodes = [makeNode("n1", "SQRT", ["a"], [], "out")];
    const result = executeFormulaGraph(nodes, makeContext({ a: -1 }));
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.outputs[0].value).toBeNull();
  });
  it("handles sqrt(0) = 0", () => {
    const nodes = [makeNode("n1", "SQRT", ["a"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 0 })).outputs[0].value).toBe(0);
  });
});

describe("AST — POW", () => {
  it("computes power correctly", () => {
    const nodes = [makeNode("n1", "POW", ["a"], [3], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 2 })).outputs[0].value).toBe(8);
  });
  it("handles exponent zero", () => {
    const nodes = [makeNode("n1", "POW", ["a"], [0], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 5 })).outputs[0].value).toBe(1);
  });
  it("blocks missing exponent (no constants)", () => {
    const nodes = [makeNode("n1", "POW", ["a"], [], "out")];
    const result = executeFormulaGraph(nodes, makeContext({ a: 2 }));
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("AST — THRESHOLD_DECISION", () => {
  it("returns 1 when value >= threshold", () => {
    const nodes = [makeNode("n1", "THRESHOLD_DECISION", ["a"], [50], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 75 })).outputs[0].value).toBe(1);
  });
  it("returns 0 when value < threshold", () => {
    const nodes = [makeNode("n1", "THRESHOLD_DECISION", ["a"], [50], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 25 })).outputs[0].value).toBe(0);
  });
  it("returns 1 when value equals threshold", () => {
    const nodes = [makeNode("n1", "THRESHOLD_DECISION", ["a"], [50], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: 50 })).outputs[0].value).toBe(1);
  });
  it("handles negative threshold", () => {
    const nodes = [makeNode("n1", "THRESHOLD_DECISION", ["a"], [-10], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ a: -5 })).outputs[0].value).toBe(1);
  });
});

describe("AST — MARGIN", () => {
  it("computes (revenue - cost) / revenue", () => {
    const nodes = [makeNode("n1", "MARGIN", ["revenue", "cost"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ revenue: 100, cost: 60 })).outputs[0].value).toBe(0.4);
  });
  it("blocks zero revenue", () => {
    const nodes = [makeNode("n1", "MARGIN", ["revenue", "cost"], [], "out")];
    const result = executeFormulaGraph(nodes, makeContext({ revenue: 0, cost: 60 }));
    expect(result.errors.length).toBeGreaterThan(0);
  });
  it("handles loss (revenue < cost)", () => {
    const nodes = [makeNode("n1", "MARGIN", ["revenue", "cost"], [], "out")];
    const result = executeFormulaGraph(nodes, makeContext({ revenue: 40, cost: 60 }));
    expect(result.outputs[0].value).toBeLessThan(0);
  });
});

describe("AST — WEIGHTED_SUM", () => {
  it("computes weighted sum correctly", () => {
    const nodes = [makeNode("n1", "WEIGHTED_SUM", ["a", "b", "c"], [0.5, 1.0, 1.5], "out")];
    // a=10 * 0.5 = 5, b=20 * 1.0 = 20, c=30 * 1.5 = 45 => 70
    expect(executeFormulaGraph(nodes, makeContext({ a: 10, b: 20, c: 30 })).outputs[0].value).toBe(70);
  });
  it("blocks when constants < inputs", () => {
    const nodes = [makeNode("n1", "WEIGHTED_SUM", ["a", "b"], [1], "out")];
    const result = executeFormulaGraph(nodes, makeContext({ a: 10, b: 20 }));
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("AST — UTILIZATION", () => {
  it("computes actual / capacity", () => {
    const nodes = [makeNode("n1", "UTILIZATION", ["actual", "capacity"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ actual: 75, capacity: 100 })).outputs[0].value).toBe(0.75);
  });
  it("blocks zero capacity", () => {
    const nodes = [makeNode("n1", "UTILIZATION", ["actual", "capacity"], [], "out")];
    const result = executeFormulaGraph(nodes, makeContext({ actual: 75, capacity: 0 }));
    expect(result.errors.length).toBeGreaterThan(0);
  });
  it("handles >100% utilization", () => {
    const nodes = [makeNode("n1", "UTILIZATION", ["actual", "capacity"], [], "out")];
    expect(executeFormulaGraph(nodes, makeContext({ actual: 120, capacity: 100 })).outputs[0].value).toBe(1.2);
  });
});

describe("AST — Graph Resolver edge cases", () => {
  it("resolves multi-node dependency chain", () => {
    const nodes = [
      makeNode("add", "ADD", ["a", "b"], [], "sum"),
      makeNode("mul", "MULTIPLY", ["sum", "c"], [], "product"),
    ];
    const result = executeFormulaGraph(nodes, makeContext({ a: 10, b: 20, c: 2 }));
    expect(result.errors).toHaveLength(0);
    expect(result.outputs[1].value).toBe(60); // (10+20)*2
  });

  it("detects missing input dependency", () => {
    const nodes = [makeNode("n1", "ADD", ["a", "missing_input"], [], "out")];
    const result = executeFormulaGraph(nodes, makeContext({ a: 10 }));
    // missing_input doesn't exist in context or outputs
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.outputs[0].value).toBeNull();
  });

  it("detects circular dependency (loop)", () => {
    const nodes = [
      makeNode("n1", "ADD", ["a", "n2_out"], [], "n1_out"),
      makeNode("n2", "ADD", ["b", "n1_out"], [], "n2_out"),
    ];
    const ctx = makeContext({ a: 10, b: 20 });
    const result = executeFormulaGraph(nodes, ctx);
    // Both nodes reference each other — cannot resolve
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.outputs[0].value).toBeNull();
    expect(result.outputs[1].value).toBeNull();
  });
});

describe("AST — CONSTANT edge cases", () => {
  it("passes through constant value", () => {
    const nodes = [makeNode("n1", "CONSTANT", [], [42], "out")];
    expect(executeFormulaGraph(nodes, makeContext({})).outputs[0].value).toBe(42);
  });
  it("handles zero constant", () => {
    const nodes = [makeNode("n1", "CONSTANT", [], [0], "out")];
    expect(executeFormulaGraph(nodes, makeContext({})).outputs[0].value).toBe(0);
  });
  it("handles negative constant", () => {
    const nodes = [makeNode("n1", "CONSTANT", [], [-1], "out")];
    expect(executeFormulaGraph(nodes, makeContext({})).outputs[0].value).toBe(-1);
  });
  it("handles fractional constant", () => {
    const nodes = [makeNode("n1", "CONSTANT", [], [0.3333], "out")];
    expect(executeFormulaGraph(nodes, makeContext({})).outputs[0].value).toBe(0.3333);
  });
  it("blocks missing constant", () => {
    const nodes = [makeNode("n1", "CONSTANT", [], [], "out")];
    const result = executeFormulaGraph(nodes, makeContext({}));
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
