import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "cbam-unit-product-carbon-footprint-calculator";
const PAID_ROUTE_SLUG = "cbam-unit-product-carbon-footprint-calculator";

describe("cbam-unit-product-carbon-footprint-calculator global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("cbam-unit-product-carbon-footprint-calculator");
  });
});
