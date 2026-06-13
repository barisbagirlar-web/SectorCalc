import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "yay-helisel-kuvvet-uzama-hesabi";
const PAID_ROUTE_SLUG = "yay-helisel-kuvvet-uzama-hesabi";

describe("yay-helisel-kuvvet-uzama-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("yay-helisel-kuvvet-uzama-hesabi");
  });
});
