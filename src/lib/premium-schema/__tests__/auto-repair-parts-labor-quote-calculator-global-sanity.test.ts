import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "auto-repair-parts-labor-quote-calculator";
const PAID_ROUTE_SLUG = "auto-repair-parts-labor-quote-calculator";

describe("auto-repair-parts-labor-quote-calculator global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("auto-repair-parts-labor-quote-calculator");
  });
});
