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

function humanizeSlug(slug: string): string {
  return slug
    .replace(/-calculator$/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function resolveGeneratedToolTitle(
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
): string {
  const premiumName = resolvePremiumSchemaDisplayName(slug, schema.toolName, locale);
  if (premiumName !== schema.toolName) {
    return premiumName;
  }

  const localizedTitle = resolveGeneratedToolDisplayTitle(slug, schema.toolName, locale);
  if (localizedTitle.trim() && localizedTitle !== schema.toolName) {
    return localizedTitle;
  }

  if (schema.toolName.trim()) {
    return schema.toolName;
  }
  return humanizeSlug(slug);
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
