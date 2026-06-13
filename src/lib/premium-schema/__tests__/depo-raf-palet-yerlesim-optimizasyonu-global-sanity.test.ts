import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "depo-raf-palet-yerlesim-optimizasyonu";
const PAID_ROUTE_SLUG = "depo-raf-palet-yerlesim-optimizasyonu";

describe("depo-raf-palet-yerlesim-optimizasyonu global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("depo-raf-palet-yerlesim-optimizasyonu");
  });
});
