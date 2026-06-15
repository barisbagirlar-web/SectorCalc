#!/usr/bin/env node
/**
 * Merge generatedTool.premiumForm + feedback.thankYou keys into messages/*.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const premiumFormPatches = {
  en: {
    calculate: "Calculate",
    operatorStation: "Operator station",
    calculationStandardLabel: "Calculation standard",
  },
  tr: {
    calculate: "Hesapla",
    operatorStation: "Operatör istasyonu",
    calculationStandardLabel: "Hesaplama standardı",
  },
  de: {
    calculate: "Berechnen",
    operatorStation: "Bedienstation",
    calculationStandardLabel: "Berechnungsstandard",
  },
  fr: {
    calculate: "Calculer",
    operatorStation: "Poste opérateur",
    calculationStandardLabel: "Norme de calcul",
  },
  es: {
    calculate: "Calcular",
    operatorStation: "Estación del operador",
    calculationStandardLabel: "Estándar de cálculo",
  },
  ar: {
    calculate: "احسب",
    operatorStation: "محطة المشغل",
    calculationStandardLabel: "معيار الحساب",
  },
};

const feedbackThankYou = {
  en: "Thank you for your feedback.",
  tr: "Geri bildiriminiz için teşekkürler.",
  de: "Vielen Dank für Ihr Feedback.",
  fr: "Merci pour votre retour.",
  es: "Gracias por sus comentarios.",
  ar: "شكرًا على ملاحظاتك.",
};

for (const locale of LOCALES) {
  const filePath = join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(readFileSync(filePath, "utf8"));

  if (!data.generatedTool) {
    data.generatedTool = {};
  }
  if (!data.generatedTool.premiumForm) {
    data.generatedTool.premiumForm = {};
  }
  Object.assign(data.generatedTool.premiumForm, premiumFormPatches[locale]);

  if (!data.feedback) {
    data.feedback = {};
  }
  data.feedback.thankYou = feedbackThankYou[locale];

  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`merged tool-form i18n → messages/${locale}.json`);
}
