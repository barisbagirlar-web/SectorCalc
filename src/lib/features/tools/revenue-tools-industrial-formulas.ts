/**
 * Industrial Formula Tools - 18 premium engineering & financial calculators.
 * Tier 1-4 industrial formulas registered as RevenueTool pairs.
 *
 * ECMI / ISO 9001 - TUV-certifiable engineering quality.
 * Every formula implements deterministic math from the industrial formula registry.
 */

import type { IndustrySlug } from "@/lib/features/tools/industry-registry";
import type { AdditionalRevenueTool } from "@/lib/features/tools/revenue-tools-additional";

const LEGAL =
  "This is a technical simulation and decision-support output. It is not financial, legal or engineering advice. Verify all results before making business decisions.";

type Input = AdditionalRevenueTool["freeInputs"][number];

/* ────────────────────────────── helper factories ────────────────────────────── */

const currency = (key: string, label: string, unit = "USD"): Input => ({
  key, label, type: "currency", unit, required: true,
});

const numberInput = (key: string, label: string, unit?: string, defaultValue?: number): Input => ({
  key, label, type: "number", unit, required: true, defaultValue,
});

const percentInput = (key: string, label: string, defaultValue?: number): Input => ({
  key, label, type: "percent", unit: "%", required: true, defaultValue,
});

const yesNoSelect = (key: string, label: string, defaultValue = "no"): Input => ({
  key, label, type: "select", required: true, defaultValue,
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ],
});

/* ────────────────────────────── build factory ────────────────────────────── */

function build(config: {
  sector: IndustrySlug;
  freeSlug: string;
  paidSlug: string;
  freeTitle: string;
  paidTitle: string;
  painStatement: string;
  freeValue: string;
  paidValue: string;
  freeInputs: Input[];
  paidInputs: Input[];
  freeResultPromise: string;
  paidResultPromise: string;
  verdictLabels: string[];
  seoKeywords: string[];
  freeMissingFactors: readonly string[];
  premiumCtaLabel: string;
  premiumTeaserTitle: string;
  premiumTeaserText: string;
}): AdditionalRevenueTool {
  return {
    ...config,
    legalDisclaimer: LEGAL,
    freeCalculatorInputIds: config.freeInputs.map((i) => i.key),
    freeResultIds: ["risk_signal"],
    premiumCtaLabel: config.premiumCtaLabel,
    premiumTeaserTitle: config.premiumTeaserTitle,
    premiumTeaserText: config.premiumTeaserText,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * TIER 1 - CRITICAL ITERATION TOOLS
 * ──────────────────────────────────────────────────────────────────────────── */

export const industrialFormulaTools: readonly AdditionalRevenueTool[] = [

  

  // ─── 2. NPV (Net Present Value) ─────────────────────────────────────────
  build({
    sector: "construction",
    freeSlug: "npv-quick-check",
    paidSlug: "npv-risk-analyzer",
    freeTitle: "NPV Quick Check",
    paidTitle: "NPV Risk-Adjusted Analyzer",
    painStatement: "Project NPV can mislead when risk probabilities and terminal value are ignored in the discount model.",
    freeValue: "Estimate base NPV from initial cost and annual net cash flows.",
    paidValue: "Risk-adjusted NPV with scenario probabilities, terminal value and sensitivity analysis.",
    freeInputs: [
      currency("initialCost", "Initial investment"),
      numberInput("cashFlowYears", "Annual net cash flow", "USD/yr"),
      percentInput("discountRate", "Discount rate", 10),
      numberInput("projectLifeYears", "Project life (years)", "years", 5),
    ],
    paidInputs: [
      currency("initialCost", "Initial investment"),
      numberInput("cashFlowYears1to5", "Avg cash flow years 1-5", "USD/yr"),
      numberInput("cashFlowYears6to10", "Avg cash flow years 6-10", "USD/yr"),
      percentInput("discountRate", "Discount rate", 10),
      numberInput("projectLifeYears", "Project life", "years", 10),
      percentInput("probabilityBase", "Probability of base case", 50),
      percentInput("probabilityOptimistic", "Probability of optimistic", 25),
      percentInput("terminalGrowthRate", "Terminal growth rate", 2),
      yesNoSelect("includeTerminalValue", "Include terminal value", "yes"),
    ],
    freeResultPromise: "Shows base NPV from uniform cash flows. Does not model risk or terminal value.",
    paidResultPromise: "Returns risk-adjusted NPV with probability-weighted scenarios, terminal value and sensitivity verdict.",
    verdictLabels: ["NEGATIVE NPV", "BORDERLINE", "POSITIVE NPV"],
    seoKeywords: ["npv calculator", "net present value", "project valuation", "dcf analysis"],
    freeMissingFactors: ["Probability-weighted scenarios", "Terminal value (Gordon growth)", "Risk-adjusted discount", "Sensitivity analysis", "NPV verdict"],
    premiumCtaLabel: "Unlock NPV Risk Analyzer",
    premiumTeaserTitle: "Uncertain about project returns?",
    premiumTeaserText: "Unlock the NPV Risk-Adjusted Analyzer for probability-weighted NPV with terminal value and sensitivity verdict.",
  }),

  // ─── 3. DCF (Discounted Cash Flow) ──────────────────────────────────────
  build({
    sector: "welding-fabrication",
    freeSlug: "dcf-valuation-check",
    paidSlug: "dcf-enterprise-valuator",
    freeTitle: "DCF Valuation Quick Check",
    paidTitle: "DCF Enterprise Valuator",
    painStatement: "Business valuation using simple multiples can miss true enterprise value; DCF with WACC is the gold standard.",
    freeValue: "Estimate simple DCF from projected cash flows and discount rate.",
    paidValue: "Full WACC-driven DCF with CAPM, terminal value, scenario weights and per-share valuation.",
    freeInputs: [
      numberInput("projectedCashFlow", "Annual projected FCF", "USD", 50000),
      percentInput("discountRate", "Discount rate", 10),
      numberInput("projectionYears", "Projection years", "years", 5),
    ],
    paidInputs: [
      numberInput("freeCashFlowYear1", "FCFF year 1", "USD"),
      numberInput("freeCashFlowYear2", "FCFF year 2", "USD"),
      numberInput("freeCashFlowYear3", "FCFF year 3", "USD"),
      numberInput("freeCashFlowYear4", "FCFF year 4", "USD"),
      numberInput("freeCashFlowYear5", "FCFF year 5", "USD"),
      currency("equityValue", "Equity market value"),
      currency("debtValue", "Debt market value"),
      percentInput("costOfEquity", "Cost of equity (Re)", 12),
      percentInput("costOfDebt", "Cost of debt (Rd)", 6),
      percentInput("taxRate", "Corporate tax rate", 22),
      percentInput("terminalGrowthRate", "Terminal growth rate", 2.5),
      numberInput("sharesOutstanding", "Shares outstanding"),
    ],
    freeResultPromise: "Shows base DCF estimate from uniform cash flows at a single discount rate.",
    paidResultPromise: "Returns full WACC-CAPM DCF with enterprise value, equity value and per-share valuation.",
    verdictLabels: ["UNDERVALUED", "FAIR VALUE", "OVERVALUED"],
    seoKeywords: ["dcf calculator", "discounted cash flow", "business valuation", "wacc calculator"],
    freeMissingFactors: ["WACC calculation with CAPM", "Terminal value", "Scenario weighting", "Per-share valuation", "Bull/base/bear cases"],
    premiumCtaLabel: "Unlock Enterprise Valuator",
    premiumTeaserTitle: "Valuing a business or project?",
    premiumTeaserText: "Unlock the DCF Enterprise Valuator for WACC-driven DCF with CAPM, scenario weights and per-share value.",
  }),

  // ─── 4. Lease vs Buy ────────────────────────────────────────────────────
  build({
    sector: "logistics-transport",
    freeSlug: "lease-vs-buy-check",
    paidSlug: "lease-vs-buy-analyzer",
    freeTitle: "Lease vs Buy Quick Check",
    paidTitle: "Lease vs Buy Decision Analyzer",
    painStatement: "Equipment lease vs buy decisions without tax shield and salvage can misallocate capital.",
    freeValue: "Compare simple lease payment vs purchase cost.",
    paidValue: "Full NAL analysis with depreciation tax shield, salvage value, maintenance and opportunity cost.",
    freeInputs: [
      currency("purchasePrice", "Purchase price"),
      numberInput("leaseTermMonths", "Lease term (months)", "months", 36),
      currency("monthlyLeasePayment", "Monthly lease payment"),
    ],
    paidInputs: [
      currency("purchasePrice", "Purchase price"),
      numberInput("leaseTermMonths", "Lease term (months)", "months", 60),
      currency("monthlyLeasePayment", "Monthly lease payment"),
      percentInput("taxRate", "Tax rate", 22),
      percentInput("salvageValuePercent", "Salvage value (% of purchase)", 20),
      percentInput("costOfDebt", "Cost of debt (pre-tax)", 6),
      currency("maintenanceDeltaYearly", "Extra maintenance (buy vs lease)", "USD/yr"),
      yesNoSelect("includeOpportunityCost", "Include opportunity cost", "yes"),
    ],
    freeResultPromise: "Shows simple total cost comparison. Does not model tax, salvage or maintenance.",
    paidResultPromise: "Returns NAL (Net Advantage to Leasing), break-even point and lease/buy decision verdict.",
    verdictLabels: ["LEASE (NAL < 0)", "BREAK-EVEN", "BUY (NAL > 0)"],
    seoKeywords: ["lease vs buy calculator", "equipment financing", "nal calculator", "lease decision"],
    freeMissingFactors: ["Depreciation tax shield", "Salvage value PV", "Maintenance delta", "Opportunity cost", "NAL decision"],
    premiumCtaLabel: "Unlock Lease/Buy Analyzer",
    premiumTeaserTitle: "Lease or buy equipment?",
    premiumTeaserText: "Unlock the Lease vs Buy Decision Analyzer for full NAL with tax shield, salvage and maintenance.",
  }),

  // ─── 5. Darcy-Weisbach Pressure Drop ────────────────────────────────────
  build({
    sector: "hvac",
    freeSlug: "pressure-drop-quick",
    paidSlug: "darcy-weisbach-analyzer",
    freeTitle: "Pipe Pressure Drop Quick Check",
    paidTitle: "Darcy-Weisbach Full Analyzer",
    painStatement: "Undersized piping can cause massive pump energy waste and flow shortfall; Darcy-Weisbach must include Colebrook iteration.",
    freeValue: "Estimate pressure drop using simplified Hazen-Williams. Low accuracy but fast.",
    paidValue: "Full Darcy-Weisbach with Colebrook-White Newton-Raphson iteration, minor losses and pump sizing.",
    freeInputs: [
      numberInput("flowRate", "Flow rate", "m³/h", 10),
      numberInput("pipeLength", "Pipe length", "m", 100),
      numberInput("pipeDiameter", "Pipe inner diameter", "mm", 50),
    ],
    paidInputs: [
      numberInput("flowRate", "Flow rate", "m³/h"),
      numberInput("pipeLength", "Pipe length", "m"),
      numberInput("pipeDiameter", "Pipe inner diameter", "mm"),
      numberInput("fluidDensity", "Fluid density", "kg/m³", 1000),
      numberInput("fluidViscosity", "Dynamic viscosity", "Pa·s", 0.001),
      {
        key: "pipeMaterial",
        label: "Pipe material (roughness)",
        type: "select",
        required: true,
        defaultValue: "steel",
        options: [
          { value: "drawn_tubing", label: "Drawn tubing (ε=0.0015mm)" },
          { value: "steel", label: "Commercial steel (ε=0.046mm)" },
          { value: "galvanized", label: "Galvanized iron (ε=0.15mm)" },
          { value: "cast_iron", label: "Cast iron (ε=0.26mm)" },
          { value: "concrete", label: "Concrete (ε=0.3-3mm)" },
          { value: "pvc", label: "PVC (ε=0.0015mm)" },
        ],
      },
      numberInput("elbow90Count", "90° elbow count", undefined, 0),
      numberInput("gateValveCount", "Gate valve count", undefined, 0),
      numberInput("teeCount", "Tee joint count", undefined, 0),
    ],
    freeResultPromise: "Shows approximate pressure drop using a uniform friction factor. Not suitable for design decisions.",
    paidResultPromise: "Returns Darcy friction factor via Colebrook-White iteration, total ΔP with minor losses, flow regime and pump power estimate.",
    verdictLabels: ["HIGH ΔP - REDESIGN NEEDED", "MODERATE ΔP", "LOW ΔP - ACCEPTABLE"],
    seoKeywords: ["pressure drop calculator", "darcy weisbach", "colebrook white", "pipe friction", "hvac pipe sizing"],
    freeMissingFactors: ["Colebrook-White friction factor", "Reynolds number regime", "Minor losses (fittings)", "Pipe roughness selection", "Pump power estimate"],
    premiumCtaLabel: "Unlock Darcy-Weisbach Analyzer",
    premiumTeaserTitle: "Sizing a pipe system?",
    premiumTeaserText: "Unlock the Darcy-Weisbach Full Analyzer for Colebrook-White friction factor, minor losses and pump sizing.",
  }),

  // ─── 6. Heat Exchanger Sizing (LMTD) ────────────────────────────────────
  build({
    sector: "electrical-contracting",
    freeSlug: "heat-exchanger-quick",
    paidSlug: "lmtd-heat-exchanger-analyzer",
    freeTitle: "Heat Exchanger Quick Estimate",
    paidTitle: "LMTD Heat Exchanger Sizer",
    painStatement: "Heat exchanger undersizing causes process bottlenecks; LMTD with correction factor is essential for shell-and-tube design.",
    freeValue: "Estimate required heat transfer area using simplified log-mean temperature method.",
    paidValue: "Full LMTD with counter-flow and parallel-flow, F-correction for multi-pass, U calculation with fouling and NTU-effectiveness method.",
    freeInputs: [
      numberInput("heatDuty", "Required heat duty", "kW", 100),
      numberInput("hotInletTemp", "Hot fluid inlet", "°C", 90),
      numberInput("hotOutletTemp", "Hot fluid outlet", "°C", 60),
      numberInput("coldInletTemp", "Cold fluid inlet", "°C", 20),
      numberInput("coldOutletTemp", "Cold fluid outlet", "°C", 50),
    ],
    paidInputs: [
      numberInput("heatDuty", "Required heat duty", "kW"),
      numberInput("hotInletTemp", "Hot fluid inlet T_h,in", "°C"),
      numberInput("hotOutletTemp", "Hot fluid outlet T_h,out", "°C"),
      numberInput("coldInletTemp", "Cold fluid inlet T_c,in", "°C"),
      numberInput("coldOutletTemp", "Cold fluid outlet T_c,out", "°C"),
      numberInput("hConvInside", "Inside convection h_i", "W/m²K", 1500),
      numberInput("hConvOutside", "Outside convection h_o", "W/m²K", 1000),
      numberInput("wallThermalConductivity", "Wall thermal conductivity k_w", "W/mK", 50),
      numberInput("tubeInnerRadius", "Tube inner radius r_i", "mm", 8),
      numberInput("tubeOuterRadius", "Tube outer radius r_o", "mm", 10),
      numberInput("foulingFactorInside", "Inside fouling R_fi", "m²K/W", 0.0001),
      numberInput("foulingFactorOutside", "Outside fouling R_fo", "m²K/W", 0.0002),
      {
        key: "flowArrangement",
        label: "Flow arrangement",
        type: "select",
        required: true,
        defaultValue: "counter",
        options: [
          { value: "counter", label: "Counter-flow" },
          { value: "parallel", label: "Parallel-flow" },
        ],
      },
    ],
    freeResultPromise: "Shows approximate LMTD area estimate from end temperatures and a uniform U-value assumption.",
    paidResultPromise: "Returns LMTD with ΔT₁=ΔT₂ guard, F-correction factor, overall U with fouling, required area and NTU-effectiveness verification.",
    verdictLabels: ["OVERSPECIFIED (>20% margin)", "DESIGN ACCEPTABLE", "UNDERSIZED - REDESIGN"],
    seoKeywords: ["heat exchanger calculator", "lmtd calculator", "heat transfer sizing", "shell and tube", "ntu method"],
    freeMissingFactors: ["F-correction for multi-pass", "Overall U with fouling", "Tubular geometry", "NTU-effectiveness check", "F<0.75 redesign alert"],
    premiumCtaLabel: "Unlock Heat Exchanger Sizer",
    premiumTeaserTitle: "Sizing a shell-and-tube exchanger?",
    premiumTeaserText: "Unlock the LMTD Heat Exchanger Sizer for full thermal design with F-correction, fouling and NTU verification.",
  }),

  // ─── 7. OEE (Overall Equipment Effectiveness) ───────────────────────────
  build({
    sector: "sheet-metal",
    freeSlug: "oee-quick-check",
    paidSlug: "oee-six-big-losses-analyzer",
    freeTitle: "OEE Quick Check",
    paidTitle: "OEE & Six Big Losses Analyzer",
    painStatement: "Hidden downtime and speed losses can cut effective capacity by 40% without showing on any single meter.",
    freeValue: "Estimate OEE from availability, performance and quality rates.",
    paidValue: "Full OEE with Six Big Losses decomposition, TEEP, loss category distribution and World Class benchmark.",
    freeInputs: [
      percentInput("availability", "Availability", 85),
      percentInput("performance", "Performance", 80),
      percentInput("quality", "Quality", 95),
    ],
    paidInputs: [
      numberInput("plannedProductionTime", "Planned production time", "hr/month"),
      numberInput("downtimeHours", "Downtime (breakdowns+setup)", "hr/month"),
      numberInput("idealCycleTime", "Ideal cycle time", "min/unit"),
      numberInput("totalUnitsProduced", "Total units produced"),
      numberInput("goodUnitsProduced", "Good units produced"),
      numberInput("smallStopsMinutes", "Small stops", "min/month"),
      numberInput("setupHours", "Setup & adjustment", "hr/month"),
    ],
    freeResultPromise: "Shows composite OEE from user-supplied component rates. Does not decompose losses.",
    paidResultPromise: "Returns OEE, TEEP, Six Big Losses breakdown (%), World Class gap, loss Pareto and improvement priority.",
    verdictLabels: ["URGENT (OEE < 50%)", "IMPROVEMENT NEEDED (50-85%)", "WORLD CLASS (≥ 85%)"],
    seoKeywords: ["oee calculator", "overall equipment effectiveness", "six big losses", "teep", "manufacturing efficiency"],
    freeMissingFactors: ["Six Big Losses decomposition", "TEEP (utilization-adjusted)", "Loss Pareto chart", "World Class gap analysis", "Improvement priority"],
    premiumCtaLabel: "Unlock Full OEE Analyzer",
    premiumTeaserTitle: "Losing production capacity?",
    premiumTeaserText: "Unlock the OEE & Six Big Losses Analyzer for World Class benchmarking and loss Pareto.",
  }),

  // ─── 8. Line Balancing ──────────────────────────────────────────────────
  build({
    sector: "3d-printing-service",
    freeSlug: "line-balancing-quick",
    paidSlug: "line-balancing-analyzer",
    freeTitle: "Line Balancing Quick Check",
    paidTitle: "Line Balancing & Takt Optimizer",
    painStatement: "Unbalanced assembly lines create WIP bottlenecks and waiting waste that standard efficiency metrics miss.",
    freeValue: "Calculate takt time and theoretical minimum stations from total work content.",
    paidValue: "Full line balancing with Largest Candidate Rule, station load distribution, bottleneck detection and rebalance recommendations.",
    freeInputs: [
      numberInput("totalWorkContent", "Total work content sum(t_i)", "min", 45),
      numberInput("taktTime", "Takt time", "min/unit", 10),
      numberInput("actualStations", "Actual stations (N)", undefined, 6),
    ],
    paidInputs: [
      numberInput("taskCount", "Number of tasks", undefined, 8),
      numberInput("totalWorkContent", "Total work content Σ(t_i)", "min"),
      numberInput("taktTime", "Takt time", "min/unit"),
      numberInput("actualStations", "Actual stations (N_real)"),
      numberInput("availableTimePerShift", "Available time per shift", "min"),
      numberInput("customerDemandPerShift", "Customer demand per shift"),
    ],
    freeResultPromise: "Shows takt time ratio and theoretical minimum station count. Does not model individual station loads.",
    paidResultPromise: "Returns balance efficiency η, balance loss %, bottleneck station, station load distribution and rebalance action.",
    verdictLabels: ["SEVERE IMBALANCE (η < 60%)", "MODERATE IMBALANCE (60-85%)", "WELL BALANCED (η ≥ 85%)"],
    seoKeywords: ["line balancing calculator", "takt time calculator", "assembly line balance", "production efficiency"],
    freeMissingFactors: ["Individual station load allocation", "Largest Candidate Rule assignment", "Bottleneck identification", "Rebalance recommendation", "Line efficiency η"],
    premiumCtaLabel: "Unlock Line Balancing Analyzer",
    premiumTeaserTitle: "Production line bottlenecks?",
    premiumTeaserText: "Unlock the Line Balancing & Takt Optimizer for station load distribution, bottleneck detection and rebalance plan.",
  }),

  // ─── 9. Standard Time / Work Study ──────────────────────────────────────
  build({
    sector: "printing-signage",
    freeSlug: "standard-time-quick",
    paidSlug: "standard-time-work-study",
    freeTitle: "Standard Time Quick Check",
    paidTitle: "Standard Time & Work Study Analyzer",
    painStatement: "Relying on observed times without rating and allowance adjustments leads to chronic understaffing and cost overruns.",
    freeValue: "Calculate basic standard time from observed time and allowance.",
    paidValue: "Full standard time with rating factor, sample size statistics, allowance breakdown and MTM-1 reference.",
    freeInputs: [
      numberInput("observedTime", "Observed time (avg)", "min", 5.0),
      numberInput("allowancePercent", "Total allowance", "%", 15),
    ],
    paidInputs: [
      numberInput("observedTime", "Observed mean time OT", "min"),
      numberInput("sampleStdDev", "Sample standard deviation s", "min"),
      numberInput("sampleSize", "Sample size n"),
      percentInput("ratingFactor", "Rating factor RF", 100),
      percentInput("personalAllowance", "Personal allowance", 5),
      percentInput("fatigueAllowance", "Fatigue allowance", 8),
      percentInput("delayAllowance", "Delay allowance", 3),
      percentInput("confidenceLevel", "Confidence level", 95),
      percentInput("errorMargin", "Acceptable error margin", 5),
    ],
    freeResultPromise: "Shows basic standard time from uniform observed time and total allowance.",
    paidResultPromise: "Returns normal time NT, standard time ST, required sample size n*, statistical confidence and MTM-1 equivalents.",
    verdictLabels: ["INSAMPLE SIZE TOO SMALL", "CONFIDENCE MARGINAL", "STATISTICALLY VALID"],
    seoKeywords: ["standard time calculator", "work measurement", "time study", "mtm analysis", "allowance calculation"],
    freeMissingFactors: ["Rating factor adjustment", "Statistical sample size check", "Allowance breakdown", "MTM-1 equivalents", "Confidence interval"],
    premiumCtaLabel: "Unlock Work Study Analyzer",
    premiumTeaserTitle: "Setting production standards?",
    premiumTeaserText: "Unlock the Standard Time & Work Study Analyzer for rating-adjusted standard time and statistical validation.",
  }),

  // ─── 10. Learning Curve ─────────────────────────────────────────────────
  build({
    sector: "carpentry-millwork",
    freeSlug: "learning-curve-quick",
    paidSlug: "learning-curve-cost-projector",
    freeTitle: "Learning Curve Quick Check",
    paidTitle: "Learning Curve Cost Projector",
    painStatement: "Without modeling the learning curve, long-run unit cost projections can be 30-50% higher than actual, leading to overpricing.",
    freeValue: "Estimate unit time at Nth unit from first-unit time and learning rate.",
    paidValue: "Full Wright and Crawford learning curve models with cumulative average, cost projection and break-even analysis.",
    freeInputs: [
      numberInput("firstUnitTime", "First unit time", "hr", 100),
      percentInput("learningRate", "Learning rate %", 80),
      numberInput("targetUnitN", "Target unit N", undefined, 100),
    ],
    paidInputs: [
      numberInput("firstUnitTime", "First unit time a", "hr"),
      percentInput("learningRate", "Learning rate p", 80),
      numberInput("cumulativeQuantity", "Cumulative quantity N"),
      currency("hourlyCost", "Hourly cost", "USD/hr"),
      currency("unitMaterialCost", "Unit material cost"),
      numberInput("targetUnitCost", "Target unit cost (break-even)", "USD"),
      {
        key: "learningModel",
        label: "Learning curve model",
        type: "select",
        required: true,
        defaultValue: "wright",
        options: [
          { value: "wright", label: "Wright (unit)" },
          { value: "crawford", label: "Crawford (cumulative avg)" },
        ],
      },
    ],
    freeResultPromise: "Shows estimated unit time at target N using the Wright unit model.",
    paidResultPromise: "Returns Wright and Crawford projections, cumulative average cost, total labor cost, break-even point and model comparison.",
    verdictLabels: ["BELOW BREAK-EVEN", "ON TRACK", "ABOVE TARGET COST"],
    seoKeywords: ["learning curve calculator", "wright model", "crawford model", "manufacturing cost projection"],
    freeMissingFactors: ["Crawford cumulative model", "Total cost projection", "Break-even quantity n*", "Hourly cost integration", "Model comparison"],
    premiumCtaLabel: "Unlock Cost Projector",
    premiumTeaserTitle: "Projecting long-run production cost?",
    premiumTeaserText: "Unlock the Learning Curve Cost Projector for Wright & Crawford models with break-even analysis.",
  }),

  // ────────────────────────────────────────────────────────────────────────────
  // TIER 2 - SPRING DESIGN
  // ────────────────────────────────────────────────────────────────────────────

  // ─── 11. Spring Design ──────────────────────────────────────────────────
  build({
    sector: "roofing",
    freeSlug: "spring-design-quick",
    paidSlug: "spring-design-analyzer",
    freeTitle: "Spring Design Quick Check",
    paidTitle: "Helical Spring Design Analyzer",
    painStatement: "Spring failure in safety-critical applications can cause catastrophic mechanism failure; Wahl correction and buckling check are mandatory.",
    freeValue: "Estimate spring rate from wire diameter, coil diameter and active coils.",
    paidValue: "Full helical compression spring design with Wahl stress correction, buckling check, Goodman fatigue and material selection.",
    freeInputs: [
      numberInput("wireDiameter", "Wire diameter d", "mm", 5),
      numberInput("meanCoilDiameter", "Mean coil diameter D", "mm", 40),
      numberInput("activeCoils", "Active coils N_a", undefined, 10),
      numberInput("springLoad", "Applied load F", "N", 500),
    ],
    paidInputs: [
      numberInput("wireDiameter", "Wire diameter d", "mm"),
      numberInput("meanCoilDiameter", "Mean coil diameter D", "mm"),
      numberInput("activeCoils", "Active coils N_a"),
      numberInput("totalCoils", "Total coils N_t"),
      numberInput("springFreeLength", "Free length L₀", "mm"),
      numberInput("springLoad", "Applied load F", "N"),
      numberInput("minLoadFmin", "Minimum load F_min", "N", 0),
      {
        key: "endCondition",
        label: "End condition",
        type: "select",
        required: true,
        defaultValue: "both_free",
        options: [
          { value: "both_free", label: "Both ends free" },
          { value: "one_fixed_one_free", label: "One fixed, one free" },
        ],
      },
      {
        key: "material",
        label: "Material",
        type: "select",
        required: true,
        defaultValue: "steel",
        options: [
          { value: "steel", label: "Steel (G=79.3 GPa)" },
          { value: "stainless", label: "Stainless (G=68.9 GPa)" },
        ],
      },
      {
        key: "loadType",
        label: "Load type",
        type: "select",
        required: true,
        defaultValue: "static",
        options: [
          { value: "static", label: "Static" },
          { value: "fatigue", label: "Fatigue" },
        ],
      },
    ],
    freeResultPromise: "Shows approximate spring rate from basic wire and coil geometry.",
    paidResultPromise: "Returns spring rate k, Wahl-corrected max stress τ_max, buckling stability λ, Goodman fatigue criterion and safety factor.",
    verdictLabels: ["BUCKLING RISK - REDESIGN", "STRESS EXCEEDED", "DESIGN ACCEPTABLE"],
    seoKeywords: ["spring design calculator", "helical spring", "wahl correction", "goodman fatigue", "buckling spring"],
    freeMissingFactors: ["Wahl curvature correction", "Buckling slenderness check", "Goodman fatigue criterion", "Material selection", "Safety factor"],
    premiumCtaLabel: "Unlock Spring Analyzer",
    premiumTeaserTitle: "Designing a safety-critical spring?",
    premiumTeaserText: "Unlock the Helical Spring Design Analyzer for Wahl correction, buckling check and Goodman fatigue analysis.",
  }),

  // ────────────────────────────────────────────────────────────────────────────
  // TIER 2 - ENVIRONMENT
  // ────────────────────────────────────────────────────────────────────────────

  // ─── 12. Carbon Footprint (Scope 1, 2, 3) ────────────────────────────────
  build({
    sector: "energy-carbon",
    freeSlug: "carbon-footprint-scope123",
    paidSlug: "carbon-footprint-full-analyzer",
    freeTitle: "Carbon Footprint Quick Check",
    paidTitle: "Carbon Footprint Scope 1-2-3 Full Analyzer",
    painStatement: "Carbon reporting without Scope 3 underestimates true exposure by 70-90%. CBAM penalties can reach 35% of import value.",
    freeValue: "Estimate preliminary CO₂e from production volume and energy mix.",
    paidValue: "Full GHG Protocol Scope 1-2-3 with GWP-AR6 factors, CO₂e conversion, CBAM cost estimate and mitigation priority.",
    freeInputs: [
      numberInput("naturalGasUsage", "Natural gas usage", "m³/month", 500),
      numberInput("electricityUsage", "Electricity usage", "kWh/month", 10000),
      numberInput("productionVolume", "Production volume", "tons/month", 100),
    ],
    paidInputs: [
      numberInput("naturalGasUsage", "Natural gas (Scope 1)", "m³/month"),
      numberInput("dieselUsage", "Diesel (Scope 1)", "L/month", 0),
      numberInput("gasolineUsage", "Gasoline (Scope 1)", "L/month", 0),
      numberInput("electricityUsage", "Grid electricity (Scope 2)", "kWh/month"),
      {
        key: "gridRegion",
        label: "Grid region (EF)",
        type: "select",
        required: true,
        defaultValue: "turkey",
        options: [
          { value: "turkey", label: "Turkey (0.447 kgCO₂e/kWh)" },
          { value: "eu_avg", label: "EU average (0.233 kgCO₂e/kWh)" },
          { value: "renewable", label: "Renewable PPA (0.000 kgCO₂e/kWh)" },
          { value: "global_avg", label: "Global average (0.475 kgCO₂e/kWh)" },
        ],
      },
      numberInput("businessTravelKm", "Business travel (Scope 3)", "km/month", 0),
      numberInput("freightTonKm", "Freight (Scope 3)", "ton-km/month", 0),
      numberInput("wasteTons", "Waste (Scope 3)", "tons/month", 0),
      currency("importValueEUR", "EU import value (CBAM)", "EUR"),
      yesNoSelect("includeCH4andN2O", "Include CH₄/N₂O (agriculture)", "no"),
    ],
    freeResultPromise: "Shows simplified CO₂ estimate from natural gas and grid electricity only.",
    paidResultPromise: "Returns total CO₂e by Scope 1-2-3, GWP-weighted breakdown, CBAM cost € and mitigation priority matrix.",
    verdictLabels: ["HIGH EXPOSURE (>1000 tCO₂e)", "MODERATE (100-1000)", "LOW (<100 tCO₂e)"],
    seoKeywords: ["carbon footprint calculator", "ghg protocol", "scope 1 2 3", "cbam", "co2 emissions"],
    freeMissingFactors: ["Full fuel breakdown", "Grid region EF selection", "Scope 3 waste/travel/freight", "GWP-weighted gases", "CBAM cost €"],
    premiumCtaLabel: "Unlock Full Carbon Analyzer",
    premiumTeaserTitle: "Exporting to the EU?",
    premiumTeaserText: "Unlock the Carbon Footprint Scope 1-2-3 Full Analyzer for GHG Protocol reporting and CBAM cost estimation.",
  }),

  // ────────────────────────────────────────────────────────────────────────────
  // TIER 3 - STATISTICAL TOOLS
  // ────────────────────────────────────────────────────────────────────────────

  // ─── 13. Regression & Correlation ────────────────────────────────────────
  build({
    sector: "energy-consumption",
    freeSlug: "regression-quick-check",
    paidSlug: "regression-correlation-analyzer",
    freeTitle: "Regression Quick Check",
    paidTitle: "Regression & Correlation Analyzer",
    painStatement: "Simple averages hide process trends; OLS regression with R², F-test and significance is the minimum standard for data-driven decisions.",
    freeValue: "Estimate simple linear regression slope and intercept from paired data points.",
    paidValue: "Full OLS regression with R², adjusted R², F-test, t-statistics, Pearson/Spearman correlation and residual analysis.",
    freeInputs: [
      numberInput("regressionN", "Number of data pairs n", undefined, 10),
      numberInput("regressionSumX", "Σx", undefined, 55),
      numberInput("regressionSumY", "Σy", undefined, 100),
      numberInput("regressionSumXY", "Σxy", undefined, 600),
      numberInput("regressionSumX2", "Σx²", undefined, 385),
      numberInput("regressionSumY2", "Σy²", undefined, 1200),
    ],
    paidInputs: [
      numberInput("regressionN", "Number of data pairs n"),
      numberInput("regressionSumX", "Σx"),
      numberInput("regressionSumY", "Σy"),
      numberInput("regressionSumXY", "Σxy"),
      numberInput("regressionSumX2", "Σx²"),
      numberInput("regressionSumY2", "Σy²"),
    ],
    freeResultPromise: "Shows simple linear regression slope β₁, intercept β₀ and basic R².",
    paidResultPromise: "Returns β₀, β₁, R², adjusted R², F-statistic with p-value, t-statistics, Pearson r, residual standard error and significance verdict.",
    verdictLabels: ["NOT SIGNIFICANT (p ≥ 0.05)", "WEAK (R² < 0.6)", "SIGNIFICANT (R² ≥ 0.6, p < 0.05)"],
    seoKeywords: ["regression calculator", "linear regression", "correlation coefficient", "r squared", "statistical analysis"],
    freeMissingFactors: ["Adjusted R²", "F-test with p-value", "t-statistic for coefficients", "Pearson r significance", "Residual analysis"],
    premiumCtaLabel: "Unlock Regression Analyzer",
    premiumTeaserTitle: "Analyzing process data trends?",
    premiumTeaserText: "Unlock the Regression & Correlation Analyzer for full OLS with R², F-test, t-statistics and significance verdict.",
  }),

  // ─── 14. Sample Size (Power Analysis) ────────────────────────────────────
  build({
    sector: "agriculture-crops",
    freeSlug: "sample-size-quick",
    paidSlug: "sample-size-power-analyzer",
    freeTitle: "Sample Size Quick Check",
    paidTitle: "Sample Size & Power Analyzer",
    painStatement: "Underpowered studies waste resources and miss real effects; proper power analysis prevents both Type I and Type II errors.",
    freeValue: "Calculate minimum sample size for proportion estimation at a given confidence level.",
    paidValue: "Full sample size for proportions and means with Type I/II error balance, statistical power and effect size sensitivity.",
    freeInputs: [
      percentInput("confidenceLevel", "Confidence level", 95),
      percentInput("errorMargin", "Acceptable error margin", 5),
      percentInput("estimatedProportion", "Estimated proportion p̂", 50),
    ],
    paidInputs: [
      {
        key: "testType",
        label: "Test type",
        type: "select",
        required: true,
        defaultValue: "proportion",
        options: [
          { value: "proportion", label: "Proportion" },
          { value: "mean", label: "Mean (t-test)" },
        ],
      },
      percentInput("confidenceLevel", "Confidence level (1-α)", 95),
      percentInput("errorMargin", "Acceptable error margin e", 5),
      percentInput("estimatedProportion", "Estimated proportion p̂", 50),
      percentInput("estimatedStdDev", "Estimated std dev σ", 10),
      percentInput("detectableEffect", "Detectable effect size Δ", 5),
      {
        key: "powerLevel",
        label: "Statistical power (1-β)",
        type: "select",
        required: true,
        defaultValue: "80",
        options: [
          { value: "80", label: "80% (standard)" },
          { value: "90", label: "90% (high)" },
          { value: "95", label: "95% (very high)" },
        ],
      },
    ],
    freeResultPromise: "Shows minimum sample size for proportion estimation at specified confidence and margin.",
    paidResultPromise: "Returns n for proportion/mean, actual power, Type I/II error rates and sample adequacy verdict.",
    verdictLabels: ["INADEQUATE - INCREASE SAMPLE", "MARGINAL", "ADEQUATE POWER (≥ 80%)"],
    seoKeywords: ["sample size calculator", "power analysis", "statistical power", "survey sample", "aql sampling"],
    freeMissingFactors: ["Mean (t-test) mode", "Power level selection", "Type I/II error balance", "Effect size sensitivity", "Sample adequacy verdict"],
    premiumCtaLabel: "Unlock Power Analyzer",
    premiumTeaserTitle: "Planning a statistical study?",
    premiumTeaserText: "Unlock the Sample Size & Power Analyzer for proportion and mean tests with Type I/II error analysis.",
  }),

  // ─── 15. ANOVA ──────────────────────────────────────────────────────────
  build({
    sector: "agriculture-irrigation",
    freeSlug: "anova-quick-check",
    paidSlug: "anova-variance-analyzer",
    freeTitle: "ANOVA Quick Check",
    paidTitle: "ANOVA & Post-Hoc Analyzer",
    painStatement: "Comparing multiple group means without ANOVA inflates Type I error; one-way ANOVA with post-hoc tests is the minimum standard.",
    freeValue: "Estimate one-way ANOVA F-statistic from group means, variances and sample sizes.",
    paidValue: "Full one-way ANOVA with SS decomposition, F-test, η² effect size, Tukey HSD and Bonferroni post-hoc tests.",
    freeInputs: [
      numberInput("groupCount", "Number of groups k", undefined, 3),
      numberInput("totalSampleSize", "Total sample size N", undefined, 30),
      numberInput("anovaGrandMean", "Grand mean ȳ_grand", undefined, 50),
      numberInput("anovaBetweenSS", "SS_between", undefined, 400),
      numberInput("anovaWithinSS", "SS_within", undefined, 800),
    ],
    paidInputs: [
      numberInput("groupCount", "Number of groups k"),
      numberInput("totalSampleSize", "Total sample size N"),
      numberInput("anovaGrandMean", "Grand mean ȳ_grand"),
      numberInput("group1Mean", "Group 1 mean ȳ₁"),
      numberInput("group1Size", "Group 1 size n₁"),
      numberInput("group2Mean", "Group 2 mean ȳ₂"),
      numberInput("group2Size", "Group 2 size n₂"),
      numberInput("group3Mean", "Group 3 mean ȳ₃"),
      numberInput("group3Size", "Group 3 size n₃"),
      numberInput("group4Mean", "Group 4 mean ȳ₄"),
      numberInput("group4Size", "Group 4 size n₄"),
      numberInput("group5Mean", "Group 5 mean ȳ₅"),
      numberInput("group5Size", "Group 5 size n₅"),
    ],
    freeResultPromise: "Shows preliminary F-statistic from supplied SS values. Does not compute post-hoc tests.",
    paidResultPromise: "Returns complete ANOVA table (SS, df, MS, F, p), η² effect size, Tukey HSD pairwise differences and significance verdict.",
    verdictLabels: ["H₀ NOT REJECTED (p ≥ α)", "MARGINAL (p ≈ α)", "H₀ REJECTED (p < α) - GROUPS DIFFER"],
    seoKeywords: ["anova calculator", "one-way anova", "tukey hsd", "post-hoc test", "variance analysis"],
    freeMissingFactors: ["Group mean/variance input", "Complete SS decomposition", "η² effect size", "Tukey HSD pairwise", "Bonferroni correction"],
    premiumCtaLabel: "Unlock ANOVA Analyzer",
    premiumTeaserTitle: "Comparing multiple groups?",
    premiumTeaserText: "Unlock the ANOVA & Post-Hoc Analyzer for one-way ANOVA with F-test, η² effect size and Tukey HSD.",
  }),

  // ────────────────────────────────────────────────────────────────────────────
  // TIER 4 - CONTEXTUAL TOOLS
  // ────────────────────────────────────────────────────────────────────────────

  // ─── 16. ROI (Return on Investment) ──────────────────────────────────────
  build({
    sector: "auto-repair-shop",
    freeSlug: "roi-quick-check",
    paidSlug: "roi-payback-analyzer",
    freeTitle: "ROI Quick Check",
    paidTitle: "ROI & Payback Analyzer",
    painStatement: "ROI alone without payback period, IRR and NPV can lead to capital misallocation; all three must be presented together.",
    freeValue: "Calculate simple ROI percentage from total investment and net return.",
    paidValue: "Full ROI with payback period, IRR (via Newton-NPV), NPV at target discount and integrated investment verdict.",
    freeInputs: [
      currency("totalInvestment", "Total investment"),
      currency("annualNetReturn", "Annual net return"),
      numberInput("investmentLifeYears", "Investment life", "years", 5),
    ],
    paidInputs: [
      currency("totalInvestment", "Total investment"),
      currency("annualNetReturnYear1", "Net return year 1"),
      currency("annualNetReturnYear2", "Net return year 2"),
      currency("annualNetReturnYear3", "Net return year 3"),
      currency("annualNetReturnYear4", "Net return year 4"),
      currency("annualNetReturnYear5", "Net return year 5"),
      percentInput("targetDiscountRate", "Target discount rate", 10),
    ],
    freeResultPromise: "Shows simple ROI percent and approximate payback period from uniform annual returns.",
    paidResultPromise: "Returns ROI%, exact payback period, IRR, NPV and consolidated investment decision verdict.",
    verdictLabels: ["REJECT", "BORDERLINE - REVIEW RISK", "ACCEPT - POSITIVE ROI+IRR+NPV"],
    seoKeywords: ["roi calculator", "return on investment", "payback period", "investment analysis"],
    freeMissingFactors: ["Exact payback (non-uniform)", "IRR calculation", "NPV at target rate", "Multi-period cash flows", "Consolidated verdict"],
    premiumCtaLabel: "Unlock ROI/Payback Analyzer",
    premiumTeaserTitle: "Evaluating an investment?",
    premiumTeaserText: "Unlock the ROI & Payback Analyzer for ROI%, payback, IRR and NPV in one consolidated verdict.",
  }),

  // ─── 17. Belt-Pulley & Gear Ratio ────────────────────────────────────────
  build({
    sector: "plumbing",
    freeSlug: "belt-pulley-quick",
    paidSlug: "belt-pulley-gear-analyzer",
    freeTitle: "Belt-Pulley Quick Check",
    paidTitle: "Belt-Pulley & Gear Ratio Analyzer",
    painStatement: "Wrong pulley ratio or belt slip can cause motor overload, reduce machine life and waste energy across the drive train.",
    freeValue: "Calculate speed ratio from driver and driven pulley diameters.",
    paidValue: "Full belt-pulley and gear train analysis with slip correction, power transmission (Euler), multi-stage gear ratios and total efficiency.",
    freeInputs: [
      numberInput("driverPulleyDiameter", "Driver pulley diameter d₁", "mm", 100),
      numberInput("drivenPulleyDiameter", "Driven pulley diameter d₂", "mm", 200),
      numberInput("driverRPM", "Driver speed N₁", "rpm", 1450),
    ],
    paidInputs: [
      numberInput("driverPulleyDiameter", "Driver pulley diameter d₁", "mm"),
      numberInput("drivenPulleyDiameter", "Driven pulley diameter d₂", "mm"),
      numberInput("driverRPM", "Driver speed N₁", "rpm"),
      numberInput("beltTensionF1", "Tight side tension F₁", "N"),
      numberInput("beltTensionF2", "Slack side tension F₂", "N"),
      numberInput("coefficientFriction", "Coefficient of friction μ", undefined, 0.35),
      numberInput("wrapAngle", "Wrap angle θ", "°", 180),
      numberInput("slipPercent", "Belt slip s", "%", 2),
      {
        key: "beltType",
        label: "Belt type",
        type: "select",
        required: true,
        defaultValue: "v_belt",
        options: [
          { value: "v_belt", label: "V-belt (s=2%)" },
          { value: "flat", label: "Flat belt (s=3%)" },
          { value: "timing", label: "Timing belt (s=0%)" },
        ],
      },
      {
        key: "gearStageCount",
        label: "Gear stages",
        type: "select",
        required: true,
        defaultValue: "1",
        options: [
          { value: "1", label: "Single stage" },
          { value: "2", label: "Two stages" },
          { value: "3", label: "Three stages" },
        ],
      },
    ],
    freeResultPromise: "Shows ideal speed ratio and driven RPM. Does not model slip, power or gear stages.",
    paidResultPromise: "Returns speed ratio i, actual RPM with slip, belt speed v, power transmission, Euler tension ratio, multi-stage gear ratio and total efficiency.",
    verdictLabels: ["BELT SLIP EXCESSIVE (>5%)", "MARGINAL EFFICIENCY", "DRIVE DESIGN ACCEPTABLE"],
    seoKeywords: ["belt pulley calculator", "gear ratio calculator", "speed ratio", "power transmission", "drive train"],
    freeMissingFactors: ["Belt slip correction", "Power transmission (F₁-F₂)v", "Euler tension ratio", "Multi-stage gear efficiency", "Total drive efficiency"],
    premiumCtaLabel: "Unlock Drive Analyzer",
    premiumTeaserTitle: "Designing a belt or gear drive?",
    premiumTeaserText: "Unlock the Belt-Pulley & Gear Ratio Analyzer for slip-corrected speed, power transmission and multi-stage efficiency.",
  }),

  
];

export default industrialFormulaTools;
