import type { SupportedLocale } from "@/lib/i18n/locale-config";

export type GlossaryTerm =
  | "calculator"
  | "freeCalculator"
  | "premiumAnalyzer"
  | "decisionReport"
  | "hiddenLoss"
  | "threshold"
  | "export"
  | "estimate"
  | "risk"
  | "exposure"
  | "oee"
  | "scrap"
  | "routeCost"
  | "energyCost"
  | "carbonExposure"
  | "pricing"
  | "checkout"
  | "legalNote";

export type GlossaryEntry = Readonly<Record<SupportedLocale, string>> & {
  readonly note?: string;
};

export const LOCALE_GLOSSARY: Record<GlossaryTerm, GlossaryEntry> = {
  calculator: {
    en: "Calculator",
  },
  freeCalculator: {
    en: "Free calculator",
  },
  premiumAnalyzer: {
    en: "Premium analyzer",
  },
  decisionReport: {
    en: "Decision report",
  },
  hiddenLoss: {
    en: "Hidden loss",
  },
  threshold: {
    en: "Threshold",
  },
  export: {
    en: "Export",
  },
  estimate: {
    en: "Estimate",
  },
  risk: {
    en: "Risk",
  },
  exposure: {
    en: "Exposure",
  },
  oee: {
    en: "OEE",
    note: "Overall Equipment Effectiveness — universal acronym, explain in context",
  },
  scrap: {
    en: "Scrap",
  },
  routeCost: {
    en: "Route cost",
  },
  energyCost: {
    en: "Energy cost",
  },
  carbonExposure: {
    en: "Carbon exposure",
  },
  pricing: {
    en: "Pricing",
  },
  checkout: {
    en: "Checkout",
  },
  legalNote: {
    en: "Legal note",
  },
};

export function getGlossaryTerm(
  term: GlossaryTerm,
  locale: SupportedLocale,
): string {
  return LOCALE_GLOSSARY[term][locale];
}
