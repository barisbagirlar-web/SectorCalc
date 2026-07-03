// SectorCalc V5.3.1 — Deterministic Formula Engine Tests
// No eval. No new Function. Typed operation registry.

import { describe, it, expect } from "vitest";
import { executeFormulaGraph, type FormulaContext } from "../deterministic-formula-engine";
import type { FormulaRegistryNode } from "../formula-registry";

function createNode(overrides: Partial<FormulaRegistryNode>): FormulaRegistryNode {
  return {
    formula_id: "f_test",
    formula_version: "1.0.0",
    schema_hash_binding: "test-hash",
    formula_registry_hash: "fr-test",
    operation: "PASS_THROUGH",
    constant_refs: [],
    input_refs: ["val"],
    output_ref: "result",
    unit_dimension_rule: "DIMENSIONLESS",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "",
    review_rule: "",
    rejection_rule: "",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
    ...overrides,
  };
}

function makeContext(overrides?: Partial<FormulaContext>): FormulaContext {
  return {
    normalizedInputs: {
      val: { baseValue: 10, baseUnit: "", quantityKind: "DIMENSIONLESS" },
      a: { baseValue: 5, baseUnit: "", quantityKind: "DIMENSIONLESS" },
      b: { baseValue: 3, baseUnit: "", quantityKind: "DIMENSIONLESS" },
    },
    formulaVersion: "1.0.0",
    ...overrides,
  };
}

describe("executeFormulaGraph", () => {
  it("PASS_THROUGH returns input value", () => {
    const nodes = [createNode({ operation: "PASS_THROUGH", input_refs: ["val"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBe(10);
    expect(result.outputs[0].status).toBe("OK");
    expect(result.errors).toHaveLength(0);
  });

  it("ADD sums inputs", () => {
    const nodes = [createNode({ operation: "ADD", input_refs: ["a", "b"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBe(8);
  });

  it("MULTIPLY multiplies inputs", () => {
    const nodes = [createNode({ operation: "MULTIPLY", input_refs: ["a", "b"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBe(15);
  });

  it("DIVIDE divides inputs", () => {
    const nodes = [createNode({ operation: "DIVIDE", input_refs: ["a", "b"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBeCloseTo(5 / 3);
  });

  it("DIVIDE blocks division by zero", () => {
    const ctx = makeContext();
    ctx.normalizedInputs.b = { baseValue: 0, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    const nodes = [createNode({ operation: "DIVIDE", input_refs: ["a", "b"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.outputs[0].value).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("RATIO computes ratio", () => {
    const nodes = [createNode({ operation: "RATIO", input_refs: ["a", "b"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBeCloseTo(5 / 3);
  });

  it("MIN returns minimum", () => {
    const nodes = [createNode({ operation: "MIN", input_refs: ["a", "b"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBe(3);
  });

  it("MAX returns maximum", () => {
    const nodes = [createNode({ operation: "MAX", input_refs: ["a", "b"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBe(5);
  });

  it("ABS returns absolute value", () => {
    const ctx = makeContext();
    ctx.normalizedInputs.val = { baseValue: -7, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    const nodes = [createNode({ operation: "ABS", input_refs: ["val"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.outputs[0].value).toBe(7);
  });

  it("MARGIN computes (rev - cost) / rev", () => {
    const ctx = makeContext();
    ctx.normalizedInputs.rev = { baseValue: 100, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    ctx.normalizedInputs.cost = { baseValue: 70, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    const nodes = [createNode({ operation: "MARGIN", input_refs: ["rev", "cost"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.outputs[0].value).toBeCloseTo(0.3);
  });

  it("UTILIZATION computes actual/capacity", () => {
    const ctx = makeContext();
    ctx.normalizedInputs.actual = { baseValue: 80, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    ctx.normalizedInputs.cap = { baseValue: 100, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    const nodes = [createNode({ operation: "UTILIZATION", input_refs: ["actual", "cap"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.outputs[0].value).toBeCloseTo(0.8);
  });

  it("CAPACITY_REDUCTION computes (orig - red)/orig", () => {
    const ctx = makeContext();
    ctx.normalizedInputs.a = { baseValue: 100, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    ctx.normalizedInputs.b = { baseValue: 20, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    const nodes = [createNode({ operation: "CAPACITY_REDUCTION", input_refs: ["a", "b"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.outputs[0].value).toBeCloseTo(0.8);
  });

  it("WEIGHTED_SUM multiplies inputs by constants", () => {
    const ctx = makeContext();
    ctx.normalizedInputs.a = { baseValue: 10, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    ctx.normalizedInputs.b = { baseValue: 20, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    const nodes = [createNode({ operation: "WEIGHTED_SUM", input_refs: ["a", "b"], constant_refs: [2, 3], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.outputs[0].value).toBe(80); // 10*2 + 20*3
  });

  it("THRESHOLD_DECISION returns 1 when value >= threshold", () => {
    const nodes = [createNode({ operation: "THRESHOLD_DECISION", input_refs: ["val"], constant_refs: [10], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBe(1);
  });

  it("THRESHOLD_DECISION returns 0 when value < threshold", () => {
    const nodes = [createNode({ operation: "THRESHOLD_DECISION", input_refs: ["val"], constant_refs: [20], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBe(0);
  });

  it("blocks unknown operation", () => {
    const nodes = [createNode({ operation: "UNKNOWN_OP" as any, input_refs: ["val"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.outputs[0].value).toBeNull();
  });

  it("rejects non-finite input", () => {
    const ctx = makeContext();
    ctx.normalizedInputs.val = { baseValue: Infinity, baseUnit: "", quantityKind: "DIMENSIONLESS" };
    const nodes = [createNode({ operation: "PASS_THROUGH", input_refs: ["val"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, ctx);
    expect(result.outputs[0].status).toBe("BLOCKED");
  });

  it("produces trace for each node", () => {
    const nodes = [createNode({ operation: "ADD", input_refs: ["a", "b"], output_ref: "result" })];
    const result = executeFormulaGraph(nodes, makeContext());
    expect(result.trace).toHaveLength(1);
    expect(result.trace[0].operation).toBe("ADD");
    expect(result.trace[0].nodeId).toBe("f_test");
  });

  it("handles multiple nodes in order", () => {
    const nodes = [
      createNode({ formula_id: "f1", operation: "ADD", input_refs: ["a", "b"], output_ref: "sum" }),
      createNode({ formula_id: "f2", operation: "MULTIPLY", input_refs: ["sum", "val"], output_ref: "result" }),
    ];
    const result = executeFormulaGraph(nodes, makeContext());
    // sum = 5+3 = 8, result = 8*10 = 80
    expect(result.outputs[0].value).toBe(8);
    expect(result.outputs[1].value).toBe(80);
  });
});
