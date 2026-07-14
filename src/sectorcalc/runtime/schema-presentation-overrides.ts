import type {
  ConversionEntry,
  ConversionRegistryItem,
  ServerOutput,
  SuperV4Input,
  SuperV4Schema,
} from "@/sectorcalc/pro-form/contract-types";
import { CERTIFIED_PRO_TOOL_SLUGS } from "@/sectorcalc/formulas/pro-v531/pro-certified-tool-keys";
import {
  GLOBAL_CURRENCY_CODES,
  resolveUniversalUnitContract,
  type CurrencyCode,
} from "@/sectorcalc/pro-form/universal-unit-catalog";

const DISPLAY_CURRENCY_UNIT = "display_currency";
const NEUTRAL_CURRENCY_LABEL = "Currency";
const certifiedProTools = new Set<string>(CERTIFIED_PRO_TOOL_SLUGS);

type PresentationInput = SuperV4Input & {
  _reference_default_text?: string | null;
  example?: number | null;
  sampleValue?: number | null;
};

type SchemaOutputWithMetadata = ServerOutput & {
  quantity_kind?: string;
  base_unit?: string | null;
};

function uniqueEntries(entries: ConversionEntry[]): ConversionEntry[] {
  const byUnit = new Map<string, ConversionEntry>();
  for (const entry of entries) {
    if (!entry.unit || !Number.isFinite(entry.factor) || entry.factor <= 0) continue;
    if (!byUnit.has(entry.unit)) byUnit.set(entry.unit, entry);
  }
  return [...byUnit.values()];
}

function normalizeExistingRegistryItem(item: ConversionRegistryItem | undefined): ConversionEntry[] {
  if (!item) return [];
  if (Array.isArray(item.units)) return item.units;
  const record = item as unknown as Record<string, unknown>;
  const entries: ConversionEntry[] = [];
  for (const [unit, value] of Object.entries(record)) {
    if (unit === "base_unit" || unit === "unit_family" || unit === "units") continue;
    if (!value || typeof value !== "object") continue;
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.factor !== "number" || !Number.isFinite(candidate.factor)) continue;
    entries.push({
      unit,
      factor: candidate.factor,
      offset: typeof candidate.offset === "number" ? candidate.offset : undefined,
      label: typeof candidate.label === "string" ? candidate.label : undefined,
    });
  }
  return entries;
}

function clamp(value: number, min: number | null | undefined, max: number | null | undefined): number {
  let result = value;
  if (typeof min === "number" && Number.isFinite(min)) result = Math.max(result, min);
  if (typeof max === "number" && Number.isFinite(max)) result = Math.min(result, max);
  return result;
}

function roundForInput(value: number, input: SuperV4Input): number {
  const declared = input.precision_policy?.input_decimals ?? input.precision?.input_decimals;
  const decimals = typeof declared === "number" && Number.isInteger(declared)
    ? Math.max(0, Math.min(8, declared))
    : Math.abs(value) < 1
      ? 3
      : 2;
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function numericReferenceFromSchema(input: SuperV4Input): number | null {
  if (Array.isArray(input.reference_values)) {
    for (const reference of input.reference_values) {
      if (typeof reference?.value === "number" && Number.isFinite(reference.value)) return reference.value;
      if (typeof reference?.low === "number" && typeof reference?.high === "number") {
        return (reference.low + reference.high) / 2;
      }
    }
  }

  for (const range of [input.engineering_reference_range, input.engineering_range]) {
    if (!range) continue;
    if (typeof range.min === "number" && typeof range.max === "number") {
      return (range.min + range.max) / 2;
    }
    if (typeof range.min === "number") return range.min;
    if (typeof range.max === "number") return range.max;
  }
  return null;
}

function semanticExample(input: SuperV4Input, dimension: string): number {
  const identity = `${input.id} ${input.name}`.toLowerCase();

  if (dimension === "currency") {
    if (/hourly|per hour|labor rate|labour rate|machine rate|shop rate/.test(identity)) return 50;
    if (/per unit|unit cost|unit price|per part|per kg|per m\b/.test(identity)) return 25;
    if (/electricity|energy rate|per kwh/.test(identity)) return 0.15;
    if (/cash|revenue|investment|capex|opex|annual|salary|overhead|reserve/.test(identity)) return 100_000;
    return 1_000;
  }
  if (dimension === "ratio") {
    if (/confidence/.test(identity)) return input.base_unit === "%" ? 90 : 0.9;
    if (/utilization|retention|efficiency/.test(identity)) return input.base_unit === "%" ? 80 : 0.8;
    if (/margin|discount|scrap|defect|loss/.test(identity)) return input.base_unit === "%" ? 10 : 0.1;
    return input.base_unit === "%" ? 50 : 0.5;
  }
  if (dimension === "calendar_time") {
    if (/year/.test(identity)) return 5;
    if (/quarter/.test(identity)) return 4;
    return 12;
  }
  if (dimension === "time") {
    if (/second|\bsec\b/.test(identity)) return 60;
    if (/minute|\bmin\b/.test(identity)) return 30;
    if (/day/.test(identity)) return 30;
    return 8;
  }
  if (dimension === "count") return /batch/.test(identity) ? 10 : 100;
  if (dimension === "length") return input.base_unit === "mm" ? 100 : input.base_unit === "cm" ? 10 : 1;
  if (dimension === "area") return 10;
  if (dimension === "volume") return input.base_unit === "L" ? 100 : 1;
  if (dimension === "mass") return 10;
  if (dimension === "force") return input.base_unit === "kN" ? 10 : 1_000;
  if (dimension === "pressure") {
    if (input.base_unit === "bar") return 6;
    if (input.base_unit === "psi") return 90;
    if (input.base_unit === "kPa") return 600;
    if (input.base_unit === "MPa") return 10;
    return 600_000;
  }
  if (dimension === "temperature_absolute") return input.base_unit === "K" ? 293.15 : 20;
  if (dimension === "energy") return input.base_unit === "kWh" ? 1_000 : 3_600_000;
  if (dimension === "power") return input.base_unit === "kW" ? 10 : 10_000;
  if (dimension === "flow") return 1;
  if (dimension === "speed") return 10;
  if (dimension === "torque") return 100;
  if (dimension === "density") return 1_000;
  if (dimension === "frequency") return input.base_unit === "rpm" ? 1_500 : 50;
  if (dimension === "angle") return input.base_unit === "rad" ? Math.PI / 4 : 45;
  return 10;
}

function deriveIllustrativeExample(input: SuperV4Input, dimension: string): number | null {
  if (input.type !== "number" && input.type !== "integer") return null;

  const declared = numericReferenceFromSchema(input);
  const bounds = input.physical_hard_bounds;
  let value = declared ?? semanticExample(input, dimension);

  if (bounds && typeof bounds.min === "number" && typeof bounds.max === "number") {
    if (value < bounds.min || value > bounds.max) {
      if (bounds.min > 0 && bounds.max / bounds.min >= 100) {
        value = Math.sqrt(bounds.min * bounds.max);
      } else {
        value = bounds.min + (bounds.max - bounds.min) * 0.25;
      }
    }
  }

  value = clamp(value, bounds?.min, bounds?.max);
  if (input.type === "integer") value = Math.round(value);
  return Number.isFinite(value) ? roundForInput(value, input) : null;
}

function formatExampleNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
    useGrouping: true,
  }).format(value);
}

function applyIllustrativeReference(input: SuperV4Input, dimension: string): SuperV4Input {
  const example = deriveIllustrativeExample(input, dimension);
  if (example === null) return input;
  const presentation = { ...input } as PresentationInput;
  const unit = dimension === "currency"
    ? GLOBAL_CURRENCY_CODES[0]
    : input.allowed_display_units[0] ?? input.base_unit ?? "";
  const exampleText = `${formatExampleNumber(example)}${unit ? ` ${unit}` : ""}`;
  presentation._reference_default_text = `Illustrative input: ${exampleText}. Replace with the verified project value.`;
  presentation.example = example;
  presentation.sampleValue = example;

  const baseHelp = (input.user_help_text ?? input.help_text ?? `Enter the project-specific ${input.name}.`)
    .replace(/\s+/g, " ")
    .trim();
  const exampleSentence = `Illustrative input: ${exampleText}. Replace it with the verified project value; this example is not auto-filled.`;
  presentation.help_text = `${baseHelp} ${exampleSentence}`;
  presentation.user_help_text = presentation.help_text;
  return presentation;
}

function enforceNoDefaultPresentation(input: SuperV4Input): SuperV4Input {
  const next = { ...input } as PresentationInput;
  next.default_value = null;
  next.default = null;
  next.default_policy = "NO_DEFAULT";
  return next;
}

/**
 * The current calculator UI accepts project values directly and no longer
 * renders separate evidence checkboxes. The entered value is accepted for
 * execution, but is never represented as independently source-verified.
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

function isCurrencyOutput(output: SchemaOutputWithMetadata): boolean {
  const unit = (output.unit ?? output.base_unit ?? "").toLowerCase();
  const quantity = (output.quantity_kind ?? "").toLowerCase();
  return quantity.includes("currency") || unit.includes("currency") || /^[a-z]{3}(?:$|\/)/i.test(unit);
}

function applyUniversalUnits(schema: SuperV4Schema): SuperV4Schema {
  const registry = { ...schema.unit_conversion_contract.conversion_registry };
  const dimensionByQuantityKind = new Map<string, string>();

  const inputs = schema.inputs.map((input) => {
    const contract = resolveUniversalUnitContract(input);
    const priorDimension = dimensionByQuantityKind.get(input.quantity_kind);
    if (priorDimension && priorDimension !== contract.dimension && contract.dimension !== "dimensionless") {
      throw new Error(
        `UNIT_DIMENSION_CONFLICT:${schema.tool_key}:${input.quantity_kind}:${priorDimension}:${contract.dimension}`,
      );
    }
    if (contract.dimension !== "dimensionless") {
      dimensionByQuantityKind.set(input.quantity_kind, contract.dimension);
    }

    const existing = registry[input.quantity_kind] as ConversionRegistryItem | undefined;

    if (contract.monetary) {
      const currencyUnits: ConversionEntry[] = [
        { unit: DISPLAY_CURRENCY_UNIT, factor: 1, label: NEUTRAL_CURRENCY_LABEL },
        ...(input.base_unit ? [{ unit: input.base_unit, factor: 1, label: NEUTRAL_CURRENCY_LABEL }] : []),
      ];
      registry[input.quantity_kind] = {
        base_unit: input.base_unit ?? existing?.base_unit ?? DISPLAY_CURRENCY_UNIT,
        unit_family: "CURRENCY",
        units: uniqueEntries([...normalizeExistingRegistryItem(existing), ...currencyUnits]),
      };

      const monetaryInput: SuperV4Input = {
        ...input,
        unit_selectable: false,
        allowed_display_units: [DISPLAY_CURRENCY_UNIT],
        physical_hard_bounds: input.physical_hard_bounds
          ? { ...input.physical_hard_bounds, unit: NEUTRAL_CURRENCY_LABEL }
          : input.physical_hard_bounds,
        engineering_range: input.engineering_range
          ? { ...input.engineering_range, unit: NEUTRAL_CURRENCY_LABEL }
          : input.engineering_range,
        engineering_reference_range: input.engineering_reference_range
          ? { ...input.engineering_reference_range, unit: NEUTRAL_CURRENCY_LABEL }
          : input.engineering_reference_range,
      };
      return applyIllustrativeReference(monetaryInput, contract.dimension);
    }

    if (contract.units.length > 0 && contract.baseUnit) {
      registry[input.quantity_kind] = {
        base_unit: contract.baseUnit,
        unit_family: existing?.unit_family,
        units: uniqueEntries(contract.units),
      };
    }

    const nextInput: SuperV4Input = contract.displayUnits.length > 0
      ? {
          ...input,
          allowed_display_units: contract.displayUnits,
          unit_selectable: contract.displayUnits.length > 1,
        }
      : {
          ...input,
          allowed_display_units: input.base_unit ? [input.base_unit] : [],
          unit_selectable: false,
        };
    return applyIllustrativeReference(nextInput, contract.dimension);
  });

  return {
    ...schema,
    unit_conversion_contract: {
      ...schema.unit_conversion_contract,
      currency_policy: "ISO_4217_DENOMINATION_ONLY_NO_FX_CONVERSION",
      unsupported_conversion_behavior: "BLOCK_CALCULATION",
      unit_change_behavior: "PRESERVE_PHYSICAL_QUANTITY",
      formula_input_rule: "FORMULAS_USE_NORMALIZED_BASE_UNITS_ONLY",
      conversion_registry: registry,
    },
    inputs,
    outputs: schema.outputs.map((output) => {
      const typedOutput = output as SchemaOutputWithMetadata;
      return isCurrencyOutput(typedOutput)
        ? { ...output, unit: DISPLAY_CURRENCY_UNIT }
        : output;
    }),
  };
}

/**
 * Applies presentation and execution-entry rules after server calculation
 * contracts are built. Formula IDs, input IDs, normalized IDs, and arithmetic
 * expressions remain unchanged.
 */
export function applySchemaPresentationOverrides(schema: SuperV4Schema): SuperV4Schema {
  const evidenceSafe: SuperV4Schema = {
    ...schema,
    inputs: schema.inputs.map(allowEnteredValueAsExecutionEvidence),
  };
  const unitsSafe = applyUniversalUnits(evidenceSafe);
  if (!certifiedProTools.has(unitsSafe.tool_key)) return unitsSafe;

  return {
    ...unitsSafe,
    engine_rules: {
      ...unitsSafe.engine_rules,
      strict_formula_schema_contract: true,
    },
    inputs: unitsSafe.inputs.map((input) => {
      const noDefault = enforceNoDefaultPresentation(input);
      const contract = resolveUniversalUnitContract(noDefault);
      return applyIllustrativeReference(noDefault, contract.dimension);
    }),
  };
}

export const DEFAULT_DISPLAY_CURRENCY: CurrencyCode = "USD";
