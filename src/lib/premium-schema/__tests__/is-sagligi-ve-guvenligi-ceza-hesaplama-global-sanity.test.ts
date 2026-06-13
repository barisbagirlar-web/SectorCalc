import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "is-sagligi-ve-guvenligi-ceza-hesaplama";
const PAID_ROUTE_SLUG = "is-sagligi-ve-guvenligi-ceza-hesaplama";

describe("is-sagligi-ve-guvenligi-ceza-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("is-sagligi-ve-guvenligi-ceza-hesaplama");
  });
});
