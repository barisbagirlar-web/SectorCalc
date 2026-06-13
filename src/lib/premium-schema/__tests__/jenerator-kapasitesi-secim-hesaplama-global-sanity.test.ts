import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "jenerator-kapasitesi-secim-hesaplama";
const PAID_ROUTE_SLUG = "jenerator-kapasitesi-secim-hesaplama";

describe("jenerator-kapasitesi-secim-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("jenerator-kapasitesi-secim-hesaplama");
  });
});
