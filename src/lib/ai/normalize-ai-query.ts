const DIACRITICS = /[ıİşŞğĞüÜöÖçÇ]/g;
const DIACRITIC_MAP: Record<string, string> = {
  ı: "i",
  İ: "i",
  ş: "s",
  Ş: "s",
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

export function normalizeAiQuery(value: string): string {
  return value
    .trim()
    .replace(DIACRITICS, (char) => DIACRITIC_MAP[char] ?? char)
    .toLowerCase()
    .replace(/[–—−-]/g, " ")
    .replace(/[^\p{L}\p{N}\s./+]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeAiQuery(value: string): readonly string[] {
  const normalized = normalizeAiQuery(value);
  if (!normalized) {
    return [];
  }
  return normalized.split(" ").filter((token) => token.length >= 2);
}
