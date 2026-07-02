/**
 * Global Reference Contract - FormReferenceBindingContract
 *
 * Build-time validated Zod schema for binding reference data to form inputs.
 * Every reference value MUST have an explicit unit from the whitelist.
 * Unitless numbers are CRITICAL ERRORS.
 *
 * Allowed standards: ISO, ASTM, EN, ACI, AISC, ASME, IEC, IEEE only.
 * Local/national standards (TS, GOST, JIS, DIN, BS) are FORBIDDEN.
 */

import { z } from "zod";

// ─── Unit Whitelist ───────────────────────────────────────────────────────
// Every reference value MUST have an explicit unit from this list.
export const UNIT_WHITELIST = [
  "MPa",
  "GPa",
  "psi",
  "kg/m3",
  "lb/ft3",
  "g/cm3",
  "mm",
  "in",
  "m",
  "ft",
  "Pa·s",
  "h",
  "min",
  "pcs",
  "USD",
  "%",
] as const;

export type UnitWhitelist = (typeof UNIT_WHITELIST)[number];

// ─── Project Unit System ──────────────────────────────────────────────────
export const ProjectUnitSystem = z.enum(["METRIC_ONLY", "IMPERIAL_ONLY", "GLOBAL"]);
export type ProjectUnitSystemType = z.infer<typeof ProjectUnitSystem>;

// ─── Allowed Standards ────────────────────────────────────────────────────
export const ALLOWED_STANDARDS = [
  "ISO",
  "ASTM",
  "EN",
  "ACI",
  "AISC",
  "ASME",
  "IEC",
  "IEEE",
] as const;

// ─── Reference Item ───────────────────────────────────────────────────────
export const ReferenceItem = z.object({
  /** Human-readable label shown in the dropdown/selector */
  label: z.string().min(1),
  /** Numeric reference value */
  value: z.number(),
  /** Unit from whitelist - unitless numbers are CRITICAL ERRORS */
  unit: z.enum(UNIT_WHITELIST),
  /** Source standard identifier (e.g., "EN 10025-2", "ISO 898-1") */
  source: z.string().min(1),
  /** Optional detailed description */
  description: z.string().optional(),
});

export type ReferenceItemType = z.infer<typeof ReferenceItem>;

// ─── FormReferenceBindingContract ─────────────────────────────────────────
export const FormReferenceBindingContract = z.object({
  /** Tool ID that this binding belongs to (e.g., "beam-weight-analyzer") */
  toolId: z.string().min(1),
  /** Input key within the tool schema (e.g., "steelDensity") */
  inputKey: z.string().min(1),
  /** Primary standard identifier (e.g., "ISO 898-1") */
  standard: z.string().min(1),
  /** Unit system filter: METRIC_ONLY, IMPERIAL_ONLY, or GLOBAL */
  projectUnitSystem: ProjectUnitSystem,
  /** Array of reference values - at least one required */
  references: z.array(ReferenceItem).min(1),
});

export type FormReferenceBindingContractType = z.infer<
  typeof FormReferenceBindingContract
>;

// ─── Registry shape ───────────────────────────────────────────────────────
// registry[toolId][inputKey] = FormReferenceBindingContractType
export type ReferenceRegistry = Record<
  string,
  Record<string, FormReferenceBindingContractType>
>;

// ─── Validation Helper ────────────────────────────────────────────────────
/**
 * Validates a raw object against FormReferenceBindingContract.
 * Throws a detailed ZodError if validation fails.
 */
export function validateReferenceBinding(
  data: unknown,
): FormReferenceBindingContractType {
  return FormReferenceBindingContract.parse(data);
}
