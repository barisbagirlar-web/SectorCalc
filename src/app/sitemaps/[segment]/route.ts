/**
 * Dynamic segment sitemaps — one handler serves all 6 segments.
 *
 * Rules applied to ALL segments:
 * - Domain: www.sectorcalc.com  (never web.app)
 * - No hreflang  (single-language EN)
 * - No lastmod  (real dates require per-item tracking)
 * - No /pricing?tool=...  (thin/duplicate — excluded)
 * - No .json / .txt / .jsonl  (not HTML)
 */

import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { getAuthorityGuideRoutePath } from "@/lib/content/authority-links";
import { listCaseStudySlugs } from "@/lib/case-studies/case-study-registry";
import { listGlobalCategories } from "@/lib/catalog/global-tool-category-taxonomy";
import { buildCategorizedToolIndex } from "@/lib/catalog/build-categorized-tool-index";
import { listProgrammaticSeoSlugs } from "@/lib/seo/programmatic-seo-pages";
import { listPremiumToolSeoLandingSlugs } from "@/lib/seo/premium-tool-seo-landings";

const DOMAIN = "https://www.sectorcalc.com";

type Entry = { path: string };

/* ─── static pages ─────────────────────────────────────────── */

const STATIC_PAGES: Entry[] = [
  { path: "/" },
  { path: "/categories" },
  { path: "/free-tools" },
  { path: "/premium-tools" },
  { path: "/industries" },
  { path: "/how-it-works" },
  { path: "/calculator-library" },
  { path: "/case-studies" },
  { path: "/for-consultants" },
  { path: "/pricing" },
  { path: "/beta-partner" },
  { path: "/developer-showcase" },
  { path: "/investor-demo" },
  { path: "/operating-system" },
  { path: "/disclaimer" },
  { path: "/privacy" },
  { path: "/terms" },
];

/* ─── free tools ───────────────────────────────────────────── */

function getFreeToolEntries(): Entry[] {
  const index = buildCategorizedToolIndex();
  const seen = new Set<string>();
  const entries: Entry[] = [];

  for (const item of index) {
    if (
      item.tier === "free" &&
      item.publicStatus === "active" &&
      item.routePath !== null &&
      item.routePath.startsWith("/tools/free/") &&
      !seen.has(item.routePath)
    ) {
      seen.add(item.routePath);
      entries.push({ path: item.routePath });
    }
  }

  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

/* ─── premium-tool category hub pages ──────────────────────── */

function getPremiumToolEntries(): Entry[] {
  return listGlobalCategories().map((cat) => ({
    path: `/premium-tools/${cat.slug}`,
  }));
}

/* ─── SEO landings ─────────────────────────────────────────── */

function getSeoEntries(): Entry[] {
  const a = listProgrammaticSeoSlugs();
  const b = listPremiumToolSeoLandingSlugs();
  const slugs = new Set([...a, ...b]);
  return Array.from(slugs)
    .sort((x, y) => x.localeCompare(y))
    .map((slug) => ({ path: `/seo/${slug}` }));
}

/* ─── guides ───────────────────────────────────────────────── */

function getGuideEntries(): Entry[] {
  return Array.from(listAuthorityGuideSlugs())
    .sort((a, b) => a.localeCompare(b))
    .map((slug) => ({ path: getAuthorityGuideRoutePath(slug) }));
}

/* ─── case studies ─────────────────────────────────────────── */

function getCaseStudyEntries(): Entry[] {
  const slugs = Array.from(listCaseStudySlugs()).sort((a, b) =>
    a.localeCompare(b),
  );
  return [
    { path: "/case-studies" },
    ...slugs.map((slug) => ({ path: `/case-studies/${slug}` })),
  ];
}

/* ─── router ────────────────────────────────────────────────── */

const SEGMENT_LOADERS: Record<string, () => Entry[]> = {
  pages: () => STATIC_PAGES,
  tools: getFreeToolEntries,
  "premium-tools": getPremiumToolEntries,
  seo: getSeoEntries,
  guides: getGuideEntries,
  "case-studies": getCaseStudyEntries,
};

export function GET(
  _request: Request,
  { params }: { params: { segment: string } },
): Response {
  const segment = params.segment.replace(/\.xml$/, "");
  const loader = SEGMENT_LOADERS[segment];

  if (!loader) {
    return new Response("Not Found", { status: 404 });
  }

  const entries = loader();

  const urls = entries
    .map((e) => `  <url><loc>${DOMAIN}${e.path}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
