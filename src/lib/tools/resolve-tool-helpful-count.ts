const FREE_HELPFUL_MIN = 1890;
const FREE_HELPFUL_MAX = 15000;
const PREMIUM_HELPFUL_MIN = 97;
const PREMIUM_HELPFUL_MAX = 4897;

function hashSlug(slug: string): number {
  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function resolveToolHelpfulCount(slug: string, isPremium: boolean): number {
  const normalizedSlug = slug.trim().toLowerCase();
  const min = isPremium ? PREMIUM_HELPFUL_MIN : FREE_HELPFUL_MIN;
  const max = isPremium ? PREMIUM_HELPFUL_MAX : FREE_HELPFUL_MAX;
  const span = max - min + 1;
  return min + (hashSlug(normalizedSlug) % span);
}

export function formatToolHelpfulCount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
}
