import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "cnc-minimum-safe-quote-analyzer";
const PAID_ROUTE_SLUG = "cnc-minimum-safe-quote-analyzer";

describe("cnc-minimum-safe-quote-analyzer global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("cnc-minimum-safe-quote-analyzer");
  });
});
