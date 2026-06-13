import { describe, expect, test } from "vitest";
import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { getActiveSitemapLocales, SITE_BASE_URL } from "@/lib/seo/global-seo-config";
import { listProgrammaticSeoSlugs } from "@/lib/seo/programmatic-seo-pages";
import { listPremiumToolSeoLandingSlugs } from "@/lib/seo/premium-tool-seo-landings";
import { SEO_P2_FIRST_50 } from "@/lib/seo/seo-p2-first-50";
import {
  buildAlternates,
  buildLocalizedPath,
  buildLocalizedUrl,
  getSitemapManifest,
} from "@/lib/seo/sitemap-manifest";
import { buildCategorizedToolIndex } from "@/lib/catalog/build-categorized-tool-index";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";

describe("premium auto sitemap manifest", () => {
  const manifest = getSitemapManifest();
  const paths = manifest.map((item) => item.path);

  test("getSitemapManifest boş değil", () => {
    expect(manifest.length).toBeGreaterThan(0);
  });

  test(">=100 free tool route içerir", () => {
    const freePaths = paths.filter((path) => path.startsWith("/tools/free/"));
    const activeFreeCount = buildCategorizedToolIndex().filter(
      (item) => item.publicStatus === "active" && item.tier === "free" && item.routePath,
    ).length;
    expect(freePaths.length).toBeGreaterThanOrEqual(100);
    expect(freePaths.length).toBeGreaterThanOrEqual(activeFreeCount);
  });

  test(">=27 premium analyzer route içerir", () => {
    const premiumPaths = paths.filter((path) => path.startsWith("/tools/premium-schema/"));
    expect(premiumPaths.length).toBeGreaterThanOrEqual(27);
    expect(premiumPaths.length).toBe(listPremiumSchemaSlugs().length);
  });

  test("SEO landing route içerir", () => {
    const seoSlugs = listProgrammaticSeoSlugs();
    for (const slug of seoSlugs) {
      expect(paths).toContain(`/seo/${slug}`);
    }
  });

  test("SEO-P2 first 50 premium tool landing routes in sitemap", () => {
    expect(SEO_P2_FIRST_50.length).toBe(50);
    expect(listPremiumToolSeoLandingSlugs().length).toBe(50);
    for (const slug of listPremiumToolSeoLandingSlugs()) {
      expect(paths).toContain(`/seo/${slug}`);
    }
  });

  test("authority guide route içerir", () => {
    const guideSlugs = listAuthorityGuideSlugs();
    for (const slug of guideSlugs) {
      expect(paths).toContain(`/guides/${slug}`);
    }
  });

  test("duplicate path yok", () => {
    expect(new Set(paths).size).toBe(paths.length);
  });

  test("admin path yok", () => {
    expect(paths.some((path) => path.includes("/admin"))).toBe(false);
  });

  test("api path yok", () => {
    expect(paths.some((path) => path.includes("/api"))).toBe(false);
  });

  test("print path yok", () => {
    expect(paths.some((path) => /\/print(?:\/|$)/.test(path))).toBe(false);
  });

  test("checkout temporary yok", () => {
    expect(paths.some((path) => path.startsWith("/checkout"))).toBe(false);
  });

  test("her route priority 0-1 arası", () => {
    for (const item of manifest) {
      expect(item.priority).toBeGreaterThanOrEqual(0);
      expect(item.priority).toBeLessThanOrEqual(1);
    }
  });

  test("her route changeFrequency dolu", () => {
    for (const item of manifest) {
      expect(["daily", "weekly", "monthly", "yearly"]).toContain(item.changeFrequency);
    }
  });

  test("buildLocalizedUrl en root URL üretir", () => {
    expect(buildLocalizedUrl("/free-tools", "en", "https://example.com")).toBe(
      "https://example.com/free-tools",
    );
    expect(buildLocalizedUrl("/", "en", "https://example.com")).toBe("https://example.com/");
  });

  test("sitemap /en URL üretmez", () => {
    const urls = manifest.flatMap((item) =>
      item.locales.map((locale) => buildLocalizedUrl(item.path, locale, "https://example.com")),
    );
    expect(urls.some((url) => url.includes("/en/") || url.endsWith("/en"))).toBe(false);
  });

  test("sitemap prefixed locale URLs üretir", () => {
    expect(buildLocalizedUrl("/free-tools", "tr", "https://example.com")).toBe(
      "https://example.com/tr/free-tools",
    );
    expect(buildLocalizedUrl("/free-tools", "de", "https://example.com")).toBe(
      "https://example.com/de/free-tools",
    );
    expect(buildLocalizedUrl("/free-tools", "fr", "https://example.com")).toBe(
      "https://example.com/fr/free-tools",
    );
    expect(buildLocalizedUrl("/free-tools", "es", "https://example.com")).toBe(
      "https://example.com/es/free-tools",
    );
    expect(buildLocalizedUrl("/free-tools", "ar", "https://example.com")).toBe(
      "https://example.com/ar/free-tools",
    );
    expect(buildLocalizedUrl("/", "tr", "https://example.com")).toBe("https://example.com/tr");
    expect(buildLocalizedUrl("/", "de", "https://example.com")).toBe("https://example.com/de");
  });

  test("free tool routes 6 locale için üretilir", () => {
    const freeItem = manifest.find((item) => item.path === "/tools/free/area-converter");
    expect(freeItem?.locales).toEqual(getActiveSitemapLocales());
    const localized = freeItem?.locales.map((locale) => buildLocalizedPath(freeItem.path, locale));
    expect(localized).toContain("/tools/free/area-converter");
    expect(localized).toContain("/tr/tools/free/area-converter");
    expect(localized).toContain("/de/tools/free/area-converter");
    expect(localized).toContain("/fr/tools/free/area-converter");
    expect(localized).toContain("/es/tools/free/area-converter");
    expect(localized).toContain("/ar/tools/free/area-converter");
  });

  test("premium routes 6 locale için üretilir", () => {
    const premiumPath = "/tools/premium-schema/cnc-oee-loss";
    const localized = getActiveSitemapLocales().map((locale) => buildLocalizedPath(premiumPath, locale));
    expect(localized).toContain("/tools/premium-schema/cnc-oee-loss");
    expect(localized).toContain("/ar/tools/premium-schema/cnc-oee-loss");
    expect(localized.length).toBe(6);
  });

  test("alternates en,tr,de,fr,es,ar,x-default içerir", () => {
    const locales = getActiveSitemapLocales();
    const alternates = buildAlternates("/free-tools", locales, "https://example.com");
    expect(alternates.languages.en).toBe("https://example.com/free-tools");
    expect(alternates.languages.tr).toBe("https://example.com/tr/free-tools");
    expect(alternates.languages.de).toBe("https://example.com/de/free-tools");
    expect(alternates.languages.fr).toBe("https://example.com/fr/free-tools");
    expect(alternates.languages.es).toBe("https://example.com/es/free-tools");
    expect(alternates.languages.ar).toBe("https://example.com/ar/free-tools");
    expect(alternates.languages["x-default"]).toBe("https://example.com/free-tools");
  });

  test("SITE_BASE_URL https ile başlar", () => {
    expect(SITE_BASE_URL.startsWith("https://")).toBe(true);
  });

  test("sitemap manifestte undefined/null path yok", () => {
    for (const item of manifest) {
      expect(item.path).toBeTruthy();
      expect(typeof item.path).toBe("string");
    }
  });
});
