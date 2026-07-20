// SectorCalc V5.3.1 — PRO Tools Catalog Page
// Progressive rendering: page shell renders immediately,
// catalog content streams via Suspense.

import type { Metadata } from "next";
import { Suspense } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { getAllProToolSchemas } from "@/sectorcalc/runtime/pro-schema-loader";
import { ACTIVE_PRO_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import {
  buildTaxonomySectorCards,
  withTaxonomyCountLabels,
} from "@/lib/features/tools/build-taxonomy-sector-cards";
import { SLUG_TOKEN_SECTOR_HINTS, SECTORS } from "@/lib/features/tools/taxonomy";
import type { ToolListItem } from "@/lib/features/tools/getToolsByCategory";
import { getPublicCatalogTitle } from "@/sectorcalc/public/public-tool-copy-adapter";
import { SITE } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pro industrial calculators for audit-safe cost, margin, downtime, and engineering decisions.",
  description:
    "Access 20 live Pro industrial calculators for manufacturing, energy, quality, logistics, and engineering decision support. Deterministic, auditable, server-side execution. Assisted dossiers for source-required cases.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE.url}/pro-tools`,
    languages: {
      en: `${SITE.url}/en/pro-tools`,
      "en-us": `${SITE.url}/en/pro-tools`,
      "en-gb": `${SITE.url}/en/pro-tools`,
      "x-default": `${SITE.url}/pro-tools`,
    },
  },
};

// ─── Sector mapping from PRO tool_key tokens ───────────────────────────────

const KNOWN_SECTOR_EXACT: Record<string, string> = {
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
  // Baris PRO tool tokens (finance & operations batch)
  break: "finans",
  survival: "finans",
  cash: "finans",
  machine: "makine",
  hourly: "makine",
  proof: "makine",
  report: "makine",
  loss: "finans",
  making: "finans",
  job: "finans",
  detector: "finans",
  receivables: "finans",
  term: "finans",
  addendum: "finans",
  setup: "makine",
  reduction: "makine",
  smed: "makine",
  product: "finans",
  sku: "finans",
  ranker: "finans",
  true: "finans",
  employee: "finans",
  statement: "finans",
  quote: "finans",
  builder: "finans",
  pack: "finans",
  investment: "finans",
  feasibility: "finans",
  buy: "finans",
  keep: "finans",
  capital: "finans",
  equipment: "makine",
  appraisal: "finans",
  customer: "finans",
  profitability: "finans",
  forensics: "finans",
  downtime: "kalite",
  oee: "kalite",
  monetization: "finans",
  improvement: "kalite",
  business: "finans",
  rework: "kalite",
  tracker: "kalite",
  outsource: "finans",
  analyzer: "finans",
  plant: "makine",
  wide: "makine",
  shop: "makine",
  structure: "makine",
  audit: "makine",
  fx: "finans",
  commodity: "finans",
  pricer: "finans",
  efficiency: "enerji",
  grant: "enerji",
  incentive: "enerji",
  replacement: "enerji",
  procedure: "metal",
  consumable: "metal",
  estimation: "metal",
  suite: "metal",
};

const TAXONOMY_SECTOR_IDS = new Set(SECTORS.map((s) => s.id));

function resolveProSectorKey(toolKey: string): string {
  // Normalize hyphens to underscores, then split (same approach as free-tools)
  const stripped = toolKey.replace(/-/g, "_").replace(/^sc_\d+_/, "").replace(/_calculator$/, "");
  const tokens = stripped.split("_");
  for (const token of tokens) {
    if (KNOWN_SECTOR_EXACT[token]) return KNOWN_SECTOR_EXACT[token];
    const hint = SLUG_TOKEN_SECTOR_HINTS[token];
    if (hint && TAXONOMY_SECTOR_IDS.has(hint)) return hint;
  }
  return "diger";
}

function proSchemaToToolListItem(toolKey: string, schema: SuperV4Schema): ToolListItem {
  const sectorKey = resolveProSectorKey(toolKey);
  const catalogTitle = getPublicCatalogTitle(toolKey, schema.tool_name);
  return {
    slug: toolKey,
    name: schema.tool_name,
    title: catalogTitle,
    tier: "premium",
    href: `/tools/pro/${toolKey}`,
    isPremium: true,
    categorySlug: "pro-tools",
    sectorKey,
  };
}

// ─── Streamed catalog content ──────────────────────────────────────────────

async function ProCatalogContent() {
  const locale = "en";
  const allProEntries = getAllProToolSchemas();
  const activeSlugs = new Set(ACTIVE_PRO_TOOL_SLUGS);
  const proEntries = allProEntries.filter((e) => activeSlugs.has(e.toolKey));
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

  return (
    <section className="sc-pro-section sc-pro-section--border">
      <CatalogPageShell
        tools={tools}
        sectors={taxonomySectorCards}
        title="PRO INDUSTRIAL CALCULATORS"
        subtitle="Pro calculators for cost, margin, downtime, and engineering decisions."
        subheadline="Run 20 live server-side calculators with entitlement-gated execution, audit-safe outputs, and decision-support summaries. Source-required cases are handled as assisted Pro dossiers."
        primaryCta={{"href":"#search","label":"Run a Pro Calculator"}}
        secondaryCta={{"href":"/pricing","label":"View Pricing"}}
        assistedClarifier="20 live calculators are self-service. Assisted dossiers are available for source-required decisions."
        searchPlaceholder="Search Pro calculators..."
        categoryTitle="Browse Pro tools"
        proToolsHref="/pricing"
      />
    </section>
  );
}

function ProCatalogSkeleton() {
  return (
    <section className="sc-pro-section sc-pro-section--border">
      <div
        role="status"
        aria-label="Loading PRO tools"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            height: "2rem",
            width: "35%",
            background: "#E0DDD4",
            borderRadius: "6px",
            marginBottom: "0.75rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "1rem",
            width: "55%",
            background: "#E0DDD4",
            borderRadius: "4px",
            marginBottom: "1.5rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "3rem",
            background: "#F0EEE6",
            borderRadius: "8px",
            border: "1px solid #E0DDD4",
            marginBottom: "2rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: "220px",
                background: "#F0EEE6",
                borderRadius: "8px",
                border: "1px solid #E0DDD4",
              }}
              className="skeleton-pulse"
            />
          ))}
        </div>
        <style>{`
          @keyframes skeletonPulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .skeleton-pulse {
            animation: skeletonPulse 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProToolsPage() {
  const locale = "en";

  // Lightweight: only breadcrumb JSON-LD — no schema loading here.
  // Catalog content streams in ProCatalogContent via Suspense.
  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { name: "PRO Tools", path: "/pro-tools" },
      ],
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <Suspense fallback={<ProCatalogSkeleton />}>
        <ProCatalogContent />
      </Suspense>
    </PageLayout>
  );
}
