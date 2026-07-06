// SectorCalc V5.3.1 — Free Tools Catalog Page
// Root-only route. Lists all free V5.3.1 calculators.
// Same design as /pro-tools using CatalogPageShell.
// No locale prefix. Pure technical English.

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { freeV531FormulaRegistry } from "@/sectorcalc/formulas/free-v531";
import { ACTIVE_FREE_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import {
  buildTaxonomySectorCards,
  withTaxonomyCountLabels,
} from "@/lib/features/tools/build-taxonomy-sector-cards";
import { SLUG_TOKEN_SECTOR_HINTS, SECTORS } from "@/lib/features/tools/taxonomy";
import type { ToolListItem } from "@/lib/features/tools/getToolsByCategory";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/features/tools/filter-catalog-hub-tools";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free Industrial Calculators | SectorCalc",
  description:
    "Browse 50 free industrial calculators across machining, metal, energy, finance, logistics, and more. Browser-first, privacy-safe, decision-support tools.",
  robots: { index: true, follow: true },
};

// ─── Sector mapping from free tool slug tokens ─────────────────────────────

const KNOWN_FREE_SECTOR_EXACT: Record<string, string> = {
  // Machining
  machining: "makine",
  cnc: "makine",
  cutting: "makine",
  tap: "makine",
  drill: "makine",
  tolerance: "makine",
  surface: "makine",
  roughness: "makine",
  material: "makine",
  removal: "makine",
  knurling: "makine",
  thread: "makine",
  rpm: "makine",
  feed: "makine",

  // Metal & Welding
  weld: "metal",
  welding: "metal",
  fillet: "metal",
  bolt: "metal",
  torque: "metal",
  preload: "metal",
  clamp: "metal",
  steel: "metal",
  beam: "metal",
  load: "metal",
  deflection: "metal",
  sheet: "metal",
  bend: "metal",
  allowance: "metal",

  // Quality & Efficiency
  scrap: "istatistik",
  rework: "istatistik",
  oee: "istatistik",
  downtime: "istatistik",
  takt: "istatistik",
  setup: "istatistik",
  balancing: "istatistik",
  efficiency: "istatistik",
  quality: "istatistik",

  // Energy
  compressed: "enerji",
  air: "enerji",
  electric: "enerji",
  motor: "enerji",
  running: "enerji",

  // Environment & Carbon
  cbam: "cevre",
  electricity: "cevre",
  co2: "cevre",
  diesel: "cevre",
  fuel: "cevre",
  carbon: "cevre",
  emission: "cevre",
  footprint: "cevre",
  environment: "cevre",

  // Finance
  employee: "finans",
  quote: "finans",
  margin: "finans",
  markup: "finans",
  payment: "finans",
  term: "finans",
  investment: "finans",
  payback: "finans",
  profitability: "finans",
  currency: "finans",
  pricing: "finans",

  // Logistics
  eoq: "lojistik",
  safety: "lojistik",
  stock: "lojistik",
  reorder: "lojistik",
  inventory: "lojistik",
  carrying: "lojistik",
  pallet: "lojistik",
  container: "lojistik",
  cbm: "lojistik",
  freight: "lojistik",
  shipping: "lojistik",

  // Construction
  concrete: "insaat",
  rebar: "insaat",

  // Food
  recipe: "gida",
  menu: "gida",

  // Textile
  fabric: "tekstil",
  consumption: "tekstil",
  gsm: "tekstil",
  textile: "tekstil",
};

const TAXONOMY_SECTOR_IDS = new Set(SECTORS.map((s) => s.id));

function resolveFreeSectorKey(toolKey: string): string {
  const tokens = toolKey.split("-");
  for (const token of tokens) {
    if (KNOWN_FREE_SECTOR_EXACT[token]) {
      return KNOWN_FREE_SECTOR_EXACT[token];
    }
    const hint = SLUG_TOKEN_SECTOR_HINTS[token];
    if (hint && TAXONOMY_SECTOR_IDS.has(hint)) {
      return hint;
    }
  }
  return "diger";
}

// ─── Convert free formula module to ToolListItem ──────────────────────────

function freeFormulaToToolListItem(
  toolKey: string,
  toolName: string,
): ToolListItem {
  const sectorKey = resolveFreeSectorKey(toolKey);
  return {
    slug: toolKey,
    name: toolName,
    title: toolName,
    tier: "free",
    href: `/tools/free/${toolKey}`,
    isPremium: false,
    categorySlug: "free-tools",
    sectorKey,
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function FreeToolsCatalogPage() {
  const locale = "en";

  // Build tool list from formula registry, excluding removed tools (404 routes)
  const removedSlugs = new Set(["break-even-point"]);
  const tools: ToolListItem[] = [];

  for (const [toolKey, formula] of Object.entries(freeV531FormulaRegistry)) {
    if (removedSlugs.has(toolKey)) continue;
    tools.push(freeFormulaToToolListItem(toolKey, formula.toolName));
  }

  // Add the active allowlisted break-even tool (separate from registry)
  const activeFreeSlugs = new Set(ACTIVE_FREE_TOOL_SLUGS);
  for (const slug of activeFreeSlugs) {
    if (slug === "break-even-and-margin-of-safety-analysis") {
      tools.push(
        freeFormulaToToolListItem(
          slug,
          "Break-Even & Margin of Safety Analysis",
        ),
      );
    }
  }

  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, {
      allLabel: "All Free Tools",
    }),
    (toolCount) => `${toolCount} tools`,
  );

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { name: "Free Tools", path: "/free-tools" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      tools.slice(0, CATALOG_HUB_JSONLD_MAX_ITEMS).map((tool) => ({
        name: tool.title,
        path: tool.href,
      })),
      "Free Industrial Calculators",
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <CatalogPageShell
          tools={tools}
          sectors={taxonomySectorCards}
          title="Free Industrial Calculators"
          subtitle={`${tools.length} browser-first, privacy-safe calculators across industrial engineering domains. Formula-free decision support.`}
          searchPlaceholder="Search free calculators..."
          categoryTitle="Industry sectors"
          proToolsHref="/pricing"
        />
      </section>
    </PageLayout>
  );
}
