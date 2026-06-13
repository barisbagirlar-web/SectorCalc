import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "fazla-mesai-ucreti-hesaplama";
const PAID_ROUTE_SLUG = "fazla-mesai-ucreti-hesaplama";

describe("fazla-mesai-ucreti-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("fazla-mesai-ucreti-hesaplama");
  });
});
