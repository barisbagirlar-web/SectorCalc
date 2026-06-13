import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "stopaj-hesaplama-kira-serbest-meslek";
const PAID_ROUTE_SLUG = "stopaj-hesaplama-kira-serbest-meslek";

describe("stopaj-hesaplama-kira-serbest-meslek global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("stopaj-hesaplama-kira-serbest-meslek");
  });
});
