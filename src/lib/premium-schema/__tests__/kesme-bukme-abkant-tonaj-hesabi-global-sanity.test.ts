import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "kesme-bukme-abkant-tonaj-hesabi";
const PAID_ROUTE_SLUG = "kesme-bukme-abkant-tonaj-hesabi";

describe("kesme-bukme-abkant-tonaj-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("kesme-bukme-abkant-tonaj-hesabi");
  });
});
