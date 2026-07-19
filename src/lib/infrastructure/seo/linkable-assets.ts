/**
 * SectorCalc — Digital PR & Linkable Asset Strategy
 * ===================================================
 *
 * Mandate: 4 quarterly linkable assets per year — original data studies
 * that journalists, analysts and researchers will link to.
 *
 * Q1: Global Manufacturing CAPEX Benchmarks 2026 (47 countries)
 * Q2: SaaS LTV/CAC Ratios by Sector (12 sectors, 500+ companies)
 * Q3: Retail Break-Even Analysis: Post-Pandemic Shift
 * Q4: Real Estate Cap Rate Trends 2020-2026
 *
 * Distribution channels: HARO/Qwoted, PR Newswire, LinkedIn, Reddit
 */

export interface LinkableAsset {
  /** Quarter identifier: Q1, Q2, Q3, Q4 */
  quarter: string;
  /** Publication year */
  year: number;
  /** Asset title for PR distribution */
  title: string;
  /** Slug for URL */
  slug: string;
  /** Short description for press release */
  description: string;
  /** Target journalists/publications */
  targetPublications: readonly string[];
  /** Subreddits for distribution */
  redditTargets: readonly string[];
  /** LinkedIn hashtags */
  linkedInTags: readonly string[];
  /** HARO/Qwoted keywords to monitor */
  journalistQueryKeywords: readonly string[];
}

export const LINKABLE_ASSETS_2026: readonly LinkableAsset[] = [
  {
    quarter: "Q1",
    year: 2026,
    title: "Global Manufacturing CAPEX Benchmarks 2026",
    slug: "global-manufacturing-capex-benchmarks-2026",
    description:
      "47-country comparison of manufacturing capital expenditure benchmarks including land, facility, machinery and installation costs. Data sourced from World Bank, IMF and sector-specific ECMI cost models.",
    targetPublications: [
      "Forbes Manufacturing",
      "IndustryWeek",
      "Manufacturing Global",
      "The Manufacturer",
    ],
    redditTargets: ["r/manufacturing", "r/industrialengineering", "r/supplychain"],
    linkedInTags: ["#Manufacturing", "#CAPEX", "#IndustrialInvestment", "#GlobalBenchmarks"],
    journalistQueryKeywords: [
      "manufacturing cost 2026",
      "CAPEX benchmark",
      "factory setup cost",
      "industrial investment trends",
    ],
  },
  {
    quarter: "Q2",
    year: 2026,
    title: "SaaS LTV/CAC Ratios by Sector",
    slug: "saas-ltv-cac-ratios-by-sector-2026",
    description:
      "Analysis of Lifetime Value to Customer Acquisition Cost ratios across 12 SaaS sectors based on 500+ publicly reported company metrics. Includes benchmarks for B2B, B2C, enterprise and SMB segments.",
    targetPublications: [
      "TechCrunch",
      "SaaStr",
      "Forbes SaaS",
      "Business Insider Tech",
    ],
    redditTargets: ["r/SaaS", "r/startups", "r/venturecapital"],
    linkedInTags: ["#SaaS", "#UnitEconomics", "#LTV", "#CAC", "#StartupMetrics"],
    journalistQueryKeywords: [
      "LTV CAC ratio",
      "SaaS unit economics 2026",
      "customer acquisition cost benchmark",
      "SaaS valuation metrics",
    ],
  },
  {
    quarter: "Q3",
    year: 2026,
    title: "Retail Break-Even Analysis: Post-Pandemic Shift",
    slug: "retail-break-even-post-pandemic-2026",
    description:
      "Comparative break-even analysis across retail sub-sectors (grocery, apparel, electronics, furniture, restaurants) tracking margin shifts from 2020-2026. Includes e-commerce vs brick-and-mortar margin comparison.",
    targetPublications: [
      "Retail Dive",
      "Modern Retail",
      "Forbes Retail",
      "National Retail Federation",
    ],
    redditTargets: ["r/retail", "r/ecommerce", "r/smallbusiness"],
    linkedInTags: ["#Retail", "#BreakEven", "#Ecommerce", "#RetailTrends"],
    journalistQueryKeywords: [
      "retail break-even 2026",
      "retail margin trends",
      "ecommerce vs retail margins",
      "post-pandemic retail analysis",
    ],
  },
  {
    quarter: "Q4",
    year: 2026,
    title: "Real Estate Cap Rate Trends 2020-2026",
    slug: "real-estate-cap-rate-trends-2020-2026",
    description:
      "Six-year cap rate trend analysis across commercial, industrial, multi-family and office real estate segments. Includes interest rate correlation, regional variance and forward-looking projections.",
    targetPublications: [
      "Forbes Real Estate",
      "Commercial Observer",
      "Bisnow",
      "The Real Deal",
    ],
    redditTargets: ["r/realestate", "r/commercialrealestate", "r/investing"],
    linkedInTags: ["#RealEstate", "#CapRate", "#CRE", "#PropertyInvestment"],
    journalistQueryKeywords: [
      "cap rate trends 2026",
      "commercial real estate benchmarks",
      "real estate investment returns",
      "property yield analysis",
    ],
  },
];

/** Distribution channels configuration */
export const DISTRIBUTION_CHANNELS = {
  haro: {
    name: "HARO (Help A Reporter Out)",
    responseTimeHours: 24,
    strategy:
      "Monitor queries daily. Respond within 24 hours with data-backed answers citing relevant linkable asset.",
  },
  qwoted: {
    name: "Qwoted",
    responseTimeHours: 24,
    strategy:
      "Set up keyword alerts for sector-specific queries. Pitch SectorCalc data when it strengthens the journalist's story.",
  },
  prNewswire: {
    name: "PR Newswire",
    strategy:
      "Issue press release for each quarterly linkable asset. Target industry-specific distribution lists.",
  },
  linkedIn: {
    name: "LinkedIn",
    strategy:
      "Share asset findings as posts and articles. Tag relevant CFO/analyst influencers. Use sector-specific hashtags.",
  },
  reddit: {
    name: "Reddit",
    strategy:
      "Share data findings in relevant subreddits. Focus on adding value, not self-promotion. Cite methodology transparently.",
  },
} as const;

/** Target: 50+ DR70+ backlinks per year */
export const BACKLINK_TARGET = {
  annualGoal: 50,
  minDomainRating: 70,
  tier1Publications: [
    "Forbes",
    "Bloomberg",
    "Financial Times",
    "Wall Street Journal",
    "Reuters",
    "Business Insider",
    "TechCrunch",
  ],
} as const;
