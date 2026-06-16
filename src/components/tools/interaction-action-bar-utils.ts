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

export function getCurrentUrl(fallbackUrl?: string): string {
  if (typeof window !== "undefined" && window.location.href) {
    return window.location.href;
  }
  return fallbackUrl ?? "";
}

export function buildEmbedCode(embedUrl: string, title: string): string {
  const safeTitle = title.replace(/"/g, "&quot;");
  return `<iframe src="${embedUrl}" width="100%" height="640" loading="lazy" title="${safeTitle}"></iframe>`;
}

export function buildQuoteText(
  title: string,
  siteName: string,
  url: string,
  excerpt?: string,
  selectedText?: string,
): string {
  if (selectedText?.trim()) {
    return `"${selectedText.trim()}"\n— ${title}\n${url}`;
  }

  if (excerpt?.trim()) {
    return `"${title}" — ${excerpt.trim()}\n— ${siteName}\n${url}`;
  }

  return `"${title}" — ${siteName}\n${url}`;
}

export function openShareWindow(url: string): void {
  if (typeof window === "undefined") {
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer,width=640,height=480");
}

const EXTERNAL_SHARE_PLATFORMS = new Set<SharePlatform>([
  "facebook",
  "x",
  "linkedin",
  "pinterest",
  "reddit",
]);

export function isExternalSharePlatform(platform: SharePlatform): boolean {
  return EXTERNAL_SHARE_PLATFORMS.has(platform);
}

export function buildShareUrl(
  platform: SharePlatform,
  pageUrl: string,
  title: string,
): string | null {
  const trimmedUrl = pageUrl.trim();
  if (!trimmedUrl) {
    return null;
  }

  const encodedUrl = encodeURIComponent(trimmedUrl);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "x":
      return `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "pinterest":
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
    case "reddit":
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    default:
      return null;
  }
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

export function getSelectedPageText(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const selection = window.getSelection()?.toString().trim();
  return selection || undefined;
}
