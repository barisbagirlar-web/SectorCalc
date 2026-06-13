import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "paketleme-malzemesi-strec-koli-sarfiyati";
const PAID_ROUTE_SLUG = "paketleme-malzemesi-strec-koli-sarfiyati";

describe("paketleme-malzemesi-strec-koli-sarfiyati global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("paketleme-malzemesi-strec-koli-sarfiyati");
  });
});
