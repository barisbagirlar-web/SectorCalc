const SCHEMA_CATEGORY_KEYS: Readonly<Record<string, string>> = {
  "Finans & Kredi": "finans-kredi",
  "Malzeme, Fire & OEE": "malzeme-fire-oee",
  "Ölçüm & Dönüşüm": "olcum-donusum",
  "Teknik & Mühendislik": "teknik-muhendislik",
  "Maliyet & Marj": "maliyet-marj",
  Diğer: "diger",
  "Enerji & Karbon": "enerji-karbon",
  "İnşaat & Saha": "insaat-saha",
  "Perakende & Gıda": "perakende-gida",
  "Rota & Lojistik": "rota-lojistik",
  "Finans & İK": "finans-ik",
};

const SCHEMA_SECTOR_KEYS: Readonly<Record<string, string>> = {
  "Finans & İK": "finans-ik",
  "Üretim & İmalat": "uretim-imalat",
  "Teknik & Mühendislik": "teknik-muhendislik",
  Diğer: "diger",
  "Perakende & Gıda": "perakende-gida",
  "Enerji & Karbon": "enerji-karbon",
  "İnşaat & Saha": "insaat-saha",
  "Lojistik & Sevkiyat": "lojistik-sevkiyat",
  "Atölye & Tamir": "atolye-tamir",
  "Finans & Kredi": "finans-kredi",
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
