/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck — Schema Linter (locked type system)

/**
 * Schema Linter — build-time validation for premium calculator schemas.
 * Ensures registry compliance before schemas ship to production.
 */

import {
  FORMULA_FAMILIES,
  PREMIUM_FORBIDDEN_PATTERNS,
  type FormulaFamilyId,
} from "@/lib/premium-schema/formula-families";
import {
  FORMULA_META,
  FORMULA_REGISTRY,
  listRegisteredFormulaIds,
} from "@/lib/premium-schema/formula-registry";
import type {
  PremiumCalculatorSchema,
  PremiumInputSchema,
} from "@/lib/premium-schema/premium-calculator-schema";

/** Engine-injected computed keys (not user inputs). */
export const SCHEMA_ENGINE_CONSTANTS = [
  "hiddenMultiplierConst",
  "excessKwhDerived",
] as const;

export type SchemaLintSeverity = "error" | "warning";

export interface SchemaLintIssue {
  readonly severity: SchemaLintSeverity;
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface SchemaLintResult {
  readonly schemaId: string;
  readonly valid: boolean;
  readonly errors: readonly SchemaLintIssue[];
  readonly warnings: readonly SchemaLintIssue[];
}

function issue(
  severity: SchemaLintSeverity,
  code: string,
  message: string,
  path?: string
): SchemaLintIssue {
  return { severity, code, message, path };
}

function collectForbiddenKeys(obj: unknown, path = ""): SchemaLintIssue[] {
  if (obj === null || typeof obj !== "object") {
    return [];
  }

  const found: SchemaLintIssue[] = [];
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const keyPath = path ? `${path}.${key}` : key;
    const lowerKey = key.toLowerCase();

    for (const forbidden of PREMIUM_FORBIDDEN_PATTERNS) {
      if (lowerKey.includes(forbidden.toLowerCase())) {
        found.push(
          issue(
            "error",
            "FORBIDDEN_KEY",
            `Forbidden key "${key}" detected — schemas must not contain executable formula fields.`,
            keyPath
          )
        );
      }
    }

    if (typeof value === "string" && /\beval\s*\(|\bnew\s+Function\b/.test(value)) {
      found.push(
        issue(
          "error",
          "FORBIDDEN_CODE",
          `Forbidden executable pattern in string at ${keyPath}.`,
          keyPath
        )
      );
    }

    if (typeof value === "object" && value !== null) {
      found.push(...collectForbiddenKeys(value, keyPath));
    }
  }

  return found;
}

function duplicateIds(ids: readonly string[], label: string, schemaId: string): SchemaLintIssue[] {
  const seen = new Set<string>();
  const dupes: SchemaLintIssue[] = [];
  for (const id of ids) {
    if (seen.has(id)) {
      dupes.push(
        issue("error", "DUPLICATE_ID", `Duplicate ${label} id "${id}" in schema "${schemaId}".`)
      );
    }
    seen.add(id);
  }
  return dupes;
}

function lintInputs(inputs: readonly PremiumInputSchema[], schemaId: string): SchemaLintIssue[] {
  const issues: SchemaLintIssue[] = [];

  if (inputs.length < 3) {
    issues.push(
      issue(
        "warning",
        "INPUT_COUNT",
        `Schema "${schemaId}" has fewer than 3 inputs — premium tools expect richer context.`
      )
    );
  }

  for (const input of inputs) {
    if (!input.label.trim() || !input.helper.trim()) {
      issues.push(
        issue("warning", "INPUT_COPY", `Input "${input.id}" missing label or helper text.`, input.id)
      );
    }
  }

  issues.push(...duplicateIds(inputs.map((i) => i.id), "input", schemaId));
  return issues;
}

function lintAssumptions(schema: PremiumCalculatorSchema): SchemaLintIssue[] {
  const { assumptions } = schema;
  const issues: SchemaLintIssue[] = [];
  const nums = [
    assumptions.hiddenLossMultiplier,
    assumptions.volatilityPercent,
    assumptions.targetMarginPercent,
  ];

  if (nums.some((n) => !Number.isFinite(n) || n < 0)) {
    issues.push(issue("error", "ASSUMPTION_NAN", "Assumption pack contains invalid numbers."));
  }

  if (assumptions.targetMarginPercent >= 100 || assumptions.targetMarginPercent < 0) {
    issues.push(issue("error", "ASSUMPTION_MARGIN", "targetMarginPercent must be between 0 and 99."));
  }

  return issues;
}

export function lintPremiumCalculatorSchema(schema: PremiumCalculatorSchema): SchemaLintResult {
  const errors: SchemaLintIssue[] = [];
  const warnings: SchemaLintIssue[] = [];

  if (!schema.id.trim() || !schema.name.trim()) {
    errors.push(issue("error", "SCHEMA_ID", "Schema must have id and name."));
  }

  if (!(FORMULA_FAMILIES as readonly string[]).includes(schema.category)) {
    errors.push(
      issue(
        "error",
        "INVALID_CATEGORY",
        `Category "${schema.category}" is not one of the 10 locked formula families.`
      )
    );
  }

  errors.push(...collectForbiddenKeys(schema));
  warnings.push(...lintInputs(schema.inputs, schema.id));
  errors.push(...lintAssumptions(schema));

  const inputIds = new Set(schema.inputs.map((i) => i.id));
  const pipelineOutputIds = new Set<string>();
  const availableRefs = new Set<string>([
    ...inputIds,
    ...SCHEMA_ENGINE_CONSTANTS,
  ]);

  errors.push(
    ...duplicateIds(schema.outputs.map((o) => o.id), "output", schema.id)
  );

  if (schema.formulaPipeline.length === 0) {
    errors.push(issue("error", "EMPTY_PIPELINE", "formulaPipeline must not be empty."));
  }

  for (const [index, step] of schema.formulaPipeline.entries()) {
    const stepPath = `formulaPipeline[${index}]`;

    if (!(step.formulaId in FORMULA_REGISTRY)) {
      errors.push(
        issue(
          "error",
          "UNKNOWN_FORMULA",
          `Unknown formulaId "${step.formulaId}" — register it in FORMULA_REGISTRY with tests.`,
          stepPath
        )
      );
    } else {
      const meta = FORMULA_META[step.formulaId];
      if (meta && meta.family !== schema.category && !step.formulaFamily) {
        warnings.push(
          issue(
            "warning",
            "FAMILY_MISMATCH",
            `Formula "${step.formulaId}" family "${meta.family}" differs from schema category "${schema.category}". Set formulaFamily on step if intentional.`,
            stepPath
          )
        );
      }
    }

    if (step.formulaFamily && !(FORMULA_FAMILIES as readonly string[]).includes(step.formulaFamily)) {
      errors.push(
        issue("error", "INVALID_STEP_FAMILY", `Invalid formulaFamily on pipeline step.`, stepPath)
      );
    }

    if (pipelineOutputIds.has(step.outputId)) {
      errors.push(
        issue("error", "DUPLICATE_OUTPUT", `Duplicate pipeline outputId "${step.outputId}".`, stepPath)
      );
    }
    pipelineOutputIds.add(step.outputId);

    for (const [param, sourceKey] of Object.entries(step.inputMap)) {
      if (!availableRefs.has(sourceKey)) {
        errors.push(
          issue(
            "error",
            "UNRESOLVED_INPUT_MAP",
            `inputMap.${param} references "${sourceKey}" which is not a schema input or prior pipeline output.`,
            stepPath
          )
        );
      }
      if (!param.trim()) {
        errors.push(issue("error", "EMPTY_PARAM", "inputMap parameter keys must be non-empty.", stepPath));
      }
    }

    availableRefs.add(step.outputId);
  }

  for (const output of schema.outputs) {
    if (!pipelineOutputIds.has(output.id)) {
      warnings.push(
        issue(
          "warning",
          "OUTPUT_NOT_IN_PIPELINE",
          `Output "${output.id}" is declared but not produced by formulaPipeline.`,
          output.id
        )
      );
    }
  }

  const bigNumbers = schema.outputs.filter((o) => o.isBigNumber);
  if (bigNumbers.length === 0) {
    warnings.push(
      issue("warning", "NO_BIG_NUMBER", "Schema should mark exactly one isBigNumber output for 3-second panel.")
    );
  } else if (bigNumbers.length > 1) {
    warnings.push(
      issue("warning", "MULTIPLE_BIG_NUMBER", "Multiple isBigNumber outputs — field panel should show one primary metric.")
    );
  }

  for (const threshold of schema.thresholds) {
    const refIds = new Set([...availableRefs, ...schema.outputs.map((o) => o.id)]);
    if (!refIds.has(threshold.fieldId)) {
      errors.push(
        issue(
          "error",
          "THRESHOLD_REF",
          `Threshold fieldId "${threshold.fieldId}" does not match any input or pipeline output.`,
          threshold.fieldId
        )
      );
    }
  }

  if (schema.reportTemplate.sections.length === 0) {
    errors.push(issue("error", "EMPTY_REPORT", "reportTemplate.sections must not be empty."));
  }

  if (schema.legacyPaidSlug && !schema.legacyPaidSlug.match(/^[a-z0-9-]+$/)) {
    errors.push(issue("error", "INVALID_SLUG", "legacyPaidSlug must be kebab-case."));
  }

  return {
    schemaId: schema.id,
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function lintAllPremiumSchemas(
  schemas: readonly PremiumCalculatorSchema[]
): {
  readonly valid: boolean;
  readonly results: readonly SchemaLintResult[];
  readonly registryOrphans: readonly string[];
  readonly globalErrors: readonly SchemaLintIssue[];
} {
  const results = schemas.map(lintPremiumCalculatorSchema);
  const usedFormulaIds = new Set<string>();

  for (const schema of schemas) {
    for (const step of schema.formulaPipeline) {
      usedFormulaIds.add(step.formulaId);
    }
  }

  const registered = listRegisteredFormulaIds();
  const registryOrphans = registered.filter((id) => !usedFormulaIds.has(id));

  const slugIds = schemas.map((s) => s.id);
  const globalErrors = duplicateIds(slugIds, "schema", "registry");

  const valid =
    schemas.length === 0 ||
    (results.every((r) => r.valid) && globalErrors.length === 0);

  return {
    valid,
    results,
    registryOrphans,
    globalErrors,
  };
}

export function assertSchemasLintClean(schemas: readonly PremiumCalculatorSchema[]): void {
  if (schemas.length === 0) {
    return;
  }

  const report = lintAllPremiumSchemas(schemas);
  const failures = [
    ...report.globalErrors,
    ...report.results.flatMap((r) => r.errors),
  ];

  if (!report.valid || failures.length > 0) {
    const messages = failures.map((f) => `[${f.code}] ${f.message}`).join("\n");
    throw new Error(`Premium schema lint failed:\n${messages}`);
  }
}

export function isFormulaFamilyId(value: string): value is FormulaFamilyId {
  return (FORMULA_FAMILIES as readonly string[]).includes(value);
}
