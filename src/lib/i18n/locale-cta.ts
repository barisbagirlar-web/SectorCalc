import type { SupportedLocale } from "@/lib/i18n/locale-config";

export const CTA_KEYS = [
  "startFree",
  "calculateNow",
  "viewFreeTools",
  "openPremiumAnalyzer",
  "unlockFullReport",
  "viewPricing",
  "downloadCsv",
  "printReport",
  "copySummary",
  "switchLanguage",
  "chooseSector",
  "seeWhatThisEstimateMisses",
] as const;

export type CtaKey = (typeof CTA_KEYS)[number];

export type LocaleCtaMap = Record<CtaKey, string>;

/** Maximum button label length per locale (public UI). */
export const CTA_MAX_LENGTH: Record<SupportedLocale, number> = {
  en: 28,
  tr: 32,
  de: 34,
  fr: 34,
  es: 34,
  ar: 28,
};

export const LOCALE_CTA: Record<SupportedLocale, LocaleCtaMap> = {
  en: {
    startFree: "Start free",
    calculateNow: "Calculate now",
    viewFreeTools: "View free calculators",
    openPremiumAnalyzer: "Open calculator",
    unlockFullReport: "Unlock full report",
    viewPricing: "View pricing",
    downloadCsv: "Download CSV",
    printReport: "Print report",
    copySummary: "Copy summary",
    switchLanguage: "Language",
    chooseSector: "Choose sector",
    seeWhatThisEstimateMisses: "See what's missing",
  },
  tr: {
    startFree: "Ücretsiz başla",
    calculateNow: "Hesapla",
    viewFreeTools: "Ücretsiz hesaplayıcılar",
    openPremiumAnalyzer: "Hesaplama aracını aç",
    unlockFullReport: "Raporu aç",
    viewPricing: "Fiyatlandırma",
    downloadCsv: "CSV indir",
    printReport: "Yazdır / PDF",
    copySummary: "Özeti kopyala",
    switchLanguage: "Dil",
    chooseSector: "Sektör seç",
    seeWhatThisEstimateMisses: "Eksikleri gör",
  },
  de: {
    startFree: "Gratis starten",
    calculateNow: "Berechnen",
    viewFreeTools: "Gratis-Tools",
    openPremiumAnalyzer: "Rechner öffnen",
    unlockFullReport: "Bericht öffnen",
    viewPricing: "Preise ansehen",
    downloadCsv: "CSV laden",
    printReport: "Drucken / PDF",
    copySummary: "Zusammenfassung",
    switchLanguage: "Sprache",
    chooseSector: "Branche wählen",
    seeWhatThisEstimateMisses: "Was fehlt?",
  },
  fr: {
    startFree: "Commencer",
    calculateNow: "Calculer",
    viewFreeTools: "Outils gratuits",
    openPremiumAnalyzer: "Ouvrir le calcul",
    unlockFullReport: "Ouvrir le rapport",
    viewPricing: "Voir les tarifs",
    downloadCsv: "Télécharger CSV",
    printReport: "Imprimer / PDF",
    copySummary: "Copier le résumé",
    switchLanguage: "Langue",
    chooseSector: "Choisir secteur",
    seeWhatThisEstimateMisses: "Ce qui manque",
  },
  es: {
    startFree: "Empezar gratis",
    calculateNow: "Calcular",
    viewFreeTools: "Herramientas gratis",
    openPremiumAnalyzer: "Abrir cálculo",
    unlockFullReport: "Abrir informe",
    viewPricing: "Ver precios",
    downloadCsv: "Descargar CSV",
    printReport: "Imprimir / PDF",
    copySummary: "Copiar resumen",
    switchLanguage: "Idioma",
    chooseSector: "Elegir sector",
    seeWhatThisEstimateMisses: "Qué falta",
  },
  ar: {
    startFree: "ابدأ مجانًا",
    calculateNow: "احسب",
    viewFreeTools: "أدوات مجانية",
    openPremiumAnalyzer: "فتح الحساب",
    unlockFullReport: "فتح التقرير",
    viewPricing: "الأسعار",
    downloadCsv: "تنزيل CSV",
    printReport: "طباعة / PDF",
    copySummary: "نسخ الملخص",
    switchLanguage: "اللغة",
    chooseSector: "اختر القطاع",
    seeWhatThisEstimateMisses: "ما ينقص",
  },
};

export function getCtaLabel(locale: SupportedLocale, key: CtaKey): string {
  return LOCALE_CTA[locale][key];
}

export function getCtaLengthViolations(
  locale: SupportedLocale,
): readonly { key: CtaKey; length: number; max: number }[] {
  const max = CTA_MAX_LENGTH[locale];
  return CTA_KEYS.filter((key) => LOCALE_CTA[locale][key].length > max).map(
    (key) => ({
      key,
      length: LOCALE_CTA[locale][key].length,
      max,
    }),
  );
}
