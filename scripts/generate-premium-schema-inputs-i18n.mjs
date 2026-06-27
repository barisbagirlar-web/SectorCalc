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
};

const PREMIUM_MANUAL_TR = {
  "Estimated Annual Savings": "Tahmini Yıllık Tasarruf",
  "Probability of Success": "Başarı Olasılığı",
  "Project Duration Months": "Proje Süresi (Ay)",
  "Resource Cost": "Kaynak Maliyeti",
  "Foreign currency assets": "Döviz varlıkları",
  "Foreign currency liabilities": "Döviz yükümlülükleri",
  "Hedging ratio": "Hedging (Korunma) oranı",
  "Data completeness": "Veri bütünlüğü",
  "Currency code": "Para Birimi",
  "Analysis period length": "Analiz Periyodu Uzunluğu",
  "Working days per year": "Yıllık Çalışma Günü",
  "Production units in period": "Dönem İçi Üretim Adedi",
  "Unit variable cost": "Birim Değişken Maliyeti",
  "Unit selling price": "Birim Satış Fiyatı",
  "Gross margin percent": "Brüt Marj Yüzdesi",
  "Excess production units": "İhtiyaç Fazlası Üretim Adedi",
  "Excess inventory holding days": "Fazla Stok Bekleme Süresi (Gün)",
  "Excess write-down per unit": "Birim Başına Değer Kaybı",
  "Waiting minutes": "Bekleme Süresi (Dakika)",
  "Affected operators": "Etkilenen Operatör Sayısı",
  "Hourly labor cost": "Saatlik İşçilik Maliyeti",
  "Affected machines": "Etkilenen Makine Sayısı",
  "Hourly machine cost": "Saatlik Makine Maliyeti",
  "Hourly opportunity cost": "Saatlik Fırsat Maliyeti",
  "Planned units per hour": "Saatlik Planlanan Üretim",
  "Transport distance": "Taşıma Mesafesi (km)",
  "Transport trips": "Taşıma Sefer Sayısı",
  "Transport cost per km": "Km Başına Taşıma Maliyeti",
  "Handling minutes per trip": "Sefer Başına Yükleme/Boşaltma Süresi (Dk)",
  "Handling hourly labor cost": "Yükleme/Boşaltma Saatlik Maliyeti",
  "Transport damage rate": "Taşıma Hasar Oranı (%)",
  "Average load value": "Ortalama Yük Değeri",
  "Average excess inventory value": "Ortalama Fazla Stok Değeri",
  "Inventory holding rate": "Stok Tutma Oranı (%)",
  "Inventory obsolescence value": "Stok Eskime Değer Kaybı",
  "Inventory shrinkage rate": "Stok Kayıp/Fire Oranı (%)",
  "Unnecessary motion minutes": "Gereksiz Hareket Süresi (Dk)",
  "Motion affected operators": "Hareketten Etkilenen Operatör Sayısı",
  "Motion hourly labor cost": "Hareket Saatlik İşçilik Maliyeti",
  "Overprocessing minutes": "Aşırı İşlem Süresi (Dk)",
  "Overprocessing hourly resource cost": "Aşırı İşlem Saatlik Kaynak Maliyeti",
  "Extra material cost": "Ekstra Malzeme Maliyeti",
  "Extra energy cost": "Ekstra Enerji Maliyeti",
  "Extra inspection cost": "Ekstra Kontrol Maliyeti",
  "Scrap units": "Hurda Miktarı (Adet)",
  "Scrap disposal cost per unit": "Birim Başına Hurda Bertaraf Maliyeti",
  "Rework minutes": "Yeniden İşlem Süresi (Dk)",
  "Rework hourly labor cost": "Yeniden İşlem Saatlik İşçilik Maliyeti",
  "Rework hourly machine cost": "Yeniden İşlem Saatlik Makine Maliyeti",
  "Customer return cost": "Müşteri İade Maliyeti",
  "Warranty cost": "Garanti Maliyeti",
  "Expedite cost": "Hızlandırma / Acil Kargo Maliyeti",
  "Total waste cost": "Toplam İsraf Maliyeti",
  "Annualized waste cost": "Yıllıklandırılmış İsraf Maliyeti",
  "Waste cost per unit": "Birim Başına İsraf Maliyeti",
  "Period revenue": "Dönem Geliri",
  "Period gross margin value": "Dönem Brüt Marj Değeri",
  "Waste to revenue ratio": "İsraf / Gelir Oranı",
  "Waste to gross margin ratio": "İsraf / Brüt Marj Oranı",
  "Highest waste category cost": "En Yüksek İsraf Kategorisi Maliyeti",
  "Risk-adjusted priority score": "Risk Düzeltilmiş Öncelik Skoru",
  "Overproduction cost": "Aşırı Üretim Maliyeti",
  "Waiting cost": "Bekleme Maliyeti",
  "Transport cost": "Taşıma Maliyeti",
  "Inventory cost": "Stok Maliyeti",
  "Motion cost": "Gereksiz Hareket Maliyeti",
  "Overprocessing cost": "Aşırı İşlem Maliyeti",
  "Defect cost": "Kusur ve Hata Maliyeti",
  "Highest waste category rank": "En Yüksek İsraf Kategorisi Sıralaması",
  "Data confidence": "Veri güvenilirliği",
  "Implementation difficulty": "Uygulama zorluğu",
  "Unused space": "Kullanılmayan alan",
  "Embedded emissions": "Gömülü emisyonlar",
  "Declared emissions": "Beyan edilen emisyonlar",
  "Affected operators": "Etkilenen operatörler",
  "Affected machines": "Etkilenen makineler",
  "Waiting opportunity mode": "Bekleme fırsat maliyeti yöntemi",
  "Motion affected operators": "Hareketten etkilenen operatörler",

  "Projected annual financial benefit from the Six Sigma project.": "Projenin başarıya ulaşması durumunda yıllık olarak sağlanacak finansal getiri.",
  "Estimated likelihood of achieving the project goals.": "Projenin hedeflerine başarıyla ulaşma ihtimali.",
  "Time required to complete the project (months).": "Projenin tamamlanması için öngörülen süre (Ay cinsinden).",
  "Total investment required for the project resources.": "Eğitim, donanım, personel gibi projeye harcanacak toplam kaynak maliyeti.",
  "Shop supplies and consumables on parts subtotal.": "Parça ara toplamı üzerinden atölye malzemeleri ve sarf malzemeleri.",
  "Choose how waiting opportunity cost is excluded, entered manually, or derived from throughput.": "Bekleme fırsat maliyetinin nasıl hariç tutulacağını, manuel olarak girileceğini veya üretim miktarından türetileceğini seçin.",

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
    const pattern = /^\w+$/.test(en)
      ? "\\b" + en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b"
      : en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(pattern, "gi");
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
