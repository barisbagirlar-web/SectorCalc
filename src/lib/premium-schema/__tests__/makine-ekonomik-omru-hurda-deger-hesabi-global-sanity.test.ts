import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "makine-ekonomik-omru-hurda-deger-hesabi";
const PAID_ROUTE_SLUG = "makine-ekonomik-omru-hurda-deger-hesabi";

describe("makine-ekonomik-omru-hurda-deger-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("makine-ekonomik-omru-hurda-deger-hesabi");
  });
});
