import type { RevenueTool } from "@/lib/tools/revenue-tools";

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

export function calculatePremiumToolResult(
  tool: RevenueTool,
  values: PremiumToolInputValues
): PremiumToolResult {
  if (tool.sector === "cnc-manufacturing") {
    const setupTime = getNumber(values, "setupTime");
    const cycleTime = getNumber(values, "cycleTime");
    const quantity = Math.max(1, getNumber(values, "quantity"));
    const toolCost = getNumber(values, "toolCost");
    const materialCost = getNumber(values, "materialCost");
    const machineRate = getNumber(values, "machineRate");
    const riskMargin = getNumber(values, "riskMargin");

    const totalMinutes = setupTime + cycleTime * quantity;
    const machineHours = totalMinutes / 60;
    const baseCost = machineHours * machineRate + toolCost + materialCost;
    const safePrice = baseCost * (1 + riskMargin / 100);

    const danger = quantity <= 1 && setupTime >= 45;

    return {
      verdict: danger
        ? `DO NOT ACCEPT UNDER ${money(safePrice)}`
        : safePrice > 0
          ? `REPRICE REQUIRED ABOVE ${money(safePrice)}`
          : "SAFE TO QUOTE",
      headline: "Minimum safe price calculated.",
      primaryMetricLabel: "Minimum safe price",
      primaryMetricValue: money(safePrice),
      riskDrivers: [
        "Setup time",
        "Tooling and fixture cost",
        "Machine rate",
        "Risk margin",
      ],
      suggestedAction: `Quote at or above ${money(safePrice)} or separate setup/tooling cost in the offer.`,
      severity: danger ? "danger" : "watch",
    };
  }

  if (tool.sector === "construction") {
    const originalBudget = getNumber(values, "originalBudget");
    const changeEstimate = getNumber(values, "changeEstimate");
    const delayDays = getNumber(values, "delayDays");
    const crewCostPerDay = getNumber(values, "crewCostPerDay");

    const impactCost = changeEstimate + delayDays * crewCostPerDay;
    const marginRisk = originalBudget > 0 ? impactCost / originalBudget : 0;

    const severity: PremiumSeverity =
      marginRisk >= 0.15 ? "danger" : marginRisk >= 0.05 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "DO NOT ACCEPT WITHOUT PRICE ADJUSTMENT"
          : severity === "watch"
            ? "RENEGOTIATE"
            : "ACCEPT",
      headline: "Change order impact calculated.",
      primaryMetricLabel: "Estimated impact cost",
      primaryMetricValue: money(impactCost),
      riskDrivers: ["Change cost", "Delay days", "Crew cost", "Margin target"],
      suggestedAction:
        severity === "danger"
          ? "Price the change order separately before accepting the work."
          : "Review delay and crew assumptions before confirming the change.",
      severity,
    };
  }

  if (tool.sector === "cleaning") {
    const laborRate = getNumber(values, "laborRate");
    const hoursPerVisit = getNumber(values, "hoursPerVisit");
    const supplyCost = getNumber(values, "supplyCost");
    const visitFrequency = getNumber(values, "visitFrequency");
    const targetMargin = Math.min(80, getNumber(values, "targetMargin"));

    const monthlyCost = laborRate * hoursPerVisit * visitFrequency + supplyCost;
    const minimumMonthlyBid =
      targetMargin >= 100 ? monthlyCost : monthlyCost / (1 - targetMargin / 100);

    const severity: PremiumSeverity =
      targetMargin < 12 ? "danger" : targetMargin < 22 ? "watch" : "safe";

    const verdict =
      severity === "danger"
        ? "UNDERPRICED"
        : severity === "watch"
          ? "LOW MARGIN"
          : "SAFE BID";

    return {
      verdict: `${verdict} — DO NOT BID UNDER ${money(minimumMonthlyBid)}/MONTH`,
      headline: "Minimum monthly bid calculated.",
      primaryMetricLabel: "Minimum monthly bid",
      primaryMetricValue: money(minimumMonthlyBid),
      riskDrivers: [
        "Labor rate",
        "Hours per visit",
        "Supply cost",
        "Target margin",
      ],
      suggestedAction: `Keep the monthly bid above ${money(minimumMonthlyBid)} or reduce scope/frequency.`,
      severity,
    };
  }

  if (tool.sector === "restaurant") {
    const menuPrice = getNumber(values, "menuPrice");
    const ingredientCost = getNumber(values, "ingredientCost");
    const wasteRate = getNumber(values, "wasteRate");
    const deliveryCommission = getNumber(values, "deliveryCommission");
    const laborCostPerItem = getNumber(values, "laborCostPerItem");
    const targetMargin = getNumber(values, "targetMargin") / 100;

    const realCost =
      ingredientCost * (1 + wasteRate / 100) +
      laborCostPerItem +
      menuPrice * (deliveryCommission / 100);

    const realMargin = menuPrice > 0 ? (menuPrice - realCost) / menuPrice : 0;

    const severity: PremiumSeverity =
      realMargin < targetMargin * 0.7
        ? "danger"
        : realMargin < targetMargin
          ? "watch"
          : "safe";

    return {
      verdict:
        severity === "danger"
          ? "REMOVE OR REPRICE"
          : severity === "watch"
            ? "LEAKING PROFIT"
            : "PROFITABLE",
      headline: "Real menu margin calculated.",
      primaryMetricLabel: "Real margin",
      primaryMetricValue: percent(realMargin * 100),
      riskDrivers: [
        "Ingredient cost",
        "Waste",
        "Delivery commission",
        "Labor cost",
      ],
      suggestedAction:
        severity === "safe"
          ? "Keep monitoring waste and delivery channel mix."
          : "Reprice the item or reduce waste/commission exposure.",
      severity,
    };
  }

  if (tool.sector === "ecommerce") {
    const productPrice = getNumber(values, "productPrice");
    const productCost = getNumber(values, "productCost");
    const shippingCost = getNumber(values, "shippingCost");
    const returnRate = getNumber(values, "returnRate");
    const paymentFeeRate = getNumber(values, "paymentFeeRate");
    const adCostPerSale = getNumber(values, "adCostPerSale");

    const fee = productPrice * (paymentFeeRate / 100);
    const returnDrag = productPrice * (returnRate / 100);
    const netProfit =
      productPrice -
      productCost -
      shippingCost -
      fee -
      adCostPerSale -
      returnDrag;

    const severity: PremiumSeverity =
      netProfit < 0 ? "danger" : netProfit < productPrice * 0.1 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "LOSS AFTER RETURNS"
          : severity === "watch"
            ? "FRAGILE"
            : "SCALABLE",
      headline: "Net profit after returns calculated.",
      primaryMetricLabel: "Net profit after returns",
      primaryMetricValue: money(netProfit),
      riskDrivers: [
        "Return rate",
        "Shipping cost",
        "Payment fee",
        "Ad cost per sale",
      ],
      suggestedAction:
        severity === "danger"
          ? "Do not scale this product until return, shipping or ad cost is reduced."
          : "Monitor return rate before increasing ad spend.",
      severity,
    };
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
