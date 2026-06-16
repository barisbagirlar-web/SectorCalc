export { validateIndustrialSchema, type IndustrialValidationResult } from "@/lib/generated-tools/validate-industrial-schema";

const LOCALES = ["en", "tr", "de", "fr", "es", "ar"] as const;

export function repairJsonText(raw: string): string {
  let text = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  if (!text) return "{}";

  try {
    JSON.parse(text);
    return text;
  } catch {
    // Truncated JSON: close open strings/brackets heuristically
    const lastBrace = text.lastIndexOf("}");
    if (lastBrace > 0) {
      const slice = text.slice(0, lastBrace + 1);
      try {
        JSON.parse(slice);
        return slice;
      } catch {
        // continue
      }
    }
    text = text.replace(/,\s*$/, "");
    const openBraces = (text.match(/{/g) ?? []).length;
    const closeBraces = (text.match(/}/g) ?? []).length;
    const openBrackets = (text.match(/\[/g) ?? []).length;
    const closeBrackets = (text.match(/]/g) ?? []).length;
    text += "]".repeat(Math.max(0, openBrackets - closeBrackets));
    text += "}".repeat(Math.max(0, openBraces - closeBraces));
    return text;
  }
}

export function hasSixLocales(i18n: unknown): boolean {
  if (!i18n || typeof i18n !== "object") {
    return false;
  }
  const map = i18n as Record<string, unknown>;
  return LOCALES.every((locale) => typeof map[locale] === "string" && map[locale].trim().length > 0);
}

export function schemaHasFullI18n(raw: Record<string, unknown>): boolean {
  const inputs = raw.inputs;
  if (!Array.isArray(inputs) || inputs.length === 0) {
    return false;
  }
  for (const input of inputs) {
    if (!input || typeof input !== "object") {
      return false;
    }
    const record = input as Record<string, unknown>;
    if (!hasSixLocales(record.label_i18n) || !hasSixLocales(record.businessContext_i18n)) {
      return false;
    }
  }
  return true;
}
