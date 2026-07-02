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
  readonly helpsYouCalculate: string;
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
    metaTitle: "Manufacturing Cost Calculators & OEE Tools | SectorCalc",
    metaDescription:
      "Calculate manufacturing cost per unit, OEE, scrap rate and machine time. Free shop-floor calculators plus premium hidden-loss calculators for quoting decisions.",
    intro:
      "Use these calculators to estimate unit cost, machine time, scrap exposure and OEE before you quote a job or change shift plans.",
    helpsYouCalculate:
      "Machine time, unit cost, scrap rate, OEE, cycle time and material yield for CNC, fabrication and assembly jobs.",
    featuredQuestion: "What is a manufacturing cost calculator?",
    featuredAnswer:
      "A manufacturing cost calculator estimates machine time, material use, labor, scrap and unit cost from your inputs. It helps you sanity-check quotes before setup loss, tool wear or downtime erode margin. Pair free calculators with premium calculators when pricing, capacity or scheduling decisions need hidden-driver diagnostics.",
    featuredBullets: [
      "Unit cost, machine hour rate and machine time estimates",
      "OEE and scrap rate checks for shop-floor visibility",
      "Premium calculators for CNC capacity loss and tool wear exposure",
    ],
    freeToolLinks: [
      { href: "/tools/free/oee-calculator", label: "Open the OEE calculator" },
      { href: "/tools/free/scrap-rate-calculator", label: "Open the scrap rate calculator" },
      { href: "/tools/free/cnc-cycle-time-calculator", label: "Open the CNC cycle time calculator" },
      { href: "/tools/free/machine-time-calculator", label: "Open the machine time calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/cnc-oee-loss", label: "View the CNC OEE Loss Calculator" },
      { href: "/tools/premium-schema/cnc-tool-wear-cost", label: "View the CNC Tool Wear Cost Calculator" },
      { href: "/tools/premium-schema/sheet-metal-scrap-risk", label: "View the Sheet Metal Scrap Risk Calculator" },
    ],
    industryLinks: [
      { href: "/industries/cnc-manufacturing", label: "Browse CNC manufacturing tools" },
      { href: "/industries/sheet-metal", label: "Browse sheet metal calculators" },
    ],
    faq: [
      {
        question: "What is a manufacturing cost calculator?",
        answer:
          "A manufacturing cost calculator estimates machine time, material use, labor, scrap and unit cost. SectorCalc connects these base calculators with premium calculators for OEE loss, tool wear and sheet metal scrap risk.",
      },
      {
        question: "How do I calculate manufacturing cost per unit?",
        answer:
          "Divide total production cost by the number of good units produced. Include machine time, labor, material waste, setup time and scrap rate for a realistic unit cost before quoting.",
      },
      {
        question: "Why do manufacturing jobs lose margin?",
        answer:
          "Jobs usually lose margin when setup time, scrap, tool wear, inspection delays or machine downtime are not included before pricing.",
      },
      {
        question: "When should I use a premium calculator?",
        answer:
          "Use a premium calculator when the result affects quoting, capacity planning, production scheduling or management reporting and you need hidden drivers, thresholds and export-ready output.",
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
    metaTitle: "Construction Cost Calculators & Concrete Tools | SectorCalc",
    metaDescription:
      "Estimate concrete volume, labor cost, renovation area and project margin. Free construction calculators plus premium overrun and subcontractor margin calculators.",
    intro:
      "Contractors and estimators use these tools to validate quantities, labor exposure and margin before bidding or approving change orders.",
    helpsYouCalculate:
      "Concrete volume, floor area, roofing coverage, labor cost ratios and quick renovation quantity checks for field estimates.",
    featuredQuestion: "What does a construction cost calculator help you estimate?",
    featuredAnswer:
      "Construction cost calculators estimate material quantities, labor exposure and margin pressure from your project inputs. They help you catch takeoff errors and budget drift before subcontractor packages or client pricing are locked. Use premium overrun calculators when forecast cost threatens project margin.",
    featuredBullets: [
      "Concrete, area and roofing quantity calculators",
      "Labor and margin checks for bid sanity",
      "Premium overrun and subcontractor margin calculators",
    ],
    freeToolLinks: [
      { href: "/tools/free/concrete-volume-calculator", label: "Open the concrete volume calculator" },
      { href: "/tools/free/area-converter", label: "Open the area converter" },
      { href: "/tools/free/square-meter-calculator", label: "Open the square meter calculator" },
      { href: "/tools/free/roofing-area-calculator", label: "Open the roofing area calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/construction-project-overrun", label: "View the Construction Project Overrun Calculator" },
      { href: "/tools/premium-schema/construction-subcontractor-margin-leak", label: "View the Subcontractor Margin Leak Calculator" },
      { href: "/tools/premium-schema/roofing-weather-delay-risk", label: "View the Roofing Weather Delay Risk Calculator" },
    ],
    industryLinks: [
      { href: "/industries/construction", label: "Browse construction calculators" },
      { href: "/industries/roofing", label: "Browse roofing tools" },
    ],
    faq: [
      {
        question: "What is a construction cost calculator?",
        answer:
          "A construction cost calculator estimates material quantities, labor exposure and margin from project inputs such as area, volume, coverage or cost codes.",
      },
      {
        question: "How do I estimate concrete volume for a slab?",
        answer:
          "Multiply length × width × depth in consistent units to get cubic meters or cubic feet. Use the free concrete volume calculator to convert and sanity-check pour quantities.",
      },
      {
        question: "Can I use SectorCalc instead of estimating software?",
        answer:
          "SectorCalc is a calculator and decision-report layer, not a full ERP or estimating system. Use it for quick checks and hidden-loss diagnostics.",
      },
      {
        question: "When should I use a premium construction calculator?",
        answer:
          "Use a premium calculator when forecast overrun, subcontractor margin leak or weather delay exposure threatens project margin and you need export-ready decision output.",
      },
    ],
    relatedHubSlugs: ["manufacturing-cost-calculators", "finance-business-calculators"],
  },
  {
    slug: "logistics-route-calculators",
    title: "Logistics & Route Calculators",
    metaTitle: "Logistics Route Cost Calculators | SectorCalc",
    metaDescription:
      "Calculate route cost, fuel use, freight margin and deadhead exposure. Free logistics calculators plus premium route loss and fuel drift calculators.",
    intro:
      "Dispatchers and owner-operators compare trip cost, fuel drift and route margin before accepting loads or repricing lanes.",
    helpsYouCalculate:
      "Route cost, fuel consumption, freight cost per trip, delivery stop economics and deadhead exposure on recurring lanes.",
    featuredQuestion: "How do logistics calculators help with route margin?",
    featuredAnswer:
      "Logistics calculators estimate trip cost, fuel use and time exposure from distance, consumption and stop inputs. They separate loaded miles from deadhead so you can see when a lane looks profitable on average but loses money on empty return legs. Premium route calculators add threshold pressure for repricing decisions.",
    featuredBullets: [
      "Route cost and fuel calculators for quick lane checks",
      "Deadhead and stop-time visibility",
      "Premium route loss and fuel drift calculators",
    ],
    freeToolLinks: [
      { href: "/tools/free/route-cost-calculator", label: "Open the route cost calculator" },
      { href: "/tools/free/fuel-cost-calculator", label: "Open the fuel cost calculator" },
      { href: "/tools/free/freight-cost-calculator", label: "Open the freight cost calculator" },
      { href: "/tools/free/fuel-consumption-calculator", label: "Open the fuel consumption calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/logistics-route-loss", label: "View the Logistics Route Loss Calculator" },
      { href: "/tools/premium-schema/logistics-fuel-route-drift", label: "View the Fuel Route Drift Calculator" },
    ],
    industryLinks: [{ href: "/industries/logistics-transport", label: "Browse logistics calculators" }],
    faq: [
      {
        question: "What is route deadhead cost?",
        answer:
          "Deadhead cost is the expense of running empty or under-loaded miles, including fuel, driver hours and tolls that do not earn revenue on that leg.",
      },
      {
        question: "How do you calculate delivery route cost?",
        answer:
          "Sum fuel, driver labor, tolls and vehicle wear for the trip. Add stop time at your loaded hourly rate and include deadhead legs that run without freight revenue.",
      },
      {
        question: "When should I reprice a logistics lane?",
        answer:
          "Reprice when deadhead percentage, fuel drift or stop density pushes effective margin below your cost floor for several consecutive weeks.",
      },
      {
        question: "When should I use a premium route calculator?",
        answer:
          "Use a premium calculator when recurring routes show stable revenue but eroding margin and you need hidden driver breakdown with export-ready output.",
      },
    ],
    relatedHubSlugs: ["energy-carbon-calculators", "finance-business-calculators"],
  },
  {
    slug: "energy-carbon-calculators",
    title: "Energy & Carbon Calculators",
    metaTitle: "Energy & Carbon Calculators - kWh and Peak Load | SectorCalc",
    metaDescription:
      "Calculate electricity cost, kWh exposure, peak load pressure and carbon footprint. Free energy calculators plus premium peak cost and compliance calculators.",
    intro:
      "Facilities and energy teams compare blended kWh cost against peak-hour exposure and carbon pressure before operational or compliance decisions.",
    helpsYouCalculate:
      "kWh cost, electricity bill estimates, peak load exposure, compressor leak cost signals and quick carbon footprint checks.",
    featuredQuestion: "What is energy peak exposure?",
    featuredAnswer:
      "Energy peak exposure is the extra cost hidden inside average kWh when high-demand periods trigger demand charges or time-of-use multipliers. Calculators help you see whether heavy loads during peak windows are driving true unit cost above your blended tariff estimate.",
    featuredBullets: [
      "Free kWh and electricity bill calculators",
      "Peak load and carbon quick checks",
      "Premium peak cost and carbon compliance calculators",
    ],
    freeToolLinks: [
      { href: "/tools/free/kwh-cost-calculator", label: "Open the kWh cost calculator" },
      { href: "/tools/free/electricity-bill-calculator", label: "Open the electricity bill calculator" },
      { href: "/tools/free/carbon-footprint-quick", label: "Open the carbon footprint quick check" },
      { href: "/tools/free/energy-consumption-check", label: "Open the energy consumption check" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/energy-peak-cost", label: "View the Energy Peak Cost Calculator" },
      { href: "/tools/premium-schema/energy-compressor-leak-cost", label: "View the Compressor Leak Cost Calculator" },
      { href: "/tools/premium-schema/carbon-footprint-compliance-risk", label: "View the Carbon Compliance Risk Calculator" },
    ],
    industryLinks: [
      { href: "/industries/energy-consumption", label: "Browse energy consumption tools" },
      { href: "/industries/energy-carbon", label: "See energy and carbon calculators" },
    ],
    faq: [
      {
        question: "What is energy peak exposure?",
        answer:
          "Peak exposure is extra cost hidden inside average kWh when high-demand periods trigger demand charges or time-of-use multipliers on your utility bill.",
      },
      {
        question: "How do you calculate electricity cost from kWh?",
        answer:
          "Multiply kilowatt-hours consumed by your effective tariff, including demand charges when applicable. Compare peak-window usage separately from off-peak loads.",
      },
      {
        question: "Does SectorCalc replace an energy audit?",
        answer:
          "No. SectorCalc provides structured estimates and decision reports. Confirm critical compliance and engineering decisions with qualified professionals.",
      },
      {
        question: "When should I use a premium energy calculator?",
        answer:
          "Use a premium calculator when peak load, compressor leaks or carbon compliance exposure affects operational budgeting or customer reporting requirements.",
      },
    ],
    relatedHubSlugs: ["logistics-route-calculators", "hidden-loss-decision-reports"],
  },
  {
    slug: "agriculture-calculators",
    title: "Agriculture Calculators",
    metaTitle: "Agriculture Calculators - Irrigation, Yield & Feed Efficiency",
    metaDescription:
      "Free agriculture calculators and premium calculators for irrigation yield loss, feed efficiency and farm margin exposure.",
    intro:
      "Farm operators use SectorCalc to estimate irrigation cost, yield gaps and feed efficiency before season or contract decisions.",
    helpsYouCalculate:
      "Crop yield, irrigation cost, feed ratios, water usage and quick farm margin checks from field inputs.",
    featuredQuestion: "What agriculture tools does SectorCalc offer?",
    featuredAnswer:
      "SectorCalc includes free agriculture calculators for crop planning, irrigation and cost ratios, plus premium calculators for irrigation yield loss and dairy feed efficiency with threshold checks and export-ready reports.",
    featuredBullets: [
      "Crop and irrigation calculators for quick field estimates",
      "Premium yield and feed efficiency calculators",
      "Industry pages for crops, dairy and irrigation",
    ],
    freeToolLinks: [
      { href: "/tools/free/crop-yield-calculator", label: "Crop Yield Calculator" },
      { href: "/tools/free/irrigation-cost-check", label: "Irrigation Cost Check" },
      { href: "/tools/free/feed-cost-estimator", label: "Feed Cost Estimator" },
      { href: "/tools/free/water-usage-calculator", label: "Water Usage Calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/agriculture-irrigation-yield-loss", label: "Irrigation Yield Loss Calculator" },
      { href: "/tools/premium-schema/dairy-feed-efficiency-loss", label: "Dairy Feed Efficiency Calculator" },
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
    metaTitle: "Finance & Business Calculators - Loan, Margin & Break-Even Tools",
    metaDescription:
      "Free finance and business calculators for loans, margins, break-even and pricing decisions across sectors.",
    intro:
      "Owners and operators use SectorCalc finance calculators for loan payments, break-even checks and quick margin math.",
    helpsYouCalculate:
      "Loan payments, mortgage estimates, break-even points, markup, ROI and common business ratio checks.",
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
      { href: "/tools/premium-schema/restaurant-menu-margin-leak", label: "Restaurant Menu Margin Calculator" },
      { href: "/tools/premium-schema/cloud-api-cost-overrun", label: "Cloud API Cost Overrun Calculator" },
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
    metaTitle: "Unit Conversion Calculators - Area, Temperature, Volume & More",
    metaDescription:
      "Free unit conversion calculators for area, temperature, volume, length and everyday measurement tasks.",
    intro:
      "Teams use SectorCalc conversion calculators for field measurements, quotes and cross-unit checks without spreadsheet friction.",
    helpsYouCalculate:
      "Area, temperature, volume, length, weight and speed conversions between metric and imperial units.",
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
      { href: "/tools/premium-schema/calibration-drift-risk", label: "Calibration Drift Risk Calculator" },
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
    metaTitle: "Hidden Loss Decision Reports - Premium Calculators & Export-Ready Output",
    metaDescription:
      "Premium SectorCalc calculators for hidden-loss diagnostics, threshold checks, suggested actions and export-ready decision reports.",
    intro:
      "When a free estimate is not enough, premium calculators show hidden drivers, threshold pressure and practical next actions.",
    helpsYouCalculate:
      "Hidden-loss exposure, threshold interpretation, suggested actions and export-ready decision reports across sectors.",
    featuredQuestion: "What is a hidden-loss decision report?",
    featuredAnswer:
      "A hidden-loss decision report starts from your inputs, surfaces the main exposure driver, compares warning and critical thresholds, suggests an action and can be exported for management or client review on paid plans.",
    featuredBullets: [
      "27 premium calculators across manufacturing, logistics, energy and more",
      "Threshold checks and suggested action plans",
      "PDF and CSV export on paid access",
    ],
    freeToolLinks: [
      { href: "/tools/free/oee-calculator", label: "OEE Calculator" },
      { href: "/tools/free/scrap-rate-calculator", label: "Scrap Rate Calculator" },
      { href: "/tools/free/route-cost-calculator", label: "Route Cost Calculator" },
    ],
    premiumAnalyzerLinks: [
      { href: "/tools/premium-schema/cnc-oee-loss", label: "CNC OEE Loss Calculator" },
      { href: "/tools/premium-schema/carbon-footprint-compliance-risk", label: "Carbon Compliance Risk Calculator" },
      { href: "/tools/premium-schema/restaurant-menu-margin-leak", label: "Restaurant Menu Margin Calculator" },
    ],
    industryLinks: [
      { href: "/premium-tools", label: "All Premium Calculators" },
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
