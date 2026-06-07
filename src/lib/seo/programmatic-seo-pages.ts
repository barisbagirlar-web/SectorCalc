export type ProgrammaticSeoLink = {
  readonly href: string;
  readonly label: string;
};

export type ProgrammaticSeoPage = {
  readonly slug: string;
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly intro: string;
  readonly featuredQuestion: string;
  readonly featuredAnswer: string;
  readonly featuredBullets: readonly string[];
  readonly freeToolLinks: readonly ProgrammaticSeoLink[];
  readonly premiumAnalyzerLinks: readonly ProgrammaticSeoLink[];
  readonly industryLinks: readonly ProgrammaticSeoLink[];
  readonly faq: readonly { readonly question: string; readonly answer: string }[];
  readonly relatedHubSlugs: readonly string[];
};

export const PROGRAMMATIC_SEO_PAGES: readonly ProgrammaticSeoPage[] = [
  {
    slug: "manufacturing-cost-calculators",
    title: "Manufacturing Cost Calculators",
    metaTitle: "Manufacturing Cost Calculators — OEE, Scrap & Shop-Floor Tools",
    metaDescription:
      "Free manufacturing calculators for OEE, scrap rate, tool wear and shop-floor exposure. Premium analyzers add hidden-loss diagnostics and decision reports.",
    intro:
      "Manufacturing teams use SectorCalc to estimate OEE, scrap exposure and capacity loss before quoting jobs or changing shift plans.",
    featuredQuestion: "What manufacturing calculators does SectorCalc provide?",
    featuredAnswer:
      "SectorCalc provides free manufacturing calculators for OEE, scrap rate, machine time and material yield, plus premium analyzers that turn those estimates into hidden-loss diagnostics with threshold checks and export-ready decision reports.",
    featuredBullets: [
      "Free OEE and scrap calculators for quick shop-floor estimates",
      "Premium CNC OEE loss analyzer for capacity exposure",
      "Links to industries and categories for deeper discovery",
    ],
    freeToolLinks: [
      { href: "/tools/free/oee-calculator", label: "OEE Calculator" },
      { href: "/tools/free/scrap-rate-calculator", label: "Scrap Rate Calculator" },
      { href: "/tools/free/cnc-cycle-time-calculator", label: "CNC Cycle Time Calculator" },
      { href: "/tools/free/machine-time-calculator", label: "Machine Time Calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/cnc-oee-loss", label: "CNC OEE Loss Analyzer" },
      { href: "/tools/premium-schema/cnc-tool-wear-cost", label: "CNC Tool Wear Cost Analyzer" },
      { href: "/tools/premium-schema/sheet-metal-scrap-risk", label: "Sheet Metal Scrap Risk Analyzer" },
    ],
    industryLinks: [
      { href: "/industries/cnc-manufacturing", label: "CNC Manufacturing" },
      { href: "/industries/sheet-metal", label: "Sheet Metal" },
    ],
    faq: [
      {
        question: "Are manufacturing calculators free?",
        answer: "Yes. SectorCalc free manufacturing calculators run in your browser with no sign-up required.",
      },
      {
        question: "When should I use a premium manufacturing analyzer?",
        answer:
          "Use a premium analyzer when the estimate affects pricing, capacity planning or a management decision and you need hidden drivers, thresholds and export-ready output.",
      },
    ],
    relatedHubSlugs: [
      "construction-cost-calculators",
      "unit-conversion-calculators",
      "hidden-loss-decision-reports",
    ],
  },
  {
    slug: "construction-cost-calculators",
    title: "Construction Cost Calculators",
    metaTitle: "Construction Cost Calculators — Concrete, Labor & Project Margin",
    metaDescription:
      "Free construction calculators for concrete volume, labor cost and project exposure. Premium reports add delay, margin and overrun diagnostics.",
    intro:
      "Contractors and estimators use SectorCalc to sanity-check material quantities, labor exposure and project margin before bidding.",
    featuredQuestion: "What construction calculators are available on SectorCalc?",
    featuredAnswer:
      "SectorCalc offers free construction calculators for concrete volume, area, labor cost and common field measurements, plus premium analyzers for project overrun, subcontractor margin leak and weather delay exposure.",
    featuredBullets: [
      "Concrete and measurement calculators for field estimates",
      "Premium construction overrun and margin analyzers",
      "Industry pages for roofing, HVAC, plumbing and more",
    ],
    freeToolLinks: [
      { href: "/tools/free/concrete-volume-calculator", label: "Concrete Volume Calculator" },
      { href: "/tools/free/area-converter", label: "Area Converter" },
      { href: "/tools/free/square-meter-calculator", label: "Square Meter Calculator" },
      { href: "/tools/free/roofing-area-calculator", label: "Roofing Area Calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/construction-project-overrun", label: "Construction Project Overrun Analyzer" },
      { href: "/tools/premium-schema/construction-subcontractor-margin-leak", label: "Subcontractor Margin Leak Analyzer" },
      { href: "/tools/premium-schema/roofing-weather-delay-risk", label: "Roofing Weather Delay Analyzer" },
    ],
    industryLinks: [
      { href: "/industries/construction", label: "Construction" },
      { href: "/industries/roofing", label: "Roofing" },
    ],
    faq: [
      {
        question: "Can I use SectorCalc instead of estimating software?",
        answer:
          "SectorCalc is a calculator and decision-report layer, not a full ERP or estimating system. Use it for quick checks and hidden-loss diagnostics.",
      },
    ],
    relatedHubSlugs: ["manufacturing-cost-calculators", "finance-business-calculators"],
  },
  {
    slug: "logistics-route-calculators",
    title: "Logistics & Route Calculators",
    metaTitle: "Logistics Route Calculators — Fuel, Deadhead & Freight Margin",
    metaDescription:
      "Free route and fuel calculators plus premium analyzers for route loss, deadhead exposure and freight margin decisions.",
    intro:
      "Dispatchers and owner-operators use SectorCalc to compare trip cost, fuel drift and route margin before accepting loads.",
    featuredQuestion: "How do logistics calculators help with route margin?",
    featuredAnswer:
      "Logistics calculators estimate trip cost, fuel use and time exposure from your inputs. Premium route analyzers separate loaded versus empty miles and show threshold pressure so you can reprice or reject low-margin loads.",
    featuredBullets: [
      "Route cost and fuel calculators for quick checks",
      "Premium route loss and fuel drift analyzers",
      "Links to logistics industries and premium tools",
    ],
    freeToolLinks: [
      { href: "/tools/free/route-cost-calculator", label: "Route Cost Calculator" },
      { href: "/tools/free/fuel-cost-calculator", label: "Fuel Cost Calculator" },
      { href: "/tools/free/freight-cost-calculator", label: "Freight Cost Calculator" },
      { href: "/tools/free/fuel-consumption-calculator", label: "Fuel Consumption Calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/logistics-route-loss", label: "Logistics Route Loss Analyzer" },
      { href: "/tools/premium-schema/logistics-fuel-route-drift", label: "Fuel Route Drift Analyzer" },
    ],
    industryLinks: [{ href: "/industries/logistics-transport", label: "Logistics & Transport" }],
    faq: [
      {
        question: "What is route deadhead cost?",
        answer:
          "Deadhead cost is the expense of running empty or under-loaded miles, including fuel, driver hours and tolls that do not earn revenue on that leg.",
      },
    ],
    relatedHubSlugs: ["energy-carbon-calculators", "finance-business-calculators"],
  },
  {
    slug: "energy-carbon-calculators",
    title: "Energy & Carbon Calculators",
    metaTitle: "Energy & Carbon Calculators — Peak Load, kWh & Compliance Exposure",
    metaDescription:
      "Free energy calculators and premium analyzers for peak load, utility cost and carbon compliance exposure.",
    intro:
      "Facilities and energy teams use SectorCalc to compare blended kWh cost against peak-hour exposure and carbon pressure.",
    featuredQuestion: "What is energy peak exposure?",
    featuredAnswer:
      "Energy peak exposure is the extra cost hidden inside average kWh when high-demand hours drive your true unit cost. SectorCalc calculators and premium analyzers help you see peak load, compressor leaks and carbon compliance pressure separately.",
    featuredBullets: [
      "Free kWh and energy cost calculators",
      "Premium peak cost and carbon compliance analyzers",
      "Export-ready reports on premium plans",
    ],
    freeToolLinks: [
      { href: "/tools/free/kwh-cost-calculator", label: "kWh Cost Calculator" },
      { href: "/tools/free/electricity-bill-calculator", label: "Electricity Bill Calculator" },
      { href: "/tools/free/carbon-footprint-quick", label: "Carbon Footprint Quick Check" },
      { href: "/tools/free/energy-consumption-check", label: "Energy Consumption Check" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/energy-peak-cost", label: "Energy Peak Cost Analyzer" },
      { href: "/tools/premium-schema/energy-compressor-leak-cost", label: "Compressor Leak Cost Analyzer" },
      { href: "/tools/premium-schema/carbon-footprint-compliance-risk", label: "Carbon Compliance Risk Analyzer" },
    ],
    industryLinks: [
      { href: "/industries/energy-consumption", label: "Energy Consumption" },
      { href: "/industries/energy-carbon", label: "Energy & Carbon" },
    ],
    faq: [
      {
        question: "Does SectorCalc replace an energy audit?",
        answer:
          "No. SectorCalc provides structured estimates and decision reports. Confirm critical compliance and engineering decisions with qualified professionals.",
      },
    ],
    relatedHubSlugs: ["logistics-route-calculators", "hidden-loss-decision-reports"],
  },
  {
    slug: "agriculture-calculators",
    title: "Agriculture Calculators",
    metaTitle: "Agriculture Calculators — Irrigation, Yield & Feed Efficiency",
    metaDescription:
      "Free agriculture calculators and premium analyzers for irrigation yield loss, feed efficiency and farm margin exposure.",
    intro:
      "Farm operators use SectorCalc to estimate irrigation cost, yield gaps and feed efficiency before season or contract decisions.",
    featuredQuestion: "What agriculture tools does SectorCalc offer?",
    featuredAnswer:
      "SectorCalc includes free agriculture calculators for crop planning, irrigation and cost ratios, plus premium analyzers for irrigation yield loss and dairy feed efficiency with threshold checks and export-ready reports.",
    featuredBullets: [
      "Crop and irrigation calculators for quick field estimates",
      "Premium yield and feed efficiency analyzers",
      "Industry pages for crops, dairy and irrigation",
    ],
    freeToolLinks: [
      { href: "/tools/free/crop-yield-calculator", label: "Crop Yield Calculator" },
      { href: "/tools/free/irrigation-cost-check", label: "Irrigation Cost Check" },
      { href: "/tools/free/feed-cost-estimator", label: "Feed Cost Estimator" },
      { href: "/tools/free/water-usage-calculator", label: "Water Usage Calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/agriculture-irrigation-yield-loss", label: "Irrigation Yield Loss Analyzer" },
      { href: "/tools/premium-schema/dairy-feed-efficiency-loss", label: "Dairy Feed Efficiency Analyzer" },
    ],
    industryLinks: [
      { href: "/industries/agriculture-crops", label: "Agriculture Crops" },
      { href: "/industries/agriculture-dairy", label: "Agriculture Dairy" },
    ],
    faq: [
      {
        question: "Are agriculture calculators region-specific?",
        answer:
          "Calculators use your inputs and stated assumptions. Local tariffs, soil and weather still require operator judgment.",
      },
    ],
    relatedHubSlugs: ["finance-business-calculators", "energy-carbon-calculators"],
  },
  {
    slug: "finance-business-calculators",
    title: "Finance & Business Calculators",
    metaTitle: "Finance & Business Calculators — Loan, Margin & Break-Even Tools",
    metaDescription:
      "Free finance and business calculators for loans, margins, break-even and pricing decisions across sectors.",
    intro:
      "Owners and operators use SectorCalc finance calculators for loan payments, break-even checks and quick margin math.",
    featuredQuestion: "What finance calculators are free on SectorCalc?",
    featuredAnswer:
      "SectorCalc provides free calculators for loans, mortgages, break-even, markup, ROI and common business ratios. Premium decision reports add hidden-loss diagnostics when the outcome affects pricing or operations.",
    featuredBullets: [
      "Loan, mortgage and break-even calculators",
      "No sign-up required for free tools",
      "Upgrade path to premium decision reports",
    ],
    freeToolLinks: [
      { href: "/tools/free/mortgage-calculator", label: "Mortgage Calculator" },
      { href: "/tools/free/loan-payment-calculator", label: "Loan Payment Calculator" },
      { href: "/tools/free/break-even-calculator", label: "Break-Even Calculator" },
      { href: "/tools/free/profit-margin-calculator", label: "Profit Margin Calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/restaurant-menu-margin-leak", label: "Restaurant Menu Margin Analyzer" },
      { href: "/tools/premium-schema/cloud-api-cost-overrun", label: "Cloud API Cost Overrun Analyzer" },
    ],
    industryLinks: [
      { href: "/industries/restaurant", label: "Restaurant" },
      { href: "/industries/ecommerce", label: "E-commerce" },
    ],
    faq: [
      {
        question: "Is SectorCalc financial advice?",
        answer:
          "No. SectorCalc outputs are technical estimates based on your inputs, not financial, legal or investment advice.",
      },
    ],
    relatedHubSlugs: ["unit-conversion-calculators", "hidden-loss-decision-reports"],
  },
  {
    slug: "unit-conversion-calculators",
    title: "Unit Conversion Calculators",
    metaTitle: "Unit Conversion Calculators — Area, Temperature, Volume & More",
    metaDescription:
      "Free unit conversion calculators for area, temperature, volume, length and everyday measurement tasks.",
    intro:
      "Teams use SectorCalc conversion calculators for field measurements, quotes and cross-unit checks without spreadsheet friction.",
    featuredQuestion: "What unit converters does SectorCalc include?",
    featuredAnswer:
      "SectorCalc includes free converters for area, temperature, volume, length, weight and speed with visible assumptions. They run in the browser and require no account.",
    featuredBullets: [
      "Area, temperature and volume converters",
      "Multi-unit output on key tools like area converter",
      "Links to construction and manufacturing hubs",
    ],
    freeToolLinks: [
      { href: "/tools/free/area-converter", label: "Area Converter" },
      { href: "/tools/free/temperature-converter", label: "Temperature Converter" },
      { href: "/tools/free/volume-converter", label: "Volume Converter" },
      { href: "/tools/free/length-converter", label: "Length Converter" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/calibration-drift-risk", label: "Calibration Drift Risk Analyzer" },
    ],
    industryLinks: [{ href: "/categories", label: "All Categories" }],
    faq: [
      {
        question: "How accurate are conversion calculators?",
        answer:
          "Converters use standard conversion factors shown in the result. Verify critical engineering measurements independently.",
      },
    ],
    relatedHubSlugs: ["construction-cost-calculators", "manufacturing-cost-calculators"],
  },
  {
    slug: "hidden-loss-decision-reports",
    title: "Hidden Loss Decision Reports",
    metaTitle: "Hidden Loss Decision Reports — Premium Analyzers & Export-Ready Output",
    metaDescription:
      "Premium SectorCalc analyzers for hidden-loss diagnostics, threshold checks, suggested actions and export-ready decision reports.",
    intro:
      "When a free estimate is not enough, premium analyzers show hidden drivers, threshold pressure and practical next actions.",
    featuredQuestion: "What is a hidden-loss decision report?",
    featuredAnswer:
      "A hidden-loss decision report starts from your inputs, surfaces the main exposure driver, compares warning and critical thresholds, suggests an action and can be exported for management or client review on paid plans.",
    featuredBullets: [
      "27 premium analyzers across manufacturing, logistics, energy and more",
      "Threshold checks and suggested action plans",
      "PDF and CSV export on paid access",
    ],
    freeToolLinks: [
      { href: "/tools/free/oee-calculator", label: "OEE Calculator" },
      { href: "/tools/free/scrap-rate-calculator", label: "Scrap Rate Calculator" },
      { href: "/tools/free/route-cost-calculator", label: "Route Cost Calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/cnc-oee-loss", label: "CNC OEE Loss Analyzer" },
      { href: "/tools/premium-schema/carbon-footprint-compliance-risk", label: "Carbon Compliance Risk Analyzer" },
      { href: "/tools/premium-schema/restaurant-menu-margin-leak", label: "Restaurant Menu Margin Analyzer" },
    ],
    industryLinks: [
      { href: "/premium-tools", label: "All Premium Analyzers" },
      { href: "/pricing", label: "Pricing" },
    ],
    faq: [
      {
        question: "Can I export premium reports?",
        answer: "PDF and CSV export are included with full decision report access on single-report or Pro plans.",
      },
      {
        question: "How is this different from free calculators?",
        answer:
          "Free calculators give the first estimate. Premium reports add hidden drivers, thresholds, suggested actions and export-ready output.",
      },
    ],
    relatedHubSlugs: [
      "manufacturing-cost-calculators",
      "energy-carbon-calculators",
      "finance-business-calculators",
    ],
  },
] as const;

export function listProgrammaticSeoSlugs(): readonly string[] {
  return PROGRAMMATIC_SEO_PAGES.map((page) => page.slug);
}

export function getProgrammaticSeoPageBySlug(slug: string): ProgrammaticSeoPage | null {
  return PROGRAMMATIC_SEO_PAGES.find((page) => page.slug === slug) ?? null;
}
