// SectorCalc V5.3.1 — Schema Reference Enrichment Layer
// Server-only. Derives default/reference metadata from existing schema field data
// (engineering_range, physical_hard_bounds, precision_policy).
// Never fabricates external standard values. Never claims paid-standard tables.
// Every derived value is tagged with a reference_origin.
//
// This module is designed to be called AFTER schema validation but BEFORE
// freeze & cache, so the enriched data flows through the normalizer
// and renders as "Default / Reference" in the form UI.

import type {
  SuperV4Schema,
  SuperV4Input,
  EngineeringReferenceRange,
  PhysicalHardBounds,
  ReferenceValuesObject,
} from "@/sectorcalc/pro-form/contract-types";

// ── Public enrichment metadata type ──────────────────────────────────────────

export type ReferenceOrigin =
  | "declared"
  | "midpoint_of_engineering_range"
  | "midpoint_of_physical_hard_bounds"
  | "bound_of_engineering_range"
  | "bound_of_physical_hard_bounds"
  | "not_available";

export interface EnrichedFieldMeta {
  /** The recommended conservative reference value (numeric midpoint) or null */
  defaultReferenceValue: number | null;
  /** Human-readable text describing the reference */
  defaultReferenceText: string | null;
  /** Unit of the reference */
  referenceUnit: string;
  /** How this value was obtained */
  referenceOrigin: ReferenceOrigin;
  /** Source attribution text */
  referenceSource: string;
  /** Additional human-readable note */
  referenceNote: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

function safeUnit(unit: unknown): string {
  if (typeof unit === "string" && unit.trim().length > 0) return unit.trim();
  return "";
}

function fieldUnit(field: SuperV4Input): string {
  for (const k of ["base_unit", "unit", "displayUnit", "baseUnit"] as const) {
    const v = (field as unknown as Record<string, unknown>)[k];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  if (Array.isArray(field.allowed_display_units) && field.allowed_display_units.length > 0) {
    return field.allowed_display_units[0];
  }
  return "";
}

function formatRange(rmin: number, rmax: number, unitStr: string): string {
  return unitStr ? `${rmin}–${rmax} ${unitStr}` : `${rmin}–${rmax}`;
}

function formatMin(min: number, unitStr: string): string {
  return unitStr ? `≥ ${min} ${unitStr}` : `≥ ${min}`;
}

function formatMax(max: number, unitStr: string): string {
  return unitStr ? `≤ ${max} ${unitStr}` : `≤ ${max}`;
}

// ── Derivers ─────────────────────────────────────────────────────────────────

function deriveFromEngineeringRangeMidpoint(
  field: SuperV4Input,
  er: EngineeringReferenceRange,
): EnrichedFieldMeta | null {
  const { min, max, unit, source } = er;
  const unitStr = safeUnit(unit) || fieldUnit(field);
  if (!isNumber(min) || !isNumber(max)) return null;
  const midpoint = (min + max) / 2;
  return {
    defaultReferenceValue: midpoint,
    defaultReferenceText: formatRange(min, max, unitStr),
    referenceUnit: unitStr,
    referenceOrigin: "midpoint_of_engineering_range",
    referenceSource:
      source ||
      "Derived from declared schema engineering range; verify against project source data.",
    referenceNote: `Midpoint of engineering range [${min}–${max} ${unitStr}]. Advisory — must not autofill measured values.`,
  };
}

function deriveFromPhysicalHardBoundsMidpoint(
  field: SuperV4Input,
  phb: PhysicalHardBounds,
): EnrichedFieldMeta | null {
  const { min, max, unit } = phb;
  const unitStr = safeUnit(unit) || fieldUnit(field);
  if (!isNumber(min) || !isNumber(max)) return null;
  const midpoint = (min + max) / 2;
  return {
    defaultReferenceValue: midpoint,
    defaultReferenceText: formatRange(min, max, unitStr),
    referenceUnit: unitStr,
    referenceOrigin: "midpoint_of_physical_hard_bounds",
    referenceSource:
      "Derived from declared schema physical hard bounds; verify against project source data.",
    referenceNote: `Midpoint of physical hard bounds [${min}–${max} ${unitStr}]. Advisory — must not autofill measured values.`,
  };
}

function deriveFromEngineeringRangeBound(
  field: SuperV4Input,
  er: EngineeringReferenceRange,
): EnrichedFieldMeta | null {
  const { min, max, unit, source } = er;
  const unitStr = safeUnit(unit) || fieldUnit(field);
  if (isNumber(min)) {
    return {
      defaultReferenceValue: null,
      defaultReferenceText: formatMin(min, unitStr),
      referenceUnit: unitStr,
      referenceOrigin: "bound_of_engineering_range",
      referenceSource:
        source ||
        "Derived from declared schema engineering range lower bound; verify against project source data.",
      referenceNote: `Lower bound of engineering range (≥ ${min} ${unitStr}). Advisory — must not autofill measured values.`,
    };
  }
  if (isNumber(max)) {
    return {
      defaultReferenceValue: null,
      defaultReferenceText: formatMax(max, unitStr),
      referenceUnit: unitStr,
      referenceOrigin: "bound_of_engineering_range",
      referenceSource:
        source ||
        "Derived from declared schema engineering range upper bound; verify against project source data.",
      referenceNote: `Upper bound of engineering range (≤ ${max} ${unitStr}). Advisory — must not autofill measured values.`,
    };
  }
  return null;
}

function deriveFromPhysicalHardBoundsBound(
  field: SuperV4Input,
  phb: PhysicalHardBounds,
): EnrichedFieldMeta | null {
  const { min, max, unit } = phb;
  const unitStr = safeUnit(unit) || fieldUnit(field);
  if (isNumber(min) && isNumber(max)) return null;
  if (isNumber(min)) {
    return {
      defaultReferenceValue: null,
      defaultReferenceText: formatMin(min, unitStr),
      referenceUnit: unitStr,
      referenceOrigin: "bound_of_physical_hard_bounds",
      referenceSource:
        "Derived from declared schema physical hard bounds; verify against project source data.",
      referenceNote: `Lower bound of physical hard bounds (≥ ${min} ${unitStr}). Advisory — must not autofill measured values.`,
    };
  }
  if (isNumber(max)) {
    return {
      defaultReferenceValue: null,
      defaultReferenceText: formatMax(max, unitStr),
      referenceUnit: unitStr,
      referenceOrigin: "bound_of_physical_hard_bounds",
      referenceSource:
        "Derived from declared schema physical hard bounds; verify against project source data.",
      referenceNote: `Upper bound of physical hard bounds (≤ ${max} ${unitStr}). Advisory — must not autofill measured values.`,
    };
  }
  return null;
}

// ── Main enrich function ────────────────────────────────────────────────────

function enrichField(field: SuperV4Input): EnrichedFieldMeta | null {
  // Priority 1: Already-declared default_value
  if (field.default_value !== undefined && field.default_value !== null) {
    const dv = field.default_value;
    const numVal =
      typeof dv === "number" ? dv : typeof dv === "string" ? parseFloat(dv) : NaN;
    if (Number.isFinite(numVal)) {
      const unitStr = fieldUnit(field);
      const rv = field.reference_values;
      const rvSource =
        rv && !Array.isArray(rv)
          ? (rv as ReferenceValuesObject).source
          : "Declared in schema.";
      const rvNote =
        rv && !Array.isArray(rv)
          ? (rv as ReferenceValuesObject).public_note || ""
          : "";
      return {
        defaultReferenceValue: numVal,
        defaultReferenceText: unitStr ? `${numVal} ${unitStr}` : `${numVal}`,
        referenceUnit: unitStr,
        referenceOrigin: "declared",
        referenceSource: rvSource,
        referenceNote: rvNote,
      };
    }
  }

  // Priority 2: engineering_range (both bounds) → midpoint
  const er = field.engineering_range || field.engineering_reference_range;
  if (er) {
    const mid = deriveFromEngineeringRangeMidpoint(field, er);
    if (mid) return mid;
  }

  // Priority 3: physical_hard_bounds (both bounds) → midpoint
  const phb = field.physical_hard_bounds;
  if (phb) {
    const mid = deriveFromPhysicalHardBoundsMidpoint(field, phb);
    if (mid) return mid;
  }

  // Priority 4: engineering_range (single bound) → bound text, no numeric default
  if (er) {
    const bound = deriveFromEngineeringRangeBound(field, er);
    if (bound) return bound;
  }

  // Priority 5: physical_hard_bounds (single bound) → bound text, no numeric default
  if (phb) {
    const bound = deriveFromPhysicalHardBoundsBound(field, phb);
    if (bound) return bound;
  }

  return null;
}

// ── Public API ──────────────────────────────────────────────────────────────

export function enrichV531SchemaReferences(
  schema: SuperV4Schema,
): SuperV4Schema {
  const enriched: SuperV4Schema = JSON.parse(JSON.stringify(schema));
  if (!Array.isArray(enriched.inputs)) return enriched;

  for (const field of enriched.inputs) {
    const meta = enrichField(field);
    if (!meta) continue;

    // Set default_value only for declared or midpoint origins
    if (
      meta.referenceOrigin === "declared" ||
      meta.referenceOrigin.includes("midpoint")
    ) {
      if (meta.defaultReferenceValue !== null) {
        field.default_value = meta.defaultReferenceValue;
      }
    }

    if (meta.defaultReferenceText) {
      (field as unknown as Record<string, unknown>)["_reference_default_text"] =
        meta.defaultReferenceText;
    }

    (field as unknown as Record<string, unknown>)["_reference_origin"] =
      meta.referenceOrigin;
    (field as unknown as Record<string, unknown>)["_reference_source"] =
      meta.referenceSource;
    (field as unknown as Record<string, unknown>)["_reference_note"] =
      meta.referenceNote;

    if (
      meta.referenceNote &&
      field.reference_values &&
      !Array.isArray(field.reference_values)
    ) {
      const rv = field.reference_values as ReferenceValuesObject;
      if (typeof rv.public_note === "string") {
        (rv as unknown as Record<string, unknown>)["public_note"] =
          rv.public_note + " " + meta.referenceNote;
      }
    }
  }

  return enriched;
}
