import { AUTHORITY_GUIDES } from "@/lib/content/authority-guides";
import { getAuthorityGuideRoutePath } from "@/lib/content/authority-links";
import { SITE_URL } from "@/lib/semantic/site-url";

export const dynamic = "force-static";
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const items = AUTHORITY_GUIDES.map((guide) => {
    const path = getAuthorityGuideRoutePath(guide.slug);
    const url = `${SITE_URL}/en${path}`;
    return `
    <item>
      <title>${escapeXml(guide.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(guide.seoDescription)}</description>
    </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SectorCalc Authority Guides</title>
    <link>${SITE_URL}/en/guides</link>
    <description>Industrial decision guides for manufacturing, cost and loss detection.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/guides/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
