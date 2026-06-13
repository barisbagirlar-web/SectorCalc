import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "irsaliye-fatura-adedi-basina-sevkiyat-maliyeti";
const PAID_ROUTE_SLUG = "irsaliye-fatura-adedi-basina-sevkiyat-maliyeti";

describe("irsaliye-fatura-adedi-basina-sevkiyat-maliyeti global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("irsaliye-fatura-adedi-basina-sevkiyat-maliyeti");
  });
});
