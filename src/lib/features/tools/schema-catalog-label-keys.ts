import { CATEGORY_TAXONOMY, TAXONOMY_CATEGORY_NAMES } from "@/lib/features/tools/category-taxonomy";

const LEGACY_SCHEMA_CATEGORY_KEYS: Readonly<Record<string, string>> = {
  "Finans & Kredi": "finans-kredi",
  "Malzeme, Fire & OEE": "malzeme-fire-oee",
  "Measurement & Conversion": "olcum-donusum",
  "Teknik & Engineerlik": "teknik-muhendislik",
  "Maliyet & Marj": "maliyet-marj",
  Diger: "diger",
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
  "Teknik & Engineerlik": "teknik-muhendislik",
  Diger: "diger",
  "Retail & Food": "perakende-gida",
  "Enerji & Karbon": "enerji-karbon",
  "Construction & Field": "insaat-saha",
  "Lojistik & Sevkiyat": "lojistik-sevkiyat",
  "Atolye & Tamir": "atolye-tamir",
  "Finans & Kredi": "finans-kredi",
  "OHS & Risk": "isg-risk",
  Surdurulebilirlik: "surdurulebilirlik",
  "Quality, SPC & Six Sigma": "kalite-spc-alti-sigma",

  // Schema raw.sector values → taxonomy sector IDs
  Finans: "finans",
  "Business": "finans",
  "Mechanical Engineering": "makine",
  "Health & Fitness": "saglik",
  Gayrimenkul: "emlak",
  "Construction & Building": "insaat",
  "Advanced Physics & Quantum": "fizik",
  "Kredi ve Borc": "finans",
  "Spor, Mimari, Robotik ve Hukuk": "fizik",
  "Sigorta ve Emeklilik": "finans",
  "Fire, Electrical & Electronics": "enerji",
  "Agriculture, Maritime & Drilling": "tarim",
  "Data & Statistics": "istatistik",
  "IT, Biomedical & Mining": "bilisim",
  "Advanced Physics, Quantum & Energy": "fizik",
  "Fizik, Kimya ve Malzeme": "fizik",
  "Textile, Food & Plastics": "tekstil",
  "Cevre ve Surdurulebilirlik": "cevre",
  "Mechanical, Automotive & Aerospace": "makine",
  "E-Ticaret": "perakende",
  "Industrial Engineering": "makine",
  Lojistik: "lojistik",
};

function slugifyLabel(label: string): string {
  return label
    .replace(/i/g, "i")
    .replace(/I/g, "i")
    .replace(/s/g, "s")
    .replace(/S/g, "s")
    .replace(/g/g, "g")
    .replace(/G/g, "g")
    .replace(/u/g, "u")
    .replace(/U/g, "u")
    .replace(/o/g, "o")
    .replace(/O/g, "o")
    .replace(/c/g, "c")
    .replace(/C/g, "c")
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
