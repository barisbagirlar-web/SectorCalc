import { describe, expect, it } from "vitest";
import { publishedCaseStudyBase } from "@/lib/case-studies/data";
import {
  getPublishedCaseStudyBySlug,
  listPublishedCaseStudies,
  listPublishedCaseStudySlugs,
} from "@/lib/case-studies/published-case-study-locale";
import { listAllCaseStudySlugs } from "@/lib/case-studies/case-study-registry";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { resolveGeneratedToolPath } from "@/lib/tools/paths";

describe("published case studies", () => {
  it("defines four published success stories", () => {
    expect(publishedCaseStudyBase).toHaveLength(4);
    expect(listPublishedCaseStudySlugs()).toEqual([
      "muller-prazision-5s-optimization",
      "cnc-oee-improvement",
      "carbon-reporting-automation",
      "welding-cost-reduction",
    ]);
  });

  it("localizes every published study across six locales", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const studies = listPublishedCaseStudies(locale);
      expect(studies).toHaveLength(4);
      for (const study of studies) {
        expect(study.title.length).toBeGreaterThan(5);
        expect(study.results.length).toBeGreaterThanOrEqual(3);
        expect(study.tools.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("links tools to generated calculator routes", () => {
    const study = getPublishedCaseStudyBySlug("cnc-oee-improvement", "en");
    expect(study).toBeDefined();
    for (const tool of study?.tools ?? []) {
      expect(resolveGeneratedToolPath(tool)).toMatch(/^\/tools\/generated\//);
    }
  });

  it("includes published slugs in combined sitemap slug list", () => {
    const slugs = listAllCaseStudySlugs();
    for (const slug of listPublishedCaseStudySlugs()) {
      expect(slugs).toContain(slug);
    }
  });
});
