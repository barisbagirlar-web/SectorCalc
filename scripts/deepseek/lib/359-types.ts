/**
 * Compact tool definition types for 359 free tool generator.
 * Units: lbs, USD/TRY, %, years, months, kg, m, N, Pa, etc.
 */

export type InputDef = {
  id: string;          // camelCase input identifier
  lt: string;          // Label (Turkish)
  le?: string;         // Label (English) - falls back to lt
  u: string;           // Unit
  d?: number;          // Default value
  mn?: number;         // Min value
  mx?: number;         // Max value
  ct: string;          // Business context (Turkish)
  ce?: string;         // Business context (English)
};

export type ToolDef = {
  slug: string;        // URL slug
  dt: string;          // Description (Turkish)
  de: string;          // Description (English)
  cat: string;         // Catalog category
  st: string;          // Sector (Turkish)
  inputs: InputDef[];
  f: Record<string, string>;          // Formulas (JS expressions)
  op: string;          // Primary output key
  ou: string;          // Output unit
  ok: string[];        // Output breakdown keys
  ol?: Record<string, string>;        // Output labels {key: label}
  ld?: string[];       // Loss drivers
  sa?: string[];       // Suggested actions
};
