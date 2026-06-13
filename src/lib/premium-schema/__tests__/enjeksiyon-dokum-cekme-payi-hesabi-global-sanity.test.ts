import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "enjeksiyon-dokum-cekme-payi-hesabi";
const PAID_ROUTE_SLUG = "enjeksiyon-dokum-cekme-payi-hesabi";

describe("enjeksiyon-dokum-cekme-payi-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("enjeksiyon-dokum-cekme-payi-hesabi");
  });
});
