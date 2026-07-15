// SectorCalc — Engine Kit V5.4
// Shared helpers for pure calculation engines.
// No DOM, no window, no side effects.
// All functions are unit-blind — they operate on canonical values only.

import { toCanonical, fromCanonical, type DomainKey } from "./units";

// ── Safe math ──────────────────────────────────────────────────────────────

/** Type guard: value is a finite number (not NaN, not Infinity). */
export function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

/** Safe getter: returns 0 for missing/non-finite inputs. */
export function safeGet(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

/** Safe getter with fallback. */
export function getWithDefault(
  inputs: Record<string, number>,
  key: string,
  fallback: number
): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : fallback;
}

/** Safe division: returns fallback when denominator is 0 or non-finite. */
export function safeDiv(num: number, den: number, fallback = 0): number {
  if (!isFiniteNumber(num)) return fallback;
  if (!isFiniteNumber(den) || den === 0) return fallback;
  return num / den;
}

/** Round to d decimal places. Falls back to 0 on non-finite input. */
export function roundTo(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

/** Clamp value to [min, max]. */
export function clamp(v: number, min: number, max: number): number {
  if (!isFiniteNumber(v)) return min;
  return Math.max(min, Math.min(max, v));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ── Unit-aware helpers (for canonical conversions) ─────────────────────────

/** Alias for toCanonical — converts display value to canonical. */
export const displayToCanonical = toCanonical;

/** Alias for fromCanonical — converts canonical value to display. */
export const canonicalToDisplay = fromCanonical;

/** Compute conversion factor between two units in the same domain. */
export function conversionFactor(
  domain: DomainKey,
  fromUnit: string,
  toUnit: string
): number {
  if (fromUnit === toUnit) return 1;
  // Convert 1 unit from fromUnit to canonical, then back to toUnit
  const canon = toCanonical(domain, 1, fromUnit);
  return fromCanonical(domain, canon, toUnit);
}

// ── Validation helpers ─────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  severity?: "error" | "warn";
}

/** Check if a value is within plausible range. Returns a validation result. */
export function checkPlausible(
  value: number,
  label: string,
  min: number,
  max: number
): ValidationResult {
  if (!isFiniteNumber(value)) {
    return { valid: false, reason: `${label} is not a finite number`, severity: "error" };
  }
  if (value < min) {
    return { valid: false, reason: `${label} (${value}) is below plausible minimum ${min}`, severity: "warn" };
  }
  if (value > max) {
    return { valid: false, reason: `${label} (${value}) exceeds plausible maximum ${max}`, severity: "warn" };
  }
  return { valid: true };
}

/** Check if a value is within hard bounds (blocks calculation). */
export function checkHardBound(
  value: number,
  label: string,
  min: number,
  max: number
): ValidationResult {
  if (!isFiniteNumber(value)) {
    return { valid: false, reason: `${label} is not a finite number`, severity: "error" };
  }
  if (value < min) {
    return { valid: false, reason: `${label} (${value}) is below hard minimum ${min}`, severity: "error" };
  }
  if (value > max) {
    return { valid: false, reason: `${label} (${value}) exceeds hard maximum ${max}`, severity: "error" };
  }
  return { valid: true };
}

// ── Output formatting ──────────────────────────────────────────────────────

export interface EngineOutput {
  value: number;
  unit?: string;
  label: string;
  description?: string;
}

export interface EngineResult {
  status: "OK" | "REVIEW" | "BLOCKED";
  outputs: Record<string, number>;
  outputMeta: Record<string, EngineOutput>;
  warnings: string[];
  outputKeys: string[];
}
