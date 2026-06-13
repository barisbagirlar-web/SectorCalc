import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "aku-kapasitesi-calisma-suresi-hesabi";
const PAID_ROUTE_SLUG = "aku-kapasitesi-calisma-suresi-hesabi";

describe("aku-kapasitesi-calisma-suresi-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("aku-kapasitesi-calisma-suresi-hesabi");
  });
});
