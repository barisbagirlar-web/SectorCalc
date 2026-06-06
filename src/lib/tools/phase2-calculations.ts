import type { RevenueTool } from "@/lib/tools/revenue-tools";
import type {
  FreeRiskLevel,
  FreeToolInputValues,
  FreeToolResult,
} from "@/lib/tools/free-tool-results";
import type {
  PremiumSeverity,
  PremiumToolInputValues,
  PremiumToolResult,
} from "@/lib/tools/premium-tool-results";
import {
  calculateCarbonFootprintResult,
  calculateCbamComplianceResult,
  calculateCropYieldOptimizerResult,
  calculateFertilizerNpkResult,
  calculateFuelConsumptionResult,
  calculateHomeRenovationResult,
  calculateIrrigationWaterResult,
  calculateRenovationBudgetOptimizerResult,
  cbamCategoryFromProductionTons,
  cityFromTier,
  ENERGY_EMISSION_MULTIPLIERS,
  GRID_EMISSION_FACTOR_KG_PER_KWH,
} from "@/lib/tools/calculation-formulas";

function num(values: Record<string, number | string>, key: string): number {
  const raw = values[key];
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  if (typeof raw === "string") {
    const p = Number(raw);
    return Number.isFinite(p) ? p : 0;
  }
  return 0;
}

function yes(values: Record<string, number | string>, key: string): boolean {
  return values[key] === "yes";
}

function str(values: Record<string, number | string>, key: string): string {
  return typeof values[key] === "string" ? String(values[key]) : "";
}

function money(value: number): string {
  return `$${Math.max(0, value).toFixed(2)}`;
}

function freeResult(
  riskLevel: FreeRiskLevel,
  headline: string,
  summary: string,
  missing: string[]
): FreeToolResult {
  return {
    riskLevel,
    headline,
    summary,
    missingFactors: missing,
    ctaLabel: "Unlock the Full Analyzer",
  };
}

const PHASE2_SECTORS = new Set([
  "agriculture-crops",
  "agriculture-irrigation",
  "agriculture-feed",
  "agriculture-dairy",
  "energy-consumption",
  "energy-carbon",
  "daily-renovation",
  "daily-fuel",
  "daily-meals",
]);

export function isPhase2Sector(sector: string): boolean {
  return PHASE2_SECTORS.has(sector);
}

export function calculatePhase2FreeResult(
  tool: RevenueTool,
  values: FreeToolInputValues
): FreeToolResult | null {
  if (!PHASE2_SECTORS.has(tool.sector)) return null;

  switch (tool.sector) {
    case "agriculture-crops": {
      const area = num(values, "areaHectares");
      const nRate = num(values, "nitrogenKgPerHa");
      const pRate = num(values, "phosphorusKgPerHa");
      const npk = calculateFertilizerNpkResult({
        cropDemandN: nRate,
        soilReserveN: pRate * 0.15,
        fertilizerEfficiency: 85,
      });
      if ("error" in npk) {
        return freeResult("MEDIUM", "Check fertilizer inputs.", npk.error, tool.freeMissingFactors.slice(0, 4));
      }
      const totalLoad = area * nRate;
      const riskLevel: FreeRiskLevel =
        nRate > 200 || totalLoad > 5000 ? "HIGH" : nRate > 120 ? "MEDIUM" : "LOW";
      return freeResult(
        riskLevel,
        riskLevel === "HIGH" ? "Over-fertilization risk detected." : `N application: ${npk.fertilizerNeeded} kg/ha net`,
        `${npk.note} Total field N load ${totalLoad.toFixed(0)} kg.`,
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "agriculture-irrigation": {
      const area = num(values, "areaHectares");
      const pumpingHours = num(values, "pumpingHours");
      const electricityRate = num(values, "electricityRate");
      const et0 = Math.max(3, pumpingHours / Math.max(1, area * 4));
      const water = calculateIrrigationWaterResult({
        et0,
        kc: 1.05,
        area,
        irrigationEfficiency: 72,
      });
      const monthly = area * pumpingHours * electricityRate;
      if ("error" in water) {
        return freeResult("MEDIUM", "Check irrigation inputs.", water.error, tool.freeMissingFactors.slice(0, 4));
      }
      return freeResult(
        monthly > 8000 ? "HIGH" : monthly > 2500 ? "MEDIUM" : "LOW",
        `Pumping ~${money(monthly)}/mo · ${water.totalWaterM3} m³ gross water need`,
        `${water.note} FAO Paper 56 crop water requirement modeled.`,
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "agriculture-feed": {
      const monthly =
        num(values, "animalCount") *
        num(values, "dailyFeedKg") *
        30 *
        num(values, "feedPricePerKg");
      return freeResult(
        monthly > 50000 ? "HIGH" : monthly > 15000 ? "MEDIUM" : "LOW",
        `Monthly feed exposure: ${money(monthly)}`,
        "Quick feed bill before waste, spoilage and FCR are modeled.",
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "agriculture-dairy": {
      const revenue =
        num(values, "cowCount") *
        num(values, "litersPerCowPerDay") *
        30 *
        num(values, "milkPricePerLiter");
      return freeResult(
        revenue < 5000 ? "HIGH" : revenue < 15000 ? "MEDIUM" : "LOW",
        `Gross milk revenue ~${money(revenue)}/month`,
        "Feed, labor and health costs not included on free tier.",
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "energy-consumption": {
      const kwh = num(values, "monthlyKwh");
      const carbon = calculateCarbonFootprintResult({
        energyConsumption: kwh,
        emissionFactor: GRID_EMISSION_FACTOR_KG_PER_KWH,
        gridLossFactor: 8,
      });
      const bill = kwh * num(values, "tariffPerKwh");
      const emissionsNote =
        "error" in carbon
          ? ""
          : ` · ${carbon.totalEmissions.toFixed(1)} tCO₂e (IPCC grid factor)`;
      return freeResult(
        bill > 12000 ? "HIGH" : bill > 4000 ? "MEDIUM" : "LOW",
        `Monthly energy bill ~${money(bill)}${emissionsNote}`,
        "Demand charges and power-factor penalties not modeled on free tier.",
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "energy-carbon": {
      const source = str(values, "energySource") || "electricity";
      const prod = num(values, "productionTons");
      const energyKey = source as keyof typeof ENERGY_EMISSION_MULTIPLIERS;
      const factor = ENERGY_EMISSION_MULTIPLIERS[energyKey] ?? 0.35;
      const kwhEquivalent = prod * factor * 1000;
      const carbon = calculateCarbonFootprintResult({
        energyConsumption: kwhEquivalent,
        emissionFactor: 0.001,
        gridLossFactor: 5,
      });
      if ("error" in carbon) {
        return freeResult("MEDIUM", "Check production inputs.", carbon.error, tool.freeMissingFactors.slice(0, 4));
      }
      const tons = carbon.totalEmissions;
      return freeResult(
        tons > 500 ? "HIGH" : tons > 100 ? "MEDIUM" : "LOW",
        `Baseline emissions ~${tons.toFixed(1)} tCO₂e`,
        `IPCC-style factors for ${source} — process and transport on premium tier.`,
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "daily-fuel": {
      const fuel = calculateFuelConsumptionResult({
        distanceKm: num(values, "distanceKm"),
        fuelPricePerLiter: num(values, "fuelPricePerLiter"),
        vehicleConsumption: num(values, "consumptionPer100Km"),
        drivingStyle: "normal",
      });
      if ("error" in fuel) {
        return freeResult("MEDIUM", "Check trip inputs.", fuel.error, tool.freeMissingFactors.slice(0, 4));
      }
      return freeResult(
        fuel.totalCost > 200 ? "HIGH" : fuel.totalCost > 75 ? "MEDIUM" : "LOW",
        `Trip fuel ~${money(fuel.totalCost)} (${fuel.totalLiters} L)`,
        `${fuel.note} EPA-style driving adjustment applied.`,
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "daily-meals": {
      const perServing =
        num(values, "servings") > 0
          ? num(values, "ingredientCost") / num(values, "servings")
          : 0;
      return freeResult(
        perServing > 12 ? "HIGH" : perServing > 6 ? "MEDIUM" : "LOW",
        `Cost per serving ~${money(perServing)}`,
        "Weekly scale, waste and inflation buffer not included.",
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "daily-renovation": {
      const quality = (str(values, "materialQuality") || "standard") as
        | "basic"
        | "standard"
        | "premium";
      const renovation = calculateHomeRenovationResult({
        areaM2: num(values, "areaM2"),
        quality,
        city: "standard",
      });
      if ("error" in renovation) {
        return freeResult("MEDIUM", "Check renovation area.", renovation.error, tool.freeMissingFactors.slice(0, 4));
      }
      const withLabor = yes(values, "includeLabor")
        ? renovation.totalCost * 1.6
        : renovation.totalCost;
      return freeResult(
        withLabor > 50000 ? "HIGH" : withLabor > 20000 ? "MEDIUM" : "LOW",
        `Visible budget ~${money(withLabor)} (${renovation.costPerM2} TRY/m²)`,
        `${renovation.note} Before winter delay and regional multipliers.`,
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    default:
      break;
  }

  return freeResult(
    "LOW",
    "Quick check shows no severe visible risk.",
    tool.freeResultPromise,
    tool.freeMissingFactors.slice(0, 4)
  );
}

function minPrice(cost: number, margin: number): number {
  const m = Math.min(95, Math.max(0, margin));
  return m >= 100 ? cost : cost / (1 - m / 100);
}

export function calculatePhase2PremiumResult(
  tool: RevenueTool,
  values: PremiumToolInputValues
): PremiumToolResult | null {
  if (!PHASE2_SECTORS.has(tool.sector)) return null;

  const targetMargin = num(values, "targetMargin");

  switch (tool.sector) {
    case "agriculture-crops": {
      const area = num(values, "areaHectares");
      const yieldResult = calculateCropYieldOptimizerResult({
        cropType: "wheat",
        areaHectares: area,
        expectedYield: num(values, "expectedYieldTonnes"),
        fertilizerCost: num(values, "fertilizerCost"),
        irrigationCost: num(values, "irrigationCost"),
        laborCost: 0,
        marketPricePerTon: 250,
        soilMoisturePercent: num(values, "soilMoisturePercent"),
        weatherRiskIndex: num(values, "weatherRiskIndex"),
        pestPressureIndex: 3,
      });
      if ("error" in yieldResult) {
        return {
          verdict: "REVIEW INPUTS",
          headline: "Crop profit could not be modeled.",
          primaryMetricLabel: "Real profit estimate",
          primaryMetricValue: money(0),
          riskDrivers: ["Soil moisture", "Weather index", "Input costs"],
          suggestedAction: yieldResult.error,
          severity: "watch",
        };
      }
      const severity: PremiumSeverity =
        yieldResult.realProfit < 0
          ? "danger"
          : yieldResult.realProfit < yieldResult.baseRevenue * 0.1
            ? "watch"
            : "safe";
      return {
        verdict: yieldResult.verdictLabel,
        headline: "Weather-adjusted crop profit modeled.",
        primaryMetricLabel: "Real profit estimate",
        primaryMetricValue: money(yieldResult.realProfit),
        riskDrivers: ["Soil moisture", "Weather index", "Input costs", "Target margin"],
        suggestedAction: yieldResult.suggestedAction,
        severity,
      };
    }
    case "agriculture-irrigation": {
      const base =
        num(values, "areaHectares") *
        num(values, "pumpingHours") *
        num(values, "electricityRate");
      const rights = num(values, "waterRightsFee");
      const evap = base * (num(values, "evaporationLossPercent") / 100);
      const total = base + rights + evap;
      const minSpend = minPrice(total, targetMargin);
      const severity: PremiumSeverity = evap > base * 0.15 ? "watch" : "safe";
      return {
        verdict: severity === "watch" ? "OVERWATERING RISK" : "EFFICIENT",
        headline: "Water spend with rights and evaporation modeled.",
        primaryMetricLabel: "Minimum viable spend",
        primaryMetricValue: money(minSpend),
        riskDrivers: ["Pumping cost", "Water rights", "Evaporation loss", "Target margin"],
        suggestedAction: `Evaporation adds ${money(evap)}/month — reduce run time or improve coverage to protect margin.`,
        severity,
      };
    }
    case "agriculture-feed": {
      const baseFeed =
        num(values, "animalCount") *
        num(values, "dailyFeedKg") *
        30 *
        num(values, "feedPricePerKg");
      const waste = baseFeed * (num(values, "feedWastePercent") / 100);
      const milkRev = num(values, "milkYieldPerDay") * num(values, "animalCount") * 30 * 4.5;
      const ratio = milkRev / (baseFeed + waste || 1);
      const severity: PremiumSeverity = ratio < 1.8 ? "danger" : ratio < 2.2 ? "watch" : "safe";
      return {
        verdict: severity === "danger" ? "INEFFICIENT" : severity === "watch" ? "MARGIN PRESSURE" : "OPTIMAL",
        headline: "Feed efficiency with waste modeled.",
        primaryMetricLabel: "Real efficiency ratio",
        primaryMetricValue: ratio.toFixed(2),
        riskDrivers: ["Feed waste", "Water quality index", "Milk revenue", "Feed cost"],
        suggestedAction: `Waste ${num(values, "feedWastePercent")}% costs ${money(waste)}/month — improve storage to recover ~15% efficiency.`,
        severity,
      };
    }
    case "agriculture-dairy": {
      const revenue =
        num(values, "cowCount") *
        num(values, "litersPerCowPerDay") *
        30 *
        num(values, "milkPricePerLiter");
      const costs =
        num(values, "monthlyFeedCost") +
        num(values, "laborCost") +
        num(values, "vetAndHealth");
      const net = revenue - costs;
      const severity: PremiumSeverity =
        net < 0 ? "danger" : net < revenue * 0.08 ? "watch" : "safe";
      return {
        verdict: severity === "danger" ? "LOSING MONEY" : severity === "watch" ? "TIGHT MARGIN" : "PROFITABLE",
        headline: "Full dairy cost stack modeled.",
        primaryMetricLabel: "Net monthly margin",
        primaryMetricValue: money(net),
        riskDrivers: ["Feed cost", "Labor", "Vet & health", "Milk revenue"],
        suggestedAction:
          net < 0
            ? "Net margin negative — reprice milk contract or reduce feed waste before expanding herd."
            : `Target ${num(values, "targetMargin")}% margin — floor at ${money(minPrice(costs, targetMargin))} revenue.`,
        severity,
      };
    }
    case "energy-consumption": {
      const base = num(values, "monthlyKwh") * num(values, "tariffPerKwh");
      const demand = num(values, "demandCharge");
      const pfPenalty = base * (num(values, "powerFactorPenalty") / 100);
      const total = base + demand + pfPenalty;
      const target = num(values, "efficiencyTargetPercent");
      const gap = Math.max(0, 100 - target);
      const severity: PremiumSeverity = pfPenalty > base * 0.08 ? "watch" : "safe";
      return {
        verdict: severity === "watch" ? "HIGH WASTE" : "ON TARGET",
        headline: "Demand and power-factor penalties included.",
        primaryMetricLabel: "True monthly energy cost",
        primaryMetricValue: money(total),
        riskDrivers: ["kWh tariff", "Demand charge", "Power factor", "Efficiency target"],
        suggestedAction: `Power-factor penalty ${money(pfPenalty)} — retrofit priority if gap exceeds ${gap.toFixed(0)}%.`,
        severity,
      };
    }
    case "energy-carbon": {
      const source = (str(values, "energySource") || "electricity") as
        | "coal"
        | "gas"
        | "electricity"
        | "renewable";
      const prod = num(values, "productionTons");
      const cbam = calculateCbamComplianceResult({
        productionTons: prod,
        productCategory: cbamCategoryFromProductionTons(prod),
        energySource: source,
        euImportValueEur: num(values, "euImportValue") || 1,
        processEfficiency: Math.max(0, 100 - num(values, "processEmissionsFactor") * 10),
        transportDistanceKm: yes(values, "includesTransport") ? 800 : 0,
      });
      if ("error" in cbam) {
        return {
          verdict: "REVIEW INPUTS",
          headline: "CBAM cost could not be calculated.",
          primaryMetricLabel: "CBAM cost (€)",
          primaryMetricValue: "€0",
          riskDrivers: ["Energy mix", "Process emissions", "Transport"],
          suggestedAction: cbam.error,
          severity: "watch",
        };
      }
      const severity: PremiumSeverity =
        cbam.cbamCostPercentage > 15 ? "danger" : cbam.cbamCostPercentage > 8 ? "watch" : "safe";
      return {
        verdict: cbam.verdictLabel,
        headline: "CBAM border cost estimated (EU Reg. 2023/956).",
        primaryMetricLabel: "CBAM cost (€)",
        primaryMetricValue: `€${cbam.cbamCostCurrent.toFixed(0)}`,
        riskDrivers: ["Energy mix", "Process efficiency", "Transport", "Import value"],
        suggestedAction: cbam.suggestedAction,
        severity,
      };
    }
    case "daily-renovation": {
      const quality = (str(values, "materialQuality") || "standard") as
        | "basic"
        | "standard"
        | "premium";
      const season = (str(values, "season") || "summer") as "summer" | "winter";
      const budget = calculateRenovationBudgetOptimizerResult({
        areaM2: num(values, "areaM2"),
        materialQuality: quality,
        includeLabor: yes(values, "includeLabor"),
        city: cityFromTier(str(values, "cityTier") || "standard"),
        season,
        buildingAge: season === "winter" ? 25 : 12,
        floorCount: 3,
      });
      if ("error" in budget) {
        return {
          verdict: "REVIEW INPUTS",
          headline: "Renovation budget could not be calculated.",
          primaryMetricLabel: "Recommended budget",
          primaryMetricValue: money(0),
          riskDrivers: ["Material tier", "Season", "City tier"],
          suggestedAction: budget.error,
          severity: "watch",
        };
      }
      const withContingency = budget.realTotal * (1 + num(values, "contingencyPercent") / 100);
      return {
        verdict: budget.verdictLabel,
        headline: "Realistic renovation budget calculated.",
        primaryMetricLabel: "Recommended budget",
        primaryMetricValue: money(withContingency),
        riskDrivers: ["Material tier", "Season", "Hidden prep costs", "Contingency"],
        suggestedAction: budget.suggestedAction,
        severity: budget.verdictLabel.includes("HIGH") ? "watch" : "safe",
      };
    }
    case "daily-fuel": {
      const oneWay = calculateFuelConsumptionResult({
        distanceKm: num(values, "distanceKm"),
        fuelPricePerLiter: num(values, "fuelPricePerLiter"),
        vehicleConsumption: num(values, "consumptionPer100Km"),
        drivingStyle: "normal",
      });
      if ("error" in oneWay) {
        return {
          verdict: "REVIEW INPUTS",
          headline: "Trip budget could not be calculated.",
          primaryMetricLabel: "Recommended trip budget",
          primaryMetricValue: money(0),
          riskDrivers: ["Fuel", "Distance"],
          suggestedAction: oneWay.error,
          severity: "watch",
        };
      }
      const distance = yes(values, "returnTrip")
        ? num(values, "distanceKm") * 2
        : num(values, "distanceKm");
      const roundTrip = calculateFuelConsumptionResult({
        distanceKm: distance,
        fuelPricePerLiter: num(values, "fuelPricePerLiter"),
        vehicleConsumption: num(values, "consumptionPer100Km"),
        drivingStyle: "normal",
      });
      const fuelCost = "error" in roundTrip ? oneWay.totalCost : roundTrip.totalCost;
      const tolls = num(values, "tollEstimate");
      const parking = num(values, "parkingPerDay");
      const subtotal = fuelCost + tolls + parking;
      const total = subtotal * (1 + num(values, "bufferPercent") / 100);
      const severity: PremiumSeverity = total > oneWay.totalCost * 2.5 ? "watch" : "safe";
      return {
        verdict: severity === "watch" ? "ADD BUFFER" : "TRIP SAFE",
        headline: "Full trip budget with EPA-style fuel model.",
        primaryMetricLabel: "Recommended trip budget",
        primaryMetricValue: money(total),
        riskDrivers: ["Fuel", "Tolls", "Return leg", "Buffer"],
        suggestedAction: `Include ${num(values, "bufferPercent")}% buffer — use ${money(total)} as spending ceiling.`,
        severity,
      };
    }
    case "daily-meals": {
      const budget = num(values, "weeklyGroceryBudget");
      const waste = budget * (num(values, "foodWastePercent") / 100);
      const inflation = budget * (num(values, "inflationBuffer") / 100);
      const adjusted = budget + waste + inflation;
      const perPerson = adjusted / Math.max(1, num(values, "householdSize"));
      const savingsTarget = adjusted * (1 - num(values, "targetSavings") / 100);
      const severity: PremiumSeverity = waste > budget * 0.2 ? "watch" : "safe";
      return {
        verdict: severity === "watch" ? "OVER SPEND" : "ON PLAN",
        headline: "Weekly grocery plan with waste buffer.",
        primaryMetricLabel: "Adjusted weekly budget",
        primaryMetricValue: money(adjusted),
        riskDrivers: ["Food waste", "Inflation buffer", "Household size", "Savings target"],
        suggestedAction: `Waste allowance ${money(waste)} — shop to ${money(savingsTarget)} to hit ${num(values, "targetSavings")}% savings (${money(perPerson)}/person).`,
        severity,
      };
    }
    default: {
      const cost = minPrice(1000, targetMargin);
      return {
        verdict: "REVIEW REQUIRED",
        headline: "Premium verdict calculated.",
        primaryMetricLabel: "Minimum safe floor",
        primaryMetricValue: money(cost),
        riskDrivers: tool.paidInputs.slice(0, 4).map((i) => i.label),
        suggestedAction: "Run full inputs and save report for audit trail.",
        severity: "watch",
      };
    }
  }
}
