import type { RevenueTool } from "@/lib/tools/revenue-tools";

export type FreeRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type FreeToolFormValues = Record<string, number | string>;

export type FreeToolResult = {
  riskLevel: FreeRiskLevel;
  headline: string;
  summary: string;
  missingFactors: string[];
  ctaLabel: string;
};

const CTA_LABEL = "Unlock the Full Analyzer";

function readNumber(values: FreeToolFormValues, key: string): number | null {
  const raw = values[key];
  if (raw === "" || raw === undefined || raw === null) {
    return null;
  }
  const parsed = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

function readString(values: FreeToolFormValues, key: string): string | null {
  const raw = values[key];
  if (typeof raw !== "string" || raw.trim() === "") {
    return null;
  }
  return raw;
}

export function areFreeToolInputsValid(
  tool: RevenueTool,
  values: FreeToolFormValues
): boolean {
  for (const input of tool.freeInputs) {
    if (!input.required) {
      continue;
    }
    if (input.type === "select") {
      if (!readString(values, input.key)) {
        return false;
      }
      continue;
    }
    const numeric = readNumber(values, input.key);
    if (numeric === null || numeric < 0) {
      return false;
    }
  }
  return true;
}

function headlineForRisk(riskLevel: FreeRiskLevel): string {
  switch (riskLevel) {
    case "HIGH":
      return "Elevated risk signal detected";
    case "MEDIUM":
      return "Moderate exposure — review inputs";
    default:
      return "Limited pre-check signal";
  }
}

function assessCncRisk(values: FreeToolFormValues): FreeRiskLevel {
  const setupTime = readNumber(values, "setupTime") ?? 0;
  const quantity = readNumber(values, "quantity") ?? 1;

  if (quantity <= 1 && setupTime >= 60) {
    return "HIGH";
  }
  if (setupTime >= 30 || (quantity <= 2 && setupTime >= 20)) {
    return "MEDIUM";
  }
  return "LOW";
}

function assessConstructionRisk(values: FreeToolFormValues): FreeRiskLevel {
  const originalBudget = readNumber(values, "originalBudget") ?? 0;
  const changeEstimate = readNumber(values, "changeEstimate") ?? 0;
  const deadlinePressure = readString(values, "deadlinePressure");

  if (deadlinePressure === "high") {
    return "HIGH";
  }

  if (originalBudget > 0) {
    const ratio = changeEstimate / originalBudget;
    if (ratio >= 0.25) {
      return "HIGH";
    }
    if (ratio >= 0.12) {
      return "MEDIUM";
    }
  }

  return changeEstimate > 0 ? "LOW" : "LOW";
}

function assessCleaningRisk(values: FreeToolFormValues): FreeRiskLevel {
  const staffCount = readNumber(values, "staffCount") ?? 0;
  const visitFrequency = readNumber(values, "visitFrequency") ?? 0;
  const workload = staffCount * visitFrequency;

  if (workload >= 40) {
    return "HIGH";
  }
  if (workload >= 20) {
    return "MEDIUM";
  }
  return "LOW";
}

function assessRestaurantRisk(values: FreeToolFormValues): FreeRiskLevel {
  const menuPrice = readNumber(values, "menuPrice") ?? 0;
  const foodCost = readNumber(values, "foodCost") ?? 0;

  if (menuPrice <= 0) {
    return "LOW";
  }

  const ratio = foodCost / menuPrice;
  if (ratio >= 0.4) {
    return "HIGH";
  }
  if (ratio >= 0.32) {
    return "MEDIUM";
  }
  return "LOW";
}

function assessEcommerceRisk(values: FreeToolFormValues): FreeRiskLevel {
  const returnRate = readNumber(values, "returnRate") ?? 0;

  if (returnRate >= 15) {
    return "HIGH";
  }
  if (returnRate >= 8) {
    return "MEDIUM";
  }
  return "LOW";
}

function assessSectorRisk(
  tool: RevenueTool,
  values: FreeToolFormValues
): FreeRiskLevel {
  switch (tool.sector) {
    case "cnc-manufacturing":
      return assessCncRisk(values);
    case "construction":
      return assessConstructionRisk(values);
    case "cleaning":
      return assessCleaningRisk(values);
    case "restaurant":
      return assessRestaurantRisk(values);
    case "ecommerce":
      return assessEcommerceRisk(values);
    default:
      return "LOW";
  }
}

function buildVisibleSummary(
  tool: RevenueTool,
  values: FreeToolFormValues,
  riskLevel: FreeRiskLevel
): string {
  switch (tool.sector) {
    case "cnc-manufacturing": {
      const setupTime = readNumber(values, "setupTime") ?? 0;
      const cycleTime = readNumber(values, "cycleTime") ?? 0;
      const quantity = readNumber(values, "quantity") ?? 1;
      return `Visible time exposure: ${setupTime} min setup + ${cycleTime} min cycle × ${quantity} unit(s). ${riskLevel === "HIGH" ? "Low-volume, setup-heavy mix may need deeper quote review." : "Directional time signal only — not a quote verdict."}`;
    }
    case "construction": {
      const originalBudget = readNumber(values, "originalBudget") ?? 0;
      const changeEstimate = readNumber(values, "changeEstimate") ?? 0;
      const pct =
        originalBudget > 0
          ? ((changeEstimate / originalBudget) * 100).toFixed(1)
          : "—";
      return `Change estimate is ${pct}% of original budget ($${changeEstimate.toLocaleString("en-US")} visible exposure). Not a safe change price or accept/reject verdict.`;
    }
    case "cleaning": {
      const areaSize = readNumber(values, "areaSize") ?? 0;
      const staffCount = readNumber(values, "staffCount") ?? 0;
      const visitFrequency = readNumber(values, "visitFrequency") ?? 0;
      return `${areaSize.toLocaleString("en-US")} sq ft with ${staffCount} staff across ${visitFrequency} visits/month — basic workload exposure only.`;
    }
    case "restaurant": {
      const menuPrice = readNumber(values, "menuPrice") ?? 0;
      const foodCost = readNumber(values, "foodCost") ?? 0;
      const ratio =
        menuPrice > 0 ? ((foodCost / menuPrice) * 100).toFixed(1) : "—";
      return `Visible food cost ratio: ${ratio}% of menu price. Plate-level check only — no waste, labor or commission verdict.`;
    }
    case "ecommerce": {
      const productPrice = readNumber(values, "productPrice") ?? 0;
      const productCost = readNumber(values, "productCost") ?? 0;
      const returnRate = readNumber(values, "returnRate") ?? 0;
      const gross =
        productPrice > 0
          ? (((productPrice - productCost) / productPrice) * 100).toFixed(1)
          : "—";
      return `Headline gross margin ~${gross}% with ${returnRate}% return rate entered. Not net profit after fees, ads or scaling verdict.`;
    }
    default:
      return tool.freeResultPromise;
  }
}

export function calculateFreeToolResult(
  tool: RevenueTool,
  values: FreeToolFormValues
): FreeToolResult | null {
  if (!areFreeToolInputsValid(tool, values)) {
    return null;
  }

  const riskLevel = assessSectorRisk(tool, values);
  const summary = buildVisibleSummary(tool, values, riskLevel);

  return {
    riskLevel,
    headline: headlineForRisk(riskLevel),
    summary,
    missingFactors: [...tool.freeMissingFactors],
    ctaLabel: CTA_LABEL,
  };
}
