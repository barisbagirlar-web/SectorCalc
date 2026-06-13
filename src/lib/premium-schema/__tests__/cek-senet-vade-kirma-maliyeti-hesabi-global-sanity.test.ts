import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "cek-senet-vade-kirma-maliyeti-hesabi";
const PAID_ROUTE_SLUG = "cek-senet-vade-kirma-maliyeti-hesabi";

describe("cek-senet-vade-kirma-maliyeti-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("cek-senet-vade-kirma-maliyeti-hesabi");
  });
});
