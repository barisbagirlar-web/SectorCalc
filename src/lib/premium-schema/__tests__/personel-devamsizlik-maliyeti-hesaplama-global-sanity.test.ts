import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "personel-devamsizlik-maliyeti-hesaplama";
const PAID_ROUTE_SLUG = "personel-devamsizlik-maliyeti-hesaplama";

describe("personel-devamsizlik-maliyeti-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("personel-devamsizlik-maliyeti-hesaplama");
  });
});
