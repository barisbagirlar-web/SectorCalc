import { CATEGORY_TAXONOMY, TAXONOMY_CATEGORY_NAMES } from "@/lib/features/tools/category-taxonomy";

const LEGACY_SCHEMA_CATEGORY_KEYS: Readonly<Record<string, string>> = {
  "Finans & Kredi": "finans-kredi",
  "Malzeme, Fire & OEE": "malzeme-fire-oee",
  "Measurement & Conversion": "olcum-donusum",
  "Teknik & Mühendislik": "teknik-muhendislik",
  "Maliyet & Marj": "maliyet-marj",
  Diğer: "diger",
  "Enerji & Karbon": "enerji-karbon",
  "Construction & Field": "insaat-saha",
  "Retail & Food": "perakende-gida",
  "Rota & Lojistik": "rota-lojistik",
  "Finance & HR": "finans-ik",
};

const TAXONOMY_CATEGORY_KEYS: Readonly<Record<string, string>> = Object.fromEntries(
  TAXONOMY_CATEGORY_NAMES.map((title) => [title, CATEGORY_TAXONOMY[title].slug]),
);

const SCHEMA_CATEGORY_KEYS: Readonly<Record<string, string>> = {
  ...LEGACY_SCHEMA_CATEGORY_KEYS,
  ...TAXONOMY_CATEGORY_KEYS,
};

const SCHEMA_SECTOR_KEYS: Readonly<Record<string, string>> = {
  // Legacy multi-word classifications
  "Finance & HR": "finans-ik",
  "Manufacturing & Production": "uretim-imalat",
  "Teknik & Mühendislik": "teknik-muhendislik",
  Diğer: "diger",
  "Retail & Food": "perakende-gida",
  "Enerji & Karbon": "enerji-karbon",
  "Construction & Field": "insaat-saha",
  "Lojistik & Sevkiyat": "lojistik-sevkiyat",
  "Atölye & Tamir": "atolye-tamir",
  "Finans & Kredi": "finans-kredi",
  "OHS & Risk": "isg-risk",
  Sürdürülebilirlik: "surdurulebilirlik",
  "Quality, SPC & Six Sigma": "kalite-spc-alti-sigma",

  // Schema raw.sector values → taxonomy sector IDs
  Finans: "finans",
  "Business": "finans",
  "Mechanical Engineering": "makine",
  "Health & Fitness": "saglik",
  Gayrimenkul: "emlak",
  "Construction & Building": "insaat",
  "Advanced Physics & Quantum": "fizik",
  "Kredi ve Borç": "finans",
  "Spor, Mimari, Robotik ve Hukuk": "fizik",
  "Sigorta ve Emeklilik": "finans",
  "Fire, Electrical & Electronics": "enerji",
  "Agriculture, Maritime & Drilling": "tarim",
  "Data & Statistics": "istatistik",
  "IT, Biomedical & Mining": "bilisim",
  "Advanced Physics, Quantum & Energy": "fizik",
  "Fizik, Kimya ve Malzeme": "fizik",
  "Textile, Food & Plastics": "tekstil",
  "Çevre ve Sürdürülebilirlik": "cevre",
  "Mechanical, Automotive & Aerospace": "makine",
  "E-Ticaret": "perakende",
  "Industrial Engineering": "makine",
  Lojistik: "lojistik",
};

function slugifyLabel(label: string): string {
  return label
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "c")
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function resolveSchemaCategoryKey(label: string): string {
  return SCHEMA_CATEGORY_KEYS[label] ?? slugifyLabel(label);
}

export function resolveSchemaSectorKey(label: string): string {
  return SCHEMA_SECTOR_KEYS[label] ?? slugifyLabel(label);
}
