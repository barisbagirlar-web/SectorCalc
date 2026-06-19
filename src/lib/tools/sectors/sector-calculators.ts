/**
 * Sector-Specific Naive Cost Calculators & Margin Leak Detectors
 *
 * Each sector exports:
 * - calculateNaiveCost(inputs) → base cost before risk adjustment
 * - detectMarginLeaks(inputs, naiveCost) → array of margin leak items
 * - verdictLabels → sector-specific accept/caution/reject labels
 *
 * These are consumed by runMarginCoreEngine via MarginCoreEngineInput.
 */

import type {
 MarginCoreInputValues,
 MarginLeakItem,
} from "@/lib/types/margincore-engine";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function num(inputs: MarginCoreInputValues, key: string, fallback = 0): number {
 const v = inputs[key];
 if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
 if (typeof v === "string") {
 const n = Number(v);
 return Number.isFinite(n) ? n : fallback;
 }
 return fallback;
}

// ---------------------------------------------------------------------------
// Verdict Label Sets (all 27 sectors)
// ---------------------------------------------------------------------------

export const VERDICT_LABELS: Record<string, { accept: string; caution: string; reject: string }> = {
 "cnc-manufacturing": { accept: "SAFE TO QUOTE", caution: "REPRICE REQUIRED", reject: "DO NOT ACCEPT UNDER" },
 "welding-fabrication": { accept: "SAFE TO QUOTE", caution: "REPRICE NEEDED", reject: "DO NOT ACCEPT" },
 "sheet-metal": { accept: "QUOTE SAFE", caution: "SETUP RISK", reject: "DO NOT ACCEPT" },
 "3d-printing-service": { accept: "PRINT SAFE", caution: "FAIL RISK", reject: "REPRICE REQUIRED" },
 "construction": { accept: "ACCEPT", caution: "RENEGOTIATE", reject: "DO NOT ACCEPT WITHOUT PRICE ADJUSTMENT" },
 "hvac": { accept: "MARGIN SAFE", caution: "TIGHT MARGIN", reject: "REBID REQUIRED" },
 "electrical-contracting": { accept: "BID ACCEPTED", caution: "REPRICE REQUIRED", reject: "REJECT" },
 "plumbing": { accept: "JOB SAFE", caution: "CALLBACK RISK", reject: "REPRICE REQUIRED" },
 "roofing": { accept: "CONTRACT SAFE", caution: "WEATHER RISK", reject: "REBID REQUIRED" },
 "painting": { accept: "JOB PROFITABLE", caution: "PREP RISK", reject: "REPRICE REQUIRED" },
 "cleaning": { accept: "SAFE BID", caution: "LOW MARGIN", reject: "UNDERPRICED" },
 "landscaping-lawn-care": { accept: "CONTRACT SAFE", caution: "LOW MARGIN", reject: "UNDERPRICED" },
 "auto-repair-shop": { accept: "JOB PROFITABLE", caution: "COMEBACK RISK", reject: "REJECT OR REPRICE" },
 "restaurant": { accept: "PROFITABLE", caution: "LEAKING PROFIT", reject: "REMOVE OR REPRICE" },
 "ecommerce": { accept: "SCALABLE", caution: "FRAGILE", reject: "LOSS AFTER RETURNS" },
 "printing-signage": { accept: "SAFE PRICE", caution: "DESIGN RISK", reject: "DO NOT ACCEPT" },
 "carpentry-millwork": { accept: "BID SAFE", caution: "WASTE RISK", reject: "REPRICE REQUIRED" },
 "logistics-transport": { accept: "LOAD PROFITABLE", caution: "EMPTY RISK", reject: "REPRICE REQUIRED" },
 "agriculture-crops": { accept: "YIELD SAFE", caution: "FERTILIZER RISK", reject: "RECALCULATE" },
 "agriculture-irrigation": { accept: "WATER EFFICIENT", caution: "PUMP RISK", reject: "REASSESS" },
 "agriculture-feed": { accept: "FEED EFFICIENT", caution: "STORAGE RISK", reject: "RECALCULATE" },
 "agriculture-dairy": { accept: "YIELD PROFITABLE", caution: "FEED COST RISK", reject: "REASSESS" },
 "energy-consumption": { accept: "CONSUMPTION OK", caution: "DEMAND RISK", reject: "OPTIMIZE REQUIRED" },
 "energy-carbon": { accept: "COMPLIANT", caution: "BORDER COST RISK", reject: "RECALCULATE" },
 "daily-renovation": { accept: "BUDGET SAFE", caution: "DELAY RISK", reject: "REBUDGET REQUIRED" },
 "daily-fuel": { accept: "TRIP AFFORDABLE", caution: "FUEL RISK", reject: "RECALCULATE" },
 "daily-meals": { accept: "BUDGET OK", caution: "WASTE RISK", reject: "ADJUST PORTIONS" },
};

// ---------------------------------------------------------------------------
// NAIVE COST CALCULATORS (pure functions)
// ---------------------------------------------------------------------------

export const NAIVE_COST_CALCULATORS: Record<string, (inputs: MarginCoreInputValues) => number> = {
 // ── Heavy Industry ──────────────────────────────────────────────────
 "cnc-manufacturing": (inputs) => {
 const setup = num(inputs, "setupTime");
 const cycle = num(inputs, "cycleTime");
 const qty = num(inputs, "quantity", 1);
 const toolCost = num(inputs, "toolCost");
 const matCost = num(inputs, "materialCost");
 const machineRate = num(inputs, "machineRate", 75);
 const machineHours = (setup + cycle * qty) / 60;
 return machineHours * machineRate + matCost + toolCost;
 },

 "welding-fabrication": (inputs) => {
 const weldTime = num(inputs, "weldTime");
 const prepTime = num(inputs, "prepTime");
 const laborRate = num(inputs, "laborRate", 55);
 const consumable = num(inputs, "consumableCost");
 const material = num(inputs, "materialCost");
 return ((weldTime + prepTime) / 60) * laborRate + consumable + material;
 },

 "sheet-metal": (inputs) => {
 const cutTime = num(inputs, "cutTime");
 const bendTime = num(inputs, "bendTime");
 const setupTime = num(inputs, "setupTime");
 const machineRate = num(inputs, "machineRate", 85);
 const material = num(inputs, "materialCost");
 return ((cutTime + bendTime + setupTime) / 60) * machineRate + material;
 },

 "3d-printing-service": (inputs) => {
 const printTime = num(inputs, "printTime");
 const postProcess = num(inputs, "postProcessTime");
 const machineRate = num(inputs, "machineRate", 25);
 const material = num(inputs, "materialCost");
 return ((printTime + postProcess) / 60) * machineRate + material;
 },

 // ── Building Trades ─────────────────────────────────────────────────
 "construction": (inputs) => {
 const budget = num(inputs, "originalBudget");
 const changeEst = num(inputs, "changeEstimate");
 const delayDays = num(inputs, "delayDays");
 const crewCost = num(inputs, "crewCostPerDay", 500);
 return budget + changeEst + delayDays * crewCost;
 },

 "hvac": (inputs) => {
 const equipCost = num(inputs, "equipmentCost");
 const laborHours = num(inputs, "laborHours");
 const laborRate = num(inputs, "laborRate", 65);
 const ductCost = num(inputs, "ductworkCost");
 const refrigerant = num(inputs, "refrigerantCost");
 return equipCost + laborHours * laborRate + ductCost + refrigerant;
 },

 "electrical-contracting": (inputs) => {
 const material = num(inputs, "materialCost");
 const laborHours = num(inputs, "laborHours");
 const laborRate = num(inputs, "laborRate", 70);
 const testing = num(inputs, "testingHours");
 const panelCost = num(inputs, "panelCost");
 return material + (laborHours + testing) * laborRate + panelCost;
 },

 "plumbing": (inputs) => {
 const parts = num(inputs, "partsCost");
 const laborHours = num(inputs, "laborHours");
 const laborRate = num(inputs, "laborRate", 60);
 const fixtureCount = num(inputs, "fixtureCount", 1);
 const fixtureTime = num(inputs, "fixtureTime", 45);
 return parts + (laborHours + (fixtureCount * fixtureTime) / 60) * laborRate;
 },

 "roofing": (inputs) => {
 const material = num(inputs, "materialCost");
 const tearOff = num(inputs, "tearOffCost");
 const laborHours = num(inputs, "laborHours");
 const laborRate = num(inputs, "laborRate", 55);
 const dumpFee = num(inputs, "dumpFee");
 return material + tearOff + laborHours * laborRate + dumpFee;
 },

 "painting": (inputs) => {
 const area = num(inputs, "areaSize");
 const prepHours = num(inputs, "prepHours");
 const paintCost = num(inputs, "paintCost");
 const laborRate = num(inputs, "laborRate", 50);
 const scaffoldCost = num(inputs, "scaffoldCost");
 const paintHours = area / 200;
 return paintCost + (prepHours + paintHours) * laborRate + scaffoldCost;
 },

 // ── Field Services ──────────────────────────────────────────────────
 "cleaning": (inputs) => {
 const hoursPerVisit = num(inputs, "hoursPerVisit");
 const visitFreq = num(inputs, "visitFrequency", 4);
 const laborRate = num(inputs, "laborRate", 22);
 const supplyCost = num(inputs, "supplyCost", 50);
 const staffCount = num(inputs, "staffCount", 1);
 return hoursPerVisit * visitFreq * laborRate * staffCount + supplyCost;
 },

 "landscaping-lawn-care": (inputs) => {
 const area = num(inputs, "areaSize");
 const crewHours = num(inputs, "crewHours");
 const laborRate = num(inputs, "laborRate", 25);
 const fuelCost = num(inputs, "fuelCost", 40);
 const equipCost = num(inputs, "equipmentCost", 30);
 const visits = num(inputs, "visitFrequency", 4);
 return (crewHours * laborRate + fuelCost + equipCost) * visits;
 },

 "auto-repair-shop": (inputs) => {
 const diagTime = num(inputs, "diagnosticTime");
 const repairTime = num(inputs, "repairTime");
 const laborRate = num(inputs, "laborRate", 95);
 const partsCost = num(inputs, "partsCost");
 return ((diagTime + repairTime) / 60) * laborRate + partsCost;
 },

 // ── Food & Retail ───────────────────────────────────────────────────
 "restaurant": (inputs) => {
 const ingredient = num(inputs, "ingredientCost");
 const wasteRate = num(inputs, "wasteRate", 5) / 100;
 const labor = num(inputs, "laborCostPerItem");
 const commission = num(inputs, "deliveryCommission", 0) / 100 * num(inputs, "menuPrice", 0);
 return ingredient * (1 + wasteRate) + labor + commission;
 },

 "ecommerce": (inputs) => {
 const productCost = num(inputs, "productCost");
 const shipping = num(inputs, "shippingCost");
 const adCost = num(inputs, "adCostPerSale");
 const returnRate = num(inputs, "returnRate", 5) / 100;
 const price = num(inputs, "productPrice", 0);
 const returnLoss = price * returnRate;
 return productCost + shipping + adCost + returnLoss;
 },

 // ── Custom Manufacturing ────────────────────────────────────────────
 "printing-signage": (inputs) => {
 const designTime = num(inputs, "designTime");
 const printTime = num(inputs, "printTime");
 const installTime = num(inputs, "installTime");
 const laborRate = num(inputs, "laborRate", 45);
 const material = num(inputs, "materialCost");
 return (designTime + printTime + installTime) * laborRate / 60 + material;
 },

 "carpentry-millwork": (inputs) => {
 const material = num(inputs, "materialCost");
 const cutTime = num(inputs, "cutTime");
 const assemblyTime = num(inputs, "assemblyTime");
 const finishTime = num(inputs, "finishTime");
 const installTime = num(inputs, "installTime");
 const laborRate = num(inputs, "laborRate", 55);
 const wasteRate = num(inputs, "wasteRate", 8) / 100;
 return material * (1 + wasteRate) + (cutTime + assemblyTime + finishTime + installTime) * laborRate / 60;
 },

 // ── Logistics ───────────────────────────────────────────────────────
 "logistics-transport": (inputs) => {
 const distance = num(inputs, "distance");
 const fuelCost = num(inputs, "fuelCostPerKm", 0.55);
 const driverHours = num(inputs, "driverHours");
 const driverRate = num(inputs, "driverRate", 28);
 const tollCost = num(inputs, "tollCost");
 const emptyReturnPct = num(inputs, "emptyReturnPercent", 20) / 100;
 return distance * fuelCost * (1 + emptyReturnPct) + driverHours * driverRate + tollCost;
 },

 // ── Agriculture ─────────────────────────────────────────────────────
 "agriculture-crops": (inputs) => {
 const area = num(inputs, "areaSize");
 const fertilizerCost = num(inputs, "fertilizerCost");
 const seedCost = num(inputs, "seedCost");
 const laborCost = num(inputs, "laborCost");
 const pesticide = num(inputs, "pesticideCost");
 return fertilizerCost + seedCost + laborCost + pesticide;
 },

 "agriculture-irrigation": (inputs) => {
 const pumpingHours = num(inputs, "pumpingHours");
 const energyRate = num(inputs, "energyRate", 0.12);
 const pumpPower = num(inputs, "pumpPowerKw", 5);
 const maintenance = num(inputs, "maintenanceCost");
 const waterCost = num(inputs, "waterCost");
 return pumpingHours * pumpPower * energyRate + maintenance + waterCost;
 },

 "agriculture-feed": (inputs) => {
 const feedQty = num(inputs, "feedQuantity");
 const feedPrice = num(inputs, "feedPricePerTon");
 const storageLoss = num(inputs, "storageLossRate", 5) / 100;
 const transport = num(inputs, "transportCost");
 return feedQty * feedPrice * (1 + storageLoss) + transport;
 },

 "agriculture-dairy": (inputs) => {
 const herdSize = num(inputs, "herdSize");
 const feedCostPerCow = num(inputs, "feedCostPerCow");
 const vetCost = num(inputs, "vetCost");
 const laborCost = num(inputs, "laborCost");
 const cullRate = num(inputs, "cullRate", 8) / 100;
 const cowValue = num(inputs, "cowValue", 2000);
 return herdSize * feedCostPerCow + vetCost + laborCost + herdSize * cullRate * cowValue;
 },

 // ── Energy ──────────────────────────────────────────────────────────
 "energy-consumption": (inputs) => {
 const kwh = num(inputs, "kwhConsumption");
 const rate = num(inputs, "kwhRate", 0.12);
 const demandCharge = num(inputs, "demandCharge");
 const peakKwh = num(inputs, "peakKwh");
 const peakRate = num(inputs, "peakRate", 0.18);
 return kwh * rate + demandCharge + peakKwh * peakRate;
 },

 "energy-carbon": (inputs) => {
 const emissions = num(inputs, "emissionsTons");
 const carbonPrice = num(inputs, "carbonPricePerTon", 85);
 const auditCost = num(inputs, "auditCost", 5000);
 const verificationCost = num(inputs, "verificationCost", 3000);
 return emissions * carbonPrice + auditCost + verificationCost;
 },

 // ── Daily Life ──────────────────────────────────────────────────────
 "daily-renovation": (inputs) => {
 const material = num(inputs, "materialCost");
 const laborDays = num(inputs, "laborDays");
 const laborRate = num(inputs, "laborRate", 300);
 const permitCost = num(inputs, "permitCost");
 const contingency = num(inputs, "contingency", 10) / 100;
 return (material + laborDays * laborRate + permitCost) * (1 + contingency);
 },

 "daily-fuel": (inputs) => {
 const distance = num(inputs, "distance");
 const consumption = num(inputs, "fuelConsumption", 8);
 const fuelPrice = num(inputs, "fuelPrice", 1.50);
 const tollCost = num(inputs, "tollCost");
 return (distance / 100) * consumption * fuelPrice + tollCost;
 },

 "daily-meals": (inputs) => {
 const ingredientCost = num(inputs, "ingredientCost");
 const wasteRate = num(inputs, "wasteRate", 10) / 100;
 return ingredientCost * (1 + wasteRate);
 },
};

// ---------------------------------------------------------------------------
// MARGIN LEAK DETECTORS (sector-specific diagnostics)
// ---------------------------------------------------------------------------

export const MARGIN_LEAK_DETECTORS: Record<
 string,
 (inputs: MarginCoreInputValues, naiveCost: number) => MarginLeakItem[]
> = {
 // ── Heavy Industry ──────────────────────────────────────────────────
 "cnc-manufacturing": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const setup = num(inputs, "setupTime");
 const cycle = num(inputs, "cycleTime");
 const qty = num(inputs, "quantity", 1);
 if (setup > cycle * qty * 0.5) {
 leaks.push({
 driver: "Setup-dominated batch",
 leakAmount: setup / 60 * 75 * 0.3,
 severity: "high",
 suggestedAction: "Increase batch size or negotiate setup surcharge.",
 });
 }
 const toolCost = num(inputs, "toolCost");
 if (toolCost > naiveCost * 0.15) {
 leaks.push({
 driver: "Tooling wear",
 leakAmount: toolCost * 0.2,
 severity: "medium",
 suggestedAction: "Factor tool replacement into per-part cost.",
 });
 }
 return leaks;
 },

 "welding-fabrication": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const rework = num(inputs, "reworkPercent", 0);
 if (rework > 5) {
 leaks.push({
 driver: "Rework rate",
 leakAmount: naiveCost * rework / 100,
 severity: rework > 15 ? "critical" : "high",
 suggestedAction: "Improve fit-up process; add rework contingency to bid.",
 });
 }
 const consumable = num(inputs, "consumableCost");
 if (consumable > naiveCost * 0.12) {
 leaks.push({
 driver: "Consumable waste",
 leakAmount: consumable * 0.15,
 severity: "medium",
 suggestedAction: "Track filler metal usage per joint type.",
 });
 }
 return leaks;
 },

 "sheet-metal": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const scrap = num(inputs, "scrapRate", 0);
 if (scrap > 8) {
 leaks.push({
 driver: "High scrap rate",
 leakAmount: naiveCost * scrap / 100 * 0.8,
 severity: scrap > 15 ? "critical" : "high",
 suggestedAction: "Optimize nesting; negotiate scrap credit with supplier.",
 });
 }
 return leaks;
 },

 "3d-printing-service": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const failRate = num(inputs, "failureRate", 0);
 if (failRate > 5) {
 leaks.push({
 driver: "Print failure rate",
 leakAmount: naiveCost * failRate / 100,
 severity: failRate > 15 ? "critical" : "high",
 suggestedAction: "Factor reprint cost into quote; improve bed adhesion.",
 });
 }
 const postProcess = num(inputs, "postProcessTime", 0);
 if (postProcess > num(inputs, "printTime", 1) * 0.3) {
 leaks.push({
 driver: "Post-processing overhead",
 leakAmount: postProcess / 60 * 25 * 0.5,
 severity: "medium",
 suggestedAction: "Optimize support structures to reduce post-processing.",
 });
 }
 return leaks;
 },

 // ── Building Trades ─────────────────────────────────────────────────
 "construction": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const changeEst = num(inputs, "changeEstimate");
 const budget = num(inputs, "originalBudget", 1);
 if (changeEst > budget * 0.1) {
 leaks.push({
 driver: "Change order creep",
 leakAmount: changeEst * 0.15,
 severity: "high",
 suggestedAction: "Pre-price common change orders; add escalation clause.",
 });
 }
 const delayDays = num(inputs, "delayDays");
 if (delayDays > 3) {
 leaks.push({
 driver: "Weather/schedule delay",
 leakAmount: delayDays * num(inputs, "crewCostPerDay", 500),
 severity: delayDays > 10 ? "critical" : "high",
 suggestedAction: "Add weather contingency clause to contract.",
 });
 }
 return leaks;
 },

 "hvac": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const callback = num(inputs, "callbackRisk", 0);
 if (callback > 10) {
 leaks.push({
 driver: "Callback risk",
 leakAmount: naiveCost * callback / 100 * 0.5,
 severity: callback > 20 ? "critical" : "high",
 suggestedAction: "Improve commissioning checklist; add warranty reserve.",
 });
 }
 return leaks;
 },

 "electrical-contracting": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const material = num(inputs, "materialCost");
 if (material > naiveCost * 0.55) {
 leaks.push({
 driver: "Material escalation exposure",
 leakAmount: material * 0.08,
 severity: "high",
 suggestedAction: "Lock material pricing; add escalation clause.",
 });
 }
 return leaks;
 },

 "plumbing": (inputs, _naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const fixtures = num(inputs, "fixtureCount", 1);
 if (fixtures > 10) {
 leaks.push({
 driver: "Fixture complexity",
 leakAmount: fixtures * 45 * 0.3,
 severity: "medium",
 suggestedAction: "Add per-fixture complexity surcharge for high-count jobs.",
 });
 }
 return leaks;
 },

 "roofing": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const tearOff = num(inputs, "tearOffCost");
 if (tearOff > naiveCost * 0.2) {
 leaks.push({
 driver: "Tear-off surprise",
 leakAmount: tearOff * 0.2,
 severity: "high",
 suggestedAction: "Inspect deck condition before bid; add tear-off contingency.",
 });
 }
 return leaks;
 },

 "painting": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const prep = num(inputs, "prepHours", 0);
 const totalHours = prep + num(inputs, "areaSize", 0) / 200;
 if (prep > totalHours * 0.4) {
 leaks.push({
 driver: "Prep time overrun",
 leakAmount: prep * num(inputs, "laborRate", 50) * 0.3,
 severity: "high",
 suggestedAction: "Assess surface condition before quoting; add prep contingency.",
 });
 }
 return leaks;
 },

 // ── Field Services ──────────────────────────────────────────────────
 "cleaning": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const turnover = num(inputs, "staffTurnoverRate", 0);
 if (turnover > 20) {
 leaks.push({
 driver: "Staff turnover",
 leakAmount: naiveCost * 0.08,
 severity: turnover > 40 ? "critical" : "high",
 suggestedAction: "Add recruitment/training cost into contract pricing.",
 });
 }
 return leaks;
 },

 "landscaping-lawn-care": (inputs, _naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const fuel = num(inputs, "fuelCost", 0);
 if (fuel > _naiveCost * 0.15) {
 leaks.push({
 driver: "Fuel cost variance",
 leakAmount: fuel * 0.2,
 severity: "medium",
 suggestedAction: "Add fuel surcharge clause to monthly contracts.",
 });
 }
 return leaks;
 },

 "auto-repair-shop": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const diag = num(inputs, "diagnosticTime", 0);
 const repair = num(inputs, "repairTime", 1);
 if (diag > repair * 0.3) {
 leaks.push({
 driver: "Diagnostic time leak",
 leakAmount: diag / 60 * num(inputs, "laborRate", 95) * 0.4,
 severity: "medium",
 suggestedAction: "Charge flat diagnostic fee; invest in scan tooling.",
 });
 }
 const comeback = num(inputs, "comebackRate", 0);
 if (comeback > 5) {
 leaks.push({
 driver: "Comeback/warranty risk",
 leakAmount: naiveCost * comeback / 100,
 severity: comeback > 12 ? "critical" : "high",
 suggestedAction: "Improve QA checklist; add warranty reserve.",
 });
 }
 return leaks;
 },

 // ── Food & Retail ───────────────────────────────────────────────────
 "restaurant": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const waste = num(inputs, "wasteRate", 5);
 if (waste > 8) {
 leaks.push({
 driver: "Food waste",
 leakAmount: naiveCost * waste / 100 * 0.6,
 severity: waste > 15 ? "critical" : "high",
 suggestedAction: "Implement FIFO; reduce portion variability.",
 });
 }
 const commission = num(inputs, "deliveryCommission", 0);
 if (commission > 20) {
 leaks.push({
 driver: "Delivery commission drain",
 leakAmount: num(inputs, "menuPrice", 0) * commission / 100 * 0.3,
 severity: "high",
 suggestedAction: "Raise delivery platform prices; promote direct ordering.",
 });
 }
 return leaks;
 },

 "ecommerce": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const returnRate = num(inputs, "returnRate", 5);
 if (returnRate > 10) {
 leaks.push({
 driver: "Return erosion",
 leakAmount: num(inputs, "productPrice", 0) * returnRate / 100,
 severity: returnRate > 25 ? "critical" : "high",
 suggestedAction: "Improve product descriptions; add restocking fee.",
 });
 }
 const adCost = num(inputs, "adCostPerSale", 0);
 const price = num(inputs, "productPrice", 1);
 if (adCost > price * 0.2) {
 leaks.push({
 driver: "Ad cost overspend",
 leakAmount: adCost * 0.3,
 severity: "high",
 suggestedAction: "Optimize ROAS; test organic channels.",
 });
 }
 return leaks;
 },

 // ── Custom Manufacturing ────────────────────────────────────────────
"printing-signage": (inputs) => {
const leaks: MarginLeakItem[] = [];
 const designTime = num(inputs, "designTime", 0);
 if (designTime > 120) {
 leaks.push({
 driver: "Design time overrun",
 leakAmount: (designTime - 120) / 60 * num(inputs, "laborRate", 45),
 severity: "medium",
 suggestedAction: "Cap included design revisions; charge for extras.",
 });
 }
 return leaks;
 },

"carpentry-millwork": (inputs) => {
const leaks: MarginLeakItem[] = [];
 const wasteRate = num(inputs, "wasteRate", 8);
 if (wasteRate > 12) {
 leaks.push({
 driver: "Material waste",
 leakAmount: num(inputs, "materialCost", 0) * wasteRate / 100 * 0.5,
 severity: wasteRate > 20 ? "critical" : "high",
 suggestedAction: "Optimize cut lists; use offcut tracking.",
 });
 }
 return leaks;
 },

 // ── Logistics ───────────────────────────────────────────────────────
 "logistics-transport": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const emptyPct = num(inputs, "emptyReturnPercent", 20);
 if (emptyPct > 15) {
 leaks.push({
 driver: "Empty return miles",
 leakAmount: naiveCost * emptyPct / 100 * 0.7,
 severity: emptyPct > 30 ? "critical" : "high",
 suggestedAction: "Source backhaul loads; factor empty miles into rate.",
 });
 }
 return leaks;
 },

 // ── Agriculture ─────────────────────────────────────────────────────
 "agriculture-crops": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const fertilizer = num(inputs, "fertilizerCost", 0);
 if (fertilizer > naiveCost * 0.35) {
 leaks.push({
 driver: "Fertilizer over-application",
 leakAmount: fertilizer * 0.15,
 severity: "medium",
 suggestedAction: "Soil test before application; precision farming.",
 });
 }
 return leaks;
 },

 "agriculture-irrigation": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const efficiency = num(inputs, "systemEfficiency", 80);
 if (efficiency < 75) {
 leaks.push({
 driver: "Irrigation efficiency loss",
 leakAmount: naiveCost * (100 - efficiency) / 100 * 0.3,
 severity: efficiency < 60 ? "critical" : "high",
 suggestedAction: "Upgrade to drip/smart irrigation; leak detection.",
 });
 }
 return leaks;
 },

 "agriculture-feed": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const storageLoss = num(inputs, "storageLossRate", 5);
 if (storageLoss > 5) {
 leaks.push({
 driver: "Feed storage loss",
 leakAmount: naiveCost * storageLoss / 100 * 0.8,
 severity: storageLoss > 10 ? "critical" : "high",
 suggestedAction: "Improve storage conditions; FIFO rotation.",
 });
 }
 return leaks;
 },

 "agriculture-dairy": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const feedCost = num(inputs, "feedCostPerCow", 0);
 const herd = num(inputs, "herdSize", 1);
 if (feedCost * herd > naiveCost * 0.6) {
 leaks.push({
 driver: "Feed cost ratio",
 leakAmount: feedCost * herd * 0.1,
 severity: "high",
 suggestedAction: "Optimize feed mix; negotiate bulk pricing.",
 });
 }
 return leaks;
 },

 // ── Energy ──────────────────────────────────────────────────────────
"energy-consumption": (inputs) => {
const leaks: MarginLeakItem[] = [];
 const peak = num(inputs, "peakKwh", 0);
 const total = num(inputs, "kwhConsumption", 1);
 if (peak > total * 0.25) {
 leaks.push({
 driver: "Peak demand charges",
 leakAmount: peak * num(inputs, "peakRate", 0.18) * 0.4,
 severity: "high",
 suggestedAction: "Shift loads to off-peak; install demand management.",
 });
 }
 return leaks;
 },

 "energy-carbon": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const emissions = num(inputs, "emissionsTons", 0);
 if (emissions > 100) {
 leaks.push({
 driver: "Scope 3 data gap",
 leakAmount: naiveCost * 0.1,
 severity: "medium",
 suggestedAction: "Map full supply chain emissions; engage suppliers.",
 });
 }
 return leaks;
 },

 // ── Daily Life ──────────────────────────────────────────────────────
 "daily-renovation": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const contingency = num(inputs, "contingency", 10);
 if (contingency < 10) {
 leaks.push({
 driver: "Insufficient contingency",
 leakAmount: naiveCost * 0.08,
 severity: "medium",
 suggestedAction: "Minimum 15% contingency for renovations over $10K.",
 });
 }
 return leaks;
 },

 "daily-fuel": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const consumption = num(inputs, "fuelConsumption", 8);
 if (consumption > 10) {
 leaks.push({
 driver: "High consumption vehicle",
 leakAmount: naiveCost * 0.15,
 severity: "medium",
 suggestedAction: "Consider more efficient vehicle or route optimization.",
 });
 }
 return leaks;
 },

 "daily-meals": (inputs, naiveCost) => {
 const leaks: MarginLeakItem[] = [];
 const waste = num(inputs, "wasteRate", 10);
 if (waste > 12) {
 leaks.push({
 driver: "Food waste",
 leakAmount: naiveCost * waste / 100 * 0.5,
 severity: waste > 20 ? "high" : "medium",
 suggestedAction: "Plan portions; use FIFO; freeze surplus.",
 });
 }
 return leaks;
 },
};

/** Get naive cost calculator for a sector */
export function getNaiveCostCalculator(sectorSlug: string): (inputs: MarginCoreInputValues) => number {
 return NAIVE_COST_CALCULATORS[sectorSlug] ?? ((inputs) => {
 // Fallback: sum all numeric inputs that look like costs
 let total = 0;
 for (const [key, val] of Object.entries(inputs)) {
 if (typeof val === "number" && /cost|price|fee|rate|overhead/i.test(key)) {
 total += val;
 }
 }
 return total || 100;
 });
}

/** Get margin leak detector for a sector */
export function getMarginLeakDetector(
 sectorSlug: string,
): (inputs: MarginCoreInputValues, naiveCost: number) => MarginLeakItem[] {
 return MARGIN_LEAK_DETECTORS[sectorSlug] ?? (() => []);
}

/** Get verdict labels for a sector */
export function getVerdictLabels(sectorSlug: string): { accept: string; caution: string; reject: string } {
 return VERDICT_LABELS[sectorSlug] ?? { accept: "SAFE", caution: "CAUTION", reject: "REJECT" };
}