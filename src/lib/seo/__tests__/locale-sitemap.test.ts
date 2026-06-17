import { describe, expect, test } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import {
  generateSitemapIndexXml,
  generateSitemapUrlsetXml,
} from "@/lib/seo/generate-sitemap-xml";
import { buildLocaleSitemapEntries } from "@/lib/seo/locale-sitemap";
import { getStaticPages } from "@/lib/seo/static-pages";
import { buildLocalizedUrl, getSitemapManifest } from "@/lib/seo/sitemap-manifest";
import { SITE_BASE_URL } from "@/lib/seo/global-seo-config";

describe("locale sitemap", () => {
  test("getStaticPages returns core legal and marketing routes", () => {
    const paths = getStaticPages("en").map((page) => page.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/pricing");
    expect(paths).toContain("/privacy");
    expect(paths).toContain("/terms");
  });

  test("buildLocaleSitemapEntries covers manifest routes for each locale", async () => {
    const manifest = getSitemapManifest();
    const manifestCountForEn = manifest.filter((item) => item.locales.includes("en")).length;

    for (const locale of SUPPORTED_LOCALES) {
      const entries = await buildLocaleSitemapEntries(locale);
      const expectedCount = manifest.filter((item) => item.locales.includes(locale)).length;
      expect(entries.length).toBeGreaterThanOrEqual(expectedCount);
      expect(entries.some((entry) => entry.url.includes("/free-tools"))).toBe(true);
      expect(entries.some((entry) => entry.url.includes("/en/"))).toBe(false);
    }

    const enEntries = await buildLocaleSitemapEntries("en");
    expect(enEntries.length).toBeGreaterThanOrEqual(manifestCountForEn);
    expect(enEntries.some((entry) => entry.url === buildLocalizedUrl("/free-tools", "en", SITE_BASE_URL))).toBe(
      true,
    );
  });

  test("generateSitemapUrlsetXml escapes XML entities", () => {
    const xml = generateSitemapUrlsetXml([
      {
        url: "https://example.com/a&b",
        lastModified: new Date("2026-06-17T12:00:00.000Z"),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ]);
    expect(xml).toContain("<loc>https://example.com/a&amp;b</loc>");
    expect(xml).toContain("<urlset");
  });

  test("generateSitemapIndexXml lists locale shards", () => {
    const xml = generateSitemapIndexXml([
      {
        url: "https://www.sectorcalc.com/sitemap/en.xml",
        lastModified: new Date("2026-06-17T12:00:00.000Z"),
      },
      {
        url: "https://www.sectorcalc.com/sitemap/tr.xml",
        lastModified: new Date("2026-06-17T12:00:00.000Z"),
      },
    ]);
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain("/sitemap/en.xml");
    expect(xml).toContain("/sitemap/tr.xml");
  });
});
