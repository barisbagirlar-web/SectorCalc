import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "cevre-atik-beyani-maliyet-hesaplama";
const PAID_ROUTE_SLUG = "cevre-atik-beyani-maliyet-hesaplama";

describe("cevre-atik-beyani-maliyet-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("cevre-atik-beyani-maliyet-hesaplama");
  });
});
