import { describe, expect, test } from "vitest";
import { calculateFreeTrafficTool, containsPremiumLeakText, hasDedicatedTrafficCalculator } from "@/lib/features/tools/free-traffic-calculators";
import {
  FREE_TRAFFIC_TOOLS,
  listFreeTrafficSlugs,
  listRelatedTrafficTools,
  listTrafficOnlyFreeSlugs,
} from "@/lib/features/tools/free-traffic-catalog";
import { getFreeToolRoutePath, listAllFreeToolSlugs } from "@/lib/features/tools/free-traffic-routes";
import {
  CANONICAL_FREE_SLUGS,
  CANONICAL_PREMIUM_SLUGS,
  CANONICAL_TRAFFIC_FREE_SLUGS,
} from "@/lib/features/tools/canonical-tool-slugs";

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
    expect(listTrafficOnlyFreeSlugs().length).toBe(CANONICAL_TRAFFIC_FREE_SLUGS.length);
    expect(listAllFreeToolSlugs().length).toBe(
      CANONICAL_PREMIUM_SLUGS.length + CANONICAL_TRAFFIC_FREE_SLUGS.length,
    );
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

  test("related tools resolve within same category", () => {
    const tool = FREE_TRAFFIC_TOOLS.find((item) => item.slug === "margin-calculator");
    expect(tool).toBeDefined();
    if (!tool) return;
    const related = listRelatedTrafficTools(tool, 3);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((item) => item.category === tool.category)).toBe(true);
  });
});
