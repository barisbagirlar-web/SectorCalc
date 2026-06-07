import { describe, expect, test } from "vitest";
import {
  AUTHORITY_GUIDES,
  countAuthorityGuides,
  getAuthorityGuideBySlug,
  listAuthorityGuideSlugs,
} from "@/lib/content/authority-guides";
import { buildSitemapEntries, countAuthorityGuideSitemapEntries } from "@/lib/seo/build-sitemap";
import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";

const FREE_SLUGS = new Set(FREE_TRAFFIC_TOOLS.map((tool) => tool.slug));
const PREMIUM_SLUGS = new Set(listPremiumSchemaSlugs());

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function collectGuideStrings(): string {
  return AUTHORITY_GUIDES.flatMap((guide) => [
    guide.title,
    guide.seoTitle,
    guide.seoDescription,
    guide.h1,
    guide.featuredQuestion,
    guide.featuredAnswer,
    ...guide.sections.flatMap((section) => [section.heading, section.body, ...(section.bullets ?? [])]),
    ...guide.faq.flatMap((item) => [item.question, item.answer]),
  ]).join(" ");
}

describe("authority guides", () => {
  test("AUTHORITY_GUIDES length >= 8", () => {
    expect(countAuthorityGuides()).toBeGreaterThanOrEqual(8);
  });

  test("slug unique", () => {
    const slugs = listAuthorityGuideSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("seoTitle dolu", () => {
    AUTHORITY_GUIDES.forEach((guide) => {
      expect(guide.seoTitle.trim().length).toBeGreaterThan(10);
    });
  });

  test("seoDescription dolu", () => {
    AUTHORITY_GUIDES.forEach((guide) => {
      expect(guide.seoDescription.trim().length).toBeGreaterThan(20);
    });
  });

  test("featuredAnswer 40–80 kelime arası", () => {
    AUTHORITY_GUIDES.forEach((guide) => {
      const count = wordCount(guide.featuredAnswer);
      expect(count).toBeGreaterThanOrEqual(40);
      expect(count).toBeLessThanOrEqual(80);
    });
  });

  test("her guide en az 3 FAQ içerir", () => {
    AUTHORITY_GUIDES.forEach((guide) => {
      expect(guide.faq.length).toBeGreaterThanOrEqual(3);
    });
  });

  test("her guide en az 3 relatedFreeToolSlugs içerir", () => {
    AUTHORITY_GUIDES.forEach((guide) => {
      expect(guide.relatedFreeToolSlugs.length).toBeGreaterThanOrEqual(3);
    });
  });

  test("her guide en az 1 relatedPremiumSchemaSlugs içerir", () => {
    AUTHORITY_GUIDES.forEach((guide) => {
      expect(guide.relatedPremiumSchemaSlugs.length).toBeGreaterThanOrEqual(1);
    });
  });

  test("related free slug FREE_TRAFFIC_TOOLS içinde var", () => {
    AUTHORITY_GUIDES.forEach((guide) => {
      guide.relatedFreeToolSlugs.forEach((slug) => {
        expect(FREE_SLUGS.has(slug)).toBe(true);
      });
    });
  });

  test("related premium slug premium catalog içinde var", () => {
    AUTHORITY_GUIDES.forEach((guide) => {
      guide.relatedPremiumSchemaSlugs.forEach((slug) => {
        expect(PREMIUM_SLUGS.has(slug)).toBe(true);
      });
    });
  });

  test("guide public text undefined/null içermiyor", () => {
    const joined = collectGuideStrings();
    expect(joined).not.toMatch(/\bundefined\b/i);
    expect(joined).not.toMatch(/\bnull\b/i);
    expect(joined).not.toMatch(/\bNaN\b/);
    expect(joined).not.toMatch(/\bschema\b/i);
    expect(joined).not.toMatch(/\bmigration\b/i);
    expect(joined).not.toMatch(/\bpilot\b/i);
  });

  test("sitemap guide route'ları eklenebilir", () => {
    const entries = buildSitemapEntries(new Date("2026-06-04T00:00:00.000Z"));
    const guideUrls = entries
      .map((entry) => entry.url)
      .filter((url) => url.includes("/guides/"));
    expect(guideUrls.length).toBe(countAuthorityGuideSitemapEntries());
    expect(guideUrls.some((url) => url.includes("/guides/how-to-calculate-manufacturing-cost"))).toBe(
      true,
    );
  });

  test("getAuthorityGuideBySlug resolves known guide", () => {
    const guide = getAuthorityGuideBySlug("how-to-use-area-converter");
    expect(guide?.slug).toBe("how-to-use-area-converter");
    expect(guide?.relatedFreeToolSlugs).toContain("area-converter");
  });
});
