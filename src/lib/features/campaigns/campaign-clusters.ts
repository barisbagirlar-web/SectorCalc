import { buildUtmHref, type AttributionContext } from "@/lib/infrastructure/analytics/attribution";

export type CampaignChannel =
  | "seo"
  | "linkedin"
  | "reddit"
  | "search_ads"
  | "email"
  | "whatsapp";

export type CampaignCluster = {
  readonly id: string;
  readonly name: string;
  readonly audience: string;
  readonly primaryPain: string;
  readonly landingHref: string;
  readonly freeToolHrefs: readonly string[];
  readonly premiumAnalyzerHrefs: readonly string[];
  readonly pricingHref: string;
  readonly betaPartnerHref: string;
  readonly utmCampaign: string;
  readonly recommendedChannels: readonly CampaignChannel[];
};

const PRICING_HREF = "/pricing";
const BETA_PARTNER_HREF = "/beta-partner";

export const CAMPAIGN_CLUSTERS: readonly CampaignCluster[] = [
  {
    id: "manufacturing-hidden-loss",
    name: "Manufacturing Hidden Loss",
    audience: "CNC shops, sheet metal, production managers",
    primaryPain: "Scrap, OEE drift and setup overrun eroding quoted margin",
    landingHref: "/seo/manufacturing-cost-calculators",
    freeToolHrefs: [
      "/tools/free/machine-time-calculator",
      "/tools/free/oee-calculator",
      "/tools/free/scrap-rate-calculator",
    ],
    premiumAnalyzerHrefs: [
      "/tools/premium-schema/cnc-oee-loss",
      "/tools/premium-schema/cnc-tool-wear-cost",
      "/tools/premium-schema/sheet-metal-scrap-risk",
    ],
    pricingHref: PRICING_HREF,
    betaPartnerHref: BETA_PARTNER_HREF,
    utmCampaign: "manufacturing-hidden-loss",
    recommendedChannels: ["seo", "linkedin", "reddit"],
  },
  {
    id: "construction-cost-overrun",
    name: "Construction Cost Overrun",
    audience: "Contractors, estimators, project leads",
    primaryPain: "Bid margin leaks from rework, weather and subcontractor exposure",
    landingHref: "/seo/construction-cost-calculators",
    freeToolHrefs: [
      "/tools/free/concrete-volume-calculator",
      "/tools/free/roofing-area-calculator",
      "/tools/free/home-renovation-m2-calculator",
    ],
    premiumAnalyzerHrefs: [
      "/tools/premium-schema/construction-project-overrun",
      "/tools/premium-schema/construction-subcontractor-margin-leak",
    ],
    pricingHref: PRICING_HREF,
    betaPartnerHref: BETA_PARTNER_HREF,
    utmCampaign: "construction-cost-overrun",
    recommendedChannels: ["seo", "linkedin", "search_ads"],
  },
  {
    id: "logistics-route-cost",
    name: "Logistics Route Cost",
    audience: "Fleet operators, dispatchers, logistics owners",
    primaryPain: "Deadhead, fuel drift and route cost underestimation",
    landingHref: "/seo/logistics-route-calculators",
    freeToolHrefs: [
      "/tools/free/route-cost-calculator",
      "/tools/free/fuel-consumption-calculator",
      "/tools/free/desi-calculator",
    ],
    premiumAnalyzerHrefs: [
      "/tools/premium-schema/logistics-route-loss",
      "/tools/premium-schema/logistics-fuel-route-drift",
    ],
    pricingHref: PRICING_HREF,
    betaPartnerHref: BETA_PARTNER_HREF,
    utmCampaign: "logistics-route-cost",
    recommendedChannels: ["seo", "linkedin", "whatsapp"],
  },
  {
    id: "restaurant-food-margin",
    name: "Restaurant Food Margin",
    audience: "Restaurant owners, kitchen managers, F&B operators",
    primaryPain: "Food cost drift, portion variance and menu margin leaks",
    landingHref: "/industries/restaurant",
    freeToolHrefs: [
      "/tools/free/food-cost-calculator",
      "/tools/free/portion-cost-calculator",
      "/tools/free/recipe-cost-check",
    ],
    premiumAnalyzerHrefs: [
      "/tools/premium-schema/food-waste-margin-loss",
      "/tools/premium-schema/restaurant-menu-margin-leak",
    ],
    pricingHref: PRICING_HREF,
    betaPartnerHref: BETA_PARTNER_HREF,
    utmCampaign: "restaurant-food-margin",
    recommendedChannels: ["seo", "linkedin", "reddit"],
  },
  {
    id: "energy-carbon-exposure",
    name: "Energy & Carbon Exposure",
    audience: "Plant managers, sustainability leads, energy buyers",
    primaryPain: "Peak load cost spikes and carbon compliance exposure",
    landingHref: "/seo/energy-carbon-calculators",
    freeToolHrefs: [
      "/tools/free/kwh-cost-calculator",
      "/tools/free/carbon-footprint-quick",
      "/tools/free/cbam-exposure-quick-check",
    ],
    premiumAnalyzerHrefs: [
      "/tools/premium-schema/energy-peak-cost",
      "/tools/premium-schema/energy-compressor-leak-cost",
      "/tools/premium-schema/carbon-footprint-compliance-risk",
    ],
    pricingHref: PRICING_HREF,
    betaPartnerHref: BETA_PARTNER_HREF,
    utmCampaign: "energy-carbon-exposure",
    recommendedChannels: ["seo", "linkedin", "email"],
  },
  {
    id: "agriculture-yield-loss",
    name: "Agriculture Yield Loss",
    audience: "Farm operators, irrigation managers, dairy owners",
    primaryPain: "Irrigation waste, feed inefficiency and yield variance",
    landingHref: "/seo/agriculture-calculators",
    freeToolHrefs: [
      "/tools/free/irrigation-cost-check",
      "/tools/free/crop-yield-calculator",
      "/tools/free/feed-cost-estimator",
    ],
    premiumAnalyzerHrefs: [
      "/tools/premium-schema/agriculture-irrigation-yield-loss",
      "/tools/premium-schema/dairy-feed-efficiency-loss",
    ],
    pricingHref: PRICING_HREF,
    betaPartnerHref: BETA_PARTNER_HREF,
    utmCampaign: "agriculture-yield-loss",
    recommendedChannels: ["seo", "whatsapp", "email"],
  },
  {
    id: "business-finance-calculators",
    name: "Business Finance Calculators",
    audience: "SMB owners, finance leads, operators",
    primaryPain: "Break-even blind spots, cash gaps and API cost overruns",
    landingHref: "/seo/finance-business-calculators",
    freeToolHrefs: [
      "/tools/free/break-even-calculator",
      "/tools/free/roi-calculator",
      "/tools/free/cash-flow-gap-calculator",
    ],
    premiumAnalyzerHrefs: [
      "/tools/premium-schema/cloud-api-cost-overrun",
      "/tools/premium-schema/legal-interest-fee-calculator-pro",
    ],
    pricingHref: PRICING_HREF,
    betaPartnerHref: BETA_PARTNER_HREF,
    utmCampaign: "business-finance-calculators",
    recommendedChannels: ["seo", "linkedin", "search_ads"],
  },
  {
    id: "unit-conversion-traffic",
    name: "Unit Conversion Traffic",
    audience: "Engineers, estimators, general calculator users",
    primaryPain: "Conversion errors and calibration drift in operational estimates",
    landingHref: "/seo/unit-conversion-calculators",
    freeToolHrefs: [
      "/tools/free/area-converter",
      "/tools/free/length-converter",
      "/tools/free/weight-converter",
      "/tools/free/volume-converter",
    ],
    premiumAnalyzerHrefs: ["/tools/premium-schema/calibration-drift-risk"],
    pricingHref: PRICING_HREF,
    betaPartnerHref: BETA_PARTNER_HREF,
    utmCampaign: "unit-conversion-traffic",
    recommendedChannels: ["seo", "reddit", "search_ads"],
  },
] as const;

export function getCampaignClusterById(id: string): CampaignCluster | undefined {
  return CAMPAIGN_CLUSTERS.find((cluster) => cluster.id === id);
}

export function buildCampaignUrl(
  href: string,
  clusterId: string,
  source: string,
  medium: string
): string {
  const cluster = getCampaignClusterById(clusterId);
  const context: AttributionContext = {
    utmSource: source,
    utmMedium: medium,
    utmCampaign: cluster?.utmCampaign ?? clusterId,
  };
  return buildUtmHref(href, context);
}
