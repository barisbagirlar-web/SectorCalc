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
  tr: {
    "Concrete bags": "Beton torba sayısı",
    "Floor area": "Zemin alanı",
    "Pour volume": "Döküm hacmi",
    "Paint quantity": "Boya miktarı",
    "Tile count": "Fayans adedi",
    "Flooring area": "Zemin kaplama alanı",
    "Roof surface": "Çatı yüzeyi",
    "Stair layout": "Merdiven düzeni",
    "Drywall sheets": "Alçıpan levha",
    "Brick count": "Tuğla adedi",
    "Rebar weight": "İnşaat demiri ağırlığı",
    "Excavation volume": "Kazı hacmi",
    "Plaster estimate": "Sıva tahmini",
    "Renovation budget": "Yenileme bütçesi",
    "Monthly payment estimate": "Aylık taksit tahmini",
    "Mortgage payment estimate": "Konut kredisi taksit tahmini",
    "Simple interest": "Basit faiz",
    "Compound growth": "Bileşik büyüme",
    "Bags needed": "Gereken torba",
    "Estimated bags": "Tahmini torba",
    "Area": "Alan",
    "Volume": "Hacim",
    "Bags": "Torba",
    "Bag yield": "Torba verimi",
    "Waste": "Fire",
    "Length": "Uzunluk",
    "Width": "Genişlik",
    "Height": "Yükseklik",
    "Weight": "Ağırlık",
    "Thickness": "Kalınlık",
    "Depth": "Derinlik",
    "Diameter": "Çap",
    "Radius": "Yarıçap",
    "Rate": "Oran",
    "Cost": "Maliyet",
    "Price": "Fiyat",
    "Hours": "Saat",
    "Distance": "Mesafe",
    "Fuel": "Yakıt",
    "Power": "Güç",
    "Energy": "Enerji",
    "Quantity": "Miktar",
    "Count": "Adet",
    "Total": "Toplam",
    "Margin": "Marj",
    "Profit": "Kâr",
    "Revenue": "Gelir",
    "Salary": "Maaş",
    "Loan": "Kredi",
    "Interest": "Faiz",
    "Payment": "Ödeme",
    "Mortgage": "Konut kredisi",
    "Tax": "Vergi",
    "Discount": "İndirim",
    "Markup": "Kar marjı",
    "Scrap": "Fire",
    "Setup": "Hazırlık",
    "Setup time": "Hazırlık süresi",
    "Cycle time": "Çevrim süresi",
    "Machine rate": "Makine saat ücreti",
    "Labor rate": "İşçilik saat ücreti",
    "Material cost": "Malzeme maliyeti",
    "Unit cost": "Birim maliyet",
    "Coverage": "Kaplama",
    "Paint": "Boya",
    "Tile": "Fayans",
    "Brick": "Tuğla",
    "Concrete": "Beton",
    "Roof": "Çatı",
    "Floor": "Zemin",
    "Wall": "Duvar",
    "Room": "Oda",
    "Slab": "Döşeme",
    "Coats": "Kat",
    "Density": "Yoğunluk",
    "Contingency": "Yedek pay",
    "Principal": "Ana para",
    "Term": "Vade",
    "Compounds/yr": "Bileşik/yıl",
    "Net amount": "Net tutar",
    "Value": "Değer",
    "Gain": "Kazanç",
    "Salvage value": "Hurda değeri",
    "Useful life": "Faydalı ömür",
    "Fixed monthly": "Sabit aylık",
    "Variable/hr": "Değişken/saat",
    "Variable cost": "Değişken maliyet",
    "Fixed cost": "Sabit maliyet",
    "Monthly": "Aylık",
    "Annual": "Yıllık",
    "Daily": "Günlük",
    "Years": "Yıl",
    "Months": "Ay",
    "Days": "Gün",
    "Minutes": "Dakika",
    "Seconds": "Saniye",
    "Percent": "Yüzde",
    "Efficiency": "Verimlilik",
    "Consumption": "Tüketim",
    "Emission": "Emisyon",
    "Carbon": "Karbon",
    "Route": "Rota",
    "Trip": "Sefer",
    "Vehicle": "Araç",
    "Delivery": "Teslimat",
    "Crop": "Mahsul",
    "Yield": "Verim",
    "Dosage": "Dozaj",
    "Fertilizer": "Gübre",
    "Irrigation": "Sulama",
    "Inventory": "Stok",
    "Turnover": "Devir hızı",
    "Shrinkage": "Fire",
    "Return rate": "İade oranı",
    "Menu": "Menü",
    "Food cost": "Gıda maliyeti",
    "Rent": "Kira",
    "Budget": "Bütçe",
    "Depreciation": "Amortisman",
    "Downtime": "Duruş",
    "Rework": "Yeniden işleme",
    "Callback": "Geri çağrı",
    "Leak": "Kaçak",
    "Compressor": "Kompresör",
    "Panel": "Pano",
    "Weld": "Kaynak",
    "Bolt": "Cıvata",
    "Tolerance": "Tolerans",
    "Cutting": "Kesim",
    "Feed rate": "İlerleme hızı",
    "Tool life": "Takım ömrü",
    "Sheet metal": "Sac metal",
    "Print time": "Baskı süresi",
    "Layer height": "Katman yüksekliği",
    "Infill": "Dolgu",
    "Support": "Destek",
    "Filament": "Filament",
    "Spool": "Makara",
    "Torque": "Tork",
    "Pressure": "Basınç",
    "Temperature": "Sıcaklık",
    "Speed": "Hız",
    "Flow": "Debi",
    "Load": "Yük",
    "Force": "Kuvvet",
    "Footprint": "Ayak izi",
    "Pitch": "Eğim",
    "Slope": "Eğim",
    "Estimate": "Tahmin",
    "Estimated": "Tahmini",
    "Needed": "Gereken",
    "Required": "Gerekli",
    "Adjusted": "Düzeltilmiş",
    "Adjusted volume": "Düzeltilmiş hacim",
    "Total pour volume": "Toplam döküm hacmi",
    "Volume per bag": "Torba başına hacim",
    "Extra waste allowance": "Ek fire payı",
    "Room or slab length": "Oda veya döşeme uzunluğu",
    "Room or slab width": "Oda veya döşeme genişliği",
    "Waste percent": "Fire yüzdesi",
    "with waste": "fire payı ile",
    "waste factor": "fire payı",
    "waste allowance": "fire payı",
    "per hour": "saat başına",
    "per unit": "birim başına",
    "per bag": "torba başına",
    "per m²": "m² başına",
    "per km": "km başına",
    "in m²": "m² cinsinden",
    "in ft²": "ft² cinsinden",
    "in yd²": "yd² cinsinden",
    "in m³": "m³ cinsinden",
    "Margin leak drivers": "Marj kaçağı sürücüleri",
    "Enter risk variables to surface margin leak signals.": "Marj kaçağı sinyalleri için risk değişkenlerini girin.",
    "Inflation-adjusted amount": "Enflasyona göre düzeltilmiş tutar",
    "Vehicle depreciation": "Araç amortismanı",
    "Convert temperature across Celsius, Fahrenheit and Kelvin.": "Sıcaklığı Celsius, Fahrenheit ve Kelvin arasında dönüştürün.",
    "is required.": "zorunludur.",
    "must be a valid number.": "geçerli bir sayı olmalıdır.",
    "must be at least": "en az",
    "must be at most": "en fazla",
    "Smart form contract not found.": "Bu araç için akıllı form sözleşmesi bulunamadı.",
    "What result do these inputs produce under the documented formula?": "Bu girdiler belgelenmiş formüle göre hangi sonucu üretir?",
    "Formula summary": "Formül özeti",
    "Decision goal": "Karar hedefi",
    "Premium schema pipeline for": "Premium şema hesaplama hattı:",
    "What decision-support outputs do these inputs produce under the documented premium schema?": "Bu girdiler belgelenmiş premium şemaya göre hangi karar destek çıktılarını üretir?",
  },
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
const HELPER_PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-helper-phrase-glossary.json"), "utf8"),
);
const SURFACE_PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-surface-phrase-glossary.json"), "utf8"),
);

for (const loc of ["tr", "de", "fr", "es", "ar"]) {
  Object.assign(
    MASTER[loc],
    EXPAND[loc] ?? {},
    WORD_GLOSSARY[loc] ?? {},
    HELPER_PHRASE_GLOSSARY[loc] ?? {},
    SURFACE_PHRASE_GLOSSARY[loc] ?? {},
  );
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
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, localized);
  }
  return result === phrase ? null : result;
}

const extracted = [...new Set([...extractCalculatorPhrases(), ...extractCatalogLabels()])];
let autoAdded = 0;
for (const phrase of extracted) {
  for (const loc of ["tr", "de", "fr", "es", "ar"]) {
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
console.log(`Wrote ${OUT} (tr=${Object.keys(MASTER.tr).length} terms)`);
console.log(`Extracted ${extracted.length} unique calculator surface phrases from engines`);
console.log(`Auto-composed ${autoAdded} glossary entries from extracted phrases`);
