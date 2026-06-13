import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "kablo-kesiti-mm-secim-hesaplama";
const PAID_ROUTE_SLUG = "kablo-kesiti-mm-secim-hesaplama";

describe("kablo-kesiti-mm-secim-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("kablo-kesiti-mm-secim-hesaplama");
  });
});
