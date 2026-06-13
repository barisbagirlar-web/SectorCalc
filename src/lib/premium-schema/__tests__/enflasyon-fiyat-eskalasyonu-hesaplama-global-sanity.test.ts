import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "enflasyon-fiyat-eskalasyonu-hesaplama";
const PAID_ROUTE_SLUG = "enflasyon-fiyat-eskalasyonu-hesaplama";

describe("enflasyon-fiyat-eskalasyonu-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("enflasyon-fiyat-eskalasyonu-hesaplama");
  });
});
