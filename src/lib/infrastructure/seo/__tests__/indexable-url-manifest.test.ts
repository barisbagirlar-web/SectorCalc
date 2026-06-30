import { describe, expect, test } from "vitest";
import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { buildLocalizedPath } from "@/lib/infrastructure/seo/sitemap-manifest";
import { listProgrammaticSeoSlugs } from "@/lib/infrastructure/seo/programmatic-seo-pages";
import {
  getIndexableUrlManifest,
  getManifestEnPathSet,
  INDEXABLE_LOCALES,
  isPathIndexable,
} from "@/lib/infrastructure/seo/indexable-url-manifest";
import { listAllFreeToolSlugs } from "@/lib/features/tools/free-traffic-routes";
import { listPremiumSchemaSlugs } from "@/lib/features/premium-schema/schemas/index";

function pathsForLocale(locale: "en" | "tr" | "de" | "fr" | "es" | "ar"): string[] {
  return getIndexableUrlManifest()
    .filter((item) => item.locale === locale)
    .map((item) => item.path);
}

describe("indexable URL manifest", () => {
  test("manifest boş değil", () => {
    expect(getIndexableUrlManifest().length).toBeGreaterThan(0);
  });

  test("duplicate path yok", () => {
    const paths = getIndexableUrlManifest().map((item) => item.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  test("admin path yok", () => {
    const paths = getIndexableUrlManifest().map((item) => item.path);
    expect(paths.some((path) => path.includes("/admin"))).toBe(false);
  });

  test("api path yok", () => {
    const paths = getIndexableUrlManifest().map((item) => item.path);
    expect(paths.some((path) => path.includes("/api/"))).toBe(false);
  });

  test("print path yok", () => {
    const paths = getIndexableUrlManifest().map((item) => item.path);
    expect(paths.some((path) => /\/print(?:\/|$)/.test(path))).toBe(false);
  });

  test("/en path yok", () => {
    const paths = getIndexableUrlManifest().map((item) => item.path);
    expect(paths.some((path) => path === "/en" || path.startsWith("/en/"))).toBe(false);
  });

  test("English /free-tools var", () => {
    expect(getIndexableUrlManifest().some((item) => item.path === "/free-tools")).toBe(true);
  });

  test("Turkish /tr/free-tools yok", () => {
    expect(getIndexableUrlManifest().some((item) => item.path === "/tr/free-tools")).toBe(false);
  });

  test("English /premium-tools var", () => {
    expect(getIndexableUrlManifest().some((item) => item.path === "/premium-tools")).toBe(true);
  });

  test("free tool path count >= 100 (EN root)", () => {
    const enFreePaths = pathsForLocale("en").filter((path) => path.startsWith("/tools/generated/"));
    expect(enFreePaths.length).toBeGreaterThanOrEqual(100);
  });

  test("premium schema path var (EN root)", () => {
    const enPremiumPaths = pathsForLocale("en").filter((path) =>
      path.startsWith("/tools/premium-schema/"),
    );
    expect(enPremiumPaths.length).toBe(listPremiumSchemaSlugs().length);
    expect(enPremiumPaths.length).toBeGreaterThanOrEqual(1);
  });

  test("SEO landing pathleri var", () => {
    const manifest = getIndexableUrlManifest();
    const seoSlugs = listProgrammaticSeoSlugs();
    const allPaths = new Set(manifest.map((item) => item.path));
    for (const locale of INDEXABLE_LOCALES) {
      for (const slug of seoSlugs) {
        expect(allPaths.has(buildLocalizedPath(`/seo/${slug}`, locale))).toBe(true);
      }
    }
  });

  test("Guide pathleri var", () => {
    const manifest = getIndexableUrlManifest();
    const guideSlugs = listAuthorityGuideSlugs();
    const allPaths = new Set(manifest.map((item) => item.path));
    for (const locale of INDEXABLE_LOCALES) {
      for (const slug of guideSlugs) {
        expect(allPaths.has(buildLocalizedPath(`/guides/${slug}`, locale))).toBe(true);
      }
    }
  });

  test("inspectionOrder unique ve stable", () => {
    const orders = getIndexableUrlManifest().map((item) => item.inspectionOrder);
    expect(new Set(orders).size).toBe(orders.length);
    expect(orders.every((order) => order > 0)).toBe(true);
  });

  test("critical GSC paths included in EN manifest", () => {
    const enPaths = getManifestEnPathSet();
    expect(enPaths.has("/")).toBe(true);
    expect(enPaths.has("/tools/generated/overall-equipment-effectiveness-calculator")).toBe(true);
    expect(enPaths.has("/tools/premium-schema/7-israf-muda-avcisi-parasal-karsilik-calculator")).toBe(true);
    expect(enPaths.has("/guides/what-is-oee-and-how-to-calculate-it")).toBe(true);
  });

  test("isPathIndexable rejects admin api print", () => {
    expect(isPathIndexable("/admin/leads")).toBe(false);
    expect(isPathIndexable("/api/health")).toBe(false);
    expect(isPathIndexable("/tools/premium-schema/cnc-oee-loss/print")).toBe(false);
    expect(isPathIndexable("/free-tools")).toBe(true);
  });
});
