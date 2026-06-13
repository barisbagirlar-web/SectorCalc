import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "pnomatik-silindir-kuvvet-hesabi";
const PAID_ROUTE_SLUG = "pnomatik-silindir-kuvvet-hesabi";

describe("pnomatik-silindir-kuvvet-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("pnomatik-silindir-kuvvet-hesabi");
  });
});
