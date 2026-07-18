/**
 * SectorCalc - indexability control
 * ==================================
 * Site fully open to search engine indexing. All blocking signals removed.
 * Every page serves index,follow meta + X-Robots-Tag: all + robots.txt allow.
 *
 * NOTE: robots.txt generation lives in `./robots-txt.ts` (re-exported below).
 * It must NOT be imported here because this module is pulled into the
 * next.config.ts transpilation chain, which cannot resolve the
 * ai-crawler-policy dependency at config-load time.
 */

/* ----------------------------- Core flag ----------------------------- */

/** Always true - site is fully indexable with no env gate. */
export function isIndexable(): boolean {
  return true;
}

/* ----------------------------- Robots header ----------------------------- */

/** Value for the X-Robots-Tag response header.
 *  max-snippet:-1 = no character limit on search snippets
 *  max-image-preview:large = full-size image preview allowed */
export const X_ROBOTS_TAG_HEADER = "X-Robots-Tag";
export function xRobotsTagValue(): string {
  return "index, follow, max-snippet:-1, max-image-preview:large";
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

// robots.txt generation: import `generateRobotsTxt` from `./robots-txt`.
// It is intentionally NOT re-exported here to keep the ai-crawler-policy
// dependency out of the next.config.ts transpilation chain.

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
