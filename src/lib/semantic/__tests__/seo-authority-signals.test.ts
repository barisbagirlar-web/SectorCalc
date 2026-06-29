/* eslint-disable */
// @ts-nocheck

import { describe, expect, test } from "vitest";
import { buildAboutPageAuthorityJsonLd } from "@/lib/semantic/build-entity-authority-jsonld";
import { buildClaimReviewJsonLd } from "@/lib/semantic/build-claim-review-jsonld";
import { buildCncBenchmarkDatasetJsonLd } from "@/lib/semantic/build-dataset-jsonld";
import { buildGeneratedToolWebPageJsonLd } from "@/lib/semantic/build-generated-tool-webpage-jsonld";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";

const MINIMAL_SCHEMA: GeneratedToolSchema = {
  toolName: "Cutting Speed Calculator",
  inputs: [],
  validation: { rules: [], thresholds: {} },
  formulas: {},
  outputs: {
    primary: "Cutting speed",
    breakdown: {},
    hiddenLossDrivers: [],
    suggestedActions: [],
    dataConfidenceAdjusted: "medium",
  },
  premiumFeatures: [],
  premiumRequired: false,
  lastUpdated: "2026-06-16",
};

describe("seo authority signal JSON-LD", () => {
  test("about page emits Organization and Person graphs for all locales", () => {
    for (const locale of ["en", "tr", "de", "fr", "es", "ar"] as const) {
      const graphs = buildAboutPageAuthorityJsonLd(locale);
      expect(graphs).toHaveLength(3);
      expect(graphs[0]?.["@type"]).toBe("Organization");
      expect(graphs[1]?.["@type"]).toBe("Person");
      expect(graphs[1]?.jobTitle).toBeTruthy();
    }
  });

  test("generated tool WebPage includes speakable selectors", () => {
    const graph = buildGeneratedToolWebPageJsonLd({
      toolName: "Cutting Speed Calculator",
      description: "Industrial cutting speed estimate",
      slug: "cutting-speed-calculator",
      locale: "en",
      schema: MINIMAL_SCHEMA,
    });

    const speakable = graph.speakable as { cssSelector?: string[] };
    expect(speakable.cssSelector).toEqual([".tool-description", ".result-value"]);
  });

  test("ClaimReview schema is emitted for calculator results", () => {
    const graph = buildClaimReviewJsonLd({
      claimReviewed: "Cutting Speed Calculator: 120 m/min",
      pageUrl: "https://www.sectorcalc.com/en/tools/generated/cutting-speed-calculator",
    });
    expect(graph["@type"]).toBe("ClaimReview");
    expect(graph.reviewRating).toBeTruthy();
  });

  test("Dataset schema supports localized CNC benchmark page", () => {
    const graph = buildCncBenchmarkDatasetJsonLd({
      name: "CNC Cost Benchmark 2024",
      description: "Benchmark rows for CNC jobs",
      locale: "de",
    });
    expect(graph["@type"]).toBe("Dataset");
    expect(String(graph.url)).toContain("/de/data");
    expect(String(graph.downloadUrl)).toContain("/data/cnc-benchmark-2024.csv");
  });
});
