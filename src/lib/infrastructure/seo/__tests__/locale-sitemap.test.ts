import { describe, expect, test } from "vitest";
import {
  computeSitemapEtag,
  generateSitemapIndexXml,
  generateSitemapUrlsetXml,
} from "@/lib/infrastructure/seo/generate-sitemap-xml";
import { buildLocaleSitemapEntries, buildLocaleSitemapUrlRecords } from "@/lib/infrastructure/seo/locale-sitemap";
import { resolveSitemapLastModified } from "@/lib/infrastructure/seo/resolve-sitemap-lastmod";
import { getStaticPages } from "@/lib/infrastructure/seo/static-pages";
import { buildLocalizedUrl, getSitemapManifest } from "@/lib/infrastructure/seo/sitemap-manifest";
import { SITE_BASE_URL } from "@/lib/infrastructure/seo/global-seo-config";

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

    const activeLocales = ["en"] as const; // Only English is indexable and active
    for (const locale of activeLocales) {
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

  test("buildLocaleSitemapUrlRecords includes hreflang alternates", async () => {
    const records = await buildLocaleSitemapUrlRecords("en");
    const hub = records.find((entry) => entry.url === buildLocalizedUrl("/free-tools", "en", SITE_BASE_URL));
    expect(hub?.alternates?.length).toBeGreaterThanOrEqual(1);
    expect(hub?.alternates?.some((link) => link.hreflang === "x-default")).toBe(true);
    expect(hub?.alternates?.some((link) => link.hreflang === "en")).toBe(true);
  });

  test("resolveSitemapLastModified uses schema mtime for generated tools", () => {
    const fallback = new Date("2020-01-01T00:00:00.000Z");
    const lastMod = resolveSitemapLastModified("/tools/generated/overall-equipment-effectiveness-calculator", fallback, new Map());
    expect(lastMod.getTime()).toBeGreaterThan(fallback.getTime());
  });

  test("generateSitemapUrlsetXml escapes XML and emits xhtml:link", () => {
    const xml = generateSitemapUrlsetXml([
      {
        url: "https://example.com/a&b",
        lastModified: new Date("2026-06-17T12:00:00.000Z"),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: [
          { hreflang: "en", href: "https://example.com/a&b" },
          { hreflang: "x-default", href: "https://example.com/a&b" },
        ],
      },
    ]);
    expect(xml).toContain("<loc>https://example.com/a&amp;b</loc>");
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(xml).toContain('hreflang="en"');
    expect(xml).toContain("xhtml:link");
  });

  test("generateSitemapIndexXml lists locale shards", () => {
    const xml = generateSitemapIndexXml([
      {
        url: "https://sectorcalc.com/sitemap/en.xml",
        lastModified: new Date("2026-06-17T12:00:00.000Z"),
      },
      {
        url: "https://sectorcalc.com/sitemap/tr.xml",
        lastModified: new Date("2026-06-17T12:00:00.000Z"),
      },
    ]);
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain("/sitemap/en.xml");
    expect(xml).toContain("/sitemap/tr.xml");
  });

  test("computeSitemapEtag is stable for identical bodies", () => {
    const body = "<urlset></urlset>";
    expect(computeSitemapEtag(body)).toBe(computeSitemapEtag(body));
    expect(computeSitemapEtag(body)).not.toBe(computeSitemapEtag("<urlset />"));
  });
});
