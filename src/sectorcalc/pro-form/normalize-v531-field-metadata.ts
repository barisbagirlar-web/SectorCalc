// SectorCalc V5.3.1 — Field Metadata Normalizer
// Derives display-ready metadata values from schema field objects.
// Never fabricates industrial numbers. Returns null when no declared value exists.

import type { SuperV4Input } from "./contract-types";

// ── Public output type ──────────────────────────────────────────────────────────

export interface NormalizedFieldMetadata {
  /** Display unit label derived from base_unit / unit / unitLabel / displayUnit / baseUnit */
  unitLabel: string;
  /** Default / defaultValue / example / sampleValue — stringified or null */
  defaultReference: string | null;
  /** Origin of the reference value: declared, midpoint_of_*, bound_of_*, or null */
  referenceOrigin: string | null;
  /** Source attribution for the reference value */
  referenceSource: string | null;
  /** Human-readable note about the reference value */
  referenceNote: string | null;
  /** Range description built from min/max/minimum/maximum/range/allowedRange/recommendedRange */
  allowedRange: string | null;
  /** Accepted values from options/values/acceptedValues/allowedValues/enum/choices */
  acceptedValues: string[] | null;
  /** Tolerance / uncertainty / sigma / margin / safetyMargin — stringified or null */
  toleranceText: string | null;
  /** Source / evidence / help / description text */
  evidenceText: string | null;
}

// ── Search key sets (aligned with audit script) ─────────────────────────────────

const UNIT_KEYS = new Set(["unit", "unitLabel", "displayUnit", "baseUnit"]);
const DEFAULT_KEYS = new Set(["default", "defaultValue", "example", "sampleValue"]);
const RANGE_MIN_KEYS = new Set(["min", "minimum"]);
const RANGE_MAX_KEYS = new Set(["max", "maximum"]);
const RANGE_OBJECT_KEYS = new Set(["range", "allowedRange", "recommendedRange"]);
const OPTIONS_KEYS = new Set(["options", "values", "acceptedValues", "allowedValues", "enum", "choices"]);
const TOLERANCE_KEYS = new Set([
  "tolerance",
  "tolerances",
  "allowedTolerance",
  "uncertainty",
  "sigma",
  "margin",
  "safetyMargin",
]);
const EVIDENCE_TEXT_KEYS = new Set([
  "reference",
  "references",
  "evidence",
  "help",
  "description",
]);
const EVIDENCE_SOURCE_KEYS = new Set(["source", "user_help_text", "help_text"]);

// ── Helpers ─────────────────────────────────────────────────────────────────────

function firstString(obj: Record<string, unknown>, keys: Set<string>): string | null {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return null;
}

function firstNumber(obj: Record<string, unknown>, keys: Set<string>): number | null {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return null;
}

function firstArray(obj: Record<string, unknown>, keys: Set<string>): unknown[] | null {
  for (const key of keys) {
    const v = obj[key];
    if (Array.isArray(v) && v.length > 0) return v;
  }
  return null;
}

function deepStringValue(obj: unknown, keys: Set<string>): string | null {
  if (!obj || typeof obj !== "object") return null;
  const stack: unknown[] = [obj];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    for (const [key, value] of Object.entries(node)) {
      if (keys.has(key) && typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return null;
}

function deepNumberValue(obj: unknown, keys: Set<string>): number | null {
  if (!obj || typeof obj !== "object") return null;
  const stack: unknown[] = [obj];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    for (const [key, value] of Object.entries(node)) {
      if (keys.has(key) && typeof value === "number" && Number.isFinite(value)) {
        return value;
      }
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return null;
}

function deepArrayValue(obj: unknown, keys: Set<string>): unknown[] | null {
  if (!obj || typeof obj !== "object") return null;
  const stack: unknown[] = [obj];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    for (const [key, value] of Object.entries(node)) {
      if (keys.has(key) && Array.isArray(value) && value.length > 0) {
        return value;
      }
      if (value && typeof value === "object" && !Array.isArray(value)) stack.push(value);
    }
  }
  return null;
}

/** Try to extract a numeric hard bound range from physical_hard_bounds style sub-objects. */
function extractHardBoundRange(field: Record<string, unknown>): string | null {
  // Try physical_hard_bounds  (SuperV4Input standard)
  const hb = field["physical_hard_bounds"];
  if (hb && typeof hb === "object") {
    const hbObj = hb as Record<string, unknown>;
    const minV = hbObj["min"];
    const maxV = hbObj["max"];
    const unitV = typeof hbObj["unit"] === "string" ? (hbObj["unit"] as string).trim() : "";
    const min = typeof minV === "number" ? minV : null;
    const max = typeof maxV === "number" ? maxV : null;
    if (min !== null && max !== null) {
      return unitV ? `${min}–${max} ${unitV}` : `${min}–${max}`;
    }
    if (min !== null) {
      return unitV ? `≥ ${min} ${unitV}` : `≥ ${min}`;
    }
    if (max !== null) {
      return unitV ? `≤ ${max} ${unitV}` : `≤ ${max}`;
    }
  }

  // Try engineering_range / engineering_reference_range
  for (const rangeKey of ["engineering_range", "engineering_reference_range"]) {
    const er = field[rangeKey];
    if (er && typeof er === "object") {
      const erObj = er as Record<string, unknown>;
      const minV = erObj["min"];
      const maxV = erObj["max"];
      const unitV = typeof erObj["unit"] === "string" ? (erObj["unit"] as string).trim() : "";
      const min = typeof minV === "number" ? minV : null;
      const max = typeof maxV === "number" ? maxV : null;
      if (min !== null && max !== null) {
        return unitV ? `${min}–${max} ${unitV}` : `${min}–${max}`;
      }
      if (min !== null) {
        return unitV ? `≥ ${min} ${unitV}` : `≥ ${min}`;
      }
      if (max !== null) {
        return unitV ? `≤ ${max} ${unitV}` : `≤ ${max}`;
      }
    }
  }

  // Top-level min/max fallback
  const topMin = firstNumber(field, RANGE_MIN_KEYS);
  const topMax = firstNumber(field, RANGE_MAX_KEYS);
  if (topMin !== null && topMax !== null) {
    return `${topMin}–${topMax}`;
  }
  if (topMin !== null) return `≥ ${topMin}`;
  if (topMax !== null) return `≤ ${topMax}`;

  // Ranged objects (range / allowedRange / recommendedRange)
  const rangeObj = field["range"] ?? field["allowedRange"] ?? field["recommendedRange"];
  if (rangeObj && typeof rangeObj === "object") {
    const ro = rangeObj as Record<string, unknown>;
    const lo = ro["low"] ?? ro["min"] ?? ro["lower"];
    const hi = ro["high"] ?? ro["max"] ?? ro["upper"];
    const ru = ro["unit"] ?? "";
    const loN = typeof lo === "number" ? lo : null;
    const hiN = typeof hi === "number" ? hi : null;
    if (loN !== null && hiN !== null) {
      return ru ? `${loN}–${hiN} ${ru}` : `${loN}–${hiN}`;
    }
    if (loN !== null) return ru ? `≥ ${loN} ${ru}` : `≥ ${loN}`;
    if (hiN !== null) return ru ? `≤ ${hiN} ${ru}` : `≤ ${hiN}`;
  }

  return null;
}

/** Extract default / defaultValue / example / sampleValue */
function extractDefaultReference(field: Record<string, unknown>): string | null {
  // Priority 1: Enriched _reference_default_text (human-readable bound/range description)
  const rdt = field["_reference_default_text"];
  if (typeof rdt === "string" && rdt.trim().length > 0) return rdt.trim();
  // Priority 2: Prefer typed SuperV4Input fields
  if (field["default_value"] !== undefined && field["default_value"] !== null) {
    const dv = field["default_value"];
    if (typeof dv === "number") return String(dv);
    if (typeof dv === "string" && dv.length > 0) return dv;
    if (typeof dv === "boolean") return dv ? "true" : "false";
  }
  if (field["default"] !== undefined && field["default"] !== null) {
    const d = field["default"];
    if (typeof d === "number") return String(d);
    if (typeof d === "string" && d.length > 0) return d;
    if (typeof d === "boolean") return d ? "true" : "false";
  }
  // Fallback: generic deep search
  const raw = firstString(field, DEFAULT_KEYS);
  if (raw) return raw;
  const num = firstNumber(field, DEFAULT_KEYS);
  if (num !== null) return String(num);
  return null;
}

/** Extract accepted values from options/values/acceptedValues/allowedValues/enum/choices */
function extractAcceptedValues(field: Record<string, unknown>): string[] | null {
  // SuperV4Input has allowed_values
  const av = field["allowed_values"];
  if (Array.isArray(av) && av.length > 0) {
    return av.map(String);
  }
  // Fallback deep search
  const arr = firstArray(field, OPTIONS_KEYS);
  if (arr) {
    return arr.map((v: unknown) => (typeof v === "object" && v !== null ? String((v as Record<string, unknown>)["value"] ?? (v as Record<string, unknown>)["label"] ?? v) : String(v)));
  }
  return null;
}

/** Extract tolerance / uncertainty / sigma / margin / safetyMargin */
function extractToleranceText(field: Record<string, unknown>): string | null {
  // Check precision_policy (SuperV4Input standard)
  const pp = field["precision_policy"];
  if (pp && typeof pp === "object") {
    const ppObj = pp as Record<string, unknown>;
    const dec = ppObj["input_decimals"];
    if (typeof dec === "number" && Number.isFinite(dec)) {
      return `±${(0.5 * Math.pow(10, -dec)).toFixed(dec + 1)} (${dec} decimal places)`;
    }
  }
  // Check precision (legacy)
  const prec = field["precision"];
  if (prec && typeof prec === "object") {
    const precObj = prec as Record<string, unknown>;
    const dec = precObj["input_decimals"];
    if (typeof dec === "number" && Number.isFinite(dec)) {
      return `±${(0.5 * Math.pow(10, -dec)).toFixed(dec + 1)} (${dec} decimal places)`;
    }
  }
  // Check resolution
  const res = field["resolution"];
  if (typeof res === "number" && Number.isFinite(res) && res > 0) {
    return `±${(res / 2)} (resolution)`;
  }
  // Check uncertainty_statement
  const us = field["uncertainty_statement"];
  if (typeof us === "string" && us.trim().length > 0) {
    return us.trim();
  }
  // Deep search for tolerance keys
  const raw = firstString(field, TOLERANCE_KEYS);
  if (raw) return raw;
  const num = firstNumber(field, TOLERANCE_KEYS);
  if (num !== null) return `${num}`;
  return null;
}

/** Extract source/evidence/reference text */
function extractEvidenceText(field: Record<string, unknown>): string | null {
  // Try reference_values.source (SuperV4Input standard)
  const rv = field["reference_values"];
  if (rv && typeof rv === "object") {
    const rvObj = rv as Record<string, unknown>;
    const src = rvObj["source"];
    if (typeof src === "string" && src.trim().length > 0) return src.trim();
    const pubNote = rvObj["public_note"];
    if (typeof pubNote === "string" && pubNote.trim().length > 0) return pubNote.trim();
  }
  // Try user_help_text / help_text
  const help = firstString(field, EVIDENCE_SOURCE_KEYS);
  if (help) return help;
  // Try source field
  const src = field["source"];
  if (typeof src === "string" && src.trim().length > 0) return src.trim();
  // Deep search for evidence/reference text
  const deep = deepStringValue(field, EVIDENCE_TEXT_KEYS);
  if (deep) return deep;
  return null;
}

/** Extract `_reference_origin` from enriched schema fields */
function extractEnrichedOrigin(field: Record<string, unknown>): string | null {
  const v = field["_reference_origin"];
  if (typeof v === "string" && v.trim().length > 0) return v.trim();
  return null;
}

/** Extract `_reference_source` from enriched schema fields */
function extractEnrichedSource(field: Record<string, unknown>): string | null {
  const v = field["_reference_source"];
  if (typeof v === "string" && v.trim().length > 0) return v.trim();
  return null;
}

/** Extract `_reference_note` from enriched schema fields */
function extractEnrichedNote(field: Record<string, unknown>): string | null {
  const v = field["_reference_note"];
  if (typeof v === "string" && v.trim().length > 0) return v.trim();
  return null;
}

/** Extract unit label */
function extractUnitLabel(field: Record<string, unknown>): string {
  // SuperV4Input has base_unit
  const bu = field["base_unit"];
  if (typeof bu === "string" && bu.trim().length > 0) return bu.trim();
  // allowed_display_units first
  const units = field["allowed_display_units"];
  if (Array.isArray(units) && units.length > 0) {
    return String(units[0]);
  }
  // Generic key search
  const raw = firstString(field, UNIT_KEYS);
  if (raw) return raw;
  return "";
}

// ── Main normalizer ─────────────────────────────────────────────────────────────

/**
 * normalizeV531FieldMetadata
 *
 * Derives a NormalizedFieldMetadata from any schema field object.
 * Accepts a SuperV4Input-conforming object or a generic Record<string, unknown>.
 * Never fabricates industrial numbers — returns null for absent values.
 *
 * @param field - Schema field object (SuperV4Input or generic)
 * @param schema - Optional parent schema for context (currently unused, reserved for future cross-field resolution)
 */
export function normalizeV531FieldMetadata(
  field: SuperV4Input | Record<string, unknown>,
  _schema?: unknown,
): NormalizedFieldMetadata {
  const f = field as Record<string, unknown>;

  return {
    unitLabel: extractUnitLabel(f),
    defaultReference: extractDefaultReference(f),
    referenceOrigin: extractEnrichedOrigin(f),
    referenceSource: extractEnrichedSource(f),
    referenceNote: extractEnrichedNote(f),
    allowedRange: extractHardBoundRange(f),
    acceptedValues: extractAcceptedValues(f),
    toleranceText: extractToleranceText(f),
    evidenceText: extractEvidenceText(f),
  };
}
