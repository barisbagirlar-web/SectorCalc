import { describe, expect, test } from "vitest";
import {
  PROGRAMMATIC_SEO_PAGES,
  getProgrammaticSeoPageBySlug,
} from "@/lib/seo/programmatic-seo-pages";
import { getTierOneRefreshItems } from "@/lib/seo/seo-refresh-priority";

const TIER_ONE_SEO_SLUGS = getTierOneRefreshItems()
  .filter((item) => item.type === "seo_landing")
  .map((item) => item.path.replace(/^\/seo\//, ""));

describe("programmatic-seo-pages tier-1 refresh", () => {
  test("tier 1 SEO landing pages have at least 4 FAQ items", () => {
    for (const slug of TIER_ONE_SEO_SLUGS) {
      const page = getProgrammaticSeoPageBySlug(slug);
      expect(page, `missing page: ${slug}`).not.toBeNull();
      expect(page?.faq.length).toBeGreaterThanOrEqual(4);
    }
  });

  test("tier 1 SEO landing pages have at least 4 related free tool links", () => {
    for (const slug of TIER_ONE_SEO_SLUGS) {
      const page = getProgrammaticSeoPageBySlug(slug);
      expect(page?.freeToolLinks.length).toBeGreaterThanOrEqual(4);
    }
  });

  test("tier 1 SEO landing pages have at least 2 premium analyzer links", () => {
    for (const slug of TIER_ONE_SEO_SLUGS) {
      const page = getProgrammaticSeoPageBySlug(slug);
      expect(page?.premiumAnalyzerLinks.length).toBeGreaterThanOrEqual(2);
    }
  });

  test("every programmatic SEO page defines helpsYouCalculate", () => {
    PROGRAMMATIC_SEO_PAGES.forEach((page) => {
      expect(page.helpsYouCalculate.trim().length).toBeGreaterThan(10);
    });
  });

  test("tier 1 SEO pages use meaningful link labels", () => {
    const weakLabels = ["click here", "open", "learn more"];
    for (const slug of TIER_ONE_SEO_SLUGS) {
      const page = getProgrammaticSeoPageBySlug(slug);
      const labels = [
        ...(page?.freeToolLinks.map((link) => link.label) ?? []),
        ...(page?.premiumAnalyzerLinks.map((link) => link.label) ?? []),
      ];
      labels.forEach((label) => {
        expect(weakLabels).not.toContain(label.toLowerCase());
        expect(label.trim().length).toBeGreaterThan(8);
      });
    }
  });
});
