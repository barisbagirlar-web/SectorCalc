import { describe, expect, test } from "vitest";
import {
  getCaseStudyBySlug,
  listCaseStudies,
  listCaseStudySlugs,
  listP7FeaturedCaseStudies,
} from "@/lib/case-studies/case-study-registry";
import { listP7First5CaseStudySlugs } from "@/lib/case-studies/case-study-p7-first-5";
import {
  CASE_STUDY_REPRESENTATIVE_LABEL,
  getCaseStudyToolHref,
} from "@/lib/case-studies/case-study-types";

describe("case study registry", () => {
  test("includes representative sector scenarios", () => {
    expect(listCaseStudies().length).toBeGreaterThanOrEqual(13);
  });

  test("P7 first five featured scenarios resolve", () => {
    expect(listP7FeaturedCaseStudies()).toHaveLength(5);
    expect(listP7First5CaseStudySlugs()).toHaveLength(5);
  });

  test("P7 covers CNC, construction, cleaning, logistics, energy", () => {
    const sectors = new Set(listP7FeaturedCaseStudies().map((e) => e.sector));
    expect(sectors.has("cnc")).toBe(true);
    expect(sectors.has("construction")).toBe(true);
    expect(sectors.has("cleaning")).toBe(true);
    expect(sectors.has("logistics")).toBe(true);
    expect(sectors.has("energy")).toBe(true);
  });

  test("P7 entries include full proof fields and calculator CTAs", () => {
    for (const entry of listP7FeaturedCaseStudies()) {
      expect(entry.hiddenLoss.length).toBeGreaterThan(10);
      expect(entry.calculationResult.length).toBeGreaterThan(10);
      expect(entry.methodologyNote.length).toBeGreaterThan(10);
      expect(getCaseStudyToolHref(entry).startsWith("/tools/")).toBe(true);
      expect(entry.title.toLowerCase()).toContain("representative");
    }
  });

  test("covers the named premium proof tools", () => {
    const toolSlugs = new Set(listCaseStudies().map((entry) => entry.toolSlug));
    for (const slug of [
      "cnc-quote-risk-analyzer",
      "change-order-impact-analyzer",
      "office-cleaning-bid-optimizer",
      "route-optimization-analyzer",
      "energy-compressor-leak-cost",
    ]) {
      expect(toolSlugs.has(slug)).toBe(true);
    }
  });

  test("every entry is labeled representative scenario", () => {
    for (const entry of listCaseStudies()) {
      expect(entry.scenarioKind).toBe("representative_scenario");
      expect(entry.assumptions.some((a) => a.includes("Representative"))).toBe(true);
      expect(entry.title.toLowerCase()).not.toMatch(/xyz|acme corp|₺127|127,000|%40 azalttı|saved \$|client said/i);
      expect(entry.calculationResult.toLowerCase()).not.toMatch(/%40 azalttı|guaranteed|verified savings/i);
    }
  });

  test("lookup by slug", () => {
    const slug = listCaseStudySlugs()[0];
    expect(getCaseStudyBySlug(slug)?.slug).toBe(slug);
    expect(getCaseStudyBySlug("nonexistent-slug")).toBeUndefined();
  });

  test("representative label constant is stable", () => {
    expect(CASE_STUDY_REPRESENTATIVE_LABEL).toContain("Representative scenario");
  });
});
