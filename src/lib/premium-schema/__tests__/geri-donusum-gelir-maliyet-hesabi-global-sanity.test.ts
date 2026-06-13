import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "geri-donusum-gelir-maliyet-hesabi";
const PAID_ROUTE_SLUG = "geri-donusum-gelir-maliyet-hesabi";

describe("geri-donusum-gelir-maliyet-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("geri-donusum-gelir-maliyet-hesabi");
  });
});
