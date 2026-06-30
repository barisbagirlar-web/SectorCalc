/**
 * Regeneration baseline — slug list only (free-slugs.json).
 */

import freeSlugs from "../../../../free-slugs.json";
import {
  formatLocalizedNumber,
  getFreeToolLegalNote,
  normalizeLocale,
  NOT_AVAILABLE,
  type SupportedLocale,
} from "@/lib/core/format/localization";

export type FreeTrafficInputValues = Record<string, number | string>;

export type FreeTrafficResult = {
  readonly headline: string;
  readonly primaryLabel: string;
  readonly primaryValue: string;
  readonly secondaryValues: readonly { readonly label: string; readonly value: string }[];
  readonly explanation: string;
  readonly missingFactors: readonly string[];
  readonly relatedPremiumSlug?: string;
  readonly legalNote: string;
};

export type FreeTrafficCalculatorEntry = {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
};

export const FREE_TRAFFIC_CALCULATORS: readonly FreeTrafficCalculatorEntry[] = (
  freeSlugs as readonly string[]
).map((slug) => ({
  slug,
  name: slug.replace(/-/g, " "),
  description: "",
}));

export const FREE_TRAFFIC_CALCULATOR_SLUGS = freeSlugs as readonly string[];

let _activeFormatLocale: SupportedLocale = "en";

export function normalizeNumber(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function hasDedicatedTrafficCalculator(slug: string): boolean {
  return FREE_TRAFFIC_CALCULATOR_SLUGS.includes(slug);
}

export function containsPremiumLeakText(text: string): boolean {
  return /safe price|minimum price|accept\/reject|verdict leak|do not accept/i.test(text);
}

export function calculateFreeTrafficTool(
  slug: string,
  values: FreeTrafficInputValues,
  locale: SupportedLocale | string = "en",
): FreeTrafficResult {
  _activeFormatLocale = normalizeLocale(locale);
  const legalNote = getFreeToolLegalNote(_activeFormatLocale);
  const entry = FREE_TRAFFIC_CALCULATORS.find((t) => t.slug === slug);

  if (!entry) {
    return {
      headline: NOT_AVAILABLE,
      primaryLabel: "Status",
      primaryValue: NOT_AVAILABLE,
      secondaryValues: [],
      explanation: "Tool pending regeneration.",
      missingFactors: [],
      legalNote,
    };
  }

  const inputCount = Object.keys(values).filter((k) => values[k] !== "" && values[k] != null).length;

  return {
    headline: entry.name,
    primaryLabel: "Preview",
    primaryValue: inputCount > 0 ? formatLocalizedNumber(0, _activeFormatLocale) : NOT_AVAILABLE,
    secondaryValues: [],
    explanation: "Calculator regeneration in progress.",
    missingFactors: ["Full formula engine pending regeneration"],
    legalNote,
  };
}

export function listFreeTrafficCalculatorSlugs(): readonly string[] {
  return FREE_TRAFFIC_CALCULATOR_SLUGS;
}
