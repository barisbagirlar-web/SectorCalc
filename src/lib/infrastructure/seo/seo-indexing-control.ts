/**
 * SectorCalc - indexability control
 * ==================================
 * Site fully open to search engine indexing. All blocking signals removed.
 * Every page serves index,follow meta + X-Robots-Tag: all + robots.txt allow.
 */

/* ----------------------------- Core flag ----------------------------- */

/** Always true - site is fully indexable with no env gate. */
export function isIndexable(): boolean {
  return true;
}

/* ----------------------------- Robots header ----------------------------- */

/** Value for the X-Robots-Tag response header. */
export const X_ROBOTS_TAG_HEADER = "X-Robots-Tag";
export function xRobotsTagValue(): string {
  return "all";
}

/**
 * Next.js metadata.robots object. Always index,follow.
 */
export function metadataRobots() {
  return {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" as const, "max-snippet": -1 },
  };
}

/* ----------------------------- robots.txt ----------------------------- */

const SITE_URL = "https://sectorcalc.com";

const AI_AND_SEARCH_AGENTS = [
  "Googlebot",
  "Bingbot",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Applebot",
  "Applebot-Extended",
];

/**
 * Generate robots.txt. Full allow for search + AI agents, Disallow only
 * non-public paths (/api/, /admin/, duplicate sort params).
 */
export function generateRobotsTxt(): string {
  const blocks = AI_AND_SEARCH_AGENTS.map((ua) => `User-agent: ${ua}\nAllow: /`);
  return [
    ...blocks,
    "",
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /admin/",
    "Disallow: /verification-queue/",
    "Disallow: /verification-queue",
    "Disallow: /*?*sort=",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL}`,
    "",
    "# LLM references",
    `# ${SITE_URL}/llms.txt`,
    `# ${SITE_URL}/llms-full.txt`,
  ].join("\n");
}

/* ----------------------------- Sitemap guard ----------------------------- */

/** Always serve the sitemap - site is fully indexable. */
export function shouldServeSitemap(): boolean {
  return true;
}

/* ----------------------------- IndexNow (search fan-out) ----------------------------- */

/**
 * Ping IndexNow (Bing, Yandex, others) on content updates.
 */
export async function pingIndexNow(urls: string[], key: string): Promise<boolean> {
  if (urls.length === 0) return false;
  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
