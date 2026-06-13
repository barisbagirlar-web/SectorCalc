import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "ic-verim-orani-irr-hesaplama";
const PAID_ROUTE_SLUG = "ic-verim-orani-irr-hesaplama";

describe("ic-verim-orani-irr-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("ic-verim-orani-irr-hesaplama");
  });
});
