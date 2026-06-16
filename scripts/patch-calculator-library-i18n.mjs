#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const CALCULATOR_LIBRARY = {
  en: {
    metaTitle: "Calculator Library — SectorCalc",
    metaDescription:
      "Public calculator catalog resources for SectorCalc: LLMs index, sector tool listings, and catalog entry points.",
    title: "Calculator Library",
    lead: "Machine-readable indexes and catalog entry points for SectorCalc sector calculators.",
    resourcesTitle: "Public resources",
    catalogsTitle: "Catalogs",
    llmsLabel: "llms.txt",
    indexLabel: "sectorcalc-index.txt",
    faqLabel: "faq-knowledge.txt",
    servicesLabel: "services-products.txt",
    freeToolsLabel: "Free calculators",
    premiumToolsLabel: "Premium calculators",
    industriesLabel: "Industry hubs",
    generatedToolsLabel: "Generated calculators",
  },
  tr: {
    metaTitle: "Hesap Makinesi Kütüphanesi — SectorCalc",
    metaDescription:
      "SectorCalc genel hesap makinesi katalog kaynakları: LLMs dizini, sektör araç listeleri ve katalog girişleri.",
    title: "Hesap Makinesi Kütüphanesi",
    lead: "SectorCalc sektörel hesap makineleri için makine okunur dizinler ve katalog giriş noktaları.",
    resourcesTitle: "Genel kaynaklar",
    catalogsTitle: "Kataloglar",
    llmsLabel: "llms.txt",
    indexLabel: "sectorcalc-index.txt",
    faqLabel: "faq-knowledge.txt",
    servicesLabel: "services-products.txt",
    freeToolsLabel: "Ücretsiz hesap makineleri",
    premiumToolsLabel: "Premium hesap makineleri",
    industriesLabel: "Sektör merkezleri",
    generatedToolsLabel: "Üretilmiş hesaplayıcılar",
  },
  de: {
    metaTitle: "Rechner-Bibliothek — SectorCalc",
    metaDescription:
      "Öffentliche Rechner-Katalogressourcen für SectorCalc: LLMs-Index, Branchenwerkzeuglisten und Katalogeinstiege.",
    title: "Rechner-Bibliothek",
    lead: "Maschinenlesbare Indizes und Katalogeinstiege für SectorCalc-Branchenrechner.",
    resourcesTitle: "Öffentliche Ressourcen",
    catalogsTitle: "Kataloge",
    llmsLabel: "llms.txt",
    indexLabel: "sectorcalc-index.txt",
    faqLabel: "faq-knowledge.txt",
    servicesLabel: "services-products.txt",
    freeToolsLabel: "Kostenlose Rechner",
    premiumToolsLabel: "Premium-Rechner",
    industriesLabel: "Branchen-Hubs",
    generatedToolsLabel: "Generierte Rechner",
  },
  fr: {
    metaTitle: "Bibliothèque de calculateurs — SectorCalc",
    metaDescription:
      "Ressources publiques du catalogue SectorCalc : index LLMs, listes d'outils sectoriels et entrées catalogue.",
    title: "Bibliothèque de calculateurs",
    lead: "Index lisibles par machine et entrées catalogue pour les calculateurs sectoriels SectorCalc.",
    resourcesTitle: "Ressources publiques",
    catalogsTitle: "Catalogues",
    llmsLabel: "llms.txt",
    indexLabel: "sectorcalc-index.txt",
    faqLabel: "faq-knowledge.txt",
    servicesLabel: "services-products.txt",
    freeToolsLabel: "Calculateurs gratuits",
    premiumToolsLabel: "Calculateurs premium",
    industriesLabel: "Hubs sectoriels",
    generatedToolsLabel: "Calculateurs générés",
  },
  es: {
    metaTitle: "Biblioteca de calculadoras — SectorCalc",
    metaDescription:
      "Recursos públicos del catálogo SectorCalc: índice LLMs, listas de herramientas sectoriales y entradas de catálogo.",
    title: "Biblioteca de calculadoras",
    lead: "Índices legibles por máquina y entradas de catálogo para calculadoras sectoriales de SectorCalc.",
    resourcesTitle: "Recursos públicos",
    catalogsTitle: "Catálogos",
    llmsLabel: "llms.txt",
    indexLabel: "sectorcalc-index.txt",
    faqLabel: "faq-knowledge.txt",
    servicesLabel: "services-products.txt",
    freeToolsLabel: "Calculadoras gratuitas",
    premiumToolsLabel: "Calculadoras premium",
    industriesLabel: "Centros sectoriales",
    generatedToolsLabel: "Calculadoras generadas",
  },
  ar: {
    metaTitle: "مكتبة الحاسبات — SectorCalc",
    metaDescription:
      "موارد كتالوج الحاسبات العامة لـ SectorCalc: فهرس LLMs وقوائم الأدوات القطاعية ومداخل الكتالوج.",
    title: "مكتبة الحاسبات",
    lead: "فهارس قابلة للقراءة آلياً ومداخل كتالوج لحاسبات SectorCalc القطاعية.",
    resourcesTitle: "موارد عامة",
    catalogsTitle: "الكتالوجات",
    llmsLabel: "llms.txt",
    indexLabel: "sectorcalc-index.txt",
    faqLabel: "faq-knowledge.txt",
    servicesLabel: "services-products.txt",
    freeToolsLabel: "حاسبات مجانية",
    premiumToolsLabel: "حاسبات مميزة",
    industriesLabel: "مراكز القطاعات",
    generatedToolsLabel: "حاسبات مُولَّدة",
  },
};

for (const [locale, calculatorLibrary] of Object.entries(CALCULATOR_LIBRARY)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages.calculatorLibrary = {
    ...(messages.calculatorLibrary ?? {}),
    ...calculatorLibrary,
  };
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Patched calculatorLibrary → messages/${locale}.json`);
}
