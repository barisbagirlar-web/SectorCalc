/**
 * SectorCalc — Per-Tool-Page Unified Schema.org @graph Generator
 * ===============================================================
 *
 * Mandate requirement: Every tool page emits a single
 * <script type="application/ld+json"> containing a @graph with:
 *   Organization, Person, WebApplication, HowTo, FAQPage, Dataset
 *
 * This is NOT a flat set of independent JSON-LD blocks — it is
 * one unified graph where nodes cross-reference via @id.
 */

import { SITE, siteUrl } from "@/config/site";
import { BRAND_ASSETS } from "@/config/brand";
import { FOUNDER_PROFILE, buildOrganizationSameAs, buildFounderSameAs } from "@/config/knowledge-graph";
import { ORGANIZATION_TRUST } from "@/config/organization-trust";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

// ── Graph node @id anchors ───────────────────────────────────────────────

const ORG_ID = `${siteUrl}/#organization`;
const FOUNDER_ID = `${siteUrl}/#founder`;
const APP_ID_BASE = `${siteUrl}`;

// ── Types ─────────────────────────────────────────────────────────────────

export interface ToolPageSchemaInput {
  /** Tool slug (used in canonical URL). */
  slug: string;
  /** Tool display name. */
  toolName: string;
  /** Sector/industry name for context. */
  sectorName: string;
  /** Tool tier: free or pro. */
  tier: "free" | "pro";
  /** SEO description. */
  description: string;
  /** Key features bullet list. */
  featureList: string[];
  /** FAQ entries. */
  faq: readonly { question: string; answer: string }[];
  /** Author slug (from team pages). */
  authorSlug?: string;
  /** Author full name. */
  authorName?: string;
  /** Author job title. */
  authorJobTitle?: string;
  /** Author LinkedIn URL. */
  authorLinkedIn?: string;
  /** Data source citations. */
  dataSources?: readonly { name: string; url: string }[];
  /** Methodology standard reference (e.g. "ECMI Cost Model v3.2 + ISO 22400-2"). */
  methodology?: string;
  /** Screenshot URL. */
  screenshotUrl?: string;
  /** Price in USD. */
  priceUsd?: string;
  /** Aggregate rating value (1-5). */
  ratingValue?: number;
  /** Review count. */
  reviewCount?: number;
  /** Last updated ISO date. */
  lastUpdated?: string;
  /** Tool category for applicationCategory. */
  applicationCategory?: string;
}

// ── Builders ──────────────────────────────────────────────────────────────

function buildOrganizationNode(): JsonLdRecord {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORGANIZATION_TRUST.displayName,
    url: siteUrl,
    logo: `${siteUrl}${BRAND_ASSETS.logo.default}`,
    sameAs: buildOrganizationSameAs(),
      knowsAbout: [
        "financial modeling",
        "sector analysis",
        "CAPEX calculation",
        "OPEX modeling",
        "IRR/NPV",
        "break-even analysis",
        "ISO 22400-2",
        "ECMI Cost Model",
        "IFRS standards",
      ],
      areaServed: [
        {
          "@type": "Country",
          name: "United States",
        },
        {
          "@type": "Country",
          name: "United Kingdom",
        },
        {
          "@type": "Country",
          name: "Germany",
        },
        {
          "@type": "Country",
          name: "United Arab Emirates",
        },
        {
          "@type": "Continent",
          name: "Europe",
        },
        {
          "@type": "Continent",
          name: "North America",
        },
      ],
    };
  }

function buildPersonNode(input: ToolPageSchemaInput): JsonLdRecord {
  const authorSlug = input.authorSlug ?? "baris-bagirlar";
  const authorName = input.authorName ?? FOUNDER_PROFILE.name;
  const jobTitle = input.authorJobTitle ?? (FOUNDER_PROFILE.jobTitle as Record<string, string>).en ?? "Founder & CEO, SectorCalc";

  return {
    "@type": "Person",
    "@id": `${siteUrl}/team/${authorSlug}/#person`,
    name: authorName,
    jobTitle,
    worksFor: { "@id": ORG_ID },
    sameAs: input.authorLinkedIn
      ? [input.authorLinkedIn]
      : buildFounderSameAs(),
    knowsAbout: [input.sectorName, input.toolName],
  };
}

function buildWebApplicationNode(input: ToolPageSchemaInput): JsonLdRecord {
  const canonicalUrl = `${siteUrl}/${input.tier === "free" ? `tools/free/${input.slug}` : `tools/pro/${input.slug}`}`;
  const appCategory = input.applicationCategory ?? "FinanceApplication";

  const node: JsonLdRecord = {
    "@type": "WebApplication",
    "@id": `${canonicalUrl}/#app`,
    name: input.toolName,
    applicationCategory: appCategory,
    operatingSystem: "Web, Mobile",
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      price: input.priceUsd ?? (input.tier === "free" ? "0" : "19"),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: input.featureList.join(", "),
  };

  if (input.methodology) {
    const citations: JsonLdRecord[] = [];

    // Primary standard reference (ISO/ASME/ASTM/etc.)
    citations.push({
      "@type": "Standard",
      name: input.methodology,
      url: canonicalUrl,
    });

    // Secondary reference: lean/engineering principles
    citations.push({
      "@type": "CreativeWork",
      name: "Lean Manufacturing Principles",
      url: "https://www.lean.org/",
    });

    node.citation = citations;
    node.potentialAction = {
      "@type": "CalculateAction",
      name: `Calculate ${input.toolName}`,
      description: "Deterministic calculation based on international engineering standards.",
    };
  }

  if (input.screenshotUrl) {
    node.screenshot = input.screenshotUrl;
  }

  if (input.ratingValue && input.reviewCount) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(input.ratingValue),
      reviewCount: input.reviewCount,
      bestRating: "5",
    };
  }

  return node;
}

function buildHowToNode(input: ToolPageSchemaInput): JsonLdRecord {
  return {
    "@type": "HowTo",
    name: `How to use ${input.toolName}`,
    step: [
      {
        "@type": "HowToStep",
        name: "Enter your inputs",
        text: `Fill in the ${input.sectorName} parameters — values you already know from your operations or quotes.`,
      },
      {
        "@type": "HowToStep",
        name: "Review the calculation",
        text: `${input.tier === "pro" ? "The Pro analyzer computes hidden-loss diagnostics, safe-price thresholds and a verdict." : "The free calculator gives a directional estimate with early risk signals."}`,
      },
      {
        "@type": "HowToStep",
        name: "Export or share",
        text: input.tier === "pro"
          ? "Export the decision report as PDF for management or client review."
          : "Use the result as a sanity check. Upgrade to Pro for export and full diagnostics.",
      },
    ],
  };
}

function buildBreadcrumbNode(input: ToolPageSchemaInput): JsonLdRecord {
  const isFree = input.tier === "free";
  const toolPath = isFree ? `tools/free/${input.slug}` : `tools/pro/${input.slug}`;
  const canonicalUrl = `${siteUrl}/${toolPath}`;
  // Level-2 points to the real catalog hub (free-tools / pro-tools), not a
  // synthetic /tools/free/ index that does not exist as a route.
  const hubName = isFree ? "Free Tools" : "Pro Tools";
  const hubPath = isFree ? "free-tools" : "pro-tools";

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}/#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: hubName, item: `${siteUrl}/${hubPath}` },
      { "@type": "ListItem", position: 3, name: input.toolName, item: canonicalUrl },
    ],
  };
}

function buildFAQNode(input: ToolPageSchemaInput): JsonLdRecord | null {
  const valid = input.faq.filter(
    (item) => item.question.trim().length > 0 && item.answer.trim().length > 0,
  );
  // Emitting a FAQPage with an empty mainEntity is invalid structured data and
  // triggers Google Rich Results warnings; omit the node entirely when empty.
  if (valid.length === 0) {
    return null;
  }

  return {
    "@type": "FAQPage",
    mainEntity: valid.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function buildDatasetNode(input: ToolPageSchemaInput): JsonLdRecord | null {
  if (!input.dataSources || input.dataSources.length === 0) {
    return null;
  }

  return {
    "@type": "Dataset",
    name: `${input.sectorName} Reference Data — ${input.toolName}`,
    description: `Benchmark and reference data for ${input.sectorName} calculations in ${input.toolName}.`,
    creator: { "@id": ORG_ID },
    citation: input.dataSources.map((ds) => ds.url),
    // Freshness signal must be a stable, source-derived date. Never fall back to
    // request-time here: on a force-dynamic page that churns dateModified on
    // every crawl (a manipulative freshness signal). When no real date is
    // known, the field is omitted by sanitizeJsonLd (undefined stripped).
    dateModified: input.lastUpdated,
  };
}

/**
 * Build the single unified @graph JSON-LD block for a tool page.
 *
 * Returns a sanitized JSON-LD object suitable for injection into a
 * <script type="application/ld+json"> tag.
 */
export function buildToolPageGraph(input: ToolPageSchemaInput): JsonLdRecord {
  const graph: JsonLdRecord[] = [
    buildOrganizationNode(),
    buildPersonNode(input),
    buildWebApplicationNode(input),
    buildBreadcrumbNode(input),
    buildHowToNode(input),
  ];

  const faq = buildFAQNode(input);
  if (faq) {
    graph.push(faq);
  }

  const dataset = buildDatasetNode(input);
  if (dataset) {
    graph.push(dataset);
  }

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@graph": graph,
  }) as JsonLdRecord;
}
