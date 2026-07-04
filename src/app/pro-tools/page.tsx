// SectorCalc V5.3.1 — PRO Tools Catalog Page
// Root-only route. Lists all 135 PRO calculators.
// Same design as /free-tools using CatalogPageShell.
// No locale prefix. Pure technical English.

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { getAllProToolSchemas } from "@/sectorcalc/runtime/pro-schema-loader";
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import {
  buildTaxonomySectorCards,
  withTaxonomyCountLabels,
} from "@/lib/features/tools/build-taxonomy-sector-cards";
import { SLUG_TOKEN_SECTOR_HINTS, SECTORS } from "@/lib/features/tools/taxonomy";
import type { ToolListItem } from "@/lib/features/tools/getToolsByCategory";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/features/tools/filter-catalog-hub-tools";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PRO Industrial Calculators | SectorCalc",
  description:
    "Access 135 PRO industrial calculators for structural, manufacturing, energy, quality, logistics, and food service decision support. Deterministic, auditable, server-side execution.",
  robots: { index: true, follow: true },
};

// ─── Sector mapping from PRO tool_key tokens ───────────────────────────────

const KNOWN_SECTOR_EXACT: Record<string, string> = {
  // Manual overrides for PRO tool_key → sector ID
  eurocode: "yapisal-muhendislik",
  steel: "metal",
  welding: "metal",
  weld: "metal",
  cnc: "makine",
  laser: "makine",
  crane: "makine",
  press: "makine",
  hydraulic: "makine",
  injection: "plastik",
  mold: "plastik",
  painting: "kimya",
  paint: "kimya",
  powder: "kimya",
  coating: "kimya",
  galvanizing: "metal",
  fixture: "makine",
  grinding: "makine",
  bearing: "makine",
  conveyor: "makine",
  extrusion: "plastik",
  boiler: "enerji",
  turbine: "enerji",
  transformer: "enerji",
  compressor: "enerji",
  chiller: "enerji",
  motor: "enerji",
  generator: "enerji",
  hvac: "enerji",
  solar: "yenilenebilir",
  wind: "yenilenebilir",
  carbon: "cevre",
  cbam: "cevre",
  emission: "cevre",
  textile: "tekstil",
  fabric: "tekstil",
  apparel: "tekstil",
  concrete: "insaat",
  formwork: "insaat",
  scaffolding: "insaat",
  scaffold: "insaat",
  masonry: "insaat",
  roofing: "insaat",
  waterproofing: "insaat",
  asphalt: "insaat",
  pile: "insaat",
  rebar: "insaat",
  food: "gida",
  bakery: "gida",
  restaurant: "gida",
  dairy: "gida",
  beverage: "gida",
  poultry: "tarim",
  crop: "tarim",
  irrigation: "tarim",
  seed: "tarim",
  grain: "tarim",
  silo: "tarim",
  shipping: "lojistik",
  container: "lojistik",
  logistics: "lojistik",
  warehouse: "lojistik",
  pallet: "lojistik",
  demurrage: "lojistik",
  automotive: "otomotiv",
  battery: "otomotiv",
  data: "bilisim",
  cooling: "enerji",
  vessel: "denizcilik",
  ship: "denizcilik",
  marine: "denizcilik",
  rigging: "makine",
  flange: "makine",
  bolt: "makine",
  gasket: "makine",
  torque: "makine",
  quality: "istatistik",
  inspection: "istatistik",
  calibration: "istatistik",
  milling: "makine",
  machining: "makine",
  edm: "makine",
  plasma: "makine",
  cutting: "makine",
  sheet: "metal",
  metal: "metal",
  electrolyzer: "enerji",
  lyophilization: "gida",
  autoclave: "kimya",
  anode: "enerji",
  cathode: "enerji",
  ion: "elektronik",
  semiconductor: "elektronik",
  circuit: "elektronik",
  electrical: "enerji",
  cable: "enerji",
  pump: "hidrolik-pnomatik",
  pipe: "hidrolik-pnomatik",
  valve: "hidrolik-pnomatik",
  oven: "enerji",
  thermal: "enerji",
  ventilation: "enerji",
  wastewater: "cevre",
  water: "cevre",
  environment: "cevre",
  recycling: "cevre",
  defect: "kalite",
  scrap: "kalite",
  waste: "cevre",
  tolerance: "makine",
  measurement: "istatistik",
  gage: "istatistik",
  aql: "istatistik",
};

const TAXONOMY_SECTOR_IDS = new Set(SECTORS.map((s) => s.id));

function resolveProSectorKey(toolKey: string): string {
  // Strip "sc_NNN_" prefix
  const stripped = toolKey.replace(/^sc_\d+_/, "").replace(/_calculator$/, "");
  // Check manual overrides
  const tokens = stripped.split("_");
  for (const token of tokens) {
    if (KNOWN_SECTOR_EXACT[token]) {
      return KNOWN_SECTOR_EXACT[token];
    }
    const hint = SLUG_TOKEN_SECTOR_HINTS[token];
    if (hint && TAXONOMY_SECTOR_IDS.has(hint)) {
      return hint;
    }
  }
  return "diger";
}

// ─── Convert PRO schemas to ToolListItem ────────────────────────────────────

function proSchemaToToolListItem(
  toolKey: string,
  schema: SuperV4Schema,
): ToolListItem {
  const sectorKey = resolveProSectorKey(toolKey);
  return {
    slug: toolKey,
    name: schema.tool_name,
    title: schema.tool_name,
    tier: "premium",
    href: `/tools/pro/${toolKey}`,
    isPremium: true,
    categorySlug: "pro-tools",
    sectorKey,
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProToolsPage() {
  const locale = "en";
  const proEntries = getAllProToolSchemas();
  const count = proEntries.length;

  const tools: ToolListItem[] = proEntries.map(({ toolKey, schema }) =>
    proSchemaToToolListItem(toolKey, schema),
  );

  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, {
      allLabel: "All PRO Tools",
    }),
    (toolCount) => `${toolCount} tools`,
  );

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { name: "PRO Tools", path: "/pro-tools" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      tools.slice(0, CATALOG_HUB_JSONLD_MAX_ITEMS).map((tool) => ({
        name: tool.title,
        path: tool.href,
      })),
      "PRO Industrial Calculators",
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
          title="PRO Industrial Calculators"
          subtitle={`${count} deterministic, auditable calculators across industrial engineering domains. Server-side execution. No exact formula exposure. Decision-support only.`}
          searchPlaceholder="Search PRO calculators..."
          categoryTitle="Industry sectors"
          proToolsHref="/pricing"
        />
      </section>
    </PageLayout>
  );
}
