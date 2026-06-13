import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "ruzgar-turbini-yaklasik-uretim-hesabi";
const PAID_ROUTE_SLUG = "ruzgar-turbini-yaklasik-uretim-hesabi";

describe("ruzgar-turbini-yaklasik-uretim-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("ruzgar-turbini-yaklasik-uretim-hesabi");
  });
});
