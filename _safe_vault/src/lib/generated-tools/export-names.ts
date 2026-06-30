const TR_CHAR_MAP: Readonly<Record<string, string>> = {
  ğ: "g",
  Ğ: "G",
  ü: "u",
  Ü: "U",
  ş: "s",
  Ş: "S",
  ı: "i",
  İ: "I",
  ö: "o",
  Ö: "O",
  ç: "c",
  Ç: "C",
};

export function normalizeAscii(str: string): string {
  return str.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (char) => TR_CHAR_MAP[char] ?? char);
}

/** Matches DeepSeek code generator — slug/file basename to safe identifier. */
export function toSafeVarName(str: string): string {
  const normalized = normalizeAscii(str.trim());
  const safe = normalized.replace(/[^a-zA-Z0-9]/g, "_");
  return /^(\d)/.test(safe) ? `_${safe}` : safe;
}

/** Export prefix for generated calculator modules (e.g. margin-calculator → Margin_calculator). */
export function toGeneratedExportBaseName(slug: string): string {
  const safe = toSafeVarName(slug);
  return safe.charAt(0).toUpperCase() + safe.slice(1);
}

export function generatedInputSchemaExport(slug: string): string {
  return `${toGeneratedExportBaseName(slug)}InputSchema`;
}

export function generatedCalculateExport(slug: string): string {
  return `calculate${toGeneratedExportBaseName(slug)}`;
}
