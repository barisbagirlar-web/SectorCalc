import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "trafik-cezasi-gecikme-faizi-hesaplama";
const PAID_ROUTE_SLUG = "trafik-cezasi-gecikme-faizi-hesaplama";

describe("trafik-cezasi-gecikme-faizi-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("trafik-cezasi-gecikme-faizi-hesaplama");
  });
});
