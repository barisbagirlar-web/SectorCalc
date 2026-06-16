import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/i18n/premium-schema-display-i18n";
import { resolveGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { resolveGeneratedToolDisplayTitle } from "@/lib/i18n/generated-tool-display-i18n";

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
  const premiumPain = resolvePremiumSchemaPainStatement(slug, "", locale);
  if (premiumPain.trim()) {
    return premiumPain;
  }
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
  return "Sector-specific calculator — enter inputs to see results.";
}

export function resolvePrimaryOutputKey(schema: GeneratedToolSchema): string {
  const primary = schema.outputs.primary.trim();
  const match = primary.match(/^([A-Za-z0-9_]+)/);
  return match?.[1] ?? primary;
}
