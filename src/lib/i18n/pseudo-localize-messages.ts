const ACCENT_MAP: Readonly<Record<string, string>> = {
  a: "á",
  e: "é",
  i: "í",
  o: "ó",
  u: "ú",
  A: "Á",
  E: "É",
  I: "Í",
  O: "Ó",
  U: "Ú",
};

const PSEUDO_SUFFIX = " [ÇĞİŴ]";

function pseudoLocalizeString(text: string): string {
  const transformed = text
    .split("")
    .map((char) => ACCENT_MAP[char] ?? char)
    .join("");
  return `${transformed}${PSEUDO_SUFFIX}`;
}

function pseudoLocalizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return pseudoLocalizeString(value);
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const result: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    result[key] = pseudoLocalizeValue(nested);
  }
  return result;
}

export function pseudoLocalizeMessages(
  messages: Record<string, unknown>,
): Record<string, unknown> {
  return pseudoLocalizeValue(messages) as Record<string, unknown>;
}
