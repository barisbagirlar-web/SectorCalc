import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

const durationMap: Record<string, Record<SupportedLocale, string>> = {
  "3 months": {
    en: "3 months",
  },
  "4 months": {
    en: "4 months",
  },
  "5 months": {
    en: "5 months",
  },
  "6 months": {
    en: "6 months",
  },
};

export function getLocalizedDuration(durationKey: string, locale: string): string {
  const localized = durationMap[durationKey]?.[locale as SupportedLocale];
  return localized ?? durationKey;
}

/** Render case study body copy as paragraphs or sanitized rich HTML. */
export function renderCaseStudyBodyContent(text: string): {
  readonly mode: "html" | "paragraphs";
  readonly html?: string;
  readonly paragraphs?: readonly string[];
} {
  const trimmed = text.trim();
  if (!trimmed) {
    return { mode: "paragraphs", paragraphs: [] };
  }
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return { mode: "html", html: trimmed };
  }
  return {
    mode: "paragraphs",
    paragraphs: splitAcademicParagraphs(trimmed),
  };
}

export function splitAcademicParagraphs(text: string): readonly string[] {
  return text
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function formatAcademicDate(value: string, locale: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
