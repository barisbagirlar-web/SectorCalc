import { describe, expect, test } from "vitest";
import {
  getCaseStudyBySlug,
  listCaseStudies,
  listCaseStudySlugs,
} from "@/lib/case-studies/case-study-registry";
import { CASE_STUDY_REPRESENTATIVE_LABEL } from "@/lib/case-studies/case-study-types";

describe("case study registry", () => {
  test("includes eleven representative sector scenarios", () => {
    expect(listCaseStudies()).toHaveLength(11);
  });

  test("covers the named premium proof tools", () => {
    const toolSlugs = new Set(listCaseStudies().map((entry) => entry.toolSlug));
    for (const slug of [
      "cnc-quote-risk-analyzer",
      "change-order-impact-analyzer",
      "energy-efficiency-report",
      "cbam-compliance-verdict",
    ]) {
      expect(toolSlugs.has(slug)).toBe(true);
    }
  });

  test("every entry is labeled representative scenario", () => {
    for (const entry of listCaseStudies()) {
      expect(entry.scenarioKind).toBe("representative_scenario");
      expect(entry.assumptions.some((a) => a.includes("Representative"))).toBe(true);
      expect(entry.title.toLowerCase()).not.toMatch(/xyz|acme corp|₺127|127,000/);
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
