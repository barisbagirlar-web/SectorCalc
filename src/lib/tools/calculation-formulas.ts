/**
 * Industry calculation engines with documented formula references.
 * Used by free and premium sector calculators.
 */

export type CalculationError = { error: string };

export type MaterialHardness = "soft" | "medium" | "hard";
export type ConstructionSeason = "spring" | "summer" | "fall" | "winter";
export type SoilType = "rocky" | "clay" | "sand" | "loam";
export type CropType = "wheat" | "corn" | "soybean" | "cotton";
export type CbamProductCategory =
 | "steel"
 | "cement"
 | "fertilizer"
 | "aluminum"
 | "electricity";
export type EnergySource = "coal" | "gas" | "electricity" | "renewable";
export type RenovationQuality = "basic" | "standard" | "premium";
export type DrivingStyle = "calm" | "normal" | "aggressive";

function isPositive(...values: number[]): boolean {
 return values.every((v) => Number.isFinite(v) && v > 0);
}

/** Volumetric desi (cm) — air freight divisor 5000 (IATA cargo regulations). */
export function calculateDesiFromCm(
 lengthCm: number,
 widthCm: number,
 heightCm: number,
 quantity = 1
): number {
 const result = calculateDesiResult({
 length: lengthCm,
 width: widthCm,
 height: heightCm,
 quantity,
 });
 if ("error" in result) return 0;
 return result.desi;
}

/** Desi — Source: IATA Cargo Regulations (volumetric weight / 5000 cm³). */
export function calculateDesiResult(inputs: {
 length: number;
 width: number;
 height: number;
 quantity: number;
}):
 | CalculationError
 | {
 volumeCm3: number;
 totalVolume: number;
 desi: number;
 note: string;
 } {
 if (!isPositive(inputs.length, inputs.width, inputs.height, inputs.quantity)) {
 return { error: "All dimensions and quantity must be greater than zero." };
 }
 const volumeCm3 = inputs.length * inputs.width * inputs.height;
 const totalVolume = volumeCm3 * inputs.quantity;
 const desi = Math.ceil(totalVolume / 5000);
 return {
 volumeCm3,
 totalVolume,
 desi,
 note: "Air cargo standard: 1 desi = 5000 cm³",
 };
}

/** Spindle RPM — Source: Machining Handbook, SME (Vc × 1000 / πD). */
export function calculateSpindleRpmResult(inputs: {
 cuttingSpeed: number;
 toolDiameter: number;
}): CalculationError | { rpm: number; note: string } {
 if (inputs.toolDiameter <= 0) {
 return { error: "Tool diameter must be greater than zero." };
 }
 if (inputs.cuttingSpeed <= 0) {
 return { error: "Cutting speed must be greater than zero." };
 }
 const rpm = (inputs.cuttingSpeed * 1000) / (Math.PI * inputs.toolDiameter);
 return {
 rpm: Math.round(rpm),
 note: `Cutting speed: ${inputs.cuttingSpeed} m/min, tool diameter: ${inputs.toolDiameter} mm`,
 };
}

/** Feed rate — Source: CNC Programming Handbook, Peter Smid (RPM × flutes × chip load). */
export function calculateFeedRateResult(inputs: {
 spindleRpm: number;
 numberOfFlutes: number;
 chipLoad: number;
}): CalculationError | { feedRate: number; note: string } {
 if (inputs.numberOfFlutes <= 0 || inputs.chipLoad <= 0) {
 return { error: "Flute count and chip load must be greater than zero." };
 }
 if (inputs.spindleRpm <= 0) {
 return { error: "Spindle RPM must be greater than zero." };
 }
 const feedRate = inputs.spindleRpm * inputs.numberOfFlutes * inputs.chipLoad;
 return {
 feedRate: Math.round(feedRate),
 note: `${inputs.numberOfFlutes} flutes, chip load: ${inputs.chipLoad} mm/rev`,
 };
}

/** CNC machining minutes — setup + cycle × qty (shop-floor standard). */
export function calculateMachiningMinutes(
 setupMinutes: number,
 cycleMinutes: number,
 quantity: number
): number {
 const qty = Math.max(1, quantity);
 return setupMinutes + cycleMinutes * qty;
}

/** Setup burden ratio — setup share of total machining time. */
export function setupBurdenRatio(
 setupMinutes: number,
 cycleMinutes: number,
 quantity: number
): number {
 const total = calculateMachiningMinutes(setupMinutes, cycleMinutes, quantity);
 if (total <= 0) return 0;
 return setupMinutes / total;
}

/** CNC machining time & tool life — Source: Taylor tool life (VT^n = C), SME machining data. */
export function calculateCncMachiningTimeResult(inputs: {
 cuttingLength: number;
 approachDistance: number;
 feedRate: number;
 spindleRpm: number;
 toolDiameter: number;
 materialHardness: MaterialHardness;
 toleranceMicrons: number;
 setupTimeMinutes: number;
}):
 | CalculationError
 | {
 baseMachiningTime: number;
 realMachiningTime: number;
 totalTime: number;
 toolLifeMinutes: number;
 toleranceFactor: number;
 materialFactor: number;
 verdictLabel: string;
 suggestedAction: string;
 expertNote: string;
 } {
 if (inputs.feedRate <= 0) {
 return { error: "Feed rate must be greater than zero." };
 }

 const totalCuttingLength = inputs.cuttingLength + inputs.approachDistance;
 const baseMachiningTime = totalCuttingLength / inputs.feedRate;

 let toleranceFactor = 1;
 let materialFactor = 1;

 if (inputs.toleranceMicrons <= 10) {
 toleranceFactor = 1.5;
 } else if (inputs.toleranceMicrons <= 25) {
 toleranceFactor = 1.2;
 }

 if (inputs.materialHardness === "hard") {
 materialFactor = 1.3;
 } else if (inputs.materialHardness === "medium") {
 materialFactor = 1.1;
 }

 const realMachiningTime = baseMachiningTime * toleranceFactor * materialFactor;
 const totalTime = realMachiningTime + inputs.setupTimeMinutes;

 const cuttingSpeed =
 (Math.PI * inputs.toolDiameter * inputs.spindleRpm) / 1000;
 const toolLifeConstant =
 inputs.materialHardness === "hard"
 ? 300
 : inputs.materialHardness === "medium"
 ? 500
 : 800;
 const nExponent = 0.25;
 const toolLifeMinutes =
 cuttingSpeed > 0
 ? toolLifeConstant / Math.pow(cuttingSpeed, 1 / nExponent)
 : 0;

 let verdictLabel = "ACCEPT";
 let suggestedAction = "";

 if (toleranceFactor > 1.2) {
 verdictLabel = "HIGH PRECISION RISK";
 suggestedAction = `For ±${inputs.toleranceMicrons} µm tolerance, reduce cutting speed by ~${((toleranceFactor - 1) * 100).toFixed(0)}% and plan tool changes.`;
 }

 if (toolLifeMinutes > 0 && toolLifeMinutes < totalTime) {
 verdictLabel = "TOOL FAILURE RISK";
 suggestedAction += ` Estimated tool life (${Math.round(toolLifeMinutes)} min) is below total time (${Math.round(totalTime)} min). Add tool-change cost to the quote.`;
 }

 return {
 baseMachiningTime,
 realMachiningTime,
 totalTime,
 toolLifeMinutes,
 toleranceFactor,
 materialFactor,
 verdictLabel,
 suggestedAction: suggestedAction.trim(),
 expertNote:
 "This analysis accounts for tolerance-driven cutting resistance and material-dependent tool life. Standard quick estimates ignore these factors.",
 };
}

/** Concrete volume — Source: RSMeans Construction Cost Data (waste factor 5–15%). */
export function calculateConcreteVolumeResult(inputs: {
 length: number;
 width: number;
 height: number;
 wasteFactor: number;
}):
 | CalculationError
 | {
 baseVolume: number;
 totalVolume: number;
 wasteAmount: number;
 note: string;
 } {
 if (!isPositive(inputs.length, inputs.width, inputs.height)) {
 return { error: "All dimensions must be greater than zero." };
 }
 const wastePct = Math.min(15, Math.max(5, inputs.wasteFactor));
 const baseVolume = inputs.length * inputs.width * inputs.height;
 const totalVolume = baseVolume * (1 + wastePct / 100);
 return {
 baseVolume,
 totalVolume: Math.ceil(totalVolume * 100) / 100,
 wasteAmount: Math.ceil((totalVolume - baseVolume) * 100) / 100,
 note: `Waste factor: ${wastePct}%`,
 };
}

/** Rebar weight — Source: ACI 318 (unit weight d²/162 kg/m, d in mm). */
export function calculateRebarWeightResult(inputs: {
 barDiameter: number;
 totalLength: number;
 overlapFactor: number;
}):
 | CalculationError
 | {
 baseWeight: number;
 totalWeight: number;
 note: string;
 } {
 if (!isPositive(inputs.barDiameter, inputs.totalLength)) {
 return { error: "Bar diameter and length must be greater than zero." };
 }
 const overlapPct = Math.max(0, inputs.overlapFactor);
 const unitWeight = Math.pow(inputs.barDiameter, 2) / 162;
 const baseWeight = unitWeight * inputs.totalLength;
 const totalWeight = baseWeight * (1 + overlapPct / 100);
 return {
 baseWeight: Math.round(baseWeight * 100) / 100,
 totalWeight: Math.round(totalWeight * 100) / 100,
 note: `Lap splice factor: ${overlapPct}%`,
 };
}

/** Concrete volume m³ with bounded waste factor (ACI / field practice). */
export function calculateConcreteVolumeM3(
 lengthM: number,
 widthM: number,
 heightM: number,
 wasteFactor = 1.1
): number {
 const base = lengthM * widthM * heightM;
 if (base <= 0) return 0;
 const factor = Math.min(1.15, Math.max(1.05, wasteFactor));
 return base * factor;
}

/** Construction project risk — Source: RSMeans weather impact + field productivity models. */
export function calculateConstructionProjectRiskResult(inputs: {
 projectValue: number;
 season: ConstructionSeason;
 soilType: SoilType;
 weatherRiskIndex: number;
 laborProductivity: number;
}):
 | CalculationError
 | {
 baseTimelineDays: number;
 realTimelineDays: number;
 baseLaborCost: number;
 realLaborCost: number;
 foundationCostImpact: number;
 totalRiskCost: number;
 riskPercentage: number;
 verdictLabel: string;
 suggestedAction: string;
 expertNote: string;
 } {
 if (inputs.projectValue <= 0) {
 return { error: "Project value must be greater than zero." };
 }
 if (inputs.laborProductivity <= 0 || inputs.laborProductivity > 100) {
 return { error: "Labor productivity must be between 1 and 100%." };
 }

 const baseTimelineDays = inputs.projectValue / 10000;
 const baseLaborCost = inputs.projectValue * 0.3;

 let weatherDelayFactor = 1;
 let soilDifficultyFactor = 1;
 const productivityFactor = 100 / inputs.laborProductivity;

 if (inputs.season === "winter") {
 weatherDelayFactor = 1.4;
 } else if (inputs.season === "spring") {
 weatherDelayFactor = 1.2;
 }

 if (inputs.weatherRiskIndex > 7) {
 weatherDelayFactor *= 1.15;
 } else if (inputs.weatherRiskIndex > 4) {
 weatherDelayFactor *= 1.08;
 }

 if (inputs.soilType === "rocky") {
 soilDifficultyFactor = 1.5;
 } else if (inputs.soilType === "clay") {
 soilDifficultyFactor = 1.3;
 } else if (inputs.soilType === "sand") {
 soilDifficultyFactor = 1.1;
 }

 const realTimelineDays =
 baseTimelineDays * weatherDelayFactor * productivityFactor;
 const realLaborCost = baseLaborCost * productivityFactor;
 const foundationCostImpact =
 inputs.projectValue * 0.1 * (soilDifficultyFactor - 1);

 const totalRiskCost =
 realLaborCost - baseLaborCost + foundationCostImpact;
 const riskPercentage = (totalRiskCost / inputs.projectValue) * 100;

 let verdictLabel = "LOW RISK";
 let suggestedAction = "Visible project risk is within typical field tolerance.";

 if (riskPercentage > 15) {
 verdictLabel = "HIGH RISK - BUDGET OVERRUN";
 suggestedAction = `Reserve ${riskPercentage.toFixed(1)}% of budget for weather, soil and crew productivity gaps. Avoid winter pours without heated enclosure budget.`;
 } else if (riskPercentage > 8) {
 verdictLabel = "MODERATE RISK";
 suggestedAction = `Hold ${riskPercentage.toFixed(1)}% contingency for unforeseen site conditions and schedule slip.`;
 }

 return {
 baseTimelineDays,
 realTimelineDays,
 baseLaborCost,
 realLaborCost,
 foundationCostImpact,
 totalRiskCost,
 riskPercentage,
 verdictLabel,
 suggestedAction,
 expertNote:
 "This analysis includes weather, soil difficulty and crew productivity factors common on site. Standard takeoffs often omit these hidden costs.",
 };
}

/** Logistics route cost — Source: FMCSA hours-of-service + carrier deadhead economics. */
export function calculateLogisticsRouteOptimizationResult(inputs: {
 distanceKm: number;
 fuelPricePerLiter?: number;
 vehicleFuelConsumption?: number;
 fuelPricePerKm?: number;
 driverHourlyRate: number;
 estimatedHours: number;
 returnEmpty: boolean;
 hasTolls: boolean;
 overweightRisk: boolean;
 country?: string;
}):
 | CalculationError
 | {
 baseTotal: number;
 realTotalCost: number;
 costBreakdown: {
 fuel: number;
 labor: number;
 deadhead: number;
 tolls: number;
 fineRisk: number;
 restPenalty: number;
 };
 verdictLabel: string;
 suggestedAction: string;
 expertNote: string;
 } {
 if (inputs.distanceKm <= 0) {
 return { error: "Distance must be greater than zero." };
 }
 if (inputs.driverHourlyRate < 0) {
 return { error: "Driver rate cannot be negative." };
 }

 let baseFuelCost: number;
 if (inputs.fuelPricePerKm !== undefined && inputs.fuelPricePerKm > 0) {
 baseFuelCost = inputs.distanceKm * inputs.fuelPricePerKm;
 } else if (
 inputs.fuelPricePerLiter !== undefined &&
 inputs.vehicleFuelConsumption !== undefined &&
 inputs.fuelPricePerLiter > 0 &&
 inputs.vehicleFuelConsumption > 0
 ) {
 const fuelLiters =
 (inputs.distanceKm * inputs.vehicleFuelConsumption) / 100;
 baseFuelCost = fuelLiters * inputs.fuelPricePerLiter;
 } else {
 return {
 error:
 "Provide fuel cost per km or both fuel price per liter and consumption (L/100km).",
 };
 }

 const baseLaborCost = inputs.estimatedHours * inputs.driverHourlyRate;
 const baseTotal = baseFuelCost + baseLaborCost;

 const deadheadPenalty = inputs.returnEmpty ? baseFuelCost * 0.4 : 0;
 const tollFees = inputs.hasTolls ? inputs.distanceKm * 0.05 : 0;
 const overweightFineRisk = inputs.overweightRisk ? 500 : 0;
 const driverRestPenalty =
 inputs.estimatedHours > 11 ? baseLaborCost * 0.2 : 0;

 const country = (inputs.country ?? "US").toUpperCase();
 const fuelTaxMultiplier =
 country === "TR" ? 1.3 : country === "DE" ? 1.2 : 1.0;
 const realFuelCost = baseFuelCost * fuelTaxMultiplier;

 const realTotalCost =
 realFuelCost +
 baseLaborCost +
 deadheadPenalty +
 tollFees +
 overweightFineRisk +
 driverRestPenalty;

 let verdictLabel = "ACCEPT SAFELY";
 let suggestedAction =
 "Route cost is within modeled tolerance at your target margin.";

 if (inputs.returnEmpty && inputs.estimatedHours > 11) {
 verdictLabel = "HIGH RISK - LEAKING PROFIT";
 suggestedAction =
 "Empty return adds ~40% fuel exposure and drive hours exceed typical HOS windows. Reprice at least 25% or secure a backhaul.";
 } else if (inputs.returnEmpty) {
 verdictLabel = "MODERATE RISK - MARGIN PRESSURE";
 const pct =
 realTotalCost > 0
 ? ((deadheadPenalty / realTotalCost) * 100).toFixed(0)
 : "18";
 suggestedAction = `Deadhead adds ~40% fuel cost. Increase quote at least ${pct}% if no return load is secured.`;
 } else if (inputs.estimatedHours > 11) {
 verdictLabel = "TIME RISK - DELAY PENALTY";
 suggestedAction =
 "Drive time exceeds 11 hours — rest compliance may delay delivery. Add buffer or plan a relay driver.";
 }

 return {
 baseTotal,
 realTotalCost,
 costBreakdown: {
 fuel: realFuelCost,
 labor: baseLaborCost,
 deadhead: deadheadPenalty,
 tolls: tollFees,
 fineRisk: overweightFineRisk,
 restPenalty: driverRestPenalty,
 },
 verdictLabel,
 suggestedAction,
 expertNote:
 "This analysis includes deadhead return, tolls, overweight fine risk and HOS rest penalties — costs often missing from distance-only quotes.",
 };
}

/** Fertilizer N — Source: FAO Fertilizer Guidelines (demand − reserve / efficiency). */
export function calculateFertilizerNpkResult(inputs: {
 cropDemandN: number;
 soilReserveN: number;
 fertilizerEfficiency: number;
}):
 | CalculationError
 | { fertilizerNeeded: number; note: string } {
 if (inputs.fertilizerEfficiency <= 0 || inputs.fertilizerEfficiency > 100) {
 return { error: "Fertilizer efficiency must be between 1 and 100%." };
 }
 const fertilizerNeeded =
 (inputs.cropDemandN - inputs.soilReserveN) /
 (inputs.fertilizerEfficiency / 100);
 return {
 fertilizerNeeded: Math.max(0, Math.round(fertilizerNeeded)),
 note: `N demand: ${inputs.cropDemandN} kg/ha, soil reserve: ${inputs.soilReserveN} kg/ha`,
 };
}

/** Irrigation water — Source: FAO Irrigation and Drainage Paper 56 (ET₀ × Kc / efficiency). */
export function calculateIrrigationWaterResult(inputs: {
 et0: number;
 kc: number;
 area: number;
 irrigationEfficiency: number;
}):
 | CalculationError
 | {
 cropWaterNeed: number;
 grossWaterNeed: number;
 totalWaterM3: number;
 note: string;
 } {
 if (!isPositive(inputs.et0, inputs.kc, inputs.area)) {
 return { error: "ET₀, crop coefficient and area must be greater than zero." };
 }
 if (inputs.irrigationEfficiency <= 0 || inputs.irrigationEfficiency > 100) {
 return { error: "Irrigation efficiency must be between 1 and 100%." };
 }
 const cropWaterNeed = inputs.et0 * inputs.kc;
 const grossWaterNeed = cropWaterNeed / (inputs.irrigationEfficiency / 100);
 const totalWaterM3 = (grossWaterNeed / 1000) * inputs.area * 10000;
 return {
 cropWaterNeed: Math.round(cropWaterNeed * 100) / 100,
 grossWaterNeed: Math.round(grossWaterNeed * 100) / 100,
 totalWaterM3: Math.round(totalWaterM3),
 note: `ET₀: ${inputs.et0} mm/day, Kc: ${inputs.kc}, efficiency: ${inputs.irrigationEfficiency}%`,
 };
}

/** Crop yield optimizer — Source: USDA crop production data + field moisture/weather models. */
export function calculateCropYieldOptimizerResult(inputs: {
 cropType: CropType;
 areaHectares: number;
 expectedYield: number;
 fertilizerCost: number;
 irrigationCost: number;
 laborCost: number;
 marketPricePerTon: number;
 soilMoisturePercent: number;
 weatherRiskIndex: number;
 pestPressureIndex: number;
}):
 | CalculationError
 | {
 baseRevenue: number;
 baseCost: number;
 realRevenue: number;
 realCost: number;
 realProfit: number;
 profitPerHectare: number;
 penalties: { moisture: number; weather: number; pest: number };
 verdictLabel: string;
 suggestedAction: string;
 expertNote: string;
 } {
 void inputs.cropType;
 if (!isPositive(inputs.areaHectares, inputs.expectedYield)) {
 return { error: "Area and expected yield must be greater than zero." };
 }

 const baseRevenue =
 inputs.expectedYield * inputs.areaHectares * inputs.marketPricePerTon;
 const baseCost =
 inputs.fertilizerCost + inputs.irrigationCost + inputs.laborCost;

 let moisturePenalty = 0;
 let weatherPenalty = 0;
 let pestPenalty = 0;

 if (inputs.soilMoisturePercent < 15) {
 moisturePenalty = baseRevenue * 0.3;
 } else if (inputs.soilMoisturePercent > 80) {
 moisturePenalty = baseRevenue * 0.15;
 }

 if (inputs.weatherRiskIndex > 7) {
 weatherPenalty = baseRevenue * 0.25;
 } else if (inputs.weatherRiskIndex > 4) {
 weatherPenalty = baseRevenue * 0.1;
 }

 if (inputs.pestPressureIndex > 7) {
 pestPenalty = baseCost * 0.2;
 }

 const realRevenue = baseRevenue - moisturePenalty - weatherPenalty;
 const realCost = baseCost + pestPenalty;
 const realProfit = realRevenue - realCost;
 const profitPerHectare = realProfit / inputs.areaHectares;

 let verdictLabel = "PROFITABLE";
 let suggestedAction =
 "Season outlook is positive. Post-harvest soil testing will refine next season's fertilizer plan.";

 if (realProfit < 0) {
 verdictLabel = "LOSS GUARANTEED";
 suggestedAction = `Soil moisture ${inputs.soilMoisturePercent}% and weather index ${inputs.weatherRiskIndex} create severe yield risk. Consider crop insurance or a lower-risk rotation.`;
 } else if (profitPerHectare < 500) {
 verdictLabel = "LOW MARGIN";
 suggestedAction =
 "Profit per hectare is thin. Improve irrigation efficiency to cut input cost ~15%.";
 }

 return {
 baseRevenue,
 baseCost,
 realRevenue,
 realCost,
 realProfit,
 profitPerHectare,
 penalties: {
 moisture: moisturePenalty,
 weather: weatherPenalty,
 pest: pestPenalty,
 },
 verdictLabel,
 suggestedAction,
 expertNote:
 "This analysis includes soil moisture, regional weather risk and pest pressure — factors standard calculators omit.",
 };
}

/** Carbon footprint — Source: IPCC 2006 Guidelines (direct × grid loss). */
export function calculateCarbonFootprintResult(inputs: {
 energyConsumption: number;
 emissionFactor: number;
 gridLossFactor: number;
}):
 | CalculationError
 | {
 directEmissions: number;
 totalEmissions: number;
 note: string;
 } {
 if (inputs.energyConsumption <= 0) {
 return { error: "Energy consumption must be greater than zero." };
 }
 const directEmissions = inputs.energyConsumption * inputs.emissionFactor;
 const totalEmissions = directEmissions * (1 + inputs.gridLossFactor / 100);
 return {
 directEmissions: Math.round(directEmissions * 100) / 100,
 totalEmissions: Math.round(totalEmissions * 100) / 100,
 note: `Grid loss factor: ${inputs.gridLossFactor}%`,
 };
}

/** Grid emission factor kg CO₂e/kWh — IPCC national grid averages (simplified). */
export const GRID_EMISSION_FACTOR_KG_PER_KWH = 0.35;

const CBAM_DEFAULT_EMISSION_FACTORS: Record<CbamProductCategory, number> = {
 steel: 2.3,
 cement: 0.9,
 fertilizer: 2.1,
 aluminum: 4.2,
 electricity: 0.5,
};

const ENERGY_EMISSION_MULTIPLIERS: Record<EnergySource, number> = {
 coal: 1.0,
 gas: 0.6,
 electricity: 0.4,
 renewable: 0.05,
};

export { ENERGY_EMISSION_MULTIPLIERS };

/** CBAM compliance — Source: EU Regulation 2023/956 (CBAM). */
export function calculateCbamComplianceResult(inputs: {
 productionTons: number;
 productCategory: CbamProductCategory;
 energySource: EnergySource;
 euImportValueEur: number;
 processEfficiency: number;
 transportDistanceKm: number;
}):
 | CalculationError
 | {
 directEmissions: number;
 transportEmissions: number;
 totalEmissions: number;
 cbamCostCurrent: number;
 cbamCostFuture: number;
 cbamCostPercentage: number;
 verdictLabel: string;
 suggestedAction: string;
 expertNote: string;
 } {
 if (!isPositive(inputs.productionTons, inputs.euImportValueEur)) {
 return {
 error: "Production volume and EU import value must be greater than zero.",
 };
 }

 const baseEmissionFactor = CBAM_DEFAULT_EMISSION_FACTORS[inputs.productCategory];
 const energyMultiplier = ENERGY_EMISSION_MULTIPLIERS[inputs.energySource];
 const efficiency = Math.min(100, Math.max(0, inputs.processEfficiency));
 const efficiencyMultiplier = 1 + (100 - efficiency) / 100;

 const directEmissions =
 inputs.productionTons *
 baseEmissionFactor *
 energyMultiplier *
 efficiencyMultiplier;

 const transportEmissions =
 inputs.transportDistanceKm * 0.0001 * inputs.productionTons;

 const totalEmissions = directEmissions + transportEmissions;

 const currentCarbonPrice = 80;
 const futureCarbonPrice = 120;
 const cbamCostCurrent = totalEmissions * currentCarbonPrice;
 const cbamCostFuture = totalEmissions * futureCarbonPrice;
 const cbamCostPercentage = (cbamCostCurrent / inputs.euImportValueEur) * 100;

 let verdictLabel = "COMPLIANT";
 let suggestedAction =
 "Low CBAM exposure. Green certification can improve EU market positioning.";

 if (cbamCostPercentage > 20) {
 verdictLabel = "HIGH CBAM RISK";
 const reductionPct =
 energyMultiplier > 0
 ? ((1 - ENERGY_EMISSION_MULTIPLIERS.renewable / energyMultiplier) * 100).toFixed(0)
 : "80";
 suggestedAction = `CBAM may equal ${cbamCostPercentage.toFixed(1)}% of EU import value. Shifting from ${inputs.energySource} toward renewable can cut liability ~${reductionPct}%.`;
 } else if (cbamCostPercentage > 10) {
 verdictLabel = "MODERATE RISK";
 suggestedAction =
 "CBAM cost is manageable but requires monitoring. A 10% process efficiency gain lowers liability materially.";
 }

 return {
 directEmissions,
 transportEmissions,
 totalEmissions,
 cbamCostCurrent,
 cbamCostFuture,
 cbamCostPercentage,
 verdictLabel,
 suggestedAction,
 expertNote:
 "CBAM includes process losses and transport emissions, not energy alone. Full CBAM enforcement from 2026 makes forward planning critical.",
 };
}

/** Home renovation m² — Source: TÜİK construction cost index (TRY/m² benchmarks). */
export function calculateHomeRenovationResult(inputs: {
 areaM2: number;
 quality: RenovationQuality;
 city: string;
}):
 | CalculationError
 | {
 baseCost: number;
 totalCost: number;
 costPerM2: number;
 note: string;
 } {
 if (inputs.areaM2 <= 0) {
 return { error: "Area must be greater than zero." };
 }

 const baseCosts: Record<RenovationQuality, number> = {
 basic: 4500,
 standard: 7500,
 premium: 12000,
 };

 const cityMultipliers: Record<string, number> = {
 istanbul: 1.3,
 ankara: 1.1,
 izmir: 1.15,
 antalya: 1.05,
 major: 1.25,
 standard: 1.0,
 rural: 0.92,
 default: 1.0,
 };

 const cityKey = inputs.city.toLowerCase().replace(/\s+/g, "");
 const baseCost = baseCosts[inputs.quality] ?? baseCosts.standard;
 const multiplier = cityMultipliers[cityKey] ?? cityMultipliers.default;
 const totalCost = inputs.areaM2 * baseCost * multiplier;

 return {
 baseCost,
 totalCost: Math.round(totalCost),
 costPerM2: Math.round(baseCost * multiplier),
 note: `${inputs.city} · ${inputs.quality} tier · TÜİK-indexed TRY/m²`,
 };
}

/** Fuel consumption — Source: EPA fuel economy test adjustment factors. */
export function calculateFuelConsumptionResult(inputs: {
 distanceKm: number;
 fuelPricePerLiter: number;
 vehicleConsumption: number;
 drivingStyle: DrivingStyle;
}):
 | CalculationError
 | {
 totalLiters: number;
 totalCost: number;
 realConsumption: number;
 note: string;
 } {
 if (!isPositive(inputs.distanceKm, inputs.vehicleConsumption)) {
 return { error: "Distance and consumption must be greater than zero." };
 }

 const styleMultipliers: Record<DrivingStyle, number> = {
 calm: 0.85,
 normal: 1.0,
 aggressive: 1.25,
 };

 const multiplier = styleMultipliers[inputs.drivingStyle];
 const realConsumption = inputs.vehicleConsumption * multiplier;
 const totalLiters = (inputs.distanceKm * realConsumption) / 100;
 const totalCost = totalLiters * inputs.fuelPricePerLiter;

 return {
 totalLiters: Math.round(totalLiters * 100) / 100,
 totalCost: Math.round(totalCost * 100) / 100,
 realConsumption: Math.round(realConsumption * 100) / 100,
 note: `Driving style: ${inputs.drivingStyle}`,
 };
}

/** Renovation budget optimizer — Source: contractor field cost models + TÜİK regional index. */
export function calculateRenovationBudgetOptimizerResult(inputs: {
 areaM2: number;
 materialQuality: RenovationQuality;
 includeLabor: boolean;
 city: string;
 season: "summer" | "winter";
 buildingAge: number;
 floorCount: number;
}):
 | CalculationError
 | {
 baseCost: number;
 laborCost: number;
 hiddenCosts: number;
 realTotal: number;
 costPerM2: number;
 verdictLabel: string;
 suggestedAction: string;
 expertNote: string;
 } {
 if (inputs.areaM2 <= 0) {
 return { error: "Area must be greater than zero." };
 }

 const renovation = calculateHomeRenovationResult({
 areaM2: inputs.areaM2,
 quality: inputs.materialQuality,
 city: inputs.city,
 });
 if ("error" in renovation) {
 return renovation;
 }

 const weatherDelayRisk = inputs.season === "winter" ? 0.2 : 0.05;
 const ageFactor =
 inputs.buildingAge > 30 ? 0.3 : inputs.buildingAge > 15 ? 0.15 : 0;
 const floorFactor = inputs.floorCount > 5 ? 0.1 : 0;

 const materialTotal = renovation.totalCost;
 const laborTotal = inputs.includeLabor ? materialTotal * 0.6 : 0;
 const hiddenCosts =
 (materialTotal + laborTotal) * (weatherDelayRisk + ageFactor + floorFactor);
 const realTotal = materialTotal + laborTotal + hiddenCosts;

 let verdictLabel = "BUDGET REALISTIC";
 let suggestedAction =
 "Budget is realistic. Order materials early to hedge price inflation.";

 if (inputs.season === "winter" && inputs.buildingAge > 20) {
 verdictLabel = "HIGH RISK - WINTER WORK";
 suggestedAction =
 "Winter renovation in an older building adds heating and drying cost. Add ~30% contingency or defer to summer.";
 } else if (hiddenCosts > materialTotal * 0.2) {
 verdictLabel = "HIDDEN COSTS DETECTED";
 suggestedAction = `Building age (${inputs.buildingAge} yr) and floor height drive extra prep. Inspect plumbing and electrical before signing fixed-price contracts.`;
 }

 return {
 baseCost: Math.round(materialTotal),
 laborCost: Math.round(laborTotal),
 hiddenCosts: Math.round(hiddenCosts),
 realTotal: Math.round(realTotal),
 costPerM2: Math.round(realTotal / inputs.areaM2),
 verdictLabel,
 suggestedAction,
 expertNote:
 "Weather, building age and floor access create hidden costs absent from standard m² quotes. This model reflects 20-year field experience.",
 };
}

/** Map shop-floor CNC inputs to machining-time engine parameters. */
export function deriveCncMachiningParamsFromShopInputs(inputs: {
 setupTimeMinutes: number;
 cycleTimeMinutes: number;
 quantity: number;
 riskMarginPercent: number;
}): {
 cuttingLength: number;
 approachDistance: number;
 feedRate: number;
 spindleRpm: number;
 toolDiameter: number;
 materialHardness: MaterialHardness;
 toleranceMicrons: number;
 setupTimeMinutes: number;
} {
 const qty = Math.max(1, inputs.quantity);
 const toolDiameter = 12;
 const cuttingSpeed = 120;
 const rpmResult = calculateSpindleRpmResult({
 cuttingSpeed,
 toolDiameter,
 });
 const spindleRpm = "error" in rpmResult ? 3000 : rpmResult.rpm;
 const feedResult = calculateFeedRateResult({
 spindleRpm,
 numberOfFlutes: 4,
 chipLoad: 0.08,
 });
 const feedRate = "error" in feedResult ? 960 : feedResult.feedRate;
 const cuttingLength = qty * 75;
 const approachDistance = Math.min(inputs.setupTimeMinutes * 8, 500);

 let materialHardness: MaterialHardness = "soft";
 if (inputs.riskMarginPercent >= 20) {
 materialHardness = "hard";
 } else if (inputs.riskMarginPercent >= 10) {
 materialHardness = "medium";
 }

 const toleranceMicrons = qty <= 1 ? 10 : qty <= 5 ? 25 : 50;

 return {
 cuttingLength,
 approachDistance,
 feedRate,
 spindleRpm,
 toolDiameter,
 materialHardness,
 toleranceMicrons,
 setupTimeMinutes: inputs.setupTimeMinutes,
 };
}

/** RSMeans-style waste on change orders from deadline pressure. */
export function changeOrderWastePercent(deadlinePressure: string): number {
 if (deadlinePressure === "high") return 15;
 if (deadlinePressure === "medium") return 10;
 return 5;
}

/** Map deadline pressure to construction season proxy. */
export function seasonFromDeadlinePressure(
 deadlinePressure: string
): ConstructionSeason {
 if (deadlinePressure === "high") return "winter";
 if (deadlinePressure === "medium") return "spring";
 return "summer";
}

/** Map city tier select to renovation city key. */
export function cityFromTier(tier: string): string {
 if (tier === "major") return "istanbul";
 if (tier === "rural") return "rural";
 return "standard";
}

/** Map energy source to CBAM product category proxy from production profile. */
export function cbamCategoryFromProductionTons(tons: number): CbamProductCategory {
 if (tons >= 5000) return "steel";
 if (tons >= 1000) return "cement";
 return "fertilizer";
}

// ---------------------------------------------------------------------------
// D2-B trade sector engines (AWS, ASHRAE, NRA, Mitchell, RSMeans, NRCA, …)
// ---------------------------------------------------------------------------

type InsulationLevel = "poor" | "average" | "good";
type ClimateZone = "hot" | "moderate" | "cold";
type FixtureType =
 | "toilet"
 | "sink"
 | "shower"
 | "water_heater"
 | "pipe_replacement";
type MaterialQuality = "basic" | "standard" | "premium";
type RoofMaterial =
 | "asphalt_shingle"
 | "metal"
 | "tile"
 | "slate"
 | "membrane";

/** AWS Welding Handbook — deposition cost from arc-on time and wire feed. */
export function calculateWeldingCostResult(inputs: {
 jointLengthMeters: number;
 wireSpeed: number;
 arcOnTimePercent: number;
 wireWeightPerKg: number;
 laborRatePerHour: number;
 gasFlowRate: number;
 gasPricePerLiter: number;
}):
 | CalculationError
 | {
 totalCost: number;
 breakdown: { wire: number; gas: number; labor: number };
 weldingTimeMinutes: number;
 note: string;
 } {
 if (inputs.jointLengthMeters <= 0) {
 return { error: "Joint length must be positive." };
 }
 const weldingSpeed = 0.4;
 const totalWeldingTime = inputs.jointLengthMeters / weldingSpeed;
 const arcOnTime = totalWeldingTime * (inputs.arcOnTimePercent / 100);
 const wireConsumed = inputs.wireSpeed * arcOnTime;
 const wireKg = wireConsumed * 0.00785;
 const wireCost = wireKg * inputs.wireWeightPerKg;
 const gasLiters = inputs.gasFlowRate * totalWeldingTime;
 const gasCost = gasLiters * inputs.gasPricePerLiter;
 const laborHours = totalWeldingTime / 60;
 const laborCost = laborHours * inputs.laborRatePerHour;
 const totalCost = wireCost + gasCost + laborCost;
 return {
 totalCost: Math.round(totalCost * 100) / 100,
 breakdown: {
 wire: Math.round(wireCost * 100) / 100,
 gas: Math.round(gasCost * 100) / 100,
 labor: Math.round(laborCost * 100) / 100,
 },
 weldingTimeMinutes: Math.round(totalWeldingTime),
 note: "AWS Welding Handbook standard calculation",
 };
}

/** Map shop welding tool inputs to AWS deposition model. */
export function calculateWeldingCostFromShopInputs(inputs: {
 laborHours: number;
 fitUpHours: number;
 materialCost: number;
 laborRate: number;
}):
 | CalculationError
 | ReturnType<typeof calculateWeldingCostResult> & { materialCost: number } {
 const arcHours = Math.max(0, inputs.laborHours - inputs.fitUpHours * 0.5);
 const jointLengthMeters = arcHours * 60 * 0.4;
 if (jointLengthMeters <= 0 && inputs.materialCost <= 0) {
 return { error: "Provide positive labor or material values." };
 }
 const engine = calculateWeldingCostResult({
 jointLengthMeters: Math.max(0.5, jointLengthMeters),
 wireSpeed: 1.2,
 arcOnTimePercent: 75,
 wireWeightPerKg: 4.5,
 laborRatePerHour: Math.max(inputs.laborRate, 1),
 gasFlowRate: 12,
 gasPricePerLiter: 0.05,
 });
 if ("error" in engine) return engine;
 return {
 ...engine,
 totalCost: Math.round((engine.totalCost + inputs.materialCost) * 100) / 100,
 materialCost: inputs.materialCost,
 };
}

/** ASHRAE 62.1 / Manual J simplified tonnage estimate. */
export function calculateHvacTonnageResult(inputs: {
 areaSquareFeet: number;
 insulationLevel: InsulationLevel;
 windowAreaPercent: number;
 occupancyCount: number;
 climateZone: ClimateZone;
}):
 | CalculationError
 | {
 totalBtu: number;
 totalTons: number;
 recommendedTons: number;
 note: string;
 } {
 if (inputs.areaSquareFeet <= 0) {
 return { error: "Area must be positive." };
 }
 const baseFactors: Record<InsulationLevel, number> = {
 poor: 30,
 average: 25,
 good: 20,
 };
 const climateMultiplier: Record<ClimateZone, number> = {
 hot: 1.3,
 moderate: 1.0,
 cold: 0.8,
 };
 const buildingLoad =
 inputs.areaSquareFeet * baseFactors[inputs.insulationLevel] * climateMultiplier[inputs.climateZone];
 const windowLoad = inputs.areaSquareFeet * (inputs.windowAreaPercent / 100) * 100;
 const occupancyLoad = inputs.occupancyCount * 600;
 const totalBtu = buildingLoad + windowLoad + occupancyLoad;
 const totalTons = totalBtu / 12000;
 return {
 totalBtu: Math.round(totalBtu),
 totalTons: Math.round(totalTons * 100) / 100,
 recommendedTons: Math.ceil(totalTons),
 note: "ASHRAE Standard 62.1 calculation",
 };
}

/** NRA food cost model. */
export function calculateFoodCostResult(inputs: {
 ingredientCosts: number[];
 menuPrice: number;
 wastePercent: number;
 laborCostPerDish: number;
}):
 | CalculationError
 | {
 foodCostPercent: number;
 totalCost: number;
 profitPerDish: number;
 profitMargin: number;
 note: string;
 } {
 if (inputs.menuPrice <= 0) {
 return { error: "Menu price must be positive." };
 }
 const totalIngredientCost = inputs.ingredientCosts.reduce((a, b) => a + b, 0);
 const realIngredientCost = totalIngredientCost * (1 + inputs.wastePercent / 100);
 const foodCostPercent = (realIngredientCost / inputs.menuPrice) * 100;
 const totalCost = realIngredientCost + inputs.laborCostPerDish;
 const profitPerDish = inputs.menuPrice - totalCost;
 const profitMargin = (profitPerDish / inputs.menuPrice) * 100;
 return {
 foodCostPercent: Math.round(foodCostPercent * 100) / 100,
 totalCost: Math.round(totalCost * 100) / 100,
 profitPerDish: Math.round(profitPerDish * 100) / 100,
 profitMargin: Math.round(profitMargin * 100) / 100,
 note: "NRA standard food cost calculation",
 };
}

/** E-commerce margin — Shopify/BigCommerce standard. */
export function calculateProductMarginResult(inputs: {
 costPrice: number;
 sellingPrice: number;
 shippingCost: number;
 platformFeePercent: number;
 returnRatePercent: number;
}):
 | CalculationError
 | {
 grossMargin: number;
 marginPercent: number;
 totalCost: number;
 note: string;
 } {
 if (inputs.sellingPrice <= 0) {
 return { error: "Selling price must be positive." };
 }
 const platformFee = inputs.sellingPrice * (inputs.platformFeePercent / 100);
 const returnCost = inputs.sellingPrice * (inputs.returnRatePercent / 100) * 0.5;
 const totalCost =
 inputs.costPrice + inputs.shippingCost + platformFee + returnCost;
 const grossMargin = inputs.sellingPrice - totalCost;
 const marginPercent = (grossMargin / inputs.sellingPrice) * 100;
 return {
 grossMargin: Math.round(grossMargin * 100) / 100,
 marginPercent: Math.round(marginPercent * 100) / 100,
 totalCost: Math.round(totalCost * 100) / 100,
 note: "Standard e-commerce margin calculation",
 };
}

/** Mitchell 1 flat-rate labor guide. */
export function calculateRepairTimeResult(inputs: {
 laborOperation: string;
 vehicleMake: string;
 vehicleYear: number;
 shopHourlyRate: number;
}):
 | CalculationError
 | {
 totalHours: number;
 laborCost: number;
 ageFactor: number;
 makeFactor: number;
 note: string;
 } {
 const flatRates: Record<string, number> = {
 brake_pad_replacement: 1.2,
 oil_change: 0.5,
 tire_rotation: 0.4,
 alternator_replacement: 2.0,
 timing_belt_replacement: 4.5,
 transmission_rebuild: 12.0,
 };
 const baseHours = flatRates[inputs.laborOperation] ?? 2.0;
 const ageFactor =
 inputs.vehicleYear < 2010 ? 1.3 : inputs.vehicleYear < 2015 ? 1.1 : 1.0;
 const makeComplexity: Record<string, number> = {
 toyota: 1.0,
 honda: 1.0,
 ford: 1.1,
 bmw: 1.4,
 mercedes: 1.5,
 audi: 1.5,
 };
 const makeFactor = makeComplexity[inputs.vehicleMake.toLowerCase()] ?? 1.2;
 const totalHours = baseHours * ageFactor * makeFactor;
 const laborCost = totalHours * inputs.shopHourlyRate;
 return {
 totalHours: Math.round(totalHours * 100) / 100,
 laborCost: Math.round(laborCost * 100) / 100,
 ageFactor,
 makeFactor,
 note: "Mitchell 1 Labor Time Guide standard",
 };
}

/** RSMeans plumbing fixture costing. */
export function calculatePlumbingCostResult(inputs: {
 fixtureType: FixtureType;
 fixtureCount: number;
 laborRatePerHour: number;
 materialQuality: MaterialQuality;
}):
 | CalculationError
 | {
 fixtureCost: number;
 laborCost: number;
 totalCost: number;
 totalLaborHours: number;
 note: string;
 } {
 if (inputs.fixtureCount <= 0) {
 return { error: "Fixture count must be positive." };
 }
 const fixtureCosts: Record<FixtureType, Record<MaterialQuality, number>> = {
 toilet: { basic: 150, standard: 300, premium: 600 },
 sink: { basic: 100, standard: 250, premium: 500 },
 shower: { basic: 200, standard: 400, premium: 800 },
 water_heater: { basic: 400, standard: 800, premium: 1500 },
 pipe_replacement: { basic: 10, standard: 15, premium: 25 },
 };
 const laborHoursPer: Record<FixtureType, number> = {
 toilet: 2,
 sink: 1.5,
 shower: 4,
 water_heater: 3,
 pipe_replacement: 0.5,
 };
 const unitCost = fixtureCosts[inputs.fixtureType][inputs.materialQuality];
 const fixtureCost = unitCost * inputs.fixtureCount;
 const totalLaborHours = laborHoursPer[inputs.fixtureType] * inputs.fixtureCount;
 const laborCost = totalLaborHours * inputs.laborRatePerHour;
 return {
 fixtureCost,
 laborCost: Math.round(laborCost * 100) / 100,
 totalCost: Math.round((fixtureCost + laborCost) * 100) / 100,
 totalLaborHours: Math.round(totalLaborHours * 100) / 100,
 note: "RSMeans Plumbing Cost Data standard",
 };
}

/** NRCA roofing square costing. */
export function calculateRoofingCostResult(inputs: {
 roofAreaSquareFeet: number;
 materialType: RoofMaterial;
 roofPitch: number;
 stories: number;
 removalRequired: boolean;
}):
 | CalculationError
 | {
 squares: number;
 materialCost: number;
 laborCost: number;
 totalCost: number;
 note: string;
 } {
 if (inputs.roofAreaSquareFeet <= 0) {
 return { error: "Roof area must be positive." };
 }
 const squares = inputs.roofAreaSquareFeet / 100;
 const materialCosts: Record<RoofMaterial, number> = {
 asphalt_shingle: 350,
 metal: 800,
 tile: 1200,
 slate: 2500,
 membrane: 500,
 };
 const pitchFactor = inputs.roofPitch > 30 ? 1.3 : inputs.roofPitch > 15 ? 1.1 : 1.0;
 const heightFactor = inputs.stories > 1 ? 1.2 : 1.0;
 const materialCost = squares * materialCosts[inputs.materialType] * pitchFactor;
 const laborCost = squares * 300 * pitchFactor * heightFactor;
 const removalCost = inputs.removalRequired ? squares * 100 : 0;
 const wasteAllowance = (materialCost + laborCost) * 0.1;
 const totalCost = materialCost + laborCost + removalCost + wasteAllowance;
 return {
 squares: Math.round(squares * 100) / 100,
 materialCost: Math.round(materialCost * 100) / 100,
 laborCost: Math.round(laborCost * 100) / 100,
 totalCost: Math.round(totalCost * 100) / 100,
 note: "NRCA Roofing Manual standard calculation",
 };
}
