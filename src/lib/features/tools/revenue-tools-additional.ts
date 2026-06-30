import type { IndustrySlug } from "@/lib/features/tools/industry-registry";

const LEGAL_DISCLAIMER =
 "This is a technical simulation and decision-support output. It is not financial, legal or engineering advice. Verify all results before making business decisions.";

type RevenueInputType = "number" | "currency" | "percent" | "select";

type RevenueToolInput = {
 key: string;
 label: string;
 type: RevenueInputType;
 unit?: string;
 required: boolean;
 defaultValue?: number | string;
 helperText?: string;
 options?: readonly { value: string; label: string }[];
};

export type AdditionalRevenueTool = {
 sector: IndustrySlug;
 freeSlug: string;
 paidSlug: string;
 freeTitle: string;
 paidTitle: string;
 painStatement: string;
 freeValue: string;
 paidValue: string;
 freeInputs: RevenueToolInput[];
 paidInputs: RevenueToolInput[];
 freeResultPromise: string;
 paidResultPromise: string;
 verdictLabels: string[];
 legalDisclaimer: string;
 seoKeywords: string[];
 freeCalculatorInputIds: readonly string[];
 freeResultIds: readonly string[];
 freeMissingFactors: readonly string[];
 premiumCtaLabel: string;
 premiumTeaserTitle: string;
 premiumTeaserText: string;
};

type NewToolConfig = {
 sector: IndustrySlug;
 freeSlug: string;
 paidSlug: string;
 freeTitle: string;
 paidTitle: string;
 painStatement: string;
 freeValue: string;
 paidValue: string;
 freeInputs: RevenueToolInput[];
 paidInputs: RevenueToolInput[];
 freeResultPromise: string;
 paidResultPromise: string;
 verdictLabels: string[];
 seoKeywords: string[];
 freeMissingFactors: readonly string[];
 premiumCtaLabel: string;
 premiumTeaserTitle: string;
 premiumTeaserText: string;
};

function buildTool(config: NewToolConfig): AdditionalRevenueTool {
 return {
 ...config,
 legalDisclaimer: LEGAL_DISCLAIMER,
 freeCalculatorInputIds: config.freeInputs.map((input) => input.key),
 freeResultIds: ["risk_signal"],
 premiumCtaLabel: config.premiumCtaLabel,
 premiumTeaserTitle: config.premiumTeaserTitle,
 premiumTeaserText: config.premiumTeaserText,
 };
}

const currency = (key: string, label: string, unit = "USD"): RevenueToolInput => ({
 key,
 label,
 type: "currency",
 unit,
 required: true,
});

const numberInput = (
 key: string,
 label: string,
 unit?: string,
 defaultValue?: number
): RevenueToolInput => ({
 key,
 label,
 type: "number",
 unit,
 required: true,
 defaultValue,
});

const percentInput = (
 key: string,
 label: string,
 defaultValue?: number
): RevenueToolInput => ({
 key,
 label,
 type: "percent",
 unit: "%",
 required: true,
 defaultValue,
});

const yesNoSelect = (key: string, label: string, defaultValue = "no"): RevenueToolInput => ({
 key,
 label,
 type: "select",
 required: true,
 defaultValue,
 options: [
 { value: "yes", label: "Yes" },
 { value: "no", label: "No" },
 ],
});

const shippingSelect = (key: string, label: string): RevenueToolInput => ({
  key,
  label,
  type: "select",
  required: true,
  defaultValue: "road",
  options: [
    { value: "road", label: "Road freight" },
    { value: "air", label: "Air freight" },
  ],
});

export const additionalRevenueTools: AdditionalRevenueTool[] = [
 buildTool({
 sector: "welding-fabrication",
 freeSlug: "welding-cost-estimator",
 paidSlug: "welding-bid-risk-analyzer",
 freeTitle: "Welding Cost Estimator",
 paidTitle: "Welding Bid Risk Analyzer",
 painStatement:
 "Fit-up time and rework risk can turn a busy fab shop quote into a margin loss.",
 freeValue: "Estimate visible welding labor and material exposure.",
 paidValue: "Find the minimum safe bid with rework and fit-up risk included.",
 freeInputs: [
 currency("materialCost", "Material cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 numberInput("fitUpHours", "Fit-up hours", "hr"),
 ],
 paidInputs: [
 currency("materialCost", "Material cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 currency("gasConsumableCost", "Gas and consumable cost"),
 numberInput("fitUpHours", "Fit-up hours", "hr"),
 percentInput("reworkRiskPercent", "Rework risk", 10),
 percentInput("targetMargin", "Target margin", 25),
 ],
 freeResultPromise: "Shows visible labor and fit-up exposure before rework risk is modeled.",
 paidResultPromise: "Returns minimum safe bid, rework-adjusted cost and bid verdict.",
 verdictLabels: ["UNDERPRICED", "REPRICE REQUIRED", "SAFE BID"],
 seoKeywords: ["welding cost estimator", "welding bid risk analyzer"],
 freeMissingFactors: ["Gas and consumables", "Rework risk", "Minimum safe bid", "Bid verdict"],
 premiumCtaLabel: "Unlock Welding Bid Analyzer",
 premiumTeaserTitle: "Quoting fabrication with fit-up risk?",
 premiumTeaserText:
 "Unlock the Welding Bid Risk Analyzer for minimum safe bid and rework-adjusted margin.",
 }),
 buildTool({
 sector: "hvac",
 freeSlug: "hvac-tonnage-rule-check",
 paidSlug: "hvac-project-margin-guard",
 freeTitle: "HVAC Tonnage Rule Check",
 paidTitle: "HVAC Project Margin Guard",
 painStatement:
 "Equipment, ductwork and callback risk can compress HVAC project margin fast.",
 freeValue: "Quick tonnage-to-area check for visible sizing risk.",
 paidValue: "Find minimum project price with callback and commissioning risk included.",
 freeInputs: [
 numberInput("squareFootage", "Square footage", "sq ft"),
 numberInput("tonnage", "System tonnage", "tons"),
 numberInput("laborHours", "Estimated labor hours", "hr"),
 ],
 paidInputs: [
 currency("equipmentCost", "Equipment cost"),
 currency("ductworkCost", "Ductwork cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 currency("commissioningCost", "Commissioning cost"),
 percentInput("callbackRiskPercent", "Callback risk", 8),
 percentInput("targetMargin", "Target margin", 22),
 ],
 freeResultPromise: "Shows visible tonnage and labor exposure before full project margin is modeled.",
 paidResultPromise: "Returns minimum project price, callback risk and project verdict.",
 verdictLabels: ["MARGIN AT RISK", "RENEGOTIATE", "SAFE PROJECT"],
 seoKeywords: ["hvac tonnage check", "hvac project margin guard"],
 freeMissingFactors: ["Equipment cost", "Callback risk", "Minimum project price", "Project verdict"],
 premiumCtaLabel: "Unlock HVAC Margin Guard",
 premiumTeaserTitle: "Pricing an HVAC install?",
 premiumTeaserText:
 "Unlock the HVAC Project Margin Guard for minimum project price and callback risk.",
 }),
 buildTool({
 sector: "electrical-contracting",
 freeSlug: "electrical-labor-estimator",
 paidSlug: "panel-shop-margin-verdict",
 freeTitle: "Electrical Labor Estimator",
 paidTitle: "Panel Shop Margin Verdict",
 painStatement:
 "Material, testing time and inspection delays can underprice electrical panel work.",
 freeValue: "Estimate visible electrical labor and material exposure.",
 paidValue: "Find safe panel bid with inspection risk and testing time included.",
 freeInputs: [
 currency("materialCost", "Material cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 ],
 paidInputs: [
 currency("materialCost", "Material cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 numberInput("testingHours", "Testing hours", "hr"),
 percentInput("inspectionRiskPercent", "Inspection risk", 10),
 percentInput("targetMargin", "Target margin", 24),
 ],
 freeResultPromise: "Shows basic labor and material exposure before inspection risk is modeled.",
 paidResultPromise: "Returns safe panel bid, inspection risk and bid verdict.",
 verdictLabels: ["INSPECTION RISK", "REPRICE REQUIRED", "SAFE BID"],
 seoKeywords: ["electrical labor estimator", "panel shop margin verdict"],
 freeMissingFactors: ["Testing hours", "Inspection risk", "Safe panel bid", "Bid verdict"],
 premiumCtaLabel: "Unlock Panel Margin Verdict",
 premiumTeaserTitle: "Bidding panel or shop work?",
 premiumTeaserText:
 "Unlock the Panel Shop Margin Verdict for safe bid price and inspection risk.",
 }),
 buildTool({
 sector: "landscaping-lawn-care",
 freeSlug: "lawn-care-cost-check",
 paidSlug: "landscaping-contract-profit-tool",
 freeTitle: "Lawn Care Cost Check",
 paidTitle: "Landscaping Contract Profit Tool",
 painStatement:
 "Fuel, crew hours and equipment wear can underprice monthly lawn contracts.",
 freeValue: "Check visible crew and visit cost exposure.",
 paidValue: "Find minimum monthly contract price with fuel and equipment wear included.",
 freeInputs: [
 numberInput("crewHoursPerVisit", "Crew hours per visit", "hr"),
 numberInput("visitsPerMonth", "Visits per month"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 ],
 paidInputs: [
 numberInput("crewHoursPerVisit", "Crew hours per visit", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 currency("fuelCostPerVisit", "Fuel cost per visit"),
 currency("supplyCostPerMonth", "Supply cost per month"),
 numberInput("visitsPerMonth", "Visits per month"),
 currency("equipmentWearCost", "Equipment wear cost", "USD/month"),
 percentInput("targetMargin", "Target margin", 20),
 ],
 freeResultPromise: "Shows visible visit load before fuel and equipment wear are modeled.",
 paidResultPromise: "Returns minimum monthly price and contract profit verdict.",
 verdictLabels: ["UNDERPRICED MONTHLY", "LOW MARGIN", "SAFE CONTRACT"],
 seoKeywords: ["lawn care cost check", "landscaping contract profit tool"],
 freeMissingFactors: ["Fuel cost", "Equipment wear", "Minimum monthly price", "Contract verdict"],
 premiumCtaLabel: "Unlock Contract Profit Tool",
 premiumTeaserTitle: "Pricing a recurring lawn route?",
 premiumTeaserText:
 "Unlock the Landscaping Contract Profit Tool for minimum monthly price and margin verdict.",
 }),
 buildTool({
 sector: "auto-repair-shop",
 freeSlug: "repair-time-vs-price-check",
 paidSlug: "auto-shop-margin-leak-detector",
 freeTitle: "Repair Time vs Price Check",
 paidTitle: "Auto Shop Margin Leak Detector",
 painStatement:
 "Diagnostic time and comeback risk can leak profit on quoted repair jobs.",
 freeValue: "Compare quoted price to visible labor and parts exposure.",
 paidValue: "Calculate true job profit with diagnostic time and comeback risk included.",
 freeInputs: [
 currency("quotedPrice", "Quoted price"),
 numberInput("repairHours", "Repair hours", "hr"),
 currency("partsCost", "Parts cost"),
 ],
 paidInputs: [
 currency("quotedPrice", "Quoted price"),
 numberInput("diagnosticHours", "Diagnostic hours", "hr"),
 numberInput("repairHours", "Repair hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 currency("partsCost", "Parts cost"),
 percentInput("comebackRiskPercent", "Comeback risk", 12),
 percentInput("partsMarkupPercent", "Parts markup", 30),
 ],
 freeResultPromise: "Shows visible labor and parts pressure before comeback risk is modeled.",
 paidResultPromise: "Returns true job profit, margin leak and profitability verdict.",
 verdictLabels: ["LEAKING PROFIT", "LOW MARGIN", "PROFITABLE"],
 seoKeywords: ["auto repair price check", "auto shop margin leak detector"],
 freeMissingFactors: ["Diagnostic hours", "Comeback risk", "True job profit", "Profit verdict"],
 premiumCtaLabel: "Unlock Margin Leak Detector",
 premiumTeaserTitle: "Is this repair quote actually profitable?",
 premiumTeaserText:
 "Unlock the Auto Shop Margin Leak Detector for true job profit and comeback risk.",
 }),
 buildTool({
 sector: "printing-signage",
 freeSlug: "print-job-cost-check",
 paidSlug: "signage-bid-safe-price-tool",
 freeTitle: "Print Job Cost Check",
 paidTitle: "Signage Bid Safe Price Tool",
 painStatement:
 "Design time, install labor and reprint risk can erase signage job margin.",
 freeValue: "Estimate visible print material and design time exposure.",
 paidValue: "Find minimum safe price with install labor and reprint risk included.",
 freeInputs: [
 currency("materialCost", "Material cost"),
 numberInput("designHours", "Design hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 ],
 paidInputs: [
 currency("materialCost", "Material cost"),
 currency("inkCost", "Ink cost"),
 numberInput("designHours", "Design hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 numberInput("installHours", "Install hours", "hr"),
 percentInput("reprintRiskPercent", "Reprint risk", 8),
 percentInput("targetMargin", "Target margin", 28),
 ],
 freeResultPromise: "Shows visible design and material exposure before reprint risk is modeled.",
 paidResultPromise: "Returns minimum safe price, reprint risk and bid verdict.",
 verdictLabels: ["REPRINT RISK", "REPRICE REQUIRED", "SAFE PRICE"],
 seoKeywords: ["print job cost check", "signage bid safe price tool"],
 freeMissingFactors: ["Ink cost", "Install hours", "Reprint risk", "Minimum safe price"],
 premiumCtaLabel: "Unlock Safe Price Tool",
 premiumTeaserTitle: "Quoting signage with design time?",
 premiumTeaserText:
 "Unlock the Signage Bid Safe Price Tool for minimum safe price and reprint risk.",
 }),
 buildTool({
 sector: "plumbing",
 freeSlug: "plumbing-fixture-cost-check",
 paidSlug: "plumbing-job-margin-verdict",
 freeTitle: "Plumbing Fixture Cost Check",
 paidTitle: "Plumbing Job Margin Verdict",
 painStatement:
 "Parts runs, callbacks and fixture complexity can underprice plumbing jobs.",
 freeValue: "Check visible parts and labor exposure for fixture jobs.",
 paidValue: "Find safe job price with callback risk and material runs included.",
 freeInputs: [
 numberInput("fixtureCount", "Fixture count"),
 currency("unitMaterialCost", "Unit material cost"),
 numberInput("laborHoursPerFixture", "Labor hours per fixture", "hr"),
 currency("laborRate", "Labor rate", "USD/hr"),
 percentInput("overheadPct", "Overhead", 15),
 ],
 paidInputs: [
 currency("partsCost", "Parts cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 numberInput("fixtureCount", "Fixture count"),
 currency("materialRunCost", "Material run cost"),
 percentInput("callbackRiskPercent", "Callback risk", 10),
 percentInput("targetMargin", "Target margin", 25),
 ],
 freeResultPromise: "Shows visible parts and labor exposure before callback risk is modeled.",
 paidResultPromise: "Returns safe job price, callback risk and job verdict.",
 verdictLabels: ["CALLBACK RISK", "REPRICE REQUIRED", "SAFE JOB"],
 seoKeywords: ["plumbing fixture cost check", "plumbing job margin verdict"],
 freeMissingFactors: ["Material runs", "Callback risk", "Safe job price", "Job verdict"],
 premiumCtaLabel: "Unlock Job Margin Verdict",
 premiumTeaserTitle: "Pricing a multi-fixture plumbing job?",
 premiumTeaserText:
 "Unlock the Plumbing Job Margin Verdict for safe job price and callback risk.",
 }),
 buildTool({
 sector: "carpentry-millwork",
 freeSlug: "cabinet-cost-estimator",
 paidSlug: "millwork-bid-risk-analyzer",
 freeTitle: "Cabinet Cost Estimator",
 paidTitle: "Millwork Bid Risk Analyzer",
 painStatement:
 "Waste, finishing and install time can underprice custom millwork bids.",
 freeValue: "Estimate visible sheet material and labor exposure.",
 paidValue: "Find minimum millwork bid with waste, finishing and install included.",
 freeInputs: [
 currency("sheetMaterialCost", "Sheet material cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("installHours", "Install hours", "hr"),
 ],
 paidInputs: [
 currency("sheetMaterialCost", "Sheet material cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 currency("finishingCost", "Finishing cost"),
 numberInput("installHours", "Install hours", "hr"),
 percentInput("wasteRatePercent", "Waste rate", 12),
 percentInput("targetMargin", "Target margin", 26),
 ],
 freeResultPromise: "Shows visible material and labor exposure before waste is modeled.",
 paidResultPromise: "Returns minimum millwork bid, waste risk and bid verdict.",
 verdictLabels: ["REWORK RISK", "REPRICE REQUIRED", "SAFE BID"],
 seoKeywords: ["cabinet cost estimator", "millwork bid risk analyzer"],
 freeMissingFactors: ["Finishing cost", "Waste rate", "Minimum millwork bid", "Bid verdict"],
 premiumCtaLabel: "Unlock Millwork Bid Analyzer",
 premiumTeaserTitle: "Bidding custom cabinets or millwork?",
 premiumTeaserText:
 "Unlock the Millwork Bid Risk Analyzer for minimum bid and waste-adjusted margin.",
 }),
 buildTool({
 sector: "roofing",
 freeSlug: "roofing-square-cost-check",
 paidSlug: "roofing-contract-margin-guard",
 freeTitle: "Roofing Square Cost Check",
 paidTitle: "Roofing Contract Margin Guard",
 painStatement:
 "Tear-off, dump fees and weather delays can turn roofing bids into warranty risk.",
 freeValue: "Check visible material and labor exposure per roofing job.",
 paidValue: "Find minimum roofing bid with tear-off, dump and weather delay risk included.",
 freeInputs: [
 currency("materialCost", "Material cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 ],
 paidInputs: [
 currency("materialCost", "Material cost"),
 numberInput("laborHours", "Labor hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 currency("tearOffCost", "Tear-off cost"),
 currency("dumpFees", "Dump fees"),
 percentInput("weatherDelayRiskPercent", "Weather delay risk", 10),
 percentInput("targetMargin", "Target margin", 22),
 ],
 freeResultPromise: "Shows visible material and labor exposure before tear-off and delay risk.",
 paidResultPromise: "Returns minimum roofing bid, warranty risk and contract verdict.",
 verdictLabels: ["WARRANTY RISK", "LOW MARGIN", "SAFE BID"],
 seoKeywords: ["roofing square cost check", "roofing contract margin guard"],
 freeMissingFactors: ["Tear-off cost", "Weather delay risk", "Minimum roofing bid", "Contract verdict"],
 premiumCtaLabel: "Unlock Roofing Margin Guard",
 premiumTeaserTitle: "Quoting a tear-off roofing job?",
 premiumTeaserText:
 "Unlock the Roofing Contract Margin Guard for minimum bid and delay risk.",
 }),
 buildTool({
 sector: "painting",
 freeSlug: "paint-coverage-cost-check",
 paidSlug: "painting-job-profit-verdict",
 freeTitle: "Paint Coverage Cost Check",
 paidTitle: "Painting Job Profit Verdict",
 painStatement:
 "Prep time, scaffold cost and touch-ups can underprice painting jobs.",
 freeValue: "Check visible paint and prep time exposure.",
 paidValue: "Find minimum painting price with scaffold and touch-up risk included.",
 freeInputs: [
 numberInput("paintableArea", "Paintable area", "m²"),
 numberInput("coveragePerUnit", "Coverage per unit", "m²/unit"),
 numberInput("coats", "Coats"),
 currency("unitPrice", "Unit price"),
 percentInput("wasteAllowancePct", "Waste allowance", 10),
 ],
 paidInputs: [
 currency("paintCost", "Paint cost"),
 numberInput("prepHours", "Prep hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 currency("scaffoldCost", "Scaffold cost"),
 percentInput("touchUpRiskPercent", "Touch-up risk", 8),
 numberInput("areaSize", "Area size", "sq ft"),
 percentInput("targetMargin", "Target margin", 24),
 ],
 freeResultPromise: "Shows visible prep and paint exposure before touch-up risk is modeled.",
 paidResultPromise: "Returns minimum painting price, prep cost risk and job verdict.",
 verdictLabels: ["PREP COST RISK", "REPRICE REQUIRED", "SAFE PRICE"],
 seoKeywords: ["paint coverage cost check", "painting job profit verdict"],
 freeMissingFactors: ["Scaffold cost", "Touch-up risk", "Minimum painting price", "Job verdict"],
 premiumCtaLabel: "Unlock Job Profit Verdict",
 premiumTeaserTitle: "Quoting interior or exterior painting?",
 premiumTeaserText:
 "Unlock the Painting Job Profit Verdict for minimum price and prep cost risk.",
 }),
 buildTool({
 sector: "sheet-metal",
 freeSlug: "laser-cutting-time-check",
 paidSlug: "sheet-metal-quote-risk-tool",
 freeTitle: "Laser Cutting Time Check",
 paidTitle: "Sheet Metal Quote Risk Tool",
 painStatement:
 "Programming, setup and scrap can destroy margin on sheet metal quotes.",
 freeValue: "Estimate visible cutting and setup time exposure.",
 paidValue: "Find safe sheet metal quote with scrap and finishing included.",
 freeInputs: [
 numberInput("setupTime", "Setup time", "min"),
 numberInput("cutTime", "Cut time", "min"),
 numberInput("quantity", "Quantity", undefined, 1),
 ],
 paidInputs: [
 numberInput("programmingTime", "Programming time", "min"),
 numberInput("setupTime", "Setup time", "min"),
 numberInput("cutTime", "Cut time", "min"),
 numberInput("bendCount", "Bend count"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 currency("materialCost", "Material cost"),
 percentInput("scrapRatePercent", "Scrap rate", 8),
 currency("finishingCost", "Finishing cost"),
 percentInput("targetMargin", "Target margin", 25),
 ],
 freeResultPromise: "Shows visible setup and cut time before scrap and programming are modeled.",
 paidResultPromise: "Returns safe sheet metal quote, scrap risk and quote verdict.",
 verdictLabels: ["SCRAP RISK", "REPRICE REQUIRED", "SAFE QUOTE"],
 seoKeywords: ["laser cutting time check", "sheet metal quote risk tool"],
 freeMissingFactors: ["Programming time", "Scrap rate", "Safe sheet metal quote", "Quote verdict"],
 premiumCtaLabel: "Unlock Quote Risk Tool",
 premiumTeaserTitle: "Quoting laser-cut sheet metal?",
 premiumTeaserText:
 "Unlock the Sheet Metal Quote Risk Tool for safe quote and scrap-adjusted margin.",
 }),
 buildTool({
 sector: "3d-printing-service",
 freeSlug: "3d-print-cost-check",
 paidSlug: "3d-print-job-margin-tool",
 freeTitle: "3D Print Cost Check",
 paidTitle: "3D Print Job Margin Tool",
 painStatement:
 "Print failures and post-processing can erase profit on custom 3D print jobs.",
 freeValue: "Check visible material and print time exposure.",
 paidValue: "Find minimum print price with fail rate and post-processing included.",
 freeInputs: [
 currency("materialCost", "Material cost"),
 numberInput("printHours", "Print hours", "hr"),
 numberInput("machineRate", "Machine rate", "USD/hr"),
 ],
 paidInputs: [
 currency("materialCost", "Material cost"),
 numberInput("printHours", "Print hours", "hr"),
 numberInput("machineRate", "Machine rate", "USD/hr"),
 numberInput("postProcessHours", "Post-process hours", "hr"),
 numberInput("laborRate", "Labor rate", "USD/hr"),
 percentInput("failRatePercent", "Fail rate", 10),
 percentInput("targetMargin", "Target margin", 30),
 ],
 freeResultPromise: "Shows visible material and machine time before fail rate is modeled.",
 paidResultPromise: "Returns minimum print price, fail rate risk and job verdict.",
 verdictLabels: ["FAIL RATE RISK", "REPRICE REQUIRED", "SAFE PRINT"],
 seoKeywords: ["3d print cost check", "3d print job margin tool"],
 freeMissingFactors: ["Post-processing", "Fail rate", "Minimum print price", "Job verdict"],
 premiumCtaLabel: "Unlock Print Margin Tool",
 premiumTeaserTitle: "Quoting a custom 3D print job?",
 premiumTeaserText:
 "Unlock the 3D Print Job Margin Tool for minimum price and fail-rate protection.",
 }),
 buildTool({
 sector: "logistics-transport",
 freeSlug: "desi-calculator",
 paidSlug: "route-optimization-analyzer",
 freeTitle: "Desi & Volumetric Weight Calculator",
 paidTitle: "Route & Freight Loss Analyzer",
 painStatement:
 "Desi miscalculations and empty return miles can quietly erase freight margin.",
 freeValue: "Calculate volumetric (desi) weight and visible freight volume risk.",
 paidValue:
 "Model deadhead, tolls, driver rest risk and minimum safe freight price.",
freeInputs: [
    numberInput("length", "Length", "cm"),
    numberInput("width", "Width", "cm"),
    numberInput("height", "Height", "cm"),
    numberInput("quantity", "Package count", undefined, 1),
    shippingSelect("freightMode", "Freight mode"),
    ],
 paidInputs: [
 numberInput("distanceKm", "Distance", "km"),
 numberInput("fuelPricePerKm", "Fuel cost per km", "USD/km"),
 numberInput("driverHourlyRate", "Driver hourly rate", "USD/hr"),
 numberInput("estimatedHours", "Estimated drive hours", "hr"),
 yesNoSelect("returnEmpty", "Empty return (deadhead)", "no"),
 yesNoSelect("hasTolls", "Toll roads on route", "no"),
 yesNoSelect("overweightRisk", "Overweight / fine risk", "no"),
 percentInput("targetMargin", "Target margin", 18),
 ],
 freeResultPromise:
 "Shows total desi and warns when volumetric weight may inflate freight cost.",
 paidResultPromise:
 "Returns true route cost, hidden leak drivers and accept/reprice verdict.",
 verdictLabels: [
 "HIGH RISK - LEAKING PROFIT",
 "MODERATE RISK - MARGIN PRESSURE",
 "ACCEPT SAFELY",
 ],
 seoKeywords: [
 "desi calculator",
 "volumetric weight calculator",
 "route freight analyzer",
 "deadhead cost calculator",
 ],
 freeMissingFactors: [
 "Deadhead (empty return) cost",
 "Toll and road fee buffer",
 "Driver rest / delay penalty",
 "Minimum safe freight price",
 ],
 premiumCtaLabel: "Unlock Route Analyzer",
 premiumTeaserTitle: "Quoting a lane with empty return?",
 premiumTeaserText:
 "Unlock the Route & Freight Loss Analyzer for deadhead, toll and rest-risk verdict.",
 }),
];
