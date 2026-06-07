import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { siteUrl } from "@/config/site";
import { locales } from "@/i18n/locales";
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
import { PRICING_COPY_ASSERTIONS } from "@/lib/premium-schema/premium-claim-copy";
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
import { PREVIEW_ENTITLEMENT } from "@/lib/entitlements/premium-entitlements";
import { gatePremiumReportExportPayload } from "@/lib/premium-schema/premium-report-gate";
import { buildPremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const PREMIUM_LEAK_TERMS = [
  "DO NOT ACCEPT UNDER",
  "Minimum safe price",
  "P90",
  "final verdict",
  "full decision report unlocked",
] as const;

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

function collectFreeResultStrings(
  result: ReturnType<typeof calculateFreeTrafficTool>,
): string {
  return [
    result.headline,
    result.primaryLabel,
    result.primaryValue,
    result.explanation,
    result.legalNote,
    ...result.secondaryValues.flatMap((row) => [row.label, row.value]),
  ].join(" ");
}

describe("production-hardening", () => {
  test("FREE_TRAFFIC_TOOLS length === 100", () => {
    expect(FREE_TRAFFIC_TOOLS.length).toBe(100);
    expect(listFreeTrafficSlugs().length).toBe(100);
  });

  test("PREMIUM_SCHEMAS length === 27", () => {
    expect(PREMIUM_SCHEMAS.length).toBe(27);
    expect(listPremiumSchemaSlugs().length).toBe(27);
    expect(new Set(listPremiumSchemaSlugs()).size).toBe(27);
  });

  test("sitemap includes core public routes and expected minimum count", () => {
    const entries = buildSitemapEntries();
    const urls = entries.map((entry) => entry.url);

    expect(entries.length).toBeGreaterThanOrEqual(countExpectedSitemapMinimum());

    for (const locale of locales) {
      expect(urls).toContain(`${siteUrl}/${locale}/categories`);
      expect(urls).toContain(`${siteUrl}/${locale}/premium-tools`);
      expect(urls).toContain(`${siteUrl}/${locale}/tools/free/area-converter`);
      expect(urls).toContain(`${siteUrl}/${locale}/tools/premium-schema/cnc-oee-loss`);
    }

    for (const slug of listAllFreeToolSlugs()) {
      expect(urls.some((url) => url.includes(`/tools/free/${slug}`))).toBe(true);
    }

    for (const slug of listPremiumSchemaSlugs()) {
      expect(urls.some((url) => url.includes(getPremiumSchemaRoutePath(slug)))).toBe(true);
    }

    expect(urls.some((url) => /\/premium-schema\/[^/]+\/print/.test(url))).toBe(false);
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);
  });

  test("free results do not leak premium language", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      const result = calculateFreeTrafficTool(tool.slug, defaultFreeValues(tool.slug));
      const joined = collectFreeResultStrings(result);
      expect(containsPremiumLeakText(joined)).toBe(false);
      for (const term of PREMIUM_LEAK_TERMS) {
        expect(joined.toLowerCase()).not.toContain(term.toLowerCase());
      }
    }
  });

  test("premium catalog public labels avoid forbidden technical terms", () => {
    for (const item of getPremiumSchemaCatalogItems("en")) {
      expect(assertPublicCatalogCopySafe(item)).toBe(true);
      expect(containsForbiddenPublicCatalogTerm(item.title)).toBe(false);
      expect(containsForbiddenPublicCatalogTerm(item.painStatement)).toBe(false);
      expect(containsForbiddenPublicCatalogTerm(item.promise)).toBe(false);
    }
  });

  test("pricing copy assertions", () => {
    expect(PRICING_COPY_ASSERTIONS.forbiddenRange).toBe("$9–29");
    expect(PRICING_COPY_ASSERTIONS.proPrice).toContain("$19");
    expect(PRICING_COPY_ASSERTIONS.teamPrice).toContain("$49");
  });

  test("no eval or new Function in src", () => {
    const files = collectSourceFiles(join(process.cwd(), "src"));
    for (const file of files) {
      const content = readFileSync(file, "utf8");
      expect(content).not.toMatch(/\beval\s*\(/);
      expect(content).not.toMatch(/new\s+Function\s*\(/);
    }
  });

  test("no NaN or Infinity in sample free and premium outputs", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      const result = calculateFreeTrafficTool(tool.slug, defaultFreeValues(tool.slug));
      const joined = collectFreeResultStrings(result);
      expect(joined).not.toMatch(/\bNaN\b/);
      expect(joined).not.toMatch(/\bInfinity\b/i);
    }

    for (const slug of listPremiumSchemaSlugs()) {
      const schema = getPremiumCalculatorSchema(slug);
      expect(schema).not.toBeNull();
      if (!schema) {
        continue;
      }
      const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
      expect(schemaHasFiniteResults(result)).toBe(true);
      const serialized = JSON.stringify(result);
      expect(serialized).not.toMatch(/\bNaN\b/);
      expect(serialized).not.toMatch(/\bInfinity\b/);
    }
  });

  test("preview entitlement gates full export payload", () => {
    const schema = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const payload = buildPremiumReportExportPayload(schema, result, "en");
    const gated = gatePremiumReportExportPayload(payload, PREVIEW_ENTITLEMENT);
    expect(gated.hiddenDrivers.length).toBe(0);
    expect(gated.suggestedActions.length).toBe(0);
    expect(gated.thresholds.length).toBeLessThanOrEqual(2);
  });
});
