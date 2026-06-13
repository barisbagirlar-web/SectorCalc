import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "civata-on-germe-kuvveti-hesabi";
const PAID_ROUTE_SLUG = "civata-on-germe-kuvveti-hesabi";

describe("civata-on-germe-kuvveti-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("civata-on-germe-kuvveti-hesabi");
  });
});
