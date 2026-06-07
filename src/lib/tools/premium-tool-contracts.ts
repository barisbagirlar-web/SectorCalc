/**
 * SectorCalc Premium Tool Contract v1 — all 27 premium analyzer contracts.
 */

import type {
 PremiumHiddenVariable,
 PremiumInputKind,
 PremiumInputSpec,
 PremiumToleranceRule,
 PremiumToolContract,
} from "@/lib/tools/premium-tool-contract";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

function mapKind(type: string): PremiumInputKind {
 if (type === "currency" || type === "percent" || type === "select" || type === "number") {
 return type;
 }
 return "number";
}

function fromRevenuePaidInputs(slug: string): readonly PremiumInputSpec[] {
 const tool = getRevenueToolByPaidSlug(slug);
 if (!tool) return [];
 return tool.paidInputs.map((input) => ({
 key: input.key,
 label: input.label,
 kind: mapKind(input.type),
 unit: input.unit,
 required: input.required,
 defaultValue: input.defaultValue,
 helperText: input.helperText,
 options: input.options,
 }));
}

function hidden(
 id: string,
 label: string,
 description: string,
 defaultMultiplier: number
): PremiumHiddenVariable {
 return { id, label, description, defaultMultiplier };
}

function tolerance(
 id: string,
 label: string,
 description: string,
 costMultiplier: number,
 triggerDescription: string
): PremiumToleranceRule {
 return { id, label, description, costMultiplier, triggerDescription };
}

const REPORT_SECTIONS_STANDARD = [
 "Visible cost summary",
 "Hidden cost drivers",
 "Buffered cost floor",
 "Sensitivity check",
 "Recommended action",
] as const;

function contract(
 config: Omit<PremiumToolContract, "inputs"> & {
 inputs?: readonly PremiumInputSpec[];
 }
): PremiumToolContract {
 return {
 ...config,
 inputs: config.inputs ?? fromRevenuePaidInputs(config.slug),
 };
}

// ---------------------------------------------------------------------------
// Contracts (27)
// ---------------------------------------------------------------------------

export const PREMIUM_TOOL_CONTRACTS: readonly PremiumToolContract[] = [
 contract({
 slug: "cnc-quote-risk-analyzer",
 sectorSlug: "cnc-manufacturing",
 title: "CNC Audit Engine",
 promise: "Find the minimum safe price and quote verdict before accepting the job.",
 hiddenVariables: [
 hidden("setup-burden", "Setup burden", "One-off setup time that does not scale with quantity.", 1.08),
 hidden("tool-wear", "Tool wear reserve", "Insert changes and breakage on tight-tolerance runs.", 1.05),
 hidden("scrap-buffer", "Scrap & rework buffer", "Typical shop-floor scrap and first-article rework.", 1.06),
 ],
 toleranceRules: [
 tolerance(
 "tight-tolerance",
 "Tight tolerance",
 "Sub-25 µm tolerance increases cycle time and inspection load.",
 1.15,
 "Applies when tolerance is tighter than standard job-shop bands."
 ),
 ],
 targetMarginDefault: 0.15,
 volatilityDefault: 0.12,
 primaryMetricLabel: "Minimum safe price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "change-order-impact-analyzer",
 sectorSlug: "construction",
 title: "Change Order Impact Analyzer",
 promise: "Measure delay, crew cost and margin impact before accepting the change.",
 hiddenVariables: [
 hidden("site-overhead", "Site overhead", "Superintendent and trailer cost during delay days.", 1.06),
 hidden("productivity-slip", "Crew productivity slip", "Weather and change-order disruption to crew output.", 1.08),
 hidden("permit-revision", "Permit / revision fees", "Drawing revisions and inspection re-visits.", 1.04),
 ],
 toleranceRules: [
 tolerance(
 "winter-delay",
 "Winter / weather delay",
 "Cold-weather pours and seasonal productivity loss.",
 1.12,
 "Triggered when delay days exceed a typical weekly slip."
 ),
 ],
 targetMarginDefault: 0.18,
 volatilityDefault: 0.14,
 primaryMetricLabel: "Minimum safe change price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "office-cleaning-bid-optimizer",
 sectorSlug: "cleaning",
 title: "Office Cleaning Bid Optimizer",
 promise: "Find the minimum monthly bid with labor, supplies, frequency and target margin.",
 hiddenVariables: [
 hidden("travel-between-sites", "Travel between sites", "Drive time and fuel between client locations.", 1.07),
 hidden("supervision-ga", "Supervision & G&A", "Scheduling, QA walks and back-office overhead.", 1.15),
 hidden("supply-inflation", "Supply cost drift", "Chemical and consumable price movement.", 1.04),
 ],
 toleranceRules: [
 tolerance(
 "high-frequency",
 "High visit frequency",
 "Extra turnover and restocking on dense visit schedules.",
 1.05,
 "Applies when visits per month exceed typical office contracts."
 ),
 ],
 targetMarginDefault: 0.2,
 volatilityDefault: 0.1,
 primaryMetricLabel: "Minimum monthly bid",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "menu-profit-leak-detector",
 sectorSlug: "restaurant",
 title: "Menu Profit Leak Detector",
 promise: "Detect real margin after waste, delivery fees and labor cost.",
 hiddenVariables: [
 hidden("portion-variance", "Portion variance", "Line cooks overserving vs recipe spec.", 1.1),
 hidden("supplier-swing", "Supplier price swing", "Weekly ingredient cost movement.", 1.05),
 hidden("rush-labor", "Rush-hour labor premium", "Peak-shift labor loading per item.", 1.15),
 ],
 toleranceRules: [
 tolerance(
 "delivery-mix",
 "Delivery commission mix",
 "Third-party delivery fees eroding menu margin.",
 1.08,
 "Triggered when delivery commission exceeds typical dine-in mix."
 ),
 ],
 targetMarginDefault: 0.28,
 volatilityDefault: 0.11,
 primaryMetricLabel: "Minimum safe menu price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "return-profit-erosion-tool",
 sectorSlug: "ecommerce",
 title: "Return Profit Erosion Tool",
 promise: "Measure net profit after returns, shipping, payment fees and ad cost.",
 hiddenVariables: [
 hidden("reverse-logistics", "Reverse logistics", "Return shipping and restocking labor.", 1.08),
 hidden("cac-recovery", "Ad spend recovery loss", "Paid acquisition cost lost on returned orders.", 1.06),
 hidden("fraud-reserve", "Fraud & chargeback reserve", "Payment disputes and friendly fraud.", 1.02),
 ],
 toleranceRules: [
 tolerance(
 "high-return-rate",
 "High return rate",
 "Seasonal return spikes and SKU-specific return curves.",
 1.12,
 "Applies when return rate exceeds category norms."
 ),
 ],
 targetMarginDefault: 0.25,
 volatilityDefault: 0.13,
 primaryMetricLabel: "Minimum viable selling price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "welding-bid-risk-analyzer",
 sectorSlug: "welding-fabrication",
 title: "Welding Bid Risk Analyzer",
 promise: "Find the minimum safe bid with rework and fit-up risk included.",
 hiddenVariables: [
 hidden("position-factor", "Overhead position factor", "Out-of-position welding time multiplier.", 1.15),
 hidden("preheat", "Thick-material preheat", "Preheating and inter-pass temperature control.", 1.08),
 hidden("inspection", "NDT / inspection buffer", "X-ray or dye-pen inspection on critical joints.", 1.06),
 ],
 toleranceRules: [
 tolerance(
 "rework-risk",
 "Rework probability",
 "Fit-up gaps and weld defect rework allowance.",
 1.1,
 "Scaled by entered rework risk percent."
 ),
 ],
 targetMarginDefault: 0.25,
 volatilityDefault: 0.13,
 primaryMetricLabel: "Minimum safe bid",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "hvac-project-margin-guard",
 sectorSlug: "hvac",
 title: "HVAC Project Margin Guard",
 promise: "Find minimum project price with callback and commissioning risk included.",
 hiddenVariables: [
 hidden("refrigerant-leak", "Refrigerant leak reserve", "Leak search and recharge on start-up.", 1.03),
 hidden("duct-complexity", "Duct complexity", "Spiral vs rectangular and long-run duct labor.", 1.12),
 hidden("permit-delay", "Permit delay reserve", "Municipal permit and inspection scheduling slip.", 1.04),
 ],
 toleranceRules: [
 tolerance(
 "callback-risk",
 "Callback risk",
 "Warranty callbacks and start-up failures.",
 1.1,
 "Scaled by entered callback risk percent."
 ),
 ],
 targetMarginDefault: 0.22,
 volatilityDefault: 0.12,
 primaryMetricLabel: "Minimum project price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "panel-shop-margin-verdict",
 sectorSlug: "electrical-contracting",
 title: "Panel Shop Margin Verdict",
 promise: "Find safe panel bid with inspection risk and testing time included.",
 hiddenVariables: [
 hidden("permit-revision", "Permit revision", "AHJ comments and resubmittal labor.", 1.04),
 hidden("testing-burden", "Testing & commissioning", "Megger, torque logs and functional tests.", 1.08),
 hidden("inspection-rework", "Inspection rework", "Punch-list corrections after inspection.", 1.06),
 ],
 toleranceRules: [
 tolerance(
 "inspection-risk",
 "Inspection failure risk",
 "Failed inspection and rework multiplier.",
 1.1,
 "Scaled by entered inspection risk percent."
 ),
 ],
 targetMarginDefault: 0.24,
 volatilityDefault: 0.11,
 primaryMetricLabel: "Safe panel bid",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "landscaping-contract-profit-tool",
 sectorSlug: "landscaping-lawn-care",
 title: "Landscaping Contract Profit Tool",
 promise: "Find minimum monthly contract price with fuel and equipment wear included.",
 hiddenVariables: [
 hidden("equip-depreciation", "Equipment depreciation", "Mower and trimmer wear per crew-hour.", 1.08),
 hidden("route-deadhead", "Route deadhead", "Unbilled drive time between properties.", 1.07),
 hidden("seasonal-surge", "Seasonal labor surge", "Peak-season wage and overtime pressure.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "high-visit-load",
 "High visit load",
 "Dense routes with elevated fuel and wear.",
 1.06,
 "Applies when monthly crew-hours exceed maintenance norms."
 ),
 ],
 targetMarginDefault: 0.2,
 volatilityDefault: 0.1,
 primaryMetricLabel: "Minimum monthly price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "auto-shop-margin-leak-detector",
 sectorSlug: "auto-repair-shop",
 title: "Auto Shop Margin Leak Detector",
 promise: "Calculate true job profit with diagnostic time and comeback risk included.",
 hiddenVariables: [
 hidden("shop-supplies", "Shop supplies & fluids", "Rags, solvents and minor consumables per job.", 1.05),
 hidden("warranty-delay", "Warranty reimbursement delay", "Cash-flow drag on warranty parts claims.", 1.05),
 hidden("no-show", "Appointment no-show loss", "Bay time lost to missed appointments.", 1.03),
 ],
 toleranceRules: [
 tolerance(
 "comeback-risk",
 "Comeback / warranty risk",
 "Repeat visits on the same repair order.",
 1.12,
 "Scaled by entered comeback risk percent."
 ),
 ],
 targetMarginDefault: 0.2,
 volatilityDefault: 0.12,
 primaryMetricLabel: "Minimum safe quoted price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "signage-bid-safe-price-tool",
 sectorSlug: "printing-signage",
 title: "Signage Bid Safe Price Tool",
 promise: "Find minimum safe price with install labor and reprint risk included.",
 hiddenVariables: [
 hidden("rip-proofing", "RIP & proofing", "Color proof cycles and file prep.", 1.04),
 hidden("install-access", "Install access difficulty", "Lift rental and night-install premiums.", 1.08),
 hidden("ink-coverage", "Ink coverage variance", "Heavy ink loads and media waste.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "reprint-risk",
 "Reprint risk",
 "Color-match rework and media scrapped on wide-format jobs.",
 1.08,
 "Scaled by entered reprint risk percent."
 ),
 ],
 targetMarginDefault: 0.28,
 volatilityDefault: 0.11,
 primaryMetricLabel: "Minimum safe price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "plumbing-job-margin-verdict",
 sectorSlug: "plumbing",
 title: "Plumbing Job Margin Verdict",
 promise: "Find safe job price with callback risk and material runs included.",
 hiddenVariables: [
 hidden("access-difficulty", "Access difficulty", "Crawl-space and tight-access labor multiplier.", 1.15),
 hidden("water-damage", "Water damage liability", "Leak containment and dry-out reserve.", 1.05),
 hidden("permit-inspection", "Permit & inspection", "Permit fees and inspection revisits.", 1.1),
 ],
 toleranceRules: [
 tolerance(
 "callback-risk",
 "Callback risk",
 "Warranty return trips and leak callbacks.",
 1.1,
 "Scaled by entered callback risk percent."
 ),
 ],
 targetMarginDefault: 0.25,
 volatilityDefault: 0.12,
 primaryMetricLabel: "Safe job price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "millwork-bid-risk-analyzer",
 sectorSlug: "carpentry-millwork",
 title: "Millwork Bid Risk Analyzer",
 promise: "Find minimum millwork bid with waste, finishing and install included.",
 hiddenVariables: [
 hidden("wwpa-waste", "WWPA lumber waste", "Sheet goods waste beyond nominal yield.", 1.12),
 hidden("finishing-delay", "Finishing schedule delay", "Humidity and coat-dry slip on site.", 1.1),
 hidden("field-measure", "Field measure & remakes", "Site measure errors and remade parts.", 1.06),
 ],
 toleranceRules: [
 tolerance(
 "waste-rate",
 "Waste rate",
 "Custom profiles and grain matching waste.",
 1.08,
 "Scaled by entered waste rate percent."
 ),
 ],
 targetMarginDefault: 0.26,
 volatilityDefault: 0.13,
 primaryMetricLabel: "Minimum millwork bid",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "roofing-contract-margin-guard",
 sectorSlug: "roofing",
 title: "Roofing Contract Margin Guard",
 promise: "Find minimum roofing bid with tear-off, dump and weather delay risk included.",
 hiddenVariables: [
 hidden("underlayment", "Underlayment upgrade", "Synthetic underlayment beyond base spec.", 1.06),
 hidden("ventilation", "Ventilation allowance", "Ridge and soffit ventilation adders.", 1.03),
 hidden("warranty-reserve", "Warranty reserve", "Transferable workmanship warranty exposure.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "weather-delay",
 "Weather delay risk",
 "Rain days and crew standby on tear-off jobs.",
 1.1,
 "Scaled by entered weather delay risk percent."
 ),
 ],
 targetMarginDefault: 0.22,
 volatilityDefault: 0.14,
 primaryMetricLabel: "Minimum roofing bid",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "painting-job-profit-verdict",
 sectorSlug: "painting",
 title: "Painting Job Profit Verdict",
 promise: "Find minimum painting price with scaffold and touch-up risk included.",
 hiddenVariables: [
 hidden("caulk-mask", "Caulk & mask reserve", "Punch-list prep absent from paint-only bids.", 1.06),
 hidden("scaffold-rotation", "Scaffold rotation", "Extra scaffold moves on multi-story work.", 1.08),
 hidden("touch-up", "Touch-up labor", "Owner walk-through and punch-list hours.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "touch-up-risk",
 "Touch-up risk",
 "Color match and punch-list rework.",
 1.08,
 "Scaled by entered touch-up risk percent."
 ),
 ],
 targetMarginDefault: 0.24,
 volatilityDefault: 0.11,
 primaryMetricLabel: "Minimum painting price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "sheet-metal-quote-risk-tool",
 sectorSlug: "sheet-metal",
 title: "Sheet Metal Quote Risk Tool",
 promise: "Find safe sheet metal quote with scrap and finishing included.",
 hiddenVariables: [
 hidden("nest-scrap", "Nest scrap", "Sheet nesting inefficiency on low-volume runs.", 1.1),
 hidden("programming", "Offline programming", "CAD/CAM programming not in cut time.", 1.05),
 hidden("deburr-finish", "Deburr & finish", "Edge break and cosmetic finish labor.", 1.06),
 ],
 toleranceRules: [
 tolerance(
 "scrap-rate",
 "Scrap rate",
 "Laser nest scrap and skeleton loss.",
 1.08,
 "Scaled by entered scrap rate percent."
 ),
 ],
 targetMarginDefault: 0.25,
 volatilityDefault: 0.12,
 primaryMetricLabel: "Safe sheet metal quote",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "3d-print-job-margin-tool",
 sectorSlug: "3d-printing-service",
 title: "3D Print Job Margin Tool",
 promise: "Find minimum print price with fail rate and post-processing included.",
 hiddenVariables: [
 hidden("support-removal", "Support removal", "Support material removal and sanding.", 1.15),
 hidden("fail-reprint", "Fail & reprint buffer", "Failed builds and partial reruns.", 1.1),
 hidden("machine-utilization", "Machine utilization gap", "Printer idle between jobs on short runs.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "fail-rate",
 "Fail rate",
 "Long prints with higher failure probability.",
 1.1,
 "Scaled by entered fail rate percent."
 ),
 ],
 targetMarginDefault: 0.3,
 volatilityDefault: 0.14,
 primaryMetricLabel: "Minimum print price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "route-optimization-analyzer",
 sectorSlug: "logistics-transport",
 title: "Route & Freight Loss Analyzer",
 promise: "Model deadhead, tolls, driver rest risk and minimum safe freight price.",
 hiddenVariables: [
 hidden("deadhead", "Empty return (deadhead)", "Unpaid return miles and fuel.", 1.12),
 hidden("hos-penalty", "Hours-of-service penalty", "Driver rest and delay penalties.", 1.08),
 hidden("toll-buffer", "Toll & road fees", "Toll roads and weigh-station delays.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "overweight-fine",
 "Overweight / fine risk",
 "Scale fines and detention on heavy freight.",
 1.15,
 "Triggered when overweight / fine risk is flagged."
 ),
 ],
 targetMarginDefault: 0.18,
 volatilityDefault: 0.13,
 primaryMetricLabel: "Minimum safe freight price",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "crop-yield-loss-analyzer",
 sectorSlug: "agriculture-crops",
 title: "Crop Yield Loss Analyzer",
 promise: "Model moisture, weather and input cost leaks with yield verdict.",
 hiddenVariables: [
 hidden("moisture-penalty", "Soil moisture penalty", "Yield drag from sub-optimal soil moisture.", 1.08),
 hidden("weather-buffer", "Weather risk buffer", "Drought, frost and hail yield loss.", 1.1),
 hidden("input-inflation", "Input cost inflation", "Fertilizer and irrigation price movement.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "weather-index",
 "Weather risk index",
 "Elevated weather risk index on planting decisions.",
 1.12,
 "Triggered when weather risk index is above moderate."
 ),
 ],
 targetMarginDefault: 0.2,
 volatilityDefault: 0.15,
 primaryMetricLabel: "Minimum revenue floor",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "water-optimization-verdict",
 sectorSlug: "agriculture-irrigation",
 title: "Water Efficiency Verdict",
 promise: "Find minimum viable irrigation spend with efficiency verdict.",
 hiddenVariables: [
 hidden("evaporation", "Evaporation loss", "Open canal and sprinkler evaporation.", 1.12),
 hidden("pump-efficiency", "Pump efficiency drift", "Worn pumps and pressure loss.", 1.06),
 hidden("rights-fees", "Water rights fees", "Allocation and district fees not in kWh alone.", 1.04),
 ],
 toleranceRules: [
 tolerance(
 "overwatering",
 "Overwatering risk",
 "Excess pumping beyond crop ET requirement.",
 1.1,
 "Triggered when evaporation loss exceeds efficient bands."
 ),
 ],
 targetMarginDefault: 0.18,
 volatilityDefault: 0.11,
 primaryMetricLabel: "Minimum viable water spend",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "feed-efficiency-analyzer",
 sectorSlug: "agriculture-feed",
 title: "Feed Efficiency Analyzer",
 promise: "Model waste, water quality and feed-to-output efficiency.",
 hiddenVariables: [
 hidden("feed-waste", "Feed waste & spoilage", "Storage loss and sorting waste.", 1.08),
 hidden("water-quality", "Water quality impact", "TDS and intake quality on conversion.", 1.05),
 hidden("ration-drift", "Ration formulation drift", "Protein overshoot and mineral loading.", 1.04),
 ],
 toleranceRules: [
 tolerance(
 "waste-percent",
 "Feed waste",
 "Spoilage and sorting losses in storage.",
 1.1,
 "Scaled by entered feed waste percent."
 ),
 ],
 targetMarginDefault: 0.15,
 volatilityDefault: 0.12,
 primaryMetricLabel: "Minimum feed cost floor",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "dairy-profit-detector",
 sectorSlug: "agriculture-dairy",
 title: "Dairy Profit Detector",
 promise: "Detect dairy profit leaks with full cost stack verdict.",
 hiddenVariables: [
 hidden("somatic-cell", "Health & somatic cell drag", "Mastitis and vet events reducing yield.", 1.06),
 hidden("labor-allocation", "Labor allocation gap", "Family labor not booked at market rate.", 1.08),
 hidden("cull-replacement", "Cull & replacement reserve", "Herd turnover capital cost.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "tight-margin",
 "Tight margin band",
 "Rising feed with flat milk price squeeze.",
 1.08,
 "Applies when net margin is below target."
 ),
 ],
 targetMarginDefault: 0.12,
 volatilityDefault: 0.13,
 primaryMetricLabel: "Minimum monthly revenue",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "energy-efficiency-report",
 sectorSlug: "energy-consumption",
 title: "Energy Efficiency Report",
 promise: "Model demand charges, power factor and efficiency verdict.",
 hiddenVariables: [
 hidden("demand-charge", "Peak demand charge", "kW-based demand ratchet on utility bill.", 1.1),
 hidden("power-factor", "Power factor penalty", "Reactive power charges from motor loads.", 1.05),
 hidden("standby-load", "Standby / vampire load", "Off-shift equipment and compressed air leaks.", 1.04),
 ],
 toleranceRules: [
 tolerance(
 "pf-penalty",
 "Power factor penalty",
 "Utility surcharge when power factor sags.",
 1.08,
 "Scaled by entered power factor penalty percent."
 ),
 ],
 targetMarginDefault: 0.1,
 volatilityDefault: 0.1,
 primaryMetricLabel: "True monthly energy cost",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "cbam-compliance-verdict",
 sectorSlug: "energy-carbon",
 title: "CBAM Compliance Verdict",
 promise: "Model process emissions, transport and CBAM cost exposure.",
 hiddenVariables: [
 hidden("process-emissions", "Process emissions", "Non-energy process CO₂ beyond grid factors.", 1.12),
 hidden("transport-leg", "Transport leg", "Inbound/outbound freight emissions.", 1.06),
 hidden("eu-ets-volatility", "EU ETS price volatility", "Carbon price movement on border levy.", 1.08),
 ],
 toleranceRules: [
 tolerance(
 "cbam-exposure",
 "CBAM exposure",
 "EU import value share eroded by carbon levy.",
 1.15,
 "Triggered when CBAM cost exceeds moderate import share."
 ),
 ],
 targetMarginDefault: 0.15,
 volatilityDefault: 0.16,
 primaryMetricLabel: "Minimum export price floor",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "renovation-budget-optimizer",
 sectorSlug: "daily-renovation",
 title: "Renovation Budget Optimizer",
 promise: "Add seasonal delay, regional multiplier and realistic total.",
 hiddenVariables: [
 hidden("hidden-prep", "Hidden demolition & prep", "Asbestos, mold and structural surprises.", 1.1),
 hidden("winter-delay", "Winter work delay", "Heated enclosure and weather slip.", 1.12),
 hidden("city-premium", "City cost premium", "Metro labor and permit premiums.", 1.08),
 ],
 toleranceRules: [
 tolerance(
 "contingency",
 "Contingency reserve",
 "Owner-change and unknown-condition buffer.",
 1.1,
 "Scaled by entered contingency percent."
 ),
 ],
 targetMarginDefault: 0.1,
 volatilityDefault: 0.14,
 primaryMetricLabel: "Recommended budget",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "trip-budget-optimizer",
 sectorSlug: "daily-fuel",
 title: "Trip Budget Optimizer",
 promise: "Add tolls, return leg and buffer for realistic trip budget.",
 hiddenVariables: [
 hidden("return-leg", "Return trip fuel", "Round-trip fuel not in one-way estimates.", 1.1),
 hidden("parking-tolls", "Parking & tolls", "Urban parking and road toll surprises.", 1.06),
 hidden("price-spike", "Fuel price spike buffer", "Pump price movement during the trip.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "buffer-percent",
 "Budget buffer",
 "Unexpected stops and price movement.",
 1.08,
 "Scaled by entered budget buffer percent."
 ),
 ],
 targetMarginDefault: 0.1,
 volatilityDefault: 0.1,
 primaryMetricLabel: "Recommended trip budget",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
 contract({
 slug: "meal-planning-verdict",
 sectorSlug: "daily-meals",
 title: "Weekly Meal Planning Verdict",
 promise: "Model weekly grocery plan with waste and inflation buffer.",
 hiddenVariables: [
 hidden("food-waste", "Household food waste", "Spoilage and plate waste per week.", 1.15),
 hidden("inflation", "Grocery inflation buffer", "Shelf-price movement month to month.", 1.08),
 hidden("impulse-buy", "Impulse & premium swaps", "Unplanned premium ingredient upgrades.", 1.05),
 ],
 toleranceRules: [
 tolerance(
 "waste-percent",
 "Food waste allowance",
 "Weekly spoilage above planned meals.",
 1.1,
 "Scaled by entered food waste percent."
 ),
 ],
 targetMarginDefault: 0.1,
 volatilityDefault: 0.09,
 primaryMetricLabel: "Adjusted weekly budget",
 reportSections: REPORT_SECTIONS_STANDARD,
 }),
];

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

const CONTRACT_BY_SLUG = new Map(
 PREMIUM_TOOL_CONTRACTS.map((entry) => [entry.slug, entry])
);

export function getPremiumToolContract(slug: string): PremiumToolContract | null {
 return CONTRACT_BY_SLUG.get(slug) ?? null;
}
