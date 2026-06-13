import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "kaynakli-baglanti-kose-kut-mukavemet-hesabi";
const PAID_ROUTE_SLUG = "kaynakli-baglanti-kose-kut-mukavemet-hesabi";

describe("kaynakli-baglanti-kose-kut-mukavemet-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("kaynakli-baglanti-kose-kut-mukavemet-hesabi");
  });
});
