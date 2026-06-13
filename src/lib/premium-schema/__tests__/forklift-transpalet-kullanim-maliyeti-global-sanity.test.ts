import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "forklift-transpalet-kullanim-maliyeti";
const PAID_ROUTE_SLUG = "forklift-transpalet-kullanim-maliyeti";

describe("forklift-transpalet-kullanim-maliyeti global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("forklift-transpalet-kullanim-maliyeti");
  });
});
