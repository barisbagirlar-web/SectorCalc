import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "toplanti-saati-maliyeti-hesaplama";
const PAID_ROUTE_SLUG = "toplanti-saati-maliyeti-hesaplama";

describe("toplanti-saati-maliyeti-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("toplanti-saati-maliyeti-hesaplama");
  });
});
