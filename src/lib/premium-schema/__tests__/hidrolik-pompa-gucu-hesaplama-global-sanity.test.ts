import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "hidrolik-pompa-gucu-hesaplama";
const PAID_ROUTE_SLUG = "hidrolik-pompa-gucu-hesaplama";

describe("hidrolik-pompa-gucu-hesaplama global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("hidrolik-pompa-gucu-hesaplama");
  });
});
