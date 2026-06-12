#!/usr/bin/env node
/**
 * Premium schema field copy — same pipeline as free-tool-inputs (6 locales).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);
const FIELD_LABEL_MAP = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-field-labels-i18n.json"), "utf8"),
);

const PLACEHOLDER_TEMPLATES = {
  en: (label) => `Enter ${label.toLowerCase()}`,
  tr: (label) => `${label} girin`,
  de: (label) => `${label} eingeben`,
  fr: (label) => `Saisir ${label.toLowerCase()}`,
  es: (label) => `Introduzca ${label.toLowerCase()}`,
  ar: (label) => `أدخل ${label}`,
};

const PREMIUM_MANUAL_TR = {
  "Weld throat": "Kaynak boğazı",
  "Weld length": "Kaynak uzunluğu",
  "Bolt diameter": "Cıvata çapı",
  "Bolt count": "Cıvata adedi",
  "Allowable stress": "İzin verilen gerilme",
  "Safety factor": "Güvenlik faktörü",
  "Effective fillet weld throat thickness.": "Efektif köşe kaynağı boğaz kalınlığı.",
  "Continuous weld length along the joint.": "Birleşim boyunca sürekli kaynak uzunluğu.",
  "Nominal bolt diameter.": "Nominal cıvata çapı.",
  "Number of bolts sharing the load path.": "Yük yolunu paylaşan cıvata sayısı.",
  "Workshop reference allowable stress for screening.": "Tarama için atölye referans izin verilen gerilme.",
  "Design safety factor applied to allowable stress.": "İzin verilen gerilime uygulanan tasarım güvenlik faktörü.",
  "Throat depth for capacity screening.": "Kapasite taraması için boğaz derinliği.",
  "Load path length for weld area.": "Kaynak alanı için yük yolu uzunluğu.",
  "Cross-section basis for bolt shear screening.": "Cıvata kesme taraması için kesit temeli.",
  "Bolt group size for capacity estimate.": "Kapasite tahmini için cıvata grubu boyutu.",
  "Informational allowable — not code certification.": "Bilgilendirme amaçlı izin verilen — kod sertifikası değildir.",
  "Screening divisor — verify with qualified engineer.": "Tarama böleni — yetkili mühendis ile doğrulayın.",
  "Empty return": "Boş dönüş",
  "Peak kWh": "Tepe kWh",
  "Ductwork variance": "Kanal işi sapması",
  "Warranty reserve": "Garanti karşılığı",
  "Dump fees": "Döküm/hafriyat ücretleri",
  Markdown: "İndirim (stok eritme)",
  "Rejection risk": "Red riski",
  "Assembly limit": "Montaj limiti",
  "Hydrant capacity": "Hidrant kapasitesi",
  "Process time": "İşlem süresi",
  "Wait time": "Bekleme süresi",
  Horizon: "Analiz ufku",
  "Employer burden": "İşveren yükü",
  "Notice weeks": "İhbar haftaları",
  "Driver RPM": "Motor devri (RPM)",
  "Expected downtime": "Beklenen duruş",
  "Monthly revenue": "Aylık ciro",
  "Gross margin": "Brüt marj",
  "Labor budget": "İşçilik bütçesi",
  "Labor overrun": "İşçilik aşımı",
  "Material budget": "Malzeme bütçesi",
  "Material overrun": "Malzeme aşımı",
  "Delivery app fee": "Teslimat uygulama ücreti",
  "Material variance": "Malzeme sapması",
  "Monthly API calls": "Aylık API çağrısı",
  "Expected yield": "Beklenen verim",
  "Actual yield": "Gerçekleşen verim",
  "Parts produced": "Üretilen parça",
  "Tool change minutes": "Takım değişim dakikası",
  Shrinkage: "Çekme/kayıp",
  "Job revenue": "İş geliri",
  "Monthly repair revenue": "Aylık onarım geliri",
  "Project revenue": "Proje geliri",
  "Callback risk": "Geri çağırma riski",
  "Panel revenue": "Panel geliri",
  "Callback visits": "Geri çağırma ziyaretleri",
  "Average inventory": "Ortalama stok",
  "Annual COGS": "Yıllık satılan malın maliyeti",
  Tolerance: "Tolerans",
  "Annual interest": "Yıllık faiz",
  "Safety margin uplift": "Güvenlik payı artışı",
  "Production units": "Üretim adedi",
  "Monthly benefits": "Aylık yan haklar",
  "Downtime minutes": "Duruş dakikası",
  Revenue: "Gelir",
  "Annual demand": "Yıllık talep",
  "Tolerance 1": "Tolerans 1",
  "Coverage drift": "Kaplama sapması",
  "Demand charge": "Talep bedeli",
};

const PREMIUM_MANUAL = {
  de: {
    "Weld throat": "Kehlnahtdicke",
    "Weld length": "Schweißlänge",
    "Bolt diameter": "Schraubendurchmesser",
    "Bolt count": "Schraubenanzahl",
    "Allowable stress": "Zulässige Spannung",
    "Safety factor": "Sicherheitsfaktor",
    "Effective fillet weld throat thickness.": "Effektive Kehlnahtdicke.",
    "Continuous weld length along the joint.": "Kontinuierliche Schweißlänge entlang der Fuge.",
    "Nominal bolt diameter.": "Nenn-Schraubendurchmesser.",
    "Number of bolts sharing the load path.": "Anzahl der Schrauben im Lastpfad.",
    "Workshop reference allowable stress for screening.": "Werkstatt-Referenzspannung für die Schnellprüfung.",
    "Design safety factor applied to allowable stress.": "Auf die zulässige Spannung angewandter Sicherheitsfaktor.",
  },
  fr: {
    "Weld throat": "Gorge de soudure",
    "Weld length": "Longueur de soudure",
    "Bolt diameter": "Diamètre de boulon",
    "Bolt count": "Nombre de boulons",
    "Allowable stress": "Contrainte admissible",
    "Safety factor": "Facteur de sécurité",
    "Effective fillet weld throat thickness.": "Épaisseur de gorge de soudure d'angle effective.",
    "Continuous weld length along the joint.": "Longueur de soudure continue le long de l'assemblage.",
    "Nominal bolt diameter.": "Diamètre nominal du boulon.",
    "Number of bolts sharing the load path.": "Nombre de boulons partageant le chemin de charge.",
    "Workshop reference allowable stress for screening.": "Contrainte admissible de référence atelier pour le contrôle.",
    "Design safety factor applied to allowable stress.": "Facteur de sécurité appliqué à la contrainte admissible.",
  },
  es: {
    "Weld throat": "Garganta de soldadura",
    "Weld length": "Longitud de soldadura",
    "Bolt diameter": "Diámetro del perno",
    "Bolt count": "Cantidad de pernos",
    "Allowable stress": "Esfuerzo admisible",
    "Safety factor": "Factor de seguridad",
    "Effective fillet weld throat thickness.": "Espesor efectivo de garganta de soldadura en ángulo.",
    "Continuous weld length along the joint.": "Longitud continua de soldadura a lo largo de la junta.",
    "Nominal bolt diameter.": "Diámetro nominal del perno.",
    "Number of bolts sharing the load path.": "Número de pernos que comparten la ruta de carga.",
    "Workshop reference allowable stress for screening.": "Esfuerzo admisible de referencia del taller para cribado.",
    "Design safety factor applied to allowable stress.": "Factor de seguridad aplicado al esfuerzo admisible.",
  },
  ar: {
    "Weld throat": "حلق اللحام",
    "Weld length": "طول اللحام",
    "Bolt diameter": "قطر البرغي",
    "Bolt count": "عدد البراغي",
    "Allowable stress": "إجهاد مسموح",
    "Safety factor": "معامل الأمان",
    "Effective fillet weld throat thickness.": "سماكة حلق لحام الزاوية الفعالة.",
    "Continuous weld length along the joint.": "طول اللحام المستمر على طول الوصلة.",
    "Nominal bolt diameter.": "قطر البرغي الاسمي.",
    "Number of bolts sharing the load path.": "عدد البراغي التي تشارك مسار الحمل.",
    "Workshop reference allowable stress for screening.": "إجهاد مسموح مرجعي للورشة للفحص السريع.",
    "Design safety factor applied to allowable stress.": "معامل الأمان المطبق على الإجهاد المسموح.",
  },
};

function loadPremiumTools() {
  const raw = execSync("npx tsx scripts/export-premium-schema-inputs.ts", {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "inherit"],
  });
  return JSON.parse(raw);
}

function sortedGlossaryEntries(locale) {
  const glossary = {
    ...(locale === "tr" ? PREMIUM_MANUAL_TR : {}),
    ...(PREMIUM_MANUAL[locale] ?? {}),
    ...(PHRASE_GLOSSARY[locale] ?? {}),
  };
  return Object.entries(glossary).sort((a, b) => b[0].length - a[0].length);
}

function translatePhrase(text, locale) {
  if (!text || locale === "en") {
    return text;
  }
  const fieldLabel = FIELD_LABEL_MAP[locale]?.[text];
  if (fieldLabel) {
    return fieldLabel;
  }
  const manual =
    locale === "tr" ? PREMIUM_MANUAL_TR[text] : PREMIUM_MANUAL[locale]?.[text];
  if (manual) {
    return manual;
  }
  if (PHRASE_GLOSSARY[locale]?.[text]) {
    return PHRASE_GLOSSARY[locale][text];
  }
  let result = text;
  for (const [en, localized] of sortedGlossaryEntries(locale)) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, localized);
  }
  return result;
}

function buildFieldCopy(locale, enLabel, enHelper, key) {
  const labelSource = enLabel?.trim() || key;
  const helperSource = enHelper?.trim() || labelSource;
  const label = locale === "en" ? labelSource : translatePhrase(labelSource, locale);
  const helper = locale === "en" ? helperSource : translatePhrase(helperSource, locale);
  const placeholder = PLACEHOLDER_TEMPLATES[locale](label);
  return { label, placeholder, helper };
}

const tools = loadPremiumTools();
const bundle = Object.fromEntries(LOCALES.map((l) => [l, {}]));

for (const tool of tools) {
  for (const locale of LOCALES) {
    bundle[locale][tool.slug] = {};
    for (const input of tool.inputs ?? []) {
      const fieldKey = input.key.toLowerCase();
      bundle[locale][tool.slug][fieldKey] = buildFieldCopy(
        locale,
        input.label,
        input.helper,
        input.key,
      );
    }
  }
}

const outPath = join(ROOT, "src/data/premium-schema-inputs-i18n.generated.json");
writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");

let fieldCount = 0;
for (const tool of tools) {
  fieldCount += (tool.inputs ?? []).length;
}
console.log(`Wrote ${outPath}`);
console.log(`premium schemas=${tools.length} fields=${fieldCount} locales=${LOCALES.length}`);

// Merge into messages.freeToolInputs (premium slugs share resolver pipeline)
for (const locale of LOCALES) {
  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(messagesPath, "utf8"));
  messages.freeToolInputs = {
    ...(messages.freeToolInputs ?? {}),
    ...bundle[locale],
  };
  writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Merged premium schema inputs → messages/${locale}.json`);
}

// Merge into master free-tool-inputs bundle file
const freeBundlePath = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const freeBundle = JSON.parse(readFileSync(freeBundlePath, "utf8"));
for (const locale of LOCALES) {
  freeBundle[locale] = { ...(freeBundle[locale] ?? {}), ...bundle[locale] };
}
writeFileSync(freeBundlePath, `${JSON.stringify(freeBundle, null, 2)}\n`, "utf8");
console.log(`Merged premium schema inputs → ${freeBundlePath}`);
