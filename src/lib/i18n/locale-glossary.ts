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
};

export function getGlossaryTerm(
  term: GlossaryTerm,
  locale: SupportedLocale,
): string {
  return LOCALE_GLOSSARY[term][locale];
}
