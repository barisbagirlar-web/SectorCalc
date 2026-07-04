#!/usr/bin/env node
/**
 * DEPRECATED — corrupts freeToolInputs via word-by-word glossary polish.
 * Field copy SSOT: src/data/free-tool-inputs-i18n.generated.json
 * Use: npm run sync:free-tool-inputs
 */
console.error(
  "polish-locale-calculator-inputs: DEPRECATED — skipped (use sync:free-tool-inputs + generate:calculator-i18n)",
);
process.exit(0);

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

const GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);

const RESIDUE = {
  tr: {
    Time: "Süre",
    Input: "Input",
    Amount: "Tutar",
    Loading: "Yükleme",
    Unloading: "Boşaltma",
    Coolant: "Soğutucu",
    Measurement: "Ölçüm",
    Driving: "Sürüş",
    Processing: "İşlem",
    Calculate: "Calculate",
    Select: "Seçin",
    Result: "Sonuç",
    Length: "Length",
    Width: "Genişlik",
    Height: "Yükseklik",
    Depth: "Derinlik",
    Area: "Area",
    Volume: "Volume",
    Weight: "Ağırlık",
    Price: "Price",
    Cost: "Cost",
    Rate: "Ratio",
    Margin: "Margin",
    Revenue: "Gelir",
    Profit: "Kâr",
    Discount: "İndirim",
    Tax: "Tax",
    Loan: "Kredi",
    Payment: "Ödeme",
    Quantity: "Quantity",
    Unit: "Unit",
    Calculator: "Calculation toolı",
    Output: "Çıktı",
    Choose: "Seçin",
    Search: "Ara",
    Reset: "Sıfırla",
    Submit: "Gönder",
    Required: "Zorunlu",
    Optional: "İsteğe bağlı",
    Invalid: "Geçersiz",
    Error: "Error",
    Warning: "Uyarı",
    Total: "Total",
    Subtotal: "Ara total",
    Annual: "Yıllık",
    Monthly: "Aylık",
    Daily: "Günlük",
    Hourly: "Saatlik",
    Distance: "Distance",
    Speed: "Hız",
    Fuel: "Yakıt",
    Energy: "Energy",
    Power: "Güç",
    Temperature: "Sıcaklık",
    Pressure: "Basınç",
    Diameter: "Çap",
    Radius: "Yarıçap",
    Thickness: "Kalınlık",
    Density: "Yoğunluk",
    bill: "fatura",
    service: "hizmet",
    transaction: "işlem",
    origin: "çıkış",
    destination: "varış",
    travel: "seyahat",
    compute: "calculate",
    expedited: "emergency",
    multiplier: "çarpan",
    workpiece: "iş parçası",
    machine: "machine",
    turret: "taret",
    indexing: "indeksleme",
    machinability: "işlenebilirlik",
    probing: "prob",
    manual: "manuel",
    expected: "expected",
    traffic: "trafik",
    premium: "prim",
    surcharge: "ek ücret",
    soil: "toprak",
    recipe: "reçete",
    batch: "parti",
    portion: "porsiyon",
    product: "ürün",
    dollar: "dolar",
    saved: "biriktirilen",
    average: "average",
    change: "değiştirme",
    tool: "takım",
    before: "önce",
    during: "sırasında",
    influences: "etkiler",
    assumed: "varsayılan",
    reporting: "raporlama",
    defects: "kusur",
    continuous: "sürekli",
    discrete: "ayrık",
    "In-Process": "Süreç içi",
  },
  de: { Calculate: "Berechnen", Select: "Wählen", Result: "Ergebnis", Input: "Eingabe", Amount: "Betrag", Time: "Zeit" },
  fr: { Calculate: "Calculer", Select: "Sélectionner", Result: "Résultat", Input: "Entrée", Amount: "Montant", Time: "Temps" },
  es: { Calculate: "Calcular", Select: "Seleccionar", Result: "Resultado", Input: "Entrada", Amount: "Importe", Time: "Tiempo" },
  ar: { Calculate: "احسب", Select: "اختر", Result: "النتيجة", Input: "إدخال", Amount: "المبلغ", Time: "الوقت" },
};

function sortedGlossaryEntries(locale) {
  return Object.entries(GLOSSARY[locale] ?? {}).sort((a, b) => b[0].length - a[0].length);
}

function sortedResidueEntries(locale) {
  return Object.entries(RESIDUE[locale] ?? {}).sort((a, b) => b[0].length - a[0].length);
}

function polishText(text, locale) {
  if (!text || locale === "en") {
    return text;
  }
  let result = text;
  for (const [en, localized] of sortedGlossaryEntries(locale)) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, localized);
  }
  for (const [en, localized] of sortedResidueEntries(locale)) {
    const re = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    result = result.replace(re, localized);
  }
  return result;
}

let totalPolished = 0;

for (const locale of LOCALES) {
  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(messagesPath, "utf8"));
  const inputs = messages.freeToolInputs ?? {};
  let localePolished = 0;

  for (const fields of Object.values(inputs)) {
    if (!fields || typeof fields !== "object") {
      continue;
    }
    for (const copy of Object.values(fields)) {
      if (!copy || typeof copy !== "object") {
        continue;
      }
      for (const part of ["label", "placeholder"]) {
        const raw = copy[part];
        if (typeof raw !== "string" || !raw.trim()) {
          continue;
        }
        const polished = polishText(raw, locale);
        if (polished !== raw) {
          copy[part] = polished;
          localePolished += 1;
        }
      }
      // Never word-polish helpers — full-phrase DeepSeek map owns helper copy.
    }
  }

  writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  totalPolished += localePolished;
  console.log(`polished ${locale}: ${localePolished} field part(s)`);
}

console.log(`polish-locale-calculator-inputs: ${totalPolished} total updates`);
