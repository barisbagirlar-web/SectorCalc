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
          },
          {
            "@type": "Offer",
            name: "Pro",
            price: "19",
            priceCurrency: "USD",
            url: `${SITE_URL}/pricing`,
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
    inLanguage: ["en", "tr", "de", "fr", "es", "ar"],
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/{locale}/tools/generated/{slug}?{input_params}`,
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
 * Build search action with SpeakableSpecification for voice/AI search optimization.
 */
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
      // === PRODUCT & INDUSTRY RELATIONSHIPS (Graph RAG topology) ===
      ...buildIndustryRelationships(),
    ],
  }) as JsonLdRecord;
}

export const entityGraph = buildEntityGraph("en");
