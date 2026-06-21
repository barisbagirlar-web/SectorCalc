import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/i18n/premium-schema-display-i18n";
import { resolveGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import {
  resolveGeneratedToolDisplayTitle,
  resolveGeneratedToolDisplayDescription,
} from "@/lib/i18n/generated-tool-display-i18n";

/**
 * Humanize a kebab-case slug into readable form, stripping "-calculator" suffix.
 */
function humanizeSlug(slug: string): string {
  return slug
    .replace(/-calculator$/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Quadruple-layer locale-aware tool title resolution.
 *
 * Layer 1 — Premium schema i18n override (industry analyzer titles).
 * Layer 2 — i18n titles bundle (generated-tool-titles-i18n.generated.json).
 * Layer 3 — schema.toolName humanized + glossary-translated for the locale.
 * Layer 4 — Raw slug humanized + glossary-translated (guaranteed never empty).
 */
export function resolveGeneratedToolTitle(
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
): string {
  // Layer 1: Premium schema i18n override
  const premiumName = resolvePremiumSchemaDisplayName(slug, schema.toolName, locale);
  if (premiumName !== schema.toolName) {
    return premiumName;
  }

  // Layer 2: Generated titles i18n bundle
  const localizedTitle = resolveGeneratedToolDisplayTitle(slug, schema.toolName, locale);
  if (localizedTitle.trim() && localizedTitle !== schema.toolName) {
    return localizedTitle;
  }

  // Layer 3: Use schema.toolName if it's already human-readable (not kebab-case or slug-only).
  // Otherwise, humanize the slug for a cleaner fallback.
  // This prevents loss of properly localized titles with special characters (e.g. "Makine Ekonomik Ömrü").
  const effectiveToolName =
    schema.toolName.includes("-") || schema.toolName === slug.replace(/-/g, " ")
      ? humanizeSlug(slug)
      : schema.toolName;

  if (locale !== "en") {
    const translated = translateCalculatorPhrase(effectiveToolName, locale);
    if (translated.trim() && translated !== effectiveToolName) {
      return translated;
    }
  }

  // Layer 4: Ultimate fallback — effective tool name
  return effectiveToolName;
}

export function resolveGeneratedToolDescription(
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
): string {
  // 1. Check the descriptions i18n bundle FIRST (primary source for all tools).
  //    Covers both slug and slug+"-calculator" key formats.
  const bundleDesc = resolveGeneratedToolDisplayDescription(
    slug,
    schema.toolName,
    locale,
  );
  if (bundleDesc && bundleDesc.trim()) {
    return bundleDesc.trim();
  }

  // 2. Schema-level about.description.long_i18n (used by ~0 schemas currently).
  const aboutLong = schema.about?.description.long.trim();
  if (aboutLong) {
    const localizedLong = schema.about?.description.long_i18n
      ? resolveGeneratedI18nText(schema.about.description.long_i18n, locale, aboutLong)
      : aboutLong;
    if (localizedLong.trim()) {
      return localizedLong.trim();
    }
  }

  // 3. Premium pain statement (premium-schema-i18n override)
  const premiumPain = resolvePremiumSchemaPainStatement(slug, "", locale);
  if (premiumPain.trim()) {
    return premiumPain;
  }

  // 4. Input business contexts (first two, localized)
  const contexts = schema.inputs
    .map((input) =>
      resolveGeneratedI18nText(
        input.businessContext_i18n,
        locale,
        input.businessContext,
      ).trim(),
    )
    .filter(Boolean)
    .slice(0, 2);
  if (contexts.length > 0) {
    return contexts.join(" ");
  }

  // 5. Ultimate fallback
  return translateCalculatorPhrase(
    "Sector-specific calculator — enter inputs to see results.",
    locale,
  );
}

export function resolvePrimaryOutputKey(schema: GeneratedToolSchema): string {
  const primary = schema.outputs.primary.trim();
  const match = primary.match(/^([A-Za-z0-9_]+)/);
  return match?.[1] ?? primary;
}
