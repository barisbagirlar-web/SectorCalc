import type { IndustrySlug } from "@/lib/tools/industry-registry";
import type { AdditionalRevenueTool } from "@/lib/tools/revenue-tools-additional";

const LEGAL =
 "This is a technical simulation and decision-support output. It is not financial, legal or engineering advice. Verify all results before making business decisions.";

type Input = AdditionalRevenueTool["freeInputs"][number];

const currency = (key: string, label: string, unit = "USD"): Input => ({
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
): Input => ({
 key,
 label,
 type: "number",
 unit,
 required: true,
 defaultValue,
});

const percentInput = (key: string, label: string, defaultValue?: number): Input => ({
 key,
 label,
 type: "percent",
 unit: "%",
 required: true,
 defaultValue,
});

const yesNoSelect = (key: string, label: string, defaultValue = "no"): Input => ({
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

const qualitySelect = (key: string, label: string): Input => ({
 key,
 label,
 type: "select",
 required: true,
 defaultValue: "standard",
 options: [
 { value: "basic", label: "Basic" },
 { value: "standard", label: "Standard" },
 { value: "premium", label: "Premium" },
 ],
});

const energySelect: Input = {
 key: "energySource",
 label: "Energy source",
 type: "select",
 required: true,
 defaultValue: "electricity",
 options: [
 { value: "coal", label: "Coal" },
 { value: "gas", label: "Natural gas" },
 { value: "electricity", label: "Grid electricity" },
 { value: "renewable", label: "Renewable" },
 ],
};

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

export const phase2RevenueTools: AdditionalRevenueTool[] = [
 build({
 sector: "agriculture-crops",
 freeSlug: "fertilizer-dosage-calculator",
 paidSlug: "crop-yield-loss-analyzer",
 freeTitle: "Fertilizer Dosage Calculator",
 paidTitle: "Crop Yield Loss Analyzer",
 painStatement:
 "Fertilizer over-application and weather gaps can destroy crop margin before harvest.",
 freeValue: "Calculate N-P-K load and visible over-fertilization risk.",
 paidValue: "Model moisture, weather and input cost leaks with yield verdict.",
 freeInputs: [
 numberInput("areaHectares", "Field area", "ha"),
 numberInput("nitrogenKgPerHa", "Nitrogen rate", "kg/ha"),
 numberInput("phosphorusKgPerHa", "Phosphorus rate", "kg/ha", 0),
 numberInput("potassiumKgPerHa", "Potassium rate", "kg/ha", 0),
 ],
 paidInputs: [
 numberInput("areaHectares", "Field area", "ha"),
 numberInput("expectedYieldTonnes", "Expected yield", "t/ha"),
 currency("fertilizerCost", "Fertilizer cost"),
 currency("irrigationCost", "Irrigation cost"),
 percentInput("soilMoisturePercent", "Soil moisture", 18),
 numberInput("weatherRiskIndex", "Weather risk index", "0-10", 3),
 percentInput("targetMargin", "Target margin", 20),
 ],
 freeResultPromise: "Shows total nutrient load and salinity risk from visible N rate.",
 paidResultPromise: "Returns real profit floor, weather buffers and accept/reprice verdict.",
 verdictLabels: ["LOSS GUARANTEED", "ACCEPT WITH BUFFER", "SAFE TO PLANT"],
 seoKeywords: ["fertilizer dosage calculator", "crop yield loss"],
 freeMissingFactors: ["Soil moisture penalty", "Weather risk buffer", "Real profit floor", "Harvest verdict"],
 premiumCtaLabel: "Unlock Yield Analyzer",
 premiumTeaserTitle: "Planting season decision?",
 premiumTeaserText: "Unlock the Crop Yield Loss Analyzer for moisture and weather-adjusted profit.",
 }),
 build({
 sector: "agriculture-irrigation",
 freeSlug: "irrigation-cost-check",
 paidSlug: "water-optimization-verdict",
 freeTitle: "Irrigation Cost Check",
 paidTitle: "Water Efficiency Verdict",
 painStatement: "Underestimated pumping and water rights cost can erase field margin.",
 freeValue: "Estimate visible pumping hours and water cost exposure.",
 paidValue: "Find minimum viable irrigation spend with efficiency verdict.",
 freeInputs: [
 numberInput("areaHectares", "Irrigated area", "ha"),
 numberInput("pumpingHours", "Pumping hours", "hr/month"),
 currency("electricityRate", "Electricity rate", "USD/kWh"),
 ],
 paidInputs: [
 numberInput("areaHectares", "Irrigated area", "ha"),
 numberInput("pumpingHours", "Pumping hours", "hr/month"),
 currency("electricityRate", "Electricity rate", "USD/kWh"),
 currency("waterRightsFee", "Water rights fee", "USD/month"),
 percentInput("evaporationLossPercent", "Evaporation loss", 12),
 percentInput("targetMargin", "Target margin", 18),
 ],
 freeResultPromise: "Shows monthly pumping cost before evaporation and rights fees.",
 paidResultPromise: "Returns optimized water spend and efficiency verdict.",
 verdictLabels: ["OVERWATERING RISK", "REPRICE WATER", "EFFICIENT"],
 seoKeywords: ["irrigation cost calculator", "water efficiency farm"],
 freeMissingFactors: ["Water rights fees", "Evaporation loss", "Minimum viable spend", "Efficiency verdict"],
 premiumCtaLabel: "Unlock Water Verdict",
 premiumTeaserTitle: "Scaling irrigated acreage?",
 premiumTeaserText: "Unlock the Water Efficiency Verdict for rights fees and evaporation modeling.",
 }),
 build({
 sector: "agriculture-feed",
 freeSlug: "feed-cost-estimator",
 paidSlug: "feed-efficiency-analyzer",
 freeTitle: "Feed Cost Estimator",
 paidTitle: "Feed Efficiency Analyzer",
 painStatement: "Feed waste and storage loss can quietly exceed milk or meat revenue.",
 freeValue: "Estimate monthly feed spend from herd size and daily ration.",
 paidValue: "Model waste, water quality and feed-to-output efficiency.",
 freeInputs: [
 numberInput("animalCount", "Animal count"),
 numberInput("dailyFeedKg", "Daily feed per head", "kg"),
 currency("feedPricePerKg", "Feed price", "USD/kg"),
 ],
 paidInputs: [
 numberInput("animalCount", "Animal count"),
 numberInput("dailyFeedKg", "Daily feed per head", "kg"),
 currency("feedPricePerKg", "Feed price", "USD/kg"),
 numberInput("milkYieldPerDay", "Milk yield per head", "L/day", 0),
 percentInput("feedWastePercent", "Feed waste / spoilage", 8),
 numberInput("waterQualityIndex", "Water quality index", "1-10", 7),
 percentInput("targetMargin", "Target margin", 15),
 ],
 freeResultPromise: "Shows monthly feed bill before waste and storage loss.",
 paidResultPromise: "Returns real efficiency ratio and reformulate verdict.",
 verdictLabels: ["INEFFICIENT", "MARGIN PRESSURE", "OPTIMAL"],
 seoKeywords: ["feed cost calculator", "feed efficiency livestock", "yem maliyeti"],
 freeMissingFactors: ["Feed waste cost", "Water quality impact", "Output efficiency", "Reformulate verdict"],
 premiumCtaLabel: "Unlock Feed Analyzer",
 premiumTeaserTitle: "Feed bill climbing?",
 premiumTeaserText: "Unlock the Feed Efficiency Analyzer for waste and water-quality modeling.",
 }),
 build({
 sector: "agriculture-dairy",
 freeSlug: "milk-yield-check",
 paidSlug: "dairy-profit-detector",
 freeTitle: "Milk Yield Check",
 paidTitle: "Dairy Profit Detector",
 painStatement: "Low yield per cow with rising feed prices destroys dairy profitability.",
 freeValue: "Compare milk revenue to visible feed cost pressure.",
 paidValue: "Detect dairy profit leaks with full cost stack verdict.",
 freeInputs: [
 numberInput("cowCount", "Cow count"),
 numberInput("litersPerCowPerDay", "Milk per cow", "L/day"),
 currency("milkPricePerLiter", "Milk price", "USD/L"),
 ],
 paidInputs: [
 numberInput("cowCount", "Cow count"),
 numberInput("litersPerCowPerDay", "Milk per cow", "L/day"),
 currency("milkPricePerLiter", "Milk price", "USD/L"),
 currency("monthlyFeedCost", "Monthly feed cost"),
 currency("laborCost", "Monthly labor cost"),
 currency("vetAndHealth", "Vet & health", "USD/month"),
 percentInput("targetMargin", "Target margin", 12),
 ],
 freeResultPromise: "Shows gross milk revenue vs a quick feed cost ratio.",
 paidResultPromise: "Returns net dairy margin and continue/expand verdict.",
 verdictLabels: ["LOSING MONEY", "TIGHT MARGIN", "PROFITABLE"],
 seoKeywords: ["milk yield calculator", "dairy profit analyzer"],
 freeMissingFactors: ["Full feed stack", "Labor allocation", "Health costs", "Net margin verdict"],
 premiumCtaLabel: "Unlock Dairy Detector",
 premiumTeaserTitle: "Dairy margin squeeze?",
 premiumTeaserText: "Unlock the Dairy Profit Detector for full cost stack and net margin.",
 }),
 build({
 sector: "energy-consumption",
 freeSlug: "kwh-consumption-check",
 paidSlug: "energy-efficiency-report",
 freeTitle: "kWh Consumption Check",
 paidTitle: "Energy Efficiency Report",
 painStatement: "Unmanaged kWh spikes and demand charges can blow operating budgets.",
 freeValue: "Check monthly kWh exposure against a baseline tariff.",
 paidValue: "Model demand charges, power factor and efficiency verdict.",
 freeInputs: [
 numberInput("powerKw", "Power", "kW"),
 numberInput("hoursPerDay", "Hours per day", "hr/day"),
 numberInput("days", "Days", "days"),
 currency("tariffPerKwh", "Tariff", "USD/kWh"),
 ],
 paidInputs: [
 numberInput("monthlyKwh", "Monthly kWh"),
 currency("tariffPerKwh", "Tariff", "USD/kWh"),
 currency("demandCharge", "Peak demand charge"),
 percentInput("powerFactorPenalty", "Power factor penalty", 5),
 numberInput("efficiencyTargetPercent", "Efficiency target", "%", 85),
 percentInput("targetSavings", "Target savings", 10),
 ],
 freeResultPromise: "Shows visible monthly energy bill before demand penalties.",
 paidResultPromise: "Returns efficiency gap and retrofit priority verdict.",
 verdictLabels: ["HIGH WASTE", "IMPROVE EFFICIENCY", "ON TARGET"],
 seoKeywords: ["kwh consumption calculator", "energy efficiency report"],
 freeMissingFactors: ["Demand charges", "Power factor penalty", "Efficiency gap", "Retrofit verdict"],
 premiumCtaLabel: "Unlock Efficiency Report",
 premiumTeaserTitle: "Energy bill spiking?",
 premiumTeaserText: "Unlock the Energy Efficiency Report for demand and power-factor modeling.",
 }),
 build({
 sector: "energy-carbon",
 freeSlug: "carbon-footprint-quick",
 paidSlug: "cbam-compliance-verdict",
 freeTitle: "Carbon Footprint Quick Estimate",
 paidTitle: "CBAM Compliance Verdict",
 painStatement: "Carbon border costs can erase export margin if not modeled upfront.",
 freeValue: "Estimate visible CO₂ from production volume and energy mix.",
 paidValue: "Model process emissions, transport and CBAM cost exposure.",
 freeInputs: [
 numberInput("productionTons", "Production volume", "tons"),
 energySelect,
 numberInput("facilityCount", "Production facilities", undefined, 1),
 ],
 paidInputs: [
 numberInput("productionTons", "Production volume", "tons"),
 energySelect,
 currency("euImportValue", "EU import value", "EUR"),
 numberInput("processEmissionsFactor", "Process emissions factor", "tCO₂", 0.2),
 yesNoSelect("includesTransport", "Include transport leg", "yes"),
 percentInput("targetMargin", "Target margin", 15),
 ],
 freeResultPromise: "Shows baseline emissions from standard energy factors.",
 paidResultPromise: "Returns CBAM cost €, % of import value and mitigation verdict.",
 verdictLabels: ["HIGH CBAM RISK", "MODERATE CBAM", "MANAGEABLE"],
 seoKeywords: ["carbon footprint calculator", "CBAM compliance"],
 freeMissingFactors: ["Process emissions", "Transport CO₂", "CBAM € cost", "Mitigation path"],
 premiumCtaLabel: "Unlock CBAM Verdict",
 premiumTeaserTitle: "Exporting to the EU?",
 premiumTeaserText: "Unlock the CBAM Compliance Verdict for border carbon cost modeling.",
 }),
 build({
 sector: "daily-renovation",
 freeSlug: "home-renovation-m2",
 paidSlug: "renovation-budget-optimizer",
 freeTitle: "Home Renovation m² Calculator",
 paidTitle: "Renovation Budget Optimizer",
 painStatement:
 "Renovation budgets blow up when weather delays and city premiums are ignored.",
 freeValue: "Estimate visible material and labor cost per square meter.",
 paidValue: "Add seasonal delay, regional multiplier and realistic total.",
 freeInputs: [
 numberInput("areaM2", "Renovation area", "m²"),
 currency("unitCostPerM2", "Unit cost per m²", "USD/m²"),
 currency("demolitionCost", "Demolition cost"),
 percentInput("contingencyPct", "Contingency", 10),
 ],
 paidInputs: [
 numberInput("areaM2", "Renovation area", "m²"),
 qualitySelect("materialQuality", "Material quality"),
 yesNoSelect("includeLabor", "Include labor", "yes"),
 {
 key: "season",
 label: "Season",
 type: "select",
 required: true,
 defaultValue: "summer",
 options: [
 { value: "summer", label: "Summer" },
 { value: "winter", label: "Winter" },
 ],
 },
 {
 key: "cityTier",
 label: "City cost tier",
 type: "select",
 required: true,
 defaultValue: "standard",
 options: [
 { value: "major", label: "Major metro" },
 { value: "standard", label: "Standard" },
 { value: "rural", label: "Rural" },
 ],
 },
 percentInput("contingencyPercent", "Contingency", 10),
 ],
 freeResultPromise: "Shows base m² cost before weather and regional buffers.",
 paidResultPromise: "Returns realistic total budget and contingency verdict.",
 verdictLabels: ["UNDERBUDGETED", "ADD CONTINGENCY", "BUDGET REALISTIC"],
 seoKeywords: ["home renovation calculator"],
 freeMissingFactors: ["Winter delay buffer", "Regional multiplier", "Contingency", "Realistic total"],
 premiumCtaLabel: "Unlock Budget Optimizer",
 premiumTeaserTitle: "Planning a renovation?",
 premiumTeaserText: "Unlock the Renovation Budget Optimizer for seasonal and city buffers.",
 }),
 build({
 sector: "daily-fuel",
 freeSlug: "fuel-consumption-check",
 paidSlug: "trip-budget-optimizer",
 freeTitle: "Fuel Consumption Check",
 paidTitle: "Trip Budget Optimizer",
 painStatement: "Fuel and toll surprises can wreck personal or small fleet travel budgets.",
 freeValue: "Estimate fuel cost from distance and consumption.",
 paidValue: "Add tolls, return leg and buffer for realistic trip budget.",
 freeInputs: [
 numberInput("distanceKm", "Distance", "km"),
 numberInput("consumptionPer100Km", "Consumption", "L/100km"),
 currency("fuelPricePerLiter", "Fuel price", "USD/L"),
 ],
 paidInputs: [
 numberInput("distanceKm", "Distance", "km"),
 numberInput("consumptionPer100Km", "Consumption", "L/100km"),
 currency("fuelPricePerLiter", "Fuel price", "USD/L"),
 currency("tollEstimate", "Toll estimate"),
 yesNoSelect("returnTrip", "Return trip", "yes"),
 currency("parkingPerDay", "Parking per day", "USD/day"),
 percentInput("bufferPercent", "Budget buffer", 12),
 ],
 freeResultPromise: "Shows one-way fuel cost before tolls and return leg.",
 paidResultPromise: "Returns full trip budget with buffer verdict.",
 verdictLabels: ["UNDERBUDGETED", "ADD BUFFER", "TRIP SAFE"],
 seoKeywords: ["fuel consumption calculator", "trip budget optimizer"],
 freeMissingFactors: ["Tolls", "Return leg", "Parking", "Buffer verdict"],
 premiumCtaLabel: "Unlock Trip Optimizer",
 premiumTeaserTitle: "Long road trip?",
 premiumTeaserText: "Unlock the Trip Budget Optimizer for tolls and return-leg modeling.",
 }),
 build({
 sector: "daily-meals",
 freeSlug: "recipe-cost-check",
 paidSlug: "meal-planning-verdict",
 freeTitle: "Recipe Cost Check",
 paidTitle: "Weekly Meal Planning Verdict",
 painStatement: "Food waste and premium ingredient drift erode household food budgets.",
 freeValue: "Calculate per-serving cost from ingredient list.",
 paidValue: "Model weekly grocery plan with waste and inflation buffer.",
 freeInputs: [
 numberInput("servings", "Servings", undefined, 4),
 currency("ingredientCost", "Total ingredient cost"),
 currency("sellingPricePerServing", "Target price per serving", "USD"),
 ],
 paidInputs: [
 numberInput("mealsPerWeek", "Meals per week"),
 currency("weeklyGroceryBudget", "Weekly grocery budget"),
 percentInput("foodWastePercent", "Food waste", 15),
 percentInput("inflationBuffer", "Price inflation buffer", 8),
 numberInput("householdSize", "Household size"),
 percentInput("targetSavings", "Target savings", 10),
 ],
 freeResultPromise: "Shows cost per serving before waste and weekly scaling.",
 paidResultPromise: "Returns adjusted weekly budget and shopping verdict.",
 verdictLabels: ["OVER SPEND", "TIGHT BUDGET", "ON PLAN"],
 seoKeywords: ["recipe cost calculator", "meal planning budget", "yemek tarifi maliyeti"],
 freeMissingFactors: ["Weekly scale", "Waste allowance", "Inflation buffer", "Shopping verdict"],
 premiumCtaLabel: "Unlock Meal Verdict",
 premiumTeaserTitle: "Grocery bill rising?",
 premiumTeaserText: "Unlock the Weekly Meal Planning Verdict for waste and inflation buffers.",
 }),
];
