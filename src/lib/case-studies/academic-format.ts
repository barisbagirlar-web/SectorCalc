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
