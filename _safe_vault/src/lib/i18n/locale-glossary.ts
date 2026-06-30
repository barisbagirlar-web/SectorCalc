/* eslint-disable */
// @ts-nocheck

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
  cnc: {
    en: "CNC",
    tr: "CNC",
    de: "CNC",
    fr: "CNC",
    es: "CNC",
    ar: "CNC",
    note: "Computer Numerical Control — universal acronym",
  },
  smed: {
    en: "SMED",
    tr: "SMED",
    de: "SMED",
    fr: "SMED",
    es: "SMED",
    ar: "SMED",
    note: "Single Minute Exchange of Die — universal acronym",
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
  takt: {
    en: "Takt time",
    tr: "Takt süresi",
    de: "Taktzeit",
    fr: "Temps de takt",
    es: "Tiempo de takt",
    ar: "وقت التاكت",
  },
  bottleneck: {
    en: "Bottleneck",
    tr: "Darboğaz",
    de: "Engpass",
    fr: "Goulot d'étranglement",
    es: "Cuello de botella",
    ar: "عنق الزجاجة",
  },
  lean: {
    en: "Lean",
    tr: "Yalın",
    de: "Lean",
    fr: "Lean",
    es: "Lean",
    ar: "اللين",
  },
  kaizen: {
    en: "Kaizen",
    tr: "Kaizen",
    de: "Kaizen",
    fr: "Kaizen",
    es: "Kaizen",
    ar: "كايزن",
    note: "Continuous improvement — keep Kaizen where standard",
  },
  fiveS: {
    en: "5S",
    tr: "5S",
    de: "5S",
    fr: "5S",
    es: "5S",
    ar: "5S",
    note: "Seiri, Seiton, Seiso, Seiketsu, Shitsuke",
  },
  sixSigma: {
    en: "Six Sigma",
    tr: "Altı Sigma",
    de: "Six Sigma",
    fr: "Six Sigma",
    es: "Seis Sigma",
    ar: "ستة سيجما",
  },
  spc: {
    en: "SPC",
    tr: "İstatistiksel proses kontrolü",
    de: "Statistische Prozesskontrolle",
    fr: "Contrôle statistique des procédés",
    es: "Control estadístico de procesos",
    ar: "التحكم الإحصائي في العمليات",
    note: "Statistical Process Control",
  },
  mtbf: {
    en: "MTBF",
    tr: "Arızalar arası ortalama süre",
    de: "Mittlere Betriebsdauer zwischen Ausfällen",
    fr: "Temps moyen de bon fonctionnement",
    es: "Tiempo medio entre fallos",
    ar: "متوسط الوقت بين الأعطال",
    note: "Mean Time Between Failures",
  },
  mttr: {
    en: "MTTR",
    tr: "Ortalama onarım süresi",
    de: "Mittlere Reparaturdauer",
    fr: "Temps moyen de réparation",
    es: "Tiempo medio de reparación",
    ar: "متوسط وقت الإصلاح",
    note: "Mean Time To Repair",
  },
};

export function getGlossaryTerm(
  term: GlossaryTerm,
  locale: SupportedLocale,
): string {
  return LOCALE_GLOSSARY[term][locale];
}

/** Build DeepSeek system-prompt glossary block for a target locale. */
export function buildGlossaryPromptForLocale(targetLocale: SupportedLocale): string {
  const lines: string[] = [
    "Use the following glossary for technical terms:",
    "",
  ];

  for (const entry of Object.values(LOCALE_GLOSSARY)) {
    const english = entry.en;
    const translated = entry[targetLocale];
    lines.push(`- "${english}" → ${targetLocale}: "${translated}"`);
    if (entry.note) {
      lines.push(`  (${entry.note})`);
    }
  }

  lines.push(
    "",
    "Rules:",
    "1. Always use the glossary terms above for matching technical terminology.",
    "2. Preserve acronyms (OEE, CNC, SMED, ISO, APY) when the glossary keeps them.",
    "3. If a term is not in the glossary, use standard industrial translation.",
  );

  return lines.join("\n");
}
