import type {
  ConversionRegistryItem,
  ServerOutput,
  SuperV4Input,
  SuperV4Schema,
} from "@/sectorcalc/pro-form/contract-types";
import { CERTIFIED_PRO_TOOL_SLUGS } from "@/sectorcalc/formulas/pro-v531/pro-certified-tool-keys";

const BREAK_EVEN_TOOL_KEY = "break-even-survival-cash-calculator";
const DISPLAY_CURRENCY_UNIT = "display_currency";
const NEUTRAL_CURRENCY_LABEL = "Currency";
const certifiedProTools = new Set<string>(CERTIFIED_PRO_TOOL_SLUGS);

type SchemaOutputWithMetadata = ServerOutput & {
  quantity_kind?: string;
  base_unit?: string | null;
};

function enforceNoDefaultPresentation(input: SuperV4Input): SuperV4Input {
  const next = { ...input } as SuperV4Input & Record<string, unknown>;
  next.default_value = null;
  next.default = null;
  next.defaultValue = null;
  next.example = null;
  next.sampleValue = null;
  next.default_policy = "NO_DEFAULT";
  next._reference_default_text = null;

  const help =
    `Enter the project-specific ${input.name}. ` +
    "Use controlled source evidence; no automatic default or universal reference range is applied.";
  next.help_text = help;
  next.user_help_text = help;

  for (const key of ["engineering_reference_range", "engineering_range"] as const) {
    const range = next[key];
    if (!range || typeof range !== "object") continue;
    const record = { ...range } as typeof range & Record<string, unknown>;
    const state = String(record.warning_behavior ?? record.status ?? "").toUpperCase();
    if (state === "NOT_APPLICABLE") {
      record.min = null;
      record.max = null;
      record.source = "Project-specific controlled evidence";
      record.public_note =
        "No universal engineering reference range is applied. Use controlled project evidence and the declared physical input limits.";
    }
    next[key] = record;
  }

  return next;
}

/**
 * The current calculator UI accepts project values directly and no longer
 * renders separate evidence checkboxes. The entered value must therefore be an
 * accepted execution evidence type. This does not mark it as independently
 * source-verified: the evidence state remains unverified unless a dedicated
 * evidence flow supplies that status, and BLOCK remains the policy when the
 * required value itself is missing.
 */
export function allowEnteredValueAsExecutionEvidence(input: SuperV4Input): SuperV4Input {
  const requirement = input.evidence_requirement;
  if (!requirement || typeof requirement === "string") return input;
  const accepted = Array.isArray(requirement.accepted_evidence)
    ? requirement.accepted_evidence
    : [];
  if (accepted.some((value) => value.trim().toLowerCase() === "user-provided value")) {
    return input;
  }

  return {
    ...input,
    evidence_requirement: {
      ...requirement,
      accepted_evidence: [...accepted, "user-provided value"],
    },
  };
}

function applyBreakEvenCurrencyPresentation(schema: SuperV4Schema): SuperV4Schema {
  if (schema.tool_key !== BREAK_EVEN_TOOL_KEY) return schema;

  const registry = schema.unit_conversion_contract.conversion_registry;
  const currencyEntry = registry.currency as ConversionRegistryItem | undefined;
  const existingUnits = currencyEntry?.units ?? [];
  const hasDisplayCurrency = existingUnits.some(
    (entry) => entry.unit === DISPLAY_CURRENCY_UNIT,
  );
  const currencyUnits = hasDisplayCurrency
    ? existingUnits
    : [
        ...existingUnits,
        {
          unit: DISPLAY_CURRENCY_UNIT,
          factor: 1,
          label: NEUTRAL_CURRENCY_LABEL,
        },
      ];

  return {
    ...schema,
    unit_conversion_contract: {
      ...schema.unit_conversion_contract,
      conversion_registry: {
        ...registry,
        currency: {
          base_unit: currencyEntry?.base_unit ?? "currency_unit",
          unit_family: currencyEntry?.unit_family ?? "CURRENCY",
          units: currencyUnits,
        },
      },
    },
    inputs: schema.inputs.map((input) =>
      input.quantity_kind === "currency"
        ? {
            ...input,
            unit_selectable: false,
            allowed_display_units: [DISPLAY_CURRENCY_UNIT],
            physical_hard_bounds: input.physical_hard_bounds
              ? {
                  ...input.physical_hard_bounds,
                  unit: NEUTRAL_CURRENCY_LABEL,
                }
              : input.physical_hard_bounds,
            engineering_range: input.engineering_range
              ? { ...input.engineering_range, unit: NEUTRAL_CURRENCY_LABEL }
              : input.engineering_range,
            engineering_reference_range: input.engineering_reference_range
              ? {
                  ...input.engineering_reference_range,
                  unit: NEUTRAL_CURRENCY_LABEL,
                }
              : input.engineering_reference_range,
          }
        : input,
    ),
    outputs: schema.outputs.map((output) => {
      const typedOutput = output as SchemaOutputWithMetadata;
      return typedOutput.quantity_kind === "currency"
        ? { ...output, unit: DISPLAY_CURRENCY_UNIT }
        : output;
    }),
  };
}

/**
 * Applies presentation and execution-entry rules after server calculation
 * contracts are built. It never changes formula IDs, normalized input IDs, or
 * arithmetic semantics.
 */
export function applySchemaPresentationOverrides(
  schema: SuperV4Schema,
): SuperV4Schema {
  const evidenceSafe: SuperV4Schema = {
    ...schema,
    inputs: schema.inputs.map(allowEnteredValueAsExecutionEvidence),
  };
  const currencySafe = applyBreakEvenCurrencyPresentation(evidenceSafe);
  if (!certifiedProTools.has(currencySafe.tool_key)) return currencySafe;

  return {
    ...currencySafe,
    engine_rules: {
      ...currencySafe.engine_rules,
      strict_formula_schema_contract: true,
    },
    inputs: currencySafe.inputs.map(enforceNoDefaultPresentation),
  };
}
