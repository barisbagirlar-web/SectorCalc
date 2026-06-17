import { callDeepSeekJson } from "@/lib/ai/deepseek/deepseek-client";
import {
  buildUniformLocalePack,
  validateCaseStudyLocalePack,
  type CaseStudyLocalePack,
} from "@/lib/case-studies/case-study-locale-pack";
import type { PublishedCaseStudyLocaleContent } from "@/lib/case-studies/types";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/locale-config";

function buildTranslationPrompt(
  source: PublishedCaseStudyLocaleContent,
  sourceLocale: SupportedLocale,
): string {
  const payload = JSON.stringify(
    {
      title: source.title,
      subtitle: source.subtitle,
      industry: source.industry,
      challenge: source.challenge,
      solution: source.solution,
      results: source.results,
      testimonial: source.testimonial ?? null,
    },
    null,
    2,
  );

  const localeList = SUPPORTED_LOCALES.join(", ");

  return `You are an industrial engineering case-study localization engine.

Translate the SOURCE case-study content into ALL of these locales: ${localeList}.
Source locale: ${sourceLocale}.

Return ONLY valid JSON shaped as:
{
  "en": { "title", "subtitle", "industry", "challenge", "solution", "results": [{ "metric", "before", "after" }], "testimonial": { "quote", "author", "title", "company" } | null },
  "tr": { ... },
  "de": { ... },
  "fr": { ... },
  "es": { ... },
  "ar": { ... }
}

RULES:
- Preserve numbers, percentages, currency amounts, and tool slugs exactly.
- Keep author names and company names unless a natural localized form is standard.
- Each locale block must be fully populated.
- Industrial tone; no marketing fluff.
- testimonial may be null if source has no quote.

SOURCE JSON:
${payload}`;
}

export type TranslateCaseStudyLocalePackResult =
  | { readonly ok: true; readonly pack: CaseStudyLocalePack }
  | { readonly ok: false; readonly errorCode: "missing_api_key" | "translation_failed"; readonly message?: string };

export async function translateCaseStudyLocalePack(
  source: PublishedCaseStudyLocaleContent,
  sourceLocale: SupportedLocale,
): Promise<TranslateCaseStudyLocalePackResult> {
  if (!source.title.trim()) {
    return { ok: false, errorCode: "translation_failed", message: "Title is required for translation." };
  }

  const result = await callDeepSeekJson(
    "content_draft",
    [
      {
        role: "system",
        content:
          "You localize industrial case studies. Output only valid JSON with keys en, tr, de, fr, es, ar.",
      },
      { role: "user", content: buildTranslationPrompt(source, sourceLocale) },
    ],
    validateCaseStudyLocalePack,
  );

  if (!result.ok) {
    return {
      ok: false,
      errorCode: result.errorCode === "missing_api_key" ? "missing_api_key" : "translation_failed",
      message: result.message,
    };
  }

  return { ok: true, pack: result.data };
}

/** Fallback when DeepSeek is unavailable — duplicate source into all locales. */
export function fallbackLocalePackFromSource(
  source: PublishedCaseStudyLocaleContent,
): CaseStudyLocalePack {
  return buildUniformLocalePack(source);
}
