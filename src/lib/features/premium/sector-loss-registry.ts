/**
 * SectorCalc - 27 premium analyzers reclassified by loss type and decision family.
 * Links slug → architecture profile (Measurement / Loss / Optimization per sector).
 */

import type {
  LossImpactKind,
  PremiumArchitectureProfile,
  PremiumDecisionFamily,
  PremiumEngineModeDescriptor,
  PremiumReportFamily,
} from "@/lib/features/premium/premium-architecture";

function modes(
  measurement: string,
  loss: string,
  optimization: string
): readonly PremiumEngineModeDescriptor[] {
  return [
    { mode: "measurement", label: "Measurement", operatorSummary: measurement },
    { mode: "loss", label: "Loss Detection", operatorSummary: loss },
    { mode: "optimization", label: "Optimization", operatorSummary: optimization },
  ];
}

function profile(
  config: Omit<
    PremiumArchitectureProfile,
    "engineModes" | "secondaryFamilies" | "lossImpacts" | "lossTypeLabels" | "mvpLossFamily"
  > & {
    engineModes: readonly PremiumEngineModeDescriptor[];
    secondaryFamilies?: readonly PremiumDecisionFamily[];
    lossImpacts: readonly LossImpactKind[];
    lossTypeLabels: readonly string[];
    mvpLossFamily?: boolean;
  }
): PremiumArchitectureProfile {
  return {
    secondaryFamilies: config.secondaryFamilies ?? [],
    mvpLossFamily: config.mvpLossFamily ?? false,
    ...config,
  };
}

export const SECTOR_LOSS_REGISTRY: readonly PremiumArchitectureProfile[] = [
  // ── MVP: Production / Manufacturing ─────────────────────────────────────
  profile({
    slug: "cnc-quote-risk-analyzer",
    sectorSlug: "cnc-manufacturing",
    sectorLabel: "CNC Manufacturing",
    decisionFamily: "time_oee_capacity",
    secondaryFamilies: ["scrap_loss", "calibration_tolerance", "sector_cost_profitability"],
    reportFamily: "productivity_oee",
    engineModes: modes(
      "Machine hours, cycle time, setup minutes and scrap percent.",
      "Setup overrun, tool wear, material scrap and rework not in the visible quote.",
      "Minimum safe price floor after P90 buffers and target margin."
    ),
    lossImpacts: ["time", "material", "monetary", "capacity"],
    lossTypeLabels: ["Setup loss", "Scrap & fire", "Tool wear", "Cycle time drift"],
    reclassifiedTitle: "CNC Loss & OEE Decision Report",
    reclassifiedPromise:
      "Find where machine time, scrap and tolerance eat margin before you accept the job.",
    whatIsMeasured: "Machine hours, setup burden, scrap rate and shop rate.",
    whereIsLoss: "Setup overrun, tool breakage, material scrap and tight-tolerance cycle stretch.",
    toleranceFocus: "Sub-25 µm bands increase inspection load and cycle time.",
    mvpLossFamily: true,
  }),

  profile({
    slug: "sheet-metal-quote-risk-tool",
    sectorSlug: "sheet-metal",
    sectorLabel: "Sheet Metal",
    decisionFamily: "scrap_loss",
    secondaryFamilies: ["time_oee_capacity", "calibration_tolerance"],
    reportFamily: "productivity_oee",
    engineModes: modes(
      "Programming, setup, cut hours, bend count and scrap rate.",
      "Programming drift, bend error and scrap risk inflate true job cost.",
      "Safe quote floor after nesting waste and rework buffers."
    ),
    lossImpacts: ["material", "time", "monetary"],
    lossTypeLabels: ["Nesting scrap", "Bend rework", "Programming drift"],
    reclassifiedTitle: "Sheet Metal Scrap & Cut Loss Report",
    reclassifiedPromise: "Expose nesting fire, bend rework and programming drift before quoting.",
    whatIsMeasured: "Cut hours, bend operations, scrap percent and material yield.",
    whereIsLoss: "Nesting waste, incorrect bend sequences and first-off scrap.",
    toleranceFocus: "Tight bend radius and gauge stack-up drive rework.",
    mvpLossFamily: true,
  }),

  profile({
    slug: "welding-bid-risk-analyzer",
    sectorSlug: "welding-fabrication",
    sectorLabel: "Welding & Fabrication",
    decisionFamily: "scrap_loss",
    secondaryFamilies: ["time_oee_capacity", "calibration_tolerance"],
    reportFamily: "loss_detection",
    engineModes: modes(
      "Weld hours, fit-up time, gas/consumables and NDT load.",
      "Fit-up drift, grinding rework and gas waste hide in the bid.",
      "Minimum welding bid after rework-risk percent."
    ),
    lossImpacts: ["material", "time", "monetary"],
    lossTypeLabels: ["Fit-up drift", "Grinding rework", "NDT failure"],
    reclassifiedTitle: "Welding Rework & Fit-Up Loss Report",
    reclassifiedPromise: "Quantify fit-up drift, grinding rework and gas waste before bidding.",
    whatIsMeasured: "Weld + fit-up hours, consumables and rework risk percent.",
    whereIsLoss: "Fit-up misalignment, grinding passes and failed NDT.",
    toleranceFocus: "Weld procedure and joint prep tolerance breaches trigger rework.",
  }),

  profile({
    slug: "3d-print-job-margin-tool",
    sectorSlug: "3d-printing-service",
    sectorLabel: "3D Printing",
    decisionFamily: "scrap_loss",
    secondaryFamilies: ["time_oee_capacity", "energy_carbon_efficiency"],
    reportFamily: "productivity_oee",
    engineModes: modes(
      "Print hours, machine rate, post-process labor and fail rate.",
      "Print failure, support removal and finishing drift destroy margin.",
      "Minimum print price after failure and post-process buffers."
    ),
    lossImpacts: ["material", "time", "energy", "monetary"],
    lossTypeLabels: ["Print failure", "Support waste", "Post-process overrun"],
    reclassifiedTitle: "3D Print Yield & Failure Loss Report",
    reclassifiedPromise: "Model print failure, support waste and finishing drift on every job.",
    whatIsMeasured: "Print time, fail rate, material use and post-process hours.",
    whereIsLoss: "Failed builds, support material and hand-finishing overrun.",
    toleranceFocus: "Layer adhesion and dimensional drift drive reprints.",
  }),

  profile({
    slug: "millwork-bid-risk-analyzer",
    sectorSlug: "carpentry-millwork",
    sectorLabel: "Millwork & Carpentry",
    decisionFamily: "scrap_loss",
    secondaryFamilies: ["measurement_accuracy", "sector_cost_profitability"],
    reportFamily: "loss_detection",
    engineModes: modes(
      "Sheet material, labor, finishing, install hours and waste rate.",
      "Measurement error, finish rework and install risk inflate true cost.",
      "Minimum millwork bid after waste and rework buffers."
    ),
    lossImpacts: ["material", "time", "monetary"],
    lossTypeLabels: ["Measurement error", "Finish rework", "Install risk"],
    reclassifiedTitle: "Millwork Waste & Measurement Loss Report",
    reclassifiedPromise: "Catch measurement error, finish rework and install risk before bidding.",
    whatIsMeasured: "Material yield, waste percent, labor and finishing load.",
    whereIsLoss: "Field measurement drift, finish defects and install callbacks.",
    toleranceFocus: "Site measure vs shop cut tolerance drives waste.",
  }),

  profile({
    slug: "panel-shop-margin-verdict",
    sectorSlug: "electrical-contracting",
    sectorLabel: "Electrical Panel Shop",
    decisionFamily: "calibration_tolerance",
    secondaryFamilies: ["scrap_loss", "time_oee_capacity"],
    reportFamily: "measurement_calibration",
    engineModes: modes(
      "Labor, testing hours, material and inspection risk percent.",
      "Wiring complexity, test failure and inspection delay add hidden cost.",
      "Safe panel bid after test-failure and inspection buffers."
    ),
    lossImpacts: ["time", "monetary", "capacity"],
    lossTypeLabels: ["Test failure", "Inspection delay", "Wiring complexity"],
    reclassifiedTitle: "Panel Test & Inspection Loss Report",
    reclassifiedPromise: "Surface test failure, inspection delay and wiring complexity cost.",
    whatIsMeasured: "Build + test hours, inspection risk and rework reserve.",
    whereIsLoss: "Failed hi-pot tests, label corrections and inspection re-visits.",
    toleranceFocus: "Code compliance and test tolerance breaches block shipment.",
  }),

  // ── MVP: Construction / Project ─────────────────────────────────────────
  profile({
    slug: "change-order-impact-analyzer",
    sectorSlug: "construction",
    sectorLabel: "Construction & Projects",
    decisionFamily: "time_oee_capacity",
    secondaryFamilies: ["sector_cost_profitability", "route_resource_optimization"],
    reportFamily: "cost_margin",
    engineModes: modes(
      "Added labor, material, delay days and crew daily cost.",
      "Scope creep, subcontractor overrun and weather delay erode margin.",
      "Minimum change-order value to protect project margin."
    ),
    lossImpacts: ["time", "monetary", "capacity"],
    lossTypeLabels: ["Scope creep", "Weather delay", "Crew idle"],
    reclassifiedTitle: "Change Order Time & Scope Loss Report",
    reclassifiedPromise: "Quantify delay, crew idle and scope creep before approving the CO.",
    whatIsMeasured: "Added hours, delay days, crew cost and material delta.",
    whereIsLoss: "Schedule slip, idle crew and subcontractor overruns.",
    toleranceFocus: "Critical-path slip beyond float triggers cascade cost.",
    mvpLossFamily: true,
  }),

  profile({
    slug: "roofing-contract-margin-guard",
    sectorSlug: "roofing",
    sectorLabel: "Roofing",
    decisionFamily: "time_oee_capacity",
    secondaryFamilies: ["scrap_loss", "sector_cost_profitability"],
    reportFamily: "cost_margin",
    engineModes: modes(
      "Material, labor, tear-off, dump fees and weather delay risk.",
      "Weather delay, warranty risk and disposal overrun hide in bids.",
      "Minimum roofing bid after weather and warranty buffers."
    ),
    lossImpacts: ["time", "material", "monetary"],
    lossTypeLabels: ["Weather delay", "Warranty callback", "Disposal overrun"],
    reclassifiedTitle: "Roofing Weather & Waste Loss Report",
    reclassifiedPromise: "Model weather delay, warranty exposure and disposal overrun.",
    whatIsMeasured: "Squares, labor hours, tear-off load and weather risk percent.",
    whereIsLoss: "Rain days, material waste and warranty callbacks.",
    toleranceFocus: "Deck moisture and install window tolerance affect yield.",
  }),

  profile({
    slug: "renovation-budget-optimizer",
    sectorSlug: "daily-renovation",
    sectorLabel: "Renovation",
    decisionFamily: "sector_cost_profitability",
    secondaryFamilies: ["scrap_loss", "time_oee_capacity"],
    reportFamily: "benchmark_financial_health",
    engineModes: modes(
      "Area, material/labor per m², permits and contingency percent.",
      "Scope creep, material waste and delay risk blow budgets.",
      "Safe renovation budget threshold with contingency."
    ),
    lossImpacts: ["monetary", "material", "time"],
    lossTypeLabels: ["Scope creep", "Material waste", "Delay cost"],
    reclassifiedTitle: "Renovation Budget & Scope Loss Report",
    reclassifiedPromise: "Validate budget against scope creep, waste and delay before starting.",
    whatIsMeasured: "Area cost stack, contingency and permit load.",
    whereIsLoss: "Hidden scope, waste factor and schedule slip.",
    toleranceFocus: "Budget variance beyond contingency band needs re-plan.",
  }),

  profile({
    slug: "plumbing-job-margin-verdict",
    sectorSlug: "plumbing",
    sectorLabel: "Plumbing",
    decisionFamily: "time_oee_capacity",
    secondaryFamilies: ["scrap_loss", "sector_cost_profitability"],
    reportFamily: "cost_margin",
    engineModes: modes(
      "Parts, labor, fixture count, material runs and callback risk.",
      "Leak callbacks, access difficulty and extra material runs eat margin.",
      "Minimum job price after callback and access buffers."
    ),
    lossImpacts: ["time", "material", "monetary"],
    lossTypeLabels: ["Callback", "Access difficulty", "Material run"],
    reclassifiedTitle: "Plumbing Callback & Access Loss Report",
    reclassifiedPromise: "Price in callback risk, access difficulty and material runs.",
    whatIsMeasured: "Labor hours, parts, fixture complexity and callback percent.",
    whereIsLoss: "Return visits, confined access and unplanned material trips.",
    toleranceFocus: "Pressure test and code inspection tolerance breaches.",
  }),

  profile({
    slug: "painting-job-profit-verdict",
    sectorSlug: "painting",
    sectorLabel: "Painting",
    decisionFamily: "scrap_loss",
    secondaryFamilies: ["time_oee_capacity", "measurement_accuracy"],
    reportFamily: "loss_detection",
    engineModes: modes(
      "Paint, prep + paint hours, scaffold and touch-up risk.",
      "Prep underestimate, touch-up and access risk inflate true cost.",
      "Minimum painting price after prep and touch-up buffers."
    ),
    lossImpacts: ["material", "time", "monetary"],
    lossTypeLabels: ["Prep underestimate", "Touch-up", "Access risk"],
    reclassifiedTitle: "Painting Prep & Touch-Up Loss Report",
    reclassifiedPromise: "Expose prep underestimate, touch-up and access cost before quoting.",
    whatIsMeasured: "Prep vs paint hours, material coverage and touch-up percent.",
    whereIsLoss: "Surface prep overrun, color match rework and scaffold idle.",
    toleranceFocus: "Substrate condition tolerance drives prep hours.",
  }),

  profile({
    slug: "hvac-project-margin-guard",
    sectorSlug: "hvac",
    sectorLabel: "HVAC",
    decisionFamily: "energy_carbon_efficiency",
    secondaryFamilies: ["time_oee_capacity", "calibration_tolerance"],
    reportFamily: "energy_carbon",
    engineModes: modes(
      "Equipment, ductwork, labor, commissioning and callback risk.",
      "Duct complexity, commissioning drift and callbacks hide cost.",
      "Minimum HVAC project price after callback buffers."
    ),
    lossImpacts: ["energy", "time", "monetary"],
    lossTypeLabels: ["Callback", "Commissioning drift", "Duct complexity"],
    reclassifiedTitle: "HVAC Commissioning & Energy Loss Report",
    reclassifiedPromise: "Model commissioning drift, duct complexity and callback exposure.",
    whatIsMeasured: "Install load, commissioning hours and callback risk percent.",
    whereIsLoss: "Balancing failures, duct rework and warranty callbacks.",
    toleranceFocus: "Airflow and charge tolerance affect efficiency and callbacks.",
  }),

  // ── MVP: Logistics ────────────────────────────────────────────────────────
  profile({
    slug: "route-optimization-analyzer",
    sectorSlug: "logistics-transport",
    sectorLabel: "Logistics & Transport",
    decisionFamily: "route_resource_optimization",
    secondaryFamilies: ["energy_carbon_efficiency", "time_oee_capacity"],
    reportFamily: "route_optimization",
    engineModes: modes(
      "Distance, fuel/km, driver hours, tolls and empty return percent.",
      "Deadhead, delay risk and fuel variance erode route margin.",
      "Minimum route price after deadhead and delay buffers."
    ),
    lossImpacts: ["time", "energy", "monetary", "capacity"],
    lossTypeLabels: ["Deadhead", "Delay", "Fuel variance"],
    reclassifiedTitle: "Route Deadhead & Fuel Loss Report",
    reclassifiedPromise: "Find deadhead, delay and fuel variance before accepting the load.",
    whatIsMeasured: "Km, fuel cost, driver hours and empty return percent.",
    whereIsLoss: "Empty miles, detention time and fuel price drift.",
    toleranceFocus: "On-time delivery window breaches trigger penalties.",
    mvpLossFamily: true,
  }),

  profile({
    slug: "trip-budget-optimizer",
    sectorSlug: "daily-fuel",
    sectorLabel: "Trip & Fuel",
    decisionFamily: "route_resource_optimization",
    secondaryFamilies: ["sector_cost_profitability", "energy_carbon_efficiency"],
    reportFamily: "route_optimization",
    engineModes: modes(
      "Distance, fuel consumption, accommodation, food and tolls.",
      "Fuel variance, delay cost and route changes blow trip budgets.",
      "Trip budget exposure threshold."
    ),
    lossImpacts: ["monetary", "energy", "time"],
    lossTypeLabels: ["Fuel variance", "Route change", "Delay cost"],
    reclassifiedTitle: "Trip Route & Fuel Loss Report",
    reclassifiedPromise: "Validate trip budget against fuel variance and route change risk.",
    whatIsMeasured: "Fuel burn, distance, lodging and toll stack.",
    whereIsLoss: "Traffic detours, fuel price spike and unplanned stops.",
    toleranceFocus: "Budget overrun beyond planned contingency.",
  }),

  // ── Field services ────────────────────────────────────────────────────────
  profile({
    slug: "office-cleaning-bid-optimizer",
    sectorSlug: "cleaning",
    sectorLabel: "Commercial Cleaning",
    decisionFamily: "time_oee_capacity",
    secondaryFamilies: ["sector_cost_profitability"],
    reportFamily: "productivity_oee",
    engineModes: modes(
      "Visits, hours/visit, staff count, supplies and travel per visit.",
      "Supply inflation, absenteeism and rework visits erode contract margin.",
      "Minimum monthly contract price floor."
    ),
    lossImpacts: ["time", "monetary", "capacity"],
    lossTypeLabels: ["Absenteeism", "Rework visit", "Supply inflation"],
    reclassifiedTitle: "Cleaning Crew Efficiency Loss Report",
    reclassifiedPromise: "Find absenteeism, rework visits and supply drift on recurring contracts.",
    whatIsMeasured: "Labor hours per visit, travel and supply load.",
    whereIsLoss: "No-show coverage, callback cleans and chemical cost drift.",
    toleranceFocus: "SLA completion window and inspection score tolerance.",
  }),

  profile({
    slug: "landscaping-contract-profit-tool",
    sectorSlug: "landscaping-lawn-care",
    sectorLabel: "Landscaping",
    decisionFamily: "time_oee_capacity",
    secondaryFamilies: ["route_resource_optimization", "energy_carbon_efficiency"],
    reportFamily: "route_optimization",
    engineModes: modes(
      "Crew hours/visit, fuel/visit, supplies and equipment wear monthly.",
      "Seasonality, equipment wear and rework visits reduce margin.",
      "Minimum monthly contract price."
    ),
    lossImpacts: ["time", "energy", "monetary", "material"],
    lossTypeLabels: ["Seasonality", "Equipment wear", "Rework visit"],
    reclassifiedTitle: "Landscaping Route & Season Loss Report",
    reclassifiedPromise: "Model seasonality, equipment wear and route inefficiency.",
    whatIsMeasured: "Crew hours, fuel per stop and equipment depreciation.",
    whereIsLoss: "Weather cut days, blade wear and return-trip rework.",
    toleranceFocus: "Route density and crew utilization targets.",
  }),

  profile({
    slug: "auto-shop-margin-leak-detector",
    sectorSlug: "auto-repair-shop",
    sectorLabel: "Auto Repair",
    decisionFamily: "time_oee_capacity",
    secondaryFamilies: ["scrap_loss", "sector_cost_profitability"],
    reportFamily: "productivity_oee",
    engineModes: modes(
      "Diagnostic + repair hours, parts, markup and comeback risk.",
      "Diagnostic leak, comeback risk and bay idle destroy job profit.",
      "True job profit after comeback buffers."
    ),
    lossImpacts: ["time", "monetary", "capacity"],
    lossTypeLabels: ["Comeback", "Bay idle", "Diagnostic leak"],
    reclassifiedTitle: "Auto Shop Bay & Comeback Loss Report",
    reclassifiedPromise: "Expose diagnostic leak, comeback risk and bay idle on every RO.",
    whatIsMeasured: "Bay hours, parts margin and comeback percent.",
    whereIsLoss: "Mis-diagnosis returns, waiting parts and idle lift time.",
    toleranceFocus: "Flat-rate book time vs actual clock variance.",
  }),

  profile({
    slug: "signage-bid-safe-price-tool",
    sectorSlug: "printing-signage",
    sectorLabel: "Signage & Print",
    decisionFamily: "scrap_loss",
    secondaryFamilies: ["time_oee_capacity", "measurement_accuracy"],
    reportFamily: "loss_detection",
    engineModes: modes(
      "Material, ink, design/print/install hours and reprint risk.",
      "Revision drift, install risk and reprint failures inflate cost.",
      "Minimum signage price after reprint buffers."
    ),
    lossImpacts: ["material", "time", "monetary"],
    lossTypeLabels: ["Reprint", "Revision drift", "Install risk"],
    reclassifiedTitle: "Signage Reprint & Install Loss Report",
    reclassifiedPromise: "Quantify reprint risk, revision drift and install exposure.",
    whatIsMeasured: "Ink/material, labor stack and reprint percent.",
    whereIsLoss: "Color proof failures, site measure errors and install damage.",
    toleranceFocus: "Color match and dimensional install tolerance.",
  }),

  // ── MVP: Food / Retail ────────────────────────────────────────────────────
  profile({
    slug: "menu-profit-leak-detector",
    sectorSlug: "restaurant",
    sectorLabel: "Restaurant & Food",
    decisionFamily: "scrap_loss",
    secondaryFamilies: ["sector_cost_profitability", "measurement_accuracy"],
    reportFamily: "loss_detection",
    engineModes: modes(
      "Ingredient cost, waste percent, labor/unit and delivery commission.",
      "Portion drift, spoilage and rush labor erode menu margin.",
      "Monthly margin leak exposure per menu item."
    ),
    lossImpacts: ["material", "monetary", "time"],
    lossTypeLabels: ["Portion drift", "Spoilage", "Commission leak"],
    reclassifiedTitle: "Menu Portion & Food Waste Loss Report",
    reclassifiedPromise: "Find portion drift, spoilage and commission leak on every menu item.",
    whatIsMeasured: "Portion cost, waste percent, labor and delivery fee.",
    whereIsLoss: "Over-portioning, spoilage and aggregator commission.",
    toleranceFocus: "Recipe yield and portion weight tolerance bands.",
    mvpLossFamily: true,
  }),

  profile({
    slug: "meal-planning-verdict",
    sectorSlug: "daily-meals",
    sectorLabel: "Meal Planning",
    decisionFamily: "scrap_loss",
    secondaryFamilies: ["sector_cost_profitability", "measurement_accuracy"],
    reportFamily: "loss_detection",
    engineModes: modes(
      "Ingredient cost, portions, waste percent and prep labor.",
      "Portion drift, spoilage and prep overrun inflate meal cost.",
      "Meal plan cost threshold."
    ),
    lossImpacts: ["material", "monetary", "time"],
    lossTypeLabels: ["Portion drift", "Spoilage", "Prep overrun"],
    reclassifiedTitle: "Meal Prep Waste & Portion Loss Report",
    reclassifiedPromise: "Validate meal budget against waste, spoilage and prep overrun.",
    whatIsMeasured: "Ingredient stack, waste percent and prep hours.",
    whereIsLoss: "Over-buying, spoilage and prep time drift.",
    toleranceFocus: "Planned vs actual portion and shelf-life tolerance.",
  }),

  profile({
    slug: "return-profit-erosion-tool",
    sectorSlug: "ecommerce",
    sectorLabel: "E-commerce & Retail",
    decisionFamily: "sector_cost_profitability",
    secondaryFamilies: ["scrap_loss", "benchmark_health_decision"],
    reportFamily: "benchmark_financial_health",
    engineModes: modes(
      "Product cost, shipping, ads/order, return rate and payment fees.",
      "Return loss, discount leak and payment fee erosion stack up.",
      "Profit erosion exposure per SKU/month."
    ),
    lossImpacts: ["monetary", "material", "time"],
    lossTypeLabels: ["Return loss", "Ad waste", "Payment fee"],
    reclassifiedTitle: "Return & Ad Spend Erosion Report",
    reclassifiedPromise: "Quantify return loss, ad waste and fee erosion before scaling SKU.",
    whatIsMeasured: "Unit economics, return percent and ad cost per order.",
    whereIsLoss: "Reverse logistics, discounting and payment processor fees.",
    toleranceFocus: "Return rate above category benchmark.",
  }),

  // ── MVP: Agriculture ──────────────────────────────────────────────────────
  profile({
    slug: "crop-yield-loss-analyzer",
    sectorSlug: "agriculture-crops",
    sectorLabel: "Crop Production",
    decisionFamily: "scrap_loss",
    secondaryFamilies: ["measurement_accuracy", "energy_carbon_efficiency"],
    reportFamily: "loss_detection",
    engineModes: modes(
      "Expected vs actual yield, area, price/ton and input cost.",
      "Weather risk, fertilizer drift and pest pressure reduce yield value.",
      "Yield loss exposure in currency."
    ),
    lossImpacts: ["material", "monetary", "carbon"],
    lossTypeLabels: ["Yield gap", "Weather", "Input drift"],
    reclassifiedTitle: "Crop Yield & Input Loss Report",
    reclassifiedPromise: "Quantify yield gap, weather exposure and input drift before harvest.",
    whatIsMeasured: "Ton/ha expected vs actual, input cost and price/ton.",
    whereIsLoss: "Weather events, pest pressure and fertilizer mis-application.",
    toleranceFocus: "Yield variance beyond planned band.",
    mvpLossFamily: true,
  }),

  profile({
    slug: "water-optimization-verdict",
    sectorSlug: "agriculture-irrigation",
    sectorLabel: "Irrigation & Water",
    decisionFamily: "energy_carbon_efficiency",
    secondaryFamilies: ["measurement_accuracy", "scrap_loss"],
    reportFamily: "energy_carbon",
    engineModes: modes(
      "Pump kW, hours, energy rate, water volume and leakage percent.",
      "Leakage drift, pump inefficiency and schedule loss waste water and power.",
      "Water cost exposure threshold."
    ),
    lossImpacts: ["energy", "material", "monetary"],
    lossTypeLabels: ["Leakage", "Pump inefficiency", "Schedule loss"],
    reclassifiedTitle: "Irrigation Water & Energy Loss Report",
    reclassifiedPromise: "Find leakage, pump inefficiency and schedule loss in irrigation.",
    whatIsMeasured: "kWh, m³ water, leakage percent and pump duty cycle.",
    whereIsLoss: "Line leaks, pump wear and off-schedule runs.",
    toleranceFocus: "Flow meter and pressure tolerance drift.",
  }),

  profile({
    slug: "feed-efficiency-analyzer",
    sectorSlug: "agriculture-feed",
    sectorLabel: "Livestock Feed",
    decisionFamily: "measurement_accuracy",
    secondaryFamilies: ["scrap_loss", "sector_cost_profitability"],
    reportFamily: "measurement_calibration",
    engineModes: modes(
      "Feed kg/animal, price/kg, target vs actual gain and transport.",
      "Storage loss, feed waste and health drift reduce conversion.",
      "Feed efficiency loss exposure."
    ),
    lossImpacts: ["material", "monetary", "time"],
    lossTypeLabels: ["Feed waste", "Storage loss", "Health drift"],
    reclassifiedTitle: "Feed Conversion & Waste Loss Report",
    reclassifiedPromise: "Measure feed conversion loss, storage waste and health drift.",
    whatIsMeasured: "Feed intake, gain/kg and transport cost.",
    whereIsLoss: "Spoilage, sorting waste and subclinical health issues.",
    toleranceFocus: "Feed mix ratio and weigh-scale calibration drift.",
  }),

  profile({
    slug: "dairy-profit-detector",
    sectorSlug: "agriculture-dairy",
    sectorLabel: "Dairy",
    decisionFamily: "sector_cost_profitability",
    secondaryFamilies: ["measurement_accuracy", "scrap_loss"],
    reportFamily: "benchmark_financial_health",
    engineModes: modes(
      "Herd count, liters/cow, milk price, feed/vet/labor and yield loss.",
      "Feed efficiency, cull risk and milk quality penalty erode profit.",
      "Dairy profit leak exposure."
    ),
    lossImpacts: ["monetary", "material", "time"],
    lossTypeLabels: ["Feed efficiency", "Cull risk", "Quality penalty"],
    reclassifiedTitle: "Dairy Yield & Feed Loss Report",
    reclassifiedPromise: "Find feed efficiency leak, cull risk and quality penalties in the herd.",
    whatIsMeasured: "Liters/cow, feed cost/cow and yield loss percent.",
    whereIsLoss: "Suboptimal ration, mastitis and quality downgrades.",
    toleranceFocus: "SCC and butterfat tolerance vs processor spec.",
  }),

  // ── MVP: Energy / Carbon ──────────────────────────────────────────────────
  profile({
    slug: "energy-efficiency-report",
    sectorSlug: "energy-consumption",
    sectorLabel: "Energy Consumption",
    decisionFamily: "energy_carbon_efficiency",
    secondaryFamilies: ["benchmark_health_decision", "measurement_accuracy"],
    reportFamily: "energy_carbon",
    engineModes: modes(
      "Current vs target kWh, energy rate, peak kWh and demand charge.",
      "Peak demand, equipment inefficiency and tariff risk inflate bills.",
      "Energy loss exposure in currency."
    ),
    lossImpacts: ["energy", "monetary", "carbon"],
    lossTypeLabels: ["Peak demand", "Equipment inefficiency", "Tariff risk"],
    reclassifiedTitle: "Energy Peak & Efficiency Loss Report",
    reclassifiedPromise: "Quantify peak demand, equipment inefficiency and tariff exposure.",
    whatIsMeasured: "kWh baseline vs target, peak load and demand charges.",
    whereIsLoss: "Idle equipment, peak shaving failure and wrong tariff.",
    toleranceFocus: "Power factor and peak kW tolerance vs contract.",
    mvpLossFamily: true,
  }),

  profile({
    slug: "cbam-compliance-verdict",
    sectorSlug: "energy-carbon",
    sectorLabel: "Carbon & CBAM",
    decisionFamily: "energy_carbon_efficiency",
    secondaryFamilies: ["benchmark_health_decision", "measurement_accuracy"],
    reportFamily: "energy_carbon",
    engineModes: modes(
      "Production tons, energy mix, EU import value and process emissions.",
      "Verification gap, carbon price risk and reporting error inflate CBAM cost.",
      "CBAM exposure threshold."
    ),
    lossImpacts: ["carbon", "monetary", "energy"],
    lossTypeLabels: ["CBAM cost", "Verification gap", "Carbon price risk"],
    reclassifiedTitle: "CBAM Carbon Exposure Loss Report",
    reclassifiedPromise: "Model CBAM cost, verification gap and carbon price risk on EU exports.",
    whatIsMeasured: "tCO₂, energy source, import value and process factor.",
    whereIsLoss: "Embedded emissions, transport leg and verification delays.",
    toleranceFocus: "Reporting tolerance vs verified emissions.",
    mvpLossFamily: true,
  }),
];

export function getPremiumArchitectureProfile(slug: string): PremiumArchitectureProfile | null {
  return SECTOR_LOSS_REGISTRY.find((entry) => entry.slug === slug) ?? null;
}

export function listMvpLossFamilySlugs(): readonly string[] {
  return SECTOR_LOSS_REGISTRY.filter((entry) => entry.mvpLossFamily).map((entry) => entry.slug);
}

export function listProfilesByReportFamily(
  family: PremiumReportFamily
): readonly PremiumArchitectureProfile[] {
  return SECTOR_LOSS_REGISTRY.filter((entry) => entry.reportFamily === family);
}

export function listProfilesByDecisionFamily(
  family: PremiumDecisionFamily
): readonly PremiumArchitectureProfile[] {
  return SECTOR_LOSS_REGISTRY.filter(
    (entry) =>
      entry.decisionFamily === family || entry.secondaryFamilies.includes(family)
  );
}
