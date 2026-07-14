/**
 * Part-Number Normalization — Deterministic, raw-value preserving.
 *
 * Allowed operations (configurable by rule):
 * - Unicode normalization (NFC)
 * - trim whitespace
 * - collapse repeated internal spaces
 * - normalize dash variants to ASCII hyphen
 * - normalize non-breaking spaces
 * - optional uppercase comparison key
 * - preserve leading zeroes
 * - preserve meaningful slash, dot, hyphen, prefix and suffix
 *
 * Never infers a new OEM number.
 * Never merges records based only on fuzzy similarity.
 */

import type { NormalizedPart } from "@/types/document-intelligence";

export interface NormalizationOptions {
  uppercaseComparisonKey?: boolean;
  trimWhitespace?: boolean;
  collapseSpaces?: boolean;
  normalizeDashes?: boolean;
  normalizeNonBreakingSpaces?: boolean;
}

const DEFAULT_OPTIONS: Required<NormalizationOptions> = {
  uppercaseComparisonKey: true,
  trimWhitespace: true,
  collapseSpaces: true,
  normalizeDashes: true,
  normalizeNonBreakingSpaces: true,
};

const NBSP = "\u00A0";
const DASH_VARIANTS = /[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g;

export function normalizePartNumber(
  raw: string | null | undefined,
  options: NormalizationOptions = {}
): NormalizedPart {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const warnings: string[] = [];
  const appliedRules: string[] = [];

  if (!raw || raw.trim().length === 0) {
    return {
      displayValue: "",
      comparisonKey: "",
      appliedRules: [],
      warnings: ["Empty or null part number"],
    };
  }

  let value = raw.normalize("NFC");
  appliedRules.push("unicode_nfc");

  if (opts.normalizeNonBreakingSpaces && value.includes(NBSP)) {
    value = value.replaceAll(NBSP, " ");
    appliedRules.push("nbs_to_space");
  }

  if (opts.normalizeDashes && DASH_VARIANTS.test(value)) {
    value = value.replace(DASH_VARIANTS, "-");
    appliedRules.push("dash_variants_to_ascii_hyphen");
  }

  if (opts.trimWhitespace) {
    const trimmed = value.trim();
    if (trimmed !== value) {
      warnings.push("Leading or trailing whitespace trimmed");
      appliedRules.push("trim_whitespace");
    }
    value = trimmed;
  }

  if (opts.collapseSpaces) {
    const collapsed = value.replace(/ {2,}/g, " ");
    if (collapsed !== value) {
      warnings.push("Repeated internal spaces collapsed");
      appliedRules.push("collapse_internal_spaces");
    }
    value = collapsed;
  }

  const displayValue = value;

  let comparisonKey = value;
  if (opts.uppercaseComparisonKey) {
    comparisonKey = value.toUpperCase();
    if (comparisonKey !== value) {
      appliedRules.push("uppercase_comparison_key");
    }
  }

  return { displayValue, comparisonKey, appliedRules, warnings };
}

export function comparePartNumbers(a: NormalizedPart, b: NormalizedPart): boolean {
  return a.comparisonKey === b.comparisonKey && a.comparisonKey.length > 0;
}
