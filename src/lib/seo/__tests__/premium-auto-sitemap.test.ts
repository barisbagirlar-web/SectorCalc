import { describe, expect, test } from "vitest";
import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { SITE_BASE_URL } from "@/lib/seo/global-seo-config";
import { listProgrammaticSeoSlugs } from "@/lib/seo/programmatic-seo-pages";
import {
  buildAlternates,
  buildLocalizedPath,
  buildLocalizedUrl,
  getSitemapManifest,
} from "@/lib/seo/sitemap-manifest";
import { listFreeTrafficSlugs } from "@/lib/tools/free-traffic-catalog";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";

describe("premium auto sitemap manifest", () => {
  const manifest = getSitemapManifest();
  const paths = manifest.map((item) => item.path);

  test("getSitemapManifest boş değil", () => {
    expect(manifest.length).toBeGreaterThan(0);
  });

  test(">=100 free tool route içerir", () => {
    const freePaths = paths.filter((path) => path.startsWith("/tools/free/"));
    expect(freePaths.length).toBeGreaterThanOrEqual(100);
    expect(freePaths.length).toBeGreaterThanOrEqual(listFreeTrafficSlugs().length);
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

  test("sitemap /tr URL üretir", () => {
    expect(buildLocalizedUrl("/free-tools", "tr", "https://example.com")).toBe(
      "https://example.com/tr/free-tools",
    );
    expect(buildLocalizedUrl("/", "tr", "https://example.com")).toBe("https://example.com/tr");
  });

  test("free tool English route /tools/free/[slug]", () => {
    expect(paths).toContain("/tools/free/area-converter");
  });

  test("free tool Turkish route /tr/tools/free/[slug]", () => {
    const trPaths = manifest
      .filter((item) => item.path.startsWith("/tools/free/"))
      .flatMap((item) => item.locales.map((locale) => buildLocalizedPath(item.path, locale)));
    expect(trPaths).toContain("/tr/tools/free/area-converter");
  });

  test("premium English route /tools/premium-schema/[slug]", () => {
    expect(paths.some((path) => path.startsWith("/tools/premium-schema/"))).toBe(true);
  });

  test("premium Turkish route /tr/tools/premium-schema/[slug]", () => {
    const trPremium = buildLocalizedPath("/tools/premium-schema/cnc-oee-loss", "tr");
    expect(trPremium).toBe("/tr/tools/premium-schema/cnc-oee-loss");
  });

  test("alternates en/tr/x-default içerir", () => {
    const alternates = buildAlternates("/free-tools", ["en", "tr"], "https://example.com");
    expect(alternates.languages.en).toBe("https://example.com/free-tools");
    expect(alternates.languages.tr).toBe("https://example.com/tr/free-tools");
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
