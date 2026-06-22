import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "shop-rate-hourly-cost-calculator";
const PAID_ROUTE_SLUG = "shop-rate-hourly-cost-calculator";

describe("shop-rate-hourly-cost-calculator global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("shop-rate-hourly-cost-calculator");
  });
});
