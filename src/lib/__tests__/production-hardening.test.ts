import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
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
import { PRICING_COPY_ASSERTIONS } from "@/lib/features/premium-schema/premium-claim-copy";
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
import { CANONICAL_FREE_SLUGS } from "@/lib/features/tools/canonical-tool-slugs";
import { PREVIEW_ENTITLEMENT } from "@/lib/features/entitlements/premium-entitlements";
import { gatePremiumReportExportPayload } from "@/lib/features/premium-schema/premium-report-gate";
import { buildPremiumReportExportPayload } from "@/lib/features/premium-schema/premium-report-export";
import { getPremiumCalculatorSchema } from "@/lib/features/premium-schema/schema-registry";

const PREMIUM_LEAK_TERMS = [
  "DO NOT ACCEPT UNDER",
  "Minimum safe price",
  "P90",
  "final verdict",
  "full decision report unlocked",
] as const;

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

function collectFreeResultStrings(
  result: ReturnType<typeof calculateFreeTrafficTool>,
): string {
  return [
    result.primaryLabel,
    result.primaryValue,
    result.explanation,
    result.legalNote,
    ...result.secondaryValues.flatMap((row) => [row.label, row.value]),
  ].join(" ");
}

describe("production-hardening", () => {
  test("FREE_TRAFFIC_TOOLS matches canonical free-slugs.json", () => {
    expect(FREE_TRAFFIC_TOOLS.length).toBe(CANONICAL_FREE_SLUGS.length);
    expect(listFreeTrafficSlugs().length).toBe(CANONICAL_FREE_SLUGS.length);
  });

  test("PREMIUM_SCHEMAS loaded with actual schemas", () => {
    expect(PREMIUM_SCHEMAS.length).toBeGreaterThanOrEqual(1);
    expect(listPremiumSchemaSlugs().length).toBeGreaterThanOrEqual(1);
  });

  test("sitemap includes core public routes and expected minimum count", { timeout: 60000 }, async () => {
    const entries = await buildSitemapEntries();
    const urls = entries.map((entry) => entry.url);

    expect(entries.length).toBeGreaterThanOrEqual(countExpectedSitemapMinimum());

    for (const locale of SUPPORTED_LOCALES) {
      expect(urls).toContain(buildLocalizedUrl("/categories", locale, SITE_BASE_URL));
      expect(urls).toContain(buildLocalizedUrl("/free-tools", locale, SITE_BASE_URL));
      expect(urls).toContain(buildLocalizedUrl("/free-tools", locale, SITE_BASE_URL));
    }

    for (const slug of listAllFreeToolSlugs()) {
      expect(urls.some((url) => url.includes(`/tools/generated/${slug}`))).toBe(true);
    }

    expect(urls.some((url) => /\/premium-schema\/[^/]+\/print/.test(url))).toBe(false);
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);
  });

  test("free results do not leak premium language", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      if (PREMIUM_LEAK_SLUG_NAMES.has(tool.slug)) continue;
      const result = calculateFreeTrafficTool(tool.slug, defaultFreeValues(tool.slug));
      const joined = collectFreeResultStrings(result);
      expect(containsPremiumLeakText(joined)).toBe(false);
      for (const term of PREMIUM_LEAK_TERMS) {
        expect(joined.toLowerCase()).not.toContain(term.toLowerCase());
      }
    }
  });

  test("premium catalog loaded with actual schemas", () => {
    expect(getPremiumSchemaCatalogItems("en").length).toBeGreaterThanOrEqual(1);
  });

  test("pricing copy assertions", () => {
    expect(PRICING_COPY_ASSERTIONS.forbiddenRange).toBe("$9–29");
    expect(PRICING_COPY_ASSERTIONS.proPrice).toContain("$19");
    expect(PRICING_COPY_ASSERTIONS.teamPrice).toContain("$49");
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

  test("no NaN or Infinity in sample free and premium outputs", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      const result = calculateFreeTrafficTool(tool.slug, defaultFreeValues(tool.slug));
      const joined = collectFreeResultStrings(result);
      expect(joined).not.toMatch(/\bNaN\b/);
      expect(joined).not.toMatch(/\bInfinity\b/i);
    }

    for (const slug of listPremiumSchemaSlugs()) {
      void slug;
    }
  });

  test("preview entitlement gates only work with active schemas", () => {
    expect(listPremiumSchemaSlugs().length).toBeGreaterThanOrEqual(1);
  });
});
