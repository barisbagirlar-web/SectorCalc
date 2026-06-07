import { describe, expect, test } from "vitest";
import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { listProgrammaticSeoSlugs } from "@/lib/seo/programmatic-seo-pages";
import {
  getIndexableUrlManifest,
  getManifestEnPathSet,
  INDEXABLE_LOCALES,
  isPathIndexable,
} from "@/lib/seo/indexable-url-manifest";
import { listAllFreeToolSlugs } from "@/lib/tools/free-traffic-routes";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";

function pathsForLocale(locale: "en" | "tr"): string[] {
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

  test("/en/free-tools var", () => {
    expect(getIndexableUrlManifest().some((item) => item.path === "/en/free-tools")).toBe(true);
  });

  test("/en/premium-tools var", () => {
    expect(getIndexableUrlManifest().some((item) => item.path === "/en/premium-tools")).toBe(
      true,
    );
  });

  test("free tool path count matches catalog (EN)", () => {
    const enFreePaths = pathsForLocale("en").filter((path) => path.startsWith("/en/tools/free/"));
    expect(enFreePaths.length).toBe(listAllFreeToolSlugs().length);
    expect(enFreePaths.length).toBeGreaterThanOrEqual(100);
  });

  test("27 premium schema path var (EN)", () => {
    const enPremiumPaths = pathsForLocale("en").filter((path) =>
      path.startsWith("/en/tools/premium-schema/"),
    );
    expect(enPremiumPaths.length).toBe(listPremiumSchemaSlugs().length);
    expect(enPremiumPaths.length).toBe(27);
  });

  test("SEO landing pathleri var", () => {
    const seoSlugs = listProgrammaticSeoSlugs();
    for (const locale of INDEXABLE_LOCALES) {
      for (const slug of seoSlugs) {
        expect(
          getIndexableUrlManifest().some((item) => item.path === `/${locale}/seo/${slug}`),
        ).toBe(true);
      }
    }
  });

  test("Guide pathleri var", () => {
    const guideSlugs = listAuthorityGuideSlugs();
    for (const locale of INDEXABLE_LOCALES) {
      for (const slug of guideSlugs) {
        expect(
          getIndexableUrlManifest().some((item) => item.path === `/${locale}/guides/${slug}`),
        ).toBe(true);
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
    expect(enPaths.has("/en")).toBe(true);
    expect(enPaths.has("/en/tools/free/oee-calculator")).toBe(true);
    expect(enPaths.has("/en/tools/premium-schema/cnc-oee-loss")).toBe(true);
    expect(enPaths.has("/en/guides/what-is-oee-and-how-to-calculate-it")).toBe(true);
  });

  test("isPathIndexable rejects admin api print", () => {
    expect(isPathIndexable("/en/admin/leads")).toBe(false);
    expect(isPathIndexable("/api/health")).toBe(false);
    expect(isPathIndexable("/en/tools/premium-schema/cnc-oee-loss/print")).toBe(false);
    expect(isPathIndexable("/en/free-tools")).toBe(true);
  });
});
