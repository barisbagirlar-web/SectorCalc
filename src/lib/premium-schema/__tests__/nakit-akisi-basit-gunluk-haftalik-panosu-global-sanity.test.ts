import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "nakit-akisi-basit-gunluk-haftalik-panosu";
const PAID_ROUTE_SLUG = "nakit-akisi-basit-gunluk-haftalik-panosu";

describe("nakit-akisi-basit-gunluk-haftalik-panosu global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("nakit-akisi-basit-gunluk-haftalik-panosu");
  });
});
