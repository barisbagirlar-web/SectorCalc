#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const PATCHES = {
  de: {
    eyebrow: "Nach Funktion",
    title: "Rechner nach Mess- oder Entscheidungsbedarf finden.",
    subtitle:
      "Wählen Sie zuerst den Berechnungstyp — Produktivität, Ausschuss, Kosten, Routing, Energie, Messung oder Finanzen — und öffnen Sie dann den passenden Gratis-Check oder Premium-Bericht.",
    metaTitle: "Rechner nach Funktion — OEE, Ausschuss, Route, Energie",
    metaDescription:
      "SectorCalc-Tools nach Messziel: OEE, Ausschuss, Routing, Kalibrierung, Energie, Marge, Finanzen und Alltagsberechnungen.",
  },
  fr: {
    eyebrow: "Par fonction",
    title: "Trouvez les calculateurs selon ce que vous devez mesurer.",
    subtitle:
      "Choisissez d'abord le type de calcul — productivité, perte, coût, routage, énergie, mesure ou finance — puis ouvrez le contrôle gratuit ou le rapport premium adapté.",
    metaTitle: "Calculateurs par fonction — OEE, perte, route, énergie",
    metaDescription:
      "Outils SectorCalc selon ce que vous mesurez : OEE, perte, routage, calibration, énergie, marge, finance et calculs quotidiens.",
  },
  es: {
    eyebrow: "Por función",
    title: "Encuentre calculadoras según lo que necesita medir.",
    subtitle:
      "Elija primero el tipo de cálculo — productividad, desperdicio, costo, ruta, energía, medición o finanzas — y abra la comprobación gratuita o el informe premium adecuado.",
    metaTitle: "Calculadoras por función — OEE, desperdicio, ruta, energía",
    metaDescription:
      "Herramientas SectorCalc según lo que mide: OEE, desperdicio, ruta, calibración, energía, margen, finanzas y cálculos diarios.",
  },
  ar: {
    subtitle:
    metaDescription:
  },
};

for (const [locale, copy] of Object.entries(PATCHES)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages.catalogExplorer.categories = {
    ...messages.catalogExplorer.categories,
    ...copy,
  };
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Patched catalogExplorer.categories → messages/${locale}.json`);
}
