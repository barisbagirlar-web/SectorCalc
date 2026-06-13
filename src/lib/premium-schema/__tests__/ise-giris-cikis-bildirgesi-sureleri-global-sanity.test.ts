import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "ise-giris-cikis-bildirgesi-sureleri";
const PAID_ROUTE_SLUG = "ise-giris-cikis-bildirgesi-sureleri";

describe("ise-giris-cikis-bildirgesi-sureleri global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("ise-giris-cikis-bildirgesi-sureleri");
  });
});
