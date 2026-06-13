import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "mil-aks-capi-hesabi-egilme-burulma";
const PAID_ROUTE_SLUG = "mil-aks-capi-hesabi-egilme-burulma";

describe("mil-aks-capi-hesabi-egilme-burulma global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("mil-aks-capi-hesabi-egilme-burulma");
  });
});
