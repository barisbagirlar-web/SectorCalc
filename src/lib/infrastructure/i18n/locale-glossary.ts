/* eslint-disable */
// @ts-nocheck

import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

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
  | "cnc"
  | "smed"
  | "scrap"
  | "routeCost"
  | "energyCost"
  | "carbonExposure"
  | "pricing"
  | "checkout"
  | "legalNote"
  | "takt"
  | "bottleneck"
  | "lean"
  | "kaizen"
  | "fiveS"
  | "sixSigma"
  | "spc"
  | "mtbf"
  | "mttr";

export type GlossaryEntry = Partial<Readonly<Record<SupportedLocale, string>>> & { readonly en: string; } & {
  readonly note?: string;
};

export const LOCALE_GLOSSARY: Record<GlossaryTerm, GlossaryEntry> = {
  calculator: { en: "Calculator" },
  freeCalculator: { en: "Free calculator" },
  premiumAnalyzer: { en: "Premium analyzer" },
  decisionReport: { en: "Decision report" },
  hiddenLoss: { en: "Hidden loss" },
  threshold: { en: "Threshold" },
  export: { en: "Export" },
  estimate: { en: "Estimate" },
  risk: { en: "Risk" },
  exposure: { en: "Exposure" },
  oee: { en: "OEE", note: "Overall Equipment Effectiveness" },
  cnc: { en: "CNC", note: "Computer Numerical Control" },
  smed: { en: "SMED", note: "Single Minute Exchange of Die" },
  scrap: { en: "Scrap" },
  routeCost: { en: "Route cost" },
  energyCost: { en: "Energy cost" },
  carbonExposure: { en: "Carbon exposure" },
  pricing: { en: "Pricing" },
  checkout: { en: "Checkout" },
  legalNote: { en: "Legal note" },
  takt: { en: "Takt time" },
  bottleneck: { en: "Bottleneck" },
  lean: { en: "Lean" },
  kaizen: { en: "Kaizen", note: "Continuous improvement" },
  fiveS: { en: "5S", note: "Seiri, Seiton, Seiso, Seiketsu, Shitsuke" },
  sixSigma: { en: "Six Sigma" },
  spc: { en: "SPC", note: "Statistical Process Control" },
  mtbf: { en: "MTBF", note: "Mean Time Between Failures" },
  mttr: { en: "MTTR", note: "Mean Time To Repair" },
};

export function getGlossaryTerm(term: GlossaryTerm, locale: SupportedLocale): string {
  return LOCALE_GLOSSARY[term][locale] || LOCALE_GLOSSARY[term].en;
}

export function buildGlossaryPromptForLocale(targetLocale: SupportedLocale): string {
  const lines: string[] = ["Use the following glossary for technical terms:", ""];
  for (const entry of Object.values(LOCALE_GLOSSARY)) {
    const english = entry.en;
    const translated = entry[targetLocale] || entry.en;
    lines.push(`- "${english}" -> "${translated}"`);
    if (entry.note) lines.push(`  (${entry.note})`);
  }
  return lines.join("\n");
}
