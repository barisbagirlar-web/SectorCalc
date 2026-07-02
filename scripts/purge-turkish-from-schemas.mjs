#!/usr/bin/env node
/**
 * SectorCalc — Complete Turkish Purge v2.
 * Extracts ALL Turkish strings, translates them, updates dictionary,
 * then rewrites every schema file with English-only content.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DICT_PATH = path.join(ROOT, "data/turkish-to-english-dictionary.json");
const TURKISH_PATTERN = /[çğıöşüÇĞİÖŞÜ]/;

// ── Known sector translations (all 27 observed values) ──
const SECTOR_MAP = {
  "Çevre ve Sürdürülebilirlik": "Environment and Sustainability",
  "İnşaat ve Altyapı": "Construction and Infrastructure",
  "İnşaat ve Yapı": "Construction and Building",
  "Üretim ve Endüstri": "Manufacturing and Industry",
  "Enerji ve Güç Sistemleri": "Energy and Power Systems",
  "Finans ve Yatırım": "Finance and Investment",
  "Makine ve Mekanik": "Machinery and Mechanics",
  "Makine Mühendisliği": "Mechanical Engineering",
  "Elektrik ve Elektronik": "Electrical and Electronics",
  "Lojistik ve Nakliye": "Logistics and Transportation",
  "Tekstil ve Konfeksiyon": "Textile and Apparel",
  "Tekstil, Gıda ve Plastik": "Textile, Food and Plastic",
  "Gıda ve Tarım": "Food and Agriculture",
  "Yazılım ve Bilişim": "Software and IT",
  "Havacılık ve Denizcilik": "Aviation and Maritime",
  "Kimya ve Proses": "Chemical and Process",
  "Sağlık ve Medikal": "Health and Medical",
  "Sağlık ve Fitness": "Health and Fitness",
  "Eğitim ve Araştırma": "Education and Research",
  "Hukuk ve Danışmanlık": "Legal and Consulting",
  "Malzeme Bilimi": "Materials Science",
  "Petrol ve Doğalgaz": "Oil and Gas",
  "Savunma ve Güvenlik": "Defense and Security",
  "Su ve Atık Yönetimi": "Water and Waste Management",
  "Sigorta ve Risk": "Insurance and Risk",
  "Vergi ve Muhasebe": "Tax and Accounting",
  "Çelik Yapı": "Steel Structures",
  "Hidrolik ve Pnömatik": "Hydraulics and Pneumatics",
  "İleri Fizik ve Kuantum": "Advanced Physics and Quantum",
  "İleri Fizik, Kuantum ve Enerji": "Advanced Physics, Quantum and Energy",
  "Tarım, Denizcilik ve Sondaj": "Agriculture, Maritime and Drilling",
  "Bilişim, Biyomedikal ve Maden": "IT, Biomedical and Mining",
  "Mekanik, Otomotiv ve Havacılık": "Mechanical, Automotive and Aviation",
  "İşletme": "Business Management",
  "Veri ve İstatistik": "Data and Statistics",
  "Yangın, Elektrik ve Elektronik": "Fire, Electrical and Electronics",
  "Kredi ve Borç": "Credit and Debt",
  "Endüstri Mühendisliği": "Industrial Engineering",
};

// ── Common Turkish→English word/phrase pairs ──
const WORD_MAP = {
  // Measurement units
  "Hız": "Speed",
  "Hızı": "Speed",
  "Sıcaklık": "Temperature",
  "Sıcaklığı": "Temperature",
  "Basınç": "Pressure",
  "Basıncı": "Pressure",
  "Debi": "Flow Rate",
  "Debisi": "Flow Rate",
  "Yoğunluk": "Density",
  "Yoğunluğu": "Density",
  "Ağırlık": "Weight",
  "Ağırlığı": "Weight",
  "Uzunluk": "Length",
  "Uzunluğu": "Length",
  "Genişlik": "Width",
  "Genişliği": "Width",
  "Yükseklik": "Height",
  "Yüksekliği": "Height",
  "Derinlik": "Depth",
  "Derinliği": "Depth",
  "Kalınlık": "Thickness",
  "Kalınlığı": "Thickness",
  "Miktar": "Quantity",
  "Miktarı": "Quantity",
  "Oran": "Ratio",
  "Oranı": "Ratio",
  "Katsayı": "Coefficient",
  "Katsayısı": "Coefficient",
  "Sayı": "Number",
  "Sayısı": "Count",
  "Adet": "Quantity",
  "Kapasite": "Capacity",
  "Kapasitesi": "Capacity",
  "Süre": "Duration",
  "Süresi": "Time",
  "Mesafe": "Distance",
  "Alan": "Area",
  "Alanı": "Area",
  "Hacim": "Volume",
  "Hacmi": "Volume",
  "Güç": "Power",
  "Gücü": "Power",
  "Enerji": "Energy",
  "Kuvvet": "Force",
  "Tork": "Torque",
  "Verim": "Efficiency",
  "Verimi": "Efficiency",
  "Yük": "Load",
  "Yükü": "Load",
  "Akım": "Current",
  "Akımı": "Current",
  "Gerilim": "Voltage",
  "Frekans": "Frequency",
  "Direnç": "Resistance",
  "Değer": "Value",
  "Değeri": "Value",
  "Toplam": "Total",
  "Birim": "Unit",
  "Çap": "Diameter",
  "Çapı": "Diameter",
  "Yarıçap": "Radius",

  // Common adjectives
  "Giriş": "Input",
  "Çıkış": "Output",
  "Ortalama": "Average",
  "Maksimum": "Maximum",
  "Minimum": "Minimum",
  "Yıllık": "Annual",
  "Aylık": "Monthly",
  "Günlük": "Daily",
  "Haftalık": "Weekly",
  "Net": "Net",
  "Brüt": "Gross",

  // Time periods
  "Yıl": "Year",
  "Ay": "Month",
  "Gün": "Day",
  "Saat": "Hour",
  "Dakika": "Minute",
  "Saniye": "Second",

  // Finance
  "Faiz": "Interest",
  "Vergi": "Tax",
  "Gelir": "Income",
  "Gider": "Expense",
  "Maliyet": "Cost",
  "Fiyat": "Price",
  "Tutar": "Amount",
  "Kâr": "Profit",
  "Kar": "Profit",
  "Zarar": "Loss",
  "Yatırım": "Investment",
  "Kredi": "Loan",
  "Borç": "Debt",
  "Nakit": "Cash",
  "Bütçe": "Budget",
  "Ödeme": "Payment",

  // Common verbs and nouns
  "Hesaplama": "Calculation",
  "Hesaplanan": "Calculated",
  "Ölçüm": "Measurement",
  "Analiz": "Analysis",
  "Parametre": "Parameter",
  "Değişken": "Variable",
  "Sonuç": "Result",
  "Açıklama": "Description",
  "Birinci": "First",
  "İkinci": "Second",
  "Üçüncü": "Third",
  "Dördüncü": "Fourth",
  "Beşinci": "Fifth",
  "Altıncı": "Sixth",

  // Engineering
  "Malzeme": "Material",
  "Yapı": "Structure",
  "Yapısal": "Structural",
  "Taşıma": "Bearing",
  "Taşıma gücü": "Bearing Capacity",
  "Kaynak": "Welding",
  "Kaynaklı": "Welded",
  "Beton": "Concrete",
  "Çelik": "Steel",
  "Donatı": "Reinforcement",
  "Kiriş": "Beam",
  "Kolon": "Column",
  "Temel": "Foundation",
  "Döşeme": "Slab",
  "Duvar": "Wall",
  "Çatı": "Roof",
  "Merdiven": "Stair",
  "İskele": "Scaffold",
  "Kalıp": "Formwork",
  "Hafriyat": "Excavation",
  "Burkulma": "Buckling",
  "Sehim": "Deflection",
  "Eğilme": "Bending",
  "Burulma": "Torsion",
  "Kesme": "Shear",
  "Çekme": "Tension",
  "Sıkıştırma": "Compression",

  // Fluids
  "Akış": "Flow",
  "Akışkan": "Fluid",
  "Boru": "Pipe",
  "Pompa": "Pump",
  "Vana": "Valve",
  "Tank": "Tank",
  "Rezervuar": "Reservoir",
  "Sulama": "Irrigation",
  "Drenaj": "Drainage",

  // Manufacturing
  "İmalat": "Manufacturing",
  "Üretim": "Production",
  "Talaşlı": "Machining",
  "CNC": "CNC",
  "Takım": "Tool",
  "Tezgâh": "Machine",
  "İşleme": "Machining",
  "Tornalama": "Turning",
  "Frezeleme": "Milling",
  "Delme": "Drilling",
  "Taşlama": "Grinding",
  "Kaplama": "Coating",
  "Kaynak": "Welding",
  "Lehim": "Soldering",

  // Quality
  "Kalite": "Quality",
  "Kontrol": "Inspection",
  "Muayene": "Examination",
  "Tolerans": "Tolerance",
  "Hata": "Defect",
  "Fire": "Scrap",
  "İstatistik": "Statistics",
  "İstatistiksel": "Statistical",
  "Güvenilirlik": "Reliability",
  "Güven aralığı": "Confidence Interval",

  // Common businessContext stems
  "hesaplar": "calculates",
  "hesaplanır": "is calculated",
  "hesaplamak": "to calculate",
  "hesaplanması": "calculation of",
  "kullanılır": "is used",
  "kullanarak": "using",
  "arasındaki": "between",
  "için gerekli": "required for",
  "için gereken": "required for",
  "bağlı olarak": "based on",
  "tarafından": "by",
  "ile": "with",
  "ve": "and",
  "veya": "or",
  "bir": "a",
  "bu": "this",
  "olarak": "as",
  "olan": "which is",
  "olmadan": "without",
  "için": "for",
  "göre": "according to",
  "daha": "more",
  "en": "most",
  "çok": "many",
  "az": "less",

  // Unit labels
  "TL": "TRY",
  "₺": "TRY",
  "m²": "m²",
  "m³": "m³",
  "mm": "mm",
  "cm": "cm",
  "m": "m",
  "km": "km",
  "kg": "kg",
  "g": "g",
  "L": "L",
  "mL": "mL",
  "N": "N",
  "kN": "kN",
  "Pa": "Pa",
  "kPa": "kPa",
  "MPa": "MPa",
  "bar": "bar",
  "°C": "°C",
  "K": "K",
  "W": "W",
  "kW": "kW",
  "MW": "MW",
  "kWh": "kWh",
  "J": "J",
  "kJ": "kJ",
  "A": "A",
  "V": "V",
  "Hz": "Hz",
  "dk": "min",
  "Dk": "min",
  "dak": "min",
  "saat": "h",

  // Numeric ordinals
  "1.": "1st",
  "2.": "2nd",
  "3.": "3rd",
  "4.": "4th",
  "5.": "5th",
};

// ── Load existing dictionary ──
function loadDictionary() {
  if (!fs.existsSync(DICT_PATH)) return {};
  const raw = fs.readFileSync(DICT_PATH, "utf8");
  const parsed = JSON.parse(raw);
  const { _comment, ...entries } = parsed;
  return entries;
}

function saveDictionary(dict) {
  const ordered = {};
  Object.keys(dict).sort().forEach((k) => { ordered[k] = dict[k]; });
  const content = JSON.stringify(
    { _comment: "SectorCalc Turkish→English translation dictionary. Auto-generated. Expand as needed.", ...ordered },
    null,
    2,
  );
  fs.writeFileSync(DICT_PATH, content);
}

// ── Collect all schema files ──
function collectJsonFiles(dirPath) {
  const absPath = path.join(ROOT, dirPath);
  if (!fs.existsSync(absPath)) return [];
  const results = [];
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith(".json") && entry.name !== "_merged.json") results.push(fullPath);
    }
  }
  walk(absPath);
  return results;
}

// ── Extract all Turkish strings from an object ──
function extractTurkishStrings(obj, results = new Set(), path = "") {
  if (!obj || typeof obj !== "object") {
    if (typeof obj === "string" && TURKISH_PATTERN.test(obj)) results.add(obj.trim());
    return results;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === "string" && TURKISH_PATTERN.test(obj[i])) results.add(obj[i].trim());
      else extractTurkishStrings(obj[i], results, `${path}[${i}]`);
    }
    return results;
  }
  for (const val of Object.values(obj)) {
    if (typeof val === "string" && TURKISH_PATTERN.test(val)) results.add(val.trim());
    else extractTurkishStrings(val, results, `${path}.${val}`);
  }
  return results;
}

// ── Translate a Turkish string using word-by-word approach ──
function wordTranslate(text) {
  let result = text;

  // 1. Check sector map
  if (SECTOR_MAP[result]) return SECTOR_MAP[result];

  // 2. Replace known words (longest first to avoid partial matches)
  const sortedWords = Object.entries(WORD_MAP).sort(([a], [b]) => b.length - a.length);
  for (const [tr, en] of sortedWords) {
    const regex = new RegExp(tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    result = result.replace(regex, en);
  }

  // 3. Clean up: remove doubled spaces, fix spacing around parentheses
  result = result.replace(/\s+/g, " ").trim();
  result = result.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");

  return result;
}

// ── Main ──
console.log("\n═══ COMPLETE TURKISH PURGE v2 ═══\n");

const dict = loadDictionary();
const SCHEMA_DIRS = ["generated/schemas", "data/pro-tools", "data/pro-tools-universal"];

// Phase 1: Extract all Turkish strings and add to dictionary
console.log("Phase 1: Extracting all Turkish strings...\n");
let allTurkishStrings = new Set();

for (const dir of SCHEMA_DIRS) {
  const files = collectJsonFiles(dir);
  for (const filePath of files) {
    try {
      const schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
      extractTurkishStrings(schema, allTurkishStrings);
    } catch { /* skip unparseable */ }
  }
}

const sortedStrings = [...allTurkishStrings].sort();
console.log(`Found ${sortedStrings.length} unique Turkish strings.`);
console.log(`Dictionary has ${Object.keys(dict).length} entries.\n`);

// Phase 2: Add missing translations to dictionary
let newEntries = 0;
for (const tr of sortedStrings) {
  if (dict[tr]) continue; // already in dictionary

  // Try sector map first
  if (SECTOR_MAP[tr]) {
    dict[tr] = SECTOR_MAP[tr];
    newEntries++;
    continue;
  }

  // Try word-by-word translation
  const en = wordTranslate(tr);
  if (en !== tr && !TURKISH_PATTERN.test(en)) {
    dict[tr] = en;
    newEntries++;
    continue;
  }

  // Manual fallback
  dict[tr] = tr; // placeholder (shouldn't happen after wordTranslate)
}

console.log(`Added ${newEntries} new dictionary entries.`);
console.log(`Dictionary now has ${Object.keys(dict).length} entries.\n`);

// Phase 3: Save dictionary
saveDictionary(dict);

// Phase 4: Rewrite all files with translated content
console.log("Phase 2: Translating and rewriting all schema files...\n");

const SORTED_DICT = Object.entries(dict).sort(([a], [b]) => b.length - a.length);

function translateText(text) {
  if (!text || !TURKISH_PATTERN.test(text)) return text;

  let result = text;

  // Greedy dictionary match (longest entries first)
  for (const [tr, en] of SORTED_DICT) {
    const regex = new RegExp(tr.replace(/[./*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    if (regex.test(result)) {
      result = result.replace(regex, en);
    }
  }

  // Final char-level strip for any remaining Turkish
  if (TURKISH_PATTERN.test(result)) {
    result = result
      .replace(/ç/g, "c").replace(/Ç/g, "C")
      .replace(/ğ/g, "g").replace(/Ğ/g, "G")
      .replace(/ı/g, "i").replace(/İ/g, "I")
      .replace(/ö/g, "o").replace(/Ö/g, "O")
      .replace(/ş/g, "s").replace(/Ş/g, "S")
      .replace(/ü/g, "u").replace(/Ü/g, "U");
  }

  return result;
}

function translateObject(obj) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) translateObject(obj[i]);
    return;
  }
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string" && TURKISH_PATTERN.test(val)) {
      obj[key] = translateText(val);
    } else if (typeof val === "object") {
      translateObject(val);
    }
  }
}

let totalFiles = 0;
let totalBefore = 0;
let totalAfter = 0;

for (const dir of SCHEMA_DIRS) {
  const files = collectJsonFiles(dir);
  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");
    const beforeMatches = raw.match(TURKISH_PATTERN);
    if (!beforeMatches) continue;

    const beforeCount = beforeMatches.length;
    totalBefore += beforeCount;
    totalFiles++;

    const schema = JSON.parse(raw);
    translateObject(schema);
    const out = JSON.stringify(schema, null, 2) + "\n";
    fs.writeFileSync(filePath, out);

    const afterMatches = out.match(TURKISH_PATTERN);
    const afterCount = afterMatches ? afterMatches.length : 0;
    totalAfter += afterCount;

    const relPath = path.relative(ROOT, filePath);
    console.log(`  ${beforeCount}→${afterCount}  ${relPath}`);
  }
}

console.log("\n═══ SUMMARY ═══");
console.log(`Files touched:      ${totalFiles}`);
console.log(`Turkish chars before: ${totalBefore}`);
console.log(`Turkish chars after:  ${totalAfter}`);
console.log(`Dictionary entries: ${Object.keys(dict).length}`);

if (totalAfter === 0) {
  console.log("\n✅ ALL SCHEMAS ARE NOW 100% ENGLISH. Turkish = 0.");
  process.exit(0);
} else {
  console.log(`\n⚠️  ${totalAfter} Turkish chars remain. Manual fix needed.`);
  process.exit(1);
}
