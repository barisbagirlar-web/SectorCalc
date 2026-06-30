import { resolveGeneratedI18nText } from "@/lib/features/generated-tools/resolve-i18n-text";
import { resolveGeneratedToolDescription } from "@/lib/features/generated-tools/resolve-tool-display";
import type {
  GeneratedToolAboutContent,
  GeneratedToolAboutExample,
  GeneratedToolAboutFaq,
  GeneratedToolSchema,
} from "@/lib/features/generated-tools/types";

export type ResolvedToolAboutDescription = {
  readonly short: string;
  readonly long: string;
};

export type ResolvedToolAboutExample = {
  readonly title: string;
  readonly scenario: string;
  readonly steps: readonly string[];
  readonly result: string;
};

export type ResolvedToolAboutFaq = {
  readonly question: string;
  readonly answer: string;
};

export type ResolvedToolAboutContent = {
  readonly description: ResolvedToolAboutDescription;
  readonly example?: ResolvedToolAboutExample;
  readonly faqs: readonly ResolvedToolAboutFaq[];
};

function resolveAboutDescription(
  about: GeneratedToolAboutContent | undefined,
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
): ResolvedToolAboutDescription {
  const fallbackLong = resolveGeneratedToolDescription(slug, schema, locale).trim();
  const fallbackShort = about?.description.short.trim() || fallbackLong.split(/[.!?]/)[0]?.trim() || "";

  if (!about?.description) {
    return {
      short: fallbackShort,
      long: fallbackLong,
    };
  }

  const long = resolveGeneratedI18nText(
    about.description.long_i18n,
    locale,
    about.description.long,
  ).trim();
  const short = resolveGeneratedI18nText(
    about.description.short_i18n,
    locale,
    about.description.short,
  ).trim();

  return {
    short: short || fallbackShort,
    long: long || fallbackLong,
  };
}

function resolveAboutExample(
  example: GeneratedToolAboutExample | undefined,
  locale: string,
): ResolvedToolAboutExample | undefined {
  if (!example) {
    return undefined;
  }

  const title = resolveGeneratedI18nText(example.title_i18n, locale, example.title).trim();
  const scenario = resolveGeneratedI18nText(example.scenario_i18n, locale, example.scenario).trim();
  const result = resolveGeneratedI18nText(example.result_i18n, locale, example.result).trim();
  const localizedSteps = example.steps_i18n?.[locale as keyof typeof example.steps_i18n];
  const steps =
    Array.isArray(localizedSteps) && localizedSteps.length > 0
      ? localizedSteps.map((step) => step.trim()).filter(Boolean)
      : example.steps.map((step) => step.trim()).filter(Boolean);

  if (!title || !scenario || steps.length === 0 || !result) {
    return undefined;
  }

  return { title, scenario, steps, result };
}

function resolveAboutFaqs(
  faqs: readonly GeneratedToolAboutFaq[] | undefined,
  locale: string,
): readonly ResolvedToolAboutFaq[] {
  if (!faqs || faqs.length === 0) {
    return [];
  }

  return faqs
    .map((faq) => {
      const question = resolveGeneratedI18nText(faq.question_i18n, locale, faq.question).trim();
      const answer = resolveGeneratedI18nText(faq.answer_i18n, locale, faq.answer).trim();
      if (!question || !answer) {
        return null;
      }
      return { question, answer };
    })
    .filter((faq): faq is ResolvedToolAboutFaq => faq !== null);
}

export function resolveGeneratedToolAboutContent(
  slug: string,
  schema: GeneratedToolSchema,
  locale: string,
): ResolvedToolAboutContent {
  const description = resolveAboutDescription(schema.about, slug, schema, locale);
  const example = resolveAboutExample(schema.about?.example, locale);
  const faqs = resolveAboutFaqs(schema.about?.faqs, locale);

  return {
    description,
    example,
    faqs,
  };
}
