/**
 * Build-time invariant test: category count coherence across all views.
 *
 * Guards against the same regressions as scripts/audit-category-count-coherence.mjs
 * but runs as a vitest test for `npm test` coverage.
 *
 * ECMI / ISO 9001 - TUV-certifiable engineering quality gate.
 */

import { describe, expect, it } from "vitest";
import { getAllTools } from "@/lib/features/tools/all-tools-data";
import {
  HOMEPAGE_COVERAGE_TOOL_MATCHERS,
  HOMEPAGE_COVERAGE_FILTER_SLUG,
  countToolsForHomepageCoverage,
} from "@/lib/ui-shared/home/homepage-coverage-tool-map";
import { HOMEPAGE_COVERAGE_IDS, type HomepageCoverageId } from "@/lib/ui-shared/home/homepage-positioning-data";
import { buildTaxonomyCategoryCards } from "@/lib/features/tools/build-taxonomy-category-cards";

describe("category-count-coherence", () => {
  const tools = getAllTools("en");
  const allSlugs = new Set(tools.map((t) => t.slug));
  const coverageIds = HOMEPAGE_COVERAGE_IDS as readonly HomepageCoverageId[];

  /* ─── Homepage coverage card matchers ─────────────────── */

  it("every coverage matcher key exists as a real tool categoryKey", () => {
    const realKeys = new Set(tools.map((t) => t.categoryKey));
    for (const id of coverageIds) {
      for (const key of HOMEPAGE_COVERAGE_TOOL_MATCHERS[id]) {
        expect(realKeys.has(key)).toBe(true);
      }
    }
  });

  it("every coverage filter slug exists as a real tool categoryKey", () => {
    const realKeys = new Set(tools.map((t) => t.categoryKey));
    for (const id of coverageIds) {
      expect(realKeys.has(HOMEPAGE_COVERAGE_FILTER_SLUG[id])).toBe(true);
    }
  });

  it("no categoryKey appears in more than one coverage card (no double-count)", () => {
    const assigned = new Map<string, string>();
    for (const id of coverageIds) {
      for (const key of HOMEPAGE_COVERAGE_TOOL_MATCHERS[id]) {
        expect(assigned.has(key)).toBe(false);
        assigned.set(key, id);
      }
    }
  });

  /** The sum of all coverage card counts must exactly equal total tools. */
  it("sum of all coverage card counts equals total tool count", () => {
    let total = 0;
    for (const id of coverageIds) {
      total += countToolsForHomepageCoverage(id, tools);
    }
    expect(total).toBe(tools.length);
  });

  it("every coverage filter slug appears in its own matcher list", () => {
    for (const id of coverageIds) {
      const slug = HOMEPAGE_COVERAGE_FILTER_SLUG[id];
      expect(HOMEPAGE_COVERAGE_TOOL_MATCHERS[id].includes(slug)).toBe(true);
    }
  });

  /* ─── buildTaxonomyCategoryCards sanity checks ────────── */
  // Note: buildTaxonomyCategoryCards counts from buildCategorizedToolIndex().
  // Not every tool in getAllTools() has a matching index entry, so sums may
  // be less than the full tool count. These tests validate bounded ranges.

  it("buildTaxonomyCategoryCards(all) returns reasonable count", () => {
    const cards = buildTaxonomyCategoryCards("en", "all", allSlugs);
    const sum = cards.reduce((s, c) => s + c.count, 0);
    expect(sum).toBeGreaterThanOrEqual(1);
    expect(sum).toBeLessThanOrEqual(tools.length);
  });

  it("buildTaxonomyCategoryCards(free) returns reasonable count", () => {
    const freeTools = tools.filter((t) => !t.premiumRequired);
    const freeSlugs = new Set(freeTools.map((t) => t.slug));
    const cards = buildTaxonomyCategoryCards("en", "free", freeSlugs);
    const sum = cards.reduce((s, c) => s + c.count, 0);
    expect(sum).toBeGreaterThanOrEqual(1);
    expect(sum).toBeLessThanOrEqual(freeTools.length);
  });

  it("buildTaxonomyCategoryCards(premium) returns reasonable count", () => {
    const premiumTools = tools.filter((t) => t.premiumRequired);
    const premiumSlugs = new Set(premiumTools.map((t) => t.slug));
    const cards = buildTaxonomyCategoryCards("en", "premium", premiumSlugs);
    const sum = cards.reduce((s, c) => s + c.count, 0);
    expect(sum).toBeGreaterThanOrEqual(1);
    expect(sum).toBeLessThanOrEqual(premiumTools.length);
  });
});
