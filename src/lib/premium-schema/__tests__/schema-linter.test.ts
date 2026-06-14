import { describe, expect, it } from "vitest";
import { PREMIUM_CALCULATOR_SCHEMAS } from "@/lib/premium-schema/schema-registry";

describe("schema-linter baseline", () => {
  it("allows empty registry during regeneration", () => {
    expect(PREMIUM_CALCULATOR_SCHEMAS).toEqual([]);
  });
});
