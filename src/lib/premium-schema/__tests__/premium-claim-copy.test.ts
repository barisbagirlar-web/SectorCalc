import { describe, expect, test } from "vitest";
import {
  claimCopyIsPublicSafe,
  getPremiumClaimCopy,
  listPremiumClaimSlugs,
  PRICING_COPY_ASSERTIONS,
} from "@/lib/premium-schema/premium-claim-copy";
import { listPremiumSchemaIds } from "@/lib/premium-schema/schema-registry";

describe("premium-claim-copy", () => {
  test("returns claim copy for every premium schema", () => {
    const schemaIds = listPremiumSchemaIds();
    expect(schemaIds.length).toBeGreaterThan(0);

    for (const slug of schemaIds) {
      const copy = getPremiumClaimCopy(slug);
      expect(copy.slug).toBe(slug);
      expect(copy.headline.trim().length).toBeGreaterThan(0);
      expect(copy.valueStatement.trim().length).toBeGreaterThan(0);
      expect(copy.decisionValue.trim().length).toBeGreaterThan(0);
      expect(copy.upgradeReason.trim().length).toBeGreaterThan(0);
    }
  });

  test("fallback copy is non-empty for unknown slug", () => {
    const copy = getPremiumClaimCopy("unknown-analyzer-slug");
    expect(copy.headline).toContain("hidden loss");
    expect(copy.decisionValue.length).toBeGreaterThan(0);
    expect(copy.upgradeReason.length).toBeGreaterThan(0);
  });

  test("public claim text does not contain schema", () => {
    for (const slug of listPremiumClaimSlugs()) {
      const copy = getPremiumClaimCopy(slug);
      expect(claimCopyIsPublicSafe(copy)).toBe(true);
      expect(copy.headline.toLowerCase()).not.toContain("schema");
      expect(copy.valueStatement.toLowerCase()).not.toContain("schema");
      expect(copy.decisionValue.toLowerCase()).not.toContain("schema");
      expect(copy.upgradeReason.toLowerCase()).not.toContain("schema");
    }
  });

  test("upgradeReason and decisionValue are never empty", () => {
    for (const slug of listPremiumSchemaIds()) {
      const copy = getPremiumClaimCopy(slug);
      expect(copy.upgradeReason.trim().length).toBeGreaterThan(10);
      expect(copy.decisionValue.trim().length).toBeGreaterThan(10);
    }
  });

  test("pricing copy assertions exclude ambiguous range", () => {
    expect(PRICING_COPY_ASSERTIONS.forbiddenRange).toBe("$9–29");
    expect(PRICING_COPY_ASSERTIONS.proPrice).toContain("$19");
    expect(PRICING_COPY_ASSERTIONS.teamPrice).toContain("$49");
    expect(PRICING_COPY_ASSERTIONS.singleReportNote).toContain("$9");
  });

  test("specific analyzers have tailored headlines", () => {
    expect(getPremiumClaimCopy("cnc-oee-loss").headline).toContain("OEE");
    expect(getPremiumClaimCopy("logistics-route-loss").headline).toContain("return");
    expect(getPremiumClaimCopy("energy-peak-cost").headline).toContain("Peak");
    expect(getPremiumClaimCopy("food-waste-margin-loss").headline).toContain("Food waste");
    expect(getPremiumClaimCopy("construction-project-overrun").headline).toContain("margin");
  });
});
