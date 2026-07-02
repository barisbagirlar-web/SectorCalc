export function normalizeAiQuery(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[–-−-]/g, " ")
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
