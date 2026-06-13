import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "konteyner-yukleme-kapasitesi-teu-hesabi";
const PAID_ROUTE_SLUG = "konteyner-yukleme-kapasitesi-teu-hesabi";

describe("konteyner-yukleme-kapasitesi-teu-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("konteyner-yukleme-kapasitesi-teu-hesabi");
  });
});
