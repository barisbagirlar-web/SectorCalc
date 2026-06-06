import type { RevenueTool } from "@/lib/tools/revenue-tools";
import type {
  PremiumSeverity,
  PremiumToolInputValues,
  PremiumToolResult,
} from "@/lib/tools/premium-tool-results";

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
    return "$0.00";
  }
  return `$${Math.max(0, value).toFixed(2)}`;
}

function marginFromPrice(price: number, cost: number): number {
  if (price <= 0) {
    return 0;
  }
  return ((price - cost) / price) * 100;
}

function clampMargin(targetMargin: number): number {
  return Math.min(95, Math.max(0, targetMargin));
}

function minimumPrice(baseCost: number, targetMargin: number): number {
  const margin = clampMargin(targetMargin);
  if (margin >= 100) {
    return baseCost;
  }
  return baseCost / (1 - margin / 100);
}

const EXTENDED_SECTORS = new Set([
  "welding-fabrication",
  "hvac",
  "electrical-contracting",
  "landscaping-lawn-care",
  "auto-repair-shop",
  "printing-signage",
  "plumbing",
  "carpentry-millwork",
  "roofing",
  "painting",
  "sheet-metal",
  "3d-printing-service",
]);

export function isExtendedPremiumSector(sector: string): boolean {
  return EXTENDED_SECTORS.has(sector);
}

export function calculateExtendedPremiumResult(
  tool: RevenueTool,
  values: PremiumToolInputValues
): PremiumToolResult | null {
  if (!EXTENDED_SECTORS.has(tool.sector)) {
    return null;
  }

  const targetMargin = clampMargin(getNumber(values, "targetMargin"));

  if (tool.sector === "welding-fabrication") {
    const laborRate = getNumber(values, "laborRate");
    const laborCost = getNumber(values, "laborHours") * laborRate;
    const fitUpCost = getNumber(values, "fitUpHours") * laborRate;
    const baseCost =
      getNumber(values, "materialCost") +
      laborCost +
      getNumber(values, "gasConsumableCost") +
      fitUpCost;
    const riskAdjusted = baseCost * (1 + getNumber(values, "reworkRiskPercent") / 100);
    const minimumSafeBid = minimumPrice(riskAdjusted, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "reworkRiskPercent") >= 20 ? "danger" : getNumber(values, "reworkRiskPercent") >= 10 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "UNDERPRICED"
          : severity === "watch"
            ? "REPRICE REQUIRED"
            : "SAFE BID",
      headline: "Minimum safe bid calculated.",
      primaryMetricLabel: "Minimum safe bid",
      primaryMetricValue: money(minimumSafeBid),
      riskDrivers: ["Material cost", "Fit-up hours", "Rework risk", "Target margin"],
      suggestedAction: `Quote at or above ${money(minimumSafeBid)} or separate rework allowance.`,
      severity,
    };
  }

  if (tool.sector === "hvac") {
    const laborCost = getNumber(values, "laborHours") * getNumber(values, "laborRate");
    const baseCost =
      getNumber(values, "equipmentCost") +
      getNumber(values, "ductworkCost") +
      laborCost +
      getNumber(values, "commissioningCost");
    const riskAdjusted = baseCost * (1 + getNumber(values, "callbackRiskPercent") / 100);
    const minimumProjectPrice = minimumPrice(riskAdjusted, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "callbackRiskPercent") >= 15 ? "danger" : getNumber(values, "callbackRiskPercent") >= 8 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "MARGIN AT RISK"
          : severity === "watch"
            ? "RENEGOTIATE"
            : "SAFE PROJECT",
      headline: "Minimum project price calculated.",
      primaryMetricLabel: "Minimum project price",
      primaryMetricValue: money(minimumProjectPrice),
      riskDrivers: ["Equipment cost", "Ductwork", "Callback risk", "Target margin"],
      suggestedAction: `Keep project price above ${money(minimumProjectPrice)} or add callback buffer.`,
      severity,
    };
  }

  if (tool.sector === "electrical-contracting") {
    const laborRate = getNumber(values, "laborRate");
    const laborCost = getNumber(values, "laborHours") * laborRate;
    const testingCost = getNumber(values, "testingHours") * laborRate;
    const baseCost = getNumber(values, "materialCost") + laborCost + testingCost;
    const riskAdjusted = baseCost * (1 + getNumber(values, "inspectionRiskPercent") / 100);
    const safePanelBid = minimumPrice(riskAdjusted, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "inspectionRiskPercent") >= 15 ? "danger" : getNumber(values, "inspectionRiskPercent") >= 8 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "INSPECTION RISK"
          : severity === "watch"
            ? "REPRICE REQUIRED"
            : "SAFE BID",
      headline: "Safe panel bid calculated.",
      primaryMetricLabel: "Safe panel bid",
      primaryMetricValue: money(safePanelBid),
      riskDrivers: ["Material cost", "Testing hours", "Inspection risk", "Target margin"],
      suggestedAction: `Bid at or above ${money(safePanelBid)} with inspection contingency.`,
      severity,
    };
  }

  if (tool.sector === "landscaping-lawn-care") {
    const visits = getNumber(values, "visitsPerMonth");
    const laborCost =
      getNumber(values, "crewHoursPerVisit") *
      getNumber(values, "laborRate") *
      visits;
    const monthlyCost =
      laborCost +
      getNumber(values, "fuelCostPerVisit") * visits +
      getNumber(values, "supplyCostPerMonth") +
      getNumber(values, "equipmentWearCost");
    const minimumMonthlyPrice = minimumPrice(monthlyCost, targetMargin);
    const severity: PremiumSeverity =
      targetMargin < 15 ? "danger" : targetMargin < 22 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "UNDERPRICED MONTHLY"
          : severity === "watch"
            ? "LOW MARGIN"
            : "SAFE CONTRACT",
      headline: "Minimum monthly price calculated.",
      primaryMetricLabel: "Minimum monthly price",
      primaryMetricValue: money(minimumMonthlyPrice),
      riskDrivers: ["Crew hours", "Fuel cost", "Equipment wear", "Target margin"],
      suggestedAction: `Keep monthly contract above ${money(minimumMonthlyPrice)} or reduce visit scope.`,
      severity,
    };
  }

  if (tool.sector === "auto-repair-shop") {
    const laborRate = getNumber(values, "laborRate");
    const laborCost =
      (getNumber(values, "diagnosticHours") + getNumber(values, "repairHours")) * laborRate;
    const partsWithMarkup =
      getNumber(values, "partsCost") * (1 + getNumber(values, "partsMarkupPercent") / 100);
    const trueCost = laborCost + partsWithMarkup;
    const riskCost = trueCost * (1 + getNumber(values, "comebackRiskPercent") / 100);
    const trueJobProfit = getNumber(values, "quotedPrice") - riskCost;
    const marginPct = marginFromPrice(getNumber(values, "quotedPrice"), riskCost);
    const severity: PremiumSeverity =
      trueJobProfit < 0 ? "danger" : marginPct < 15 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "LEAKING PROFIT"
          : severity === "watch"
            ? "LOW MARGIN"
            : "PROFITABLE",
      headline: "True job profit calculated.",
      primaryMetricLabel: "True job profit",
      primaryMetricValue: money(trueJobProfit),
      riskDrivers: ["Diagnostic hours", "Parts markup", "Comeback risk", "Quoted price"],
      suggestedAction:
        severity === "safe"
          ? "Monitor comeback rate on similar jobs."
          : `Raise quoted price or reduce comeback exposure — target profit above ${money(riskCost * 0.2)}.`,
      severity,
    };
  }

  if (tool.sector === "printing-signage") {
    const laborRate = getNumber(values, "laborRate");
    const baseCost =
      getNumber(values, "materialCost") +
      getNumber(values, "inkCost") +
      getNumber(values, "designHours") * laborRate +
      getNumber(values, "installHours") * laborRate;
    const riskAdjusted = baseCost * (1 + getNumber(values, "reprintRiskPercent") / 100);
    const minimumSafePrice = minimumPrice(riskAdjusted, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "reprintRiskPercent") >= 12 ? "danger" : getNumber(values, "reprintRiskPercent") >= 6 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "REPRINT RISK"
          : severity === "watch"
            ? "REPRICE REQUIRED"
            : "SAFE PRICE",
      headline: "Minimum safe price calculated.",
      primaryMetricLabel: "Minimum safe price",
      primaryMetricValue: money(minimumSafePrice),
      riskDrivers: ["Design hours", "Install hours", "Reprint risk", "Target margin"],
      suggestedAction: `Quote at or above ${money(minimumSafePrice)} with reprint buffer.`,
      severity,
    };
  }

  if (tool.sector === "plumbing") {
    const laborCost = getNumber(values, "laborHours") * getNumber(values, "laborRate");
    const baseCost =
      getNumber(values, "partsCost") +
      laborCost +
      getNumber(values, "materialRunCost") +
      getNumber(values, "fixtureCount") * 25;
    const riskAdjusted = baseCost * (1 + getNumber(values, "callbackRiskPercent") / 100);
    const safeJobPrice = minimumPrice(riskAdjusted, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "callbackRiskPercent") >= 15 ? "danger" : getNumber(values, "callbackRiskPercent") >= 8 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "CALLBACK RISK"
          : severity === "watch"
            ? "REPRICE REQUIRED"
            : "SAFE JOB",
      headline: "Safe job price calculated.",
      primaryMetricLabel: "Safe job price",
      primaryMetricValue: money(safeJobPrice),
      riskDrivers: ["Parts cost", "Fixture count", "Callback risk", "Target margin"],
      suggestedAction: `Price the job at or above ${money(safeJobPrice)}.`,
      severity,
    };
  }

  if (tool.sector === "carpentry-millwork") {
    const laborRate = getNumber(values, "laborRate");
    const materialWithWaste =
      getNumber(values, "sheetMaterialCost") *
      (1 + getNumber(values, "wasteRatePercent") / 100);
    const baseCost =
      materialWithWaste +
      getNumber(values, "laborHours") * laborRate +
      getNumber(values, "finishingCost") +
      getNumber(values, "installHours") * laborRate;
    const minimumMillworkBid = minimumPrice(baseCost, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "wasteRatePercent") >= 18 ? "danger" : getNumber(values, "wasteRatePercent") >= 10 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "REWORK RISK"
          : severity === "watch"
            ? "REPRICE REQUIRED"
            : "SAFE BID",
      headline: "Minimum millwork bid calculated.",
      primaryMetricLabel: "Minimum millwork bid",
      primaryMetricValue: money(minimumMillworkBid),
      riskDrivers: ["Sheet material", "Waste rate", "Finishing cost", "Target margin"],
      suggestedAction: `Bid at or above ${money(minimumMillworkBid)} with waste allowance.`,
      severity,
    };
  }

  if (tool.sector === "roofing") {
    const laborCost = getNumber(values, "laborHours") * getNumber(values, "laborRate");
    const baseCost =
      getNumber(values, "materialCost") +
      laborCost +
      getNumber(values, "tearOffCost") +
      getNumber(values, "dumpFees");
    const riskAdjusted = baseCost * (1 + getNumber(values, "weatherDelayRiskPercent") / 100);
    const minimumRoofingBid = minimumPrice(riskAdjusted, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "weatherDelayRiskPercent") >= 15 ? "danger" : getNumber(values, "weatherDelayRiskPercent") >= 8 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "WARRANTY RISK"
          : severity === "watch"
            ? "LOW MARGIN"
            : "SAFE BID",
      headline: "Minimum roofing bid calculated.",
      primaryMetricLabel: "Minimum roofing bid",
      primaryMetricValue: money(minimumRoofingBid),
      riskDrivers: ["Tear-off cost", "Dump fees", "Weather delay risk", "Target margin"],
      suggestedAction: `Bid at or above ${money(minimumRoofingBid)} with delay contingency.`,
      severity,
    };
  }

  if (tool.sector === "painting") {
    const laborRate = getNumber(values, "laborRate");
    const baseCost =
      getNumber(values, "paintCost") +
      getNumber(values, "prepHours") * laborRate +
      getNumber(values, "scaffoldCost");
    const riskAdjusted = baseCost * (1 + getNumber(values, "touchUpRiskPercent") / 100);
    const minimumPaintingPrice = minimumPrice(riskAdjusted, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "touchUpRiskPercent") >= 12 ? "danger" : getNumber(values, "touchUpRiskPercent") >= 6 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "PREP COST RISK"
          : severity === "watch"
            ? "REPRICE REQUIRED"
            : "SAFE PRICE",
      headline: "Minimum painting price calculated.",
      primaryMetricLabel: "Minimum painting price",
      primaryMetricValue: money(minimumPaintingPrice),
      riskDrivers: ["Prep hours", "Scaffold cost", "Touch-up risk", "Target margin"],
      suggestedAction: `Quote at or above ${money(minimumPaintingPrice)} for ${getNumber(values, "areaSize")} sq ft.`,
      severity,
    };
  }

  if (tool.sector === "sheet-metal") {
    const laborRate = getNumber(values, "laborRate");
    const totalMinutes =
      getNumber(values, "programmingTime") +
      getNumber(values, "setupTime") +
      getNumber(values, "cutTime") +
      getNumber(values, "bendCount") * 2;
    const laborCost = (totalMinutes / 60) * laborRate;
    const materialWithScrap =
      getNumber(values, "materialCost") *
      (1 + getNumber(values, "scrapRatePercent") / 100);
    const baseCost = laborCost + materialWithScrap + getNumber(values, "finishingCost");
    const safeSheetMetalQuote = minimumPrice(baseCost, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "scrapRatePercent") >= 12 ? "danger" : getNumber(values, "scrapRatePercent") >= 6 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "SCRAP RISK"
          : severity === "watch"
            ? "REPRICE REQUIRED"
            : "SAFE QUOTE",
      headline: "Safe sheet metal quote calculated.",
      primaryMetricLabel: "Safe sheet metal quote",
      primaryMetricValue: money(safeSheetMetalQuote),
      riskDrivers: ["Programming time", "Scrap rate", "Bend count", "Target margin"],
      suggestedAction: `Quote at or above ${money(safeSheetMetalQuote)} or add setup line item.`,
      severity,
    };
  }

  if (tool.sector === "3d-printing-service") {
    const baseCost =
      getNumber(values, "materialCost") +
      getNumber(values, "printHours") * getNumber(values, "machineRate") +
      getNumber(values, "postProcessHours") * getNumber(values, "laborRate");
    const riskAdjusted = baseCost * (1 + getNumber(values, "failRatePercent") / 100);
    const minimumPrintPrice = minimumPrice(riskAdjusted, targetMargin);
    const severity: PremiumSeverity =
      getNumber(values, "failRatePercent") >= 15 ? "danger" : getNumber(values, "failRatePercent") >= 8 ? "watch" : "safe";

    return {
      verdict:
        severity === "danger"
          ? "FAIL RATE RISK"
          : severity === "watch"
            ? "REPRICE REQUIRED"
            : "SAFE PRINT",
      headline: "Minimum print price calculated.",
      primaryMetricLabel: "Minimum print price",
      primaryMetricValue: money(minimumPrintPrice),
      riskDrivers: ["Print hours", "Fail rate", "Post-processing", "Target margin"],
      suggestedAction: `Price the job at or above ${money(minimumPrintPrice)} with fail buffer.`,
      severity,
    };
  }

  return null;
}
