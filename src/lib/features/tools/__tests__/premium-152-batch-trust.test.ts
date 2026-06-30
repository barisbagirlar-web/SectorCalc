import { describe, expect, test } from "vitest";
import { getLocalizedPremiumSchema } from "@/data/premium-schema-i18n";
import { buildPremiumCatalogTools } from "@/lib/catalog/premium-catalog-source";
import { getPremiumCalculatorSchema } from "@/lib/features/premium-schema/schema-registry";
import { runPremiumSchemaEngine } from "@/lib/features/premium-schema/premium-schema-engine";
import { resolvePremiumSchemaDisplayName } from "@/lib/infrastructure/i18n/premium-schema-display-i18n";
import {
  evaluateRuntimeTrust,
} from "@/lib/features/tools/runtime-trust-engine";
import { checkToolBacking } from "@/lib/features/tools/tool-backing-detector";

const PREMIUM_152_BATCH1_SLUGS = [
  "7-israf-muda-avcisi-parasal-karsilik-calculator",
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator",
] as const;

const SUPPORTED_LOCALES = ["en", "tr", "de", "fr", "es", "ar"] as const;

function buildSmartDefaultInputs(slug: string): Record<string, number | string | boolean> {
  const schema = getPremiumCalculatorSchema(slug);
  if (!schema) {
    throw new Error(`Missing schema: ${slug}`);
  }
  const values: Record<string, number | string | boolean> = {};
  for (const input of schema.inputs) {
    if (input.smartDefault !== undefined) {
      values[input.id] = input.smartDefault;
    } else if (input.type === "number") {
      values[input.id] = input.validation?.min ?? 1;
    } else if (input.type === "select" && input.options?.[0]) {
      values[input.id] = input.options[0].value;
    }
  }
  return values;
}

describe("Premium 152 batch 1 — trust and i18n", () => {
  test.each(PREMIUM_152_BATCH1_SLUGS)("backing complete for %s", (slug: string) => {
    const backing = checkToolBacking(slug);
    expect(backing.isComplete).toBe(true);
  });

  test.each(PREMIUM_152_BATCH1_SLUGS)("runtime trust ready for %s", (slug: string) => {
    const trust = evaluateRuntimeTrust({ slug, locale: "en", surface: "premium" });
    expect(trust.status).toBe("ready");
    expect(trust.calculationEligible).toBe(true);
  });

  test.each(PREMIUM_152_BATCH1_SLUGS)("engine produces numeric outputs for %s", (slug: string) => {
    const schema = getPremiumCalculatorSchema(slug);
    expect(schema).toBeDefined();
    const result = runPremiumSchemaEngine(schema!, buildSmartDefaultInputs(slug), "en");
    expect(result.outputs.length).toBeGreaterThan(0);
    expect(result.outputs.some((output) => Number.isFinite(output.raw))).toBe(true);
  });

  test.each(
    PREMIUM_152_BATCH1_SLUGS.flatMap((slug) =>
      SUPPORTED_LOCALES.map((locale) => [slug, locale] as const),
    ),
  )("localized display name for %s (%s)", (slug: string, locale: string) => {
    const schema = getPremiumCalculatorSchema(slug)!;
    const localized = getLocalizedPremiumSchema(slug, locale);
    const displayName = resolvePremiumSchemaDisplayName(slug, schema.name, locale);
    if (locale === "en") {
      expect(displayName.length).toBeGreaterThan(5);
      return;
    }
    expect(localized?.title?.length ?? 0).toBeGreaterThan(5);
    expect(displayName).toBe(localized?.title);
    expect(localized?.painStatement?.length ?? 0).toBeGreaterThan(10);
  });

  test.each(
    PREMIUM_152_BATCH1_SLUGS.flatMap((slug) =>
      SUPPORTED_LOCALES.map((locale) => [slug, locale] as const),
    ),
  )("catalog title for %s (%s)", (slug: string, locale: string) => {
    const tool = buildPremiumCatalogTools(locale).find((entry) => entry.slug === slug);
    expect(tool).toBeDefined();
    expect(tool?.title.length ?? 0).toBeGreaterThan(5);
    expect(tool?.description.length ?? 0).toBeGreaterThan(10);
    expect(tool?.isActive).toBe(true);
    expect(tool?.routePath).toContain(slug);
  });
});
