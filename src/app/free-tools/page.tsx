// SectorCalc V5.3.1 — Free Tools Catalog Page
// Progressive rendering: page shell renders immediately,
// catalog content streams via Suspense.

import type { Metadata } from "next";
import { Suspense } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import { freeV531FormulaRegistry } from "@/sectorcalc/formulas/free-v531";
import { ACTIVE_FREE_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
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
  title: "Free industrial calculators for cost, risk, capacity, and shop-floor decisions.",
  description:
    "Browse 49 free industrial calculators across machining, metal, energy, finance, logistics, and more. Browser-first, privacy-safe, decision-support tools. Quick checks before Pro reports.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE.url}/free-tools`,
    languages: {
      en: `${SITE.url}/free-tools`,
      "en-us": `${SITE.url}/free-tools`,
      "en-gb": `${SITE.url}/free-tools`,
      "x-default": `${SITE.url}/free-tools`,
    },
  },
};

// ─── Sector mapping from free tool slug tokens ─────────────────────────────

const KNOWN_FREE_SECTOR_EXACT: Record<string, string> = {
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
  tool: "makine",
  life: "makine",
  weld: "metal",
  welding: "metal",
  fillet: "metal",
  bolt: "metal",
  torque: "metal",
  preload: "metal",
  clamp: "metal",
  steel: "metal",
  sheet: "metal",
  metal: "metal",
  plate: "metal",
  blank: "metal",
  bend: "metal",
  brake: "metal",
  press: "makine",
  hydraulic: "makine",
  cylinder: "makine",
  pipe: "hidrolik-pnomatik",
  pump: "hidrolik-pnomatik",
  valve: "hidrolik-pnomatik",
  pneumatic: "hidrolik-pnomatik",
  compressor: "enerji",
  motor: "enerji",
  gearbox: "makine",
  bearing: "makine",
  shaft: "makine",
  spring: "makine",
  beam: "yapisal-muhendislik",
  column: "yapisal-muhendislik",
  truss: "yapisal-muhendislik",
  deflection: "yapisal-muhendislik",
  load: "yapisal-muhendislik",
  stress: "yapisal-muhendislik",
  strain: "yapisal-muhendislik",
  concrete: "insaat",
  formwork: "insaat",
  rebar: "insaat",
  scaffolding: "insaat",
  scaffold: "insaat",
  earth: "insaat",
  excavation: "insaat",
  soil: "insaat",
  asphalt: "insaat",
  roofing: "insaat",
  hvac: "enerji",
  cooling: "enerji",
  heat: "enerji",
  thermal: "enerji",
  energy: "enerji",
  solar: "yenilenebilir",
  wind: "yenilenebilir",
  battery: "enerji",
  power: "enerji",
  electrical: "enerji",
  cable: "enerji",
  wire: "enerji",
  transformer: "enerji",
  generator: "enerji",
  lighting: "enerji",
  oee: "kalite",
  scrap: "kalite",
  defect: "kalite",
  quality: "istatistik",
  spc: "istatistik",
  cpk: "istatistik",
  six: "istatistik",
  sigma: "istatistik",
  aql: "istatistik",
  sampling: "istatistik",
  inspection: "istatistik",
  calibration: "istatistik",
  gage: "istatistik",
  rms: "istatistik",
  measurement: "istatistik",
  uncertainty: "istatistik",
  cost: "finans",
  price: "finans",
  margin: "finans",
  profit: "finans",
  revenue: "finans",
  break: "finans",
  even: "finans",
  roi: "finans",
  npv: "finans",
  irr: "finans",
  payback: "finans",
  depreciation: "finans",
  amortization: "finans",
  lease: "finans",
  loan: "finans",
  interest: "finans",
  tax: "finans",
  inflation: "finans",
  currency: "finans",
  budget: "finans",
  estimate: "finans",
  quote: "finans",
  quote_pro: "finans",
  freight: "lojistik",
  shipping: "lojistik",
  logistics: "lojistik",
  container: "lojistik",
  pallet: "lojistik",
  warehouse: "lojistik",
  inventory: "lojistik",
  demurrage: "lojistik",
  food: "gida",
  bakery: "gida",
  cooking: "gida",
  recipe: "gida",
  dough: "gida",
  yeast: "gida",
 冷链: "gida",
  cold: "gida",
  chain: "lojistik",
  packaging: "lojistik",
  plastic: "plastik",
  injection: "plastik",
  mold: "plastik",
  extrusion: "plastik",
  vacuum: "plastik",
  thermoforming: "plastik",
  film: "plastik",
  textile: "tekstil",
  fabric: "tekstil",
  yarn: "tekstil",
  weaving: "tekstil",
  dyeing: "tekstil",
  finishing: "tekstil",
  apparel: "tekstil",
  garment: "tekstil",
  sewing: "tekstil",
  leather: "tekstil",
  painting: "kimya",
  coating: "kimya",
  chemical: "kimya",
  corrosion: "kimya",
  adhesive: "kimya",
  solvent: "kimya",
  rubber: "kimya",
  carbon: "cevre",
  emission: "cevre",
  environment: "cevre",
  water: "cevre",
  waste: "cevre",
  recycling: "cevre",
  noise: "cevre",
  vibration: "makine",
  agriculture: "tarim",
  crop: "tarim",
  irrigation: "tarim",
  grain: "tarim",
  poultry: "tarim",
  livestock: "tarim",
  automotive: "otomotiv",
  engine: "otomotiv",
  crane: "makine",
  lifting: "makine",
  rigging: "makine",
  hoist: "makine",
  sling: "makine",
  capacity: "makine",
  fluid: "hidrolik-pnomatik",
  gas: "enerji",
  density: "kimya",
  viscosity: "kimya",
  flow: "hidrolik-pnomatik",
  pressure: "hidrolik-pnomatik",
  tank: "kimya",
  vessel: "kimya",
  pipe_thickness: "hidrolik-pnomatik",
  flange: "hidrolik-pnomatik",
  gasket: "hidrolik-pnomatik",
  fastener: "makine",
  screw: "makine",
  nut: "makine",
  washer: "makine",
  rivet: "metal",
  anchor: "insaat",
  epoxy: "kimya",
  grease: "makine",
  oil: "makine",
  coolant: "makine",
  lubricant: "makine",
  filtration: "makine",
  conveyor: "makine",
  robot: "makine",
  automation: "makine",
  sensor: "elektronik",
  plc: "elektronik",
  actuator: "makine",
  servo: "makine",
  spindle: "makine",
  chuck: "makine",
  jig: "makine",
  fixture: "makine",
  die: "metal",
  punch: "metal",
  shear: "metal",
  roller: "makine",
  mill: "makine",
  lathe: "makine",
  grinder: "makine",
  saw: "makine",
  drill_press: "makine",
  bandsaw: "makine",
  laser_cut: "makine",
  waterjet: "makine",
  plasma_cut: "makine",
  welding_machine: "metal",
  edm: "makine",
  additive: "makine",
  printing: "makine",
  sand: "insaat",
  aggregate: "insaat",
  cement: "insaat",
  mortar: "insaat",
  brick: "insaat",
  tile: "insaat",
  ceramic: "kimya",
  glass: "kimya",
  wood: "insaat",
  timber: "insaat",
  plywood: "insaat",
  lumber: "insaat",
  nail: "insaat",
  screw_ins: "insaat",
  drywall: "insaat",
  insulation: "insaat",
  painting_ins: "insaat",
  flooring: "insaat",
  ceiling: "insaat",
  door: "insaat",
  window: "insaat",
  furniture: "insaat",
  cabinet: "insaat",
};

const TAXONOMY_SECTOR_IDS = new Set(SECTORS.map((s) => s.id));

function resolveFreeSectorKey(slug: string): string {
  const tokens = slug.replace(/-/g, "_").split("_");
  for (const token of tokens) {
    if (KNOWN_FREE_SECTOR_EXACT[token]) return KNOWN_FREE_SECTOR_EXACT[token];
    const hint = SLUG_TOKEN_SECTOR_HINTS[token];
    if (hint && TAXONOMY_SECTOR_IDS.has(hint)) return hint;
  }
  return "diger";
}

function freeFormulaToToolListItem(slug: string, toolName: string): ToolListItem {
  const sectorKey = resolveFreeSectorKey(slug);
  const catalogTitle = getPublicCatalogTitle(slug, toolName);
  return {
    slug,
    name: toolName,
    title: catalogTitle,
    tier: "free",
    href: `/tools/free/${slug}`,
    isPremium: false,
    categorySlug: "free-tools",
    sectorKey,
  };
}

// ─── Streamed catalog content ──────────────────────────────────────────────

async function FreeCatalogContent() {
  const locale = "en";
  const removedSlugs = new Set(["break-even-point"]);
  const tools: ToolListItem[] = [];

  for (const [toolKey, formula] of Object.entries(freeV531FormulaRegistry)) {
    if (removedSlugs.has(toolKey)) continue;
    tools.push(freeFormulaToToolListItem(toolKey, formula.toolName));
  }

  const activeFreeSlugs = new Set(ACTIVE_FREE_TOOL_SLUGS);
  for (const slug of activeFreeSlugs) {
    if (slug === "break-even-and-margin-of-safety-analysis") {
      tools.push(freeFormulaToToolListItem(slug, "Break-Even & Margin of Safety Analysis"));
    }
  }

  const taxonomySectorCards = withTaxonomyCountLabels(
    buildTaxonomySectorCards(tools, locale, { allLabel: "All Free Tools" }),
    (toolCount) => `${toolCount} tools`,
  );

  return (
    <section className="sc-pro-section sc-pro-section--border">
      <CatalogPageShell
        tools={tools}
        sectors={taxonomySectorCards}
        title="FREE INDUSTRIAL CALCULATORS"
        subtitle="Free calculators for quick cost, risk, capacity, and production checks."
        subheadline="Run browser-first calculators for machining, finance, energy, welding, materials, logistics, and workshop decisions. Use them for fast estimates before moving to Pro reports when the decision needs deeper evidence."
        primaryCta={{"href":"#search","label":"Start a Free Calculation"}}
        secondaryCta={{"href":"/pro-tools","label":"View Pro Tools"}}
        searchPlaceholder="Search free calculators..."
        categoryTitle="Browse by industry"
        proToolsHref="/pricing"
      />
    </section>
  );
}

function FreeCatalogSkeleton() {
  return (
    <section className="sc-pro-section sc-pro-section--border">
      <div
        role="status"
        aria-label="Loading free tools"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            height: "2rem",
            width: "30%",
            background: "#E0DDD4",
            borderRadius: "6px",
            marginBottom: "0.75rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "1rem",
            width: "50%",
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
                height: "160px",
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

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function FreeToolsCatalogPage() {
  const locale = "en";

  // Lightweight: only breadcrumb JSON-LD — no catalog computation here.
  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { name: "Free Tools", path: "/free-tools" },
      ],
      locale,
    ),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <Suspense fallback={<FreeCatalogSkeleton />}>
        <FreeCatalogContent />
      </Suspense>
    </PageLayout>
  );
}
