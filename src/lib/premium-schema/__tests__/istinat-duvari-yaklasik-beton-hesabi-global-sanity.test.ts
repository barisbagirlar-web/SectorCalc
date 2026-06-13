import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "istinat-duvari-yaklasik-beton-hesabi";
const PAID_ROUTE_SLUG = "istinat-duvari-yaklasik-beton-hesabi";

describe("istinat-duvari-yaklasik-beton-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("istinat-duvari-yaklasik-beton-hesabi");
  });
});
