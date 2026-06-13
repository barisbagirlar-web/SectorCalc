import { describe, expect, test } from "vitest";
import { getPremiumToolSeoLandingBySlug, listPremiumToolSeoLandingSlugs } from "@/lib/seo/premium-tool-seo-landings";
import { SEO_P2_FIRST_50 } from "@/lib/seo/seo-p2-first-50";

describe("SEO-P2 first 50 landings", () => {
  test("registry has exactly 50 slugs", () => {
    expect(SEO_P2_FIRST_50.length).toBe(50);
    expect(listPremiumToolSeoLandingSlugs().length).toBe(50);
  });

  test("every slug resolves to a landing with CTA path", () => {
    for (const entry of SEO_P2_FIRST_50) {
      const landing = getPremiumToolSeoLandingBySlug(entry.slug, "en");
      expect(landing, entry.slug).not.toBeNull();
      expect(landing?.slug).toBe(entry.slug);
      expect(landing?.source).toBe(entry.source);
      expect(landing?.premiumHref.startsWith("/tools/")).toBe(true);
      expect(landing?.seoHref).toBe(`/seo/${entry.slug}`);
      expect(landing?.context.inputs.length).toBeGreaterThan(0);
      expect(landing?.related.length).toBeGreaterThan(0);
    }
  });

  test("schema landings point to premium-schema routes", () => {
    const schemaSlugs = SEO_P2_FIRST_50.filter((e) => e.source === "schema").map((e) => e.slug);
    expect(schemaSlugs.length).toBe(23);
    for (const slug of schemaSlugs) {
      const landing = getPremiumToolSeoLandingBySlug(slug, "en");
      expect(landing?.premiumHref).toBe(`/tools/premium-schema/${slug}`);
    }
  });
});
