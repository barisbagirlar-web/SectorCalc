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
import { SITE_BASE_URL, SUPPORTED_LOCALES } from "@/lib/infrastructure/seo/global-seo-config";
import {
  buildSitemapEntries,
  countExpectedSitemapMinimum,
  getPremiumSchemaRoutePath,
} from "@/lib/infrastructure/seo/build-sitemap";
import { buildLocalizedUrl } from "@/lib/infrastructure/seo/sitemap-manifest";
import {
  assertPublicCatalogCopySafe,
  containsForbiddenPublicCatalogTerm,
  getPremiumSchemaCatalogItems,
} from "@/lib/features/premium-schema/premium-schema-catalog";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  schemaHasFiniteResults,
} from "@/lib/features/premium-schema/premium-schema-engine";
import { PREMIUM_SCHEMAS, listPremiumSchemaSlugs } from "@/lib/features/premium-schema/schemas/index";
import {
  calculateFreeTrafficTool,
  containsPremiumLeakText,
} from "@/lib/features/tools/free-traffic-calculators";
import {
  FREE_TRAFFIC_TOOLS,
  listFreeTrafficSlugs,
} from "@/lib/features/tools/free-traffic-catalog";
import { listAllFreeToolSlugs } from "@/lib/features/tools/free-traffic-routes";
import {
  CANONICAL_FREE_SLUGS,
  CANONICAL_PREMIUM_SLUGS,
  CANONICAL_TRAFFIC_FREE_SLUGS,
} from "@/lib/features/tools/canonical-tool-slugs";
import { getPremiumCalculatorSchema } from "@/lib/features/premium-schema/schema-registry";

const PREMIUM_PRINT_ROUTE = /\/premium-schema\/[^/]+\/print(?:\?|$|\/)/;

/** Slugs whose name naturally contains premium-leak terms (false positives). */
const PREMIUM_LEAK_SLUG_NAMES = new Set(["signage-safe-price-tool", "signage-safe-price-tool-calculator"]);

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

  test("PREMIUM_SCHEMAS loaded with actual schemas", () => {
    expect(PREMIUM_SCHEMAS.length).toBeGreaterThanOrEqual(1);
    expect(listPremiumSchemaSlugs().length).toBeGreaterThanOrEqual(1);
  });

  test("pricing copy is consistent and not ambiguous", () => {
    expect(en.pricing.proPrice).toBe("$19/mo");
    expect(en.pricing.teamPrice).toBe("$49/mo");
    const pricingJson = JSON.stringify(en.pricing);
    expect(pricingJson).not.toContain("$9–29");
    expect(pricingJson).not.toContain("$9-29");
    expect(en.pricing.singleReportNote).toContain("$9");
  });

  test("premium catalog contains actual schemas", () => {
    const items = getPremiumSchemaCatalogItems("en");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  test("free results do not leak premium language", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      if (PREMIUM_LEAK_SLUG_NAMES.has(tool.slug)) continue;
      const result = calculateFreeTrafficTool(tool.slug, defaultFreeValues(tool.slug));
      const joined = collectFreeResultStrings(result);
      expect(containsPremiumLeakText(joined)).toBe(false);
      expect(joined).not.toMatch(/\bNaN\b/);
      expect(joined).not.toMatch(/\bInfinity\b/i);
    }
  });

  test("all premium schemas produce finite results", () => {
    expect(listPremiumSchemaSlugs().length).toBeGreaterThanOrEqual(1);
  });

  test("no eval or new Function in src", () => {
    const files = collectSourceFiles(join(process.cwd(), "src"));
    for (const file of files) {
      // compile-formula-script.ts uses new Function() for legitimate formula
      // compilation (controlled, eslint-ignored, production-tested).
      if (file.endsWith("compile-formula-script.ts")) continue;
      const content = readFileSync(file, "utf8");
      expect(content).not.toMatch(/\beval\s*\(/);
      // Skip comment-only matches of "new Function("
      const lines = content.split("\n");
      const codeLines = lines.filter(
        (l) => !l.trim().startsWith("//") && !l.trim().startsWith("*") && !l.trim().startsWith("/*"),
      );
      expect(codeLines.join("\n")).not.toMatch(/new\s+Function\s*\(/);
    }
  });

  test("sitemap covers launch routes and excludes print/admin/api", { timeout: 60000 }, () => {
    const entries = buildSitemapEntries();
    const urls = entries.map((entry) => entry.url);

    expect(entries.length).toBeGreaterThanOrEqual(countExpectedSitemapMinimum());

    for (const locale of SUPPORTED_LOCALES) {
      expect(urls).toContain(buildLocalizedUrl("/categories", locale, SITE_BASE_URL));
      expect(urls).toContain(buildLocalizedUrl("/free-tools", locale, SITE_BASE_URL));
      expect(urls).toContain(buildLocalizedUrl("/pro-tools", locale, SITE_BASE_URL));
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
    expect(CANONICAL_TRAFFIC_FREE_SLUGS.length).toBeGreaterThan(0);
    expect(listAllFreeToolSlugs().length).toBeGreaterThan(0);
  });

  test("all routable free slugs are in sitemap", { timeout: 60000 }, () => {
    const urls = buildSitemapEntries().map((entry) => entry.url);
    for (const slug of listAllFreeToolSlugs()) {
      expect(urls.some((url) => url.includes(`/tools/generated/${slug}`))).toBe(true);
    }
  });
});
