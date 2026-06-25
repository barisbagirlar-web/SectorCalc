import type { AppLocale } from "@/i18n/routing";

/**
 * Locale-aware overrides for revenue tool titles.
 *
 * The canonical revenue-tools registry stores English titles. This module
 * layers natural localized names on top, keyed by the tool's free or paid
 * slug. When an override is missing the registry's English title is returned,
 * so adding a locale is purely additive.
 */

type ToolKind = "free" | "paid";

const REVENUE_TOOL_TITLES: Partial<
  Record<AppLocale, { paid: Record<string, string>; free: Record<string, string> }>
> = {};

export function getLocalizedRevenueToolTitle(
  slug: string,
  kind: ToolKind,
  locale: string,
  fallback: string,
): string {
  const map = REVENUE_TOOL_TITLES[locale as AppLocale];
  if (!map) return fallback;
  return map[kind][slug] ?? fallback;
}
