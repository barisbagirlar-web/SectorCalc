import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "tir-kamyon-yuk-kapasitesi-hesaplama";
const PAID_ROUTE_SLUG = "tir-kamyon-yuk-kapasitesi-hesaplama";

describe("tir-kamyon-yuk-kapasitesi-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("tir-kamyon-yuk-kapasitesi-hesaplama");
  });
});
