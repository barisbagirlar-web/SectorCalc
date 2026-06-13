import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "sirket-telefon-faturasi-hesaplama";
const PAID_ROUTE_SLUG = "sirket-telefon-faturasi-hesaplama";

describe("sirket-telefon-faturasi-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("sirket-telefon-faturasi-hesaplama");
  });
});
