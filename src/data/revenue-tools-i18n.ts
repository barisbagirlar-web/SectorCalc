/* eslint-disable */
// @ts-nocheck


/**
 * Tool titles are now English-only per platform policy.
 * All non-English locale overrides have been removed.
 */

const REVENUE_TOOL_TITLES: Partial<
  Record<AppLocale, { paid: Record<string, string>; free: Record<string, string> }>
> = {};

const REVENUE_TOOL_DESCRIPTIONS: Partial<
  Record<AppLocale, { paid: Record<string, string>; free: Record<string, string> }>
> = {};

export function getLocalizedRevenueToolTitle(
  _slug: string,
  _kind: "free" | "paid",
  _locale: string,
  fallback: string,
): string {
  return fallback;
}

export function getLocalizedRevenueToolDescription(
  _slug: string,
  _kind: "free" | "paid",
  _locale: string,
  fallback: string,
): string {
  return fallback;
}
