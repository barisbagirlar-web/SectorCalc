// SectorCalc V5.4 Core — Free Tool Detail Page
// Only allowlisted Free tools render. All others return 404 (quarantined).
// See: src/sectorcalc/runtime/active-tool-allowlist.ts

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { UniversalIndustrialDecisionForm } from "@/sectorcalc/pro-form";
import { ProToolSessionWrapper } from "@/sectorcalc/pro-form/ProToolSessionWrapper";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { ACTIVE_FREE_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import { getPublicToolTitle, getPublicToolMetaDescription } from "@/sectorcalc/public/public-tool-copy-adapter";
import { getDisplayCategoryLabel } from "@/sectorcalc/pro-form/display-labels";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildFAQJsonLd, buildBreadcrumbJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
/* Eager: prevent Next.js from loading this CSS as a lazy preload chunk */
import "@/sectorcalc/pro-form/universal-industrial-decision-form.css";
import "@/sectorcalc/free-form/free-tool-result-panel.css";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

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
      robots: { index: true, follow: true },
      alternates: {
        canonical: `https://sectorcalc.com/tools/free/${slug}`,
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
    alternates: {
      canonical: `https://sectorcalc.com/tools/free/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: publicDesc,
      url: `https://sectorcalc.com/tools/free/${slug}`,
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

  // Structured data: FAQPage + BreadcrumbList for rich results
  const faqJsonLd = buildFAQJsonLd([
    {
      question: `How is ${schema.tool_name} calculated?`,
      answer: `${schema.tool_name} uses standard engineering formulas. All calculations are performed in-browser with no data storage.`,
    },
    {
      question: `What inputs does ${schema.tool_name} require?`,
      answer: `The tool accepts the key parameters shown in the input form. Each input includes reference ranges for guidance.`,
    },
    {
      question: `Is ${schema.tool_name} free to use?`,
      answer: `Yes. All free calculators on SectorCalc are completely free to use with browser-side processing. No account required.`,
    },
  ]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "SectorCalc", path: "/" },
    { name: "Free Tools", path: "/free-tools" },
    { name: schema.tool_name, path: `/tools/free/${slug}` },
  ]);
  const toolJsonLd: Record<string, unknown>[] = [faqJsonLd, breadcrumbJsonLd].filter(
    (item): item is Record<string, unknown> => item !== null,
  );

  return (
    <PageLayout>
      <SemanticJsonLd data={toolJsonLd} />
      <article aria-label={schema.tool_name} className="sc-v531-shell">
        <ProToolSessionWrapper
          schema={schema}
          toolKey={slug}
          executeEndpoint="/api/tool-execute"
          initialProfileMode="engineering"
          accessTier="FREE"
          presentationMode="FREE_COMPACT"
        />
      </article>
    </PageLayout>
  );
}
