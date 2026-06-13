import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "istatistiksel-proses-kontrol-spc-limit-hesabi";
const PAID_ROUTE_SLUG = "istatistiksel-proses-kontrol-spc-limit-hesabi";

describe("istatistiksel-proses-kontrol-spc-limit-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("istatistiksel-proses-kontrol-spc-limit-hesabi");
  });
});
