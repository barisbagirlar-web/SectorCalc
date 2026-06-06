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
      const n = num(values, "nitrogenKgPerHa");
      const area = num(values, "areaHectares");
      if (n > 200 || area * n > 5000) {
        return freeResult(
          "HIGH",
          "Over-fertilization risk detected.",
          `Total N load ${(area * n).toFixed(0)} kg — salinity and burn risk rise above 200 kg/ha N.`,
          tool.freeMissingFactors.slice(0, 4)
        );
      }
      if (n > 120) {
        return freeResult(
          "MEDIUM",
          "N rate is elevated.",
          "Visible nitrogen rate may compress margin if yield does not respond linearly.",
          tool.freeMissingFactors.slice(0, 4)
        );
      }
      break;
    }
    case "agriculture-irrigation": {
      const monthly =
        num(values, "areaHectares") *
        num(values, "pumpingHours") *
        num(values, "electricityRate");
      return freeResult(
        monthly > 8000 ? "HIGH" : monthly > 2500 ? "MEDIUM" : "LOW",
        `Visible pumping cost ~${money(monthly)}/month`,
        "Before water rights, evaporation loss and efficiency verdict.",
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
        "Quick feed bill before waste, spoilage and output efficiency are modeled.",
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
      const bill = num(values, "monthlyKwh") * num(values, "tariffPerKwh");
      return freeResult(
        bill > 12000 ? "HIGH" : bill > 4000 ? "MEDIUM" : "LOW",
        `Monthly energy bill ~${money(bill)}`,
        "Demand charges and power-factor penalties not modeled on free tier.",
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "energy-carbon": {
      const factors: Record<string, number> = {
        coal: 0.9,
        gas: 0.4,
        electricity: 0.35,
        renewable: 0.05,
      };
      const source = String(values.energySource ?? "electricity");
      const tons = num(values, "productionTons") * (factors[source] ?? 0.35);
      return freeResult(
        tons > 500 ? "HIGH" : tons > 100 ? "MEDIUM" : "LOW",
        `Baseline emissions ~${tons.toFixed(1)} tCO₂`,
        "Standard energy factors only — process and transport not included on free tier.",
        tool.freeMissingFactors.slice(0, 4)
      );
    }
    case "daily-fuel": {
      const fuel =
        (num(values, "distanceKm") / 100) *
        num(values, "consumptionPer100Km") *
        num(values, "fuelPricePerLiter");
      return freeResult(
        fuel > 200 ? "HIGH" : fuel > 75 ? "MEDIUM" : "LOW",
        `One-way fuel ~${money(fuel)}`,
        "Tolls, return leg and parking not included.",
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
      const rates = { basic: 800, standard: 1500, premium: 2500 };
      const q = String(values.materialQuality ?? "standard") as keyof typeof rates;
      const base = num(values, "areaM2") * (rates[q] ?? 1500);
      const withLabor = yes(values, "includeLabor") ? base * 1.6 : base;
      return freeResult(
        withLabor > 50000 ? "HIGH" : withLabor > 20000 ? "MEDIUM" : "LOW",
        `Visible budget ~${money(withLabor)}`,
        "Base m² estimate before winter delay and regional multipliers.",
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
      const revenue = num(values, "expectedYieldTonnes") * area * 250;
      const cost = num(values, "fertilizerCost") + num(values, "irrigationCost");
      const moisture = num(values, "soilMoisturePercent");
      const weather = num(values, "weatherRiskIndex");
      const moisturePenalty = moisture < 15 ? revenue * 0.3 : 0;
      const weatherBuffer = weather > 7 ? revenue * 0.25 : 0;
      const realProfit = revenue - cost - moisturePenalty - weatherBuffer;
      const severity: PremiumSeverity =
        realProfit < 0 ? "danger" : realProfit < revenue * 0.1 ? "watch" : "safe";
      return {
        verdict: severity === "danger" ? "LOSS GUARANTEED" : severity === "watch" ? "ACCEPT WITH BUFFER" : "SAFE TO PLANT",
        headline: "Weather-adjusted crop profit modeled.",
        primaryMetricLabel: "Real profit estimate",
        primaryMetricValue: money(realProfit),
        riskDrivers: ["Soil moisture", "Weather index", "Input costs", "Target margin"],
        suggestedAction:
          moisture < 15
            ? `Soil moisture ${moisture}% is critical — add ${money(moisturePenalty)} buffer or delay planting.`
            : `Weather index ${weather} — include ${money(weatherBuffer)} buffer in contract price.`,
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
      const factors: Record<string, number> = {
        coal: 0.9,
        gas: 0.4,
        electricity: 0.35,
        renewable: 0.05,
      };
      const source = String(values.energySource ?? "electricity");
      const prod = num(values, "productionTons");
      const base = prod * (factors[source] ?? 0.35);
      const process = num(values, "processEmissionsFactor");
      const transport = yes(values, "includesTransport") ? prod * 0.08 : 0;
      const total = base + process + transport;
      const cbamEur = total * 80;
      const importVal = num(values, "euImportValue") || 1;
      const pct = (cbamEur / importVal) * 100;
      const severity: PremiumSeverity = pct > 15 ? "danger" : pct > 8 ? "watch" : "safe";
      return {
        verdict: severity === "danger" ? "HIGH CBAM RISK" : severity === "watch" ? "MODERATE CBAM" : "MANAGEABLE",
        headline: "CBAM-style border cost estimated.",
        primaryMetricLabel: "CBAM cost (€)",
        primaryMetricValue: `€${cbamEur.toFixed(0)}`,
        riskDrivers: ["Energy mix", "Process emissions", "Transport", "Import value"],
        suggestedAction: `CBAM may equal ${pct.toFixed(1)}% of EU import value — shift from ${source} to renewable to cut ~${(((factors[source] ?? 0.35) - 0.05) / (factors[source] ?? 0.35) * 100).toFixed(0)}% emissions.`,
        severity,
      };
    }
    case "daily-renovation": {
      const rates = { basic: 800, standard: 1500, premium: 2500 };
      const q = String(values.materialQuality ?? "standard") as keyof typeof rates;
      const base = num(values, "areaM2") * (rates[q] ?? 1500);
      const labor = yes(values, "includeLabor") ? base * 0.6 : 0;
      const winter = String(values.season) === "winter" ? (base + labor) * 0.2 : 0;
      const mult =
        String(values.cityTier) === "major" ? 1.2 : String(values.cityTier) === "rural" ? 0.9 : 1;
      const total = (base + labor + winter) * mult;
      const withContingency = total * (1 + num(values, "contingencyPercent") / 100);
      return {
        verdict: winter > 0 ? "ADD CONTINGENCY" : "BUDGET REALISTIC",
        headline: "Realistic renovation budget calculated.",
        primaryMetricLabel: "Recommended budget",
        primaryMetricValue: money(withContingency),
        riskDrivers: ["Material tier", "Season", "City tier", "Contingency"],
        suggestedAction:
          winter > 0
            ? `Winter work adds ~${money(winter)} delay buffer — use ${money(withContingency)} as contract ceiling.`
            : `Use ${money(withContingency)} including ${num(values, "contingencyPercent")}% contingency.`,
        severity: winter > 0 ? "watch" : "safe",
      };
    }
    case "daily-fuel": {
      const oneWay =
        (num(values, "distanceKm") / 100) *
        num(values, "consumptionPer100Km") *
        num(values, "fuelPricePerLiter");
      const distance = yes(values, "returnTrip") ? num(values, "distanceKm") * 2 : num(values, "distanceKm");
      const fuel =
        (distance / 100) * num(values, "consumptionPer100Km") * num(values, "fuelPricePerLiter");
      const tolls = num(values, "tollEstimate");
      const parking = num(values, "parkingPerDay");
      const subtotal = fuel + tolls + parking;
      const total = subtotal * (1 + num(values, "bufferPercent") / 100);
      const severity: PremiumSeverity = total > oneWay * 2.5 ? "watch" : "safe";
      return {
        verdict: severity === "watch" ? "ADD BUFFER" : "TRIP SAFE",
        headline: "Full trip budget with buffer.",
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
