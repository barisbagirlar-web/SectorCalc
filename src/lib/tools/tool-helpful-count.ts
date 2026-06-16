export type ToolHelpfulCountTier = "free" | "premium";
export type ToolHelpfulVote = "up" | "down" | null;

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

export function resolveToolHelpfulCount(slug: string, tier: ToolHelpfulCountTier): number {
  const normalizedSlug = slug.trim().toLowerCase();
  const hash = hashSlug(normalizedSlug);

  if (tier === "premium") {
    const span = PREMIUM_HELPFUL_MAX - PREMIUM_HELPFUL_MIN + 1;
    return PREMIUM_HELPFUL_MIN + (hash % span);
  }

  const span = FREE_HELPFUL_MAX - FREE_HELPFUL_MIN + 1;
  return FREE_HELPFUL_MIN + (hash % span);
}

/** Apply a helpful vote transition to the current displayed count. */
export function applyToolHelpfulVote(
  currentCount: number,
  currentVote: ToolHelpfulVote,
  nextVote: "up" | "down",
): { readonly count: number; readonly vote: ToolHelpfulVote } {
  if (nextVote === currentVote) {
    return { count: currentCount, vote: currentVote };
  }

  if (nextVote === "up") {
    const delta = currentVote === "down" ? 2 : 1;
    return { count: currentCount + delta, vote: "up" };
  }

  const delta = currentVote === "up" ? 2 : 1;
  return { count: currentCount - delta, vote: "down" };
}

/** Undo the active vote without changing historical session totals. */
export function clearToolHelpfulVote(
  currentCount: number,
  currentVote: ToolHelpfulVote,
): { readonly count: number; readonly vote: ToolHelpfulVote } {
  if (currentVote === "up") {
    return { count: currentCount - 1, vote: null };
  }
  if (currentVote === "down") {
    return { count: currentCount + 1, vote: null };
  }
  return { count: currentCount, vote: null };
}

export function clampHelpfulCount(count: number): number {
  return Math.max(1, count);
}

export function getToolHelpfulVoteStorageKey(slug: string): string {
  return `sc-tool-helpful-vote:${slug.trim().toLowerCase()}`;
}

export function formatHelpfulCountDisplay(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

export function formatInteractionLikeCount(value: number): string {
  if (value < 1000) {
    return String(value);
  }

  const thousands = value / 1000;
  if (Number.isInteger(thousands)) {
    return `${thousands}K`;
  }

  const rounded = Math.round(thousands * 10) / 10;
  return `${rounded}K`;
}
