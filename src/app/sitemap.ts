import type { MetadataRoute } from "next";
import { listAuthorityGuideSlugs } from "@/lib/content/authority-guides";
import { getAuthorityGuideRoutePath } from "@/lib/content/authority-links";
import { listCaseStudySlugs } from "@/lib/case-studies/case-study-registry";
import { listGlobalCategories } from "@/lib/catalog/global-tool-category-taxonomy";
import { buildCategorizedToolIndex } from "@/lib/catalog/build-categorized-tool-index";
import { listProgrammaticSeoSlugs } from "@/lib/seo/programmatic-seo-pages";
import { listPremiumToolSeoLandingSlugs } from "@/lib/seo/premium-tool-seo-landings";

const DOMAIN = "https://www.sectorcalc.com";

type Entry = { path: string };

/**
 * Sitemap — clean, production-quality.
 *
 * FIXES vs the old broken sitemap (674 entries, rejected by Google):
 * - Domain: www.sectorcalc.com   (was sectorcalc-bf412.web.app)
 * - No /pricing?tool=...         (~190 thin duplicate entries removed)
 * - No AI manifest files          (7 .json/.txt/.jsonl — not HTML)
 * - No hreflang                   (single-language EN site)
 * - No lastmod                    (avoid fake timestamps)
 * - Proper count: ~475 clean URLs (was 674 with 199 junk)
 */

/* ─── static pages ─────────────────────────────────────────── */

const STATIC_PATHS: Entry[] = [
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

function getFreeToolPaths(): Entry[] {
  const index = buildCategorizedToolIndex();
  const seen = new Set<string>();
  const paths: Entry[] = [];

  for (const item of index) {
    if (
      item.tier === "free" &&
      item.publicStatus === "active" &&
      item.routePath !== null &&
      item.routePath.startsWith("/tools/free/") &&
      !seen.has(item.routePath)
    ) {
      seen.add(item.routePath);
      paths.push({ path: item.routePath });
    }
  }

  return paths.sort((a, b) => a.path.localeCompare(b.path));
}

/* ─── premium-tool category hub pages ──────────────────────── */

function getPremiumToolPaths(): Entry[] {
  return listGlobalCategories().map((cat) => ({
    path: `/premium-tools/${cat.slug}`,
  }));
}

/* ─── SEO landings ─────────────────────────────────────────── */

function getSeoPaths(): Entry[] {
  const slugs = new Set([
    ...listProgrammaticSeoSlugs(),
    ...listPremiumToolSeoLandingSlugs(),
  ]);
  return Array.from(slugs)
    .sort((x, y) => x.localeCompare(y))
    .map((slug) => ({ path: `/seo/${slug}` }));
}

/* ─── guides ───────────────────────────────────────────────── */

function getGuidePaths(): Entry[] {
  return Array.from(listAuthorityGuideSlugs())
    .sort((a, b) => a.localeCompare(b))
    .map((slug) => ({ path: getAuthorityGuideRoutePath(slug) }));
}

/* ─── case studies ─────────────────────────────────────────── */

function getCaseStudyPaths(): Entry[] {
  const slugs = Array.from(listCaseStudySlugs()).sort((a, b) =>
    a.localeCompare(b),
  );
  return [
    { path: "/case-studies" },
    ...slugs.map((slug) => ({ path: `/case-studies/${slug}` })),
  ];
}

/* ─── sitemap generator ────────────────────────────────────── */

export default function sitemap(): MetadataRoute.Sitemap {
  const all: Entry[] = [
    ...STATIC_PATHS,
    ...getFreeToolPaths(),
    ...getPremiumToolPaths(),
    ...getSeoPaths(),
    ...getGuidePaths(),
    ...getCaseStudyPaths(),
  ];

  return all.map((entry) => ({
    url: `${DOMAIN}${entry.path}`,
  }));
}
