#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const INDUSTRIES_COPY = {
  en: {
    relatedFreeTools: "Related free calculators",
    relatedPremiumTools: "Related premium calculators",
    openCalculator: "Open calculator",
    viewAllCalculators: "View all calculators",
    viewAllCalculatorsLead: "Browse the full calculator library for more sector tools.",
    noToolsTitle: "Calculators for this industry are being prepared",
    noToolsDescription: "You can explore similar calculators in the library while we expand this sector pack.",
  },
  tr: {
    relatedFreeTools: "İlgili ücretsiz hesaplayıcılar",
    relatedPremiumTools: "İlgili premium hesaplayıcılar",
    openCalculator: "Hesaplayıcıyı aç",
    viewAllCalculators: "Tüm hesaplayıcıları gör",
    viewAllCalculatorsLead: "Bu sektör için daha fazla araç için hesaplayıcı kütüphanesine göz atın.",
    noToolsTitle: "Bu sektör için hesaplayıcılar hazırlanıyor",
    noToolsDescription: "Benzer hesaplayıcıları kütüphane içinde inceleyebilirsiniz.",
  },
  de: {
    relatedFreeTools: "Verwandte kostenlose Rechner",
    relatedPremiumTools: "Verwandte Premium-Rechner",
    openCalculator: "Rechner öffnen",
    viewAllCalculators: "Alle Rechner anzeigen",
    viewAllCalculatorsLead: "Durchsuchen Sie die vollständige Rechnerbibliothek für weitere Branchentools.",
    noToolsTitle: "Rechner für diese Branche werden vorbereitet",
    noToolsDescription: "Ähnliche Rechner finden Sie inzwischen in der Bibliothek.",
  },
  fr: {
    relatedFreeTools: "Calculateurs gratuits associés",
    relatedPremiumTools: "Calculateurs premium associés",
    openCalculator: "Ouvrir le calculateur",
    viewAllCalculators: "Voir tous les calculateurs",
    viewAllCalculatorsLead: "Parcourez la bibliothèque complète pour plus d'outils sectoriels.",
    noToolsTitle: "Les calculateurs pour ce secteur sont en préparation",
    noToolsDescription: "Vous pouvez consulter des calculateurs similaires dans la bibliothèque.",
  },
  es: {
    relatedFreeTools: "Calculadoras gratuitas relacionadas",
    relatedPremiumTools: "Calculadoras premium relacionadas",
    openCalculator: "Abrir calculadora",
    viewAllCalculators: "Ver todas las calculadoras",
    viewAllCalculatorsLead: "Explore la biblioteca completa para más herramientas del sector.",
    noToolsTitle: "Las calculadoras para este sector se están preparando",
    noToolsDescription: "Puede revisar calculadoras similares en la biblioteca.",
  },
  ar: {
    relatedFreeTools: "حاسبات مجانية ذات صلة",
    relatedPremiumTools: "حاسبات مميزة ذات صلة",
    openCalculator: "افتح الحاسبة",
    viewAllCalculators: "عرض كل الحاسبات",
    viewAllCalculatorsLead: "تصفح مكتبة الحاسبات الكاملة لمزيد من أدوات القطاع.",
    noToolsTitle: "يتم تجهيز حاسبات هذا القطاع",
    noToolsDescription: "يمكنك استكشاف حاسبات مشابهة في المكتبة.",
  },
};

const INDUSTRY_PAGE_LINKS = {
  en: {
    calculatorLibraryLink: "Calculator library",
    freeToolsLink: "Free calculators",
    premiumToolsLink: "Premium calculators",
  },
  tr: {
    calculatorLibraryLink: "Hesaplayıcı kütüphanesi",
    freeToolsLink: "Ücretsiz hesaplayıcılar",
    premiumToolsLink: "Premium hesaplayıcılar",
  },
  de: {
    calculatorLibraryLink: "Rechnerbibliothek",
    freeToolsLink: "Kostenlose Rechner",
    premiumToolsLink: "Premium-Rechner",
  },
  fr: {
    calculatorLibraryLink: "Bibliothèque de calculateurs",
    freeToolsLink: "Calculateurs gratuits",
    premiumToolsLink: "Calculateurs premium",
  },
  es: {
    calculatorLibraryLink: "Biblioteca de calculadoras",
    freeToolsLink: "Calculadoras gratuitas",
    premiumToolsLink: "Calculadoras premium",
  },
  ar: {
    calculatorLibraryLink: "مكتبة الحاسبات",
    freeToolsLink: "حاسبات مجانية",
    premiumToolsLink: "حاسبات مميزة",
  },
};

for (const locale of ["en", "tr", "de", "fr", "es", "ar"]) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages.industries = { ...messages.industries, ...INDUSTRIES_COPY[locale] };
  messages.industryPage = { ...messages.industryPage, ...INDUSTRY_PAGE_LINKS[locale] };
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`patched industry pages P29: ${locale}`);
}
