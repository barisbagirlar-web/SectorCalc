type AppLocale = "en";
import type { IndustrySlug } from "@/lib/features/tools/industry-registry";

/**
 * Locale-aware overrides for industry hub content.
 *
 * The shared catalog registries (industry-registry, revenue-tools) store the
 * canonical English copy. This module layers natural, human-written localized
 * copy on top of it per locale + slug. When an override is missing the page
 * falls back to the English registry content, so adding a locale or industry
 * here is purely additive and never breaks existing routes.
 *
 * Only fields that should change per locale are optional overrides.
 */
export interface LocalizedIndustryHub {
  /** Hero eyebrow — replaces the English industry name when present. */
  eyebrow?: string;
  /** H1 — replaces "<name> Cost & Margin Tools". */
  hubTitle?: string;
  painStatement?: string;
  whoItsFor?: string;
  decisionHelp?: string;
  freeToolExplanation?: string;
  premiumToolExplanation?: string;
}

const INDUSTRY_HUB_I18N: Partial<
  Record<AppLocale, Partial<Record<IndustrySlug, LocalizedIndustryHub>>>
> = {};

export function getLocalizedIndustryHub(
  slug: IndustrySlug,
  locale: string,
): LocalizedIndustryHub | undefined {
  return INDUSTRY_HUB_I18N[locale as AppLocale]?.[slug];
}
