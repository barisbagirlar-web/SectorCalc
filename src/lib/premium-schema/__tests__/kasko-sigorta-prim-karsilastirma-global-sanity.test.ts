import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "kasko-sigorta-prim-karsilastirma";
const PAID_ROUTE_SLUG = "kasko-sigorta-prim-karsilastirma";

describe("kasko-sigorta-prim-karsilastirma global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("kasko-sigorta-prim-karsilastirma");
  });
});
