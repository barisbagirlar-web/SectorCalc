import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const SLUG = "arac-kira-satin-alma-karsilastirma";
const PAID_ROUTE_SLUG = "arac-kira-satin-alma-karsilastirma";

describe("arac-kira-satin-alma-karsilastirma global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("arac-kira-satin-alma-karsilastirma");
  });
});
