import type { RevenueTool } from "@/lib/features/tools/revenue-tools";

export type FreeRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type FreeToolInputValues = Record<string, number | string>;

/** @deprecated Use FreeToolInputValues */
export type FreeToolFormValues = FreeToolInputValues;

export type FreeToolResult = {
  riskLevel: FreeRiskLevel;
  headline: string;
  summary: string;
  missingFactors: string[];
  ctaLabel: string;
};

function getNumber(values: FreeToolInputValues, key: string): number {
  const raw = values[key];

  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : 0;
  }

  if (typeof raw === "string") {
    const parsed = Number(raw.replace(/,/g, "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function getString(values: FreeToolInputValues, key: string): string {
  const raw = values[key];
  return typeof raw === "string" ? raw : String(raw ?? "");
}

function formatCurrency(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

// ─── Calculator registry - one formula per revenue free slug ─────────

type CalculatorFn = (
  values: FreeToolInputValues,
) => { headline: string; summary: string; riskLevel: FreeRiskLevel };

const CALCULATOR_REGISTRY: Record<string, CalculatorFn> = {
  // ── Welding ──
  "welding-cost-estimator": (values) => {
    const materialCost = getNumber(values, "materialCost");
    const laborHours = getNumber(values, "laborHours");
    const laborRate = getNumber(values, "laborRate");
    const fitUpHours = getNumber(values, "fitUpHours");
    const visibleLabor = (laborHours + fitUpHours) * laborRate;
    const totalVisible = materialCost + visibleLabor;
    const hourlyBurden = laborHours > 0 ? totalVisible / laborHours : 0;
    const risk: FreeRiskLevel = hourlyBurden > 150 ? "HIGH" : hourlyBurden > 90 ? "MEDIUM" : "LOW";
    return {
      headline: risk === "HIGH" ? "High cost exposure - review fit-up and labor" : "Visible cost within typical range",
      summary: formatCurrency(totalVisible),
      riskLevel: risk,
    };
  },

  // ── HVAC ──
  "hvac-tonnage-rule-check": (values) => {
    const sqft = getNumber(values, "squareFootage");
    const tonnage = getNumber(values, "tonnage");
    const sqftPerTon = tonnage > 0 ? sqft / tonnage : 0;
    const normalLow = 400;
    const normalHigh = 600;
    const risk: FreeRiskLevel =
      sqftPerTon < normalLow - 50 || sqftPerTon > normalHigh + 50
        ? "HIGH"
        : sqftPerTon < normalLow || sqftPerTon > normalHigh
          ? "MEDIUM"
          : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Tonnage-to-area ratio outside typical range - sizing risk"
          : risk === "MEDIUM"
            ? "Tonnage-to-area ratio near boundary - review load calc"
            : "Tonnage-to-area ratio within normal range (400-600 sqft/ton)",
      summary: formatNumber(sqftPerTon, 0) + " sqft/ton",
      riskLevel: risk,
    };
  },

  // ── Electrical ──
  "electrical-labor-estimator": (values) => {
    const materialCost = getNumber(values, "materialCost");
    const laborHours = getNumber(values, "laborHours");
    const laborRate = getNumber(values, "laborRate");
    const totalLabor = laborHours * laborRate;
    const totalVisible = materialCost + totalLabor;
    const laborRatio = totalVisible > 0 ? totalLabor / totalVisible : 0;
    const risk: FreeRiskLevel = laborRatio > 0.6 ? "MEDIUM" : "LOW";
    return {
      headline: risk === "MEDIUM" ? "Labor dominates estimate - verify against panel schedule" : "Labor-to-material ratio within typical range",
      summary: formatCurrency(totalVisible),
      riskLevel: risk,
    };
  },

  // ── Lawn Care ──
  "lawn-care-cost-check": (values) => {
    const crewHours = getNumber(values, "crewHoursPerVisit");
    const visits = getNumber(values, "visitsPerMonth");
    const laborRate = getNumber(values, "laborRate");
    const totalMonthlyLabor = crewHours * visits * laborRate;
    const risk: FreeRiskLevel = totalMonthlyLabor > 5000 ? "HIGH" : totalMonthlyLabor > 2000 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "High monthly labor cost - review crew efficiency"
          : risk === "MEDIUM"
            ? "Moderate monthly labor cost"
            : "Monthly labor cost within efficient range",
      summary: formatCurrency(totalMonthlyLabor) + "/month",
      riskLevel: risk,
    };
  },

  // ── Repair Time vs Price ──
  "repair-time-vs-price-check": (values) => {
    const quotedPrice = getNumber(values, "quotedPrice");
    const repairHours = getNumber(values, "repairHours");
    const partsCost = getNumber(values, "partsCost");
    const effectiveLaborRate = repairHours > 0 ? (quotedPrice - partsCost) / repairHours : 0;
    const risk: FreeRiskLevel =
      effectiveLaborRate < 50
        ? "HIGH"
        : effectiveLaborRate < 100
          ? "MEDIUM"
          : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Effective labor rate is very low - quoted price may be too tight"
          : risk === "MEDIUM"
            ? "Effective labor rate is moderate - review shop minimum"
            : "Effective labor rate in normal range",
      summary: formatCurrency(effectiveLaborRate) + "/hr effective",
      riskLevel: risk,
    };
  },

  // ── Print Job ──
  "print-job-cost-check": (values) => {
    const materialCost = getNumber(values, "materialCost");
    const designHours = getNumber(values, "designHours");
    const laborRate = getNumber(values, "laborRate");
    const totalVisible = materialCost + designHours * laborRate;
    const designRatio = totalVisible > 0 ? designHours * laborRate / totalVisible : 0;
    const risk: FreeRiskLevel = designRatio > 0.5 ? "MEDIUM" : "LOW";
    return {
      headline: risk === "MEDIUM" ? "Design time is a large share - consider fixed-price risk" : "Design and material balance within typical range",
      summary: formatCurrency(totalVisible),
      riskLevel: risk,
    };
  },

  // ── Plumbing Fixture ──
  "plumbing-fixture-cost-check": (values) => {
    const fixtureCount = getNumber(values, "fixtureCount");
    const unitMaterialCost = getNumber(values, "unitMaterialCost");
    const laborHoursPerFixture = getNumber(values, "laborHoursPerFixture");
    const laborRate = getNumber(values, "laborRate");
    const overheadPct = getNumber(values, "overheadPct");
    const totalMaterial = fixtureCount * unitMaterialCost;
    const totalLabor = fixtureCount * laborHoursPerFixture * laborRate;
    const overhead = (totalMaterial + totalLabor) * (overheadPct / 100);
    const totalVisible = totalMaterial + totalLabor + overhead;
    const costPerFixture = fixtureCount > 0 ? totalVisible / fixtureCount : 0;
    const risk: FreeRiskLevel = costPerFixture > 2000 ? "HIGH" : costPerFixture > 1000 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Per-fixture cost is high - review material spec and labor efficiency"
          : risk === "MEDIUM"
            ? "Per-fixture cost is moderate"
            : "Per-fixture cost within typical range",
      summary: formatCurrency(totalVisible) + " (" + formatCurrency(costPerFixture) + "/fixture)",
      riskLevel: risk,
    };
  },

  // ── Cabinet / Millwork ──
  "cabinet-cost-estimator": (values) => {
    const sheetMaterialCost = getNumber(values, "sheetMaterialCost");
    const laborHours = getNumber(values, "laborHours");
    const installHours = getNumber(values, "installHours");
    const assumedRate = 50;
    const totalLabor = (laborHours + installHours) * assumedRate;
    const totalVisible = sheetMaterialCost + totalLabor;
    const laborRatio = totalVisible > 0 ? totalLabor / totalVisible : 0;
    const risk: FreeRiskLevel = laborRatio > 0.65 ? "MEDIUM" : "LOW";
    return {
      headline: risk === "MEDIUM" ? "Labor dominates - verify shop and install hours" : "Material-to-labor ratio within typical range",
      summary: formatCurrency(totalVisible),
      riskLevel: risk,
    };
  },

  // ── Roofing ──
  "roofing-square-cost-check": (values) => {
    const materialCost = getNumber(values, "materialCost");
    const laborHours = getNumber(values, "laborHours");
    const laborRate = getNumber(values, "laborRate");
    const totalVisible = materialCost + laborHours * laborRate;
    const risk: FreeRiskLevel = totalVisible > 15000 ? "HIGH" : totalVisible > 7000 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "High visible cost - review material takeoff and crew size"
          : risk === "MEDIUM"
            ? "Moderate visible cost"
            : "Visible cost within typical range for residential roofing",
      summary: formatCurrency(totalVisible),
      riskLevel: risk,
    };
  },

  // ── Paint Coverage ──
  "paint-coverage-cost-check": (values) => {
    const area = getNumber(values, "paintableArea");
    const coverage = getNumber(values, "coveragePerUnit");
    const coats = getNumber(values, "coats");
    const unitPrice = getNumber(values, "unitPrice");
    const wastePct = getNumber(values, "wasteAllowancePct");
    const unitsPerCoat = coverage > 0 ? area / coverage : 0;
    const totalUnits = unitsPerCoat * coats * (1 + wastePct / 100);
    const totalCost = totalUnits * unitPrice;
    const costPerM2 = area > 0 ? totalCost / area : 0;
    const risk: FreeRiskLevel = costPerM2 > 8 ? "HIGH" : costPerM2 > 4 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Paint cost per m2 is high - review coverage spec and waste"
          : risk === "MEDIUM"
            ? "Paint cost per m2 is moderate"
            : "Paint cost per m2 within typical range",
      summary: formatCurrency(totalCost) + " (" + formatCurrency(costPerM2) + "/m2)",
      riskLevel: risk,
    };
  },

  // ── Laser Cutting ──
  "laser-cutting-time-check": (values) => {
    const setupTime = getNumber(values, "setupTime");
    const cutTime = getNumber(values, "cutTime");
    const quantity = Math.max(1, getNumber(values, "quantity"));
    const totalMinutes = setupTime + cutTime * quantity;
    const totalHours = totalMinutes / 60;
    const setupRatio = totalMinutes > 0 ? setupTime / totalMinutes : 0;
    const risk: FreeRiskLevel = setupRatio > 0.4 ? "HIGH" : setupRatio > 0.2 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Setup time dominates - consider batching similar parts"
          : risk === "MEDIUM"
            ? "Setup time is significant"
            : "Cut-to-setup ratio is efficient",
      summary: formatNumber(totalHours, 1) + " hr (" + formatNumber(totalMinutes, 0) + " min)",
      riskLevel: risk,
    };
  },

  // ── 3D Print ──
  "3d-print-cost-check": (values) => {
    const materialCost = getNumber(values, "materialCost");
    const printHours = getNumber(values, "printHours");
    const machineRate = getNumber(values, "machineRate");
    const totalVisible = materialCost + printHours * machineRate;
    const risk: FreeRiskLevel = totalVisible > 500 ? "HIGH" : totalVisible > 150 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "High print cost - review material usage and machine rate"
          : risk === "MEDIUM"
            ? "Moderate print cost"
            : "Print cost within typical range for custom parts",
      summary: formatCurrency(totalVisible),
      riskLevel: risk,
    };
  },

  // ── Desi / Volumetric Weight ──
  "desi-calculator": (values) => {
    const length = getNumber(values, "length");
    const width = getNumber(values, "width");
    const height = getNumber(values, "height");
    const quantity = Math.max(1, getNumber(values, "quantity"));
    const freightMode = getString(values, "freightMode");
    const divisor = freightMode === "air" ? 6000 : 3000;
    const volumetricWeight = (length * width * height) / divisor;
    const totalVolWeight = volumetricWeight * quantity;
    const bulky = volumetricWeight > 50;
    const modeLabel = freightMode === "air" ? "air" : "road";
    const risk: FreeRiskLevel = bulky ? "HIGH" : "LOW";
    return {
      headline: bulky
        ? "Volumetric weight is high - freight cost may exceed actual weight pricing"
        : "Volumetric weight within standard range",
      summary: formatNumber(totalVolWeight, 1) + " kg (volumetric, " + modeLabel + ")",
      riskLevel: risk,
    };
  },

  // ── Fertilizer Dosage ──
  "fertilizer-dosage-calculator": (values) => {
    const area = getNumber(values, "areaHectares");
    const nRate = getNumber(values, "nitrogenKgPerHa");
    const pRate = getNumber(values, "phosphorusKgPerHa");
    const kRate = getNumber(values, "potassiumKgPerHa");
    const totalN = area * nRate;
    const totalP = area * pRate;
    const totalK = area * kRate;
    const nRisk = nRate > 200;
    const risk: FreeRiskLevel = nRisk ? "HIGH" : "LOW";
    return {
      headline: nRisk
        ? "Nitrogen rate exceeds 200 kg/ha - over-fertilization risk"
        : "N-P-K load within typical agricultural range",
      summary: "N:" + formatNumber(totalN, 0) + "kg P:" + formatNumber(totalP, 0) + "kg K:" + formatNumber(totalK, 0) + "kg",
      riskLevel: risk,
    };
  },

  // ── Irrigation Cost ──
  "irrigation-cost-check": (values) => {
    const area = getNumber(values, "areaHectares");
    const pumpingHours = getNumber(values, "pumpingHours");
    const electricityRate = getNumber(values, "electricityRate");
    const pumpPowerKw = Math.max(0.1, getNumber(values, "pumpPowerKw"));
    const monthlyCost = pumpingHours * electricityRate * pumpPowerKw;
    const costPerHa = area > 0 ? monthlyCost / area : 0;
    const risk: FreeRiskLevel = costPerHa > 50 ? "MEDIUM" : "LOW";
    return {
      headline: risk === "MEDIUM" ? "Pumping cost per hectare is elevated - check pump efficiency" : "Pumping cost within typical range",
      summary: formatCurrency(monthlyCost) + "/month (" + formatCurrency(costPerHa) + "/ha)",
      riskLevel: risk,
    };
  },

  // ── Feed Cost ──
  "feed-cost-estimator": (values) => {
    const animalCount = Math.max(1, getNumber(values, "animalCount"));
    const dailyFeedKg = getNumber(values, "dailyFeedKg");
    const feedPricePerKg = getNumber(values, "feedPricePerKg");
    const dailyCost = animalCount * dailyFeedKg * feedPricePerKg;
    const monthlyCost = dailyCost * 30;
    const costPerHead = animalCount > 0 ? monthlyCost / animalCount : 0;
    const risk: FreeRiskLevel = costPerHead > 150 ? "HIGH" : costPerHead > 75 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Feed cost per head is high - review ration formulation"
          : risk === "MEDIUM"
            ? "Feed cost per head is moderate"
            : "Feed cost per head within typical range",
      summary: formatCurrency(monthlyCost) + "/month (" + formatCurrency(costPerHead) + "/head)",
      riskLevel: risk,
    };
  },

  // ── Milk Yield ──
  "milk-yield-check": (values) => {
    const cowCount = Math.max(1, getNumber(values, "cowCount"));
    const litersPerCow = getNumber(values, "litersPerCowPerDay");
    const milkPrice = getNumber(values, "milkPricePerLiter");
    const dailyRevenue = cowCount * litersPerCow * milkPrice;
    const monthlyRevenue = dailyRevenue * 30;
    const revenuePerCow = monthlyRevenue / cowCount;
    const risk: FreeRiskLevel = litersPerCow < 20 ? "HIGH" : litersPerCow < 28 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Yield below 20 L/cow/day - investigate herd health and feed quality"
          : risk === "MEDIUM"
            ? "Yield moderate - room for improvement"
            : "Yield within healthy range",
      summary: formatCurrency(monthlyRevenue) + "/month (" + formatNumber(litersPerCow, 1) + " L/cow/day)",
      riskLevel: risk,
    };
  },

  // ── kWh Consumption ──
  "kwh-consumption-check": (values) => {
    const powerKw = getNumber(values, "powerKw");
    const hoursPerDay = getNumber(values, "hoursPerDay");
    const days = getNumber(values, "days");
    const tariff = getNumber(values, "tariffPerKwh");
    const totalKwh = powerKw * hoursPerDay * days;
    const bill = totalKwh * tariff;
    const risk: FreeRiskLevel = bill > 10000 ? "HIGH" : bill > 3000 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Energy bill exceeds $10K - review load profile and demand charges"
          : risk === "MEDIUM"
            ? "Energy cost moderate - check for efficiency opportunities"
            : "Energy consumption within typical small-to-medium range",
      summary: formatNumber(totalKwh, 0) + " kWh (" + formatCurrency(bill) + ")",
      riskLevel: risk,
    };
  },

  // ── Carbon Footprint Quick ──
  "carbon-footprint-quick": (values) => {
    const productionTons = getNumber(values, "productionTons");
    const energySource = getString(values, "energySource");
    const facilityCount = Math.max(1, getNumber(values, "facilityCount"));
    const factors: Record<string, number> = {
      coal: 0.82,
      gas: 0.49,
      electricity: 0.41,
      renewable: 0.05,
    };
    const factor = factors[energySource] ?? 0.41;
    const totalCO2 = productionTons * factor * facilityCount;
    const risk: FreeRiskLevel = totalCO2 > 1000 ? "HIGH" : totalCO2 > 300 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "High estimated CO2 - review for CBAM exposure"
          : risk === "MEDIUM"
            ? "Moderate CO2 estimate"
            : "CO2 estimate within manageable range",
      summary: formatNumber(totalCO2, 0) + " tCO2",
      riskLevel: risk,
    };
  },

  // ── Home Renovation m2 ──
  "home-renovation-m2": (values) => {
    const area = getNumber(values, "areaM2");
    const unitCost = getNumber(values, "unitCostPerM2");
    const demolitionCost = getNumber(values, "demolitionCost");
    const contingencyPct = getNumber(values, "contingencyPct");
    const baseCost = area * unitCost + demolitionCost;
    const total = baseCost * (1 + contingencyPct / 100);
    const costPerM2 = area > 0 ? total / area : 0;
    const risk: FreeRiskLevel = costPerM2 > 3000 ? "HIGH" : costPerM2 > 1500 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Total cost per m2 is high - review material spec and scope"
          : risk === "MEDIUM"
            ? "Total cost per m2 is moderate"
            : "Total cost per m2 within typical range",
      summary: formatCurrency(total) + " (" + formatCurrency(costPerM2) + "/m2)",
      riskLevel: risk,
    };
  },

  // ── Fuel Consumption ──
  "fuel-consumption-check": (values) => {
    const distanceKm = getNumber(values, "distanceKm");
    const consumptionPer100Km = getNumber(values, "consumptionPer100Km");
    const fuelPricePerLiter = getNumber(values, "fuelPricePerLiter");
    const totalLiters = (distanceKm / 100) * consumptionPer100Km;
    const totalCost = totalLiters * fuelPricePerLiter;
    const costPerKm = distanceKm > 0 ? totalCost / distanceKm : 0;
    const risk: FreeRiskLevel = costPerKm > 0.3 ? "HIGH" : costPerKm > 0.15 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Fuel cost per km is high - check vehicle efficiency"
          : risk === "MEDIUM"
            ? "Fuel cost per km is moderate"
            : "Fuel cost per km within efficient range",
      summary: formatCurrency(totalCost) + " (" + formatCurrency(costPerKm) + "/km)",
      riskLevel: risk,
    };
  },

  // ── Recipe Cost ──
  "recipe-cost-check": (values) => {
    const servings = Math.max(1, getNumber(values, "servings"));
    const ingredientCost = getNumber(values, "ingredientCost");
    const targetPricePerServing = getNumber(values, "sellingPricePerServing");
    const costPerServing = ingredientCost / servings;
    const marginPct = targetPricePerServing > 0
      ? ((targetPricePerServing - costPerServing) / targetPricePerServing) * 100
      : 0;
    const risk: FreeRiskLevel = marginPct < 20 ? "HIGH" : marginPct < 40 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Margin below 20% - ingredient cost may be too high for target price"
          : risk === "MEDIUM"
            ? "Margin moderate - look for cost-saving substitutions"
            : "Healthy margin at target price",
      summary: formatCurrency(costPerServing) + "/serving (margin " + fmtPct(marginPct) + ")",
      riskLevel: risk,
    };
  },

  // ── Project Cost Calculator ──
  "project-cost-calculator": (values) => {
    const materialCost = getNumber(values, "materialCost");
    const laborHours = getNumber(values, "laborHours");
    const laborRate = getNumber(values, "laborRate");
    const overheadPct = getNumber(values, "overheadPct");
    const contingencyPct = getNumber(values, "contingencyPct");
    const laborTotal = laborHours * laborRate;
    const baseCost = materialCost + laborTotal;
    const overhead = baseCost * (overheadPct >= 0 ? overheadPct / 100 : 0.15);
    const contingency = (baseCost + overhead) * (contingencyPct >= 0 ? contingencyPct / 100 : 0.1);
    const total = baseCost + overhead + contingency;
    const risk: FreeRiskLevel = total > 100000 ? "HIGH" : total > 30000 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Total project cost exceeds $100K - review scope and contingencies"
          : risk === "MEDIUM"
            ? "Moderate project cost - verify estimate assumptions"
            : "Project cost within typical small-project range",
      summary: formatCurrency(total),
      riskLevel: risk,
    };
  },

  // ── Cleaning Cost Calculator ──
  "cleaning-cost-calculator": (values) => {
    const areaSize = getNumber(values, "areaSize");
    const staffCount = Math.max(1, getNumber(values, "staffCount"));
    const visitFrequency = Math.max(1, getNumber(values, "visitFrequency"));
    const hourlyRate = getNumber(values, "hourlyRate");
    const hoursPerVisit = getNumber(values, "hoursPerVisit");
    const costPerVisit = hoursPerVisit * staffCount * hourlyRate;
    const monthlyCost = costPerVisit * visitFrequency;
    const costPerM2 = areaSize > 0 ? costPerVisit / areaSize : 0;
    const risk: FreeRiskLevel = costPerM2 > 0.5 ? "HIGH" : costPerM2 > 0.25 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Cost per sq ft per visit is high - optimize crew size or frequency"
          : risk === "MEDIUM"
            ? "Cost per sq ft is moderate"
            : "Cost per sq ft within efficient range",
      summary: formatCurrency(monthlyCost) + "/month (" + formatCurrency(costPerVisit) + "/visit)",
      riskLevel: risk,
    };
  },

  // ── Product Margin Calculator ──
  "product-margin-calculator": (values) => {
    const productPrice = getNumber(values, "productPrice");
    const productCost = getNumber(values, "productCost");
    const returnRate = getNumber(values, "returnRate");
    const unitsPerPeriod = getNumber(values, "unitsPerPeriod");
    const grossMarginPerUnit = productPrice - productCost;
    const marginPct = productPrice > 0 ? (grossMarginPerUnit / productPrice) * 100 : 0;
    const returnCost = returnRate > 0 ? productPrice * (returnRate / 100) * unitsPerPeriod : 0;
    const adjustedMargin = unitsPerPeriod > 0
      ? ((grossMarginPerUnit * unitsPerPeriod) - returnCost) / (unitsPerPeriod * productPrice) * 100
      : marginPct;
    const risk: FreeRiskLevel = adjustedMargin < 15 ? "HIGH" : adjustedMargin < 30 ? "MEDIUM" : "LOW";
    return {
      headline:
        risk === "HIGH"
          ? "Effective margin below 15% - review pricing or return cost impact"
          : risk === "MEDIUM"
            ? "Effective margin moderate - monitor return rate"
            : "Effective margin healthy",
      summary: fmtPct(marginPct) + " gross / " + fmtPct(adjustedMargin) + " effective",
      riskLevel: risk,
    };
  },
};

// ─── Default fallback ─────────────────────────────────────────────────

function defaultResult(tool: RevenueTool): FreeToolResult {
  return {
    riskLevel: "LOW",
    headline: "Calculation Complete",
    summary: "Inputs processed. Unlock the full analyzer for detailed decision support.",
    missingFactors: tool.freeMissingFactors ? [...tool.freeMissingFactors] : [],
    ctaLabel: "Unlock the Full Analyzer",
  };
}

// ─── Main export ──────────────────────────────────────────────────────

export function calculateFreeToolResult(
  tool: RevenueTool,
  values: FreeToolInputValues
): FreeToolResult {
  const calculator = CALCULATOR_REGISTRY[tool.freeSlug];
  if (!calculator) {
    return defaultResult(tool);
  }

  try {
    const result = calculator(values);
    return {
      ...result,
      missingFactors: tool.freeMissingFactors ? [...tool.freeMissingFactors] : [],
      ctaLabel: tool.premiumCtaLabel || "Unlock the Full Analyzer",
    };
  } catch {
    return defaultResult(tool);
  }
}

export function areFreeToolInputsValid(
  tool: RevenueTool,
  values: FreeToolInputValues
): boolean {
  for (const input of tool.freeInputs) {
    if (!input.required) {
      continue;
    }
    if (input.type === "select") {
      const raw = values[input.key];
      if (typeof raw !== "string" || raw.trim() === "") {
        return false;
      }
      continue;
    }
    const numeric = getNumber(values, input.key);
    if (numeric < 0) {
      return false;
    }
  }
  return true;
}
