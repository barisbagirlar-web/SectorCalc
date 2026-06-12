import type {
  ActivationDraft,
  ActivationInputDraft,
  ActivationOutputDraft,
} from "./activation-types";

export type UnitConsistencyIssue = {
  code:
    | "missing-input-key"
    | "empty-output"
    | "conflicting-unit"
    | "invalid-unit-format";
  message: string;
};

const UNIT_PATTERN = /^[a-zA-Z%°µ/][a-zA-Z0-9%°µ/._\-]*$/;

/**
 * MVP unit consistency checks only.
 * Does not prove physical unit conversion correctness.
 */
export function auditToolUnitConsistency(draft: ActivationDraft): UnitConsistencyIssue[] {
  const issues: UnitConsistencyIssue[] = [];
  const inputKeys = new Set(draft.inputs.map((input) => input.key));
  const formulaVariables = extractFormulaVariables(draft.formulaExpression || "");

  for (const variable of formulaVariables) {
    if (!inputKeys.has(variable)) {
      issues.push({
        code: "missing-input-key",
        message: `Formula variable "${variable}" is not present in input list.`,
      });
    }
  }

  if (draft.outputs.length === 0) {
    issues.push({
      code: "empty-output",
      message: "At least one output is required.",
    });
  }

  for (const output of draft.outputs) {
    if (!output.key.trim()) {
      issues.push({
        code: "empty-output",
        message: "Output key cannot be empty.",
      });
    }
  }

  issues.push(...collectUnitFormatIssues(draft.inputs, "input"));
  issues.push(...collectConflictingUnits(draft.inputs));
  issues.push(...collectUnitFormatIssues(draft.outputs, "output"));

  return issues;
}

function extractFormulaVariables(expression: string): string[] {
  if (!expression.trim()) {
    return [];
  }

  const tokens = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) ?? [];
  const reserved = new Set(["math", "abs", "min", "max", "pow", "sqrt"]);
  return [...new Set(tokens.filter((token) => !reserved.has(token)))];
}

function collectUnitFormatIssues(
  entries: ActivationInputDraft[] | ActivationOutputDraft[],
  kind: "input" | "output",
): UnitConsistencyIssue[] {
  const issues: UnitConsistencyIssue[] = [];

  for (const entry of entries) {
    if (!entry.unit) continue;
    if (!UNIT_PATTERN.test(entry.unit.trim())) {
      issues.push({
        code: "invalid-unit-format",
        message: `${kind} "${entry.key}" has invalid unit format: ${entry.unit}`,
      });
    }
  }

  return issues;
}

function collectConflictingUnits(inputs: ActivationInputDraft[]): UnitConsistencyIssue[] {
  const byKey = new Map<string, Set<string>>();

  for (const input of inputs) {
    if (!input.unit) continue;
    const units = byKey.get(input.key) ?? new Set<string>();
    units.add(input.unit.trim());
    byKey.set(input.key, units);
  }

  const issues: UnitConsistencyIssue[] = [];

  for (const [key, units] of byKey.entries()) {
    if (units.size > 1) {
      issues.push({
        code: "conflicting-unit",
        message: `Input "${key}" has conflicting units: ${[...units].join(", ")}`,
      });
    }
  }

  return issues;
}

export function getMinimumTestCaseCount(riskLevel: ActivationDraft["riskLevel"]): number {
  if (riskLevel === "high" || riskLevel === "regulated" || riskLevel === "safety-critical") {
    return 3;
  }

  return 1;
}

export function auditActivationTestCases(draft: ActivationDraft): string[] {
  const minimum = getMinimumTestCaseCount(draft.riskLevel);
  const violations: string[] = [];

  if (draft.testCases.length < minimum) {
    violations.push(
      `${draft.slug}: riskLevel=${draft.riskLevel} requires at least ${minimum} test case(s); found ${draft.testCases.length}.`,
    );
  }

  return violations;
}
