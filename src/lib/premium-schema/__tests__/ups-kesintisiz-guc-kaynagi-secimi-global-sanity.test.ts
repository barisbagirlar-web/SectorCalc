import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "ups-kesintisiz-guc-kaynagi-secimi";
const PAID_ROUTE_SLUG = "ups-kesintisiz-guc-kaynagi-secimi";

describe("ups-kesintisiz-guc-kaynagi-secimi global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("ups-kesintisiz-guc-kaynagi-secimi");
  });
});
