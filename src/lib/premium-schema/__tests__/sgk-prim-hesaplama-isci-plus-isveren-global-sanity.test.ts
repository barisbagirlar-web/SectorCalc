import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "sgk-prim-hesaplama-isci-plus-isveren";
const PAID_ROUTE_SLUG = "sgk-prim-hesaplama-isci-plus-isveren";

describe("sgk-prim-hesaplama-isci-plus-isveren global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("sgk-prim-hesaplama-isci-plus-isveren");
  });
});
