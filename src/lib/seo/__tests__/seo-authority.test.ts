import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  buildFAQJsonLd,
  sanitizeJsonLd,
} from "@/lib/seo/schema-mesh";
import { buildSitemapEntries } from "@/lib/seo/build-sitemap";
import { getManifestEnPathSet } from "@/lib/seo/indexable-url-manifest";
import {
  PROGRAMMATIC_SEO_PAGES,
  listProgrammaticSeoSlugs,
} from "@/lib/seo/programmatic-seo-pages";
import {
  SECTORCALC_CORE_ENTITIES,
  getEntityById,
  getRelatedEntities,
} from "@/lib/seo/seo-authority-model";
import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import { PREMIUM_SCHEMAS, listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";
import { getPremiumSchemaCatalogItems } from "@/lib/premium-schema/premium-schema-catalog";

const PUBLIC_ROOT = join(process.cwd(), "public");
const INDEXNOW_SCRIPT = join(process.cwd(), "scripts", "submit-indexnow.mjs");

function readPublicTxt(name: string): string {
  const path = join(PUBLIC_ROOT, name);
  expect(existsSync(path)).toBe(true);
  return readFileSync(path, "utf8");
}

function jsonHasNullOrUndefined(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some((item) => jsonHasNullOrUndefined(item));
  }
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((item) =>
      jsonHasNullOrUndefined(item)
    );
  }
  return false;
}

describe("seo-authority architecture", () => {
  test("public llms.txt exists with hub references", () => {
    const content = readPublicTxt("llms.txt");
    expect(content).toContain("SectorCalc");
    expect(content).toContain("/free-tools");
    expect(content).toContain("/premium-tools");
    expect(content).not.toContain("/en/free-tools");
    expect(content).not.toContain("[object Object]");
  });

  test("sectorcalc-index.txt exists", () => {
    const content = readPublicTxt("sectorcalc-index.txt");
    expect(content).toContain("Free calculators");
    expect(content).toContain("Premium decision reports");
  });

  test("services-products.txt exists", () => {
    const content = readPublicTxt("services-products.txt");
    expect(content).toContain("Pricing tiers");
    expect(content).toContain("Free calculators");
  });

  test("faq-knowledge.txt exists with core questions", () => {
    const content = readPublicTxt("faq-knowledge.txt");
    expect(content).toContain("What is SectorCalc?");
    expect(content).toContain("What is OEE?");
    expect(content).not.toContain("[object Object]");
  });

  test("PROGRAMMATIC_SEO_PAGES has at least 8 hubs", () => {
    expect(PROGRAMMATIC_SEO_PAGES.length).toBeGreaterThanOrEqual(8);
    expect(listProgrammaticSeoSlugs().length).toBeGreaterThanOrEqual(8);
  });

  test("FREE_TRAFFIC_TOOLS count is 100", () => {
    expect(FREE_TRAFFIC_TOOLS.length).toBe(100);
  });

  test("PREMIUM_SCHEMAS count is 27", () => {
    expect(PREMIUM_SCHEMAS.length).toBe(27);
    expect(listPremiumSchemaSlugs().length).toBe(27);
  });

  test("sitemap helper produces indexable public routes", () => {
    const entries = buildSitemapEntries();
    const urls = entries.map((entry) => entry.url);
    expect(entries.length).toBeGreaterThan(200);
    expect(urls.some((url) => url.includes("/free-tools") && !url.includes("/en/"))).toBe(true);
    expect(urls.some((url) => url.includes("/seo/manufacturing-cost-calculators"))).toBe(true);
  });

  test("sitemap excludes admin, api and print routes", () => {
    const urls = buildSitemapEntries().map((entry) => entry.url);
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);
    expect(urls.some((url) => /\/premium-schema\/[^/]+\/print/.test(url))).toBe(false);
  });

  test("schema mesh builds Organization JSON-LD", () => {
    const org = buildOrganizationJsonLd("en");
    expect(org["@type"]).toBe("Organization");
    expect(org.name).toBe("SectorCalc");
    expect(jsonHasNullOrUndefined(org)).toBe(false);
  });

  test("schema mesh builds Website JSON-LD", () => {
    const site = buildWebsiteJsonLd("en");
    expect(site["@type"]).toBe("WebSite");
    expect(jsonHasNullOrUndefined(site)).toBe(false);
  });

  test("FAQ JSON-LD only when questions and answers are present", () => {
    expect(buildFAQJsonLd([])).toBeNull();
    expect(
      buildFAQJsonLd([{ question: " ", answer: "Valid answer with enough detail." }])
    ).toBeNull();
    const faq = buildFAQJsonLd([
      { question: "What is OEE?", answer: "Overall Equipment Effectiveness measures availability, performance and quality." },
    ]);
    expect(faq).not.toBeNull();
    expect(faq?.["@type"]).toBe("FAQPage");
  });

  test("sanitizeJsonLd removes undefined and null values", () => {
    const cleaned = sanitizeJsonLd({
      keep: "yes",
      dropNull: null,
      dropUndefined: undefined,
      nested: { a: 1, b: undefined },
    });
    expect(jsonHasNullOrUndefined(cleaned)).toBe(false);
  });

  test("public catalog labels avoid schema migration debug terms", () => {
    const forbidden = ["schema migration", "debug mode", "formula registry dump"];
    for (const item of getPremiumSchemaCatalogItems("en")) {
      const joined = [item.title, item.painStatement, item.promise].join(" ").toLowerCase();
      for (const term of forbidden) {
        expect(joined).not.toContain(term);
      }
    }
  });

  test("entity graph resolves core entities and relations", () => {
    expect(SECTORCALC_CORE_ENTITIES.length).toBeGreaterThanOrEqual(17);
    const core = getEntityById("sectorcalc");
    expect(core?.name).toBe("SectorCalc");
    const related = getRelatedEntities("sectorcalc");
    expect(related.length).toBeGreaterThan(0);
  });

  test("IndexNow script exits gracefully without INDEXNOW_KEY", () => {
    const script = readFileSync(INDEXNOW_SCRIPT, "utf8");
    expect(script).toContain("INDEXNOW_KEY not set");
    expect(script).toContain("process.exit(0)");
  });

  test("manifest EN paths appear in sitemap", () => {
    const manifestPaths = getManifestEnPathSet();
    const sitemapPaths = new Set(
      buildSitemapEntries().map((entry) => new URL(entry.url).pathname),
    );
    for (const path of manifestPaths) {
      expect(sitemapPaths.has(path)).toBe(true);
    }
  });
});
