import { describe, expect, it } from "vitest";
import {
  parseProNumericDraft,
  sanitizeProNumericDraft,
} from "../numeric-input-draft";

describe("Pro numeric input draft", () => {
  it("keeps the empty draft empty so the final digit can be deleted", () => {
    expect(sanitizeProNumericDraft("", "number")).toBe("");
    expect(parseProNumericDraft("")).toBeNull();
  });

  it("supports the intermediate states required to type negative decimals", () => {
    expect(sanitizeProNumericDraft("-", "number")).toBe("-");
    expect(sanitizeProNumericDraft("-.", "number")).toBe("-.");
    expect(parseProNumericDraft("-")).toBeNull();
    expect(parseProNumericDraft("-.")).toBeNull();
  });

  it("normalizes comma decimals without rounding the computation value", () => {
    const draft = sanitizeProNumericDraft("0,350", "number");
    expect(draft).toBe("0.350");
    expect(parseProNumericDraft(draft)).toBe(0.35);
  });

  it("prevents decimal separators in integer fields", () => {
    const draft = sanitizeProNumericDraft("12.75", "integer");
    expect(draft).toBe("12");
    expect(parseProNumericDraft(draft)).toBe(12);
  });

  it("never emits non-finite values", () => {
    expect(parseProNumericDraft("9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999")).toBeNull();
  });
});
