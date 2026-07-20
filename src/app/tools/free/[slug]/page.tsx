// SectorCalc V5.4 Core — Free Tool Detail Page
// Only allowlisted Free tools render. All others return 404 (quarantined).
// See: src/sectorcalc/runtime/active-tool-allowlist.ts

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { ProToolSessionWrapper } from "@/sectorcalc/pro-form/ProToolSessionWrapper";
import { toClientRenderableSchema } from "@/sectorcalc/pro-form/to-client-renderable-schema";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { ACTIVE_FREE_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import { getPublicToolTitle, getPublicToolMetaDescription } from "@/sectorcalc/public/public-tool-copy-adapter";
import { getDisplayCategoryLabel } from "@/sectorcalc/pro-form/display-labels";
import { SITE } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolPageGraph } from "@/lib/infrastructure/seo/tool-page-graph";
import { getGeneratedToolLastUpdatedIso } from "@/lib/features/generated-tools/resolve-tool-updated-at";
import { AiOverviewParagraph, AI_OVERVIEW_PARAGRAPHS, buildSpeakableJsonLd } from "@/components/seo/AiOverviewOptimization";
/* Eager: prevent Next.js from loading this CSS as a lazy preload chunk */
import "@/sectorcalc/pro-form/universal-industrial-decision-form.css";
import "@/sectorcalc/free-form/free-tool-result-panel.css";

// Hard-404 architecture: only allowlisted slugs are statically generated.
// Any slug outside generateStaticParams returns a real HTTP 404 at the
// routing layer (Next.js built-in not-found), eliminating the soft-404
// (HTTP 200 + noindex) shell that wasted crawl budget. `force-dynamic` is
// intentionally NOT set — it would force dynamic rendering and bypass the
// static 404 enforcement of `dynamicParams = false`.
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return ACTIVE_FREE_TOOL_SLUGS.map((slug) => ({ slug }));
}

interface FreeToolRouteParams {
  slug: string;
}

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  "cutting-speed-feed-rpm": "Cutting Speed & Feed RPM",
  "machining-cost-per-part": "Machining Cost Per Part",
  "cnc-shop-hourly-rate": "CNC Shop Hourly Rate",
  "tap-drill-size": "Tap Drill Size",
  "iso-286-tolerance-fit": "ISO 286 Tolerance Fit",
  "surface-roughness-converter": "Surface Roughness Converter",
  "material-removal-rate": "Material Removal Rate",
  "tool-life-tool-cost-per-part": "Tool Life & Tool Cost Per Part",
  "scrap-cost": "Scrap Cost",
  "rework-vs-scrap-decision": "Rework vs Scrap Decision",
  "thread-dimensions-reference": "Thread Dimensions Reference",
  "knurling-drill-point-depth": "Knurling & Drill Point Depth",
  "weld-metal-weight-consumable": "Weld Metal Weight & Consumable",
  "fillet-weld-size-strength": "Fillet Weld Size & Strength",
  "welding-cost-per-meter": "Welding Cost Per Meter",
  "welding-heat-input": "Welding Heat Input",
  "bolt-torque": "Bolt Torque",
  "bolt-preload-clamp-force": "Bolt Preload & Clamp Force",
  "steel-weight": "Steel Weight",
  "beam-load-deflection-quick-check": "Beam Load & Deflection Quick Check",
  "sheet-metal-bend-allowance": "Sheet Metal Bend Allowance",
  "oee": "OEE",
  "downtime-cost": "Downtime Cost",
  "takt-time-cycle-time": "Takt Time & Cycle Time",
  "setup-time-cost": "Setup Time Cost",
  "line-balancing-efficiency": "Line Balancing Efficiency",
  "compressed-air-leak-cost": "Compressed Air Leak Cost",
  "electric-motor-running-cost": "Electric Motor Running Cost",
  "energy-cost-per-part": "Energy Cost Per Part",
  "cbam-cost-quick-estimator": "CBAM Cost Quick Estimator",
  "electricity-co2-emissions": "Electricity CO2 Emissions",
  "diesel-fuel-co2-emissions": "Diesel Fuel CO2 Emissions",
  "product-carbon-footprint-basic": "Product Carbon Footprint Basic",
  "carbon-price-exposure": "Carbon Price Exposure",
  "true-employee-cost": "True Employee Cost",
  "quote-margin-markup": "Quote Margin & Markup",
  "break-even-point": "Break-Even Point",
  "payment-term-cost": "Payment Term Cost",
  "machine-investment-payback": "Machine Investment Payback",
  "customer-profitability": "Customer Profitability",
  "currency-adjusted-pricing": "Currency Adjusted Pricing",
  "eoq": "EOQ",
  "safety-stock-reorder-point": "Safety Stock & Reorder Point",
  "inventory-carrying-cost": "Inventory Carrying Cost",
  "pallet-container-load-cbm": "Pallet & Container Load CBM",
  "freight-cost-per-km-trip": "Freight Cost Per KM Trip",
  "concrete-volume-order-quantity": "Concrete Volume Order Quantity",
  "rebar-weight-count": "Rebar Weight & Count",
  "recipe-cost-menu-price": "Recipe Cost & Menu Price",
  "fabric-consumption-gsm": "Fabric Consumption GSM",
};

function fallbackToolName(slug: string): string {
  return DISPLAY_NAME_OVERRIDES[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Per-tool JSON-LD entity attribution. Engineering tools must cite their real
// governing theory/standards instead of the generic manufacturing-KPI default.
interface ToolGraphAttribution {
  methodology: string;
  dataSources: { name: string; url: string }[];
  isBasedOn?: { name: string; url?: string }[];
  mentions?: { name: string; url?: string }[];
}

const DEFAULT_TOOL_ATTRIBUTION: ToolGraphAttribution = {
  methodology: "ISO 22400-2 + ECMI Cost Model v3.2",
  dataSources: [
    { name: "ISO 22400-2:2014", url: "https://www.iso.org/standard/62046.html" },
    { name: "World Bank Open Data", url: "https://data.worldbank.org/" },
  ],
};

const ASME_BPVC_VIII_2_URL =
  "https://www.asme.org/codes-standards/find-codes-standards/bpvc-viii-2-bpvc-section-viii-rules-construction-pressure-vessels-division-2-alternative-rules";
const ISO_12100_URL = "https://www.iso.org/standard/51528.html";

const TOOL_GRAPH_ATTRIBUTION: Record<string, ToolGraphAttribution> = {
  "von-mises-stress-calculator": {
    methodology: "Maximum Distortion Energy Theory (Hencky-von Mises Yield Criterion)",
    dataSources: [
      { name: "ASME BPVC Section VIII Division 2 Part 5", url: ASME_BPVC_VIII_2_URL },
      { name: "ISO 12100:2010", url: ISO_12100_URL },
    ],
    isBasedOn: [
      { name: "Maximum Distortion Energy Theory (Hencky-von Mises Yield Criterion)" },
      {
        name: "ASME BPVC Section VIII Division 2 Part 5 (Design by Analysis - Elastic Stress Analysis)",
        url: ASME_BPVC_VIII_2_URL,
      },
    ],
    mentions: [
      { name: "ISO 12100:2010 (Safety of machinery)", url: ISO_12100_URL },
      { name: "Factor of safety" },
      { name: "Plane stress" },
    ],
  },
};

function getToolGraphAttribution(slug: string): ToolGraphAttribution {
  return TOOL_GRAPH_ATTRIBUTION[slug] ?? DEFAULT_TOOL_ATTRIBUTION;
}

/** Slug → AI Overview definition key mapping for passage indexing. */
const TOOL_DEFINITION_KEY: Record<string, string> = {
  oee: "oee-calculation",
  "scrap-cost": "scrap-rate",
  "break-even-point": "break-even-analysis",
  "downtime-cost": "oee-calculation",
  "setup-time-cost": "oee-calculation",
  "machine-investment-payback": "break-even-analysis",
  "roi-payback": "break-even-analysis",
};

function getToolDefinitionKey(slug: string): string | undefined {
  return TOOL_DEFINITION_KEY[slug];
}

/**
 * Build global-English hreflang languages for a given tool path.
 * en, en-us, en-gb, x-default all self-reference the bare canonical URL.
 */
function buildToolHreflangLanguages(slug: string): Record<string, string> {
  const canonicalUrl = `${SITE.url}/tools/free/${slug}`;

  return {
    en: canonicalUrl,
    "en-us": canonicalUrl,
    "en-gb": canonicalUrl,
    "x-default": canonicalUrl,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<FreeToolRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = resolveApprovedToolSchema(slug);

  if (!result.ok) {
    const name = fallbackToolName(slug);
    return {
      title: `${name} | SectorCalc FREE`,
      description: `Free ${name} industrial calculator. Calculate costs, measure efficiency, and make data-driven decisions.`,
      robots: { index: false, follow: false },
      alternates: {
        canonical: `${SITE.url}/tools/free/${slug}`,
      },
    };
  }

  const schema = result.schema;
  const category = getDisplayCategoryLabel(schema.category);
  const publicTitle = getPublicToolTitle(schema.tool_key, schema.tool_name);
  const publicDesc = getPublicToolMetaDescription(schema.tool_key, schema.tool_name, category);
  const seoTitle = `${publicTitle} | SectorCalc FREE`;

  return {
    title: seoTitle,
    description: publicDesc,
    robots: { index: true, follow: true },
    openGraph: {
      title: seoTitle,
      description: publicDesc,
    },
    alternates: {
      canonical: `${SITE.url}/tools/free/${slug}`,
      languages: buildToolHreflangLanguages(slug),
    },
  };
}

export default async function FreeToolDetailPage({
  params,
}: {
  params: Promise<FreeToolRouteParams>;
}) {
  const { slug } = await params;

  // Resolve via canonical schema resolver (allowlist-gated)
  const result = resolveApprovedToolSchema(slug);

  if (!result.ok) {
    notFound();
  }

  const schema = result.schema;

  // Identity invariant: route slug must match schema.tool_key
  const identityCheck = assertToolSchemaIdentity({
    routeToolKey: slug,
    schemaToolKey: schema.tool_key,
    schemaToolId: schema.tool_id,
  });

  if (!identityCheck.ok) {
    notFound();
  }

  const definitionKey = getToolDefinitionKey(slug);
  const definitionParagraph = definitionKey ? AI_OVERVIEW_PARAGRAPHS[definitionKey] : undefined;
  const articleAccessibilityProps = { "aria-label": schema.tool_name };

  return (
    <PageLayout>
      <article {...articleAccessibilityProps} className="pro-shell">
        <ProToolSessionWrapper
          schema={toClientRenderableSchema(schema)}
          toolKey={slug}
          executeEndpoint="/api/tool-execute"
          initialProfileMode="engineering"
          accessTier="FREE"
          presentationMode="FREE_COMPACT"
        />
        {definitionParagraph && (
          <AiOverviewParagraph text={definitionParagraph.text} />
        )}
      </article>
      {definitionParagraph && (
        <JsonLd data={buildSpeakableJsonLd()} />
      )}
      <JsonLd
        data={buildToolPageGraph({
          slug,
          toolName: schema.tool_name,
          sectorName: getDisplayCategoryLabel(schema.category),
          tier: "free",
          description: getPublicToolMetaDescription(schema.tool_key, schema.tool_name, getDisplayCategoryLabel(schema.category)),
          featureList: [],
          faq: [],
          methodology: getToolGraphAttribution(slug).methodology,
          dataSources: getToolGraphAttribution(slug).dataSources,
          isBasedOn: getToolGraphAttribution(slug).isBasedOn,
          mentions: getToolGraphAttribution(slug).mentions,
          // Source-derived date (schema/generated mtime). Omitted when unknown
          // rather than emitting request-time, which would churn every crawl.
          lastUpdated: getGeneratedToolLastUpdatedIso(slug) ?? undefined,
        })}
      />
    </PageLayout>
  );
}
