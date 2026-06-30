import { describe, expect, test } from "vitest";
import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { getActiveSitemapLocales, SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";
import { listProgrammaticSeoSlugs } from "@/lib/infrastructure/seo/programmatic-seo-pages";
import { listPremiumToolSeoLandingSlugs } from "@/lib/infrastructure/seo/premium-tool-seo-landings";
import { SEO_P2_FIRST_50 } from "@/lib/infrastructure/seo/seo-p2-first-50";
import {
  buildAlternates,
  buildLocalizedPath,
  buildLocalizedUrl,
  getSitemapManifest,
} from "@/lib/infrastructure/seo/sitemap-manifest";
import { listPremiumSchemaSlugs } from "@/lib/features/premium-schema/schemas/index";

describe("premium auto sitemap manifest", () => {
  const manifest = getSitemapManifest();
  const paths = manifest.map((item) => item.path);

  test("getSitemapManifest boş değil", () => {
    expect(manifest.length).toBeGreaterThan(0);
  });

  test(">=100 free tool route içerir", () => {
    const freePaths = paths.filter((path) => path.startsWith("/tools/generated/"));
    const freeToolCount = manifest.filter((item) => item.type === "free_tool").length;
    expect(freePaths.length).toBeGreaterThanOrEqual(100);
    expect(freePaths.length).toBeGreaterThanOrEqual(freeToolCount);
  });

  test("premium schema route içerir", () => {
    const premiumPaths = paths.filter((path) => path.startsWith("/tools/premium-schema/"));
    expect(premiumPaths.length).toBe(listPremiumSchemaSlugs().length);
    expect(premiumPaths.length).toBeGreaterThanOrEqual(1);
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
    expect(paths.some((path) => /^\/api(?:\/|$)/.test(path))).toBe(false);
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

  test("free tool routes 1 locale için üretilir", () => {
    const freeItem = manifest.find((item) => item.type === "free_tool");
    expect(freeItem).toBeDefined();
    expect(freeItem!.locales).toEqual(getActiveSitemapLocales());
    const localized = freeItem!.locales.map((locale) => buildLocalizedPath(freeItem!.path, locale));
    expect(localized.length).toBe(1);
    for (const locale of getActiveSitemapLocales()) {
      if (locale === "en") {
        expect(localized).toContain(freeItem!.path);
      }
    }
  });

  test("premium routes 1 locale için üretilir", () => {
    const premiumItem = manifest.find((item) => item.type === "premium_analyzer" && item.path.startsWith("/tools/premium-schema/"));
    if (!premiumItem) {
      return;
    }
    const localized = getActiveSitemapLocales().map((locale) => buildLocalizedPath(premiumItem.path, locale));
    expect(localized).toContain(premiumItem.path);
    expect(localized.length).toBe(1);
  });

  test("alternates en, x-default içerir", () => {
    const locales = getActiveSitemapLocales();
    const alternates = buildAlternates("/free-tools", locales, "https://example.com");
    expect(alternates.languages.en).toBe("https://example.com/free-tools");
    expect(alternates.languages["x-default"]).toBe("https://example.com/free-tools");
    expect(alternates.languages.tr).toBeUndefined();
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
