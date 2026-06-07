/**
 * SectorCalc Premium Tool Contract v1 — unified decision engine.
 *
 * Reads revenue paid-input keys, applies contract hidden variables and
 * volatility buffer, and returns a PremiumDecisionReport per slug.
 */

import type {
 PremiumDecisionReport,
 PremiumLossDriver,
 PremiumSensitivityRow,
 PremiumToolContract,
 PremiumVerdict,
} from "@/lib/tools/premium-tool-contract";
import {
 getPremiumToolContract,
 PREMIUM_TOOL_CONTRACTS,
} from "@/lib/tools/premium-tool-contracts";
import {
 calculateCbamComplianceResult,
 calculateCropYieldOptimizerResult,
 calculateFuelConsumptionResult,
 calculateLogisticsRouteOptimizationResult,
 calculateRenovationBudgetOptimizerResult,
 cbamCategoryFromProductionTons,
 cityFromTier,
} from "@/lib/tools/calculation-formulas";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const LEGAL_NOTE =
 "This report is a technical decision-support simulation based on user-provided inputs and sector assumptions. It is not financial, legal, medical or engineering advice. Verify all outputs before business decisions.";

const Z_P90 = 1.2816;

const QUOTED_PRICE_KEYS = [
 "quotedPrice",
 "quotedMonthlyPrice",
 "quotedBudget",
 "plannedBudget",
 "chargedPrice",
 "quotedChangeOrder",
 "quotedFreightPrice",
 "expectedRevenue",
 "exportValue",
 "menuPrice",
 "productPrice",
 "sellingPrice",
 "euImportValue",
 "weeklyGroceryBudget",
] as const;

const MARGIN_KEYS = ["targetMargin", "marginTarget", "riskMargin", "targetSavings"] as const;

// ---------------------------------------------------------------------------
// Helpers (exported)
// ---------------------------------------------------------------------------

export type PremiumInputValues = Record<string, number | string>;

export function normalizeNumber(value: string | number): number {
 const parsed = typeof value === "number" ? value : Number(String(value).trim());
 return Number.isFinite(parsed) ? parsed : NaN;
}

export function assertFiniteNumber(value: number, fallback = 0): number {
 return Number.isFinite(value) ? value : fallback;
}

export function clamp(value: number, min: number, max: number): number {
 if (!Number.isFinite(value)) {
 return min;
 }
 return Math.min(max, Math.max(min, value));
}

export function safeDivide(a: number, b: number): number {
 if (b === 0 || !Number.isFinite(a) || !Number.isFinite(b)) {
 return 0;
 }
 const result = a / b;
 return Number.isFinite(result) ? result : 0;
}

export function round(value: number, digits = 2): number {
 if (!Number.isFinite(value)) {
 return 0;
 }
 const factor = 10 ** digits;
 return Math.round(value * factor) / factor;
}

export function formatCurrency(value: number, currency = "USD"): string {
 const safe = assertFiniteNumber(value, 0);
 const formatted = Math.max(0, safe).toFixed(2);
 if (currency === "EUR") {
 return `€${formatted}`;
 }
 return `$${formatted}`;
}

export function formatPercent(value: number, digits = 1): string {
 const safe = assertFiniteNumber(value, 0);
 return `${safe.toFixed(digits)}%`;
}

function num(values: PremiumInputValues, ...keys: string[]): number {
 for (const key of keys) {
 const raw = values[key];
 if (raw === undefined || raw === null || raw === "") {
 continue;
 }
 if (typeof raw === "number" && Number.isFinite(raw)) {
 return raw;
 }
 if (typeof raw === "string") {
 const parsed = normalizeNumber(raw);
 if (Number.isFinite(parsed)) {
 return parsed;
 }
 }
 }
 return 0;
}

function yes(values: PremiumInputValues, key: string): boolean {
 return values[key] === "yes";
}

function pct(values: PremiumInputValues, key: string, fallback = 0): number {
 return clamp(num(values, key) || fallback, 0, 100);
}

function marginToDecimal(raw: number, fallback: number): number {
 if (!Number.isFinite(raw) || raw <= 0) {
 return fallback;
 }
 return raw > 1 ? clamp(raw, 0, 95) / 100 : clamp(raw, 0, 0.95);
}

function resolveTargetMargin(
 values: PremiumInputValues,
 contract: PremiumToolContract
): number {
 for (const key of MARGIN_KEYS) {
 const raw = num(values, key);
 if (raw > 0) {
 return marginToDecimal(raw, contract.targetMarginDefault);
 }
 }
 return contract.targetMarginDefault;
}

function resolveQuotedPrice(values: PremiumInputValues): number | null {
 for (const key of QUOTED_PRICE_KEYS) {
 const raw = num(values, key);
 if (raw > 0) {
 return raw;
 }
 }
 return null;
}

// ---------------------------------------------------------------------------
// Sensitivity profiles
// ---------------------------------------------------------------------------

type CostSplit = {
 material: number;
 labor: number;
 timeline: number;
 energy: number;
};

type BaseCostMeta = {
 baseCost: number;
 split: CostSplit;
};

const DEFAULT_SPLIT: CostSplit = {
 material: 0.35,
 labor: 0.4,
 timeline: 0.15,
 energy: 0.1,
};

// ---------------------------------------------------------------------------
// Per-slug base cost calculators (revenue paid-input keys)
// ---------------------------------------------------------------------------

type BaseCostCalculator = (values: PremiumInputValues) => BaseCostMeta;

function calcCnc(values: PremiumInputValues): BaseCostMeta {
 const setupTime = num(values, "setupTime");
 const cycleTime = num(values, "cycleTime");
 const quantity = Math.max(1, num(values, "quantity"));
 const toolCost = num(values, "toolCost");
 const materialCost = num(values, "materialCost");
 const machineRate = num(values, "machineRate");
 const scrapPct = pct(values, "scrapRatePercent", pct(values, "scrapRate", 5));
 const machineHours = (setupTime + cycleTime * quantity) / 60;
 const machineCost = machineHours * machineRate;
 const scrapFactor = 1 + scrapPct / 100;
 const baseCost = (machineCost + toolCost + materialCost) * scrapFactor;
 return {
 baseCost,
 split: { material: 0.4, labor: 0.45, timeline: 0.1, energy: 0.05 },
 };
}

function calcChangeOrder(values: PremiumInputValues): BaseCostMeta {
 const changeEstimate = num(values, "changeEstimate");
 const delayDays = num(values, "delayDays");
 const crewCostPerDay = num(values, "crewCostPerDay");
 const originalBudget = num(values, "originalBudget");
 const overhead = originalBudget * 0.02;
 const baseCost = changeEstimate + delayDays * crewCostPerDay + overhead;
 return {
 baseCost,
 split: { material: 0.25, labor: 0.45, timeline: 0.25, energy: 0.05 },
 };
}

function calcCleaning(values: PremiumInputValues): BaseCostMeta {
 const labor =
 num(values, "laborRate") * num(values, "hoursPerVisit") * num(values, "visitFrequency");
 const supply = num(values, "supplyCost");
 const overhead = (labor + supply) * 0.15;
 const baseCost = labor + supply + overhead;
 return {
 baseCost,
 split: { material: 0.1, labor: 0.7, timeline: 0.15, energy: 0.05 },
 };
}

function calcMenu(values: PremiumInputValues): BaseCostMeta {
 const menuPrice = num(values, "menuPrice");
 const ingredient = num(values, "ingredientCost");
 const waste = pct(values, "wasteRate");
 const commission = pct(values, "deliveryCommission");
 const labor = num(values, "laborCostPerItem");
 const baseCost =
 ingredient * (1 + waste / 100) +
 labor +
 menuPrice * (commission / 100) +
 ingredient * 0.15;
 return {
 baseCost,
 split: { material: 0.55, labor: 0.3, timeline: 0.1, energy: 0.05 },
 };
}

function calcEcommerce(values: PremiumInputValues): BaseCostMeta {
 const price = num(values, "productPrice");
 const productCost = num(values, "productCost");
 const shipping = num(values, "shippingCost");
 const returnRate = pct(values, "returnRate");
 const feeRate = pct(values, "paymentFeeRate");
 const adCost = num(values, "adCostPerSale");
 const fee = price * (feeRate / 100);
 const returnDrag = price * (returnRate / 100);
 const reverseLogistics = shipping * (returnRate / 100) * 0.5;
 const baseCost = productCost + shipping + fee + adCost + returnDrag + reverseLogistics;
 return {
 baseCost,
 split: { material: 0.45, labor: 0.15, timeline: 0.1, energy: 0.3 },
 };
}

function calcWelding(values: PremiumInputValues): BaseCostMeta {
 const material = num(values, "materialCost");
 const laborHours = num(values, "laborHours");
 const fitUpHours = num(values, "fitUpHours");
 const laborRate = num(values, "laborRate");
 const gas = num(values, "gasConsumableCost");
 const rework = pct(values, "reworkRiskPercent", 10);
 const fitUpCost = fitUpHours * laborRate * 1.35;
 const laborCost = laborHours * laborRate;
 const base = (material + laborCost + gas + fitUpCost) * 1.15;
 const baseCost = base * (1 + rework / 100);
 return {
 baseCost,
 split: { material: 0.35, labor: 0.5, timeline: 0.1, energy: 0.05 },
 };
}

function calcHvac(values: PremiumInputValues): BaseCostMeta {
 const laborCost = num(values, "laborHours") * num(values, "laborRate");
 const base =
 num(values, "equipmentCost") +
 num(values, "ductworkCost") +
 laborCost +
 num(values, "commissioningCost");
 const callback = num(values, "equipmentCost") * (pct(values, "callbackRiskPercent", 8) / 100);
 const refrigerant = num(values, "equipmentCost") * 0.03;
 const seasonal = laborCost * 0.2;
 const baseCost = base + callback + refrigerant + seasonal;
 return {
 baseCost,
 split: { material: 0.45, labor: 0.35, timeline: 0.1, energy: 0.1 },
 };
}

function calcElectrical(values: PremiumInputValues): BaseCostMeta {
 const laborRate = num(values, "laborRate");
 const laborCost = num(values, "laborHours") * laborRate;
 const testing = num(values, "testingHours") * laborRate;
 const permit = num(values, "materialCost") * 0.04;
 const inspection = pct(values, "inspectionRiskPercent", 10);
 const base = num(values, "materialCost") + laborCost + testing + permit;
 const baseCost = base * (1 + inspection / 100);
 return {
 baseCost,
 split: { material: 0.5, labor: 0.4, timeline: 0.08, energy: 0.02 },
 };
}

function calcLandscaping(values: PremiumInputValues): BaseCostMeta {
 const visits = num(values, "visitsPerMonth");
 const laborCost = num(values, "crewHoursPerVisit") * num(values, "laborRate") * visits;
 const fuel = num(values, "fuelCostPerVisit") * visits;
 const equipDep = laborCost * 0.08;
 const baseCost =
 laborCost + fuel + num(values, "supplyCostPerMonth") + num(values, "equipmentWearCost") + equipDep;
 return {
 baseCost,
 split: { material: 0.15, labor: 0.55, timeline: 0.15, energy: 0.15 },
 };
}

function calcAutoShop(values: PremiumInputValues): BaseCostMeta {
 const laborRate = num(values, "laborRate");
 const laborCost = (num(values, "diagnosticHours") + num(values, "repairHours")) * laborRate;
 const parts = num(values, "partsCost") * (1 + pct(values, "partsMarkupPercent", 30) / 100);
 const supplies = laborCost * 0.05;
 const comeback = pct(values, "comebackRiskPercent", 12);
 const base = laborCost + parts + supplies + num(values, "partsCost") * 0.12;
 const baseCost = base * (1 + comeback / 100);
 return {
 baseCost,
 split: { material: 0.4, labor: 0.5, timeline: 0.08, energy: 0.02 },
 };
}

function calcSignage(values: PremiumInputValues): BaseCostMeta {
 const laborRate = num(values, "laborRate");
 const labor =
 (num(values, "designHours") + num(values, "installHours")) * laborRate;
 const base = num(values, "materialCost") + num(values, "inkCost") + labor;
 const rip = base * 0.04;
 const reprint = pct(values, "reprintRiskPercent", 8);
 const baseCost = (base + rip) * (1 + reprint / 100);
 return {
 baseCost,
 split: { material: 0.4, labor: 0.45, timeline: 0.1, energy: 0.05 },
 };
}

function calcPlumbing(values: PremiumInputValues): BaseCostMeta {
 const laborCost = num(values, "laborHours") * num(values, "laborRate");
 const access = laborCost * 0.15;
 const permit = laborCost * 0.1;
 const callback = pct(values, "callbackRiskPercent", 10);
 const base =
 num(values, "partsCost") +
 laborCost +
 num(values, "materialRunCost") +
 num(values, "fixtureCount") * 25 +
 access +
 permit;
 const baseCost = base * (1 + callback / 100);
 return {
 baseCost,
 split: { material: 0.4, labor: 0.45, timeline: 0.12, energy: 0.03 },
 };
}

function calcMillwork(values: PremiumInputValues): BaseCostMeta {
 const waste = Math.max(pct(values, "wasteRatePercent", 12), 10);
 const material = num(values, "sheetMaterialCost") * (1 + waste / 100);
 const laborRate = num(values, "laborRate");
 const labor = (num(values, "laborHours") + num(values, "installHours")) * laborRate;
 const finishingDelay = num(values, "finishingCost") * 0.1;
 const baseCost = material + labor + num(values, "finishingCost") + finishingDelay;
 return {
 baseCost,
 split: { material: 0.45, labor: 0.4, timeline: 0.12, energy: 0.03 },
 };
}

function calcRoofing(values: PremiumInputValues): BaseCostMeta {
 const laborCost = num(values, "laborHours") * num(values, "laborRate");
 const base =
 num(values, "materialCost") +
 laborCost +
 num(values, "tearOffCost") +
 num(values, "dumpFees");
 const reserves = num(values, "materialCost") * 0.14;
 const weather = pct(values, "weatherDelayRiskPercent", 10);
 const baseCost = (base + reserves) * (1 + weather / 100);
 return {
 baseCost,
 split: { material: 0.45, labor: 0.4, timeline: 0.12, energy: 0.03 },
 };
}

function calcPainting(values: PremiumInputValues): BaseCostMeta {
 const laborRate = num(values, "laborRate");
 const productionHours = num(values, "areaSize") / 350;
 const labor = (num(values, "prepHours") + productionHours) * laborRate;
 const caulk = num(values, "areaSize") * 0.08;
 const touchUp = pct(values, "touchUpRiskPercent", 8);
 const base = num(values, "paintCost") + labor + num(values, "scaffoldCost") + caulk;
 const baseCost = base * (1 + touchUp / 100);
 return {
 baseCost,
 split: { material: 0.3, labor: 0.55, timeline: 0.1, energy: 0.05 },
 };
}

function calcSheetMetal(values: PremiumInputValues): BaseCostMeta {
 const totalMinutes =
 num(values, "programmingTime") +
 num(values, "setupTime") +
 num(values, "cutTime") +
 num(values, "bendCount") * 2;
 const laborCost = (totalMinutes / 60) * num(values, "laborRate");
 const scrap = Math.max(pct(values, "scrapRatePercent", 8), 8);
 const material = num(values, "materialCost") * (1 + scrap / 100);
 const baseCost = laborCost + material + num(values, "finishingCost");
 return {
 baseCost,
 split: { material: 0.4, labor: 0.45, timeline: 0.1, energy: 0.05 },
 };
}

function calc3dPrint(values: PremiumInputValues): BaseCostMeta {
 const machine = num(values, "printHours") * num(values, "machineRate");
 const post = num(values, "postProcessHours") * num(values, "laborRate");
 const support = num(values, "materialCost") * 0.15;
 const fail = pct(values, "failRatePercent", 10);
 const base = num(values, "materialCost") + machine + post + support;
 const baseCost = base * (1 + fail / 100);
 return {
 baseCost,
 split: { material: 0.35, labor: 0.25, timeline: 0.15, energy: 0.25 },
 };
}

function calcRoute(values: PremiumInputValues): BaseCostMeta {
 const route = calculateLogisticsRouteOptimizationResult({
 distanceKm: num(values, "distanceKm"),
 fuelPricePerKm: num(values, "fuelPricePerKm"),
 driverHourlyRate: num(values, "driverHourlyRate"),
 estimatedHours: num(values, "estimatedHours"),
 returnEmpty: yes(values, "returnEmpty"),
 hasTolls: yes(values, "hasTolls"),
 overweightRisk: yes(values, "overweightRisk"),
 });
 const baseCost = "error" in route ? 0 : route.realTotalCost;
 return {
 baseCost,
 split: { material: 0.05, labor: 0.35, timeline: 0.2, energy: 0.4 },
 };
}

function calcCrop(values: PremiumInputValues): BaseCostMeta {
 const area = num(values, "areaHectares");
 const yieldResult = calculateCropYieldOptimizerResult({
 cropType: "wheat",
 areaHectares: area,
 expectedYield: num(values, "expectedYieldTonnes"),
 fertilizerCost: num(values, "fertilizerCost"),
 irrigationCost: num(values, "irrigationCost"),
 laborCost: 0,
 marketPricePerTon: 250,
 soilMoisturePercent: num(values, "soilMoisturePercent") || 18,
 weatherRiskIndex: num(values, "weatherRiskIndex") || 3,
 pestPressureIndex: 3,
 });
 if ("error" in yieldResult) {
 const inputCost = num(values, "fertilizerCost") + num(values, "irrigationCost");
 return { baseCost: inputCost, split: DEFAULT_SPLIT };
 }
 const baseCost = Math.max(0, yieldResult.baseRevenue - yieldResult.realProfit);
 return {
 baseCost,
 split: { material: 0.4, labor: 0.2, timeline: 0.25, energy: 0.15 },
 };
}

function calcWater(values: PremiumInputValues): BaseCostMeta {
 const pumping =
 num(values, "areaHectares") * num(values, "pumpingHours") * num(values, "electricityRate");
 const rights = num(values, "waterRightsFee");
 const evap = pumping * (pct(values, "evaporationLossPercent", 12) / 100);
 const baseCost = pumping + rights + evap;
 return {
 baseCost,
 split: { material: 0.05, labor: 0.15, timeline: 0.1, energy: 0.7 },
 };
}

function calcFeed(values: PremiumInputValues): BaseCostMeta {
 const baseFeed =
 num(values, "animalCount") * num(values, "dailyFeedKg") * 30 * num(values, "feedPricePerKg");
 const waste = baseFeed * (pct(values, "feedWastePercent", 8) / 100);
 const baseCost = baseFeed + waste;
 return {
 baseCost,
 split: { material: 0.75, labor: 0.1, timeline: 0.1, energy: 0.05 },
 };
}

function calcDairy(values: PremiumInputValues): BaseCostMeta {
 const baseCost =
 num(values, "monthlyFeedCost") + num(values, "laborCost") + num(values, "vetAndHealth");
 return {
 baseCost,
 split: { material: 0.55, labor: 0.3, timeline: 0.1, energy: 0.05 },
 };
}

function calcEnergy(values: PremiumInputValues): BaseCostMeta {
 const base = num(values, "monthlyKwh") * num(values, "tariffPerKwh");
 const demand = num(values, "demandCharge");
 const pf = base * (pct(values, "powerFactorPenalty", 5) / 100);
 const baseCost = base + demand + pf;
 return {
 baseCost,
 split: { material: 0.05, labor: 0.1, timeline: 0.05, energy: 0.8 },
 };
}

function calcCbam(values: PremiumInputValues): BaseCostMeta {
 const source = (values.energySource as string) || "electricity";
 const prod = num(values, "productionTons");
 const cbam = calculateCbamComplianceResult({
 productionTons: prod,
 productCategory: cbamCategoryFromProductionTons(prod),
 energySource: source as "coal" | "gas" | "electricity" | "renewable",
 euImportValueEur: num(values, "euImportValue") || 1,
 processEfficiency: Math.max(0, 100 - (num(values, "processEmissionsFactor") || 0.2) * 10),
 transportDistanceKm: yes(values, "includesTransport") ? 800 : 0,
 });
 const baseCost = "error" in cbam ? prod * 50 : cbam.cbamCostCurrent;
 return {
 baseCost,
 split: { material: 0.2, labor: 0.15, timeline: 0.15, energy: 0.5 },
 };
}

function calcRenovation(values: PremiumInputValues): BaseCostMeta {
 const quality = (values.materialQuality as string) || "standard";
 const season = (values.season as string) || "summer";
 const budget = calculateRenovationBudgetOptimizerResult({
 areaM2: num(values, "areaM2"),
 materialQuality: quality as "basic" | "standard" | "premium",
 includeLabor: yes(values, "includeLabor"),
 city: cityFromTier((values.cityTier as string) || "standard"),
 season: season as "summer" | "winter",
 buildingAge: season === "winter" ? 25 : 12,
 floorCount: 3,
 });
 if ("error" in budget) {
 return { baseCost: num(values, "areaM2") * 450, split: DEFAULT_SPLIT };
 }
 const contingency = pct(values, "contingencyPercent", 10);
 const baseCost = budget.realTotal * (1 + contingency / 100);
 return {
 baseCost,
 split: { material: 0.45, labor: 0.35, timeline: 0.15, energy: 0.05 },
 };
}

function calcTrip(values: PremiumInputValues): BaseCostMeta {
 const distance = yes(values, "returnTrip")
 ? num(values, "distanceKm") * 2
 : num(values, "distanceKm");
 const fuel = calculateFuelConsumptionResult({
 distanceKm: distance,
 fuelPricePerLiter: num(values, "fuelPricePerLiter"),
 vehicleConsumption: num(values, "consumptionPer100Km"),
 drivingStyle: "normal",
 });
 const fuelCost = "error" in fuel ? 0 : fuel.totalCost;
 const subtotal = fuelCost + num(values, "tollEstimate") + num(values, "parkingPerDay");
 const buffer = pct(values, "bufferPercent", 12);
 const baseCost = subtotal * (1 + buffer / 100);
 return {
 baseCost,
 split: { material: 0.05, labor: 0.1, timeline: 0.15, energy: 0.7 },
 };
}

function calcMeal(values: PremiumInputValues): BaseCostMeta {
 const budget = num(values, "weeklyGroceryBudget");
 const waste = budget * (pct(values, "foodWastePercent", 15) / 100);
 const inflation = budget * (pct(values, "inflationBuffer", 8) / 100);
 const baseCost = budget + waste + inflation;
 return {
 baseCost,
 split: { material: 0.85, labor: 0.05, timeline: 0.05, energy: 0.05 },
 };
}

const BASE_COST_CALCULATORS: Record<string, BaseCostCalculator> = {
 "cnc-quote-risk-analyzer": calcCnc,
 "change-order-impact-analyzer": calcChangeOrder,
 "office-cleaning-bid-optimizer": calcCleaning,
 "menu-profit-leak-detector": calcMenu,
 "return-profit-erosion-tool": calcEcommerce,
 "welding-bid-risk-analyzer": calcWelding,
 "hvac-project-margin-guard": calcHvac,
 "panel-shop-margin-verdict": calcElectrical,
 "landscaping-contract-profit-tool": calcLandscaping,
 "auto-shop-margin-leak-detector": calcAutoShop,
 "signage-bid-safe-price-tool": calcSignage,
 "plumbing-job-margin-verdict": calcPlumbing,
 "millwork-bid-risk-analyzer": calcMillwork,
 "roofing-contract-margin-guard": calcRoofing,
 "painting-job-profit-verdict": calcPainting,
 "sheet-metal-quote-risk-tool": calcSheetMetal,
 "3d-print-job-margin-tool": calc3dPrint,
 "route-optimization-analyzer": calcRoute,
 "crop-yield-loss-analyzer": calcCrop,
 "water-optimization-verdict": calcWater,
 "feed-efficiency-analyzer": calcFeed,
 "dairy-profit-detector": calcDairy,
 "energy-efficiency-report": calcEnergy,
 "cbam-compliance-verdict": calcCbam,
 "renovation-budget-optimizer": calcRenovation,
 "trip-budget-optimizer": calcTrip,
 "meal-planning-verdict": calcMeal,
};

// ---------------------------------------------------------------------------
// Verdict + sensitivity + loss drivers
// ---------------------------------------------------------------------------

function resolveVerdict(
 quotedPrice: number | null,
 minimumSafePrice: number,
 p90Cost: number
): PremiumVerdict {
 if (quotedPrice === null || quotedPrice <= 0) {
 return {
 severity: "caution",
 label: "Add your quoted price for a full verdict",
 suggestedAction:
 "Enter the price you plan to charge so we can compare it to the safe floor.",
 };
 }
 if (quotedPrice < p90Cost) {
 return {
 severity: "reject",
 label: "Reprice before accepting",
 suggestedAction: `Your price is below the buffered cost floor of ${formatCurrency(p90Cost)}. Raise the quote or reduce scope.`,
 };
 }
 if (quotedPrice < minimumSafePrice) {
 return {
 severity: "caution",
 label: "Margin is thinner than your target",
 suggestedAction: `Quote at least ${formatCurrency(minimumSafePrice)} to hold your target margin after buffers.`,
 };
 }
 return {
 severity: "accept",
 label: "Current inputs are inside acceptable range",
 suggestedAction:
 "Price holds above the safe floor at your target margin. Confirm assumptions before signing.",
 };
}

function buildHiddenLossDrivers(
 baseCost: number,
 contract: PremiumToolContract,
 hiddenMultiplier: number
): PremiumLossDriver[] {
 if (contract.hiddenVariables.length === 0 || hiddenMultiplier <= 1) {
 return [
 {
 id: "operating-buffer",
 label: "Operating buffer",
 amount: round(baseCost * 0.05),
 amountDisplay: formatCurrency(baseCost * 0.05),
 explanation: "Standard shop-floor contingency not visible in quick estimates.",
 },
 ];
 }

 const totalHiddenUplift = baseCost * (hiddenMultiplier - 1);
 let allocated = 0;

 return contract.hiddenVariables.map((variable, index, list) => {
 const logWeight = Math.log(Math.max(variable.defaultMultiplier, 1));
 const totalLog = list.reduce(
 (sum, item) => sum + Math.log(Math.max(item.defaultMultiplier, 1)),
 0
 );
 const share =
 index === list.length - 1
 ? totalHiddenUplift - allocated
 : totalLog > 0
 ? totalHiddenUplift * (logWeight / totalLog)
 : totalHiddenUplift / list.length;
 allocated += share;
 const amount = round(Math.max(0, share));
 return {
 id: variable.id,
 label: variable.label,
 amount,
 amountDisplay: formatCurrency(amount),
 explanation: variable.description,
 };
 });
}

function buildSensitivity(
 baseMeta: BaseCostMeta,
 hiddenMultiplier: number,
 targetMargin: number,
 volatilityDefault: number
): PremiumSensitivityRow[] {
 const shocks: Array<{ factor: string; shockPercent: number; key: keyof CostSplit }> = [
  { factor: "Material cost", shockPercent: 10, key: "material" },
  { factor: "Labor cost", shockPercent: 8, key: "labor" },
  { factor: "Timeline / schedule", shockPercent: 20, key: "timeline" },
  { factor: "Energy / fuel", shockPercent: 15, key: "energy" },
 ];

 const baselineAdjusted = baseMeta.baseCost * hiddenMultiplier;
 const baselineP90 =
  baselineAdjusted + baselineAdjusted * volatilityDefault * Z_P90;
 const baselineMinimum = safeDivide(baselineP90, 1 - targetMargin);

 return shocks
  .filter((shock) => baseMeta.split[shock.key] > 0.02)
  .map((shock) => {
   const portion = baseMeta.baseCost * baseMeta.split[shock.key];
   const shockedBase = baseMeta.baseCost + portion * (shock.shockPercent / 100);
   const adjustedCost = shockedBase * hiddenMultiplier;
   const volatilityBuffer = adjustedCost * volatilityDefault * Z_P90;
   const p90Cost = adjustedCost + volatilityBuffer;
   const minimumSafePrice = safeDivide(p90Cost, 1 - targetMargin);
   const delta = minimumSafePrice - baselineMinimum;
 return {
 factor: shock.factor,
 shockPercent: shock.shockPercent,
 adjustedCost: round(adjustedCost),
 adjustedCostDisplay: formatCurrency(adjustedCost),
 minimumSafePrice: round(minimumSafePrice),
 minimumSafePriceDisplay: formatCurrency(minimumSafePrice),
 impactSummary:
 delta > 0
 ? `${shock.factor} +${shock.shockPercent}% adds ${formatCurrency(delta)} to the safe price floor.`
 : `${shock.factor} change is within current buffers.`,
 };
 });
}

function buildReportSections(
 contract: PremiumToolContract,
 summary: string,
 recommendation: string,
 lossDrivers: readonly PremiumLossDriver[],
 sensitivity: readonly PremiumSensitivityRow[]
): PremiumDecisionReport["reportSections"] {
 return contract.reportSections.map((title) => {
 if (title === "Hidden cost drivers") {
 const body =
 lossDrivers.length > 0
 ? lossDrivers.map((d) => `${d.label}: ${d.amountDisplay} — ${d.explanation}`).join(" ")
 : "No material hidden drivers detected at current inputs.";
 return { title, body };
 }
 if (title === "Sensitivity check") {
 const body =
 sensitivity.length > 0
 ? sensitivity.map((s) => s.impactSummary).join(" ")
 : "Sensitivity checks are not applicable for this input set.";
 return { title, body };
 }
 if (title === "Recommended action") {
 return { title, body: recommendation };
 }
 if (title === "Visible cost summary") {
 return { title, body: summary };
 }
 if (title === "Buffered cost floor") {
 return { title, body: summary };
 }
 return { title, body: summary };
 });
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function calculatePremiumDecisionReport(
 slug: string,
 values: PremiumInputValues
): PremiumDecisionReport {
 const contract = getPremiumToolContract(slug);
 if (!contract) {
 throw new Error(`Unknown premium tool contract: ${slug}`);
 }

 const calculator = BASE_COST_CALCULATORS[slug];
 const baseMeta = calculator ? calculator(values) : { baseCost: 0, split: DEFAULT_SPLIT };
 const baseCost = assertFiniteNumber(baseMeta.baseCost, 0);

 const hiddenMultiplier = contract.hiddenVariables.reduce(
 (product, variable) => product * variable.defaultMultiplier,
 1
 );

 const toleranceMultiplier = contract.toleranceRules.reduce(
 (product, rule) => product * rule.costMultiplier,
 1
 );

 const adjustedCost = baseCost * hiddenMultiplier * toleranceMultiplier;
 const volatilityBuffer = adjustedCost * contract.volatilityDefault * Z_P90;
 const p90Cost = adjustedCost + volatilityBuffer;
 const targetMargin = resolveTargetMargin(values, contract);
 const marginDenom = Math.max(0.05, 1 - targetMargin);
 const minimumSafePrice = safeDivide(p90Cost, marginDenom);

 const quotedPrice = resolveQuotedPrice(values);
 const verdict = resolveVerdict(quotedPrice, minimumSafePrice, p90Cost);

 const hiddenLossDrivers = buildHiddenLossDrivers(baseCost, contract, hiddenMultiplier);
 const sensitivity = buildSensitivity(
  baseMeta,
  hiddenMultiplier * toleranceMultiplier,
  targetMargin,
  contract.volatilityDefault
 );

 const summary = `Visible direct cost is ${formatCurrency(baseCost)}. After hidden buffers the adjusted cost is ${formatCurrency(adjustedCost)} and the 90th-percentile cost floor is ${formatCurrency(p90Cost)}.`;

 const recommendation = verdict.suggestedAction;

 return {
 toolSlug: slug,
 sectorSlug: contract.sectorSlug,
 generatedAt: new Date().toISOString(),
 contractTitle: contract.title,
 primaryMetricLabel: contract.primaryMetricLabel,
 primaryMetricValue: formatCurrency(minimumSafePrice),
 baseCost: round(baseCost),
 baseCostDisplay: formatCurrency(baseCost),
 hiddenMultiplier: round(hiddenMultiplier * toleranceMultiplier, 4),
 adjustedCost: round(adjustedCost),
 adjustedCostDisplay: formatCurrency(adjustedCost),
 volatilityBuffer: round(volatilityBuffer),
 volatilityBufferDisplay: formatCurrency(volatilityBuffer),
 p90Cost: round(p90Cost),
 p90CostDisplay: formatCurrency(p90Cost),
 minimumSafePrice: round(minimumSafePrice),
 minimumSafePriceDisplay: formatCurrency(minimumSafePrice),
 quotedPrice,
 quotedPriceDisplay: quotedPrice !== null ? formatCurrency(quotedPrice) : null,
 targetMargin,
 targetMarginDisplay: formatPercent(targetMargin * 100),
 verdict,
 hiddenLossDrivers,
 sensitivity,
 summary,
 recommendation,
 reportSections: buildReportSections(
 contract,
 summary,
 recommendation,
 hiddenLossDrivers,
 sensitivity
 ),
 legalNote: LEGAL_NOTE,
 };
}

/** All registered contract slugs (27). */
export function listPremiumContractSlugs(): readonly string[] {
 return PREMIUM_TOOL_CONTRACTS.map((entry) => entry.slug);
}
