import { describe, expect, test } from "vitest";
import {
  getStandardReferenceById,
  listReferencesForTool,
  resolveReferencesForTool,
  STANDARD_REFERENCE_REGISTRY,
} from "@/lib/content/methodology/standard-reference-registry";

describe("standard reference registry", () => {
  test("entries never claim TSE/ISO compliance", () => {
    for (const entry of STANDARD_REFERENCE_REGISTRY) {
      const combined = `${entry.standardName} ${entry.referenceNote} ${entry.disclaimer}`.toLowerCase();
      expect(combined).not.toMatch(/tse'?ye uygundur|iso certified|fully kvkk compliant|resmi onay/);
    }
  });

  test("missing tool falls back to governance reference", () => {
    const refs = resolveReferencesForTool("unknown-tool-slug");
    expect(refs.length).toBeGreaterThan(0);
    expect(refs[0]?.id).toBe("governance-formula-contract");
  });

  test("tool-specific reference lookup", () => {
    const refs = listReferencesForTool("project-cost-calculator");
    expect(refs.some((r) => r.id === "rsmeans-change-order-waste")).toBe(true);
  });

  test("lookup by id", () => {
    expect(getStandardReferenceById("kvkk-readiness")?.jurisdiction).toBe("TR / EU-oriented");
  });
});
