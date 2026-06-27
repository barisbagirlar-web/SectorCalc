#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const COPY = {
  en: {
    badgeSector: "Sector",
    ctaCalculate: "Calculate",
    ctaOpen: "Open calculator",
    ctaOpenSector: "Open sector",
    inputCount: "~{count} inputs",
    sectorToolCounts: "{free} free · {premium} premium",
    resultsLabel: "Showing <strong>{count}</strong> calculators",
  },
  tr: {
    badgeSector: "Sektör",
    ctaCalculate: "Calculate",
    ctaOpen: "Hesaplayıcıyı aç",
    ctaOpenSector: "Sektörü aç",
    inputCount: "~{count} girdi",
    sectorToolCounts: "{free} ücretsiz · {premium} premium",
    resultsLabel: "<strong>{count}</strong> hesaplayıcı listeleniyor",
  },
  de: {
    badgeSector: "Branche",
    ctaCalculate: "Berechnen",
    ctaOpen: "Rechner öffnen",
    ctaOpenSector: "Branche öffnen",
    inputCount: "~{count} Eingaben",
    sectorToolCounts: "{free} kostenlos · {premium} Premium",
    resultsLabel: "<strong>{count}</strong> Rechner angezeigt",
  },
  fr: {
    badgeSector: "Secteur",
    ctaCalculate: "Calculer",
    ctaOpen: "Ouvrir le calculateur",
    ctaOpenSector: "Ouvrir le secteur",
    inputCount: "~{count} entrées",
    sectorToolCounts: "{free} gratuits · {premium} premium",
    resultsLabel: "<strong>{count}</strong> calculateurs affichés",
  },
  es: {
    badgeSector: "Sector",
    ctaCalculate: "Calcular",
    ctaOpen: "Abrir calculadora",
    ctaOpenSector: "Abrir sector",
    inputCount: "~{count} entradas",
    sectorToolCounts: "{free} gratis · {premium} premium",
    resultsLabel: "<strong>{count}</strong> calculadoras mostradas",
  },
  ar: {
  },
};

for (const locale of LOCALES) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages.calculatorCards = COPY[locale];
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`patched calculatorCards: ${locale}`);
}
