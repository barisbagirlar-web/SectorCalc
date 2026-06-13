import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "kompresor-debisi-tank-hacmi-hesabi";
const PAID_ROUTE_SLUG = "kompresor-debisi-tank-hacmi-hesabi";

describe("kompresor-debisi-tank-hacmi-hesabi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("kompresor-debisi-tank-hacmi-hesabi");
  });
});
