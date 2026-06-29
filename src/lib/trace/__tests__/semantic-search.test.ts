/**
 * semantic-search.test.ts — industrial validation of TF-IDF semantic search engine.
 *
 * Coverage:
 * - Empty query returns empty
 * - Exact keyword match returns correct tool
 * - Multi-token ranking (relevant tools scored higher)
 * - Threshold filtering (low-similarity results excluded)
 * - Reset cache between tests
 * - debugSearch returns raw scores
 */
import { describe, expect, test, beforeEach, vi } from "vitest";
import { semanticSearch, resetSemanticCache, debugSearch } from "@/lib/trace/semantic-search";
import type { AiToolIndexRecord, AiLocalizedKeywords, AiRouteStatus, AiToolTier } from "@/lib/ai/tool-retrieval-types";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const mockKeywords: AiLocalizedKeywords = {
  en: ["cnc", "milling", "turning", "machine", "tool", "spindle"],
};

function makeTool(overrides: Partial<AiToolIndexRecord>): AiToolIndexRecord {
  return {
    slug: "test-tool",
    title: { en: "Test Tool" },
    description: { en: "A generic test tool" },
    localeUrls: { en: "/tools/premium/test-tool" },
    canonicalUrl: "https://sectorcalc.com/tools/premium/test-tool",
    categorySlug: "test-category",
    categoryTitle: { en: "Test Category" },
    tier: "premium" as AiToolTier,
    routeStatus: "active-route" as AiRouteStatus,
    keywords: mockKeywords,
    intent: ["test", "simulation", "analysis"],
    industries: ["manufacturing", "engineering"],
    isFinanceLike: false,
    ...overrides,
  };
}

const MOCK_TOOLS: readonly AiToolIndexRecord[] = [
  makeTool({
    slug: "cnc-cost-analyzer",
    title: { en: "CNC Cost Analyzer" },
    description: {
      en: "Analyze CNC machining cost, cycle time and tool wear.",
    },
    intent: ["cnc", "machining", "cost-analysis", "manufacturing"],
    industries: ["precision-manufacturing", "metalworking"],
    keywords: {
      en: ["cnc", "cost", "machining", "cycle-time", "tool-wear"],
    },
  }),
  makeTool({
    slug: "energy-efficiency-report",
    title: { en: "Energy Efficiency Report" },
    description: {
      en: "Peak load, carbon exposure and utility cost analysis.",
    },
    intent: ["energy", "efficiency", "carbon", "sustainability"],
    industries: ["energy", "manufacturing", "facilities"],
    keywords: {
      en: ["energy", "efficiency", "carbon", "peak-load", "utility"],
    },
  }),
  makeTool({
    slug: "oee-calculator",
    title: { en: "OEE Calculator" },
    description: {
      en: "Overall Equipment Effectiveness — availability, performance, quality.",
    },
    intent: ["oee", "availability", "performance", "quality", "lean"],
    industries: ["manufacturing", "production"],
    keywords: {
      en: ["oee", "availability", "performance", "quality", "lean"],
    },
  }),
  makeTool({
    slug: "financial-health-score",
    title: { en: "Financial Health Score" },
    description: {
      en: "Benchmark your financial health against industry standards.",
    },
    intent: ["financial", "health", "benchmark", "rating"],
    industries: ["finance", "all"],
    keywords: {
      en: ["financial", "health", "score", "benchmark", "rating"],
    },
  }),
];

/* ------------------------------------------------------------------ */
/*  Module-level mock                                                  */
/* ------------------------------------------------------------------ */

vi.mock("@/lib/ai/tool-search-index", () => ({
  listAiToolIndexRecords: () => MOCK_TOOLS,
  getAiToolIndexRecord: (slug: string) => MOCK_TOOLS.find((t) => t.slug === slug),
}));

describe("semanticSearch", () => {
  beforeEach(() => {
    resetSemanticCache();
  });

  /* ---- Edge cases ---- */
  test("returns empty array for empty query", () => {
    const results = semanticSearch("", 10);
    expect(results).toEqual([]);
  });

  test("returns empty array for stop-words-only query", () => {
    const results = semanticSearch("the a and for to tool calculator", 10);
    expect(results).toEqual([]);
  });

  test("returns empty array for very short query (< 3 chars)", () => {
    const results = semanticSearch("ab", 10);
    expect(results).toEqual([]);
  });

  /* ---- Exact keyword matching ---- */
  test("finds CNC tool by English keyword 'cnc'", () => {
    const results = semanticSearch("cnc machining cost", 10);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].slug).toBe("cnc-cost-analyzer");
  });

  /* ---- Ranking ---- */
  test("ranks exact match above partial match", () => {
    const exact = debugSearch("oee availability performance quality", 10);
    const partial = debugSearch("oee", 10);

    const exactOee = exact.find((r) => r.slug === "oee-calculator");
    const partialOee = partial.find((r) => r.slug === "oee-calculator");

    expect(exactOee).toBeDefined();
    expect(partialOee).toBeDefined();
    // Exact match should have higher score
    expect(exactOee!.score).toBeGreaterThan(partialOee!.score);
  });

  test("returns at most `limit` results", () => {
    // Query that matches all tools
    const results = semanticSearch("manufacturing production", 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  /* ---- Threshold ---- */
  test("irrelevant query returns empty", () => {
    const results = semanticSearch("zyxwv nowhere", 10);
    expect(results).toEqual([]);
  });

  /* ---- Debug API ---- */
  test("debugSearch returns scores", () => {
    const results = debugSearch("cnc machining", 5);
    expect(results.length).toBeGreaterThan(0);
    const scored = results.filter((r) => r.score > 0);
    expect(scored.length).toBeGreaterThan(0);
    for (const r of scored) {
      expect(r).toHaveProperty("score");
      expect(typeof r.score).toBe("number");
      expect(r.score).toBeGreaterThan(0);
    }
  });

  test("debugSearch sorts descending by score", () => {
    const results = debugSearch("energy carbon efficiency", 10);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeLessThanOrEqual(results[i - 1].score);
    }
  });
});
