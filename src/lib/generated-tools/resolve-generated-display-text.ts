import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";
import { formatSelectOptionLabel } from "@/lib/generated-tools/select-options";

/** Locale-aware display copy for generated schema strings (labels, helpers, actions). */
export function resolveGeneratedDisplayText(text: string, locale: string): string {
  if (!text.trim()) {
    return text;
  }
  return translateCalculatorPhrase(text, locale);
}

/** Locale-aware breakdown row / chart label from schema key + label map. */
export function resolveGeneratedBreakdownLabel(
  key: string,
  labelMap: Readonly<Record<string, string>> | undefined,
  locale: string,
): string {
  const schemaLabel = labelMap?.[key]?.trim();
  const raw =
    schemaLabel && schemaLabel !== key
      ? schemaLabel
      : key
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .replace(/^./, (char) => char.toUpperCase())
          .trim();
  return resolveGeneratedDisplayText(raw, locale);
}

/** Locale-aware primary output caption from schema breakdown map or key. */
export function resolveGeneratedPrimaryOutputCaption(
  primaryKey: string,
  labelMap: Readonly<Record<string, string>> | undefined,
  locale: string,
): string {
  const fromMap = labelMap?.[primaryKey]?.trim();
  if (fromMap) {
    return resolveGeneratedDisplayText(fromMap, locale);
  }
  return resolveGeneratedDisplayText(formatSelectOptionLabel(primaryKey), locale);
}
