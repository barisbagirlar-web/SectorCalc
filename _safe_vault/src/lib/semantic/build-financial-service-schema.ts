import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { isFinanceLikeTool } from "@/lib/ai/is-finance-like-tool";
import { absoluteLocalizedUrl, SITE_URL } from "@/lib/semantic/site-url";
import { pickLocaleText } from "@/lib/semantic/semantic-locale-utils";
import type { SemanticToolContract } from "@/lib/semantic/tool-semantic-types";

export function shouldUseFinancialService(tool: SemanticToolContract): boolean {
  return isFinanceLikeTool({
    slug: tool.toolSlug,
    title: pickLocaleText(tool.title, "en"),
    description: pickLocaleText(tool.description, "en"),
    categorySlug: tool.category,
  });
}

/**
 * Full list of financial service types offered by SectorCalc.
 * Used in FinancialService schema for rich results eligibility.
 */
const PLATFORM_FINANCIAL_SERVICE_TYPES = [
  "Cost Estimation & Pricing",
  "Break-Even Analysis",
  "Margin & Profitability Analysis",
  "Cash Flow Forecasting",
  "Working Capital Assessment",
  "Return on Investment (ROI) Calculation",
  "Payback Period Analysis",
  "Net Present Value (NPV) Calculation",
  "Internal Rate of Return (IRR) Estimation",
  "Financial Ratio Analysis",
  "Debt Service Coverage Ratio (DSCR)",
  "Credit Risk Scoring",
  "Sensitivity & What-If Analysis",
  "Labor & Personnel Cost Analysis",
  "Material Cost Estimation",
  "Overhead Allocation",
  "Unit Cost Calculation",
  "Total Cost of Ownership (TCO)",
  "Life Cycle Cost Analysis",
  "Energy Cost Simulation",
  "Carbon Cost & CBAM Exposure",
  "Inventory Carrying Cost",
  "Logistics & Shipping Cost",
  "Maintenance Cost Optimization",
  "Quality Cost (COPQ) Analysis",
  "Scrap & Rework Cost Analysis",
  "Bid & Tender Pricing Estimation",
  "Price Indexation & Escalation",
] as const;

/**
 * Build an enhanced FinancialService schema for a specific tool.
 *
 * This schema enables:
 * - Google to display rich financial service results
 * - AI agents to identify financial/numerical tools
 * - Featured snippet eligibility for "cost calculator" type queries
 * - Better categorization in Google Knowledge Graph
 */
export function buildFinancialServiceSchema(
  tool: SemanticToolContract,
  locale: string,
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${absoluteLocalizedUrl(locale, tool.urlPath)}#financial-service`,
    name: pickLocaleText(tool.title, locale),
    description: pickLocaleText(tool.description, locale),
    url: absoluteLocalizedUrl(locale, tool.urlPath),
    provider: {
      "@type": "Organization",
      name: "SectorCalc",
      url: SITE_URL,
    },
    areaServed: "Global",
    serviceType: "Financial calculation and decision support",
    feesAndCommissionsSpecification: "Free tier available; premium reports available via Pro subscription ($19/mo) or single report ($9)",
    termsOfService: `${SITE_URL}/terms`,
  }) as JsonLdRecord;
}

/**
 * Build the platform-level FinancialService schema rendered on homepage.
 * This aggregates all financial service types into one schema for maximum
 * Knowledge Graph coverage and rich result eligibility.
 */
export function buildPlatformFinancialServiceSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE_URL}/#financial-service-platform`,
    name: "SectorCalc financial calculators",
    description:
      "Sector-specific pricing, margin, personnel, and decision-support calculators covering cost estimation, break-even analysis, margin analysis, cash flow forecasting, working capital assessment, ROI calculation, and financial ratio analysis across 17 industry categories.",
    url: absoluteLocalizedUrl(locale, "/pro-tools"),
    provider: {
      "@type": "Organization",
      name: "SectorCalc",
      url: SITE_URL,
    },
    areaServed: "Global",
    serviceType: PLATFORM_FINANCIAL_SERVICE_TYPES,
    feesAndCommissionsSpecification: "Free calculators: no cost. Premium decision reports: available via Pro subscription ($19/mo) or single report purchase ($9/report).",
    termsOfService: `${SITE_URL}/terms`,
    knowsAbout: `${SITE_URL}/pro-tools`,
  }) as JsonLdRecord;
}

/** @deprecated Use buildPlatformFinancialServiceSchema or buildFinancialServiceSchema(tool) */
export function buildFinancialServiceSchemaLegacy(locale: string): JsonLdRecord {
  return buildPlatformFinancialServiceSchema(locale);
}
