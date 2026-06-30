/** SEO URL policy: generated tool slugs must end with `-calculator` (locale-neutral). */
export const CALCULATOR_SLUG_SUFFIX = "-calculator" as const;

export function isCalculatorSlug(slug: string): boolean {
  return slug.trim().endsWith(CALCULATOR_SLUG_SUFFIX);
}

export function ensureCalculatorSlug(slug: string): string {
  const normalized = slug.trim();
  if (!normalized) {
    return CALCULATOR_SLUG_SUFFIX.slice(1);
  }
  if (isCalculatorSlug(normalized)) {
    return normalized;
  }
  return `${normalized}${CALCULATOR_SLUG_SUFFIX}`;
}

export function generatedToolPathForSlug(slug: string): string {
  return `/tools/generated/${slug}`;
}
