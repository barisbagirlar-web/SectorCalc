import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "celik-raf-depo-rafi-yuk-kapasitesi";
const PAID_ROUTE_SLUG = "celik-raf-depo-rafi-yuk-kapasitesi";

describe("celik-raf-depo-rafi-yuk-kapasitesi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("celik-raf-depo-rafi-yuk-kapasitesi");
  });
});
