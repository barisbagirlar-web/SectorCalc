import { describe, expect, it } from "vitest";
import { lintAllPremiumSchemas } from "@/lib/premium-schema/schema-linter";
import { PREMIUM_CALCULATOR_SCHEMAS } from "@/lib/premium-schema/schema-registry";

describe("schema-linter baseline", () => {
  it("lints premium 152 batch schemas without errors", () => {
    const report = lintAllPremiumSchemas(PREMIUM_CALCULATOR_SCHEMAS);
    expect(report.valid).toBe(true);
    expect(report.results.every((result) => result.valid)).toBe(true);
  });
});
