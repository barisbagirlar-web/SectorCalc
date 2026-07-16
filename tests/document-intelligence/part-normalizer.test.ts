/**
 * Unit Tests: Part Number Normalization
 */
import { describe, it, expect } from "vitest";
import { normalizePartNumber, comparePartNumbers } from "@/lib/document-intelligence/validators/part-normalizer";

describe("normalizePartNumber", () => {
  it("returns empty for null/undefined/empty input", () => {
    expect(normalizePartNumber(null).displayValue).toBe("");
    expect(normalizePartNumber(undefined).displayValue).toBe("");
    expect(normalizePartNumber("").displayValue).toBe("");
    expect(normalizePartNumber("   ").displayValue).toBe("");
  });

  it("trims leading and trailing whitespace", () => {
    const result = normalizePartNumber("  ABC-123  ");
    expect(result.displayValue).toBe("ABC-123");
    expect(result.warnings).toContain("Leading or trailing whitespace trimmed");
  });

  it("preserves leading zeroes", () => {
    const result = normalizePartNumber("00123");
    expect(result.displayValue).toBe("00123");
    expect(result.comparisonKey).toBe("00123");
  });

  it("normalizes dash variants to ASCII hyphen", () => {
    const result = normalizePartNumber("ABC\u2013DEF"); // en-dash
    expect(result.displayValue).toBe("ABC-DEF");
    expect(result.appliedRules).toContain("dash_variants_to_ascii_hyphen");
  });

  it("collapses repeated internal spaces", () => {
    const result = normalizePartNumber("ABC   123");
    expect(result.displayValue).toBe("ABC 123");
    expect(result.appliedRules).toContain("collapse_internal_spaces");
  });

  it("produces uppercase comparison key", () => {
    const result = normalizePartNumber("abc-123");
    expect(result.displayValue).toBe("abc-123");
    expect(result.comparisonKey).toBe("ABC-123");
    expect(result.appliedRules).toContain("uppercase_comparison_key");
  });

  it("normalizes non-breaking spaces", () => {
    const result = normalizePartNumber(`ABC${String.fromCharCode(160)}123`);
    expect(result.displayValue).toBe("ABC 123");
  });

  it("performs unicode NFC normalization", () => {
    const composed = "\u00c7"; // Ç as single codepoint
    const decomposed = "C\u0327"; // C + combining cedilla
    const result = normalizePartNumber(decomposed);
    expect(result.displayValue.normalize("NFC")).toBe(composed);
  });
});

describe("comparePartNumbers", () => {
  it("returns true for identical part numbers", () => {
    const a = normalizePartNumber("ABC-123");
    const b = normalizePartNumber("ABC-123");
    expect(comparePartNumbers(a, b)).toBe(true);
  });

  it("returns true for case-insensitive match", () => {
    const a = normalizePartNumber("ABC-123");
    const b = normalizePartNumber("abc-123");
    expect(comparePartNumbers(a, b)).toBe(true);
  });

  it("returns false for different part numbers", () => {
    const a = normalizePartNumber("ABC-123");
    const b = normalizePartNumber("XYZ-789");
    expect(comparePartNumbers(a, b)).toBe(false);
  });

  it("returns false for empty comparison keys", () => {
    const a = normalizePartNumber("");
    const b = normalizePartNumber("");
    expect(comparePartNumbers(a, b)).toBe(false);
  });
});
