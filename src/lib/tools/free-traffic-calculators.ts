/**
 * Free traffic calculator engine — browser-side math for all catalog slugs.
 * No premium verdict leakage; every slug computes real formulas.
 */

import {
  formatLocalizedCurrency,
  formatLocalizedNumber,
  getFreeToolLegalNote,
  normalizeLocale,
  NOT_AVAILABLE,
  type SupportedLocale,
} from "@/lib/format/localization";
import { localizeTrafficResultPartial } from "@/lib/i18n/free-tool-result-i18n";
import {
  getFreeTrafficToolBySlug,
} from "@/lib/tools/free-traffic-catalog";
import { ALL_CALCULATORS } from "./free-traffic-calculators-registry";

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

let _activeFormatLocale: SupportedLocale = "en";

export function normalizeNumber(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number(String(value).replace(/,/g, '.').trim());
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

export function safeDivide(a: number, b: number): number {
  if (b === 0 || !Number.isFinite(a) || !Number.isFinite(b)) {
    return 0;
  }
  const resultValue = a / b;
  return Number.isFinite(resultValue) ? resultValue : 0;
}

export function round(value: number, digits = 2): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function formatNumber(n: number, digits = 2): string {
  return formatLocalizedNumber(n, _activeFormatLocale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

export function formatCurrency(n: number, digits = 2): string {
  return formatLocalizedCurrency(n, _activeFormatLocale, "USD", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? 0 : undefined,
  });
}

export function assertFiniteNumber(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback;
}

const PREMIUM_LEAK_PATTERNS = [
  /do not accept under/i,
  /minimum safe price/i,
  /\bp90\b/i,
  /final verdict/i,
  /\bpdf\b/i,
  /saved report/i,
] as const;

export function containsPremiumLeakText(text: string): boolean {
  return PREMIUM_LEAK_PATTERNS.some((pattern) => pattern.test(text));
}

const CALCULATORS: Record<string, (values: FreeTrafficInputValues) => Omit<FreeTrafficResult, "legalNote">> = ALL_CALCULATORS;

function meta(slug: string, res: Omit<FreeTrafficResult, "legalNote">): FreeTrafficResult {
  const catalog = getFreeTrafficToolBySlug(slug);
  const localized = localizeTrafficResultPartial({
    headline: res.headline,
    primaryLabel: res.primaryLabel,
    explanation: res.explanation,
    secondaryValues: res.secondaryValues,
  }, _activeFormatLocale);
  
  const textCheck = [
    localized.headline,
    localized.primaryLabel,
    localized.explanation,
    res.primaryValue,
    ...res.secondaryValues.map((v) => `${v.label} ${v.value}`),
  ].join(" ");

  if (containsPremiumLeakText(textCheck)) {
    throw new Error(`Verdict leak detected in production calculator response for slug "${slug}"`);
  }

  return {
    ...res,
    headline: localized.headline,
    primaryLabel: localized.primaryLabel,
    explanation: localized.explanation,
    relatedPremiumSlug: catalog?.relatedPremiumSlug,
    legalNote: getFreeToolLegalNote(_activeFormatLocale),
  };
}

export function calculateFreeTrafficTool(
  slug: string,
  values: FreeTrafficInputValues,
  locale: SupportedLocale | string = "en",
): FreeTrafficResult {
  const previousLocale = _activeFormatLocale;
  _activeFormatLocale = normalizeLocale(locale);
  try {
    const calculator = CALCULATORS[slug];
    if (!calculator) {
      throw new Error(`Unknown free traffic calculator slug: ${slug}`);
    }
    return meta(slug, calculator(values));
  } finally {
    _activeFormatLocale = previousLocale;
  }
}

export { NOT_AVAILABLE as FREE_RESULT_NOT_AVAILABLE };

export function hasDedicatedTrafficCalculator(slug: string): boolean {
  return slug in CALCULATORS;
}
