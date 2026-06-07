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
  test("FREE_TRAFFIC_TOOLS length === 100", () => {
    expect(FREE_TRAFFIC_TOOLS.length).toBe(100);
    expect(listFreeTrafficSlugs().length).toBe(100);
    expect(new Set(listFreeTrafficSlugs()).size).toBe(100);
  });

  test("PREMIUM_SCHEMAS length === 27", () => {
    expect(PREMIUM_SCHEMAS.length).toBe(27);
    expect(listPremiumSchemaSlugs().length).toBe(27);
  });

  test("pricing copy is consistent and not ambiguous", () => {
    expect(en.pricing.proPrice).toBe("$19/mo");
    expect(en.pricing.teamPrice).toBe("$49/mo");
    const pricingJson = JSON.stringify(en.pricing);
    expect(pricingJson).not.toContain("$9–29");
    expect(pricingJson).not.toContain("$9-29");
    expect(en.pricing.singleReportNote).toContain("$9");
  });

  test("premium catalog has 27 items with no forbidden public terms", () => {
    const items = getPremiumSchemaCatalogItems("en");
    expect(items.length).toBe(27);
    for (const item of items) {
      expect(assertPublicCatalogCopySafe(item)).toBe(true);
      expect(containsForbiddenPublicCatalogTerm(item.title)).toBe(false);
      expect(containsForbiddenPublicCatalogTerm(item.painStatement)).toBe(false);
    }
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
    for (const slug of listPremiumSchemaSlugs()) {
      const schema = getPremiumCalculatorSchema(slug);
      expect(schema).not.toBeNull();
      if (!schema) {
        continue;
      }
      const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
      expect(schemaHasFiniteResults(result)).toBe(true);
      expect(result.bigNumber.formatted.length).toBeGreaterThan(0);
      expect(result.legalNote.trim().length).toBeGreaterThan(0);
    }
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
      expect(urls).toContain(`${SITE_BASE_URL}/${locale}/categories`);
      expect(urls).toContain(`${SITE_BASE_URL}/${locale}/free-tools`);
      expect(urls).toContain(`${SITE_BASE_URL}/${locale}/premium-tools`);
      expect(urls).toContain(`${SITE_BASE_URL}/${locale}/industries`);
      expect(urls).toContain(`${SITE_BASE_URL}/${locale}/pricing`);
    }

    for (const slug of listFreeTrafficSlugs()) {
      expect(urls.some((url) => url.includes(`/tools/free/${slug}`))).toBe(true);
    }

    for (const slug of listPremiumSchemaSlugs()) {
      expect(urls.some((url) => url.includes(getPremiumSchemaRoutePath(slug)))).toBe(true);
    }

    expect(urls.some((url) => PREMIUM_PRINT_ROUTE.test(url))).toBe(false);
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);
  });

  test("core free tool spot checks pass", () => {
    const area = calculateFreeTrafficTool("area-converter", { value: 1, fromUnit: "m2" });
    expect(area.secondaryValues.length).toBeGreaterThan(1);

    const duration = calculateFreeTrafficTool("time-duration-calculator", {
      startHour: 10,
      startMinute: 30,
      endHour: 12,
      endMinute: 0,
    });
    expect(duration.secondaryValues.find((r) => r.label.toLowerCase().includes("minute"))?.value).toBe(
      "90"
    );

    const overnight = calculateFreeTrafficTool("time-duration-calculator", {
      startHour: 22,
      startMinute: 0,
      endHour: 1,
      endMinute: 0,
    });
    expect(
      overnight.secondaryValues.find((r) => r.label.toLowerCase().includes("minute"))?.value
    ).toBe("180");
  });

  test("all routable free slugs including revenue overlap are in sitemap", () => {
    const urls = buildSitemapEntries().map((entry) => entry.url);
    for (const slug of listAllFreeToolSlugs()) {
      expect(urls.some((url) => url.includes(`/tools/free/${slug}`))).toBe(true);
    }
  });
});
