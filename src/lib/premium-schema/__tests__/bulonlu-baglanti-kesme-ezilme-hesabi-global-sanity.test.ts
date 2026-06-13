import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "bulonlu-baglanti-kesme-ezilme-hesabi";
const PAID_ROUTE_SLUG = "bulonlu-baglanti-kesme-ezilme-hesabi";

describe("bulonlu-baglanti-kesme-ezilme-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("bulonlu-baglanti-kesme-ezilme-hesabi");
  });
});
