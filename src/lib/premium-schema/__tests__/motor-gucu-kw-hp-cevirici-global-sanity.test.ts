import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "motor-gucu-kw-hp-cevirici";
const PAID_ROUTE_SLUG = "motor-gucu-kw-hp-cevirici";

describe("motor-gucu-kw-hp-cevirici global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("motor-gucu-kw-hp-cevirici");
  });
});
