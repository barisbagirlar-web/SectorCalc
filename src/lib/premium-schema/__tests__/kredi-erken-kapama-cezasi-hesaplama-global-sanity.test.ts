import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "kredi-erken-kapama-cezasi-hesaplama";
const PAID_ROUTE_SLUG = "kredi-erken-kapama-cezasi-hesaplama";

describe("kredi-erken-kapama-cezasi-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("kredi-erken-kapama-cezasi-hesaplama");
  });
});
