type AppLocale = "en";
import { BRAND_ASSETS } from "@/config/brand";
import {
  FOUNDER_PROFILE,
  INDUSTRY_WIKIDATA_QID,
  TOPIC_WIKIDATA_ENTITIES,
  buildFounderSameAs,
  buildOrganizationSameAs,
  wikidataUrl,
} from "@/config/knowledge-graph";
import { ORGANIZATION_TRUST, organizationDescriptionForLocale } from "@/config/organization-trust";
import { SITE } from "@/config/site";
import { academicReferences } from "@/lib/infrastructure/seo/academic-references";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";
import { absoluteImageUrl, absoluteLocalizedUrl, SITE_URL } from "@/lib/features/semantic/site-url";

/**
 * Standard shipping details for digital products (free delivery, 1–5 business days transit).
 */
const SHIPPING_DETAILS: JsonLdRecord = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "0",
    currency: "USD",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 1,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 5,
      unitCode: "DAY",
    },
  },
} as const;

/**
 * Standard return policy: 14-day finite return window, free return by mail.
 */
const RETURN_POLICY: JsonLdRecord = {
  "@type": "MerchantReturnPolicy",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
} as const;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const FOUNDER_ID = `${SITE_URL}/#founder-baris-bagirlar`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SOFTWARE_ID = `${SITE_URL}/#software-application`;
const PRODUCT_ID = `${SITE_URL}/#product`;

function academicPersonNode(ref: (typeof academicReferences)[number]): JsonLdRecord {
  const sameAs = ref.profileUrl ? [ref.mathSciNetUrl, ref.profileUrl] : [ref.mathSciNetUrl];

  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#${ref.id}`,
    name: ref.name,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: ref.affiliation,
    },
    sameAs,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "MathSciNetAuthorID",
      value: String(ref.mrId),
    },
  };
}

/**
 * Build one industry DefinedTerm node, attaching a verified Wikidata `sameAs`
 * when the taxonomy fragment is mapped in INDUSTRY_WIKIDATA_QID.
 */
function industryTermNode(fragment: string, name: string): JsonLdRecord {
  const qid = INDUSTRY_WIKIDATA_QID[fragment];
  const node: JsonLdRecord = {
    "@type": "DefinedTerm",
    "@id": `${SITE_URL}/#${fragment}`,
    name,
    inDefinedTermSet: `${SITE_URL}/#industry-set`,
  };
  if (qid) {
    node.sameAs = wikidataUrl(qid);
  }
  return node;
}

/**
 * Topical entities the platform covers, linked to canonical Wikidata items.
 * Emitted as DefinedTerm nodes and referenced from Organization.knowsAbout so
 * knowledge graphs can disambiguate SectorCalc's areas of expertise.
 */
function buildTopicKnowledgeNodes(): JsonLdRecord[] {
  return TOPIC_WIKIDATA_ENTITIES.map((topic) => ({
    "@type": "DefinedTerm",
    "@id": `${SITE_URL}/#topic-${topic.qid}`,
    name: topic.name,
    termCode: topic.qid,
    sameAs: wikidataUrl(topic.qid),
    inDefinedTermSet: `${SITE_URL}/#topic-set`,
  }));
}

/**
 * Build the sector/industry relationship map for Graph RAG topology.
 * These relations enable AI systems to traverse entity connections
 * (e.g., "SectorCalc CNC → used in → Manufacturing Industry").
 */
function buildIndustryRelationships(): JsonLdRecord[] {
  return [
    {
      "@type": "DefinedTermSet",
      "@id": `${SITE_URL}/#industry-set`,
      name: "SectorCalc Industry Categories",
      description: "Complete industry taxonomy for SectorCalc platform",
      hasDefinedTerm: [
        industryTermNode("industry-cnc-manufacturing", "CNC & Advanced Manufacturing"),
        industryTermNode("industry-construction", "Construction & Site Management"),
        industryTermNode("industry-logistics", "Logistics & Transport"),
        industryTermNode("industry-energy", "Energy & Sustainability"),
        industryTermNode("industry-agriculture", "Agriculture & Food"),
        industryTermNode("industry-finance", "Finance & Working Capital"),
        industryTermNode("industry-quality", "Quality & Six Sigma"),
        industryTermNode("industry-digital-factory", "Digital Factory & Automation"),
        industryTermNode("industry-hvac", "HVAC & Mechanical Systems"),
        industryTermNode("industry-electrical", "Electrical & Power Systems"),
        industryTermNode("industry-food", "Food, Cold Chain & Hygiene"),
        industryTermNode("industry-textile", "Textile, Printing & Lab"),
        industryTermNode("industry-hse", "HSE & Ergonomics"),
      ],
    },
    {
      "@type": "DefinedTermSet",
      "@id": `${SITE_URL}/#topic-set`,
      name: "SectorCalc Expertise Topics",
      description: "Topical areas covered by SectorCalc, linked to Wikidata entities",
      hasDefinedTerm: buildTopicKnowledgeNodes(),
    },
    {
      "@type": "Product",
      "@id": PRODUCT_ID,
      name: "SectorCalc Platform",
      description: "Sector-specific calculation and decision-report platform",
      brand: {
        "@type": "Brand",
        name: "SectorCalc",
      },
      manufacturer: { "@id": ORGANIZATION_ID },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "0",
        highPrice: "19",
        offerCount: "2",
        offers: [
          {
            "@type": "Offer",
            name: "Free calculators",
            price: "0",
            priceCurrency: "USD",
            url: `${SITE_URL}/free-tools`,
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Pro",
            price: "19",
            priceCurrency: "USD",
            url: `${SITE_URL}/pricing`,
            availability: "https://schema.org/InStock",
          },
        ],
      },
      category: `${SITE_URL}/#industry-set`,
    },
  ];
}

/**
 * Build calculation action schema that showcases the platform's core capability.
 * This enables AI agents to understand what SectorCalc can do and use it as a tool.
 */
function buildPlatformCalculateAction(): JsonLdRecord {
  return {
    "@type": "Action",
    additionalType: "https://schema.org/CalculateAction",
    "@id": `${SITE_URL}/#calculate-action-platform`,
    name: "SectorCalc - Sector-specific calculation platform",
    description: "Run sector-specific calculations across manufacturing, construction, logistics, energy, agriculture, food, finance and business operations.",
    inLanguage: "en",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/tools/free/{slug}?{input_params}`,
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
      contentType: "application/json",
    },
    object: {
      "@type": "SoftwareApplication",
      "@id": SOFTWARE_ID,
      name: "SectorCalc",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: SITE.defaultDescription,
    },
    instrument: [
      {
        "@type": "PropertyValueSpecification",
        name: "Sector/Industry",
        description: "Target industry sector for calculation",
        valueName: "industry",
        valueRequired: true,
        valueType: "Text",
        valuePattern: "cnc-manufacturing|construction|logistics|energy|agriculture|food|finance|hvac|electrical|textile|quality|hse|digital-factory",
      },
      {
        "@type": "PropertyValueSpecification",
        name: "Calculation Type",
        description: "Type of calculation to perform",
        valueName: "calculationType",
        valueRequired: true,
        valueType: "Text",
        valuePattern: "cost|efficiency|margin|loss|break-even|carbon|oee|scrap|yield|energy|route|workforce|maintenance|compliance",
      },
      {
        "@type": "PropertyValueSpecification",
        name: "Input Parameters",
        description: "Tool-specific input values (varies by calculator)",
        valueName: "params",
        valueRequired: true,
        valueType: "JSON",
      },
    ],
    result: [
      {
        "@type": "PropertyValue",
        name: "Calculation Result",
        description: "Primary computed value with unit",
        valueType: "Number",
      },
      {
        "@type": "PropertyValue",
        name: "Hidden Loss Diagnosis",
        description: "Identified loss drivers and their magnitudes",
        valueType: "JSON",
      },
      {
        "@type": "PropertyValue",
        name: "Risk Assessment",
        description: "Threshold-based risk indicators",
        valueType: "JSON",
      },
      {
        "@type": "PropertyValue",
        name: "Suggested Actions",
        description: "Recommended actions based on results",
        valueType: "Text",
      },
    ],
  };
}

/**
 * DIN/ISO Semantic Bridge — the "German Engineering" trust signal.
 *
 * Exploits the .de TLD's inherent authority for precision engineering
 * by cross-referencing German DIN standards with global ISO/ASME
 * standards in a single English-language entity graph.
 *
 * Google Knowledge Graph uses these cross-references to classify
 * SectorCalc as a Global Engineering Authority rather than a local
 * German calculator, while still inheriting the .de domain authority.
 */
export interface DinIsoBridgeInput {
  /** Tool route slug (e.g. "din-6930-blanking-clearance"). */
  slug: string;
  /** DIN standard identifier (e.g. "DIN 6930-2"). */
  dinStandard: string;
  /** ISO standard identifier (e.g. "ISO 7438"). */
  isoStandard: string;
  /** Human-readable tool name. */
  toolName: string;
}

const DIN_ISO_CATALOG: readonly { slug: string; din: string; iso: string; name: string }[] = [
  { slug: "din-6930-blanking-clearance", din: "DIN 6930-2", iso: "ISO 7438", name: "DIN 6930 vs ISO 7438 Blanking Clearance" },
  { slug: "din-iso-286-tolerance-fit", din: "DIN 7157", iso: "ISO 286-1", name: "DIN 7157 vs ISO 286 Tolerance Fit" },
  { slug: "din-iso-2768-general-tolerances", din: "DIN 2768-1", iso: "ISO 2768-1", name: "DIN 2768 vs ISO 2768 General Tolerances" },
  { slug: "din-iso-1302-surface-roughness", din: "DIN 4768", iso: "ISO 1302", name: "DIN 4768 vs ISO 1302 Surface Roughness" },
  { slug: "din-en-iso-13920-welding-tolerances", din: "DIN EN ISO 13920", iso: "ISO 13920", name: "DIN EN ISO 13920 Welding Tolerances" },
  { slug: "din-iso-1101-gdt", din: "DIN 7184", iso: "ISO 1101", name: "DIN 7184 vs ISO 1101 GD&T" },
  { slug: "din-iso-2862-tolerance", din: "DIN 7167", iso: "ISO 286-2", name: "DIN 7167 vs ISO 286-2 Tolerance Limits" },
  { slug: "din-iso-14405-tolerance-linier", din: "DIN 14405-1", iso: "ISO 14405-1", name: "DIN vs ISO 14405-1 Linear Tolerance" },
];

/**
 * Build a per-tool-page DIN/ISO bridge JSON-LD node.
 * Emits Standard citations for both DIN and ISO references,
 * enabling Google Knowledge Graph cross-linking.
 */
export function buildDinIsoBridgeNode(input: DinIsoBridgeInput): JsonLdRecord {
  const canonicalUrl = `${SITE_URL}/calculators/${input.slug}`;

  return {
    "@type": "WebApplication",
    "@id": `${canonicalUrl}/#app`,
    name: input.toolName,
    inLanguage: "en",
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Web, Mobile",
    knowsAbout: [
      "GD&T tolerance stack-up",
      "Metrology",
      "Lean Manufacturing",
      "Precision engineering",
    ],
    citation: [
      {
        "@type": "Standard",
        name: `DIN ${input.dinStandard} (German Institute for Standardization)`,
        url: `https://www.din.de/en/search?query=${encodeURIComponent(input.dinStandard)}`,
      },
      {
        "@type": "Standard",
        name: `${input.isoStandard}`,
        url: `https://www.iso.org/search.html?q=${encodeURIComponent(input.isoStandard)}`,
      },
    ],
  };
}

/**
 * Build a DefinedTermSet containing all DIN/ISO cross-reference standards
 * as discrete Standard nodes. Injected into the root entity graph so
 * Knowledge Graph can crawl the full taxonomy.
 */
export function buildDinIsoStandardsTaxonomy(): JsonLdRecord[] {
  const standards: JsonLdRecord[] = [];
  const seen = new Set<string>();

  for (const entry of DIN_ISO_CATALOG) {
    if (!seen.has(entry.din)) {
      seen.add(entry.din);
      standards.push({
        "@type": "Standard",
        "@id": `${SITE_URL}/#standard-din-${entry.din.replace(/\s/g, "-").toLowerCase()}`,
        name: `DIN ${entry.din}`,
        publisher: {
          "@type": "Organization",
          name: "Deutsches Institut f\u00FCr Normung (DIN)",
          url: "https://www.din.de/",
        },
      });
    }

    const isoKey = entry.iso.replace(/^ISO /, "");
    if (!seen.has(isoKey)) {
      seen.add(isoKey);
      standards.push({
        "@type": "Standard",
        "@id": `${SITE_URL}/#standard-${isoKey.replace(/\s/g, "-").toLowerCase()}`,
        name: entry.iso,
        publisher: {
          "@type": "Organization",
          name: "International Organization for Standardization (ISO)",
          url: "https://www.iso.org/",
        },
      });
    }
  }

  return [{
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/#din-iso-bridge-set`,
    name: "SectorCalc DIN-ISO Engineering Standards Cross-Reference",
    description: "German DIN standards mapped to international ISO/ASME equivalents for global precision engineering calculations.",
    hasDefinedTerm: standards,
  }];
}

function buildSearchActionWithSpeakable(): JsonLdRecord {
  return {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/free-tools?q={search_term_string}`,
      contentType: "application/json",
    },
    "query-input": "required name=search_term_string",
  };
}

/**
 * Central @graph entity mesh with Graph RAG topology.
 *
 * This enhanced entity graph connects Organization → Person → WebSite → Product → SoftwareApplication
 * with typed relationships that AI knowledge graphs can traverse.
 *
 * Graph RAG topology enables:
 * - Entity linking ("SectorCalc's CNC calculator is USED_IN Manufacturing Industry")
 * - Relationship traversal ("Who CREATED SectorCalc? Baris Bagirlar")
 * - Subgraph retrieval ("What calculations does SectorCalc support?")
 */
export function buildEntityGraph(locale: AppLocale = "en"): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      // === CORE ENTITIES ===
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: ORGANIZATION_TRUST.displayName,
        url: SITE_URL,
        logo: absoluteImageUrl(BRAND_ASSETS.logo.default),
        description: organizationDescriptionForLocale(locale),
        email: ORGANIZATION_TRUST.email,
        sameAs: buildOrganizationSameAs(),
        founder: { "@id": FOUNDER_ID },
        address: {
          "@type": "PostalAddress",
          streetAddress: ORGANIZATION_TRUST.address.streetAddress,
          addressLocality: ORGANIZATION_TRUST.address.addressLocality,
          addressCountry: "TR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: ORGANIZATION_TRUST.phone,
          email: ORGANIZATION_TRUST.email,
          contactType: ORGANIZATION_TRUST.contactType,
        },
        knowsAbout: [
          { "@id": `${SITE_URL}/#industry-set` },
          { "@id": `${SITE_URL}/#topic-set` },
          { "@id": PRODUCT_ID },
          ...TOPIC_WIKIDATA_ENTITIES.map((topic) => ({ "@id": `${SITE_URL}/#topic-${topic.qid}` })),
        ],
      },
      // === FOUNDER ===
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: FOUNDER_PROFILE.name,
        email: FOUNDER_PROFILE.email,
        jobTitle: FOUNDER_PROFILE.jobTitle[locale] ?? FOUNDER_PROFILE.jobTitle.en,
        url: absoluteLocalizedUrl(locale, "/about"),
        worksFor: { "@id": ORGANIZATION_ID },
        sameAs: buildFounderSameAs(),
        knowsAbout: SITE.defaultDescription,
      },
      // === ACADEMIC ADVISORS (E-E-A-T) ===
      ...academicReferences.map(academicPersonNode),
      // === WEBSITE ===
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: ORGANIZATION_TRUST.displayName,
        url: absoluteLocalizedUrl(locale, "/"),
        inLanguage: locale,
        publisher: { "@id": ORGANIZATION_ID },
        potentialAction: buildSearchActionWithSpeakable(),
      },
      // === PLATFORM CALCULATE ACTION (Tool capability) ===
      buildPlatformCalculateAction(),
      // === DIN/ISO ENGINEERING STANDARDS BRIDGE (German Engineering trust signal) ===
      ...buildDinIsoStandardsTaxonomy(),
      // === PRODUCT & INDUSTRY RELATIONSHIPS (Graph RAG topology) ===
      ...buildIndustryRelationships(),
    ],
  }) as JsonLdRecord;
}

export const entityGraph = buildEntityGraph("en");
