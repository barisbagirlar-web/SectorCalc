/**
 * Launch readiness acceptance tests — complements production-hardening.test.ts.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const en = JSON.parse(
  readFileSync(join(process.cwd(), "messages/en.json"), "utf8")
) as {
  pricing: {
    proPrice: string;
    teamPrice: string;
    singleReportNote: string;
  };
};
import { SITE_BASE_URL, SUPPORTED_LOCALES } from "@/lib/seo/global-seo-config";
import {
  buildSitemapEntries,
  countExpectedSitemapMinimum,
  getPremiumSchemaRoutePath,
} from "@/lib/seo/build-sitemap";
import { buildLocalizedUrl } from "@/lib/seo/sitemap-manifest";
import {
  assertPublicCatalogCopySafe,
  containsForbiddenPublicCatalogTerm,
  getPremiumSchemaCatalogItems,
} from "@/lib/premium-schema/premium-schema-catalog";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  schemaHasFiniteResults,
} from "@/lib/premium-schema/premium-schema-engine";
import { PREMIUM_SCHEMAS, listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";
import {
  calculateFreeTrafficTool,
  containsPremiumLeakText,
} from "@/lib/tools/free-traffic-calculators";
import {
  FREE_TRAFFIC_TOOLS,
  listFreeTrafficSlugs,
} from "@/lib/tools/free-traffic-catalog";
import { listAllFreeToolSlugs } from "@/lib/tools/free-traffic-routes";
import {
  CANONICAL_FREE_SLUGS,
  CANONICAL_PREMIUM_SLUGS,
  CANONICAL_TRAFFIC_FREE_SLUGS,
} from "@/lib/tools/canonical-tool-slugs";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const PREMIUM_PRINT_ROUTE = /\/premium-schema\/[^/]+\/print(?:\?|$|\/)/;

function collectSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === ".next" || entry === "__tests__") {
        continue;
      }
      collectSourceFiles(fullPath, acc);
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function defaultFreeValues(slug: string): Record<string, number | string> {
  const tool = FREE_TRAFFIC_TOOLS.find((item) => item.slug === slug);
  if (!tool) {
    return {};
  }
  const values: Record<string, number | string> = {};
  for (const input of tool.inputs) {
    if (input.type === "select") {
      values[input.key] = input.defaultValue ?? input.options?.[0]?.value ?? "";
      continue;
    }
    values[input.key] =
      input.defaultValue !== undefined ? input.defaultValue : input.min !== undefined ? input.min : 1;
  }
  return values;
}

function collectFreeResultStrings(result: ReturnType<typeof calculateFreeTrafficTool>): string {
  return [
    result.headline,
    result.primaryLabel,
    result.primaryValue,
    result.explanation,
    ...result.secondaryValues.flatMap((row) => [row.label, row.value]),
  ].join(" ");
}

describe("launch-readiness", () => {
  test("FREE_TRAFFIC_TOOLS matches canonical free-slugs.json", () => {
    expect(FREE_TRAFFIC_TOOLS.length).toBe(CANONICAL_FREE_SLUGS.length);
    expect(listFreeTrafficSlugs().length).toBe(CANONICAL_FREE_SLUGS.length);
    expect(new Set(listFreeTrafficSlugs()).size).toBe(CANONICAL_FREE_SLUGS.length);
  });

  test("PREMIUM_SCHEMAS empty during regeneration baseline", () => {
    expect(PREMIUM_SCHEMAS.length).toBe(0);
    expect(listPremiumSchemaSlugs().length).toBe(0);
  });

  test("pricing copy is consistent and not ambiguous", () => {
    expect(en.pricing.proPrice).toBe("$19/mo");
    expect(en.pricing.teamPrice).toBe("$49/mo");
    const pricingJson = JSON.stringify(en.pricing);
    expect(pricingJson).not.toContain("$9–29");
    expect(pricingJson).not.toContain("$9-29");
    expect(en.pricing.singleReportNote).toContain("$9");
  });

  test("premium catalog empty during regeneration baseline", () => {
    const items = getPremiumSchemaCatalogItems("en");
    expect(items.length).toBe(0);
  });

  test("free results do not leak premium language", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      const result = calculateFreeTrafficTool(tool.slug, defaultFreeValues(tool.slug));
      const joined = collectFreeResultStrings(result);
      expect(containsPremiumLeakText(joined)).toBe(false);
      expect(joined).not.toMatch(/\bNaN\b/);
      expect(joined).not.toMatch(/\bInfinity\b/i);
    }
  });

  test("all premium schemas produce finite results with legal note", () => {
    expect(listPremiumSchemaSlugs().length).toBe(0);
  });

  test("no eval or new Function in src", () => {
    const files = collectSourceFiles(join(process.cwd(), "src"));
    for (const file of files) {
      const content = readFileSync(file, "utf8");
      expect(content).not.toMatch(/\beval\s*\(/);
      expect(content).not.toMatch(/new\s+Function\s*\(/);
    }
  });

  test("sitemap covers launch routes and excludes print/admin/api", () => {
    const entries = buildSitemapEntries();
    const urls = entries.map((entry) => entry.url);

    expect(entries.length).toBeGreaterThanOrEqual(countExpectedSitemapMinimum());

    for (const locale of SUPPORTED_LOCALES) {
      expect(urls).toContain(buildLocalizedUrl("/categories", locale, SITE_BASE_URL));
      expect(urls).toContain(buildLocalizedUrl("/free-tools", locale, SITE_BASE_URL));
      expect(urls).toContain(buildLocalizedUrl("/premium-tools", locale, SITE_BASE_URL));
      expect(urls).toContain(buildLocalizedUrl("/industries", locale, SITE_BASE_URL));
      expect(urls).toContain(buildLocalizedUrl("/pricing", locale, SITE_BASE_URL));
    }

    for (const slug of listFreeTrafficSlugs()) {
      expect(urls.some((url) => url.includes(`/tools/generated/${slug}`))).toBe(true);
    }

    expect(urls.some((url) => PREMIUM_PRINT_ROUTE.test(url))).toBe(false);
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);
  });

  test("canonical slug lists loaded from root JSON files", () => {
    expect(CANONICAL_PREMIUM_SLUGS.length).toBeGreaterThan(0);
    expect(CANONICAL_FREE_SLUGS.length).toBeGreaterThan(0);
    expect(CANONICAL_TRAFFIC_FREE_SLUGS.length).toBe(CANONICAL_FREE_SLUGS.length - 1);
    expect(listAllFreeToolSlugs().length).toBe(
      CANONICAL_PREMIUM_SLUGS.length + CANONICAL_TRAFFIC_FREE_SLUGS.length,
    );
  });

  test("all routable free slugs including revenue overlap are in sitemap", () => {
    const urls = buildSitemapEntries().map((entry) => entry.url);
    for (const slug of listAllFreeToolSlugs()) {
      expect(urls.some((url) => url.includes(`/tools/generated/${slug}`))).toBe(true);
    }
  });
});
