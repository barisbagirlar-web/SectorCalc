const TR_CHAR_MAP: Readonly<Record<string, string>> = {
  g: "g",
  G: "G",
  u: "u",
  U: "U",
  s: "s",
  S: "S",
  i: "i",
  I: "I",
  o: "o",
  O: "O",
  c: "c",
  C: "C",
};

export function normalizeAscii(str: string): string {
  return str.replace(/[gGuUsSiIoOcC]/g, (char) => TR_CHAR_MAP[char] ?? char);
}

/** Matches DeepSeek code generator - slug/file basename to safe identifier. */
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
