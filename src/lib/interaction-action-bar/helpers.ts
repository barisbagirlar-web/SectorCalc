export type SharePlatform =
  | "copy"
  | "facebook"
  | "x"
  | "linkedin"
  | "pinterest"
  | "reddit"
  | "embed"
  | "quote";

export function formatCount(value: number | string): string {
  if (typeof value === "string") {
    return value;
  }
  if (!Number.isFinite(value)) {
    return "0";
  }
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return String(Math.round(value));
}

export function getCurrentUrl(fallbackUrl?: string): string {
  if (typeof window !== "undefined" && window.location.href) {
    return window.location.href;
  }
  return fallbackUrl ?? "";
}

export function openShareWindow(url: string): void {
  if (typeof window === "undefined") {
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

export function buildShareUrl(
  platform: Exclude<SharePlatform, "copy" | "embed" | "quote">,
  pageUrl: string,
  title: string,
): string {
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "pinterest":
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
    case "reddit":
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    default:
      return pageUrl;
  }
}

export function buildEmbedCode(embedUrl: string, title: string): string {
  return `<iframe src="${embedUrl}" width="100%" height="640" loading="lazy" title="${title}"></iframe>`;
}

export function buildQuoteText(
  title: string,
  siteName: string,
  pageUrl: string,
  excerpt?: string,
  selectedText?: string,
): string {
  const body = selectedText?.trim() || excerpt?.trim() || title;
  return `"${body}" — ${siteName}\n${pageUrl}`;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
