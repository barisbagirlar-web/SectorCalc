import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "gelir-vergisi-dilimleri-hesaplama";
const PAID_ROUTE_SLUG = "gelir-vergisi-dilimleri-hesaplama";

describe("gelir-vergisi-dilimleri-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("gelir-vergisi-dilimleri-hesaplama");
  });
});
