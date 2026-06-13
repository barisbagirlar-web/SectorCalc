import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "sofor-operator-gunluk-yevmiye-maliyeti";
const PAID_ROUTE_SLUG = "sofor-operator-gunluk-yevmiye-maliyeti";

describe("sofor-operator-gunluk-yevmiye-maliyeti global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("sofor-operator-gunluk-yevmiye-maliyeti");
  });
});
