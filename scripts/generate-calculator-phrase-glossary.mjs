#!/usr/bin/env node
/**
 * Master calculator phrase glossary — inputs, results, labels, explanations.
 * Single source for runtime translateCalculatorPhrase + input i18n generator.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "src/data/calculator-phrase-glossary.json");

/** Shared EN terms → per-locale (extend as catalog grows). */
const MASTER = {
  de: {
    "Concrete bags": "Betonsäcke",
    "Floor area": "Grundfläche",
    "Pour volume": "Gussvolumen",
    "Bag yield": "Sackertrag",
    "Waste": "Ausschuss",
    "Volume": "Volumen",
    "Length": "Länge",
    "Width": "Breite",
    "Height": "Höhe",
    "Area": "Fläche",
    "Weight": "Gewicht",
    "Cost": "Kosten",
    "Price": "Preis",
    "Rate": "Satz",
    "Hours": "Stunden",
    "Principal": "Kapital",
    "Term": "Laufzeit",
    "Coats": "Schichten",
    "Density": "Dichte",
    "Setup": "Rüstzeit",
    "Margin leak drivers": "Margenverlust-Treiber",
    "Enter risk variables to surface margin leak signals.": "Geben Sie Risikofaktoren ein, um Margenverlust-Signale anzuzeigen.",
    "Total pour volume": "Gesamtes Gussvolumen",
    "Volume per bag": "Volumen pro Sack",
    "Extra waste allowance": "Zusätzlicher Ausschusszuschlag",
    "is required.": "ist erforderlich.",
    "must be a valid number.": "muss eine gültige Zahl sein.",
    "Smart form contract not found.": "Smart-Form-Vertrag für dieses Tool nicht gefunden.",
  },
  fr: {
    "Concrete bags": "Sacs de béton",
    "Floor area": "Surface au sol",
    "Pour volume": "Volume de coulée",
    "Bag yield": "Rendement par sac",
    "Waste": "Perte",
    "Volume": "Volume",
    "Length": "Longueur",
    "Width": "Largeur",
    "Height": "Hauteur",
    "Area": "Surface",
    "Weight": "Poids",
    "Cost": "Coût",
    "Price": "Prix",
    "Rate": "Taux",
    "Hours": "Heures",
    "Principal": "Capital",
    "Term": "Durée",
    "Coats": "Couches",
    "Density": "Densité",
    "Setup": "Préparation",
    "Margin leak drivers": "Facteurs de fuite de marge",
    "Enter risk variables to surface margin leak signals.": "Saisissez les variables de risque pour afficher les signaux de fuite de marge.",
    "Total pour volume": "Volume total de coulée",
    "Volume per bag": "Volume par sac",
    "Extra waste allowance": "Marge de perte supplémentaire",
    "is required.": "est obligatoire.",
    "must be a valid number.": "doit être un nombre valide.",
    "Smart form contract not found.": "Contrat de formulaire intelligent introuvable pour cet outil.",
  },
  es: {
    "Concrete bags": "Sacos de hormigón",
    "Floor area": "Superficie del suelo",
    "Pour volume": "Volumen de vertido",
    "Bag yield": "Rendimiento por saco",
    "Waste": "Desperdicio",
    "Volume": "Volumen",
    "Length": "Longitud",
    "Width": "Ancho",
    "Height": "Altura",
    "Area": "Área",
    "Weight": "Peso",
    "Cost": "Costo",
    "Price": "Precio",
    "Rate": "Tasa",
    "Hours": "Horas",
    "Principal": "Capital",
    "Term": "Plazo",
    "Coats": "Capas",
    "Density": "Densidad",
    "Setup": "Preparación",
    "Margin leak drivers": "Factores de fuga de margen",
    "Enter risk variables to surface margin leak signals.": "Introduzca variables de riesgo para mostrar señales de fuga de margen.",
    "Total pour volume": "Volumen total de vertido",
    "Volume per bag": "Volumen por saco",
    "Extra waste allowance": "Margen de desperdicio adicional",
    "is required.": "es obligatorio.",
    "must be a valid number.": "debe ser un número válido.",
    "Smart form contract not found.": "Contrato de formulario inteligente no encontrado para esta herramienta.",
  },
  ar: {
    "Concrete bags": "أكياس الخرسانة",
    "Floor area": "مساحة الأرضية",
    "Pour volume": "حجم الصب",
    "Bag yield": "إنتاجية الكيس",
    "Waste": "الهدر",
    "Volume": "الحجم",
    "Length": "الطول",
    "Width": "العرض",
    "Height": "الارتفاع",
    "Area": "المساحة",
    "Weight": "الوزن",
    "Cost": "التكلفة",
    "Price": "السعر",
    "Rate": "المعدل",
    "Hours": "الساعات",
    "Principal": "رأس المال",
    "Term": "المدة",
    "Coats": "الطبقات",
    "Density": "الكثافة",
    "Setup": "الإعداد",
    "Margin leak drivers": "محركات تسرب الهامش",
    "Enter risk variables to surface margin leak signals.": "أدخل متغيرات المخاطر لإظهار إشارات تسرب الهامش.",
    "Total pour volume": "إجمالي حجم الصب",
    "Volume per bag": "الحجم لكل كيس",
    "Extra waste allowance": "هامش هدر إضافي",
    "is required.": "مطلوب.",
    "must be a valid number.": "يجب أن يكون رقماً صالحاً.",
    "Smart form contract not found.": "لم يتم العثور على عقد النموذج الذكي لهذه الأداة.",
  },
};

const EXPAND = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-glossary-expand.json"), "utf8"),
);
const WORD_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-word-glossary.json"), "utf8"),
);

for (const loc of ["de", "fr", "es", "ar"]) {
  Object.assign(MASTER[loc], EXPAND[loc] ?? {}, WORD_GLOSSARY[loc] ?? {});
}

const CATALOG_PATHS = [
  "src/lib/tools/free-traffic-catalog.generated.json",
  "src/lib/tools/roadmap-free-batch1-catalog.generated.json",
  "src/lib/tools/roadmap-free-batch2-catalog.generated.json",
];

function extractCatalogLabels() {
  const labels = new Set();
  for (const rel of CATALOG_PATHS) {
    const tools = JSON.parse(readFileSync(join(ROOT, rel), "utf8"));
    for (const tool of tools) {
      for (const input of tool.inputs ?? []) {
        if (input.label?.trim()) {
          labels.add(input.label.trim());
        }
      }
    }
  }
  return [...labels];
}

// Extract unique quoted strings from calculator engines for EN baseline
function extractCalculatorPhrases() {
  const files = [
    "src/lib/tools/free-traffic-calculators.ts",
    "src/lib/tools/roadmap-free-batch1-calculators.ts",
    "src/lib/tools/roadmap-free-batch2-calculators.ts",
  ];
  const phrases = new Set();
  const re = /(?:headline|primaryLabel|explanation|label):\s*"([^"]+)"/g;
  for (const rel of files) {
    const text = readFileSync(join(ROOT, rel), "utf8");
    let m;
    while ((m = re.exec(text)) !== null) {
      phrases.add(m[1]);
    }
  }
  return [...phrases];
}

function sortedGlossaryEntries(locale) {
  return Object.entries(MASTER[locale] ?? {}).sort((a, b) => b[0].length - a[0].length);
}

function composePhraseTranslation(phrase, locale) {
  if (!phrase || locale === "en") {
    return phrase;
  }
  if (MASTER[locale][phrase]) {
    return MASTER[locale][phrase];
  }
  let result = phrase;
  for (const [en, localized] of sortedGlossaryEntries(locale)) {
    const pattern = /^\w+$/.test(en)
      ? "\\b" + en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b"
      : en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(pattern, "gi");
    result = result.replace(re, localized);
  }
  return result === phrase ? null : result;
}

const extracted = [...new Set([...extractCalculatorPhrases(), ...extractCatalogLabels()])];
let autoAdded = 0;
for (const phrase of extracted) {
  for (const loc of ["de", "fr", "es", "ar"]) {
    if (MASTER[loc][phrase]) {
      continue;
    }
    const composed = composePhraseTranslation(phrase, loc);
    if (composed) {
      MASTER[loc][phrase] = composed;
      autoAdded += 1;
    }
  }
}

writeFileSync(OUT, `${JSON.stringify(MASTER, null, 2)}\n`, "utf8");
console.log(`Wrote ${OUT}`);
console.log(`Extracted ${extracted.length} unique calculator surface phrases from engines`);
console.log(`Auto-composed ${autoAdded} glossary entries from extracted phrases`);
