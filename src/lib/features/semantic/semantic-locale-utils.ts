import { SEMANTIC_LOCALES, type SemanticLocale, type SemanticLocaleRecord } from "@/lib/features/semantic/tool-semantic-types";

export function fillLocaleRecord(build: (locale: SemanticLocale) => string): SemanticLocaleRecord {
  const record: SemanticLocaleRecord = {};
  for (const locale of SEMANTIC_LOCALES) {
    const value = build(locale).trim();
    record[locale] = value.length > 0 ? value : build("en");
  }
  return record;
}

export function pickLocaleText(record: SemanticLocaleRecord, locale: string): string {
  return record[locale] ?? record.en ?? Object.values(record)[0] ?? "";
}
