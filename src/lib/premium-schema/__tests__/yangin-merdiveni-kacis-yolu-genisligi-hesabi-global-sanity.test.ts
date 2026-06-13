import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "yangin-merdiveni-kacis-yolu-genisligi-hesabi";
const PAID_ROUTE_SLUG = "yangin-merdiveni-kacis-yolu-genisligi-hesabi";

describe("yangin-merdiveni-kacis-yolu-genisligi-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("yangin-merdiveni-kacis-yolu-genisligi-hesabi");
  });
});
