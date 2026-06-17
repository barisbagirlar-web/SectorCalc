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

export type GlossaryEntry = Readonly<Record<SupportedLocale, string>> & {
  readonly note?: string;
};

export const LOCALE_GLOSSARY: Record<GlossaryTerm, GlossaryEntry> = {
  calculator: {
    en: "Calculator",
    tr: "Hesaplama aracı",
    de: "Rechner",
    fr: "Calculateur",
    es: "Calculadora",
    ar: "حاسبة",
  },
  freeCalculator: {
    en: "Free calculator",
    tr: "Ücretsiz hesaplama aracı",
    de: "Gratis-Rechner",
    fr: "Calculateur gratuit",
    es: "Calculadora gratuita",
    ar: "حاسبة مجانية",
  },
  premiumAnalyzer: {
    en: "Premium analyzer",
    tr: "Premium analiz aracı",
    de: "Premium-Analyse",
    fr: "Analyse premium",
    es: "Análisis premium",
    ar: "أداة تحليل متقدمة",
  },
  decisionReport: {
    en: "Decision report",
    tr: "Karar raporu",
    de: "Entscheidungsbericht",
    fr: "Rapport de décision",
    es: "Informe de decisión",
    ar: "تقرير القرار",
  },
  hiddenLoss: {
    en: "Hidden loss",
    tr: "Görünmeyen kayıp",
    de: "Verborgener Verlust",
    fr: "Perte cachée",
    es: "Pérdida oculta",
    ar: "الخسائر غير المرئية",
  },
  threshold: {
    en: "Threshold",
    tr: "Eşik",
    de: "Schwellenwert",
    fr: "Seuil",
    es: "Umbral",
    ar: "حد التنبيه",
  },
  export: {
    en: "Export",
    tr: "Dışa aktar",
    de: "Export",
    fr: "Export",
    es: "Exportar",
    ar: "تصدير",
  },
  estimate: {
    en: "Estimate",
    tr: "Tahmin",
    de: "Schätzung",
    fr: "Estimation",
    es: "Estimación",
    ar: "تقدير",
  },
  risk: {
    en: "Risk",
    tr: "Risk",
    de: "Risiko",
    fr: "Risque",
    es: "Riesgo",
    ar: "مخاطر",
  },
  exposure: {
    en: "Exposure",
    tr: "Maruziyet",
    de: "Exposition",
    fr: "Exposition",
    es: "Exposición",
    ar: "التعرض",
  },
  oee: {
    en: "OEE",
    tr: "OEE",
    de: "OEE",
    fr: "OEE",
    es: "OEE",
    ar: "OEE",
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
    tr: "Fire",
    de: "Ausschuss",
    fr: "Rebut",
    es: "Desperdicio",
    ar: "الهدر",
  },
  routeCost: {
    en: "Route cost",
    tr: "Rota maliyeti",
    de: "Routenkosten",
    fr: "Coût de route",
    es: "Coste de ruta",
    ar: "تكلفة المسار",
  },
  energyCost: {
    en: "Energy cost",
    tr: "Enerji maliyeti",
    de: "Energiekosten",
    fr: "Coût énergétique",
    es: "Coste energético",
    ar: "تكلفة الطاقة",
  },
  carbonExposure: {
    en: "Carbon exposure",
    tr: "Karbon maruziyeti",
    de: "CO₂-Exposition",
    fr: "Exposition carbone",
    es: "Exposición de carbono",
    ar: "التعرض للكربون",
  },
  pricing: {
    en: "Pricing",
    tr: "Fiyatlandırma",
    de: "Preise",
    fr: "Tarifs",
    es: "Precios",
    ar: "الأسعار",
  },
  checkout: {
    en: "Checkout",
    tr: "Ödeme",
    de: "Kasse",
    fr: "Paiement",
    es: "Pago",
    ar: "الدفع",
  },
  legalNote: {
    en: "Legal note",
    tr: "Yasal not",
    de: "Rechtlicher Hinweis",
    fr: "Note légale",
    es: "Nota legal",
    ar: "إشعار قانوني",
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
