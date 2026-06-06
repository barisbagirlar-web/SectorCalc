import type { RevenueTool } from "@/lib/tools/revenue-tools";
import { calculateExtendedFreeResult } from "@/lib/tools/free-sector-calculations";
import {
  calculateMachiningMinutes,
  calculateSpindleRpmResult,
  calculateFeedRateResult,
  changeOrderWastePercent,
  setupBurdenRatio,
} from "@/lib/tools/calculation-formulas";
import {
  calculateCleaningFreeResult,
  calculateRestaurantFreeResult,
  calculateEcommerceFreeResult,
} from "@/lib/tools/sector-formulas-b";

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

function getString(values: FreeToolInputValues, key: string): string {
  const raw = values[key];
  return typeof raw === "string" ? raw : "";
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

function mapSectorFreeSignal(
  signal: ReturnType<typeof calculateCleaningFreeResult>,
  missingFactors: string[]
): FreeToolResult {
  if ("error" in signal) {
    return buildGenericResult("MEDIUM", "Check your inputs.", signal.error, missingFactors);
  }
  return buildGenericResult(signal.riskLevel, signal.headline, signal.summary, missingFactors);
}

export function calculateFreeToolResult(
  tool: RevenueTool,
  values: FreeToolInputValues
): FreeToolResult {
  const extended = calculateExtendedFreeResult(tool, values);
  if (extended) {
    return extended;
  }

  if (tool.sector === "cnc-manufacturing") {
    const setupTime = getNumber(values, "setupTime");
    const cycleTime = getNumber(values, "cycleTime");
    const quantity = getNumber(values, "quantity");

    if (setupTime < 0 || cycleTime < 0 || quantity <= 0) {
      return buildGenericResult(
        "MEDIUM",
        "Check machining inputs.",
        "Setup time, cycle time and quantity must be valid. Quantity must be greater than zero.",
        ["Tooling cost", "Machine rate", "Material cost", "Risk margin"]
      );
    }

    const totalMinutes = calculateMachiningMinutes(setupTime, cycleTime, quantity);
    const burden = setupBurdenRatio(setupTime, cycleTime, quantity);

    const cuttingSpeed = 120;
    const toolDiameter = 12;
    const rpmResult = calculateSpindleRpmResult({ cuttingSpeed, toolDiameter });
    const spindleRpm = "error" in rpmResult ? 0 : rpmResult.rpm;
    const feedResult = calculateFeedRateResult({
      spindleRpm: spindleRpm || 3000,
      numberOfFlutes: 4,
      chipLoad: 0.08,
    });
    const feedRate = "error" in feedResult ? 0 : feedResult.feedRate;

    if ((quantity <= 1 && setupTime >= 60) || burden >= 0.55) {
      return buildGenericResult(
        "HIGH",
        "This job may be underpriced.",
        `~${totalMinutes.toFixed(0)} min total time (${(burden * 100).toFixed(0)}% setup). At ${spindleRpm} RPM and ${feedRate} mm/min feed, one-off jobs need higher minimum charges.`,
        ["Tooling cost", "Machine rate", "Material cost", "Risk margin"]
      );
    }

    if (setupTime >= 30 || burden >= 0.35) {
      return buildGenericResult(
        "MEDIUM",
        "Setup time may create margin pressure.",
        `Visible exposure ~${totalMinutes.toFixed(0)} min · ${spindleRpm} RPM · ${feedRate} mm/min feed. Full analyzer needed for safe price and tooling buffers.`,
        ["Tooling cost", "Machine rate", "Risk margin"]
      );
    }

    return buildGenericResult(
      "LOW",
      "Visible risk looks limited.",
      `Quick estimate ~${totalMinutes.toFixed(0)} min · ${spindleRpm} RPM · ${feedRate} mm/min feed. Use the analyzer before high-pressure quotes.`,
      ["Tooling cost", "Machine rate", "Risk margin"]
    );
  }

  if (tool.sector === "construction") {
    const originalBudget = getNumber(values, "originalBudget");
    const changeEstimate = getNumber(values, "changeEstimate");
    const deadlinePressure = getString(values, "deadlinePressure") || "low";

    if (originalBudget <= 0) {
      return buildGenericResult(
        "MEDIUM",
        "Original budget required.",
        "Enter a valid original project budget to assess change-order risk.",
        ["Delay days", "Crew cost per day", "Target margin"]
      );
    }

    const wastePct = changeOrderWastePercent(deadlinePressure);
    const adjustedChange = changeEstimate * (1 + wastePct / 100);
    const ratio = adjustedChange / originalBudget;

    if (ratio >= 0.15) {
      return buildGenericResult(
        "HIGH",
        "This change may erase project margin.",
        `RSMeans-style waste factor ${wastePct}% raises visible change exposure to ${adjustedChange.toFixed(0)} (${(ratio * 100).toFixed(1)}% of budget).`,
        ["Delay days", "Crew cost per day", "Target margin"]
      );
    }

    if (ratio >= 0.05) {
      return buildGenericResult(
        "MEDIUM",
        "This change deserves a margin check.",
        `Adjusted change cost ${adjustedChange.toFixed(0)} (${wastePct}% field waste) — delay and crew cost can shift the decision.`,
        ["Delay days", "Crew cost per day", "Target margin"]
      );
    }

    return buildGenericResult(
      "LOW",
      "Visible change exposure is moderate.",
      `Adjusted change ${adjustedChange.toFixed(0)} with ${wastePct}% waste factor — within typical tolerance.`,
      ["Delay days", "Crew cost per day", "Target margin"]
    );
  }

  if (tool.sector === "cleaning") {
    return mapSectorFreeSignal(
      calculateCleaningFreeResult({
        areaSize: getNumber(values, "areaSize"),
        staffCount: getNumber(values, "staffCount"),
        visitFrequency: getNumber(values, "visitFrequency"),
      }),
      ["Labor rate", "Hours per visit", "Supply cost", "Target margin"]
    );
  }

  if (tool.sector === "restaurant") {
    return mapSectorFreeSignal(
      calculateRestaurantFreeResult({
        menuPrice: getNumber(values, "menuPrice"),
        foodCost: getNumber(values, "foodCost"),
        deliveryCommission: getNumber(values, "deliveryCommission"),
      }),
      [
        "Waste rate",
        "Delivery commission",
        "Labor cost per item",
        "Target margin",
      ]
    );
  }

  if (tool.sector === "ecommerce") {
    return mapSectorFreeSignal(
      calculateEcommerceFreeResult({
        productPrice: getNumber(values, "productPrice"),
        productCost: getNumber(values, "productCost"),
        returnRate: getNumber(values, "returnRate"),
      }),
      ["Shipping cost", "Payment fee", "Ad cost per sale", "Product cost"]
    );
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
