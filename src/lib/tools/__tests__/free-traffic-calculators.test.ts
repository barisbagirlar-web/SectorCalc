import { describe, expect, test } from "vitest";
import { calculateFreeTrafficTool, containsPremiumLeakText, hasDedicatedTrafficCalculator } from "@/lib/tools/free-traffic-calculators";
import {
  FREE_TRAFFIC_TOOLS,
  listFreeTrafficSlugs,
  listRelatedTrafficTools,
  listTrafficOnlyFreeSlugs,
} from "@/lib/tools/free-traffic-catalog";
import { getFreeToolRoutePath, listAllFreeToolSlugs } from "@/lib/tools/free-traffic-routes";
import { CANONICAL_FREE_SLUGS } from "@/lib/tools/canonical-tool-slugs";

const PREMIUM_LEAK_TERMS = [
  "DO NOT ACCEPT UNDER",
  "Minimum safe price",
  "P90",
  "final verdict",
  "PDF",
  "saved report",
] as const;

describe("free-traffic-calculators (canonical baseline)", () => {
  test("FREE_TRAFFIC_TOOLS matches free-slugs.json", () => {
    expect(FREE_TRAFFIC_TOOLS.length).toBe(CANONICAL_FREE_SLUGS.length);
    expect(listFreeTrafficSlugs().length).toBe(CANONICAL_FREE_SLUGS.length);
    expect(new Set(listFreeTrafficSlugs()).size).toBe(CANONICAL_FREE_SLUGS.length);
  });

  test("every tool has title and generated route", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      expect(tool.title.trim().length).toBeGreaterThan(0);
      expect(getFreeToolRoutePath(tool.slug)).toBe(`/tools/generated/${tool.slug}`);
    }
  });

  test("traffic-only free slugs exclude premium overlap", () => {
    expect(listTrafficOnlyFreeSlugs().length).toBeGreaterThan(0);
    expect(listAllFreeToolSlugs().length).toBeGreaterThanOrEqual(CANONICAL_FREE_SLUGS.length);
  });

  test("calculateFreeTrafficTool returns pending regeneration for canonical slugs", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      const result = calculateFreeTrafficTool(tool.slug, {});
      expect(result.headline.length).toBeGreaterThan(0);
      expect(result.primaryValue.length).toBeGreaterThan(0);
      expect(containsPremiumLeakText(result.explanation)).toBe(false);
      for (const term of PREMIUM_LEAK_TERMS) {
        expect(result.explanation.toLowerCase()).not.toContain(term.toLowerCase());
      }
    }
  });

  test("hasDedicatedTrafficCalculator is true for all canonical free slugs", () => {
    for (const slug of listFreeTrafficSlugs()) {
      expect(hasDedicatedTrafficCalculator(slug)).toBe(true);
    }
  });

  test("related tools resolve within same category when possible", () => {
    const withCategoryPeers = FREE_TRAFFIC_TOOLS.filter(
      (tool) => FREE_TRAFFIC_TOOLS.filter((peer) => peer.category === tool.category).length > 1,
    );
    expect(withCategoryPeers.length).toBeGreaterThan(0);
    for (const tool of withCategoryPeers.slice(0, 5)) {
      expect(listRelatedTrafficTools(tool).length).toBeGreaterThan(0);
    }
  });
});
