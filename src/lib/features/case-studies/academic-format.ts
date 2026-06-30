import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

const durationMap: Record<string, Record<SupportedLocale, string>> = {
  "3 months": {
    tr: "3 ay",
    en: "3 months",
    de: "3 Monate",
    fr: "3 mois",
    es: "3 meses",
    ar: "٣ أشهر",
  },
  "4 months": {
    tr: "4 ay",
    en: "4 months",
    de: "4 Monate",
    fr: "4 mois",
    es: "4 meses",
    ar: "٤ أشهر",
  },
  "5 months": {
    tr: "5 ay",
    en: "5 months",
    de: "5 Monate",
    fr: "5 mois",
    es: "5 meses",
    ar: "٥ أشهر",
  },
  "6 months": {
    tr: "6 ay",
    en: "6 months",
    de: "6 Monate",
    fr: "6 mois",
    es: "6 meses",
    ar: "٦ أشهر",
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
