import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "alti-sigma-dpmo-sigma-seviyesi-cevirici";
const PAID_ROUTE_SLUG = "alti-sigma-dpmo-sigma-seviyesi-cevirici";

describe("alti-sigma-dpmo-sigma-seviyesi-cevirici global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("alti-sigma-dpmo-sigma-seviyesi-cevirici");
  });
});
