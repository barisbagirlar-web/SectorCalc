/**
 * Zod schemas for tool input reference validation.
 * Ensures that reference values, benchmarks, and input metadata
 * conform to the expected structure with proper units and standards.
 */
import { z } from "zod";

/** Whitelist of permitted engineering standard prefixes */
const STANDARD_REGEX = /^(ISO|ASTM|EN|ACI|AISC|ASME|IEC|IEEE|VDI|DIN)\s+\d+/;

/** Whitelist of permitted unit strings */
const UNIT_WHITELIST = new Set([
  "USD", "EUR", "TRY", "GBP", "JPY", "CNY",
  "%", "ratio", "unit", "months", "years", "days", "hours", "minutes", "seconds",
  "mm", "cm", "m", "km", "in", "ft", "yd",
  "kg", "g", "lb", "ton",
  "m/s", "km/h", "mph",
  "m\u00b3", "ft\u00b3", "L", "gal",
  "\u00b0C", "\u00b0F", "K",
  "MPa", "psi", "bar", "Pa", "kPa", "N", "kN", "lbf",
  "kW", "W", "hp", "kWh", "MWh", "J", "BTU",
  "A", "V", "\u03a9", "Hz",
  "\u00b5", "ppm", "dB", "pH", "points",
]);

function isValidUnit(unit: string): boolean {
  if (!unit || unit === "dimensionless" || unit === "" || unit === "-") return true;
  return UNIT_WHITELIST.has(unit);
}

/**
 * Schema for a single reference value.
 * Reference values should have a numeric value, explicit unit,
 * descriptive label, and optional engineering standard.
 */
export const ReferenceSchema = z.object({
  value: z.number(),
  unit: z.string().min(1, "Reference unit is required").refine(isValidUnit, {
    message: "Unit is not in the permitted whitelist",
  }),
  label: z.string().min(5, "Reference label must be at least 5 characters"),
  standard: z
    .string()
    .regex(STANDARD_REGEX, "Standard must match ISO/ASTM/EN/ACI/AISC/ASME/IEC/IEEE/VDI/DIN pattern")
    .optional(),
});

export type ToolInputReference = z.infer<typeof ReferenceSchema>;

/**
 * Schema for a benchmark value displayed in the reference strip.
 */
export const BenchmarkSchema = z.object({
  label: z.string().min(2, "Benchmark label must be at least 2 characters"),
  value: z.number(),
  unit: z.string().optional(),
  type: z.enum(["ratio"]).optional(),
});

/**
 * Schema for a single input field, with optional references array.
 */
export const InputFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["number", "string", "boolean", "select"]),
  unit: z.string().refine(isValidUnit, {
    message: "Field unit is not in the permitted whitelist",
  }),
  references: z.array(ReferenceSchema).optional(),
  benchmarks: z.array(BenchmarkSchema).optional(),
  default: z.union([z.number(), z.string(), z.boolean()]).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

/**
 * Validate a schema-level reference string field.
 * The `reference` field in GeneratedToolSchema is a plain string.
 * This function validates that it can be parsed to a number and
 * issues a warning if it looks like an unvalidated placeholder.
 */
export function validateSchemaReference(
  refValue: unknown,
  inputId: string,
  inputUnit: string,
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  if (refValue === undefined || refValue === null) {
    return { valid: true, warnings: [] };
  }
  const str = String(refValue);
  const num = Number(str);
  if (!Number.isFinite(num)) {
    warnings.push(
      `[REFERENCE] Input "${inputId}": reference "${str}" is not a valid number.`,
    );
    return { valid: false, warnings };
  }
  if (!inputUnit || inputUnit === "unit" || inputUnit === "dimensionless") {
    warnings.push(
      `[REFERENCE] Input "${inputId}": reference value ${num} has no explicit unit.`,
    );
  }
  return { valid: warnings.length === 0, warnings };
}

/**
 * Validate reference string in an adapted ToolInputField.
 * Called at schema-adaptation time to catch bad references early.
 */
export function validateInputFieldReference(
  field: { id: string; reference?: string; unit: string },
): string[] {
  const result = validateSchemaReference(field.reference, field.id, field.unit);
  return result.warnings;
}
