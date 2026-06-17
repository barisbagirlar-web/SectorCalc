import type { JsonGuardResult } from "@/lib/ai/deepseek/deepseek-json-guard";
import type { CaseStudyFormValues } from "@/lib/case-studies/case-study-drafts";
import type {
  CaseStudy,
  CaseStudyResult,
  CaseStudyTestimonial,
  PublishedCaseStudyLocaleContent,
} from "@/lib/case-studies/types";
import {
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/i18n/locale-config";

export type CaseStudyLocalePack = Readonly<Record<SupportedLocale, PublishedCaseStudyLocaleContent>>;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readResults(value: unknown): CaseStudyResult[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry): CaseStudyResult | null => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const record = entry as Record<string, unknown>;
      const metric = readString(record.metric) || readString(record.label);
      const before = readString(record.before);
      const after = readString(record.after);
      if (!metric && !before && !after) {
        return null;
      }
      return { metric, before, after };
    })
    .filter((row): row is CaseStudyResult => row !== null);
}

function readTestimonial(value: unknown): CaseStudyTestimonial | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const record = value as Record<string, unknown>;
  const quote = readString(record.quote) || readString(record.testimonial);
  const author = readString(record.author);
  const title = readString(record.title) || readString(record.authorTitle);
  const company = readString(record.company);
  if (!quote && !author && !title && !company) {
    return undefined;
  }
  return { quote, author, title, company };
}

function readLocaleContent(value: unknown): PublishedCaseStudyLocaleContent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const record = value as Record<string, unknown>;
  const title = readString(record.title);
  if (!title) {
    return null;
  }
  return {
    title,
    subtitle: readString(record.subtitle),
    industry: readString(record.industry),
    challenge: readString(record.challenge),
    solution: readString(record.solution),
    results: readResults(record.results),
    testimonial: readTestimonial(record.testimonial),
  };
}

export function formValuesToLocaleContent(values: CaseStudyFormValues): PublishedCaseStudyLocaleContent {
  const results = values.results.filter(
    (row) => row.metric.trim() || row.before.trim() || row.after.trim(),
  );
  const hasTestimonial =
    values.testimonialQuote.trim() ||
    values.testimonialAuthor.trim() ||
    values.testimonialTitle.trim() ||
    values.testimonialCompany.trim();

  return {
    title: values.title.trim(),
    subtitle: values.subtitle.trim(),
    industry: values.industry.trim(),
    challenge: values.challenge.trim(),
    solution: values.solution.trim(),
    results,
    testimonial: hasTestimonial
      ? {
          quote: values.testimonialQuote.trim(),
          author: values.testimonialAuthor.trim(),
          title: values.testimonialTitle.trim(),
          company: values.testimonialCompany.trim(),
        }
      : undefined,
  };
}

export function applyCaseStudyLocalePack(
  study: CaseStudy,
  locale: string,
  pack: CaseStudyLocalePack | undefined,
): CaseStudy {
  if (!pack) {
    return study;
  }

  const resolvedLocale = isSupportedLocale(locale) ? locale : "en";
  const localized = pack[resolvedLocale] ?? pack.en;
  if (!localized) {
    return study;
  }

  return {
    ...study,
    title: localized.title || study.title,
    subtitle: localized.subtitle || study.subtitle,
    industry: localized.industry || study.industry,
    challenge: localized.challenge || study.challenge,
    solution: localized.solution || study.solution,
    results: localized.results.length > 0 ? localized.results : study.results,
    testimonial: localized.testimonial ?? study.testimonial,
  };
}

export function parseCaseStudyLocalePack(value: unknown): CaseStudyLocalePack | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const pack = {} as Record<SupportedLocale, PublishedCaseStudyLocaleContent>;

  for (const locale of SUPPORTED_LOCALES) {
    const content = readLocaleContent(record[locale]);
    if (!content) {
      return undefined;
    }
    pack[locale] = content;
  }

  return pack;
}

export function validateCaseStudyLocalePack(parsed: unknown): JsonGuardResult<CaseStudyLocalePack> {
  const pack = parseCaseStudyLocalePack(parsed);
  if (!pack) {
    return {
      ok: false,
      reason: "missing_keys",
      message: "Locale pack must include all six locales with title fields.",
    };
  }
  return { ok: true, data: pack };
}

export function buildUniformLocalePack(
  content: PublishedCaseStudyLocaleContent,
): CaseStudyLocalePack {
  return SUPPORTED_LOCALES.reduce(
    (accumulator, locale) => ({
      ...accumulator,
      [locale]: {
        title: content.title,
        subtitle: content.subtitle,
        industry: content.industry,
        challenge: content.challenge,
        solution: content.solution,
        results: content.results.map((row) => ({ ...row })),
        testimonial: content.testimonial ? { ...content.testimonial } : undefined,
      },
    }),
    {} as Record<SupportedLocale, PublishedCaseStudyLocaleContent>,
  ) as CaseStudyLocalePack;
}
