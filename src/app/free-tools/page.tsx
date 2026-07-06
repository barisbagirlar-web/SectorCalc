import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { CatalogPageShell } from "@/components/catalog/CatalogPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/infrastructure/seo/localized-breadcrumbs";
import {
  buildTaxonomySectorCards,
  withTaxonomyCountLabels,
} from "@/lib/features/tools/build-taxonomy-sector-cards";
import type { ToolListItem } from "@/lib/features/tools/getToolsByCategory";
import { CATALOG_HUB_JSONLD_MAX_ITEMS } from "@/lib/features/tools/filter-catalog-hub-tools";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free Industrial Calculators | SectorCalc",
  description:
    "Browse 50 free industrial calculators across machining, metal, energy, finance, logistics, and more. Browser-first, privacy-safe, decision-support tools.",
  robots: { index: true, follow: true },
};

// ─── Free V5.3.1 tool key → display name ───────────────────────────────────
// Names sourced directly from TOOL_NAME constant in each .formula.ts file.

const FREE_TOOL_NAMES: Record<string, string> = {
  "machining-cost-per-part": "Machining Cost per Part Calculator",
  "cnc-shop-hourly-rate": "CNC Shop Hourly Rate Calculator",
  "cutting-speed-feed-rpm": "Cutting Speed & Feed RPM Calculator",
  "tap-drill-size": "Tap Drill Size Calculator",
  "iso-286-tolerance-fit": "ISO 286 Tolerance & Fit Calculator",
  "surface-roughness-converter": "Surface Roughness Converter",
  "material-removal-rate": "Material Removal Rate Calculator",
  "tool-life-tool-cost-per-part": "Tool Life Taylor and Tool Cost per Part Calculator",
  "scrap-cost": "Scrap Cost Calculator",
  "rework-vs-scrap-decision": "Rework vs Scrap Decision Calculator",
  "thread-dimensions-reference": "Thread Dimensions Reference Calculator",
  "knurling-drill-point-depth": "Knurling and Drill Point Depth Quick Calculator",
  "weld-metal-weight-consumable": "Weld Metal Weight and Consumable Calculator",
  "fillet-weld-size-strength": "Fillet Weld Size and Strength Calculator",
  "welding-cost-per-meter": "Welding Cost per Meter Calculator",
  "welding-heat-input": "Welding Heat Input Calculator",
  "bolt-torque": "Bolt Torque Calculator",
  "bolt-preload-clamp-force": "Bolt Preload and Clamp Force Calculator",
  "steel-weight": "Steel Weight Calculator",
  "beam-load-deflection-quick-check": "Beam Load and Deflection Quick Check",
  "sheet-metal-bend-allowance": "Sheet Metal Bend Allowance Calculator",
  "oee": "OEE Calculator",
  "downtime-cost": "Downtime Cost Calculator",
  "takt-time-cycle-time": "Takt Time and Cycle Time Calculator",
  "setup-time-cost": "Setup Time Cost Calculator",
  "line-balancing-efficiency": "Line Balancing Efficiency Calculator",
  "compressed-air-leak-cost": "Compressed Air Leak Cost Calculator",
  "electric-motor-running-cost": "Electric Motor Running Cost Calculator",
  "energy-cost-per-part": "Energy Cost per Part Calculator",
  "cbam-cost-quick-estimator": "CBAM Cost Quick Estimator",
  "electricity-co2-emissions": "Electricity CO2 Emissions Calculator",
  "diesel-fuel-co2-emissions": "Diesel Fuel CO2 Emissions Calculator",
  "product-carbon-footprint-basic": "Product Carbon Footprint Basic Calculator",
  "carbon-price-exposure": "Carbon Price Exposure Calculator",
  "true-employee-cost": "True Employee Cost Calculator",
  "quote-margin-markup": "Quote Margin and Markup Calculator",
  "machine-investment-payback": "Machine Investment Payback Calculator",
  "customer-profitability": "Customer Profitability Calculator",
  "currency-adjusted-pricing": "Currency Adjusted Pricing Calculator",
  "payment-term-cost": "Payment Term Cost Calculator",
  "eoq": "EOQ Calculator",
  "safety-stock-reorder-point": "Safety Stock and Reorder Point Calculator",
  "inventory-carrying-cost": "Inventory Carrying Cost Calculator",
  "pallet-container-load-cbm": "Pallet and Container Load CBM Calculator",
  "freight-cost-per-km-trip": "Freight Cost per km and Trip Calculator",
  "concrete-volume-order-quantity": "Concrete Volume and Order Quantity Calculator",
  "rebar-weight-count": "Rebar Weight and Count Calculator",
  "recipe-cost-menu-price": "Recipe Cost and Menu Price Calculator",
  "fabric-consumption-gsm": "Fabric Consumption and GSM Calculator",
};

// Active (allowlisted) free tool — same financial logic as break-even-point
const ACTIVE_BREAK_EVEN_KEY = "break-even-and-margin-of-safety-analysis";
const ACTIVE_BREAK_EVEN_NAME = "Break-Even & Margin of Safety Analysis";

// ─── Sector mapping ─────────────────────────────────────────────────────────

const FREE_SECTOR_MAP: Record<string, string> = {
  // Machining
  "machining-cost-per-part": "makine",
  "cnc-shop-hourly-rate": "makine",
  "cutting-speed-feed-rpm": "makine",
  "tap-drill-size": "makine",
  "iso-286-tolerance-fit": "makine",
  "surface-roughness-converter": "makine",
  "material-removal-rate": "makine",
  "tool-life-tool-cost-per-part": "makine",
  "knurling-drill-point-depth": "makine",
  "thread-dimensions-reference": "makine",

  // Metal & Welding
  "weld-metal-weight-consumable": "metal",
  "fillet-weld-size-strength": "metal",
  "welding-cost-per-meter": "metal",
  "welding-heat-input": "metal",
  "bolt-torque": "metal",
  "bolt-preload-clamp-force": "metal",
  "steel-weight": "metal",
  "beam-load-deflection-quick-check": "metal",
  "sheet-metal-bend-allowance": "metal",

  // Quality & Efficiency
  "scrap-cost": "istatistik",
  "rework-vs-scrap-decision": "istatistik",
  "oee": "istatistik",
  "downtime-cost": "istatistik",
  "takt-time-cycle-time": "istatistik",
  "setup-time-cost": "istatistik",
  "line-balancing-efficiency": "istatistik",

  // Energy
  "compressed-air-leak-cost": "enerji",
  "electric-motor-running-cost": "enerji",
  "energy-cost-per-part": "enerji",
  "electricity-co2-emissions": "enerji",
  "diesel-fuel-co2-emissions": "enerji",

  // Environment & Carbon
  "cbam-cost-quick-estimator": "cevre",
  "product-carbon-footprint-basic": "cevre",
  "carbon-price-exposure": "cevre",

  // Finance
  "true-employee-cost": "finans",
  "quote-margin-markup": "finans",
  "payment-term-cost": "finans",
  "machine-investment-payback": "finans",
  "customer-profitability": "finans",
  "currency-adjusted-pricing": "finans",
  "break-even-and-margin-of-safety-analysis": "finans",

  // Logistics
  "eoq": "lojistik",
  "safety-stock-reorder-point": "lojistik",
  "inventory-carrying-cost": "lojistik",
  "pallet-container-load-cbm": "lojistik",
  "freight-cost-per-km-trip": "lojistik",

  // Construction
  "concrete-volume-order-quantity": "insaat",
  "rebar-weight-count": "insaat",

  // Food
  "recipe-cost-menu-price": "gida",

  // Textile
  "fabric-consumption-gsm": "tekstil",
};

// ─── Build tool list ────────────────────────────────────────────────────────

function buildFreeToolsList(): ToolListItem[] {
  const tools: ToolListItem[] = [];

  for (const [key, name] of Object.entries(FREE_TOOL_NAMES)) {
    tools.push({
      slug: key,
      name,
      title: name,
      tier: "free",
      href: `/tools/free/${key}`,
      isPremium: false,
      categorySlug: "free-tools",
      sectorKey: FREE_SECTOR_MAP[key] ?? "diger",
    });
  }

  // Active verified break-even tool (allowlisted)
  tools.push({
    slug: ACTIVE_BREAK_EVEN_KEY,
    name: ACTIVE_BREAK_EVEN_NAME,
    title: ACTIVE_BREAK_EVEN_NAME,
    tier: "free",
    href: `/tools/free/${ACTIVE_BREAK_EVEN_KEY}`,
    isPremium: false,
    categorySlug: "free-tools",
    sectorKey: "finans",
  });

  return tools;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function FreeToolsCatalogPage() {
  const locale = "en";
  const tools = buildFreeToolsList();

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
