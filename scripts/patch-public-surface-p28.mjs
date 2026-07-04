#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const PREMIUM_SUBTITLE = {
  en: "Premium sector calculators for production, cost, energy, inventory, technical, and operational decisions that need more inputs, scenario comparison, and decision summaries.",
  tr: "Daha fazla input, scenario profitşılaştırması ve karar özeti gerektiren kritik üduction, cost, energy, inventory, technical ve operasyon hesapları için hazırlanmış premium sektör hesaplayıcıları.",
  de: "Premium-Branchenrechner für Produktion, Kosten, Energie, Bestand, Technik und operative Entscheidungen mit mehr Eingaben, Szenariovergleich und Entscheidungszusammenfassung.",
  fr: "Calculateurs sectoriels premium pour la production, les coûts, l'énergie, les stocks, la technique et les décisions opérationnelles nécessitant plus d'entrées, des scénarios et un résumé décisionnel.",
  es: "Calculadoras sectoriales premium para producción, costos, energía, inventario, técnica y decisiones operativas que requieren más entradas, escenarios y resumen de decisión.",
};

const PREMIUM_TABS = {
  en: {
    premiumToolsAll: "All premium calculators",
    "cost-margin": "Cost & margin",
    "operations-oee": "Operations & OEE",
    "energy-carbon": "Energy & carbon",
    "manufacturing-engineering": "Manufacturing & engineering",
    "finance-hr": "Finance & HR",
    "quality-lean": "Quality & lean",
    "engineering-technical": "Engineering & technical",
  },
  tr: {
    premiumToolsAll: "Tüm premium hesaplayıcılar",
    "cost-margin": "Cost ve margin",
    "operations-oee": "Operasyon ve OEE",
    "energy-carbon": "Energy ve karbon",
    "manufacturing-engineering": "İmalat ve mühendislik",
    "finance-hr": "Finance ve İK",
    "quality-lean": "Quality ve yalın",
    "engineering-technical": "Mühendislik ve technical",
  },
  de: {
    premiumToolsAll: "Alle Premium-Rechner",
    "cost-margin": "Kosten & Marge",
    "operations-oee": "Betrieb & OEE",
    "energy-carbon": "Energie & CO₂",
    "manufacturing-engineering": "Fertigung & Technik",
    "finance-hr": "Finanzen & HR",
    "quality-lean": "Qualität & Lean",
    "engineering-technical": "Technik & Engineering",
  },
  fr: {
    premiumToolsAll: "Tous les calculateurs premium",
    "cost-margin": "Coût et marge",
    "operations-oee": "Opérations et OEE",
    "energy-carbon": "Énergie et carbone",
    "manufacturing-engineering": "Fabrication et ingénierie",
    "finance-hr": "Finance et RH",
    "quality-lean": "Qualité et lean",
    "engineering-technical": "Ingénierie et technique",
  },
  es: {
    premiumToolsAll: "Todas las calculadoras premium",
    "cost-margin": "Costo y margen",
    "operations-oee": "Operaciones y OEE",
    "energy-carbon": "Energía y carbono",
    "manufacturing-engineering": "Manufactura e ingeniería",
    "finance-hr": "Finanzas y RR. HH.",
    "quality-lean": "Calidad y lean",
    "engineering-technical": "Ingeniería y técnica",
  },
  ar: {
  },
};

const FOOTER_META = {
  en: { metaReg: "REGION: GLOBAL", metaCur: "CURRENCY: USD", metaCopyright: "© 2026 SECTORCALC" },
  tr: { metaReg: "BÖLGE: GLOBAL", metaCur: "PARA: TRY", metaCopyright: "© 2026 SECTORCALC" },
  de: { metaReg: "REGION: GLOBAL", metaCur: "WÄHRUNG: EUR", metaCopyright: "© 2026 SECTORCALC" },
  fr: { metaReg: "RÉGION: GLOBAL", metaCur: "DEVISE: EUR", metaCopyright: "© 2026 SECTORCALC" },
  es: { metaReg: "REGIÓN: GLOBAL", metaCur: "MONEDA: USD", metaCopyright: "© 2026 SECTORCALC" },
};

const CTA_OPEN = {
  en: "Open calculator",
  tr: "Hesaplayıcıyı aç",
  de: "Rechner öffnen",
  fr: "Ouvrir le calculateur",
  es: "Abrir calculadora",
};

for (const locale of ["en", "tr", "de", "fr", "es", "ar"]) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages.catalogExplorer.premiumTools.subtitle = PREMIUM_SUBTITLE[locale];
  messages.catalogExplorer.discoveryTabs.premiumToolsAll = PREMIUM_TABS[locale].premiumToolsAll;
  messages.catalogExplorer.discoveryTabs["premium-tools"] = {
    "cost-margin": PREMIUM_TABS[locale]["cost-margin"],
    "operations-oee": PREMIUM_TABS[locale]["operations-oee"],
    "energy-carbon": PREMIUM_TABS[locale]["energy-carbon"],
    "manufacturing-engineering": PREMIUM_TABS[locale]["manufacturing-engineering"],
    "finance-hr": PREMIUM_TABS[locale]["finance-hr"],
    "quality-lean": PREMIUM_TABS[locale]["quality-lean"],
    "engineering-technical": PREMIUM_TABS[locale]["engineering-technical"],
  };
  messages.sectorFooter = { ...messages.sectorFooter, ...FOOTER_META[locale] };
  messages.calculatorCards.ctaOpen = CTA_OPEN[locale];
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`patched public surface P28: ${locale}`);
}
