import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "kaynak-proseduru-wps-on-isitma-sicakligi-hesabi";
const PAID_ROUTE_SLUG = "kaynak-proseduru-wps-on-isitma-sicakligi-hesabi";

describe("kaynak-proseduru-wps-on-isitma-sicakligi-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("kaynak-proseduru-wps-on-isitma-sicakligi-hesabi");
  });
});
