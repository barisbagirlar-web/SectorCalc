// SectorCalc SuperV4 V5.3.1 Deterministic Formula Engine
// Server-only. No eval. No new Function. No client import.
// Typed operation registry — fails closed on unknown operation.

import type { FormulaRegistryNode, FormulaOperation } from "./formula-registry";

export type { FormulaOperation };

export interface FormulaContext {
  normalizedInputs: Record<string, { baseValue: number; baseUnit: string; quantityKind: string }>;
  formulaVersion: string;
}

export interface FormulaOutput {
  id: string;
  value: number | string | boolean | null;
  unit?: string;
  status: "OK" | "REVIEW" | "BLOCKED";
}

export interface FormulaTrace {
  nodeId: string;
  operation: FormulaOperation;
  inputs: (number | null)[];
  constants: number[];
  result: number | null;
  status: string;
}

export interface FormulaGraphResult {
  outputs: FormulaOutput[];
  trace: FormulaTrace[];
  errors: string[];
}

function executeOperation(op: FormulaOperation, inputs: (number | null)[], constants: number[]): { result: number | null; status: string } {
  const validInputs = inputs.filter((i): i is number => i !== null && Number.isFinite(i));

  switch (op) {
    case "PASS_THROUGH": {
      if (validInputs.length < 1) return { result: null, status: "BLOCKED: no input" };
      return { result: validInputs[0], status: "OK" };
    }
    case "ADD": {
      if (validInputs.length < 1) return { result: null, status: "BLOCKED: not enough inputs" };
      const result = validInputs.reduce((a, b) => a + b, 0);
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "SUBTRACT": {
      if (validInputs.length < 1) return { result: null, status: "BLOCKED: not enough inputs" };
      const result = validInputs.reduce((a, b) => a - b);
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "MULTIPLY": {
      if (validInputs.length < 1) return { result: null, status: "BLOCKED: not enough inputs" };
      const result = validInputs.reduce((a, b) => a * b, 1);
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "DIVIDE": {
      if (validInputs.length < 2) return { result: null, status: "BLOCKED: not enough inputs" };
      let result = validInputs[0];
      for (let i = 1; i < validInputs.length; i++) {
        if (validInputs[i] === 0) return { result: null, status: "BLOCKED: division by zero" };
        result /= validInputs[i];
      }
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "MIN": {
      if (validInputs.length < 1) return { result: null, status: "BLOCKED: not enough inputs" };
      return { result: Math.min(...validInputs), status: "OK" };
    }
    case "MAX": {
      if (validInputs.length < 1) return { result: null, status: "BLOCKED: not enough inputs" };
      return { result: Math.max(...validInputs), status: "OK" };
    }
    case "ABS": {
      if (validInputs.length < 1) return { result: null, status: "BLOCKED: not enough inputs" };
      return { result: Math.abs(validInputs[0]), status: "OK" };
    }
    case "RATIO": {
      if (validInputs.length < 2) return { result: null, status: "BLOCKED: need numerator and denominator" };
      if (validInputs[1] === 0) return { result: null, status: "BLOCKED: division by zero in ratio" };
      const result = validInputs[0] / validInputs[1];
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "MARGIN": {
      if (validInputs.length < 2) return { result: null, status: "BLOCKED: need revenue and cost" };
      if (validInputs[0] === 0) return { result: null, status: "BLOCKED: zero revenue" };
      const result = (validInputs[0] - validInputs[1]) / validInputs[0];
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "UTILIZATION": {
      if (validInputs.length < 2) return { result: null, status: "BLOCKED: need actual and capacity" };
      if (validInputs[1] === 0) return { result: null, status: "BLOCKED: zero capacity" };
      const result = validInputs[0] / validInputs[1];
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "CAPACITY_REDUCTION": {
      if (validInputs.length < 2) return { result: null, status: "BLOCKED: need original and reduction" };
      if (validInputs[0] === 0) return { result: null, status: "BLOCKED: zero original capacity" };
      const result = (validInputs[0] - validInputs[1]) / validInputs[0];
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "WEIGHTED_SUM": {
      if (validInputs.length < 1 || constants.length < validInputs.length) return { result: null, status: "BLOCKED: need matching weights" };
      let sum = 0;
      for (let i = 0; i < validInputs.length; i++) {
        sum += validInputs[i] * (constants[i] ?? 1);
      }
      return { result: Number.isFinite(sum) ? sum : null, status: Number.isFinite(sum) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "THRESHOLD_DECISION": {
      if (validInputs.length < 1 || constants.length < 1) return { result: null, status: "BLOCKED: need value and threshold" };
      const value = validInputs[0];
      const threshold = constants[0];
      return { result: value >= threshold ? 1 : 0, status: "OK" };
    }
    case "CONSTANT": {
      if (constants.length < 1) return { result: null, status: "BLOCKED: need constant" };
      return { result: constants[0], status: "OK" };
    }
    case "SQRT": {
      if (validInputs.length < 1) return { result: null, status: "BLOCKED: need input" };
      if (validInputs[0] < 0) return { result: null, status: "BLOCKED: negative sqrt input" };
      const result = Math.sqrt(validInputs[0]);
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    case "POW": {
      if (validInputs.length < 1 || constants.length < 1) return { result: null, status: "BLOCKED: need base and exponent" };
      const result = Math.pow(validInputs[0], constants[0]);
      return { result: Number.isFinite(result) ? result : null, status: Number.isFinite(result) ? "OK" : "BLOCKED: non-finite result" };
    }
    default: {
      return { result: null, status: `BLOCKED: unknown operation ${op as string}` };
    }
  }
}

export function executeFormulaGraph(
  nodes: FormulaRegistryNode[],
  context: FormulaContext,
): FormulaGraphResult {
  const errors: string[] = [];
  const trace: FormulaTrace[] = [];
  const outputMap = new Map<string, number | boolean | string | null>();

  // Validate input refs — each ref must be either a known normalized input or
  // a formula output produced by a preceding node in the graph (resolved iteratively).
  const allOutputRefs = new Set(nodes.map((n) => n.output_ref));
  for (const node of nodes) {
    if (node.input_refs) {
      for (const ref of node.input_refs) {
        if (ref.startsWith("raw_") || !ref.includes("_norm")) {
          const isNorm = context.normalizedInputs[ref] !== undefined;
          const isFormulaOutput = allOutputRefs.has(ref);
          if (!isNorm && !isFormulaOutput) {
            errors.push(`[${node.formula_id}] Input ref "${ref}" is not a known normalized input or formula output`);
          }
        }
      }
    }
  }

  // Iterative resolution: process nodes in rounds until all are resolved.
  // Naive sort by input_refs.length is incorrect when a node with fewer refs
  // depends on an intermediate value produced by a node with more refs.
  const remaining = new Set(nodes);
  let previousSize = 0;
  while (remaining.size > 0 && remaining.size !== previousSize) {
    previousSize = remaining.size;
    for (const node of [...remaining]) {
      const inputs: (number | null)[] = [];
      const refs = node.input_refs ?? [];
      let allReady = true;
      for (const ref of refs) {
        const normInput = context.normalizedInputs[ref];
        if (normInput && typeof normInput.baseValue === "number") {
          inputs.push(normInput.baseValue);
        } else if (outputMap.has(ref)) {
          const val = outputMap.get(ref);
          inputs.push(typeof val === "number" ? val : null);
        } else {
          inputs.push(null);
          allReady = false;
        }
      }
      if (!allReady) continue;
      remaining.delete(node);

      // Reject non-finite inputs
      for (const inp of inputs) {
        if (inp !== null && !Number.isFinite(inp)) {
          errors.push(`[${node.formula_id}] Non-finite input value detected`);
        }
      }

      const constants = node.constant_refs ?? [];
      const { result, status } = executeOperation(node.operation, inputs, constants);

      trace.push({
        nodeId: node.formula_id,
        operation: node.operation,
        inputs: [...inputs],
        constants: [...constants],
        result,
        status,
      });

      // Check if operation reported a blocked status
      if (result === null && status !== "OK") {
        errors.push(`[${node.formula_id}] ${status}`);
        outputMap.set(node.output_ref, null);
      } else if (result !== null && !Number.isFinite(result)) {
        errors.push(`[${node.formula_id}] Non-finite output value`);
        outputMap.set(node.output_ref, null);
      } else {
        outputMap.set(node.output_ref, result);
      }
    }
  }

  // Report any nodes that could not be resolved (dangling references)
  for (const node of remaining) {
    errors.push(`[${node.formula_id}] Could not resolve: missing dependencies`);
    outputMap.set(node.output_ref, null);
  }

  const outputs: FormulaOutput[] = [];
  for (const node of nodes) {
    const value = outputMap.get(node.output_ref) ?? null;
    const traceEntry = trace.find((t) => t.nodeId === node.formula_id);
    outputs.push({
      id: node.output_ref,
      value,
      status: (traceEntry?.status === "OK" || value !== null) ? "OK" : "BLOCKED",
    });
  }

  return { outputs, trace, errors };
}
