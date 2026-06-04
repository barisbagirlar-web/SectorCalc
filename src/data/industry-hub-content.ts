import type { IndustrySlug } from "@/data/industries";

export interface IndustryHubContent {
  hubTitle: string;
  seoDescription: string;
  painStatement: string;
  freeToolExplanation: string;
  premiumToolExplanation: string;
  whoItsFor: string;
  decisionHelp: string;
}

export const INDUSTRY_HUB_CONTENT: Record<IndustrySlug, IndustryHubContent> = {
  construction: {
    hubTitle: "Construction decision tools",
    seoDescription:
      "Construction sector tools: quick project cost estimates and premium change order impact analysis for contractors and estimators.",
    painStatement:
      "Contractors often bid and approve change orders without a clear view of how extra labor, materials and schedule risk affect total project margin. A small scope change can erase profit on the base contract.",
    freeToolExplanation:
      "Project Cost Estimator gives a fast directional project cost from materials, labor, equipment, overhead and contingency — useful before you commit to a bid range.",
    premiumToolExplanation:
      "Change Order Impact Analyzer models minimum safe change pricing, margin impact on the full project, scenario paths and risk level before you approve scope changes.",
    whoItsFor:
      "General contractors, specialty subs, estimators, project managers and construction consultants.",
    decisionHelp:
      "Decide whether a bid is in a safe range, whether a change order protects margin, and what to communicate to the client before signing.",
  },
  cleaning: {
    hubTitle: "Cleaning decision tools",
    seoDescription:
      "Commercial cleaning tools: job cost estimates and office cleaning bid optimization for operators and facility services teams.",
    painStatement:
      "Commercial cleaning operators often win contracts on price without seeing how crew hours, supplies, travel and overhead compress margin — especially on recurring office routes.",
    freeToolExplanation:
      "Cleaning Cost Estimator produces a quick job or contract cost from area, crew size, labor, supplies and travel assumptions.",
    premiumToolExplanation:
      "Office Cleaning Bid Optimizer helps set a minimum safe monthly bid, compare customer budget gaps, margin at budget and risk signals for recurring contracts.",
    whoItsFor:
      "Cleaning business owners, operations managers, bid coordinators and facility-services consultants.",
    decisionHelp:
      "Decide whether to accept a contract price, where to adjust crew or scope, and how much margin protection you need on recurring work.",
  },
  restaurant: {
    hubTitle: "Restaurant decision tools",
    seoDescription:
      "Restaurant sector tools: food cost calculator and menu profit leak detection for owners, operators and hospitality consultants.",
    painStatement:
      "Restaurants lose margin when menu pricing, waste, labor and delivery commissions drift out of sync. High-volume items can look busy while quietly eroding profit.",
    freeToolExplanation:
      "Food Cost Calculator estimates plate cost and food cost percentage from ingredients, portions, waste and selling price.",
    premiumToolExplanation:
      "Menu Profit Leak Detector surfaces margin leaks across labor, waste and delivery commission with scenarios, risk level and pricing recommendations.",
    whoItsFor:
      "Restaurant owners, chefs, operators, franchise managers and hospitality consultants.",
    decisionHelp:
      "Decide which menu items to reprice, promote or rework before margin damage shows up in monthly P&L.",
  },
  ecommerce: {
    hubTitle: "E-commerce decision tools",
    seoDescription:
      "E-commerce margin tools: product margin calculator and return-rate profit erosion analysis for online sellers and brand operators.",
    painStatement:
      "Online sellers often optimize for revenue while returns, fees, shipping and ad spend quietly erode net margin across the catalog.",
    freeToolExplanation:
      "Product Margin Calculator estimates SKU margin after COGS, shipping, platform fees, payment processing and returns.",
    premiumToolExplanation:
      "Return Rate Profit Erosion Tool quantifies how return rates and ad cost affect net margin, with scenarios, risk signals and catalog-level recommendations.",
    whoItsFor:
      "E-commerce operators, brand owners, marketplace sellers, growth teams and retail consultants.",
    decisionHelp:
      "Decide which SKUs to reprice, pause ads on, or fix operationally before returns and fees destroy contribution margin.",
  },
  "cnc-manufacturing": {
    hubTitle: "CNC & Manufacturing decision tools",
    seoDescription:
      "CNC and manufacturing tools: machine hour cost estimator and minimum safe quote analyzer for job shops and small manufacturers.",
    painStatement:
      "Small production shops often price jobs with incomplete visibility into machine time, setup, scrap, tooling and overhead. A small costing error can turn a profitable order into a loss.",
    freeToolExplanation:
      "Machine Hour Estimator helps estimate basic hourly machine cost from monthly machine, labor, energy, maintenance and overhead inputs.",
    premiumToolExplanation:
      "CNC Minimum Safe Quote Analyzer calculates the minimum quote required to protect target margin after setup, tooling, material and scrap — with scenarios and risk level.",
    whoItsFor:
      "CNC shops, job shops, small manufacturers, production managers and manufacturing consultants.",
    decisionHelp:
      "Decide the floor price for a job, whether batch size or setup assumptions make the quote risky, and what to adjust before sending a quote.",
  },
};

export function getIndustryHubContent(slug: IndustrySlug): IndustryHubContent {
  return INDUSTRY_HUB_CONTENT[slug];
}
