import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "leasing-kiralama-maliyet-karsilastirma";
const PAID_ROUTE_SLUG = "leasing-kiralama-maliyet-karsilastirma";

describe("leasing-kiralama-maliyet-karsilastirma global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("leasing-kiralama-maliyet-karsilastirma");
  });
});
