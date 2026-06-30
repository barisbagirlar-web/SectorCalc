import type { AiToolIndexDocument } from "@/lib/features/ai/tool-retrieval-types";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

const CHUNK_VERSION = "1.0";
const MAX_TEXT_LENGTH = 3200;

function resolveLocalized(record: Record<string, string>, locale: string): string {
  return record[locale as any] ?? record.en ?? record.tr ?? Object.values(record)[0] ?? "";
}

function truncate(value: string, max = MAX_TEXT_LENGTH): string {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1)}…`;
}

function buildEmbeddingText(tool: AiToolIndexDocument["tools"][number], locale: string): string {
  const keywords = ((tool.keywords as any)[locale] ?? tool.keywords.en ?? []).join(", ");
  const parts = [
    resolveLocalized(tool.title, locale),
    resolveLocalized(tool.description, locale),
    resolveLocalized(tool.categoryTitle, locale),
    tool.categorySlug,
    tool.tier,
    tool.routeStatus,
    tool.intent.join(", "),
    tool.industries.join(", "),
    keywords,
    tool.formula ?? "",
    tool.pain ?? "",
  ];
  return truncate(parts.filter(Boolean).join(". "));
}

export function buildAiEmbeddingSourceJsonl(index: AiToolIndexDocument): string {
  const requiredLocales: string[] = ["tr", "en"];
  const optionalLocales = (SUPPORTED_LOCALES as readonly string[]).filter(
    (locale) => !requiredLocales.includes(locale),
  );
  const lines: string[] = [];

  for (const tool of index.tools) {
    for (const locale of [...requiredLocales, ...optionalLocales]) {
      const title = resolveLocalized(tool.title, locale);
      if (!title.trim()) {
        continue;
      }
      lines.push(
        JSON.stringify({
          id: `tool:${tool.slug}:${locale}`,
          text: buildEmbeddingText(tool, locale),
          metadata: {
            slug: tool.slug,
            locale,
            categorySlug: tool.categorySlug,
            tier: tool.tier,
            url: tool.localeUrls[locale] ?? tool.canonicalUrl,
            routeStatus: tool.routeStatus,
            chunkVersion: CHUNK_VERSION,
          },
        }),
      );
    }
  }

  return `${lines.join("\n")}\n`;
}
