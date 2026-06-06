import type { RevenueTool } from "@/lib/tools/revenue-tools";
import { calculateExtendedPremiumResult } from "@/lib/tools/premium-sector-calculations";
import {
  calculateCncMachiningTimeResult,
  calculateConstructionProjectRiskResult,
  deriveCncMachiningParamsFromShopInputs,
} from "@/lib/tools/calculation-formulas";
import {
  calculateCleaningPremiumResult,
  calculateRestaurantPremiumResult,
  calculateEcommercePremiumResult,
  type SectorPremiumSignal,
} from "@/lib/tools/sector-formulas-b";

export type PremiumToolInputValues = Record<string, number | string>;

export type PremiumSeverity = "safe" | "watch" | "danger";

export type PremiumToolResult = {
  verdict: string;
  headline: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  riskDrivers: string[];
  suggestedAction: string;
  severity: PremiumSeverity;
};

function getNumber(values: PremiumToolInputValues, key: string): number {
  const raw = values[key];

  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : 0;
  }

  if (typeof raw === "string") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function money(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0";
  }
  return `$${Math.max(0, value).toFixed(2)}`;
}

function percent(value: number): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  return `${value.toFixed(1)}%`;
}

export function arePremiumToolInputsValid(
  tool: RevenueTool,
  values: PremiumToolInputValues
): boolean {
  for (const input of tool.paidInputs) {
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

function fromCorePremiumSignal(
  signal: SectorPremiumSignal,
  formatMetric: (value: number) => string = money
): PremiumToolResult {
  if ("error" in signal) {
    return {
      verdict: "REVIEW INPUTS",
      headline: "Inputs need correction.",
      primaryMetricLabel: "Result",
      primaryMetricValue: money(0),
      riskDrivers: ["Input validation"],
      suggestedAction: signal.error,
      severity: "watch",
    };
  }
  return {
    verdict: signal.verdictLabel,
    headline: signal.headline,
    primaryMetricLabel: signal.primaryMetricLabel,
    primaryMetricValue: formatMetric(signal.primaryMetricValue),
    riskDrivers: signal.riskDrivers,
    suggestedAction: signal.suggestedAction,
    severity: signal.severity,
  };
}

export function calculatePremiumToolResult(
  tool: RevenueTool,
  values: PremiumToolInputValues
): PremiumToolResult {
  const extended = calculateExtendedPremiumResult(tool, values);
  if (extended) {
    return extended;
  }

  if (tool.sector === "cnc-manufacturing") {
    const setupTime = getNumber(values, "setupTime");
    const cycleTime = getNumber(values, "cycleTime");
    const quantity = Math.max(1, getNumber(values, "quantity"));
    const toolCost = getNumber(values, "toolCost");
    const materialCost = getNumber(values, "materialCost");
    const machineRate = getNumber(values, "machineRate");
    const riskMargin = getNumber(values, "riskMargin");

    const machiningParams = deriveCncMachiningParamsFromShopInputs({
      setupTimeMinutes: setupTime,
      cycleTimeMinutes: cycleTime,
      quantity,
      riskMarginPercent: riskMargin,
    });

    const engineResult = calculateCncMachiningTimeResult(machiningParams);
    const shopMinutes = setupTime + cycleTime * quantity;
    const machineHours =
      ("error" in engineResult ? shopMinutes : engineResult.totalTime) / 60;
    const baseCost = machineHours * machineRate + toolCost + materialCost;
    const safePrice = baseCost * (1 + riskMargin / 100);

    if ("error" in engineResult) {
      return {
        verdict: `REPRICE REQUIRED ABOVE ${money(safePrice)}`,
        headline: "Minimum safe price calculated.",
        primaryMetricLabel: "Minimum safe price",
        primaryMetricValue: money(safePrice),
        riskDrivers: ["Setup time", "Tooling cost", "Machine rate", "Risk margin"],
        suggestedAction: engineResult.error,
        severity: "watch",
      };
    }

    const danger =
      engineResult.verdictLabel === "TOOL FAILURE RISK" ||
      engineResult.verdictLabel === "HIGH PRECISION RISK" ||
      (quantity <= 1 && setupTime >= 45);

    const verdict =
      danger
        ? `DO NOT ACCEPT UNDER ${money(safePrice)}`
        : safePrice > 0
          ? `${engineResult.verdictLabel} — REPRICE ABOVE ${money(safePrice)}`
          : "SAFE TO QUOTE";

    return {
      verdict,
      headline: "Minimum safe price with Taylor tool-life modeling.",
      primaryMetricLabel: "Minimum safe price",
      primaryMetricValue: money(safePrice),
      riskDrivers: [
        `Setup burden ${(machiningParams.toleranceMicrons <= 25 ? "tight" : "standard")} tolerance`,
        `Tool life ~${Math.round(engineResult.toolLifeMinutes)} min`,
        "Machine rate",
        "Risk margin",
      ],
      suggestedAction:
        engineResult.suggestedAction ||
        `Quote at or above ${money(safePrice)} or separate setup/tooling cost in the offer.`,
      severity: danger ? "danger" : "watch",
    };
  }

  if (tool.sector === "construction") {
    const originalBudget = getNumber(values, "originalBudget");
    const changeEstimate = getNumber(values, "changeEstimate");
    const delayDays = getNumber(values, "delayDays");
    const crewCostPerDay = getNumber(values, "crewCostPerDay");
    const marginTarget = getNumber(values, "marginTarget");

    const impactCost = changeEstimate + delayDays * crewCostPerDay;
    const marginRisk = originalBudget > 0 ? impactCost / originalBudget : 0;

    const laborProductivity = Math.min(
      100,
      Math.max(40, 100 - delayDays * 1.5 - (marginTarget < 15 ? 10 : 0))
    );

    const siteRisk = calculateConstructionProjectRiskResult({
      projectValue: originalBudget,
      season: delayDays > 20 ? "winter" : delayDays > 10 ? "spring" : "summer",
      soilType: changeEstimate > originalBudget * 0.1 ? "clay" : "loam",
      weatherRiskIndex: Math.min(10, delayDays / 3),
      laborProductivity,
    });

    const combinedRiskPct =
      "error" in siteRisk
        ? marginRisk * 100
        : Math.max(marginRisk * 100, siteRisk.riskPercentage);

    const severity: PremiumSeverity =
      combinedRiskPct >= 15 ? "danger" : combinedRiskPct >= 8 ? "watch" : "safe";

    const siteNote =
      "error" in siteRisk ? "" : ` ${siteRisk.suggestedAction}`;

    return {
      verdict:
        severity === "danger"
          ? "DO NOT ACCEPT WITHOUT PRICE ADJUSTMENT"
          : severity === "watch"
            ? "RENEGOTIATE"
            : "ACCEPT",
      headline: "Change order + site risk impact calculated.",
      primaryMetricLabel: "Estimated impact cost",
      primaryMetricValue: money(impactCost),
      riskDrivers: [
        "Change cost",
        "Delay days",
        "Crew cost",
        "Site weather/soil risk",
      ],
      suggestedAction:
        severity === "danger"
          ? `Price the change separately. Combined risk ~${combinedRiskPct.toFixed(1)}% of budget.${siteNote}`
          : `Review delay and crew assumptions.${siteNote}`,
      severity,
    };
  }

  if (tool.sector === "cleaning") {
    return fromCorePremiumSignal(
      calculateCleaningPremiumResult({
        areaSize: getNumber(values, "areaSize"),
        laborRate: getNumber(values, "laborRate"),
        hoursPerVisit: getNumber(values, "hoursPerVisit"),
        supplyCost: getNumber(values, "supplyCost"),
        visitFrequency: getNumber(values, "visitFrequency"),
        targetMargin: getNumber(values, "targetMargin"),
      })
    );
  }

  if (tool.sector === "restaurant") {
    return fromCorePremiumSignal(
      calculateRestaurantPremiumResult({
        menuPrice: getNumber(values, "menuPrice"),
        ingredientCost: getNumber(values, "ingredientCost"),
        wasteRate: getNumber(values, "wasteRate"),
        deliveryCommission: getNumber(values, "deliveryCommission"),
        laborCostPerItem: getNumber(values, "laborCostPerItem"),
        targetMargin: getNumber(values, "targetMargin"),
      }),
      percent
    );
  }

  if (tool.sector === "ecommerce") {
    return fromCorePremiumSignal(
      calculateEcommercePremiumResult({
        productPrice: getNumber(values, "productPrice"),
        productCost: getNumber(values, "productCost"),
        shippingCost: getNumber(values, "shippingCost"),
        returnRate: getNumber(values, "returnRate"),
        paymentFeeRate: getNumber(values, "paymentFeeRate"),
        adCostPerSale: getNumber(values, "adCostPerSale"),
      })
    );
  }

  return {
    verdict: "REVIEW REQUIRED",
    headline: "Decision result generated.",
    primaryMetricLabel: "Result",
    primaryMetricValue: "Review",
    riskDrivers: ["Inputs require review"],
    suggestedAction: "Check the inputs and run the analyzer again.",
    severity: "watch",
  };
}
