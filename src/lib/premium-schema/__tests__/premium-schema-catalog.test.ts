import { describe, expect, test } from "vitest";
import {
  assertPublicCatalogCopySafe,
  buildPremiumSchemaCatalogGroups,
  getPremiumSchemaCatalogItemBySlug,
  getPremiumSchemaCatalogItems,
  getPremiumSchemasByCategory,
  getPremiumSchemasBySector,
  resolvePremiumAnalyzerHref,
} from "@/lib/premium-schema/premium-schema-catalog";

describe("premium-schema-catalog", () => {
  test("getPremiumSchemaCatalogItems returns 27 items", () => {
    const items = getPremiumSchemaCatalogItems("en");
    expect(items.length).toBe(50);
  });

  test("each item has href, title, pain and promise", () => {
    for (const item of getPremiumSchemaCatalogItems("en")) {
      expect(item.href.length).toBeGreaterThan(0);
      expect(item.title.trim().length).toBeGreaterThan(0);
      expect(item.painStatement.trim().length).toBeGreaterThan(0);
      expect(item.promise.trim().length).toBeGreaterThan(0);
      expect(item.primaryOutputLabel.trim().length).toBeGreaterThan(0);
      expect(assertPublicCatalogCopySafe(item)).toBe(true);
    }
  });

  test("public labels do not contain forbidden terms", () => {
    for (const item of getPremiumSchemaCatalogItems("en")) {
      const joined = [
        item.title,
        item.painStatement,
        item.promise,
        item.badge,
        item.priceHint,
        ...item.reportSections,
      ].join(" ");
      expect(joined.toLowerCase()).not.toMatch(/\bschema\b/);
      expect(joined.toLowerCase()).not.toMatch(/\bmigration\b/);
      expect(joined.toLowerCase()).not.toMatch(/\bpilot\b/);
      expect(joined.toLowerCase()).not.toMatch(/\bdebug\b/);
    }
  });

  test("href starts with locale and premium-schema path", () => {
    for (const item of getPremiumSchemaCatalogItems("en")) {
      expect(item.href.startsWith("/tools/premium-schema/")).toBe(true);
    }
  });

  test("no NaN or Infinity in catalog strings", () => {
    for (const item of getPremiumSchemaCatalogItems("en")) {
      const joined = JSON.stringify(item);
      expect(joined).not.toMatch(/\bNaN\b/);
      expect(joined).not.toMatch(/\bInfinity\b/i);
    }
  });

  test("getPremiumSchemasBySector manufacturing returns items", () => {
    const items = getPremiumSchemasBySector("manufacturing", "en");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  test("getPremiumSchemasByCategory energy returns items", () => {
    const items = getPremiumSchemasByCategory("energy", "en");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  test("slug lookup works", () => {
    const item = getPremiumSchemaCatalogItemBySlug("cnc-oee-loss", "en");
    expect(item?.slug).toBe("cnc-oee-loss");
    expect(item?.title.length).toBeGreaterThan(0);
  });

  test("buildPremiumSchemaCatalogGroups includes all analyzers", () => {
    const groups = buildPremiumSchemaCatalogGroups("en");
    const total = groups.reduce((sum, group) => sum + group.items.length, 0);
    expect(total).toBe(50);
  });

  test("resolvePremiumAnalyzerHref prefers schema route for mapped legacy slug", () => {
    expect(resolvePremiumAnalyzerHref("cnc-quote-risk-analyzer")).toBe(
      "/tools/premium-schema/cnc-oee-loss"
    );
    expect(resolvePremiumAnalyzerHref("cnc-oee-loss")).toBe("/tools/premium-schema/cnc-oee-loss");
  });

  test("resolvePremiumAnalyzerHref maps legacy slug to schema route when available", () => {
    expect(resolvePremiumAnalyzerHref("office-cleaning-bid-optimizer")).toBe(
      "/tools/premium-schema/warehouse-space-cost-leak"
    );
  });

  test("resolvePremiumAnalyzerHref falls back to premium-tools for unknown slug", () => {
    expect(resolvePremiumAnalyzerHref("unknown-paid-slug")).toBe("/premium-tools");
  });
});
