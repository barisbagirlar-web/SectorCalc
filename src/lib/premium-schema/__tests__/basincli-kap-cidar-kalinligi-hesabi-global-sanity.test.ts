import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "basincli-kap-cidar-kalinligi-hesabi";
const PAID_ROUTE_SLUG = "basincli-kap-cidar-kalinligi-hesabi";

describe("basincli-kap-cidar-kalinligi-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("basincli-kap-cidar-kalinligi-hesabi");
  });
});
