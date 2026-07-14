import type {
  ConversionEntry,
  ConversionRegistryItem,
  ServerOutput,
  SuperV4Input,
  SuperV4Schema,
} from "@/sectorcalc/pro-form/contract-types";
import { CERTIFIED_PRO_TOOL_SLUGS } from "@/sectorcalc/formulas/pro-v531/pro-certified-tool-keys";
import { resolveIndustrialExampleValue } from "@/sectorcalc/pro-form/example-value-resolver";
import {
  GLOBAL_CURRENCY_CODES,
  resolveUniversalUnitContract,
  type CurrencyCode,
  type ResolvedUniversalUnitContract,
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

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.length > 0))];
}

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

function safeKindToken(value: string): string {
  const token = value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  return token || "value";
}

/**
 * Source schemas historically reused broad quantity kinds such as "number",
 * "geometry", and "dimensionless" for unrelated dimensions. A conversion
 * registry is keyed by quantity kind, so reuse can silently bind a pressure
 * input to a currency or ratio registry. Runtime quantity kinds are therefore
 * dimension-specific. Formula IDs and normalized input IDs remain unchanged.
 */
function runtimeQuantityKind(
  input: SuperV4Input,
  contract: ResolvedUniversalUnitContract,
): string {
  if (contract.dimension === "currency") return "runtime_currency";
  if (contract.dimension === "dimensionless") return `runtime_dimensionless_${safeKindToken(input.id)}`;
  if (contract.dimension === "custom") {
    return `runtime_custom_${safeKindToken(input.base_unit ?? input.id)}`;
  }
  return `runtime_${safeKindToken(contract.dimension)}`;
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

function fallbackExample(input: SuperV4Input, dimension: string): number {
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
  if (dimension === "calendar_time") return /year/.test(identity) ? 5 : 12;
  if (dimension === "time") return /second|\bsec\b/.test(identity) ? 60 : /minute|\bmin\b/.test(identity) ? 30 : 8;
  if (dimension === "count") return /batch/.test(identity) ? 10 : 100;
  if (dimension === "length") return input.base_unit === "mm" ? 100 : input.base_unit === "cm" ? 10 : 1;
  if (dimension === "area") return 10;
  if (dimension === "volume") return input.base_unit === "L" ? 100 : 1;
  if (dimension === "mass") return 10;
  if (dimension === "force") return input.base_unit === "kN" ? 10 : 1_000;
  if (dimension === "pressure") return input.base_unit === "bar" ? 6 : input.base_unit === "psi" ? 90 : input.base_unit === "MPa" ? 10 : 600;
  if (dimension === "temperature_absolute") return input.base_unit === "K" ? 293.15 : 20;
  if (dimension === "energy") return input.base_unit === "kWh" ? 1_000 : 3_600_000;
  if (dimension === "power") return input.base_unit === "kW" ? 10 : 10_000;
  if (dimension === "frequency") return input.base_unit === "rpm" ? 1_500 : 50;
  if (dimension === "angle") return input.base_unit === "rad" ? Math.PI / 4 : 45;
  return 10;
}

function deriveIllustrativeExample(
  toolKey: string,
  input: SuperV4Input,
  dimension: string,
): number | null {
  if (input.type !== "number" && input.type !== "integer") return null;
  const bounds = input.physical_hard_bounds;
  const record = input as PresentationInput;
  const resolved = resolveIndustrialExampleValue({
    toolSlug: toolKey,
    toolKey,
    inputId: input.id,
    inputName: input.name,
    unit: input.base_unit,
    rangeMin: bounds?.min,
    rangeMax: bounds?.max,
    schemaExampleValue: record.example ?? record.sampleValue,
    // Examples must never inherit a hidden executable default.
    schemaDefaultValue: null,
  });

  let value = typeof resolved === "number"
    ? resolved
    : typeof resolved === "string" && resolved.trim() && Number.isFinite(Number(resolved))
      ? Number(resolved)
      : fallbackExample(input, dimension);
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

function applyIllustrativeReference(
  toolKey: string,
  input: SuperV4Input,
  dimension: string,
): SuperV4Input {
  const example = deriveIllustrativeExample(toolKey, input, dimension);
  if (example === null) return input;
  const presentation = { ...input } as PresentationInput;
  const unit = dimension === "currency"
    ? GLOBAL_CURRENCY_CODES[0]
    : input.allowed_display_units[0] ?? input.base_unit ?? "";
  const exampleText = `${formatExampleNumber(example)}${unit ? ` ${unit}` : ""}`;
  presentation._reference_default_text = `Illustrative input: ${exampleText}. Replace with the verified project value.`;
  presentation.example = example;
  presentation.sampleValue = example;

  const originalHelp = input.user_help_text ?? input.help_text ?? `Enter the project-specific ${input.name}.`;
  const baseHelp = originalHelp
    .replace(/\s*Illustrative input:.*$/i, "")
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

export function allowEnteredValueAsExecutionEvidence(input: SuperV4Input): SuperV4Input {
  const requirement = input.evidence_requirement;
  if (!requirement || typeof requirement === "string") return input;
  const accepted = Array.isArray(requirement.accepted_evidence)
    ? requirement.accepted_evidence
    : [];
  if (accepted.some((value) => value.trim().toLowerCase() === "user-provided value")) return input;
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

function baseFirstDisplayUnits(input: SuperV4Input, contract: ResolvedUniversalUnitContract): string[] {
  if (contract.dimension === "custom") {
    return uniqueStrings([input.base_unit, ...input.allowed_display_units]);
  }
  return uniqueStrings([input.base_unit ?? contract.baseUnit, ...contract.displayUnits]);
}

function registryForInput(
  input: SuperV4Input,
  contract: ResolvedUniversalUnitContract,
  existing: ConversionRegistryItem | undefined,
): ConversionRegistryItem | null {
  if (contract.dimension === "dimensionless" || !input.base_unit) return null;

  if (contract.dimension === "currency") {
    return {
      base_unit: input.base_unit,
      unit_family: "CURRENCY",
      units: uniqueEntries([
        { unit: DISPLAY_CURRENCY_UNIT, factor: 1, label: NEUTRAL_CURRENCY_LABEL },
        { unit: input.base_unit, factor: 1, label: NEUTRAL_CURRENCY_LABEL },
      ]),
    };
  }

  if (contract.dimension === "custom") {
    const existingUnits = normalizeExistingRegistryItem(existing);
    const requiredIdentities = uniqueStrings([input.base_unit, ...input.allowed_display_units])
      .map((unit) => ({ unit, factor: 1, label: unit }));
    return {
      base_unit: input.base_unit,
      unit_family: existing?.unit_family,
      units: uniqueEntries([...existingUnits, ...requiredIdentities]),
    };
  }

  return {
    base_unit: contract.baseUnit ?? input.base_unit,
    unit_family: existing?.unit_family,
    units: uniqueEntries(contract.units),
  };
}

function applyUniversalUnits(schema: SuperV4Schema): SuperV4Schema {
  const sourceRegistry = schema.unit_conversion_contract.conversion_registry;
  const registry = { ...sourceRegistry };
  const runtimeKindByInput = new Map<string, string>();
  const dimensionByInput = new Map<string, string>();

  const inputs = schema.inputs.map((sourceInput) => {
    const contract = resolveUniversalUnitContract(sourceInput);
    const runtimeKind = runtimeQuantityKind(sourceInput, contract);
    runtimeKindByInput.set(sourceInput.id, runtimeKind);
    dimensionByInput.set(sourceInput.id, contract.dimension);

    const existing = sourceRegistry[sourceInput.quantity_kind] as ConversionRegistryItem | undefined;
    const monetary = contract.dimension === "currency";
    const displayUnits = monetary
      ? [DISPLAY_CURRENCY_UNIT]
      : baseFirstDisplayUnits(sourceInput, contract);

    const input: SuperV4Input = {
      ...sourceInput,
      quantity_kind: runtimeKind,
      allowed_display_units: displayUnits,
      unit_selectable: !monetary && displayUnits.length > 1,
      physical_hard_bounds: monetary && sourceInput.physical_hard_bounds
        ? { ...sourceInput.physical_hard_bounds, unit: NEUTRAL_CURRENCY_LABEL }
        : sourceInput.physical_hard_bounds,
      engineering_range: monetary && sourceInput.engineering_range
        ? { ...sourceInput.engineering_range, unit: NEUTRAL_CURRENCY_LABEL }
        : sourceInput.engineering_range,
      engineering_reference_range: monetary && sourceInput.engineering_reference_range
        ? { ...sourceInput.engineering_reference_range, unit: NEUTRAL_CURRENCY_LABEL }
        : sourceInput.engineering_reference_range,
    };

    const registryItem = registryForInput(input, contract, existing);
    if (registryItem) registry[runtimeKind] = registryItem;
    return applyIllustrativeReference(schema.tool_key, input, contract.dimension);
  });

  const inputById = new Map(inputs.map((input) => [input.id, input]));
  const normalizedInputs = schema.normalized_inputs.map((normalized) => {
    const input = inputById.get(normalized.from_input);
    if (!input) return normalized;
    return {
      ...normalized,
      quantity_kind: runtimeKindByInput.get(input.id) ?? normalized.quantity_kind,
      base_unit: input.base_unit ?? normalized.base_unit,
    };
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
    normalized_inputs: normalizedInputs,
    outputs: schema.outputs.map((output) => {
      const typedOutput = output as SchemaOutputWithMetadata;
      return isCurrencyOutput(typedOutput)
        ? { ...output, unit: DISPLAY_CURRENCY_UNIT }
        : output;
    }),
  };
}

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
      const dimension = dimensionByRuntimeQuantityKind(noDefault.quantity_kind);
      return applyIllustrativeReference(unitsSafe.tool_key, noDefault, dimension);
    }),
  };
}

function dimensionByRuntimeQuantityKind(quantityKind: string): string {
  if (quantityKind === "runtime_currency") return "currency";
  if (quantityKind.startsWith("runtime_custom_")) return "custom";
  if (quantityKind.startsWith("runtime_dimensionless_")) return "dimensionless";
  return quantityKind.replace(/^runtime_/, "");
}

export const DEFAULT_DISPLAY_CURRENCY: CurrencyCode = "USD";
