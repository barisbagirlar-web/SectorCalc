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
  },
  ar: {
    metaDescription:
    llmsLabel: "llms.txt",
    indexLabel: "sectorcalc-index.txt",
    faqLabel: "faq-knowledge.txt",
    servicesLabel: "services-products.txt",
  },
};

for (const [locale, calculatorLibrary] of Object.entries(CALCULATOR_LIBRARY)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages.calculatorLibrary = calculatorLibrary;
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Patched calculatorLibrary → messages/${locale}.json`);
}
