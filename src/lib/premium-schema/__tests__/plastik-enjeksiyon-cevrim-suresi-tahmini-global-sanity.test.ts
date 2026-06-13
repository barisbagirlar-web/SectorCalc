import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "plastik-enjeksiyon-cevrim-suresi-tahmini";
const PAID_ROUTE_SLUG = "plastik-enjeksiyon-cevrim-suresi-tahmini";

describe("plastik-enjeksiyon-cevrim-suresi-tahmini global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("plastik-enjeksiyon-cevrim-suresi-tahmini");
  });
});
