/**
 * Build-time invariant test: category count coherence across all views.
 *
 * Guards against the same regressions as scripts/audit-category-count-coherence.mjs
 * but runs as a vitest test for `npm test` coverage.
 *
 * ECMI / ISO 9001 — TÜV-certifiable engineering quality gate.
 */

import { describe, expect, it } from "vitest";
import { getAllTools } from "@/lib/tools/all-tools-data";
import {
  HOMEPAGE_COVERAGE_TOOL_MATCHERS,
  HOMEPAGE_COVERAGE_FILTER_SLUG,
  countToolsForHomepageCoverage,
} from "@/lib/home/homepage-coverage-tool-map";
import { HOMEPAGE_COVERAGE_IDS, type HomepageCoverageId } from "@/lib/home/homepage-positioning-data";
import { buildTaxonomyCategoryCards } from "@/lib/tools/build-taxonomy-category-cards";

describe("category-count-coherence", () => {
  const tools = getAllTools("en");
  const allSlugs = new Set(tools.map((t) => t.slug));

  it("every coverage matcher key exists as a real tool categoryKey", () => {
    const realKeys = new Set(tools.map((t) => t.categoryKey));
    for (const [id, keys] of Object.entries(HOMEPAGE_COVERAGE_TOOL_MATCHERS)) {
      for (const key of keys) {
        expect(realKeys.has(key), `coverage "${id}" matcher key "${key}" not found in tools`).toBe(true);
      }
    }
  });

  it("every coverage filter slug exists as a real tool categoryKey", () => {
    const realKeys = new Set(tools.map((t) => t.categoryKey));
    for (const [id, slug] of Object.entries(HOMEPAGE_COVERAGE_FILTER_SLUG)) {
      expect(realKeys.has(slug), `coverage "${id}" filter slug "${slug}" not found in tools`).toBe(true);
    }
  });

  it("no categoryKey appears in more than one coverage card (no double-count)", () => {
    const assigned = new Map<string, string>();
    for (const [id, keys] of Object.entries(HOMEPAGE_COVERAGE_TOOL_MATCHERS)) {
      for (const key of keys) {
        if (assigned.has(key)) {
          expect.fail(`categoryKey "${key}" appears in both "${assigned.get(key)}" and "${id}"`);
        }
        assigned.set(key, id);
      }
    }
  });

  it("sum of all coverage card counts equals total tool count", () => {
    let total = 0;
    for (const id of HOMEPAGE_COVERAGE_IDS) {
      total += countToolsForHomepageCoverage(id as HomepageCoverageId, tools);
    }
    expect(total).toBe(tools.length);
  });

  it("every coverage filter slug appears in its own matcher list", () => {
    for (const [id, slug] of Object.entries(HOMEPAGE_COVERAGE_FILTER_SLUG)) {
      const matcherKeys = HOMEPAGE_COVERAGE_TOOL_MATCHERS[id as HomepageCoverageId];
      expect(matcherKeys.includes(slug), `filter slug "${slug}" not in ${id} matchers`).toBe(true);
    }
  });

  it("buildTaxonomyCategoryCards(all) sum equals total tool count", () => {
    const cards = buildTaxonomyCategoryCards("en", "all", allSlugs);
    const sum = cards.reduce((s, c) => s + c.count, 0);
    expect(sum).toBe(tools.length);
  });

  it("buildTaxonomyCategoryCards(free) sum equals getFreeTools count", () => {
    const freeTools = tools.filter((t) => !t.premiumRequired);
    const freeSlugs = new Set(freeTools.map((t) => t.slug));
    const cards = buildTaxonomyCategoryCards("en", "free", freeSlugs);
    const sum = cards.reduce((s, c) => s + c.count, 0);
    expect(sum).toBe(freeTools.length);
  });

  it("buildTaxonomyCategoryCards(premium) sum equals getPremiumTools count", () => {
    const premiumTools = tools.filter((t) => t.premiumRequired);
    const premiumSlugs = new Set(premiumTools.map((t) => t.slug));
    const cards = buildTaxonomyCategoryCards("en", "premium", premiumSlugs);
    const sum = cards.reduce((s, c) => s + c.count, 0);
    expect(sum).toBe(premiumTools.length);
  });
});
