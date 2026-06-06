import type { RevenueTool } from "@/lib/tools/revenue-tools";

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
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function buildGenericResult(
  riskLevel: FreeRiskLevel,
  headline: string,
  summary: string,
  missingFactors: string[]
): FreeToolResult {
  return {
    riskLevel,
    headline,
    summary,
    missingFactors,
    ctaLabel: "Unlock the Full Analyzer",
  };
}

export function calculateFreeToolResult(
  tool: RevenueTool,
  values: FreeToolInputValues
): FreeToolResult {
  if (tool.sector === "cnc-manufacturing") {
    const setupTime = getNumber(values, "setupTime");
    const quantity = getNumber(values, "quantity");

    if (quantity <= 1 && setupTime >= 60) {
      return buildGenericResult(
        "HIGH",
        "This job may be underpriced.",
        "Setup-heavy one-off jobs can look profitable while tooling and preparation time destroy the margin.",
        ["Tooling cost", "Machine rate", "Material cost", "Risk margin"]
      );
    }

    if (setupTime >= 30) {
      return buildGenericResult(
        "MEDIUM",
        "Setup time may create margin pressure.",
        "The quick check shows visible time exposure, but the full analyzer is needed for a safe price.",
        ["Tooling cost", "Machine rate", "Risk margin"]
      );
    }

    return buildGenericResult(
      "LOW",
      "Visible risk looks limited.",
      "The quick check does not include all quote risk drivers. Use the analyzer before accepting high-pressure jobs.",
      ["Tooling cost", "Machine rate", "Risk margin"]
    );
  }

  if (tool.sector === "construction") {
    const originalBudget = getNumber(values, "originalBudget");
    const changeEstimate = getNumber(values, "changeEstimate");
    const ratio = originalBudget > 0 ? changeEstimate / originalBudget : 0;

    if (ratio >= 0.15) {
      return buildGenericResult(
        "HIGH",
        "This change may erase project margin.",
        "The visible change cost is large compared with the original budget.",
        ["Delay days", "Crew cost per day", "Target margin"]
      );
    }

    if (ratio >= 0.05) {
      return buildGenericResult(
        "MEDIUM",
        "This change deserves a margin check.",
        "The quick check shows possible exposure, but delay and crew cost can change the decision.",
        ["Delay days", "Crew cost per day", "Target margin"]
      );
    }
  }

  if (tool.sector === "cleaning") {
    const staffCount = getNumber(values, "staffCount");
    const visitFrequency = getNumber(values, "visitFrequency");

    if (staffCount * visitFrequency >= 40) {
      return buildGenericResult(
        "HIGH",
        "This contract may be underpriced.",
        "High visit load and labor exposure can turn a simple cleaning contract into a monthly loss.",
        ["Labor rate", "Hours per visit", "Supply cost", "Target margin"]
      );
    }

    if (staffCount * visitFrequency >= 16) {
      return buildGenericResult(
        "MEDIUM",
        "Labor exposure needs a bid check.",
        "The visible workload suggests the monthly bid should be tested before quoting.",
        ["Labor rate", "Hours per visit", "Supply cost", "Target margin"]
      );
    }
  }

  if (tool.sector === "restaurant") {
    const menuPrice = getNumber(values, "menuPrice");
    const foodCost = getNumber(values, "foodCost");
    const ratio = menuPrice > 0 ? foodCost / menuPrice : 0;

    if (ratio >= 0.4) {
      return buildGenericResult(
        "HIGH",
        "This item may be leaking profit.",
        "The basic food cost ratio is already high before waste, labor and delivery fees.",
        [
          "Waste rate",
          "Delivery commission",
          "Labor cost per item",
          "Target margin",
        ]
      );
    }

    if (ratio >= 0.3) {
      return buildGenericResult(
        "MEDIUM",
        "Margin pressure is visible.",
        "The item may still work, but hidden costs can change the real margin.",
        ["Waste rate", "Delivery commission", "Labor cost per item"]
      );
    }
  }

  if (tool.sector === "ecommerce") {
    const returnRate = getNumber(values, "returnRate");

    if (returnRate >= 15) {
      return buildGenericResult(
        "HIGH",
        "Returns may erase the profit.",
        "The return rate can materially change the real unit economics after shipping, fees and ads.",
        ["Shipping cost", "Payment fee", "Ad cost per sale", "Product cost"]
      );
    }

    if (returnRate >= 8) {
      return buildGenericResult(
        "MEDIUM",
        "Return risk needs a deeper check.",
        "Gross margin alone is not enough when returns and acquisition cost are present.",
        ["Shipping cost", "Payment fee", "Ad cost per sale"]
      );
    }
  }

  return buildGenericResult(
    "LOW",
    "The quick check does not show severe visible risk.",
    "This result is only a quick estimate. Use the full analyzer before making pricing or bid decisions.",
    ["Full cost drivers", "Risk margin", "Target margin"]
  );
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
